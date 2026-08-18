/**
 * Compass Application Logic
 * Interactive quiz, dynamic SVG compass dial, career filters, and FAQ interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initMobileNav();
  initCompassVisuals();
  initCourseBranches();
  initExplorer();
  initTimelineCalendar();
  initFAQ();
  initScrollReveal();
  initAuthUI();
}

window.filterByCareerTag = function(catId) {
  setActiveFilter(catId);
  const target = document.getElementById('branches') || document.getElementById('explorer');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/* ============ MOBILE NAVIGATION ============ */
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-deep)';
        navLinks.style.padding = '20px 28px';
        navLinks.style.borderBottom = '1px solid var(--line)';
        navLinks.style.gap = '16px';
      }
    });

    // Close mobile nav on click of link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}

/* ============ COMPASS RENDER ============ */
function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function renderCompass(ticksId, labelsId) {
  const ticks = document.getElementById(ticksId);
  const labels = document.getElementById(labelsId);
  if (!ticks || !labels) return;

  ticks.innerHTML = '';
  labels.innerHTML = '';

  CATS.forEach(cat => {
    // Tick lines
    const p1 = polar(200, 200, 150, cat.angle);
    const p2 = polar(200, 200, 140, cat.angle);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    line.setAttribute('stroke', '#3A4670');
    line.setAttribute('stroke-width', '1.4');
    ticks.appendChild(line);

    // Compass category labels
    const lp = polar(200, 200, 168, cat.angle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lp.x);
    text.setAttribute('y', lp.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('class', 'compass-label');
    text.setAttribute('data-cat', cat.id);
    text.textContent = cat.short;
    labels.appendChild(text);
  });
}

function initCompassVisuals() {
  renderCompass('heroTicks', 'heroLabels');
  renderCompass('resultTicks', 'resultLabels');
}

/* ============ QUIZ LOGIC ============ */
let currentQ = 0;
let answers = new Array(QUESTIONS.length).fill(null);

window.startQuiz = function () {
  const intro = document.getElementById('quizIntro');
  const results = document.getElementById('quizResults');
  const questions = document.getElementById('quizQuestions');

  if (intro) intro.classList.remove('active');
  if (results) results.classList.remove('active');
  if (questions) questions.classList.add('active');

  currentQ = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  renderQuestion();
};

window.restartQuiz = function () {
  answers = new Array(QUESTIONS.length).fill(null);
  currentQ = 0;

  const intro = document.getElementById('quizIntro');
  const results = document.getElementById('quizResults');
  const questions = document.getElementById('quizQuestions');

  if (results) results.classList.remove('active');
  if (questions) questions.classList.remove('active');
  if (intro) intro.classList.add('active');
};

function renderQuestion() {
  const total = QUESTIONS.length;
  const quizCount = document.getElementById('quizCount');
  const quizBarFill = document.getElementById('quizBarFill');
  const quizQ = document.getElementById('quizQ');
  const optsWrap = document.getElementById('quizOptions');
  const backBtn = document.getElementById('quizBackBtn');

  if (quizCount) quizCount.textContent = `Q ${String(currentQ + 1).padStart(2, '0')} / ${total}`;
  if (quizBarFill) quizBarFill.style.width = `${(currentQ / total) * 100}%`;

  const data = QUESTIONS[currentQ];
  if (quizQ) quizQ.textContent = data.q;

  if (optsWrap) {
    optsWrap.innerHTML = '';
    data.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt.t;
      if (answers[currentQ] === i) btn.classList.add('chosen');
      btn.onclick = () => selectOption(i);
      optsWrap.appendChild(btn);
    });
  }

  if (backBtn) backBtn.disabled = currentQ === 0;
}

function selectOption(i) {
  answers[currentQ] = i;
  setTimeout(() => {
    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      showResults();
    }
  }, 220);
}

window.goBack = function () {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
};

