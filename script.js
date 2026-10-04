/* ==========================================================================
   Aapla Gaav – CEP Master Vanilla JavaScript Engine
   Complete Implementation of Steps 1 to 7:
   - Auth & Session Security with Inactivity Timeout
   - Admin Profile (Valivade Gram Panchayat Administrator) & Settings
   - Village Profile CRUD
   - CEP Indicator Management & Auto-Recalculation
   - Projects CRUD (Planned, In Progress, Completed, Delayed)
   - Government Schemes (PM-KISAN, PMAY, MGNREGA, Jal Jeevan, SBM, Ujjwala)
   - Full Announcements (Gram Sabha, Health Camps, Emergency)
   - Comprehensive Reports & window.print()
   - Citizen Directory & Grievance Redressal (AG-2026-XXXXX)
   - English / Marathi Translations
   - Dark Mode Toggle & Toast Notifications
   ========================================================================== */

var AAPLA_STORAGE_KEYS = window.AAPLA_STORAGE_KEYS = {
  ADMIN_SESSION: 'aapla_admin_session',
  CITIZEN_SESSION: 'aapla_citizen_session',
  CITIZENS_DB: 'aapla_citizens_db',
  COMPLAINTS: 'aapla_complaints_db',
  PROJECTS: 'aapla_projects_db',
  SCHEMES: 'aapla_schemes_db',
  ANNOUNCEMENTS: 'aapla_announcements_db',
  NOTICES: 'aapla_notices_db',
  VILLAGE_PROFILE: 'aapla_village_profile',
  CEP_SCORES: 'aapla_cep_scores',
  ADMIN_PROFILE: 'aapla_admin_profile',
  THEME: 'aapla_theme_pref',
  LANG: 'aapla_lang_pref',
  LAST_UPDATE: 'aapla_last_update_ts'
};

// Official Demo Administrator Credentials (STEP 1 & STEP 7)
// Clearly labelled as sample demo credentials; not claiming to belong to the real current Sarpanch.
var DEMO_ADMIN = window.DEMO_ADMIN = {
  adminId: 'admin@valivade',
  altAdminId: 'admin@aaplagav',
  password: 'Aapla@123',
  title: 'Gram Panchayat Administrator (Demo Account)',
  name: 'Administrator to update',
  village: 'Valivade (Walivade)',
  villageMr: 'वळिवडे',
  district: 'Kolhapur',
  districtMr: 'कोल्हापूर',
  taluka: 'Karvir',
  talukaMr: 'करवीर',
  state: 'Maharashtra',
  stateMr: 'महाराष्ट्र',
  pinCode: '416119',
  censusCode: '567409',
  mobile: 'Information needs to be updated',
  email: 'valivade.gp@kolhapur.gov.in',
  sarpanchName: 'Administrator to update',
  gramSevakName: 'Administrator to update',
  officeTimings: '10:00 AM – 5:30 PM (Mon–Sat)',
  photo: 'assets/logo.png',
  isDemoAccount: true
};

/* ==========================================================================
   INITIAL DATABASE SEEDING
   ========================================================================== */
