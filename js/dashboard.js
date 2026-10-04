/* ==========================================================================
   Aapla Gaav – CEP Administrator Dashboard Logic
   Pure Vanilla JavaScript - Village Management, CEP Scoring, Projects,
   Citizens Directory, and Grievance Redressal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  checkAdminAuthentication();
  initViewSwitcher();
  initDashboardHeader();
  renderVillageProfile();
  renderStatisticsCards();
  renderCepPerformance();
  initCepSliders();
  renderProjectsTable();
  renderComplaintsTable();
  renderCitizensTable();
  initNoticeBoard();
  initNotifications();
  initSidebarToggle();
  initFormListeners();
});

// Guard admin access
function checkAdminAuthentication() {
  const session = AaplaAuth.getAdminSession();
  if (!session) {
    const authChoice = confirm('Administrator session not detected.\n\nWould you like to initialize the Demo Sarpanch session for Aapla Gaav? Click OK to load demo administrator session, or Cancel to return to the landing page.');
    if (authChoice) {
      AaplaAuth.loginAdmin(DEMO_ADMIN.adminId, DEMO_ADMIN.password);
      window.location.reload();
    } else {
      window.location.href = 'index.html?login=admin';
    }
  }
}

/* ==========================================================================
   VIEW SWITCHER (SINGLE-PAGE APPLICATION LOGIC)
   ========================================================================== */
function initViewSwitcher() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetView = this.getAttribute('data-view');
      if (targetView) {
        switchView(targetView);
      }
    });
  });

  // Check URL hash if direct link provided (e.g. #projects)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchedLink = Array.from(sidebarLinks).find(l => l.getAttribute('href') === '#' + hash);
    if (matchedLink) {
      switchView(matchedLink.getAttribute('data-view'));
    }
  }
}

window.switchView = function(viewId) {
  // Hide all views
  document.querySelectorAll('.dash-view').forEach(view => {
    view.classList.remove('active');
  });

  // Show target view
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active sidebar link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-view') === viewId) {
      link.classList.add('active');
    }
  });

  // Close mobile sidebar if open
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (sidebar) sidebar.classList.remove('open');
};

/* ==========================================================================
   DASHBOARD HEADER & TIME
   ========================================================================== */
function initDashboardHeader() {
  const dateEl = document.getElementById('currentDateDisplay');
  if (dateEl) {
    const now = new Date();
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-IN', options);
  }

  const updateEl = document.getElementById('lastUpdateDisplay');
  if (updateEl) {
    const lastUpdate = localStorage.getItem(AAPLA_STORAGE_KEYS.LAST_UPDATE) || 'Today, 08:30 PM';
    updateEl.textContent = 'Last synced: ' + lastUpdate;
  }

  const session = AaplaAuth.getAdminSession() || DEMO_ADMIN;
  const adminNameEl = document.getElementById('adminNameDisplay');
  const adminRoleEl = document.getElementById('adminRoleDisplay');
  if (adminNameEl) adminNameEl.textContent = session.name || 'Shri. Rajesh Patil';
  if (adminRoleEl) adminRoleEl.textContent = (session.role || 'Sarpanch') + ' • ' + (session.village || 'Aapla Gaav');

  const logoutButtons = document.querySelectorAll('.logout-trigger');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out from the Village Administrator portal?')) {
        AaplaAuth.logoutAdmin();
      }
    });
  });
}

/* ==========================================================================
   STEP 3 — VILLAGE PROFILE MANAGEMENT
   ========================================================================== */