function showResults() {
  const quizBarFill = document.getElementById('quizBarFill');
  if (quizBarFill) quizBarFill.style.width = `100%`;

  const scores = {};
  CATS.forEach(c => (scores[c.id] = 0));
  const maxPer = {};
  CATS.forEach(c => (maxPer[c.id] = 0));

  QUESTIONS.forEach((q, qi) => {
    q.opts.forEach(o => (maxPer[o.c] += 3));
    const chosenIdx = answers[qi];
    if (chosenIdx !== null) {
      scores[q.opts[chosenIdx].c] += 3;
    }
  });

  const ranked = CATS.map(c => ({
    ...c,
    score: scores[c.id],
    pct: Math.round((scores[c.id] / maxPer[c.id]) * 100)
  })).sort((a, b) => b.score - a.score);

    const top = ranked[0];
    latestQuizSnapshot = {
      topCategory: top,
      ranked: ranked,
      scores: scores
    };

    // Auto-sync if student is logged in
    if (typeof UserStorage !== 'undefined' && UserStorage.getCurrentUser()) {
      UserStorage.syncQuizResult(latestQuizSnapshot);
    }

    const questionsEl = document.getElementById('quizQuestions');
    const resultsEl = document.getElementById('quizResults');
    if (questionsEl) questionsEl.classList.remove('active');
    if (resultsEl) resultsEl.classList.add('active');

    const titleEl = document.getElementById('resultTitle');
    const subEl = document.getElementById('resultSub');
    if (titleEl) titleEl.textContent = top.name;
    if (subEl) {
      subEl.textContent = `Your answers point most strongly toward ${top.name.toLowerCase()} — here's the full breakdown, plus matching roadmaps below.`;
    }

    const resultNeedle = document.getElementById('resultNeedle');
    if (resultNeedle) {
      resultNeedle.setAttribute('transform', `rotate(${top.angle})`);
    }

    document.querySelectorAll('#resultLabels .compass-label').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-cat') === top.id);
    });

    const scoreList = document.getElementById('scoreList');
    if (scoreList) {
      scoreList.innerHTML = '';
      ranked.forEach(c => {
        const row = document.createElement('div');
        row.className = 'score-row';
        row.innerHTML = `
          <div class="score-name">${c.name}</div>
          <div class="score-track"><div class="score-fill" style="width:0%" data-target="${c.pct}"></div></div>
          <div class="score-pct">${c.pct}%</div>
        `;
        scoreList.appendChild(row);
      });

      requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelectorAll('.score-fill').forEach(f => {
            f.style.width = f.dataset.target + '%';
          });
        }, 80);
      });
    }

    // Prefill lead capture form if user is logged in
    prefillLeadFormWithCurrentUser();

    const matchBtn = document.getElementById('exploreMatchBtn');
    if (matchBtn) {
      matchBtn.onclick = () => {
        setActiveFilter(top.id);
      };
    }
  }

  let latestQuizSnapshot = null;
  let registeredStudentData = null;

  function prefillLeadFormWithCurrentUser() {
    if (typeof UserStorage === 'undefined') return;
    const currentUser = UserStorage.getCurrentUser();
    if (!currentUser) return;

    const nameInp = document.getElementById('regName');
    const emailInp = document.getElementById('regEmail');
    const phoneInp = document.getElementById('regPhone');
    const streamInp = document.getElementById('regStream');
    const cityInp = document.getElementById('regCity');

    if (nameInp && !nameInp.value) nameInp.value = currentUser.name || '';
    if (emailInp && !emailInp.value) emailInp.value = currentUser.email || '';
    if (phoneInp && !phoneInp.value) phoneInp.value = currentUser.phone || '';
    if (streamInp && !streamInp.value && currentUser.stream) streamInp.value = currentUser.stream;
    if (cityInp && !cityInp.value) cityInp.value = currentUser.city || '';
  }

  window.handleUserRegistration = function (e) {
    e.preventDefault();
    const name = document.getElementById('regName')?.value.trim();
    const phone = document.getElementById('regPhone')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const stream = document.getElementById('regStream')?.value;
    const city = document.getElementById('regCity')?.value.trim() || 'India';

    if (!name || !email || !phone || !stream) {
      alert('Please fill out all required registration fields.');
      return;
    }

    const topCat = latestQuizSnapshot?.topCategory || { name: 'Engineering & Tech', id: 'eng', pct: 85 };
    
    const userPayload = {
      name,
      phone,
      email,
      stream,
      city,
      topMatch: topCat.name,
      topMatchId: topCat.id,
      scorePct: topCat.pct || 90,
      scores: latestQuizSnapshot?.scores || {}
    };

    let createdUser = null;
    if (typeof UserStorage !== 'undefined') {
      createdUser = UserStorage.addUser(userPayload);
      if (!UserStorage.getCurrentUser()) {
        UserStorage.setCurrentUser(createdUser);
      }
    }

    registeredStudentData = createdUser || userPayload;

    // Show success UI
    const form = document.getElementById('leadRegisterForm');
    const successBox = document.getElementById('lccSuccess');
    const idEl = document.getElementById('lccId');

    if (form) form.style.display = 'none';
    if (successBox) successBox.style.display = 'block';
    if (idEl && createdUser) idEl.textContent = createdUser.id;
  };

  window.downloadStudentReport = function () {
    if (!registeredStudentData) {
      alert('No registration data available to download.');
      return;
    }
    const student = registeredStudentData;
    const reportText = `
=====================================================
         NEXGEN CAREERS - STUDENT ORIENTATION REPORT
=====================================================
Student Name       : ${student.name}
Registration ID    : ${student.id || 'NXG-TEMP'}
Current Stream     : ${student.stream}
Location           : ${student.city || 'India'}
Email              : ${student.email}
WhatsApp/Phone     : ${student.phone}
Date Generated     : ${new Date().toLocaleDateString()}

-----------------------------------------------------
TOP RECOMMENDED DIRECTION
-----------------------------------------------------
Primary Match      : ${student.topMatch}
Affinity Score     : ${student.scorePct}%

FULL COMPASS CATEGORY AFFINITY:
${(latestQuizSnapshot?.ranked || []).map(r => `• ${r.name.padEnd(35)} : ${r.pct}% (${r.score} pts)`).join('\n')}

-----------------------------------------------------
NEXT STEPS & ACTION PLAN
-----------------------------------------------------
1. Research recommended degree branches in your portal.
2. Track monthly exam deadlines on the interactive calendar.
3. Our senior counselor will connect with you on WhatsApp for 1-on-1 guidance.

Official Portal: https://nexgencareers.com
=====================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NexGen_Report_${student.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

/* ============ COURSE BRANCHES DIRECTORY (EXPANDABLE / SHRINKABLE) ============ */
let activeBranchFilter = 'all';
let branchSearchQuery = '';
let expandedBranchStreams = new Set(['eng', 'med']);

function initCourseBranches() {
  const chipsWrap = document.getElementById('branchesFilterChips');
  const searchInput = document.getElementById('branchSearchInput');

  if (!chipsWrap && !searchInput) return;

  renderBranchFilterChips();
  renderCourseBranches();

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      branchSearchQuery = e.target.value.trim().toLowerCase();
      // Auto-expand all streams when user searches
      if (branchSearchQuery) {
        COURSE_BRANCHES.forEach(s => expandedBranchStreams.add(s.id));
      }
      renderCourseBranches();
    });
  }
}

function renderBranchFilterChips() {
  const chipsWrap = document.getElementById('branchesFilterChips');
  if (!chipsWrap || typeof COURSE_BRANCHES === 'undefined') return;

  chipsWrap.innerHTML = '';
  
  const allBtn = document.createElement('button');
  allBtn.className = `chip ${activeBranchFilter === 'all' ? 'active' : ''}`;
  allBtn.textContent = 'All Streams';
  allBtn.onclick = () => {
    activeBranchFilter = 'all';
    document.querySelectorAll('#branchesFilterChips .chip').forEach(c => c.classList.remove('active'));
    allBtn.classList.add('active');
    renderCourseBranches();
  };
  chipsWrap.appendChild(allBtn);

  COURSE_BRANCHES.forEach(stream => {
    const btn = document.createElement('button');
    btn.className = `chip ${activeBranchFilter === stream.id ? 'active' : ''}`;
    btn.textContent = `${stream.icon} ${stream.name.split(',')[0]}`;
    btn.onclick = () => {
      activeBranchFilter = stream.id;
      document.querySelectorAll('#branchesFilterChips .chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      expandedBranchStreams.add(stream.id);
      renderCourseBranches();
    };
    chipsWrap.appendChild(btn);
  });
}

function renderCourseBranches() {
  const container = document.getElementById('branchesContainer');
  if (!container || typeof COURSE_BRANCHES === 'undefined') return;

  let streams = [...COURSE_BRANCHES];

  if (activeBranchFilter !== 'all') {
    streams = streams.filter(s => s.id === activeBranchFilter);
  }

  if (branchSearchQuery) {
    streams = streams.map(s => {
      const filteredBranches = s.branches.filter(b => {
        return (
          b.name.toLowerCase().includes(branchSearchQuery) ||
          b.specialisations.toLowerCase().includes(branchSearchQuery) ||
          b.scope.toLowerCase().includes(branchSearchQuery) ||
          b.topColleges.toLowerCase().includes(branchSearchQuery) ||
          s.name.toLowerCase().includes(branchSearchQuery)
        );
      });
      return { ...s, branches: filteredBranches };
    }).filter(s => s.branches.length > 0);
  }

  if (streams.length === 0) {
    container.innerHTML = `
      <div class="timeline-empty">
        <div class="empty-icon">🔍</div>
        <h3>No course branches found</h3>
        <p>No specialisations matched "${branchSearchQuery}". Try clearing search or selecting All Streams.</p>
        <button class="btn-ghost" onclick="resetBranchFilter()">Show All Streams</button>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  streams.forEach((stream, sIdx) => {
    const isExpanded = expandedBranchStreams.has(stream.id);
    const module = document.createElement('div');
    module.className = `branch-stream-module ${isExpanded ? 'is-open' : 'is-shrunk'}`;
    module.style.animationDelay = `${sIdx * 0.05}s`;

    const branchCardsHTML = stream.branches.map(b => {
      const examBadges = (b.exams || []).map(e => `<span class="bi-exam-pill">${e}</span>`).join('');
      return `
        <div class="branch-item-card">
          <div class="bi-head">
            <h4 class="bi-title">${b.name}</h4>
            <span class="bi-duration">${b.duration}</span>
          </div>
          
          <div class="bi-section">
            <span class="bi-label">Specialisations &amp; Focus:</span>
            <p class="bi-text bi-spec">${b.specialisations}</p>
          </div>

          <div class="bi-section">
            <span class="bi-label">Career Scope &amp; Job Roles:</span>
            <p class="bi-text">${b.scope}</p>
          </div>

          <div class="bi-meta-grid">
            <div>
              <span class="bi-label">Top Institutions:</span>
              <p class="bi-sub">${b.topColleges}</p>
            </div>
            <div>
              <span class="bi-label">Average CTC:</span>
              <p class="bi-sub bi-salary">${b.salaryRange}</p>
            </div>
          </div>

          ${examBadges ? `
            <div class="bi-exams-row">
              <span class="bi-exams-label">ENTRANCE EXAMS:</span>
              ${examBadges}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    module.innerHTML = `
      <div class="bs-header" onclick="toggleStreamAccordion('${stream.id}')">
        <div class="bs-head-left">
          <span class="bs-icon">${stream.icon}</span>
          <div>
            <div class="bs-title-row">
              <h3 class="bs-name">${stream.name}</h3>
              <span class="bs-badge">${stream.badge || 'Degree Track'}</span>
            </div>
            <p class="bs-degrees">${stream.degrees} • <span class="bs-stream-req">${stream.streamReq}</span></p>
          </div>
        </div>
        <div class="bs-head-right">
          <span class="bs-count-pill">${stream.branches.length} Branches</span>
          <button class="bs-toggle-btn" aria-label="Expand or shrink branch">${isExpanded ? 'Shrink ▴' : 'Expand ▾'}</button>
        </div>
      </div>

      <div class="bs-body ${isExpanded ? 'open' : 'collapsed'}">
        <p class="bs-desc">${stream.desc}</p>
        <div class="bs-branches-grid">
          ${branchCardsHTML}
        </div>
      </div>
    `;

    container.appendChild(module);
  });
}

window.toggleStreamAccordion = function (streamId) {
  if (expandedBranchStreams.has(streamId)) {
    expandedBranchStreams.delete(streamId);
  } else {
    expandedBranchStreams.add(streamId);
  }
  renderCourseBranches();
};

window.toggleAllBranches = function (expand) {
  if (expand && typeof COURSE_BRANCHES !== 'undefined') {
    COURSE_BRANCHES.forEach(s => expandedBranchStreams.add(s.id));
  } else {
    expandedBranchStreams.clear();
  }
  renderCourseBranches();
};

window.resetBranchFilter = function () {
  activeBranchFilter = 'all';
  branchSearchQuery = '';
  const input = document.getElementById('branchSearchInput');
  if (input) input.value = '';
  expandedBranchStreams = new Set(['eng', 'med']);
  renderBranchFilterChips();
  renderCourseBranches();
};

/* ============ EXPLORER ============ */
let activeFilter = 'all';

function initExplorer() {
  buildFilters();
  renderCards();
}

function buildFilters() {
  const filtersWrap = document.getElementById('filters');
  if (!filtersWrap) return;

  filtersWrap.innerHTML = '';
  const allChip = document.createElement('button');
  allChip.className = 'chip active';
  allChip.textContent = 'All careers';
  allChip.dataset.cat = 'all';
  allChip.onclick = () => setActiveFilter('all');
  filtersWrap.appendChild(allChip);

  CATS.forEach(c => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = c.name;
    chip.dataset.cat = c.id;
    chip.onclick = () => setActiveFilter(c.id);
    filtersWrap.appendChild(chip);
  });
}

function setActiveFilter(catId) {
  activeFilter = catId;
  document.querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset.cat === catId);
  });
  renderCards();
  const explorerEl = document.getElementById('explorer');
  if (explorerEl) {
    explorerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderCards() {
  const cardGrid = document.getElementById('cardGrid');
  if (!cardGrid) return;

  cardGrid.innerHTML = '';
  const list = activeFilter === 'all' ? CAREERS : CAREERS.filter(c => c.cat === activeFilter);

  list.forEach((career, idx) => {
    const catInfo = CATS.find(c => c.id === career.cat) || { short: 'CAREER' };
    const card = document.createElement('div');
    card.className = 'career-card';
    const detailsId = `details-${career.cat}-${idx}`;

    const roadmapHTML = career.roadmap.map(step => `
      <div class="roadmap-step">
        <span class="roadmap-dot"></span>
        <div><b>${step[0]}</b> — <span>${step[1]}</span></div>
      </div>
    `).join('');

    const examChipsHTML = career.examKeys.map(key => {
      const ex = EXAM_INFO[key] || { name: key };
      return `<button class="exam-chip" data-target="${detailsId}" data-exam="${key}">${ex.name}</button>`;
    }).join('');

    const examTimelineHTML = career.examKeys.map(key => {
      const ex = EXAM_INFO[key];
      if (!ex) return '';
      const linkHTML = ex.site
        ? `<a href="${ex.site}" target="_blank" rel="noopener noreferrer" class="exam-link">${ex.site.replace('https://', '')} ↗</a>`
        : `<span class="exam-link exam-link-none">No single official site — check your target institution</span>`;
      return `
        <div class="exam-block" id="${detailsId}-${key}">
          <div class="exam-block-head"><b>${ex.name}</b><span class="exam-body">${ex.body}</span></div>
          <p class="exam-timeline">${ex.timeline}</p>
          ${linkHTML}
        </div>
      `;
    }).join('');

    card.innerHTML = `
      <span class="tag">${catInfo.short}</span>
      <h3>${career.title}</h3>
      <p class="one-liner">${career.one}</p>
      <div class="meta">STREAM · ${career.stream}</div>
      <div class="exam-chip-row">
        <span class="exam-chip-label">EXAMS</span>${examChipsHTML}
      </div>
      <details id="${detailsId}">
        <summary>Full roadmap</summary>
        <div class="roadmap">${roadmapHTML}</div>
        <div class="skills-line"><b>Helps if you have:</b> ${career.skills}</div>
        <div class="exam-timelines">
          <div class="exam-timelines-label">Exam windows &amp; official sites</div>
          ${examTimelineHTML}
        </div>
      </details>
    `;
    cardGrid.appendChild(card);

    // Bind event listener to scroll to exam timeline on chip click
    card.querySelectorAll('.exam-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const det = document.getElementById(chip.dataset.target);
        if (det) {
          det.open = true;
          setTimeout(() => {
            const block = document.getElementById(`${chip.dataset.target}-${chip.dataset.exam}`);
            if (block) {
              block.scrollIntoView({ behavior: 'smooth', block: 'center' });
              block.classList.add('exam-block-flash');
              setTimeout(() => block.classList.remove('exam-block-flash'), 1200);
            }
          }, 60);
        }
      });
    });
  });
}