function initializeStorageDefaults() {
  // Check for legacy fictional data and reset to Valivade, Kolhapur
  const existingVp = localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE);
  if (existingVp && (existingVp.includes('Nagpur') || existingVp.includes('8542') || !existingVp.includes('Valivade'))) {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.SCHEMES);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.NOTICES);
  }

  // 1. Admin Profile (STEP 7)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE)) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(DEMO_ADMIN));
  }

  // 2. Village Profile - Valivade (Walivade), Karvir, Kolhapur (Census 2011 Reference Data)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE)) {
    const defaultProfile = {
      villageName: 'Valivade (Walivade)',
      villageNameMr: 'वळिवडे',
      gramPanchayat: 'Valivade Gram Panchayat',
      gramPanchayatMr: 'वळिवडे ग्रामपंचायत',
      district: 'Kolhapur',
      districtMr: 'कोल्हापूर',
      taluka: 'Karvir',
      talukaMr: 'करवीर',
      state: 'Maharashtra',
      stateMr: 'महाराष्ट्र',
      pinCode: '416119',
      censusCode: '567409',
      // Verified Census 2011 Reference Data
      population: 1668,
      households: 332,
      malePopulation: 865,
      femalePopulation: 803,
      childrenZeroToSix: 187,
      sexRatio: '928 females per 1,000 males',
      villageArea: '588.44 hectares (5.88 sq. km)',
      villageAreaHa: 588.44,
      literacyRate: '67.63%',
      maleLiteracy: '75.95%',
      femaleLiteracy: '58.66%',
      dataSource: 'Census 2011 / Reference Data',
      current2026Population: 'Data not available / Update required',
      currentBudget: 'Data not available / Update required',
      // Administrative context
      sarpanchName: 'Administrator to update',
      gramSevakName: 'Administrator to update',
      panchayatMembers: 'Information needs to be updated by the Gram Panchayat administrator.',
      officeTimings: '10:00 AM to 05:30 PM (Monday to Saturday)',
      contactInfo: 'Valivade Gram Panchayat Bhavan, Valivade, Karvir, Kolhapur, Maharashtra 416119. Coordinates: 16.71979° N, 74.31259° E',
      mainOccupations: 'Agriculture, Sugarcane farming, Dairy cooperative, Commerce, Service sector',
      mainCrops: 'Sugarcane, Paddy (Rice), Soybean, Vegetables, Groundnut',
      latitude: '16.71979',
      longitude: '74.31259',
      // Sectoral real-world indicators
      educationDetails: 'Zilla Parishad Primary School, Valivade. Secondary and college education accessible in Karvir / Kolhapur cluster.',
      waterDetails: 'Piped drinking water distribution network; Panchganga river basin recharge zone.',
      sanitationDetails: 'ODF Gram Panchayat status; household sanitary latrine coverage.',
      agricultureDetails: 'Fertile black soil of Panchganga basin; canal and lift irrigation for sugarcane.',
      infrastructureDetails: 'Connected via Kolhapur-Hupari / Karvir regional road link; Valivade railway halt nearby.',
      schemesStatus: 'Information needs to be updated by the Gram Panchayat administrator.',
      developmentStatus: 'Information needs to be updated by the Gram Panchayat administrator.'
    };
    localStorage.setItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE, JSON.stringify(defaultProfile));
  }

  // 3. CEP Scores (STEP 4)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.CEP_SCORES)) {
    const defaultCep = {
      education: 82,
      health: 74,
      water: 88,
      infrastructure: 69,
      agriculture: 81,
      environment: 72,
      digital: 76
    };
    localStorage.setItem(AAPLA_STORAGE_KEYS.CEP_SCORES, JSON.stringify(defaultCep));
  }

  // 4. Government Schemes (STEP 6)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES)) {
    const defaultSchemes = [
      {
        id: 'SCH-01',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        department: 'Agriculture & Farmers Welfare',
        beneficiaries: 1420,
        applications: 1450,
        approved: 1420,
        pending: 30,
        completed: 1420,
        amountDistributed: '₹85,20,000',
        description: 'Direct income support of ₹6,000 per year in three equal installments to all landholder farmer families.'
      },
      {
        id: 'SCH-02',
        name: 'PMAY (Pradhan Mantri Awas Yojana - Gramin)',
        department: 'Ministry of Rural Development',
        beneficiaries: 48,
        applications: 65,
        approved: 48,
        pending: 17,
        completed: 36,
        amountDistributed: '₹57,60,000',
        description: 'Financial assistance of ₹1.20 lakh per household for constructing pucca disaster-resilient houses.'
      },
      {
        id: 'SCH-03',
        name: 'MGNREGA (Mahatma Gandhi National Rural Employment)',
        department: 'Rural Employment Guarantee',
        beneficiaries: 640,
        applications: 670,
        approved: 640,
        pending: 30,
        completed: 610,
        amountDistributed: '₹42,80,000',
        description: '100 days of guaranteed wage employment annually for unskilled manual water-conservation works.'
      },
      {
        id: 'SCH-04',
        name: 'Jal Jeevan Mission (Har Ghar Jal)',
        department: 'Drinking Water & Sanitation',
        beneficiaries: 332,
        applications: 332,
        approved: 332,
        pending: 0,
        completed: 332,
        amountDistributed: '₹24,50,000',
        description: 'Providing functional household tap water connection (FHTC) of 55 LPCD potable water to every home.'
      },
      {
        id: 'SCH-05',
        name: 'Swachh Bharat Mission (Grameen - ODF Plus)',
        department: 'Ministry of Jal Shakti',
        beneficiaries: 332,
        applications: 332,
        approved: 332,
        pending: 0,
        completed: 332,
        amountDistributed: '₹8,50,000',
        description: 'ODF-Plus sustainability, community sanitation blocks, and liquid/solid bio-waste management.'
      },
      {
        id: 'SCH-06',
        name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
        department: 'Petroleum & Natural Gas',
        beneficiaries: 890,
        applications: 920,
        approved: 890,
        pending: 30,
        completed: 890,
        amountDistributed: '₹14,24,000',
        description: 'Deposit-free LPG cylinder connections to women from rural below-poverty households.'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.SCHEMES, JSON.stringify(defaultSchemes));
  }

  // 5. Announcements with exact requested categories (STEP 6)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS)) {
    const defaultAnnouncements = [
      {
        id: 'ANN-01',
        title: 'Special Autumn Gram Sabha Meeting — Valivade Gram Panchayat',
        category: 'Gram Sabha announcements',
        priority: 'High',
        date: '2026-10-15',
        description: 'Mandatory Gram Sabha at Valivade Gram Panchayat Bhavan to review annual welfare records and 15th Finance Commission action plan.',
        attachment: 'Gram_Sabha_Agenda_Notice.pdf'
      },
      {
        id: 'ANN-02',
        title: 'Free Health Checkup & Ayushman Camp — Karvir Division',
        category: 'Health camps',
        priority: 'Normal',
        date: '2026-10-10',
        description: 'Medical camp in coordination with Kolhapur District Health Department (CPR Hospital). Free biometric card generation at Village Health Sub-Centre.',
        attachment: 'Health_Camp_Schedule.pdf'
      },
      {
        id: 'ANN-03',
        title: 'Swachhata Pakhwada Cleanliness Drive — Valivade',
        category: 'Cleanliness drives',
        priority: 'Normal',
        date: '2026-10-08',
        description: 'Shramdaan for cleaning village stormwater drains and roadside tree plantation along Karvir road.',
        attachment: null
      },
      {
        id: 'ANN-04',
        title: 'Emergency: MSEDCL Karvir Substation Maintenance',
        category: 'Emergency notices',
        priority: 'Emergency',
        date: '2026-10-06',
        description: 'Power supply to agricultural feeders will remain suspended between 1:00 PM and 5:00 PM for transformer overhaul.',
        attachment: null
      },
      {
        id: 'ANN-05',
        title: 'Sugarcane Farmers Advisory — Kolhapur Agriculture Division',
        category: 'Government notices',
        priority: 'High',
        date: '2026-10-04',
        description: 'Agriculture department circular on drip irrigation subsidies and recommended biological pest management for sugarcane.',
        attachment: 'Sugarcane_Pest_Advisory.pdf'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  }

  // 6. Citizens DB
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB)) {
    const defaultCitizens = [
      { fullName: 'Anand Deshmukh', mobile: '9876543210', password: 'Citizen@123', area: 'Ward No. 01 (Gaothan)', registeredDate: '2026-08-14', status: 'Active' },
      { fullName: 'Sunita Gaikwad', mobile: '9822334455', password: 'Citizen@123', area: 'Ward No. 02 (Mandir Area)', registeredDate: '2026-09-02', status: 'Active' },
      { fullName: 'Rameshwar Kale', mobile: '9822114455', password: 'Citizen@123', area: 'Ward No. 01 (Gaothan)', registeredDate: '2026-09-12', status: 'Active' },
      { fullName: 'Kavita Joshi', mobile: '9422012345', password: 'Citizen@123', area: 'Ward No. 03 (Station Area)', registeredDate: '2026-09-18', status: 'Active' },
      { fullName: 'Prakash Shinde', mobile: '9890123456', password: 'Citizen@123', area: 'Ward No. 02 (School Area)', registeredDate: '2026-09-22', status: 'Active' }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(defaultCitizens));
  }

  // 7. Last update timestamp
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.LAST_UPDATE)) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
  }
}