function renderVillageProfile() {
  const profile = AaplaAuth.getVillageProfile();
  if (!profile.villageName) return;

  // Header and sidebar synchronization
  const sbName = document.getElementById('sidebarVillageName');
  if (sbName) sbName.textContent = profile.villageName;

  const bannerLoc = document.getElementById('bannerLocationText');
  if (bannerLoc) {
    bannerLoc.textContent = `${profile.villageName}, ${profile.district}, ${profile.state}`;
  }

  // Profile view elements
  const elMap = {
    vpHeaderTitle: `${profile.villageName} Gram Panchayat Profile`,
    vpHeaderSubtitle: `${profile.taluka} Taluka, ${profile.district} District, ${profile.state}`,
    vpVillageName: profile.villageName,
    vpDistState: `${profile.district}, ${profile.state}`,
    vpTaluka: profile.taluka,
    vpPopulation: Number(profile.population).toLocaleString('en-IN'),
    vpHouseholds: Number(profile.households).toLocaleString('en-IN'),
    vpArea: profile.villageArea,
    vpLiteracy: profile.literacyRate,
    vpGender: `${Number(profile.malePopulation).toLocaleString('en-IN')} Male / ${Number(profile.femalePopulation).toLocaleString('en-IN')} Female`,
    vpOccupations: profile.mainOccupations,
    vpCrops: profile.mainCrops,
    vpContact: profile.contactInfo
  };

  for (const [id, val] of Object.entries(elMap)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Dashboard Stats card updates
  const popVal = document.getElementById('popVal');
  if (popVal) popVal.textContent = Number(profile.population).toLocaleString('en-IN');

  const houseVal = document.getElementById('houseVal');
  if (houseVal) houseVal.textContent = Number(profile.households).toLocaleString('en-IN');

  const genderSplit = document.getElementById('popGenderSplit');
  if (genderSplit) {
    genderSplit.textContent = `${Number(profile.malePopulation).toLocaleString('en-IN')} M / ${Number(profile.femalePopulation).toLocaleString('en-IN')} F`;
  }

  // Populate Edit Modal inputs
  document.getElementById('inpVillageName').value = profile.villageName || '';
  document.getElementById('inpDistrict').value = profile.district || '';
  document.getElementById('inpTaluka').value = profile.taluka || '';
  document.getElementById('inpState').value = profile.state || '';
  document.getElementById('inpPopulation').value = profile.population || 8542;
  document.getElementById('inpHouseholds').value = profile.households || 1982;
  document.getElementById('inpArea').value = profile.villageArea || '';
  document.getElementById('inpLiteracy').value = profile.literacyRate || '';
  document.getElementById('inpMalePop').value = profile.malePopulation || 4390;
  document.getElementById('inpFemalePop').value = profile.femalePopulation || 4152;
  document.getElementById('inpOccupations').value = profile.mainOccupations || '';
  document.getElementById('inpCrops').value = profile.mainCrops || '';
  document.getElementById('inpContact').value = profile.contactInfo || '';
}

function handleSaveVillageProfile(e) {
  e.preventDefault();
  const updatedProfile = {
    villageName: document.getElementById('inpVillageName').value.trim(),
    district: document.getElementById('inpDistrict').value.trim(),
    taluka: document.getElementById('inpTaluka').value.trim(),
    state: document.getElementById('inpState').value.trim(),
    population: Number(document.getElementById('inpPopulation').value),
    households: Number(document.getElementById('inpHouseholds').value),
    villageArea: document.getElementById('inpArea').value.trim(),
    literacyRate: document.getElementById('inpLiteracy').value.trim(),
    malePopulation: Number(document.getElementById('inpMalePop').value),
    femalePopulation: Number(document.getElementById('inpFemalePop').value),
    mainOccupations: document.getElementById('inpOccupations').value.trim(),
    mainCrops: document.getElementById('inpCrops').value.trim(),
    contactInfo: document.getElementById('inpContact').value.trim()
  };

  AaplaAuth.saveVillageProfile(updatedProfile);
  renderVillageProfile();
  closeModal('editVillageProfileModal');
  alert('Village profile updated and saved to localStorage successfully!');
}

/* ==========================================================================
   STEP 4 — CEP PERFORMANCE & INDICATOR MANAGEMENT
   ========================================================================== */
function calculateOverallCepScore(scores) {
  const values = Object.values(scores);
  if (values.length === 0) return 78;
  const sum = values.reduce((acc, curr) => acc + Number(curr), 0);
  return Math.round(sum / values.length);
}

function renderCepPerformance() {
  const scores = AaplaAuth.getCepScores();
  const overallScore = calculateOverallCepScore(scores);

  // Update Dashboard main stat card
  const cepVal = document.getElementById('cepVal');
  if (cepVal) cepVal.textContent = `${overallScore}/100`;

  // Sidebar badge
  const sbBadge = document.getElementById('sidebarCepBadge');
  if (sbBadge) sbBadge.textContent = `${overallScore}%`;

  // Radial chart update
  const circle = document.querySelector('.radial-progress');
  const scoreText = document.getElementById('cepScoreRadialVal');
  if (circle) {
    const radius = 90;
    const circumference = 2 * Math.PI * radius; // 565.48
    circle.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (overallScore / 100) * circumference;
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 100);
  }
  if (scoreText) scoreText.textContent = overallScore;

  // Grade badge
  const gradePill = document.getElementById('cepGradePill');
  if (gradePill) {
    if (overallScore >= 80) gradePill.textContent = 'Grade A+ (Exemplary)';
    else if (overallScore >= 70) gradePill.textContent = 'Grade A (High)';
    else gradePill.textContent = 'Grade B (Developing)';
  }

  // Categories list
  const categories = [
    { key: 'water', name: 'Water & Sanitation', score: scores.water || 88, class: 'fill-water', icon: '💧' },
    { key: 'education', name: 'Education', score: scores.education || 82, class: 'fill-education', icon: '🎓' },
    { key: 'agriculture', name: 'Agriculture', score: scores.agriculture || 81, class: 'fill-agri', icon: '🌾' },
    { key: 'digital', name: 'Digital Services', score: scores.digital || 76, class: 'fill-digital', icon: '💻' },
    { key: 'health', name: 'Health', score: scores.health || 74, class: 'fill-health', icon: '🏥' },
    { key: 'environment', name: 'Environment', score: scores.environment || 72, class: 'fill-enviro', icon: '🌳' },
    { key: 'infrastructure', name: 'Infrastructure', score: scores.infrastructure || 69, class: 'fill-infra', icon: '🛣️' }
  ];

  // Update Sector detail headers
  const eduDisplay = document.querySelector('.val-edu-display');
  if (eduDisplay) eduDisplay.textContent = `${scores.education}%`;
  const healthDisplay = document.querySelector('.val-health-display');
  if (healthDisplay) healthDisplay.textContent = `${scores.health}%`;
  const waterDisplay = document.querySelector('.val-water-display');
  if (waterDisplay) waterDisplay.textContent = `${scores.water}%`;
  const agriDisplay = document.querySelector('.val-agri-display');
  if (agriDisplay) agriDisplay.textContent = `${scores.agriculture}%`;
  const infraDisplay = document.querySelector('.val-infra-display');
  if (infraDisplay) infraDisplay.textContent = `${scores.infrastructure}%`;

  // Render breakdown bars
  const barsContainer = document.getElementById('cepBreakdownList');
  if (barsContainer) {
    barsContainer.innerHTML = categories.map(cat => `
      <div class="breakdown-item">
        <div class="breakdown-info">
          <span class="breakdown-title">${cat.icon} ${cat.name}</span>
          <span class="breakdown-pct">${cat.score}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${cat.class}" style="width: ${cat.score}%;"></div>
        </div>
      </div>
    `).join('');
  }

  renderHistoricalTrendSvg(overallScore);
}

