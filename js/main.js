/* ==========================================================================
   Aapla Gaav — Valivade Gram Panchayat
   Core Shared UI & Multi-Page Navigation Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  highlightActiveNav();
  initMobileDrawer();
  initAnnouncementTicker();
  initLanguage();
  initSharedModals();
  checkCitizenSession();
});

// 1. Navigation Controller (Multi-Page URL detection)
function highlightActiveNav() {
  const path = window.location.pathname;
  let filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  if (filename.includes('#')) filename = filename.split('#')[0];
  if (filename.includes('?')) filename = filename.split('?')[0];
  if (!filename) filename = 'index.html';

  // Desktop and Mobile Navigation Links
  const navLinks = document.querySelectorAll('.nav-menu .nav-item a, .mobile-nav-list a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check direct match or root index match
    if (href === filename || (filename === 'index.html' && (href === '' || href === '/' || href === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// 2. Mobile Drawer Controller
function initMobileDrawer() {
  const toggleBtn = document.getElementById('hamburgerBtn') || document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavCloseBtn');
  const backdrop = document.getElementById('mobileNavBackdrop');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      drawer.classList.add('open');
      if (backdrop) backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', function() {
      drawer.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (backdrop && drawer) {
    backdrop.addEventListener('click', function() {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

// 3. Theme Controller (Light / Dark Mode)
function initTheme() {
  const savedTheme = localStorage.getItem(AAPLA_STORAGE_KEYS.THEME) || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  updateThemeIcons();
}

window.toggleDarkMode = function() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem(AAPLA_STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
  updateThemeIcons();
  showToast(isDark ? 'Dark theme enabled' : 'Light theme enabled', 'info');
};

function updateThemeIcons() {
  const isDark = document.body.classList.contains('dark-theme');
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
  });
}

// 4. Language Controller (English / Marathi)
const TRANSLATION_MAP = {
  mr: {
    heroTitle: 'आपले गाव — वळिवडे',
    heroSubtitle: '“आमचे गाव. आमचा विकास. आमचे भविष्य.”',
    navHome: 'मुख्यपृष्ठ',
    navProfile: 'गावाची माहिती',
    navServices: 'सेवा',
    navProjects: 'प्रकल्प',
    navEducation: 'शिक्षण',
    navHealth: 'आरोग्य',
    navWater: 'पाणी व स्वच्छता',
    navAgriculture: 'शेती व कृषी',
    navInfra: 'पायाभूत सुविधा',
    navSchemes: 'शासकीय योजना',
    navComplaints: 'तक्रार निवारण',
    navAnnouncements: 'घोषणा व सूचना',
    navReports: 'अहवाल',
    navContact: 'संपर्क',
    navCitizen: 'नागरिक पोर्टल',
    navAdmin: 'प्रशासक डेस्क',
    panchayatName: 'वळिवडे ग्रामपंचायत (करवीर, कोल्हापूर)'
  },
  en: {
    heroTitle: 'Aapla Gaav — Valivade',
    heroSubtitle: '“Our Village. Our Progress. Our Future.”',
    navHome: 'Home',
    navProfile: 'Village Profile',
    navServices: 'Services',
    navProjects: 'Projects',
    navEducation: 'Education',
    navHealth: 'Health',
    navWater: 'Water & Sanitation',
    navAgriculture: 'Agriculture',
    navInfra: 'Infrastructure',
    navSchemes: 'Govt Schemes',
    navComplaints: 'Complaints',
    navAnnouncements: 'Announcements',
    navReports: 'Reports',
    navContact: 'Contact',
    navCitizen: 'Citizen Portal',
    navAdmin: 'Admin Desk',
    panchayatName: 'Valivade Gram Panchayat (Karvir, Kolhapur)'
  }
};

function initLanguage() {
  const savedLang = localStorage.getItem(AAPLA_STORAGE_KEYS.LANG) || 'en';
  applyLanguage(savedLang);
}

window.toggleLanguage = function() {
  const currentLang = localStorage.getItem(AAPLA_STORAGE_KEYS.LANG) || 'en';
  const newLang = currentLang === 'en' ? 'mr' : 'en';
  localStorage.setItem(AAPLA_STORAGE_KEYS.LANG, newLang);
  applyLanguage(newLang);
  showToast(newLang === 'mr' ? 'मराठी भाषा निवडली' : 'English language selected', 'info');
};

function applyLanguage(lang) {
  const dict = TRANSLATION_MAP[lang] || TRANSLATION_MAP.en;
  
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.textContent = lang === 'en' ? 'मराठी' : 'English';
  });

  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub) heroSub.textContent = dict.heroSubtitle;

  const govPill = document.querySelector('.hero-badge-pill span:last-child');
  if (govPill) govPill.textContent = dict.panchayatName;

  // Translate navigation links with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });
}

// 5. Shared Modals Controller
function initSharedModals() {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });
}

window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// 6. Citizen Authentication Modal Helper
window.openCitizenAuth = function() {
  const session = AaplaAuth.getCitizenSession();
  if (session) {
    renderCitizenDashboard(session);
    openModal('citizenDashboardModal');
  } else {
    openModal('citizenAuthModal');
  }
};

function checkCitizenSession() {
  const session = AaplaAuth.getCitizenSession();
  const cBadge = document.getElementById('citizenSessionBadge');
  if (cBadge && session) {
    cBadge.textContent = `👤 ${session.fullName}`;
    cBadge.style.display = 'inline-block';
  }
}

function renderCitizenDashboard(session) {
  const nameEl = document.getElementById('cdashCitizenName');
  const phoneEl = document.getElementById('cdashCitizenMobile');
  const wardEl = document.getElementById('cdashCitizenWard');
  if (nameEl) nameEl.textContent = session.fullName;
  if (phoneEl) phoneEl.textContent = `+91 ${session.mobile}`;
  if (wardEl) wardEl.textContent = session.ward || 'Ward No. 01';

  // Render recent complaints for this citizen
  const listEl = document.getElementById('cdashComplaintsList');
  if (listEl) {
    const complaints = AaplaData.getComplaints().filter(c => c.mobile === session.mobile);
    if (complaints.length === 0) {
      listEl.innerHTML = '<div style="padding: 12px; color: #64748b; font-size: 0.88rem;">No grievances filed yet. Use the Complaints page to lodge a grievance.</div>';
    } else {
      listEl.innerHTML = complaints.map(c => `
        <div style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 0.85rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>${c.id}</strong> — ${c.category}<br>
            <small style="color: #64748b;">${c.location}</small>
          </div>
          <span class="status-badge ${c.status === 'Resolved' ? 'completed' : 'progress'}">${c.status}</span>
        </div>
      `).join('');
    }
  }
}

// 7. Announcement Marquee Ticker
function initAnnouncementTicker() {
  const tickerEl = document.getElementById('tickerText');
  if (!tickerEl) return;
  const announcements = AaplaData.getAnnouncements();
  if (announcements.length > 0) {
    const tickerItems = announcements.map(a => `📢 [${a.category}] ${a.title} (${a.date})`).join(' &nbsp;&nbsp;|&nbsp;&nbsp; ');
    tickerEl.innerHTML = tickerItems;
  }
}

// 8. Shared Toast Notification System
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
};

// 9. Service application helper
window.openServiceApplyModal = function(serviceTitle) {
  const session = AaplaAuth.getCitizenSession();
  if (!session) {
    alert(`To apply for ${serviceTitle}, please sign in to the Citizen Portal.`);
    openCitizenAuth();
  } else {
    alert(`Application Initiated for ${serviceTitle}!\nApplicant: ${session.fullName}\nWard: ${session.ward}\n\nYour application request has been forwarded to Valivade Gram Panchayat desk.`);
  }
};