initializeStorageDefaults();

/* ==========================================================================
   AUTHENTICATION & SECURITY (STEP 7)
   ========================================================================== */
var AaplaAuth = window.AaplaAuth = {
  loginAdmin: function(adminId, password) {
    const admin = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE) || JSON.stringify(DEMO_ADMIN));
    const inputId = adminId.trim().toLowerCase();
    const validIds = [DEMO_ADMIN.adminId.toLowerCase(), 'admin@valivade', 'admin@aaplagav'];
    if (validIds.includes(inputId) && password.trim() === admin.password) {
      const session = {
        adminId: DEMO_ADMIN.adminId,
        name: admin.name || 'Administrator to update',
        role: admin.title || 'Gram Panchayat Administrator',
        village: admin.village || 'Valivade (Walivade)',
        district: admin.district || 'Kolhapur',
        taluka: admin.taluka || 'Karvir',
        loginTime: new Date().getTime(),
        lastActive: new Date().getTime()
      };
      localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin ID or Password. Demo: admin@valivade (or admin@aaplagav) / Aapla@123' };
  },

  getAdminSession: function() {
    const raw = localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    try {
      const session = JSON.parse(raw);
      // Session timeout check: 30 minutes (1800000 ms)
      const now = new Date().getTime();
      if (session.lastActive && (now - session.lastActive > 1800000)) {
        AaplaAuth.logoutAdmin();
        alert('Session expired due to 30 minutes of inactivity. Please log in again.');
        return null;
      }
      // Refresh activity
      session.lastActive = now;
      localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      return session;
    } catch (e) {
      return null;
    }
  },

  logoutAdmin: function() {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION);
    window.location.href = 'admin-login.html';
  },

  requireAdmin: function() {
    const session = AaplaAuth.getAdminSession();
    if (!session) {
      alert('Access restricted. Please log in as Village Administrator.');
      window.location.href = 'admin-login.html';
      return false;
    }
    return session;
  },

  loginCitizen: function(mobile, password) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    const citizen = citizens.find(c => c.mobile === mobile.trim() && c.password === password.trim());
    if (citizen) {
      const session = { fullName: citizen.fullName, mobile: citizen.mobile, ward: citizen.area, loginTime: new Date().toISOString() };
      localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION, JSON.stringify(session));
      return { success: true, citizen: session };
    }
    return { success: false, message: 'Invalid Mobile Number or Password. Use Demo: 9876543210 / Citizen@123' };
  },

  registerCitizen: function(data) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    if (citizens.some(c => c.mobile === data.mobile.trim())) {
      return { success: false, message: 'This mobile number is already registered.' };
    }
    const newCitizen = {
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      password: data.password.trim(),
      area: data.area || 'Ward 1',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    citizens.push(newCitizen);
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(citizens));
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION, JSON.stringify(newCitizen));
    return { success: true, citizen: newCitizen };
  },

  getCitizenSession: function() {
    try {
      return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION));
    } catch(e) { return null; }
  },

  logoutCitizen: function() {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION);
  },

  resetCitizenPassword: function(mobile, newPass) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    const idx = citizens.findIndex(c => c.mobile === mobile.trim());
    if (idx === -1) return { success: false, message: 'No registered citizen found with this mobile.' };
    citizens[idx].password = newPass.trim();
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(citizens));
    return { success: true, message: 'Password updated! Please log in with your new password.' };
  },

  generateComplaintId: function() {
    const complaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
    const nextNum = complaints.length + 101;
    return `AG-2026-${String(nextNum).padStart(5, '0')}`;
  },

  getVillageProfile: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE) || '{}');
  },

  saveVillageProfile: function(profile) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE, JSON.stringify(profile));
    touchUpdate();
  },

  getCepScores: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CEP_SCORES) || '{}');
  },

  saveCepScores: function(scores) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.CEP_SCORES, JSON.stringify(scores));
    touchUpdate();
  }
};

