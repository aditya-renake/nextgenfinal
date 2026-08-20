/**
 * NexGen Careers - User Data Storage & Export Engine
 * Handles student registrations, authentication, quiz score snapshots, local persistence,
 * sample demo seeding, CSV/JSON export, and administrative operations.
 */

const STORAGE_KEY = 'nexgen_registered_users';
const ADMIN_AUTH_KEY = 'nexgen_admin_authenticated';
const CURRENT_USER_KEY = 'nexgen_current_user';

// Admin credential constants
const ADMIN_CREDENTIALS = {
  email: 'aditya.renake@outlook.com',
  passcode: 'Aditya@11'
};

// Real-time live student registry dataset (starts empty for real-time production entries)
const INITIAL_DEMO_USERS = [];

/**
 * Storage Engine Object
 */
const UserStorage = {
  // Retrieve all registered students
  getUsers: function () {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      // Filter out legacy demo entries (IDs NXG-2026-0891 through 0898)
      const legacyDemoIds = new Set([
        'NXG-2026-0891', 'NXG-2026-0892', 'NXG-2026-0893', 'NXG-2026-0894',
        'NXG-2026-0895', 'NXG-2026-0896', 'NXG-2026-0897', 'NXG-2026-0898'
      ]);
      const cleaned = parsed.filter(u => !u.id || !legacyDemoIds.has(u.id));
      if (cleaned.length !== parsed.length) {
        this.saveUsers(cleaned);
      }
      return cleaned;
    } catch (e) {
      console.error('Error reading registered users from localStorage:', e);
      return [];
    }
  },

  // Save full users list with real-time event dispatch
  saveUsers: function (users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('nexgen-users-updated', { detail: { users } }));
      }
      return true;
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
      return false;
    }
  },

  // Generate a secure 6-digit access passcode for auto-email delivery
  generatePasscode: function () {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  // Save new user registration / sign up
  addUser: function (userData) {
    const users = this.getUsers();
    const newId = userData.id || `NXG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedPasscode = userData.passcode || userData.password || this.generatePasscode();
    
    const newUser = {
      id: newId,
      name: (userData.name || '').trim() || (userData.email ? userData.email.split('@')[0] : 'Student'),
      email: (userData.email || '').trim().toLowerCase(),
      passcode: generatedPasscode,
      password: generatedPasscode,
      phone: userData.phone || '',
      stream: userData.stream || 'Class 12 Pass / Appearing',
      city: userData.city || 'India',
      topMatch: userData.topMatch || 'General Career Direction',
      topMatchId: userData.topMatchId || 'eng',
      scorePct: userData.scorePct || 85,
      registeredAt: userData.registeredAt || new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: userData.status || 'New',
      targetExams: userData.targetExams || 'Upcoming Entrance Tests',
      targetColleges: userData.targetColleges || 'Top National Institutes',
      notes: userData.notes || 'Registered through NexGen Careers Compass Portal.',
      scores: userData.scores || { eng: 15, med: 10, law: 10, des: 10, com: 10, sci: 10, media: 10, gov: 10 }
    };

    // Check if user with same email exists -> update them, else prepend
    const existingIndex = users.findIndex(u => u.email && u.email.toLowerCase() === newUser.email);
    if (existingIndex !== -1) {
      users[existingIndex] = { ...users[existingIndex], ...newUser, id: users[existingIndex].id };
      this.saveUsers(users);
      return users[existingIndex];
    } else {
      users.unshift(newUser);
      this.saveUsers(users);
      return newUser;
    }
  },

  // Find user by ID
  getUserById: function (id) {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  // Update existing user by ID
  updateUser: function (id, updates) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { 
        ...users[idx], 
        ...updates, 
        lastActive: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      };
      this.saveUsers(users);

      // If current logged-in user is this one, update session too
      const current = this.getCurrentUser();
      if (current && current.id === id) {
        this.setCurrentUser(users[idx]);
      }
      return users[idx];
    }
    return null;
  },

  // Delete user by ID
  deleteUser: function (id) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== id);
    this.saveUsers(users);

    const current = this.getCurrentUser();
    if (current && current.id === id) {
      this.logoutUser();
    }
    return users;
  },

  // Bulk delete users
  deleteMultipleUsers: function (ids) {
    const idSet = new Set(ids);
    let users = this.getUsers();
    users = users.filter(u => !idSet.has(u.id));
    this.saveUsers(users);
    return users;
  },

  // Bulk status update
  bulkUpdateStatus: function (ids, status) {
    const idSet = new Set(ids);
    let users = this.getUsers();
    users = users.map(u => {
      if (idSet.has(u.id)) {
        return { ...u, status: status, updatedAt: new Date().toISOString() };
      }
      return u;
    });
    this.saveUsers(users);
    return users;
  },

  // Reset to initial demo dataset
  resetToDemo: function () {
    this.saveUsers(INITIAL_DEMO_USERS);
    return [...INITIAL_DEMO_USERS];
  },

  // Clear all data
  clearAll: function () {
    this.saveUsers([]);
    return [];
  },

  // ================= USER / STUDENT AUTHENTICATION ================= //
  
  getCurrentUser: function () {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: function (user) {
    try {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('nexgen-auth-changed', { detail: { user } }));
      return true;
    } catch (e) {
      return false;
    }
  },

  logoutUser: function () {
    try {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new CustomEvent('nexgen-auth-changed', { detail: { user: null } }));
      return true;
    } catch (e) {
      return false;
    }
  },

  // Student Sign Up
  signUp: function (formData) {
    const email = (formData.email || '').trim().toLowerCase();
    if (!email) {
      return { success: false, message: 'Email address is required.' };
    }
    if (!formData.name && !email) {
      return { success: false, message: 'Full name or email is required.' };
    }

    const users = this.getUsers();
    const existing = users.find(u => u.email && u.email.toLowerCase() === email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in with your passcode.' };
    }

    const passcode = formData.passcode || formData.password || this.generatePasscode();

    const newUser = this.addUser({
      name: formData.name || email.split('@')[0],
      email: email,
      passcode: passcode,
      password: passcode,
      phone: formData.phone || '',
      stream: formData.stream || 'Class 12 Science (PCM)',
      city: formData.city || 'India',
      topMatch: formData.topMatch || 'Pending Quiz Evaluation',
      topMatchId: formData.topMatchId || 'eng',
      scorePct: formData.scorePct || 0,
      scores: formData.scores || {}
    });

    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  // Student Sign In
  signIn: function (identifier, password) {
    const idTrim = (identifier || '').trim().toLowerCase();
    const passTrim = (password || '').trim();

    if (!idTrim) {
      return { success: false, message: 'Please enter your email ID, phone, or Student ID.' };
    }

    const users = this.getUsers();
    const found = users.find(u => 
      (u.email && u.email.toLowerCase() === idTrim) ||
      (u.id && u.id.toLowerCase() === idTrim) ||
      (u.phone && u.phone.replace(/\s+/g, '') === idTrim.replace(/\s+/g, ''))
    );

    if (!found) {
      return { success: false, message: 'Student record not found. Please take the quiz or sign up.' };
    }

    const isPassValid = !found.password || !passTrim || 
      (found.passcode && passTrim === found.passcode) || 
      (found.password && passTrim === found.password);

    if (!isPassValid) {
      return { success: false, message: 'Incorrect passcode. Please check the passcode sent to your email.' };
    }

    found.lastActive = new Date().toISOString();
    this.updateUser(found.id, { lastActive: found.lastActive });
    this.setCurrentUser(found);
    return { success: true, user: found };
  },

  // Sync quiz completion with logged-in user or active lead
  syncQuizResult: function (quizData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const top = quizData.topCategory;
      const updates = {
        topMatch: top.name,
        topMatchId: top.id,
        scorePct: top.pct || 90,
        scores: quizData.scores || {},
        lastActive: new Date().toISOString()
      };
      const updated = this.updateUser(currentUser.id, updates);
      if (updated) {
        this.setCurrentUser(updated);
      }
      return updated;
    }
    return null;
  },

  // ================= ADMIN AUTHENTICATION ================= //

  isAdminAuthenticated: function () {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  },

  loginAdmin: function (identifier, password, remember = true) {
    const idTrim = (identifier || '').trim().toLowerCase();
    const passTrim = (password || '').trim();

    const isEmailMatch = idTrim === ADMIN_CREDENTIALS.email.toLowerCase();
    const isPassMatch = passTrim === ADMIN_CREDENTIALS.passcode;

    if (isEmailMatch && isPassMatch) {
      try {
        if (remember) {
          localStorage.setItem(ADMIN_AUTH_KEY, 'true');
        } else {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        }
        return { success: true, message: 'Admin login successful.' };
      } catch (e) {
        return { success: false, message: 'Storage error.' };
      }
    }

    return { 
      success: false, 
      message: 'Invalid Administrator Credentials. Please check your email and passcode.' 
    };
  },

  logoutAdmin: function () {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ================= DATA EXPORT ENGINES ================= //

  // Export dataset to CSV
  exportToCSV: function (usersList) {
    const data = usersList || this.getUsers();
    if (!data.length) {
      alert('No user records available to export.');
      return;
    }

    const headers = [
      'Student ID',
      'Full Name',
      'Email Address',
      'Phone Number',
      'Current Stream',
      'City / State',
      'Top Recommended Career',
      'Top Match Code',
      'Affinity Score (%)',
      'Target Exams',
      'Target Colleges',
      'Registration Date (UTC)',
      'Last Active Date',
      'Lead Status',
      'Counselor Admin Notes'
    ];

    const rows = data.map(u => [
      `"${u.id || ''}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
      `"${(u.stream || '').replace(/"/g, '""')}"`,
      `"${(u.city || '').replace(/"/g, '""')}"`,
      `"${(u.topMatch || '').replace(/"/g, '""')}"`,
      `"${u.topMatchId || ''}"`,
      `"${u.scorePct || 0}%"`,
      `"${(u.targetExams || '').replace(/"/g, '""')}"`,
      `"${(u.targetColleges || '').replace(/"/g, '""')}"`,
      `"${u.registeredAt || ''}"`,
      `"${u.lastActive || ''}"`,
      `"${(u.status || 'New').replace(/"/g, '""')}"`,
      `"${(u.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NexGen_Students_Database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Export dataset to JSON
  exportToJSON: function (usersList) {
    const data = usersList || this.getUsers();
    if (!data.length) {
      alert('No user records available to export.');
      return;
    }
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NexGen_Students_Database_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

// Export for module/browser contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserStorage, INITIAL_DEMO_USERS, ADMIN_CREDENTIALS };
}