/* ============ FAQ ============ */
function initFAQ() {
  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  faqList.innerHTML = '';
  FAQS.forEach(item => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q">${item.q}<span class="plus">+</span></button>
      <div class="faq-a"><p>${item.a}</p></div>
    `;
    const btn = el.querySelector('.faq-q');
    const answer = el.querySelector('.faq-a');

    btn.onclick = () => {
      const isOpen = el.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(f => {
        f.classList.remove('open');
        f.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        el.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    };
    faqList.appendChild(el);
  });
}

/* ============ INTERACTIVE MONTH-BY-MONTH TIMELINE CALENDAR ============ */
let activeMonth = 'all';
let timelineSearchQuery = '';

const MONTHS = [
  { key: 'all', label: 'All Year', short: 'All' },
  { key: 'jan', label: 'January', short: 'Jan' },
  { key: 'feb', label: 'February', short: 'Feb' },
  { key: 'mar', label: 'March', short: 'Mar' },
  { key: 'apr', label: 'April', short: 'Apr' },
  { key: 'may', label: 'May', short: 'May' },
  { key: 'jun', label: 'June', short: 'Jun' },
  { key: 'jul', label: 'July', short: 'Jul' },
  { key: 'aug', label: 'August', short: 'Aug' },
  { key: 'sep', label: 'September', short: 'Sep' },
  { key: 'oct', label: 'October', short: 'Oct' },
  { key: 'nov', label: 'November', short: 'Nov' },
  { key: 'dec', label: 'December', short: 'Dec' }
];

function initTimelineCalendar() {
  const monthNav = document.getElementById('monthNav');
  const searchInput = document.getElementById('timelineSearchInput');

  if (!monthNav) return;

  renderMonthNavigation();
  renderTimelineCards();

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      timelineSearchQuery = e.target.value.trim().toLowerCase();
      renderTimelineCards();
    });
  }
}

function getExamMonthCount(monthKey) {
  if (monthKey === 'all') {
    return Object.keys(EXAM_INFO).length;
  }
  return Object.values(EXAM_INFO).filter(ex => ex.months && ex.months.includes(monthKey)).length;
}

function renderMonthNavigation() {
  const monthNav = document.getElementById('monthNav');
  if (!monthNav) return;

  monthNav.innerHTML = '';

  MONTHS.forEach(m => {
    const count = getExamMonthCount(m.key);
    const btn = document.createElement('button');
    btn.className = `month-nav-btn ${m.key === activeMonth ? 'active' : ''}`;
    btn.dataset.month = m.key;
    btn.innerHTML = `
      <span class="mn-label">${m.short}</span>
      <span class="mn-badge">${count}</span>
    `;

    btn.onclick = () => {
      activeMonth = m.key;
      document.querySelectorAll('.month-nav-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.month === m.key);
      });
      renderTimelineCards();
    };

    monthNav.appendChild(btn);
  });
}

function renderTimelineCards() {
  const grid = document.getElementById('timelineGrid');
  const statusText = document.getElementById('monthStatusText');
  if (!grid) return;

  const currentMonthObj = MONTHS.find(m => m.key === activeMonth) || MONTHS[0];

  // Filter exams
  let examEntries = Object.entries(EXAM_INFO);

  if (activeMonth !== 'all') {
    examEntries = examEntries.filter(([key, ex]) => ex.months && ex.months.includes(activeMonth));
  }

  if (timelineSearchQuery) {
    examEntries = examEntries.filter(([key, ex]) => {
      return (
        ex.name.toLowerCase().includes(timelineSearchQuery) ||
        ex.body.toLowerCase().includes(timelineSearchQuery) ||
        (ex.category && ex.category.toLowerCase().includes(timelineSearchQuery)) ||
        (ex.timeline && ex.timeline.toLowerCase().includes(timelineSearchQuery))
      );
    });
  }

  // Update status banner
  if (statusText) {
    if (timelineSearchQuery) {
      statusText.innerHTML = `Found <b>${examEntries.length}</b> entrance exams matching "<b>${timelineSearchQuery}</b>"`;
    } else if (activeMonth === 'all') {
      statusText.innerHTML = `Showing all <b>${examEntries.length}</b> national entrance exams &amp; admissions schedules`;
    } else {
      statusText.innerHTML = `Showing <b>${examEntries.length}</b> entrance exam events active in <b>${currentMonthObj.label}</b>`;
    }
  }

  if (examEntries.length === 0) {
    grid.innerHTML = `
      <div class="timeline-empty">
        <div class="empty-icon">📅</div>
        <h3>No exams found for this selection</h3>
        <p>Try selecting another month or clearing your search filter to see more upcoming deadlines.</p>
        <button class="btn-ghost" onclick="resetTimelineFilter()">Show All Months</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = '';

  examEntries.forEach(([key, ex], idx) => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.style.animationDelay = `${idx * 0.04}s`;

    // Active schedule events for this specific month
    let activeScheduleHTML = '';
    if (activeMonth !== 'all' && ex.schedule) {
      const monthEvents = ex.schedule.filter(s => s.month === activeMonth);
      if (monthEvents.length > 0) {
        activeScheduleHTML = `
          <div class="timeline-month-highlights">
            <span class="tmh-title">⚡ ${currentMonthObj.label} Highlights:</span>
            ${monthEvents.map(e => `
              <div class="tmh-pill tmh-pill-${e.phase.toLowerCase().replace(/\s+/g, '-')}">
                <span class="tmh-phase">${e.phase}</span>
                <span class="tmh-text">${e.text}</span>
              </div>
            `).join('')}
          </div>
        `;
      }
    } else if (ex.schedule && ex.schedule.length > 0) {
      // Preview up to 3 upcoming milestones in All view
      activeScheduleHTML = `
        <div class="timeline-month-highlights">
          <span class="tmh-title">Key Cycle Milestones:</span>
          <div class="tmh-preview-row">
            ${ex.schedule.slice(0, 3).map(e => `
              <span class="tmh-mini-tag"><b>${e.month.toUpperCase()}</b>: ${e.phase}</span>
            `).join('')}
          </div>
        </div>
      `;
    }

    const linkHTML = ex.site
      ? `<a href="${ex.site}" target="_blank" rel="noopener noreferrer" class="timeline-btn-portal">Visit Portal ↗</a>`
      : `<span class="timeline-portal-offline">Institutional Portal</span>`;

    card.innerHTML = `
      <div class="tl-card-top">
        <div class="tl-tags">
          <span class="tl-cat-tag">${ex.category || 'Entrance Test'}</span>
          <span class="tl-badge">${ex.badge || 'National'}</span>
        </div>
      </div>
      <h3 class="tl-exam-title">${ex.name}</h3>
      <p class="tl-exam-body">${ex.body}</p>
      
      ${activeScheduleHTML}

      <div class="tl-full-timeline">
        <span class="tl-ft-label">Full Timeline Overview:</span>
        <p>${ex.timeline}</p>
      </div>

      <div class="tl-card-footer">
        <div class="tl-keydates">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>${ex.keyDates || 'Check site for annual updates'}</span>
        </div>
        <div class="tl-actions">
          ${linkHTML}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

window.resetTimelineFilter = function () {
  activeMonth = 'all';
  timelineSearchQuery = '';
  const searchInput = document.getElementById('timelineSearchInput');
  if (searchInput) searchInput.value = '';
  renderMonthNavigation();
  renderTimelineCards();
};

/* ============ SCROLL REVEAL ============ */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============ 7. STUDENT & ADMIN AUTHENTICATION UI ============ */

function initAuthUI() {
  renderNavbarAuth();
  window.addEventListener('nexgen-auth-changed', () => {
    renderNavbarAuth();
  });
}

function renderNavbarAuth() {
  const container = document.getElementById('navAuthContainer');
  if (!container || typeof UserStorage === 'undefined') return;

  const currentUser = UserStorage.getCurrentUser();

  if (currentUser) {
    const initials = (currentUser.name || 'ST')
      .split(' ')
      .map(p => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const firstName = (currentUser.name || 'Student').split(' ')[0];

    container.innerHTML = `
      <div class="user-nav-dropdown-wrap">
        <button class="btn-nav-user" onclick="toggleUserDropdown(event)" aria-label="User Account Menu">
          <div class="nav-user-avatar">${initials}</div>
          <span class="nav-user-name">${escapeHtml(firstName)}</span>
          <span class="nav-user-arrow">▾</span>
        </button>
        <div class="user-nav-menu" id="userNavMenu">
          <div class="unm-head">
            <div class="unm-avatar">${initials}</div>
            <div class="unm-info">
              <span class="unm-name">${escapeHtml(currentUser.name)}</span>
              <span class="unm-email">${escapeHtml(currentUser.email || currentUser.id)}</span>
            </div>
          </div>
          <div class="unm-score-tag">
            <span>🧭 Top Match:</span>
            <b>${escapeHtml(currentUser.topMatch || 'Pending Quiz')}</b>
          </div>
          <ul class="unm-links">
            <li><a href="javascript:void(0)" onclick="openUserProfileModal(); closeUserDropdown();">👤 View My Profile &amp; Scores</a></li>
            <li><a href="#quiz" onclick="restartQuiz(); closeUserDropdown();">🔄 Retake Compass Quiz</a></li>
            <li><a href="admin.html" class="unm-admin-link">🔐 Admin Portal CRM</a></li>
            <li class="unm-divider"></li>
            <li><a href="javascript:void(0)" class="unm-logout-link" onclick="handleStudentSignOut()">Sign Out 🚪</a></li>
          </ul>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button class="btn-nav-signin" onclick="openAuthModal('signin')">
        <span>Sign In</span>
      </button>
    `;
  }
}

window.toggleUserDropdown = function (e) {
  e.stopPropagation();
  const menu = document.getElementById('userNavMenu');
  if (menu) {
    menu.classList.toggle('active');
  }
};

window.closeUserDropdown = function () {
  const menu = document.getElementById('userNavMenu');
  if (menu) menu.classList.remove('active');
};

document.addEventListener('click', () => {
  closeUserDropdown();
});

// Modal Operations
window.openAuthModal = function (defaultTab = 'signin') {
  const modal = document.getElementById('authModal');
  const errBox = document.getElementById('authErrorMsg');
  const succBox = document.getElementById('authSuccessMsg');

  if (errBox) errBox.style.display = 'none';
  if (succBox) succBox.style.display = 'none';

  switchAuthTab(defaultTab);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAuthModal = function () {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

window.switchAuthTab = function (tab) {
  const tabSignIn = document.getElementById('tabSignIn');
  const tabSignUp = document.getElementById('tabSignUp');
  const tabAdmin = document.getElementById('tabAdmin');

  const formSignIn = document.getElementById('signInForm');
  const formSignUp = document.getElementById('signUpForm');
  const contentAdmin = document.getElementById('adminTabContent');
  const title = document.getElementById('authModalTitle');

  const errBox = document.getElementById('authErrorMsg');
  const succBox = document.getElementById('authSuccessMsg');
  if (errBox) errBox.style.display = 'none';
  if (succBox) succBox.style.display = 'none';

  [tabSignIn, tabSignUp, tabAdmin].forEach(t => t && t.classList.remove('active'));
  [formSignIn, formSignUp, contentAdmin].forEach(f => f && (f.style.display = 'none'));

  if (tab === 'signup') {
    if (tabSignUp) tabSignUp.classList.add('active');
    if (formSignUp) formSignUp.style.display = 'block';
    if (title) title.textContent = 'Create Free Student Profile';
  } else if (tab === 'admin') {
    if (tabAdmin) tabAdmin.classList.add('active');
    if (contentAdmin) contentAdmin.style.display = 'block';
    if (title) title.textContent = 'Admin Command Center';
  } else {
    if (tabSignIn) tabSignIn.classList.add('active');
    if (formSignIn) formSignIn.style.display = 'block';
    if (title) title.textContent = 'Sign In to NexGen';
  }
};

window.handleStudentSignIn = function (e) {
  e.preventDefault();
  const identifier = document.getElementById('signInIdentifier')?.value.trim();
  const password = document.getElementById('signInPassword')?.value.trim();
  const errBox = document.getElementById('authErrorMsg');
  const succBox = document.getElementById('authSuccessMsg');

  if (!identifier) {
    if (errBox) {
      errBox.textContent = 'Please enter your email, student ID, or phone number.';
      errBox.style.display = 'block';
    }
    return;
  }

  const result = UserStorage.signIn(identifier, password);
  if (result.success) {
    if (errBox) errBox.style.display = 'none';
    if (succBox) {
      succBox.textContent = `Welcome back, ${result.user.name}!`;
      succBox.style.display = 'block';
    }
    setTimeout(() => {
      closeAuthModal();
      renderNavbarAuth();
    }, 600);
  } else {
    if (errBox) {
      errBox.textContent = result.message || 'Invalid login details.';
      errBox.style.display = 'block';
    }
  }
};

window.handleStudentSignUp = function (e) {
  e.preventDefault();
  const name = document.getElementById('signUpName')?.value.trim();
  const email = document.getElementById('signUpEmail')?.value.trim();
  const phone = document.getElementById('signUpPhone')?.value.trim();
  const stream = document.getElementById('signUpStream')?.value;
  const city = document.getElementById('signUpCity')?.value.trim() || 'India';
  const password = document.getElementById('signUpPassword')?.value.trim() || 'password123';

  const errBox = document.getElementById('authErrorMsg');
  const succBox = document.getElementById('authSuccessMsg');

  if (!name || !email || !phone || !stream) {
    if (errBox) {
      errBox.textContent = 'Please fill out all required profile fields.';
      errBox.style.display = 'block';
    }
    return;
  }

  const result = UserStorage.signUp({
    name,
    email,
    phone,
    stream,
    city,
    password,
    topMatch: latestQuizSnapshot?.topCategory?.name || 'Pending Quiz Evaluation',
    topMatchId: latestQuizSnapshot?.topCategory?.id || 'eng',
    scorePct: latestQuizSnapshot?.topCategory?.pct || 0,
    scores: latestQuizSnapshot?.scores || {}
  });

  if (result.success) {
    if (errBox) errBox.style.display = 'none';
    if (succBox) {
      succBox.textContent = `Account created successfully! Welcome, ${result.user.name}.`;
      succBox.style.display = 'block';
    }
    setTimeout(() => {
      closeAuthModal();
      renderNavbarAuth();
    }, 600);
  } else {
    if (errBox) {
      errBox.textContent = result.message || 'Failed to create account.';
      errBox.style.display = 'block';
    }
  }
};

window.handleStudentSignOut = function () {
  if (confirm('Are you sure you want to sign out?')) {
    UserStorage.logoutUser();
    closeUserProfileModal();
    renderNavbarAuth();
  }
};

// User Profile Modal
window.openUserProfileModal = function () {
  const currentUser = UserStorage.getCurrentUser();
  if (!currentUser) {
    openAuthModal('signin');
    return;
  }

  const initials = (currentUser.name || 'ST')
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatar = document.getElementById('profileAvatar');
  const nameEl = document.getElementById('profileFullName');
  const streamEl = document.getElementById('profileStream');
  const cityEl = document.getElementById('profileCity');
  const idEl = document.getElementById('profileId');
  const statusEl = document.getElementById('profileStatus');
  const emailEl = document.getElementById('profileEmail');
  const phoneEl = document.getElementById('profilePhone');
  const matchEl = document.getElementById('profileTopMatch');
  const scoreEl = document.getElementById('profileScorePct');
  const examsEl = document.getElementById('profileTargetExams');

  if (avatar) avatar.textContent = initials;
  if (nameEl) nameEl.textContent = currentUser.name;
  if (streamEl) streamEl.textContent = currentUser.stream;
  if (cityEl) cityEl.textContent = currentUser.city || 'India';
  if (idEl) idEl.textContent = currentUser.id;
  if (statusEl) statusEl.textContent = currentUser.status || 'Active Student';
  if (emailEl) emailEl.textContent = currentUser.email || 'N/A';
  if (phoneEl) phoneEl.textContent = currentUser.phone || 'N/A';
  if (matchEl) matchEl.textContent = currentUser.topMatch || 'Take the quiz to find your direction';
  if (scoreEl) scoreEl.textContent = `${currentUser.scorePct || 85}% Match`;
  if (examsEl) examsEl.textContent = currentUser.targetExams || 'JEE, NEET, CUET, CLAT';

  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeUserProfileModal = function () {
  const modal = document.getElementById('userProfileModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