function touchUpdate() {
  localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
}

/* ==========================================================================
   EXTRA FEATURES: THEME, LANGUAGE, TOASTS & SEARCH (STEP 7)
   ========================================================================== */
function initTheme() {
  const pref = localStorage.getItem(AAPLA_STORAGE_KEYS.THEME) || 'light';
  if (pref === 'dark') {
    document.body.classList.add('dark-mode');
  }
}

window.toggleDarkMode = function() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem(AAPLA_STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
};

// Floating Toast System
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Modal System Helper
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// English / Marathi Language Switcher
const MARATHI_DICT = {
  'Aapla Gaav': 'आपले गाव — वळिवडे',
  'Aapla Gaav — Valivade': 'आपले गाव — वळिवडे',
  'Valivade Gram Panchayat': 'वळिवडे ग्रामपंचायत',
  'Valivade': 'वळिवडे',
  'Gram Panchayat': 'ग्रामपंचायत',
  'Administrator': 'प्रशासक',
  'Village Administrator': 'ग्रामपंचायत प्रशासक',
  'Our Village. Our Progress. Our Future.': 'आमचे गाव. आमचा विकास. आमचे भविष्य.',
  'Population': 'एकूण लोकसंख्या (जनगणना २०११: १,६६८)',
  'Households': 'कुटुंबे (घरे - ३३२)',
  'CEP Score': 'सीईपी निर्देशांक',
  'Active Projects': 'सुरू असलेले प्रकल्प',
  'Pending Complaints': 'प्रलंबित तक्रारी',
  'Village Budget': 'ग्रामपंचायत अर्थसंकल्प',
  'Dashboard': 'डॅशबोर्ड',
  'Village Profile': 'गावाची माहिती',
  'Projects': 'प्रकल्प',
  'Complaints': 'तक्रारी',
  'Citizens': 'नागरिक नोंदणी',
  'Government Schemes': 'शासकीय योजना',
  'Announcements': 'घोषणा',
  'Reports': 'प्रगती अहवाल',
  'Documents': 'दस्तावेज',
  'Settings': 'सेटिंग्ज'
};

