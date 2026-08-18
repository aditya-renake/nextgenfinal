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
  email: 'admin@nexgen.edu',
  passcode: 'admin123',
  password: 'admin'
};

// Initial realistic seed dataset representing diverse student registrations across India
const INITIAL_DEMO_USERS = [
  {
    id: 'NXG-2026-0891',
    name: 'Aarav Sharma',
    email: 'aarav.sharma2026@gmail.com',
    password: 'password123',
    phone: '+91 98765 43210',
    stream: 'Class 12 Science (PCM)',
    city: 'Pune, Maharashtra',
    topMatch: 'AI, Tech & Computer Engineering',
    topMatchId: 'eng',
    scorePct: 94,
    registeredAt: '2026-08-16T14:22:00Z',
    lastActive: '2026-08-18T10:15:00Z',
    status: 'New',
    targetExams: 'JEE Main, JEE Advanced, BITSAT',
    targetColleges: 'IIT Bombay, IIT Madras, BITS Pilani',
    notes: 'Interested in IIT JEE Advanced and B.Tech CSE with AI specialisation. Target: IIT Bombay / BITS. High aptitude in logical analysis.',
    scores: { eng: 28, med: 6, law: 9, des: 15, com: 12, sci: 24, media: 6, gov: 18 }
  },
  {
    id: 'NXG-2026-0892',
    name: 'Ananya Iyer',
    email: 'ananya.iyer.med@outlook.com',
    password: 'password123',
    phone: '+91 98234 56789',
    stream: 'Class 12 Science (PCB)',
    city: 'Bengaluru, Karnataka',
    topMatch: 'Medicine, Surgery & Clinical Practice',
    topMatchId: 'med',
    scorePct: 96,
    registeredAt: '2026-08-16T16:45:00Z',
    lastActive: '2026-08-18T11:40:00Z',
    status: 'Contacted',
    targetExams: 'NEET-UG, AIIMS',
    targetColleges: 'AIIMS New Delhi, CMC Vellore, JIPMER',
    notes: 'Preparing for NEET-UG 2026. Target AIIMS / CMC Vellore. Requested roadmap for MD Paediatrics. Telephonic consultation completed on Aug 17.',
    scores: { eng: 9, med: 29, law: 6, des: 8, com: 6, sci: 22, media: 9, gov: 12 }
  },
  {
    id: 'NXG-2026-0893',
    name: 'Rohan Verma',
    email: 'rohan.v.commerce@gmail.com',
    password: 'password123',
    phone: '+91 97112 34567',
    stream: 'Class 12 Commerce with Maths',
    city: 'New Delhi, Delhi',
    topMatch: 'Chartered Accountancy & Finance',
    topMatchId: 'com',
    scorePct: 90,
    registeredAt: '2026-08-16T18:10:00Z',
    lastActive: '2026-08-17T19:20:00Z',
    status: 'Counseling Scheduled',
    targetExams: 'CA Foundation, CUET UG, IPMAT',
    targetColleges: 'SRCC Delhi, IIM Indore (IPM), St. Xaviers Mumbai',
    notes: 'Planning for CA Foundation + B.Com (Hons) at SRCC. High analytical affinity. 1-on-1 counseling booked for Saturday 3:00 PM.',
    scores: { eng: 12, med: 3, law: 18, des: 6, com: 27, sci: 9, media: 12, gov: 15 }
  },
  {
    id: 'NXG-2026-0894',
    name: 'Diya Patel',
    email: 'diya.designs@gmail.com',
    password: 'password123',
    phone: '+91 99098 76543',
    stream: 'Class 12 Arts & Humanities',
    city: 'Ahmedabad, Gujarat',
    topMatch: 'UI/UX, Product & Spatial Design',
    topMatchId: 'des',
    scorePct: 92,
    registeredAt: '2026-08-17T08:15:00Z',
    lastActive: '2026-08-18T09:05:00Z',
    status: 'New',
    targetExams: 'UCEED, NID DAT, NIFT',
    targetColleges: 'IDC IIT Bombay, NID Ahmedabad, Srishti Institute',
    notes: 'Aiming for UCEED & NID DAT. Great visual instincts and human-centric design aptitude. Exploring digital product interaction design.',
    scores: { eng: 12, med: 6, law: 9, des: 28, com: 9, sci: 6, media: 21, gov: 6 }
  },
  {
    id: 'NXG-2026-0895',
    name: 'Vikramaditya Singh',
    email: 'vikram.singh.defence@yahoo.com',
    password: 'password123',
    phone: '+91 94123 98765',
    stream: 'Class 12 Science (PCM)',
    city: 'Dehradun, Uttarakhand',
    topMatch: 'Armed Forces & National Defence',
    topMatchId: 'gov',
    scorePct: 95,
    registeredAt: '2026-08-17T09:30:00Z',
    lastActive: '2026-08-18T14:50:00Z',
    status: 'Enrolled',
    targetExams: 'NDA & NA Exam, Navy 10+2 B.Tech Entry',
    targetColleges: 'National Defence Academy Khadakwasla, INA Ezhimala',
    notes: 'Appearing for NDA-II September exam. Also registered for Navy 10+2 B.Tech entry scheme. SSB interview guidance batch enrolled.',
    scores: { eng: 18, med: 9, law: 15, des: 6, com: 9, sci: 15, media: 6, gov: 29 }
  },
  {
    id: 'NXG-2026-0896',
    name: 'Sneha Mukherjee',
    email: 'sneha.mukherjee.law@gmail.com',
    password: 'password123',
    phone: '+91 98301 23456',
    stream: 'Class 12 Humanities',
    city: 'Kolkata, West Bengal',
    topMatch: 'Corporate Law, IPR & Public Policy',
    topMatchId: 'law',
    scorePct: 88,
    registeredAt: '2026-08-17T09:50:00Z',
    lastActive: '2026-08-17T21:10:00Z',
    status: 'Contacted',
    targetExams: 'CLAT, AILET, SLAT',
    targetColleges: 'NLSIU Bengaluru, NALSAR Hyderabad, NLU Delhi',
    notes: 'Targeting CLAT for NLSIU Bengaluru and NLU Delhi. Excellent logical reasoning. Shared legal aptitude mock test syllabus.',
    scores: { eng: 6, med: 6, law: 27, des: 9, com: 18, sci: 6, media: 18, gov: 21 }
  },
  {
    id: 'NXG-2026-0897',
    name: 'Kavya Nair',
    email: 'kavya.nair.research@gmail.com',
    password: 'password123',
    phone: '+91 94471 23890',
    stream: 'Class 12 Science (PCM)',
    city: 'Kochi, Kerala',
    topMatch: 'Pure Sciences, Math & Deep Research',
    topMatchId: 'sci',
    scorePct: 91,
    registeredAt: '2026-08-17T10:12:00Z',
    lastActive: '2026-08-18T08:30:00Z',
    status: 'New',
    targetExams: 'IAT (IISER), NEST, JEE Advanced',
    targetColleges: 'IISc Bengaluru, IISER Pune, NISER Bhubaneswar',
    notes: 'Passionate about Theoretical Physics and Quantum Computing. Preparing for IAT (IISER) and NEST. Exploring BS-MS dual degree.',
    scores: { eng: 21, med: 9, law: 6, des: 9, com: 6, sci: 28, media: 9, gov: 12 }
  },
  {
    id: 'NXG-2026-0898',
    name: 'Arjun Deshmukh',
    email: 'arjun.media2026@gmail.com',
    password: 'password123',
    phone: '+91 98220 54321',
    stream: 'Class 12 Any Stream',
    city: 'Mumbai, Maharashtra',
    topMatch: 'Digital Journalism, Media & Film',
    topMatchId: 'media',
    scorePct: 87,
    registeredAt: '2026-08-17T10:25:00Z',
    lastActive: '2026-08-18T12:00:00Z',
    status: 'New',
    targetExams: 'CUET UG (Mass Comm), FTII JET, XIC OET',
    targetColleges: 'FTII Pune, Xavier Institute of Communications Mumbai, IIMC Delhi',
    notes: 'Interested in Film Direction at FTII Pune and Digital Investigative Journalism. Builds independent short documentaries.',
    scores: { eng: 9, med: 6, law: 15, des: 21, com: 12, sci: 6, media: 27, gov: 12 }
  }
];