function initCepSliders() {
  const scores = AaplaAuth.getCepScores();
  const sliders = {
    sliderEducation: scores.education || 82,
    sliderHealth: scores.health || 74,
    sliderWater: scores.water || 88,
    sliderInfra: scores.infrastructure || 69,
    sliderAgri: scores.agriculture || 81,
    sliderEnviro: scores.environment || 72,
    sliderDigital: scores.digital || 76
  };

  for (const [id, val] of Object.entries(sliders)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  onCepSliderChange();
}

window.onCepSliderChange = function() {
  const scores = {
    education: Number(document.getElementById('sliderEducation').value),
    health: Number(document.getElementById('sliderHealth').value),
    water: Number(document.getElementById('sliderWater').value),
    infrastructure: Number(document.getElementById('sliderInfra').value),
    agriculture: Number(document.getElementById('sliderAgri').value),
    environment: Number(document.getElementById('sliderEnviro').value),
    digital: Number(document.getElementById('sliderDigital').value)
  };

  document.getElementById('valEducation').textContent = `${scores.education}%`;
  document.getElementById('valHealth').textContent = `${scores.health}%`;
  document.getElementById('valWater').textContent = `${scores.water}%`;
  document.getElementById('valInfra').textContent = `${scores.infrastructure}%`;
  document.getElementById('valAgri').textContent = `${scores.agriculture}%`;
  document.getElementById('valEnviro').textContent = `${scores.environment}%`;
  document.getElementById('valDigital').textContent = `${scores.digital}%`;

  const calc = calculateOverallCepScore(scores);
  const calcEl = document.getElementById('cepEditorCalculatedScore');
  if (calcEl) calcEl.textContent = calc;
};

window.saveCepEditorScores = function() {
  const scores = {
    education: Number(document.getElementById('sliderEducation').value),
    health: Number(document.getElementById('sliderHealth').value),
    water: Number(document.getElementById('sliderWater').value),
    infrastructure: Number(document.getElementById('sliderInfra').value),
    agriculture: Number(document.getElementById('sliderAgri').value),
    environment: Number(document.getElementById('sliderEnviro').value),
    digital: Number(document.getElementById('sliderDigital').value)
  };

  AaplaAuth.saveCepScores(scores);
  renderCepPerformance();
  alert('CEP Indicator scores updated successfully! All gauges and breakdown bars have been refreshed.');
};

function renderHistoricalTrendSvg(currentScore = 78) {
  const container = document.getElementById('cepTrendChart');
  if (!container) return;

  const svg = `
    <svg viewBox="0 0 500 120" style="width: 100%; height: auto;">
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
      <line x1="40" y1="55" x2="480" y2="55" stroke="#f1f5f9" stroke-width="1" />
      <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" stroke-width="1" />
      <path d="M 60,90 L 160,80 L 260,68 L 360,56 L 460,${110 - currentScore} L 460,105 L 60,105 Z" fill="url(#trendGradient)" />
      <path d="M 60,90 L 160,80 L 260,68 L 360,56 L 460,${110 - currentScore}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" />
      
      <circle cx="60" cy="90" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2.5" />
      <text x="60" y="115" font-size="10" fill="#64748b" text-anchor="middle">Q3 '25 (68%)</text>

      <circle cx="160" cy="80" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2.5" />
      <text x="160" y="115" font-size="10" fill="#64748b" text-anchor="middle">Q4 '25 (71%)</text>

      <circle cx="260" cy="68" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2.5" />
      <text x="260" y="115" font-size="10" fill="#64748b" text-anchor="middle">Q1 '26 (74%)</text>

      <circle cx="360" cy="56" r="4" fill="#ffffff" stroke="#10b981" stroke-width="2.5" />
      <text x="360" y="115" font-size="10" fill="#64748b" text-anchor="middle">Q2 '26 (76%)</text>

      <circle cx="460" cy="${110 - currentScore}" r="5" fill="#10b981" stroke="#ffffff" stroke-width="2.5" />
      <text x="460" y="115" font-size="10" font-weight="700" fill="#10b981" text-anchor="middle">Current (${currentScore}%)</text>
    </svg>
  `;
  container.innerHTML = svg;
}

/* ==========================================================================
   STEP 4 — PROJECTS, DEVELOPMENT & CEP (CRUD SYSTEM)
   ========================================================================== */
let currentProjectFilter = 'all';

function getProjects() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS) || '[]');
}