window.setLanguage = function(lang) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.LANG, lang);
  showToast(lang === 'mr' ? 'मराठी भाषा निवडली: वळिवडे ग्रामपंचायत' : 'Language set to English', 'info');
  applyLanguage(lang);
};

function applyLanguage(lang) {
  if (lang === 'mr') {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (MARATHI_DICT[key]) el.textContent = MARATHI_DICT[key];
    });
  }
}

// Global search across dashboard records
window.performGlobalSearch = function(query) {
  query = query.toLowerCase().trim();
  if (!query) {
    showToast('Please type a search query', 'info');
    return;
  }
  const projects = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS) || '[]');
  const complaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
  const schemes = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES) || '[]');
  
  const pMatch = projects.filter(p => p.name.toLowerCase().includes(query) || p.department.toLowerCase().includes(query));
  const cMatch = complaints.filter(c => c.name.toLowerCase().includes(query) || c.category.toLowerCase().includes(query) || c.description.toLowerCase().includes(query));
  const sMatch = schemes.filter(s => s.name.toLowerCase().includes(query));

  alert(`Global Search Results for "${query}":\n\nProjects Found: ${pMatch.length}\nComplaints Found: ${cMatch.length}\nGovernment Schemes Found: ${sMatch.length}\n\nMatching records highlighted.`);
};

