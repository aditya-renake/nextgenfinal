/**
 * NexGen Careers - Comprehensive Admin Portal Engine
 * Powers authentication, student lead management, full quiz score analytics,
 * counselor notes, search/filtering, bulk operations, and data exports.
 */

(function () {
  'use strict';

  // State
  let allUsers = [];
  let filteredUsers = [];
  let selectedUserIds = new Set();
  let currentViewingUser = null;
  let activeViewMode = 'table'; // 'table' or 'cards'

  // Category mapping helper
  const CAT_NAMES = {
    eng: 'AI, Tech & Computer Engineering',
    med: 'Medicine, Surgery & Clinical Practice',
    law: 'Corporate Law, IPR & Public Policy',
    des: 'UI/UX, Product & Spatial Design',
    com: 'Chartered Accountancy & Finance',
    sci: 'Pure Sciences, Math & Deep Research',
    media: 'Digital Journalism, Media & Film',
    gov: 'Armed Forces & National Defence'
  };

  const CAT_ICONS = {
    eng: '🚀',
    med: '🩺',
    law: '⚖️',
    des: '🎨',
    com: '📈',
    sci: '🔬',
    media: '🎬',
    gov: '🎖️'
  };

  document.addEventListener('DOMContentLoaded', () => {
    initAdminPortal();
  });

  function initAdminPortal() {
    setupAuthListeners();
    checkAdminAuth();
  }

  // ================= 1. AUTHENTICATION CONTROLLER ================= //

  function checkAdminAuth() {
    const isAuth = UserStorage.isAdminAuthenticated();
    const authGate = document.getElementById('adminAuthGate');
    const dashboard = document.getElementById('adminDashboard');

    if (isAuth) {
      if (authGate) authGate.style.display = 'none';
      if (dashboard) dashboard.style.display = 'block';
      loadAdminDashboard();
    } else {
      if (authGate) authGate.style.display = 'flex';
      if (dashboard) dashboard.style.display = 'none';
    }
  }

  function setupAuthListeners() {
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmailInput')?.value.trim();
        const pass = document.getElementById('adminPassInput')?.value.trim();
        const remember = document.getElementById('adminRememberMe')?.checked ?? true;
        const errBox = document.getElementById('adminLoginError');

        const result = UserStorage.loginAdmin(email, pass, remember);
        if (result.success) {
          if (errBox) errBox.style.display = 'none';
          checkAdminAuth();
        } else {
          if (errBox) {
            errBox.textContent = result.message || 'Invalid credentials.';
            errBox.style.display = 'block';
          }
        }
      });
    }

    // Logout button
    const logoutBtn = document.getElementById('adminLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to sign out of the Admin Portal?')) {
          UserStorage.logoutAdmin();
          checkAdminAuth();
        }
      });
    }
  }

  // ================= 2. DASHBOARD & REAL-TIME DATA INITIALIZATION ================= //

  let lastKnownUserIds = new Set();
  let livePollInterval = null;

  function loadAdminDashboard() {
    allUsers = UserStorage.getUsers();
    lastKnownUserIds = new Set(allUsers.map(u => u.id));
    setupEventListeners();
    setupRealtimeListeners();
    applyFiltersAndRender();
  }

  function setupRealtimeListeners() {
    // Cross-tab storage event
    window.addEventListener('storage', (e) => {
      if (e.key === 'nexgen_registered_users') {
        handleIncomingRealtimeUpdate();
      }
    });

    // In-app custom event
    window.addEventListener('nexgen-users-updated', () => {
      handleIncomingRealtimeUpdate();
    });

    // 2.5 second polling fallback for active real-time updates
    if (livePollInterval) clearInterval(livePollInterval);
    livePollInterval = setInterval(() => {
      handleIncomingRealtimeUpdate();
    }, 2500);
  }

  function handleIncomingRealtimeUpdate() {
    const latestUsers = UserStorage.getUsers();
    
    // Check if new user arrived
    const newStudents = latestUsers.filter(u => !lastKnownUserIds.has(u.id));
    if (newStudents.length > 0) {
      newStudents.forEach(st => {
        showLiveToast(st);
      });
    }

    lastKnownUserIds = new Set(latestUsers.map(u => u.id));
    
    // Re-render if count or timestamps changed
    if (JSON.stringify(latestUsers) !== JSON.stringify(allUsers)) {
      allUsers = latestUsers;
      applyFiltersAndRender();
    }
  }

  function showLiveToast(student) {
    const toast = document.getElementById('adminLiveToast');
    const titleEl = document.getElementById('altTitle');
    const subEl = document.getElementById('altSub');
    if (!toast) return;

    if (titleEl) titleEl.textContent = `New Registration: ${student.name || 'Student'}`;
    if (subEl) subEl.textContent = `${student.stream || 'Class 12'} • ${student.topMatch || 'Compass Quiz Complete'}`;

    toast.style.display = 'flex';
    toast.classList.add('toast-slide-in');

    setTimeout(() => {
      toast.classList.remove('toast-slide-in');
      setTimeout(() => {
        toast.style.display = 'none';
      }, 300);
    }, 4500);
  }

  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => applyFiltersAndRender());
    }

    // Filter selects
    const streamFilter = document.getElementById('adminStreamFilter');
    const statusFilter = document.getElementById('adminStatusFilter');
    const careerFilter = document.getElementById('adminCareerFilter');
    const sortSelect = document.getElementById('adminSortSelect');

    [streamFilter, statusFilter, careerFilter, sortSelect].forEach(el => {
      if (el) el.addEventListener('change', () => applyFiltersAndRender());
    });

    // View switch (Table vs Cards)
    const btnViewTable = document.getElementById('btnViewTable');
    const btnViewCards = document.getElementById('btnViewCards');

    if (btnViewTable && btnViewCards) {
      btnViewTable.addEventListener('click', () => {
        activeViewMode = 'table';
        btnViewTable.classList.add('active');
        btnViewCards.classList.remove('active');
        renderStudentDirectory();
      });

      btnViewCards.addEventListener('click', () => {
        activeViewMode = 'cards';
        btnViewCards.classList.add('active');
        btnViewTable.classList.remove('active');
        renderStudentDirectory();
      });
    }

    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAllStudents');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          filteredUsers.forEach(u => selectedUserIds.add(u.id));
        } else {
          selectedUserIds.clear();
        }
        updateBulkToolbar();
        renderStudentDirectory();
      });
    }

    // Export buttons
    const exportCsvBtn = document.getElementById('adminExportCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        UserStorage.exportToCSV(filteredUsers.length ? filteredUsers : allUsers);
      });
    }

    const exportJsonBtn = document.getElementById('adminExportJsonBtn');
    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        UserStorage.exportToJSON(filteredUsers.length ? filteredUsers : allUsers);
      });
    }

    // Clear All Records button
    const clearAllBtn = document.getElementById('adminClearAllBtn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to permanently clear all student records from the database?')) {
          UserStorage.clearAll();
          selectedUserIds.clear();
          applyFiltersAndRender();
        }
      });
    }

    // Add Student Manually Modal Trigger
    const addStudentBtn = document.getElementById('adminAddStudentBtn');
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', () => openStudentFormModal(null));
    }

    // Form Modal Submit
    const studentEditForm = document.getElementById('studentEditForm');
    if (studentEditForm) {
      studentEditForm.addEventListener('submit', handleStudentFormSubmit);
    }
  }

  // ================= 3. FILTERING, SEARCHING & SORTING ================= //

  function applyFiltersAndRender() {
    allUsers = UserStorage.getUsers();

    const search = document.getElementById('adminSearchInput')?.value.trim().toLowerCase() || '';
    const stream = document.getElementById('adminStreamFilter')?.value || 'all';
    const status = document.getElementById('adminStatusFilter')?.value || 'all';
    const career = document.getElementById('adminCareerFilter')?.value || 'all';
    const sortBy = document.getElementById('adminSortSelect')?.value || 'newest';

    filteredUsers = allUsers.filter(u => {
      // Search across multiple fields
      if (search) {
        const matchesSearch = 
          (u.name && u.name.toLowerCase().includes(search)) ||
          (u.email && u.email.toLowerCase().includes(search)) ||
          (u.phone && u.phone.includes(search)) ||
          (u.city && u.city.toLowerCase().includes(search)) ||
          (u.id && u.id.toLowerCase().includes(search)) ||
          (u.topMatch && u.topMatch.toLowerCase().includes(search)) ||
          (u.notes && u.notes.toLowerCase().includes(search));

        if (!matchesSearch) return false;
      }

      // Stream filter
      if (stream !== 'all') {
        if (!u.stream || !u.stream.toLowerCase().includes(stream.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (status !== 'all') {
        if (!u.status || u.status.toLowerCase() !== status.toLowerCase()) {
          return false;
        }
      }

      // Career filter
      if (career !== 'all') {
        if (u.topMatchId !== career && (!u.topMatch || !u.topMatch.toLowerCase().includes(career.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    filteredUsers.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.registeredAt || 0) - new Date(a.registeredAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.registeredAt || 0) - new Date(b.registeredAt || 0);
      }
      if (sortBy === 'score_high') {
        return (b.scorePct || 0) - (a.scorePct || 0);
      }
      if (sortBy === 'score_low') {
        return (a.scorePct || 0) - (b.scorePct || 0);
      }
      if (sortBy === 'name_asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      return 0;
    });

    updateKPICards();
    updateBulkToolbar();
    renderStudentDirectory();
  }

  // ================= 4. KPI CARDS CALCULATION ================= //

  function updateKPICards() {
    const totalCount = allUsers.length;
    const newCount = allUsers.filter(u => !u.status || u.status === 'New').length;
    const inCounselingCount = allUsers.filter(u => u.status === 'Contacted' || u.status === 'Counseling Scheduled').length;
    const enrolledCount = allUsers.filter(u => u.status === 'Enrolled').length;

    // Average Score
    const totalScore = allUsers.reduce((sum, u) => sum + (u.scorePct || 85), 0);
    const avgScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;

    // Stream distribution
    const streamCounts = {};
    allUsers.forEach(u => {
      const s = (u.stream || 'Other').split('(')[0].trim();
      streamCounts[s] = (streamCounts[s] || 0) + 1;
    });
    let topStream = 'Science / PCM';
    let maxStreamCount = 0;
    Object.entries(streamCounts).forEach(([st, cnt]) => {
      if (cnt > maxStreamCount) {
        maxStreamCount = cnt;
        topStream = st;
      }
    });

    // Update DOM
    setText('kpiTotalStudents', totalCount);
    setText('kpiNewLeads', newCount);
    setText('kpiInCounseling', inCounselingCount);
    setText('kpiEnrolled', enrolledCount);
    setText('kpiAvgScore', `${avgScore}%`);
    setText('kpiTopStream', topStream);
    setText('adminResultCount', `${filteredUsers.length} of ${totalCount} students`);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // ================= 5. RENDER DIRECTORY (TABLE & CARDS) ================= //

  function renderStudentDirectory() {
    const tableContainer = document.getElementById('adminTableContainer');
    const cardsContainer = document.getElementById('adminCardsContainer');
    const emptyState = document.getElementById('adminEmptyState');
    const tbody = document.getElementById('adminTableBody');

    if (!filteredUsers.length) {
      if (tableContainer) tableContainer.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    if (activeViewMode === 'table') {
      if (tableContainer) tableContainer.style.display = 'block';
      if (cardsContainer) cardsContainer.style.display = 'none';
      renderTableView(tbody);
    } else {
      if (tableContainer) tableContainer.style.display = 'none';
      if (cardsContainer) cardsContainer.style.display = 'grid';
      renderCardsView(cardsContainer);
    }
  }

  function renderTableView(tbody) {
    if (!tbody) return;
    tbody.innerHTML = '';

    filteredUsers.forEach(u => {
      const isChecked = selectedUserIds.has(u.id);
      const icon = CAT_ICONS[u.topMatchId] || '🎯';
      const statusClass = getStatusClass(u.status);
      const dateFormatted = formatDate(u.registeredAt);

      const tr = document.createElement('tr');
      tr.className = isChecked ? 'row-selected' : '';
      tr.innerHTML = `
        <td class="col-check">
          <input type="checkbox" class="student-checkbox" data-id="${u.id}" ${isChecked ? 'checked' : ''}>
        </td>
        <td class="col-id">
          <span class="student-id-pill" onclick="window.viewUserWholeDetails('${u.id}')">${u.id}</span>
        </td>
        <td class="col-student">
          <div class="student-meta-cell">
            <div class="student-avatar-sm" onclick="window.viewUserWholeDetails('${u.id}')">${getInitials(u.name)}</div>
            <div>
              <a href="javascript:void(0)" class="student-name-link" onclick="window.viewUserWholeDetails('${u.id}')">${escapeHtml(u.name)}</a>
              <div class="student-contact-sub">
                <span>${escapeHtml(u.city || 'India')}</span>
                <span>•</span>
                <span class="time-sub">${dateFormatted}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="col-contact">
          <div class="contact-links-stack">
            <a href="mailto:${encodeURIComponent(u.email)}" class="contact-pill cp-email" title="Send Email">
              ✉️ ${escapeHtml(u.email)}
            </a>
            <div class="phone-wa-row">
              <a href="tel:${escapePhone(u.phone)}" class="contact-pill cp-phone" title="Call">
                📞 ${escapeHtml(u.phone || 'N/A')}
              </a>
              ${u.phone ? `
                <a href="https://wa.me/${cleanPhone(u.phone)}?text=${encodeURIComponent(`Hi ${u.name}, regarding your career report on NexGen Careers...`)}" target="_blank" class="contact-pill cp-wa" title="Chat on WhatsApp">
                  💬 WhatsApp
                </a>
              ` : ''}
            </div>
          </div>
        </td>
        <td class="col-stream">
          <span class="stream-badge">${escapeHtml(u.stream || 'Class 12')}</span>
        </td>
        <td class="col-match">
          <div class="match-cell">
            <span class="match-badge">
              <span>${icon}</span>
              <span>${escapeHtml(u.topMatch || 'General')}</span>
            </span>
            <div class="match-score-pill score-${getScoreGrade(u.scorePct)}">
              ${u.scorePct || 85}% Match
            </div>
          </div>
        </td>
        <td class="col-status">
          <select class="status-select ${statusClass}" onchange="window.handleStatusChange('${u.id}', this.value)">
            <option value="New" ${u.status === 'New' ? 'selected' : ''}>🟢 New</option>
            <option value="Contacted" ${u.status === 'Contacted' ? 'selected' : ''}>🔵 Contacted</option>
            <option value="Counseling Scheduled" ${u.status === 'Counseling Scheduled' ? 'selected' : ''}>🟡 Counseling Scheduled</option>
            <option value="Enrolled" ${u.status === 'Enrolled' ? 'selected' : ''}>🟣 Enrolled</option>
            <option value="Archived" ${u.status === 'Archived' ? 'selected' : ''}>⚪ Archived</option>
          </select>
        </td>
        <td class="col-actions">
          <div class="action-buttons-group">
            <button class="btn-action btn-view" title="View Whole Details" onclick="window.viewUserWholeDetails('${u.id}')">
              <span>👁️ Details</span>
            </button>
            <button class="btn-action btn-edit" title="Edit Student" onclick="window.openStudentFormModal('${u.id}')">
              <span>✏️</span>
            </button>
            <button class="btn-action btn-delete" title="Delete Student" onclick="window.deleteSingleStudent('${u.id}')">
              <span>🗑️</span>
            </button>
          </div>
        </td>
      `;

      // Checkbox event
      const cb = tr.querySelector('.student-checkbox');
      if (cb) {
        cb.addEventListener('change', (e) => {
          if (e.target.checked) {
            selectedUserIds.add(u.id);
            tr.classList.add('row-selected');
          } else {
            selectedUserIds.delete(u.id);
            tr.classList.remove('row-selected');
          }
          updateBulkToolbar();
        });
      }

      tbody.appendChild(tr);
    });
  }

  function renderCardsView(container) {
    if (!container) return;
    container.innerHTML = '';

    filteredUsers.forEach(u => {
      const isChecked = selectedUserIds.has(u.id);
      const icon = CAT_ICONS[u.topMatchId] || '🎯';
      const statusClass = getStatusClass(u.status);
      const dateFormatted = formatDate(u.registeredAt);

      const card = document.createElement('div');
      card.className = `student-grid-card ${isChecked ? 'card-selected' : ''}`;
      card.innerHTML = `
        <div class="card-head">
          <div class="card-head-left">
            <input type="checkbox" class="student-checkbox" data-id="${u.id}" ${isChecked ? 'checked' : ''}>
            <span class="student-id-pill" onclick="window.viewUserWholeDetails('${u.id}')">${u.id}</span>
          </div>
          <select class="status-select ${statusClass}" onchange="window.handleStatusChange('${u.id}', this.value)">
            <option value="New" ${u.status === 'New' ? 'selected' : ''}>🟢 New</option>
            <option value="Contacted" ${u.status === 'Contacted' ? 'selected' : ''}>🔵 Contacted</option>
            <option value="Counseling Scheduled" ${u.status === 'Counseling Scheduled' ? 'selected' : ''}>🟡 Scheduled</option>
            <option value="Enrolled" ${u.status === 'Enrolled' ? 'selected' : ''}>🟣 Enrolled</option>
            <option value="Archived" ${u.status === 'Archived' ? 'selected' : ''}>⚪ Archived</option>
          </select>
        </div>

        <div class="card-profile-row" onclick="window.viewUserWholeDetails('${u.id}')">
          <div class="student-avatar-md">${getInitials(u.name)}</div>
          <div>
            <h4 class="card-student-name">${escapeHtml(u.name)}</h4>
            <p class="card-location">${escapeHtml(u.city || 'India')} • <span class="card-stream-tag">${escapeHtml(u.stream || 'Class 12')}</span></p>
          </div>
        </div>

        <div class="card-match-banner" onclick="window.viewUserWholeDetails('${u.id}')">
          <div class="cmb-left">
            <span class="cmb-icon">${icon}</span>
            <div>
              <span class="cmb-label">Top Direction</span>
              <span class="cmb-val">${escapeHtml(u.topMatch || 'General')}</span>
            </div>
          </div>
          <div class="match-score-pill score-${getScoreGrade(u.scorePct)}">
            ${u.scorePct || 85}%
          </div>
        </div>

        <div class="card-contact-box">
          <div class="cc-item">
            <span>✉️</span>
            <a href="mailto:${encodeURIComponent(u.email)}">${escapeHtml(u.email)}</a>
          </div>
          <div class="cc-item">
            <span>📞</span>
            <a href="tel:${escapePhone(u.phone)}">${escapeHtml(u.phone || 'N/A')}</a>
          </div>
        </div>

        <div class="card-actions-footer">
          <button class="btn-primary btn-sm" onclick="window.viewUserWholeDetails('${u.id}')">
            <span>👁️ Whole Details</span>
          </button>
          <div class="card-secondary-btns">
            ${u.phone ? `
              <a href="https://wa.me/${cleanPhone(u.phone)}?text=${encodeURIComponent(`Hi ${u.name}, regarding your NexGen career report...`)}" target="_blank" class="btn-ghost btn-icon-only" title="WhatsApp">
                💬
              </a>
            ` : ''}
            <button class="btn-ghost btn-icon-only" title="Edit" onclick="window.openStudentFormModal('${u.id}')">
              ✏️
            </button>
            <button class="btn-ghost btn-icon-only" title="Delete" onclick="window.deleteSingleStudent('${u.id}')">
              🗑️
            </button>
          </div>
        </div>
      `;

      const cb = card.querySelector('.student-checkbox');
      if (cb) {
        cb.addEventListener('change', (e) => {
          if (e.target.checked) {
            selectedUserIds.add(u.id);
            card.classList.add('card-selected');
          } else {
            selectedUserIds.delete(u.id);
            card.classList.remove('card-selected');
          }
          updateBulkToolbar();
        });
      }

      container.appendChild(card);
    });
  }

  // ================= 6. BULK ACTIONS TOOLBAR ================= //

  function updateBulkToolbar() {
    const toolbar = document.getElementById('adminBulkToolbar');
    const countEl = document.getElementById('bulkSelectedCount');
    const selectAllCb = document.getElementById('selectAllStudents');

    const count = selectedUserIds.size;
    if (countEl) countEl.textContent = count;

    if (toolbar) {
      toolbar.style.display = count > 0 ? 'flex' : 'none';
    }

    if (selectAllCb) {
      selectAllCb.checked = filteredUsers.length > 0 && count === filteredUsers.length;
      selectAllCb.indeterminate = count > 0 && count < filteredUsers.length;
    }
  }

  window.handleBulkStatusChange = function (status) {
    if (!selectedUserIds.size) return;
    if (confirm(`Change status of ${selectedUserIds.size} student(s) to "${status}"?`)) {
      UserStorage.bulkUpdateStatus(Array.from(selectedUserIds), status);
      selectedUserIds.clear();
      applyFiltersAndRender();
    }
  };

  window.handleBulkDelete = function () {
    if (!selectedUserIds.size) return;
    if (confirm(`Are you sure you want to delete ${selectedUserIds.size} selected student records permanently?`)) {
      UserStorage.deleteMultipleUsers(Array.from(selectedUserIds));
      selectedUserIds.clear();
      applyFiltersAndRender();
    }
  };

  window.clearBulkSelection = function () {
    selectedUserIds.clear();
    updateBulkToolbar();
    renderStudentDirectory();
  };

  // ================= 7. STATUS & SINGLE DELETE ACTIONS ================= //

  window.handleStatusChange = function (id, newStatus) {
    UserStorage.updateUser(id, { status: newStatus });
    applyFiltersAndRender();
  };

  window.deleteSingleStudent = function (id) {
    const student = UserStorage.getUserById(id);
    if (!student) return;
    if (confirm(`Are you sure you want to delete "${student.name}" (${id})?`)) {
      UserStorage.deleteUser(id);
      selectedUserIds.delete(id);
      applyFiltersAndRender();
    }
  };

  // ================= 8. WHOLE USER DETAILS MODAL (CORE FEATURE) ================= //

  window.viewUserWholeDetails = function (id) {
    const user = UserStorage.getUserById(id);
    if (!user) {
      alert('User record not found.');
      return;
    }

    currentViewingUser = user;
    const modal = document.getElementById('wholeDetailsModal');
    if (!modal) return;

    // Fill Header & Identity
    setText('wdName', user.name || 'Anonymous Student');
    setText('wdId', user.id);
    setText('wdAvatar', getInitials(user.name));
    setText('wdStream', user.stream || 'Class 12 Pass / Appearing');
    setText('wdCity', user.city || 'India');
    setText('wdRegDate', formatDateFull(user.registeredAt));
    setText('wdLastActive', formatDateFull(user.lastActive || user.registeredAt));
    setText('wdPasscode', user.passcode || user.password || 'N/A');
    setText('wdStatusBadge', user.status || 'New');

    const statusBadgeEl = document.getElementById('wdStatusBadge');
    if (statusBadgeEl) {
      statusBadgeEl.className = `status-badge ${getStatusClass(user.status)}`;
    }

    // Direct Contact Actions
    const emailLink = document.getElementById('wdEmailLink');
    if (emailLink) {
      emailLink.href = `mailto:${encodeURIComponent(user.email)}`;
      emailLink.textContent = user.email || 'No email provided';
    }

    const phoneLink = document.getElementById('wdPhoneLink');
    if (phoneLink) {
      phoneLink.href = `tel:${escapePhone(user.phone)}`;
      phoneLink.textContent = user.phone || 'No phone provided';
    }

    const waBtn = document.getElementById('wdWaBtn');
    if (waBtn) {
      if (user.phone) {
        waBtn.href = `https://wa.me/${cleanPhone(user.phone)}?text=${encodeURIComponent(`Hi ${user.name}, this is your NexGen Career Counselor regarding your profile (${user.id})...`)}`;
        waBtn.style.display = 'inline-flex';
      } else {
        waBtn.style.display = 'none';
      }
    }

    // Academic & Aspirations
    setText('wdTargetExams', user.targetExams || 'JEE, NEET, CUET, CLAT or Equivalent');
    setText('wdTargetColleges', user.targetColleges || 'Top National & State Universities');

    // Top Match & Scores
    const icon = CAT_ICONS[user.topMatchId] || '🎯';
    setText('wdTopMatchIcon', icon);
    setText('wdTopMatchTitle', user.topMatch || 'General Career Direction');
    setText('wdTopMatchPct', `${user.scorePct || 85}%`);

    // Render Full 8-Category Compass Affinity Breakdown
    renderModalScoreBreakdown(user);

    // Counselor Notes & Status Form
    const statusSelect = document.getElementById('wdStatusSelect');
    if (statusSelect) {
      statusSelect.value = user.status || 'New';
    }

    const notesTextarea = document.getElementById('wdCounselorNotes');
    if (notesTextarea) {
      notesTextarea.value = user.notes || '';
    }

    // Raw JSON Inspector
    const jsonPre = document.getElementById('wdJsonRaw');
    if (jsonPre) {
      jsonPre.textContent = JSON.stringify(user, null, 2);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function renderModalScoreBreakdown(user) {
    const list = document.getElementById('wdScoreBreakdownList');
    if (!list) return;
    list.innerHTML = '';

    const rawScores = user.scores || {};
    const maxMarksPerCat = 30; // 10 questions * 3 marks potential

    const categories = [
      { id: 'eng', name: 'AI, Tech & Computer Engineering', icon: '🚀' },
      { id: 'med', name: 'Medicine, Surgery & Clinical', icon: '🩺' },
      { id: 'law', name: 'Corporate Law & Public Policy', icon: '⚖️' },
      { id: 'des', name: 'UI/UX & Creative Product Design', icon: '🎨' },
      { id: 'com', name: 'Chartered Accountancy & Finance', icon: '📈' },
      { id: 'sci', name: 'Pure Sciences & Deep Research', icon: '🔬' },
      { id: 'media', name: 'Digital Journalism & Film Media', icon: '🎬' },
      { id: 'gov', name: 'National Defence & Civil Services', icon: '🎖️' }
    ];

    // Calculate score object
    const calculated = categories.map(cat => {
      const pts = rawScores[cat.id] || 0;
      const pct = Math.min(100, Math.round((pts / maxMarksPerCat) * 100));
      return { ...cat, pts, pct };
    }).sort((a, b) => b.pts - a.pts);

    calculated.forEach(cat => {
      const isTop = cat.id === user.topMatchId || cat.pts === calculated[0].pts;
      const row = document.createElement('div');
      row.className = `score-breakdown-row ${isTop ? 'highlight-top' : ''}`;
      row.innerHTML = `
        <div class="sbr-head">
          <div class="sbr-name">
            <span class="sbr-icon">${cat.icon}</span>
            <span>${escapeHtml(cat.name)}</span>
            ${isTop ? '<span class="sbr-top-badge">PRIMARY MATCH</span>' : ''}
          </div>
          <div class="sbr-stats">
            <span class="sbr-pts">${cat.pts} pts</span>
            <span class="sbr-pct">${cat.pct}%</span>
          </div>
        </div>
        <div class="sbr-track">
          <div class="sbr-fill ${isTop ? 'fill-gold' : 'fill-cyan'}" style="width: ${cat.pct}%"></div>
        </div>
      `;
      list.appendChild(row);
    });
  }

  window.saveModalCounselorNotes = function () {
    if (!currentViewingUser) return;
    const statusSelect = document.getElementById('wdStatusSelect');
    const notesTextarea = document.getElementById('wdCounselorNotes');
    const saveNotice = document.getElementById('wdSaveNotice');

    const newStatus = statusSelect?.value || currentViewingUser.status;
    const newNotes = notesTextarea?.value || '';

    const updated = UserStorage.updateUser(currentViewingUser.id, {
      status: newStatus,
      notes: newNotes
    });

    if (updated) {
      currentViewingUser = updated;
      setText('wdStatusBadge', updated.status);
      const statusBadgeEl = document.getElementById('wdStatusBadge');
      if (statusBadgeEl) {
        statusBadgeEl.className = `status-badge ${getStatusClass(updated.status)}`;
      }

      if (saveNotice) {
        saveNotice.style.display = 'block';
        setTimeout(() => {
          saveNotice.style.display = 'none';
        }, 3000);
      }

      applyFiltersAndRender();
    }
  };

  window.downloadModalUserReport = function () {
    if (!currentViewingUser) return;
    const u = currentViewingUser;
    const reportText = `
===================================================================
             NEXGEN CAREERS - FULL STUDENT DOSSIER
===================================================================
Student ID         : ${u.id}
Full Name          : ${u.name}
Email Address      : ${u.email}
Phone / WhatsApp   : ${u.phone}
Current Stream     : ${u.stream}
Location           : ${u.city}
Registration Date  : ${u.registeredAt}
Last Activity      : ${u.lastActive || u.registeredAt}
Lead Status        : ${u.status}

-------------------------------------------------------------------
CAREER COMPASS EVALUATION
-------------------------------------------------------------------
Primary Recommended Path : ${u.topMatch}
Primary Affinity Score   : ${u.scorePct}%
Category ID Code         : ${u.topMatchId}

DETAILED CATEGORY SCORES:
${Object.entries(u.scores || {}).map(([k, v]) => `• ${(CAT_NAMES[k] || k).padEnd(40)} : ${v} points`).join('\n')}

-------------------------------------------------------------------
ACADEMIC ASPIRATIONS & TARGETS
-------------------------------------------------------------------
Target Entrance Exams    : ${u.targetExams || 'Not specified'}
Target Colleges / Univs  : ${u.targetColleges || 'Not specified'}

-------------------------------------------------------------------
ADMINISTRATIVE & COUNSELING NOTES
-------------------------------------------------------------------
${u.notes || 'No counseling notes logged yet.'}

===================================================================
Generated via NexGen Careers Admin Portal • Confidential Record
===================================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Dossier_${u.id}_${u.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  window.copyModalUserJson = function () {
    if (!currentViewingUser) return;
    const jsonStr = JSON.stringify(currentViewingUser, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert('Student JSON copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy to clipboard.');
    });
  };

  window.closeWholeDetailsModal = function () {
    const modal = document.getElementById('wholeDetailsModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentViewingUser = null;
  };

  // ================= 9. ADD / EDIT STUDENT MODAL ================= //

  let editingStudentId = null;

  window.openStudentFormModal = function (id) {
    editingStudentId = id;
    const modal = document.getElementById('studentFormModal');
    const titleEl = document.getElementById('studentFormTitle');
    const form = document.getElementById('studentEditForm');

    if (!modal || !form) return;

    if (id) {
      const student = UserStorage.getUserById(id);
      if (!student) return;
      if (titleEl) titleEl.textContent = `Edit Student (${student.id})`;
      setInputValue('editName', student.name);
      setInputValue('editEmail', student.email);
      setInputValue('editPhone', student.phone);
      setInputValue('editStream', student.stream);
      setInputValue('editCity', student.city);
      setInputValue('editStatus', student.status || 'New');
      setInputValue('editTopMatch', student.topMatchId || 'eng');
      setInputValue('editScorePct', student.scorePct || 90);
      setInputValue('editTargetExams', student.targetExams || '');
      setInputValue('editTargetColleges', student.targetColleges || '');
      setInputValue('editNotes', student.notes || '');
    } else {
      if (titleEl) titleEl.textContent = 'Add New Student Lead';
      form.reset();
      setInputValue('editStatus', 'New');
      setInputValue('editTopMatch', 'eng');
      setInputValue('editScorePct', 85);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeStudentFormModal = function () {
    const modal = document.getElementById('studentFormModal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    editingStudentId = null;
  };

  function handleStudentFormSubmit(e) {
    e.preventDefault();
    const name = getInputValue('editName').trim();
    const email = getInputValue('editEmail').trim().toLowerCase();
    const phone = getInputValue('editPhone').trim();
    const stream = getInputValue('editStream');
    const city = getInputValue('editCity').trim() || 'India';
    const status = getInputValue('editStatus') || 'New';
    const topMatchId = getInputValue('editTopMatch') || 'eng';
    const scorePct = parseInt(getInputValue('editScorePct'), 10) || 85;
    const targetExams = getInputValue('editTargetExams').trim();
    const targetColleges = getInputValue('editTargetColleges').trim();
    const notes = getInputValue('editNotes').trim();

    if (!name || !email) {
      alert('Name and Email are required.');
      return;
    }

    const topMatchName = CAT_NAMES[topMatchId] || 'General Career Direction';

    if (editingStudentId) {
      // Update
      UserStorage.updateUser(editingStudentId, {
        name,
        email,
        phone,
        stream,
        city,
        status,
        topMatch: topMatchName,
        topMatchId,
        scorePct,
        targetExams,
        targetColleges,
        notes
      });
    } else {
      // Create new
      UserStorage.addUser({
        name,
        email,
        phone,
        stream,
        city,
        status,
        topMatch: topMatchName,
        topMatchId,
        scorePct,
        targetExams,
        targetColleges,
        notes
      });
    }

    closeStudentFormModal();
    applyFiltersAndRender();
  }

  function getInputValue(id) {
    return document.getElementById(id)?.value || '';
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  // ================= 10. UTILITIES ================= //

  function getInitials(name) {
    if (!name) return 'NX';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getStatusClass(status) {
    switch (status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'Counseling Scheduled': return 'status-scheduled';
      case 'Enrolled': return 'status-enrolled';
      case 'Archived': return 'status-archived';
      default: return 'status-new';
    }
  }

  function getScoreGrade(pct) {
    if (pct >= 90) return 'high';
    if (pct >= 75) return 'med';
    return 'normal';
  }

  function formatDate(iso) {
    if (!iso) return 'Just now';
    try {
      const d = new Date(iso);
      const now = new Date();
      const diffMs = now - d;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 45) return '⚡ Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Just now';
    }
  }

  function formatDateFull(iso) {
    if (!iso) return 'Just now';
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return iso;
    }
  }

  function cleanPhone(phone) {
    return (phone || '').replace(/[^0-9]/g, '');
  }

  function escapePhone(phone) {
    return (phone || '').replace(/[^\d+]/g, '');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();
