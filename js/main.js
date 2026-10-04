/* ==========================================================================
   Aapla Gaav – CEP Landing Page Logic
   Vanilla JavaScript - UI Interactions & Forms
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initModals();
  initAuthForms();
  initGrievanceForm();
  initAnnouncementTicker();
  checkCurrentSessions();
  setupLanguageToggle();
});

// Modal Controller
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Reset any alert boxes
    const alertBox = modal.querySelector('.alert-message');
    if (alertBox) {
      alertBox.className = 'alert-message';
      alertBox.textContent = '';
    }
  }
}

function initModals() {
  // Close modal when clicking on overlay background or close button
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
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Citizen Portal button
  const citizenPortalBtn = document.getElementById('citizenPortalBtn');
  if (citizenPortalBtn) {
    citizenPortalBtn.addEventListener('click', function() {
      const session = AaplaAuth.getCitizenSession();
      if (session) {
        renderCitizenDashboard(session);
        openModal('citizenDashboardModal');
      } else {
        openModal('citizenAuthModal');
      }
    });
  }

  // Admin Login button
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', function() {
      openModal('adminLoginModal');
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#ffffff';
        navMenu.style.padding = '20px';
        navMenu.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      }
    });
  }
}

// Authentication Forms (Admin + Citizen)
function initAuthForms() {
  // 1. Admin Login Form
  const adminForm = document.getElementById('adminLoginForm');
  const adminAlert = document.getElementById('adminLoginAlert');
  const autoFillAdminBtn = document.getElementById('autoFillAdminBtn');

  if (autoFillAdminBtn) {
    autoFillAdminBtn.addEventListener('click', function() {
      document.getElementById('adminIdInput').value = DEMO_ADMIN.adminId;
      document.getElementById('adminPasswordInput').value = DEMO_ADMIN.password;
    });
  }

  if (adminForm) {
    adminForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const adminId = document.getElementById('adminIdInput').value;
      const password = document.getElementById('adminPasswordInput').value;

      const result = AaplaAuth.loginAdmin(adminId, password);
      if (result.success) {
        adminAlert.className = 'alert-message success';
        adminAlert.textContent = 'Login successful! Redirecting to Village Admin Dashboard...';
        setTimeout(function() {
          window.location.href = 'dashboard.html';
        }, 600);
      } else {
        adminAlert.className = 'alert-message error';
        adminAlert.textContent = result.message;
      }
    });
  }

  // 2. Citizen Tabs Switcher (Login, Register, Forgot)
  const tabLogin = document.getElementById('tabCitizenLogin');
  const tabRegister = document.getElementById('tabCitizenRegister');
  const viewLogin = document.getElementById('citizenLoginView');
  const viewRegister = document.getElementById('citizenRegisterView');
  const viewForgot = document.getElementById('citizenForgotView');
  const forgotLink = document.getElementById('citizenForgotLink');
  const backToLoginLink = document.getElementById('backToLoginLink');
  const citizenAlert = document.getElementById('citizenAuthAlert');

  function showCitizenView(view) {
    if (view === 'login') {
      viewLogin.style.display = 'block';
      viewRegister.style.display = 'none';
      viewForgot.style.display = 'none';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
    } else if (view === 'register') {
      viewLogin.style.display = 'none';
      viewRegister.style.display = 'block';
      viewForgot.style.display = 'none';
      tabLogin.classList.remove('active');
      tabRegister.classList.add('active');
    } else if (view === 'forgot') {
      viewLogin.style.display = 'none';
      viewRegister.style.display = 'none';
      viewForgot.style.display = 'block';
      tabLogin.classList.remove('active');
      tabRegister.classList.remove('active');
    }
    if (citizenAlert) {
      citizenAlert.className = 'alert-message';
      citizenAlert.textContent = '';
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => showCitizenView('login'));
  if (tabRegister) tabRegister.addEventListener('click', () => showCitizenView('register'));
  if (forgotLink) forgotLink.addEventListener('click', (e) => { e.preventDefault(); showCitizenView('forgot'); });
  if (backToLoginLink) backToLoginLink.addEventListener('click', (e) => { e.preventDefault(); showCitizenView('login'); });

  // Citizen Demo Autofill
  const autoFillCitizenBtn = document.getElementById('autoFillCitizenBtn');
  if (autoFillCitizenBtn) {
    autoFillCitizenBtn.addEventListener('click', function() {
      document.getElementById('citizenMobileInput').value = '9876543210';
      document.getElementById('citizenPasswordInput').value = 'Citizen@123';
    });
  }

  // Citizen Login Submit
  const citizenLoginForm = document.getElementById('citizenLoginForm');
  if (citizenLoginForm) {
    citizenLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const mobile = document.getElementById('citizenMobileInput').value;
      const pass = document.getElementById('citizenPasswordInput').value;

      const result = AaplaAuth.loginCitizen(mobile, pass);
      if (result.success) {
        citizenAlert.className = 'alert-message success';
        citizenAlert.textContent = 'Welcome back, ' + result.citizen.fullName + '!';
        setTimeout(function() {
          closeModal('citizenAuthModal');
          renderCitizenDashboard(result.citizen);
          openModal('citizenDashboardModal');
          updateNavForCitizen(result.citizen);
        }, 700);
      } else {
        citizenAlert.className = 'alert-message error';
        citizenAlert.textContent = result.message;
      }
    });
  }

  // Citizen Register Submit
  const citizenRegisterForm = document.getElementById('citizenRegisterForm');
  if (citizenRegisterForm) {
    citizenRegisterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const fullName = document.getElementById('regFullName').value;
      const mobile = document.getElementById('regMobile').value;
      const ward = document.getElementById('regWard').value;
      const pass = document.getElementById('regPassword').value;
      const confirmPass = document.getElementById('regConfirmPassword').value;

      if (pass !== confirmPass) {
        citizenAlert.className = 'alert-message error';
        citizenAlert.textContent = 'Passwords do not match. Please verify.';
        return;
      }

      const result = AaplaAuth.registerCitizen({
        fullName,
        mobile,
        ward,
        password: pass
      });

      if (result.success) {
        citizenAlert.className = 'alert-message success';
        citizenAlert.textContent = 'Account created successfully! Welcome, ' + result.citizen.fullName;
        setTimeout(function() {
          closeModal('citizenAuthModal');
          renderCitizenDashboard(result.citizen);
          openModal('citizenDashboardModal');
          updateNavForCitizen(result.citizen);
        }, 800);
      } else {
        citizenAlert.className = 'alert-message error';
        citizenAlert.textContent = result.message;
      }
    });
  }

  // Citizen Forgot Password Submit
  const citizenForgotForm = document.getElementById('citizenForgotForm');
  if (citizenForgotForm) {
    citizenForgotForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const mobile = document.getElementById('forgotMobile').value;
      const newPass = document.getElementById('forgotNewPass').value;

      const result = AaplaAuth.resetCitizenPassword(mobile, newPass);
      if (result.success) {
        citizenAlert.className = 'alert-message success';
        citizenAlert.textContent = result.message;
        setTimeout(() => showCitizenView('login'), 1200);
      } else {
        citizenAlert.className = 'alert-message error';
        citizenAlert.textContent = result.message;
      }
    });
  }
}

// Render Citizen Dashboard View
function renderCitizenDashboard(citizen) {
  const nameEl = document.getElementById('cdCitizenName');
  const wardEl = document.getElementById('cdCitizenWard');
  const phoneEl = document.getElementById('cdCitizenPhone');
  const listEl = document.getElementById('cdComplaintsList');

  if (nameEl) nameEl.textContent = citizen.fullName;
  if (wardEl) wardEl.textContent = citizen.ward || 'Ward 3';
  if (phoneEl) phoneEl.textContent = citizen.mobile;

  // Retrieve complaints filed by or for this ward
  if (listEl) {
    const allComplaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
    const myComplaints = allComplaints.filter(c => c.citizen === citizen.fullName || c.ward.includes(citizen.ward.replace('Ward No. ', 'Ward ')));

    if (myComplaints.length === 0) {
      listEl.innerHTML = '<p style="color: #64748b; font-size: 0.88rem; padding: 12px 0;">No active grievances logged yet. Use the button below to submit a request to the Gram Panchayat.</p>';
    } else {
      listEl.innerHTML = myComplaints.slice(0, 4).map(c => `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; font-size: 0.88rem; color: #0f172a;">${c.subject}</div>
            <div style="font-size: 0.75rem; color: #64748b;">ID: ${c.id} • ${c.category} • ${c.date}</div>
          </div>
          <span style="font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 99px; background: ${c.status === 'Resolved' ? '#dcfce7; color: #166534;' : c.status === 'In Progress' ? '#e0f2fe; color: #0369a1;' : '#fffbeb; color: #b45309;'}">
            ${c.status}
          </span>
        </div>
      `).join('');
    }
  }

  // Bind Citizen Logout
  const citizenLogoutBtn = document.getElementById('citizenLogoutBtn');
  if (citizenLogoutBtn) {
    citizenLogoutBtn.onclick = function() {
      AaplaAuth.logoutCitizen();
      closeModal('citizenDashboardModal');
      location.reload();
    };
  }
}

function updateNavForCitizen(citizen) {
  const citizenPortalBtn = document.getElementById('citizenPortalBtn');
  if (citizenPortalBtn) {
    citizenPortalBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      ${citizen.fullName.split(' ')[0]} (Citizen)
    `;
    citizenPortalBtn.classList.add('logged-in');
  }
}

// Grievance / Complaint submission from landing page
function initGrievanceForm() {
  const form = document.getElementById('publicGrievanceForm');
  const alertEl = document.getElementById('publicGrievanceAlert');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const citizenName = document.getElementById('grvName').value.trim();
      const mobile = document.getElementById('grvMobile').value.trim();
      const ward = document.getElementById('grvWard').value;
      const category = document.getElementById('grvCategory').value;
      const subject = document.getElementById('grvSubject').value.trim();
      const description = document.getElementById('grvDetails').value.trim();

      const complaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
      const newId = 'GRV-2026-' + String(complaints.length + 1).padStart(2, '0');

      const newGrievance = {
        id: newId,
        citizen: citizenName,
        mobile: mobile,
        ward: ward,
        category: category,
        subject: subject,
        description: description,
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High'
      };

      complaints.unshift(newGrievance);
      localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));

      if (alertEl) {
        alertEl.className = 'alert-message success';
        alertEl.style.display = 'block';
        alertEl.innerHTML = `<strong>Grievance Registered Successfully!</strong> Your tracking ID is <code>${newId}</code>. The Gram Panchayat administrator will review this shortly.`;
      }
      form.reset();
      
      // Auto-hide after 6 seconds
      setTimeout(() => {
        if (alertEl) alertEl.style.display = 'none';
      }, 6000);
    });
  }
}

// Announcement Ticker
function initAnnouncementTicker() {
  const tickerEl = document.getElementById('tickerText');
  if (tickerEl) {
    const notices = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.NOTICES) || '[]');
    if (notices.length > 0) {
      tickerEl.textContent = notices.map(n => '📢 ' + n.text).join('   |   ');
    }
  }
}

// Check sessions on initial load
function checkCurrentSessions() {
  const citizen = AaplaAuth.getCitizenSession();
  if (citizen) {
    updateNavForCitizen(citizen);
  }
  
  // If URL has ?login=admin, auto-trigger the admin login modal
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'admin') {
    openModal('adminLoginModal');
  }
}

// Language toggle simulation (English / Marathi)
function setupLanguageToggle() {
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      const lang = this.value;
      const subtitle = document.querySelector('.hero-subtitle');
      const tag = document.querySelector('.hero-badge-pill');
      if (lang === 'mr') {
        if (subtitle) subtitle.textContent = '“आमचे गाव. आमचा विकास. आमचे भविष्य.”';
        if (tag) tag.innerHTML = '🚩 ग्रामपंचायत आपले गाव, नागपूर (महाराष्ट्र)';
      } else {
        if (subtitle) subtitle.textContent = '“Our Village. Our Progress. Our Future.”';
        if (tag) tag.innerHTML = '🚩 Gram Panchayat Aapla Gaav, Nagpur (Maharashtra)';
      }
    });
  }
}

// Interactive helper for Service application buttons
window.openServiceModal = function(serviceName) {
  const session = AaplaAuth.getCitizenSession();
  if (!session) {
    alert(`To apply for ${serviceName}, please sign in to the Citizen Portal.`);
    openModal('citizenAuthModal');
  } else {
    alert(`Application Initiated for ${serviceName}.\nApplicant: ${session.fullName}\nWard: ${session.ward}\n\nYour preliminary request token has been forwarded to the Gram Sevak desk!`);
  }
};