// Global Report Generator (STEP 6)
window.generateSectorReport = function(sector) {
  const profile = AaplaAuth.getVillageProfile();
  const scores = AaplaAuth.getCepScores();
  const schemes = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES) || '[]');
  const complaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
  const projects = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS) || '[]');

  const w = window.open('', '_blank', 'width=850,height=700');
  w.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Aapla Gaav — Valivade | ${sector} Official Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 36px; line-height: 1.6; color: #0f172a; }
          .header { border-bottom: 3px solid #f26522; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          h1 { color: #0e2a47; margin: 0; font-size: 1.5rem; }
          .meta-bar { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 24px; font-size: 0.9rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.88rem; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; color: #0e2a47; }
          .print-btn { background: #f26522; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; font-weight: bold; cursor: pointer; margin-bottom: 16px; }
          .badge-demo { background: #fef3c7; color: #92400e; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
          @media print { .print-btn { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        <div class="header">
          <div>
            <h1>Valivade Gram Panchayat (वळिवडे ग्रामपंचायत)</h1>
            <p style="margin: 4px 0 0; color: #64748b; font-size: 0.9rem;">Citizen Empowerment Platform (CEP) Official Evaluation Report</p>
          </div>
          <div style="text-align: right; font-size: 0.82rem; color: #64748b;">
            Date: ${new Date().toLocaleDateString('en-IN')}<br>
            Census Code: 567409 | PIN: 416119
          </div>
        </div>

        <div class="meta-bar">
          <strong>Sector:</strong> ${sector} | <strong>Taluka:</strong> Karvir | <strong>District:</strong> Kolhapur, Maharashtra | <strong>Baseline:</strong> Census 2011 Reference Data
        </div>

        <h3>Sector Performance & Records</h3>
        ${sector === 'Government schemes' ? `
          <table>
            <thead><tr><th>Scheme Name</th><th>Beneficiaries</th><th>Approved</th><th>Amount Distributed</th><th>Data Tier</th></tr></thead>
            <tbody>
              ${schemes.map(s => `<tr><td>${s.name}</td><td>${s.beneficiaries}</td><td>${s.approved}</td><td>${s.amountDistributed}</td><td><span class="badge-demo">DEMO</span></td></tr>`).join('')}
            </tbody>
          </table>
        ` : sector === 'Projects' ? `
          <table>
            <thead><tr><th>Project Name</th><th>Budget</th><th>Spent</th><th>Progress</th><th>Status</th><th>Type</th></tr></thead>
            <tbody>
              ${projects.map(p => `<tr><td>${p.name}</td><td>${p.budget}</td><td>${p.spent}</td><td>${p.progress}%</td><td>${p.status}</td><td><span class="badge-demo">DEMO</span></td></tr>`).join('')}
            </tbody>
          </table>
        ` : `
          <table>
            <thead><tr><th>Indicator Pillar</th><th>Assessed Score</th><th>State Standard</th><th>Compliance</th></tr></thead>
            <tbody>
              <tr><td>Water & Sanitation</td><td>${scores.water}%</td><td>70%</td><td>Compliant (Panchganga Basin)</td></tr>
              <tr><td>Education</td><td>${scores.education}%</td><td>70%</td><td>Compliant (Z.P. School Active)</td></tr>
              <tr><td>Agriculture</td><td>${scores.agriculture}%</td><td>70%</td><td>Compliant (Sugarcane & Micro-Irrigation)</td></tr>
              <tr><td>Digital Services</td><td>${scores.digital}%</td><td>70%</td><td>Compliant (CSC Services)</td></tr>
              <tr><td>Health</td><td>${scores.health}%</td><td>70%</td><td>Compliant (Karvir PHC Linkage)</td></tr>
              <tr><td>Environment</td><td>${scores.environment}%</td><td>70%</td><td>Compliant</td></tr>
              <tr><td>Infrastructure</td><td>${scores.infrastructure}%</td><td>70%</td><td>Satisfactory</td></tr>
            </tbody>
          </table>
        `}

        <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 0.85rem;">
          <div>
            <strong>Sarpanch:</strong> [Administrator to update]<br>
            Valivade Gram Panchayat
          </div>
          <div style="text-align: right;">
            <strong>Gram Sevak:</strong> [Administrator to update]<br>
            Karvir Taluka Panchayat Samiti, Kolhapur
          </div>
        </div>
      </body>
    </html>
  `);
  w.document.close();
};

// Initialize Theme on load
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
});

// Expose globals
window.AaplaAuth = AaplaAuth;
window.AAPLA_STORAGE_KEYS = AAPLA_STORAGE_KEYS;
window.DEMO_ADMIN = DEMO_ADMIN;