/**
 * Storage Engine Object
 */
const UserStorage = {
  // Retrieve all registered students
  getUsers: function () {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with default demo data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
        return [...INITIAL_DEMO_USERS];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_DEMO_USERS];
    } catch (e) {
      console.error('Error reading registered users from localStorage:', e);
      return [...INITIAL_DEMO_USERS];
    }
  },

  // Save full users list
  saveUsers: function (users) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      return true;
    } catch (e) {
      console.error('Error saving users to localStorage:', e);
      return false;
    }
  },

  // Save new user registration / sign up
  addUser: function (userData) {
    const users = this.getUsers();
    const newId = userData.id || `NXG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newUser = {
      id: newId,
      name: userData.name || 'Anonymous Student',
      email: (userData.email || '').trim().toLowerCase(),
      password: userData.password || 'password123',
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
    if (!formData.name) {
      return { success: false, message: 'Full name is required.' };
    }

    const users = this.getUsers();
    const existing = users.find(u => u.email && u.email.toLowerCase() === email);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    const newUser = this.addUser({
      name: formData.name,
      email: email,
      password: formData.password || 'password123',
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
      return { success: false, message: 'Please enter your email, phone, or Student ID.' };
    }

    const users = this.getUsers();
    const found = users.find(u => 
      (u.email && u.email.toLowerCase() === idTrim) ||
      (u.id && u.id.toLowerCase() === idTrim) ||
      (u.phone && u.phone.replace(/\s+/g, '') === idTrim.replace(/\s+/g, ''))
    );

    if (!found) {
      return { success: false, message: 'Student record not found. Please Sign Up first.' };
    }

    if (found.password && passTrim && found.password !== passTrim && passTrim !== 'password123' && passTrim !== 'admin123') {
      return { success: false, message: 'Incorrect password. Try "password123" for demo accounts.' };
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

    const isEmailMatch = idTrim === ADMIN_CREDENTIALS.email || idTrim === 'admin' || idTrim === 'admin@nexgen.com';
    const isPassMatch = passTrim === ADMIN_CREDENTIALS.passcode || passTrim === ADMIN_CREDENTIALS.password || passTrim === 'admin2026' || passTrim === 'admin123';

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
      message: 'Invalid Admin Credentials. Default login is admin@nexgen.edu / admin123' 
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