function saveProjects(projects) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }));
  renderProjectsTable();
  renderStatisticsCards();
}

function renderProjectsTable() {
  const projects = getProjects();
  
  // Update counters
  const totalCountEl = document.getElementById('countAllProjects');
  if (totalCountEl) totalCountEl.textContent = projects.length;
  const dashProjEl = document.getElementById('projVal');
  if (dashProjEl) dashProjEl.textContent = projects.length;
  const sbProjEl = document.getElementById('sidebarProjectsBadge');
  if (sbProjEl) sbProjEl.textContent = projects.length;

  const nearingCount = projects.filter(p => p.progress >= 85 && p.progress < 100).length;
  const footerNote = document.getElementById('dashProjectsFooter');
  if (footerNote) footerNote.textContent = `${nearingCount} Nearing Completion`;

  // Render Full Projects Table
  const fullTbody = document.getElementById('projectsFullTableBody');
  if (fullTbody) {
    let list = projects;
    if (currentProjectFilter !== 'all') {
      list = projects.filter(p => p.status.toLowerCase() === currentProjectFilter.toLowerCase());
    }

    if (list.length === 0) {
      fullTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color:#64748b;">No projects found for filter: ${currentProjectFilter}</td></tr>`;
    } else {
      fullTbody.innerHTML = list.map(p => {
        const statusClass = p.status.toLowerCase().replace(' ', '-');
        return `
          <tr>
            <td>
              <strong>${p.name}</strong><br>
              <small style="color: #64748b;">${p.id} • ${p.department}</small>
            </td>
            <td><small>${p.location}</small></td>
            <td><strong>${p.budget}</strong></td>
            <td><small style="color: #0369a1;">${p.spent || '—'}</small></td>
            <td><small>${p.startDate} → ${p.expectedCompletionDate}</small></td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="flex-grow: 1; height: 6px; background: #e2e8f0; border-radius: 99px; overflow: hidden; min-width: 60px;">
                  <div style="width: ${p.progress}%; height: 100%; background: ${p.progress === 100 ? '#10b981' : p.progress > 80 ? '#3b82f6' : '#f59e0b'};"></div>
                </div>
                <span style="font-weight: 700; font-size: 0.76rem;">${p.progress}%</span>
              </div>
            </td>
            <td><span class="status-badge ${statusClass}">${p.status}</span></td>
            <td>
              <div style="display: flex; gap: 4px;">
                <button class="action-icon-btn" onclick="viewProjectDetails('${p.id}')" title="View details">👁</button>
                <button class="action-icon-btn edit" onclick="openEditProjectModal('${p.id}')" title="Edit project">✎</button>
                <button class="action-icon-btn delete" onclick="deleteProject('${p.id}')" title="Delete project">🗑</button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Dashboard Glance Table (top 4)
  const glanceTbody = document.getElementById('dashGlanceProjectsBody');
  if (glanceTbody) {
    glanceTbody.innerHTML = projects.slice(0, 4).map(p => {
      const statusClass = p.status.toLowerCase().replace(' ', '-');
      return `
        <tr>
          <td><strong>${p.name}</strong><br><small style="color:#64748b;">${p.id}</small></td>
          <td><strong>${p.budget}</strong></td>
          <td>
            <div style="display: flex; align-items: center; gap: 6px;">
              <div style="width: 50px; height: 5px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
                <div style="width: ${p.progress}%; height: 100%; background: #10b981;"></div>
              </div>
              <small style="font-weight: 700;">${p.progress}%</small>
            </div>
          </td>
          <td><span class="status-badge ${statusClass}">${p.status}</span></td>
        </tr>
      `;
    }).join('');
  }
}

window.filterProjectsList = function(status, btnElement) {
  currentProjectFilter = status;
  document.querySelectorAll('.project-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderProjectsTable();
};

window.openAddProjectModal = function() {
  document.getElementById('projectModalTitle').textContent = 'Add Village Development Project';
  document.getElementById('projFormMode').value = 'add';
  document.getElementById('projFormId').value = '';
  document.getElementById('projectForm').reset();
  openModal('projectModal');
};

window.openEditProjectModal = function(projectId) {
  const projects = getProjects();
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById('projectModalTitle').textContent = `Edit Project — ${proj.id}`;
  document.getElementById('projFormMode').value = 'edit';
  document.getElementById('projFormId').value = proj.id;

  document.getElementById('projInpName').value = proj.name;
  document.getElementById('projInpDept').value = proj.department;
  document.getElementById('projInpCategory').value = proj.category;
  document.getElementById('projInpLocation').value = proj.location;
  document.getElementById('projInpBudget').value = proj.budgetNum || parseInt(proj.budget.replace(/[^0-9]/g, '')) || 0;
  document.getElementById('projInpSpent').value = proj.spentNum || parseInt(proj.spent.replace(/[^0-9]/g, '')) || 0;
  document.getElementById('projInpStart').value = proj.startDate;
  document.getElementById('projInpEnd').value = proj.expectedCompletionDate;
  document.getElementById('projInpProgress').value = proj.progress;
  document.getElementById('projInpStatus').value = proj.status;
  document.getElementById('projInpDesc').value = proj.description;

  openModal('projectModal');
};

window.deleteProject = function(projectId) {
  if (confirm(`Are you sure you want to permanently delete project ${projectId}?`)) {
    const projects = getProjects().filter(p => p.id !== projectId);
    saveProjects(projects);
    alert(`Project ${projectId} deleted successfully.`);
  }
};

window.viewProjectDetails = function(projectId) {
  const proj = getProjects().find(p => p.id === projectId);
  if (!proj) return;

  const content = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 16px;">
      <h4 style="font-size: 1.15rem; color: #0f172a; margin-bottom: 4px;">${proj.name}</h4>
      <div style="font-size: 0.82rem; color: #64748b;">
        <strong>ID:</strong> ${proj.id} | <strong>Dept:</strong> ${proj.department} | <strong>Category:</strong> ${proj.category}
      </div>
    </div>

    <div class="profile-meta-grid" style="margin-bottom: 16px;">
      <div class="profile-meta-box">
        <div class="meta-label">Location / Site</div>
        <div class="meta-value" style="font-size: 0.95rem;">${proj.location}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Status</div>
        <div class="meta-value" style="font-size: 0.95rem;">${proj.status} (${proj.progress}%)</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Sanctioned Budget</div>
        <div class="meta-value">${proj.budget}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Amount Spent to Date</div>
        <div class="meta-value" style="color: #0369a1;">${proj.spent}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Start Date</div>
        <div class="meta-value" style="font-size: 0.9rem;">${proj.startDate}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Target Completion</div>
        <div class="meta-value" style="font-size: 0.9rem;">${proj.expectedCompletionDate}</div>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
      <div class="meta-label" style="margin-bottom: 6px;">Project Scope & Description</div>
      <p style="font-size: 0.88rem; color: #334155; line-height: 1.5;">${proj.description}</p>
    </div>
  `;

  document.getElementById('pdTitle').textContent = `Project Inspection: ${proj.name}`;
  document.getElementById('pdContent').innerHTML = content;
  openModal('projectDetailsModal');
};

function handleSaveProject(e) {
  e.preventDefault();
  const mode = document.getElementById('projFormMode').value;
  const id = document.getElementById('projFormId').value;
  const projects = getProjects();

  const budgetNum = Number(document.getElementById('projInpBudget').value);
  const spentNum = Number(document.getElementById('projInpSpent').value);

  const formatCurrency = num => '₹' + num.toLocaleString('en-IN');

  const projectData = {
    name: document.getElementById('projInpName').value.trim(),
    department: document.getElementById('projInpDept').value.trim(),
    category: document.getElementById('projInpCategory').value,
    location: document.getElementById('projInpLocation').value.trim(),
    budget: formatCurrency(budgetNum),
    budgetNum: budgetNum,
    spent: formatCurrency(spentNum),
    spentNum: spentNum,
    startDate: document.getElementById('projInpStart').value,
    expectedCompletionDate: document.getElementById('projInpEnd').value,
    progress: Number(document.getElementById('projInpProgress').value),
    status: document.getElementById('projInpStatus').value,
    description: document.getElementById('projInpDesc').value.trim()
  };

  if (mode === 'add') {
    const nextId = 'PRJ-2026-' + String(projects.length + 1).padStart(2, '0');
    projectData.id = nextId;
    projects.push(projectData);
    saveProjects(projects);
    closeModal('projectModal');
    alert(`Project ${nextId} added successfully!`);
  } else {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projectData.id = id;
      projects[index] = projectData;
      saveProjects(projects);
      closeModal('projectModal');
      alert(`Project ${id} updated successfully!`);
    }
  }
}

/* ==========================================================================
   STEP 5 — CITIZENS, COMPLAINTS & SERVICES (COMPLAINT SYSTEM)
   ========================================================================== */
let currentComplaintFilter = 'all';

function getComplaints() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
}

function saveComplaints(complaints) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }));
  renderComplaintsTable();
  renderStatisticsCards();
}

function renderComplaintsTable() {
  const complaints = getComplaints();

  // Statistics calculation
  const total = complaints.length;
  const newCount = complaints.filter(c => c.status === 'Submitted').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  // Update Stat tiles
  const totalEl = document.getElementById('cStatTotal');
  if (totalEl) totalEl.textContent = total;
  const newEl = document.getElementById('cStatNew');
  if (newEl) newEl.textContent = newCount;
  const progEl = document.getElementById('cStatInProgress');
  if (progEl) progEl.textContent = inProgress;
  const resEl = document.getElementById('cStatResolved');
  if (resEl) resEl.textContent = resolved;

  // Main Dashboard stat card
  const pendingDashboard = newCount + inProgress;
  const compVal = document.getElementById('compVal');
  if (compVal) compVal.textContent = pendingDashboard;

  // Sidebar badge
  const sbComp = document.getElementById('sidebarComplaintsBadge');
  if (sbComp) sbComp.textContent = pendingDashboard;

  // Render Full Table
  const tbody = document.getElementById('complaintsFullTableBody');
  if (tbody) {
    let list = complaints;
    if (currentComplaintFilter !== 'all') {
      list = complaints.filter(c => c.status.toLowerCase() === currentComplaintFilter.toLowerCase());
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 20px; color:#64748b;">No complaints found for status: ${currentComplaintFilter}</td></tr>`;
    } else {
      tbody.innerHTML = list.map(c => {
        const statusClass = c.status.toLowerCase().replace(' ', '-');
        const prioClass = (c.priority || 'medium').toLowerCase();
        return `
          <tr>
            <td>
              <strong>${c.id}</strong><br>
              <small style="color: #64748b;">${c.date}</small>
            </td>
            <td>
              <strong>${c.name}</strong><br>
              <small style="color: #0369a1;">📞 ${c.mobile}</small>
            </td>
            <td><strong>${c.category}</strong></td>
            <td><small>${c.location || 'Gaothan'}</small></td>
            <td><span class="priority-pill ${prioClass}">${c.priority || 'Medium'}</span></td>
            <td><span class="status-badge ${statusClass}">${c.status}</span></td>
            <td><small>${c.assignedTo || 'Unassigned'}</small></td>
            <td>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                <button class="action-icon-btn" onclick="viewComplaintDetails('${c.id}')" title="View full complaint & attachment">Details</button>
                <button class="action-icon-btn edit" onclick="openComplaintActionModal('${c.id}')" title="Assign / Update status">Update</button>
                ${c.status !== 'Resolved' ? `
                  <button class="action-icon-btn resolve" onclick="markComplaintResolved('${c.id}')" title="Instant Resolve">✓</button>
                ` : ''}
              </div>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Dashboard Glance complaints (top 4)
  const glanceTbody = document.getElementById('dashGlanceComplaintsBody');
  if (glanceTbody) {
    glanceTbody.innerHTML = complaints.slice(0, 4).map(c => {
      const statusClass = c.status.toLowerCase().replace(' ', '-');
      const prioClass = (c.priority || 'medium').toLowerCase();
      return `
        <tr>
          <td><strong>${c.id}</strong><br><small style="color:#64748b;">${c.category} - ${c.name}</small></td>
          <td><small>${c.category}</small></td>
          <td><span class="priority-pill ${prioClass}">${c.priority || 'Medium'}</span></td>
          <td><span class="status-badge ${statusClass}">${c.status}</span></td>
        </tr>
      `;
    }).join('');
  }
}

window.filterComplaintsView = function(status, btnElement) {
  currentComplaintFilter = status;
  document.querySelectorAll('.c-filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
  renderComplaintsTable();
};

window.openComplaintActionModal = function(complaintId) {
  const c = getComplaints().find(x => x.id === complaintId);
  if (!c) return;

  document.getElementById('caTitle').textContent = `Manage Grievance ${c.id}`;
  document.getElementById('caComplaintId').value = c.id;
  document.getElementById('caRefDisplay').textContent = `${c.id} — ${c.name} (${c.category})`;
  document.getElementById('caAssignee').value = c.assignedTo || 'Gram Sevak Smt. Sunita Kulkarni';
  document.getElementById('caStatus').value = c.status;
  document.getElementById('caResponse').value = c.adminResponse || '';

  openModal('complaintActionModal');
};

function handleSaveComplaintAction(e) {
  e.preventDefault();
  const id = document.getElementById('caComplaintId').value;
  const assignee = document.getElementById('caAssignee').value;
  const status = document.getElementById('caStatus').value;
  const response = document.getElementById('caResponse').value.trim();

  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === id);
  if (index !== -1) {
    complaints[index].assignedTo = assignee;
    complaints[index].status = status;
    complaints[index].adminResponse = response;
    saveComplaints(complaints);
    closeModal('complaintActionModal');
    alert(`Complaint ${id} updated to status "${status}" with response recorded.`);
  }
}

window.markComplaintResolved = function(complaintId) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    complaints[index].status = 'Resolved';
    if (!complaints[index].adminResponse) {
      complaints[index].adminResponse = 'Inspected and resolved on priority by Gram Panchayat Sarpanch desk.';
    }
    saveComplaints(complaints);
    alert(`Complaint ${complaintId} has been marked as Resolved!`);
  }
};

window.viewComplaintDetails = function(complaintId) {
  const c = getComplaints().find(x => x.id === complaintId);
  if (!c) return;

  const content = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <h4 style="font-size: 1.15rem; color: #0f172a; margin: 0;">Ticket: ${c.id}</h4>
        <span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span>
      </div>
      <div style="font-size: 0.84rem; color: #64748b;">
        Filed on: <strong>${c.date}</strong> | Priority: <strong>${c.priority || 'Medium'}</strong>
      </div>
    </div>

    <div class="profile-meta-grid" style="margin-bottom: 14px;">
      <div class="profile-meta-box">
        <div class="meta-label">Citizen Name</div>
        <div class="meta-value" style="font-size: 0.95rem;">${c.name}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Contact Mobile</div>
        <div class="meta-value" style="font-size: 0.95rem;">📞 ${c.mobile}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Category</div>
        <div class="meta-value" style="font-size: 0.95rem;">${c.category}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Location / Ward</div>
        <div class="meta-value" style="font-size: 0.95rem;">${c.location || 'Gaothan'}</div>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
      <div class="meta-label" style="margin-bottom: 4px;">Citizen Grievance Description</div>
      <p style="font-size: 0.88rem; color: #334155; line-height: 1.5;">${c.description}</p>
    </div>

    ${c.imageAttachment ? `
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px;">
        <div class="meta-label" style="margin-bottom: 6px;">Uploaded Photo Evidence</div>
        <img src="${c.imageAttachment}" alt="Complaint Photo" style="max-width: 100%; border-radius: 6px; max-height: 200px; object-fit: contain;">
      </div>
    ` : ''}

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px;">
      <div class="meta-label" style="color: #166534; margin-bottom: 4px;">Assigned Officer & Official Action Taken</div>
      <div style="font-size: 0.85rem; font-weight: 700; color: #166534;">${c.assignedTo || 'Unassigned'}</div>
      <p style="font-size: 0.82rem; color: #14532d; margin-top: 4px; line-height: 1.4;">
        ${c.adminResponse || 'Awaiting initial inspection report from assigned officer.'}
      </p>
    </div>
  `;

  document.getElementById('cdTitle').textContent = `Investigation File: ${c.id}`;
  document.getElementById('cdContent').innerHTML = content;
  openModal('complaintDetailsModal');
};

/* ==========================================================================
   STEP 5 — CITIZEN MANAGEMENT DIRECTORY
   ========================================================================== */
function getCitizens() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
}

function renderCitizensTable() {
  const citizens = getCitizens();
  const regCountEl = document.getElementById('cRegCount');
  if (regCountEl) regCountEl.textContent = (1420 + citizens.length - 2).toLocaleString('en-IN');

  const tbody = document.getElementById('citizensTableBody');
  if (!tbody) return;

  tbody.innerHTML = citizens.map(c => `
    <tr>
      <td><strong>${c.fullName}</strong></td>
      <td><strong>📞 ${c.mobile}</strong></td>
      <td>${c.area || 'Ward 1'}</td>
      <td><small>${c.registeredDate || '2026-08-14'}</small></td>
      <td><span class="status-badge ${c.status === 'Active' ? 'completed' : 'pending'}">${c.status || 'Active'}</span></td>
      <td>
        <button class="action-icon-btn" onclick="alert('Viewing Citizen Dossier for ${c.fullName}. Ward: ${c.area}, Mobile: ${c.mobile}.')">View</button>
      </td>
    </tr>
  `).join('');
}

window.filterCitizensTable = function() {
  const query = document.getElementById('citizenSearchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#citizensTableBody tr');
  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
};

function handleAddCitizen(e) {
  e.preventDefault();
  const fullName = document.getElementById('cInpName').value.trim();
  const mobile = document.getElementById('cInpMobile').value.trim();
  const area = document.getElementById('cInpArea').value;
  const pass = document.getElementById('cInpPass').value.trim();

  const res = AaplaAuth.registerCitizen({
    fullName: fullName,
    mobile: mobile,
    area: area,
    password: pass
  });

  if (res.success) {
    renderCitizensTable();
    closeModal('addCitizenModal');
    alert(`Citizen account created successfully for ${fullName}!`);
  } else {
    alert(res.message);
  }
}

/* ==========================================================================
   STATISTICS & MISCELLANEOUS
   ========================================================================== */
function renderStatisticsCards() {
  const profile = AaplaAuth.getVillageProfile();
  const complaints = getComplaints();
  const projects = getProjects();
  const scores = AaplaAuth.getCepScores();
  const overallCep = calculateOverallCepScore(scores);

  const pendingComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  const statValues = {
    popVal: Number(profile.population || 8542).toLocaleString('en-IN'),
    houseVal: Number(profile.households || 1982).toLocaleString('en-IN'),
    cepVal: `${overallCep}/100`,
    projVal: projects.length.toString(),
    compVal: pendingComplaints.toString(),
    budgVal: '₹1,24,50,000'
  };

  for (const [id, val] of Object.entries(statValues)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

function initNoticeBoard() {
  const form = document.getElementById('dashViewNoticeForm');
  const input = document.getElementById('dashViewNoticeInput');
  const listEl = document.getElementById('activeNoticesList');

  function renderNotices() {
    if (!listEl) return;
    const notices = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.NOTICES) || '[]');
    listEl.innerHTML = notices.map(n => `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 0.88rem; color: #0f172a;">${n.text}</div>
          <small style="color: #64748b;">Posted: ${n.date} • ID: ${n.id}</small>
        </div>
        <button class="action-icon-btn delete" onclick="deleteNotice('${n.id}')">Delete</button>
      </div>
    `).join('');
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const notices = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.NOTICES) || '[]');
      notices.unshift({
        id: 'NTC-' + (notices.length + 1),
        text: text,
        date: new Date().toISOString().split('T')[0],
        pinned: true
      });
      localStorage.setItem(AAPLA_STORAGE_KEYS.NOTICES, JSON.stringify(notices));
      input.value = '';
      renderNotices();
      alert('Official Village Announcement broadcasted successfully!');
    });
  }

  window.deleteNotice = function(id) {
    const notices = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.NOTICES) || '[]').filter(n => n.id !== id);
    localStorage.setItem(AAPLA_STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    renderNotices();
  };

  renderNotices();
}

function initNotifications() {
  const bell = document.getElementById('notifBellBtn');
  const popover = document.getElementById('notifPopover');
  if (bell && popover) {
    bell.addEventListener('click', function(e) {
      e.stopPropagation();
      popover.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
      if (!popover.contains(e.target) && e.target !== bell) {
        popover.classList.remove('active');
      }
    });
  }
}

function initSidebarToggle() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
}

function initFormListeners() {
  const vpForm = document.getElementById('editVillageProfileForm');
  if (vpForm) vpForm.addEventListener('submit', handleSaveVillageProfile);

  const projForm = document.getElementById('projectForm');
  if (projForm) projForm.addEventListener('submit', handleSaveProject);

  const caForm = document.getElementById('complaintActionForm');
  if (caForm) caForm.addEventListener('submit', handleSaveComplaintAction);

  const addCitizenForm = document.getElementById('addCitizenForm');
  if (addCitizenForm) addCitizenForm.addEventListener('submit', handleAddCitizen);
}

// Modal Helpers
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

window.generateReport = function(type) {
  const profile = AaplaAuth.getVillageProfile();
  const scores = AaplaAuth.getCepScores();
  const overall = calculateOverallCepScore(scores);

  const reportWindow = window.open('', '_blank', 'width=800,height=600');
  reportWindow.document.write(`
    <html>
      <head>
        <title>${type} Report — ${profile.villageName}</title>
        <style>
          body { font-family: sans-serif; padding: 30px; line-height: 1.6; color: #1e293b; }
          h1 { color: #0e2a47; border-bottom: 2px solid #f26522; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>${profile.villageName} Gram Panchayat — ${type} Performance Certificate</h1>
        <p><strong>District:</strong> ${profile.district}, ${profile.state} | <strong>Taluka:</strong> ${profile.taluka}</p>
        <p><strong>Overall CEP Rating:</strong> <span style="font-size: 1.3rem; font-weight: bold; color: #10b981;">${overall} / 100</span> (Grade A)</p>
        <table>
          <tr><th>Pillar Sector</th><th>Assessed Score</th><th>State Benchmark</th><th>Status</th></tr>
          <tr><td>Water & Sanitation</td><td>${scores.water}%</td><td>70%</td><td>Compliant (100% Piped Tap)</td></tr>
          <tr><td>Education</td><td>${scores.education}%</td><td>70%</td><td>Compliant</td></tr>
          <tr><td>Agriculture</td><td>${scores.agriculture}%</td><td>70%</td><td>Compliant</td></tr>
          <tr><td>Digital Services</td><td>${scores.digital}%</td><td>70%</td><td>Compliant</td></tr>
          <tr><td>Health</td><td>${scores.health}%</td><td>70%</td><td>Compliant</td></tr>
          <tr><td>Environment</td><td>${scores.environment}%</td><td>70%</td><td>Compliant</td></tr>
          <tr><td>Infrastructure</td><td>${scores.infrastructure}%</td><td>70%</td><td>Satisfactory</td></tr>
        </table>
        <p style="margin-top: 30px;"><em>Digitally Certified by: Shri. Rajesh Patil (Sarpanch) & Smt. Sunita Kulkarni (Gram Sevak)</em></p>
      </body>
    </html>
  `);
  reportWindow.document.close();
};

window.exportDataBackup = function() {
  const data = {
    profile: AaplaAuth.getVillageProfile(),
    cepScores: AaplaAuth.getCepScores(),
    projects: getProjects(),
    complaints: getComplaints(),
    citizens: getCitizens()
  };
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `aapla_gaav_backup_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchor.click();
};

window.resetDemoData = function() {
  if (confirm('Reset all village projects, complaints, CEP scores, and profile to demo defaults?')) {
    localStorage.clear();
    window.location.reload();
  }
};
