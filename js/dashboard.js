/* ==========================================================================
   Aapla Gaav – CEP Extended Dashboard Logic
   Integrates Steps 1 through 7 with Full Functionality
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Security Guard: Check unauthenticated access
  const session = AaplaAuth.requireAdmin();
  if (!session) return;

  initViewSwitcher();
  initDashboardHeader();
  renderVillageProfile();
  renderStatisticsCards();
  renderCepPerformance();
  initCepSliders();
  renderProjectsTable();
  renderComplaintsTable();
  renderCitizensTable();
  renderSchemesTable();
  renderAnnouncementsTable();
  renderAdminProfileSettings();
  initNoticeBoard();
  initNotifications();
  initSidebarToggle();
  initFormListeners();
});

/* ==========================================================================
   VIEW SWITCHER
   ========================================================================== */
function initViewSwitcher() {
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetView = this.getAttribute('data-view');
      if (targetView) switchView(targetView);
    });
  });

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchedLink = Array.from(sidebarLinks).find(l => l.getAttribute('href') === '#' + hash);
    if (matchedLink) switchView(matchedLink.getAttribute('data-view'));
  }
}

window.switchView = function(viewId) {
  document.querySelectorAll('.dash-view').forEach(view => view.classList.remove('active'));
  const target = document.getElementById(viewId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-view') === viewId) link.classList.add('active');
  });

  const sidebar = document.querySelector('.dashboard-sidebar');
  if (sidebar) sidebar.classList.remove('open');
};

/* ==========================================================================
   DASHBOARD HEADER & ADMIN PROFILE (STEP 7)
   ========================================================================== */
function initDashboardHeader() {
  const dateEl = document.getElementById('currentDateDisplay');
  if (dateEl) {
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  const updateEl = document.getElementById('lastUpdateDisplay');
  if (updateEl) {
    updateEl.textContent = 'Last synced: ' + (localStorage.getItem(AAPLA_STORAGE_KEYS.LAST_UPDATE) || 'Today, 08:30 PM');
  }

  const admin = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE) || JSON.stringify(DEMO_ADMIN));
  const adminNameEl = document.getElementById('adminNameDisplay');
  const adminRoleEl = document.getElementById('adminRoleDisplay');
  if (adminNameEl) adminNameEl.textContent = admin.name || 'Administrator to update';
  if (adminRoleEl) adminRoleEl.textContent = `${admin.title || 'Gram Panchayat Administrator'} • ${admin.village || 'Valivade (Walivade)'}`;

  document.querySelectorAll('.logout-trigger').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out from the Village Administrator portal?')) {
        AaplaAuth.logoutAdmin();
      }
    });
  });
}

function renderAdminProfileSettings() {
  const admin = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE) || JSON.stringify(DEMO_ADMIN));
  
  const elMap = {
    setAdminName: admin.name || 'Administrator to update',
    setAdminRole: admin.title || 'Gram Panchayat Administrator',
    setAdminVillage: admin.village || 'Valivade (Walivade)',
    setAdminDistrict: admin.district || 'Kolhapur',
    setAdminMobile: admin.mobile || 'Administrator to update',
    setAdminEmail: admin.email || 'admin@valivade'
  };

  for (const [id, val] of Object.entries(elMap)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  // Populate Edit Modal inputs
  if (document.getElementById('editAdmName')) {
    document.getElementById('editAdmName').value = admin.name || 'Administrator to update';
    document.getElementById('editAdmRole').value = admin.title || 'Gram Panchayat Administrator';
    document.getElementById('editAdmVillage').value = admin.village || 'Valivade (Walivade)';
    document.getElementById('editAdmDistrict').value = admin.district || 'Kolhapur';
    document.getElementById('editAdmMobile').value = admin.mobile || 'Administrator to update';
    document.getElementById('editAdmEmail').value = admin.email || 'admin@valivade';
  }
}

window.handleSaveAdminProfile = function(e) {
  e.preventDefault();
  const current = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE) || JSON.stringify(DEMO_ADMIN));
  const updated = {
    ...current,
    name: document.getElementById('editAdmName').value.trim(),
    title: document.getElementById('editAdmRole').value.trim(),
    village: document.getElementById('editAdmVillage').value.trim(),
    district: document.getElementById('editAdmDistrict').value.trim(),
    mobile: document.getElementById('editAdmMobile').value.trim(),
    email: document.getElementById('editAdmEmail').value.trim()
  };
  localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(updated));
  renderAdminProfileSettings();
  initDashboardHeader();
  closeModal('editAdminProfileModal');
  showToast('Administrator profile updated successfully!', 'success');
};

/* ==========================================================================
   STEP 3 — VILLAGE PROFILE
   ========================================================================== */
function renderVillageProfile() {
  const profile = AaplaAuth.getVillageProfile();
  if (!profile.villageName) return;

  const sbName = document.getElementById('sidebarVillageName');
  if (sbName) sbName.textContent = profile.villageName;

  const bannerLoc = document.getElementById('bannerLocationText');
  if (bannerLoc) bannerLoc.textContent = `${profile.villageName}, ${profile.district}, ${profile.state}`;

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

  const popVal = document.getElementById('popVal');
  if (popVal) popVal.textContent = Number(profile.population).toLocaleString('en-IN');
  const houseVal = document.getElementById('houseVal');
  if (houseVal) houseVal.textContent = Number(profile.households).toLocaleString('en-IN');

  const genderSplit = document.getElementById('popGenderSplit');
  if (genderSplit) genderSplit.textContent = `${Number(profile.malePopulation).toLocaleString('en-IN')} M / ${Number(profile.femalePopulation).toLocaleString('en-IN')} F`;

  if (document.getElementById('inpVillageName')) {
    document.getElementById('inpVillageName').value = profile.villageName || '';
    document.getElementById('inpDistrict').value = profile.district || '';
    document.getElementById('inpTaluka').value = profile.taluka || '';
    document.getElementById('inpState').value = profile.state || '';
    document.getElementById('inpPopulation').value = profile.population || 1668;
    document.getElementById('inpHouseholds').value = profile.households || 332;
    document.getElementById('inpArea').value = profile.villageArea || '588.44 hectares';
    document.getElementById('inpLiteracy').value = profile.literacyRate || '67.63%';
    document.getElementById('inpMalePop').value = profile.malePopulation || 865;
    document.getElementById('inpFemalePop').value = profile.femalePopulation || 803;
    document.getElementById('inpOccupations').value = profile.mainOccupations || '';
    document.getElementById('inpCrops').value = profile.mainCrops || '';
    document.getElementById('inpContact').value = profile.contactInfo || '';
  }
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
  showToast('Village profile updated and saved to localStorage!', 'success');
}

/* ==========================================================================
   STEP 4 — CEP PERFORMANCE & INDICATOR RECALCULATION
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

  const cepVal = document.getElementById('cepVal');
  if (cepVal) cepVal.textContent = `${overallScore}/100`;

  const sbBadge = document.getElementById('sidebarCepBadge');
  if (sbBadge) sbBadge.textContent = `${overallScore}%`;

  const circle = document.querySelector('.radial-progress');
  const scoreText = document.getElementById('cepScoreRadialVal');
  if (circle) {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    const offset = circumference - (overallScore / 100) * circumference;
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
  }
  if (scoreText) scoreText.textContent = overallScore;

  const categories = [
    { key: 'water', name: 'Water & Sanitation', score: scores.water || 88, class: 'fill-water', icon: '💧' },
    { key: 'education', name: 'Education', score: scores.education || 82, class: 'fill-education', icon: '🎓' },
    { key: 'agriculture', name: 'Agriculture', score: scores.agriculture || 81, class: 'fill-agri', icon: '🌾' },
    { key: 'digital', name: 'Digital Services', score: scores.digital || 76, class: 'fill-digital', icon: '💻' },
    { key: 'health', name: 'Health', score: scores.health || 74, class: 'fill-health', icon: '🏥' },
    { key: 'environment', name: 'Environment', score: scores.environment || 72, class: 'fill-enviro', icon: '🌳' },
    { key: 'infrastructure', name: 'Infrastructure', score: scores.infrastructure || 69, class: 'fill-infra', icon: '🛣️' }
  ];

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
  showToast('CEP Scores updated successfully across dashboard!', 'success');
};

function renderHistoricalTrendSvg(currentScore = 78) {
  const container = document.getElementById('cepTrendChart');
  if (!container) return;

  container.innerHTML = `
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
}

/* ==========================================================================
   STEP 4 — PROJECTS MANAGEMENT
   ========================================================================== */
let currentProjectFilter = 'all';

function getProjects() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS) || '[]');
}

function saveProjects(projects) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  touchUpdate();
  renderProjectsTable();
  renderStatisticsCards();
}

function renderProjectsTable() {
  const projects = getProjects();
  
  if (document.getElementById('countAllProjects')) document.getElementById('countAllProjects').textContent = projects.length;
  if (document.getElementById('projVal')) document.getElementById('projVal').textContent = projects.length;
  if (document.getElementById('sidebarProjectsBadge')) document.getElementById('sidebarProjectsBadge').textContent = projects.length;

  const fullTbody = document.getElementById('projectsFullTableBody');
  if (fullTbody) {
    let list = projects;
    if (currentProjectFilter !== 'all') {
      list = projects.filter(p => p.status.toLowerCase() === currentProjectFilter.toLowerCase());
    }

    if (list.length === 0) {
      fullTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 24px; color:#64748b;">No projects found for filter: ${currentProjectFilter}</td></tr>`;
    } else {
      fullTbody.innerHTML = list.map(p => `
        <tr>
          <td><strong>${p.name}</strong><br><small style="color:#64748b;">${p.id} • ${p.department}</small></td>
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
          <td><span class="status-badge ${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
          <td>
            <div style="display: flex; gap: 4px;">
              <button class="action-icon-btn" onclick="viewProjectDetails('${p.id}')">👁</button>
              <button class="action-icon-btn edit" onclick="openEditProjectModal('${p.id}')">✎</button>
              <button class="action-icon-btn delete" onclick="deleteProject('${p.id}')">🗑</button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  }

  const glanceTbody = document.getElementById('dashGlanceProjectsBody');
  if (glanceTbody) {
    glanceTbody.innerHTML = projects.slice(0, 4).map(p => `
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
        <td><span class="status-badge ${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
      </tr>
    `).join('');
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
  const proj = getProjects().find(p => p.id === projectId);
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
  if (confirm(`Are you sure you want to delete project ${projectId}?`)) {
    const projects = getProjects().filter(p => p.id !== projectId);
    saveProjects(projects);
    showToast(`Project ${projectId} deleted.`, 'info');
  }
};

window.viewProjectDetails = function(projectId) {
  const proj = getProjects().find(p => p.id === projectId);
  if (!proj) return;

  document.getElementById('pdTitle').textContent = `Project Inspection: ${proj.name}`;
  document.getElementById('pdContent').innerHTML = `
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
        <div class="meta-label">Amount Spent</div>
        <div class="meta-value" style="color: #0369a1;">${proj.spent}</div>
      </div>
    </div>

    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px;">
      <div class="meta-label" style="margin-bottom: 6px;">Description & Scope</div>
      <p style="font-size: 0.88rem; color: #334155; line-height: 1.5;">${proj.description}</p>
    </div>
  `;
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
    showToast(`Project ${nextId} created successfully!`, 'success');
  } else {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projectData.id = id;
      projects[index] = projectData;
      saveProjects(projects);
      closeModal('projectModal');
      showToast(`Project ${id} updated!`, 'success');
    }
  }
}

/* ==========================================================================
   STEP 6 — GOVERNMENT SCHEMES SECTION
   ========================================================================== */
function getSchemes() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES) || '[]');
}

function saveSchemes(schemes) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  touchUpdate();
  renderSchemesTable();
}

function renderSchemesTable() {
  const schemes = getSchemes();
  const tbody = document.getElementById('schemesTableBody');
  if (!tbody) return;

  tbody.innerHTML = schemes.map(s => `
    <tr>
      <td>
        <strong>${s.name}</strong><br>
        <small style="color:#64748b;">Dept: ${s.department}</small>
      </td>
      <td><strong>${Number(s.beneficiaries).toLocaleString('en-IN')}</strong></td>
      <td>${Number(s.applications).toLocaleString('en-IN')}</td>
      <td><span style="color:#15803d; font-weight:700;">${Number(s.approved).toLocaleString('en-IN')}</span></td>
      <td><span style="color:#ea580c; font-weight:700;">${Number(s.pending).toLocaleString('en-IN')}</span></td>
      <td><strong>${Number(s.completed).toLocaleString('en-IN')}</strong></td>
      <td><strong style="color:#0284c7;">${s.amountDistributed}</strong></td>
      <td>
        <button class="action-icon-btn edit" onclick="openEditSchemeModal('${s.id}')">✎ Edit</button>
      </td>
    </tr>
  `).join('');
}

window.openAddSchemeModal = function() {
  document.getElementById('schemeModalTitle').textContent = 'Add Government Scheme';
  document.getElementById('schemeFormMode').value = 'add';
  document.getElementById('schemeFormId').value = '';
  document.getElementById('schemeForm').reset();
  openModal('schemeModal');
};

window.openEditSchemeModal = function(schemeId) {
  const scheme = getSchemes().find(s => s.id === schemeId);
  if (!scheme) return;

  document.getElementById('schemeModalTitle').textContent = `Edit Scheme: ${scheme.name}`;
  document.getElementById('schemeFormMode').value = 'edit';
  document.getElementById('schemeFormId').value = scheme.id;

  document.getElementById('schInpName').value = scheme.name;
  document.getElementById('schInpDept').value = scheme.department;
  document.getElementById('schInpBen').value = scheme.beneficiaries;
  document.getElementById('schInpApp').value = scheme.applications;
  document.getElementById('schInpApr').value = scheme.approved;
  document.getElementById('schInpPen').value = scheme.pending;
  document.getElementById('schInpCom').value = scheme.completed;
  document.getElementById('schInpAmt').value = scheme.amountDistributed;
  document.getElementById('schInpDesc').value = scheme.description;

  openModal('schemeModal');
};

function handleSaveScheme(e) {
  e.preventDefault();
  const mode = document.getElementById('schemeFormMode').value;
  const id = document.getElementById('schemeFormId').value;
  const schemes = getSchemes();

  const data = {
    name: document.getElementById('schInpName').value.trim(),
    department: document.getElementById('schInpDept').value.trim(),
    beneficiaries: Number(document.getElementById('schInpBen').value),
    applications: Number(document.getElementById('schInpApp').value),
    approved: Number(document.getElementById('schInpApr').value),
    pending: Number(document.getElementById('schInpPen').value),
    completed: Number(document.getElementById('schInpCom').value),
    amountDistributed: document.getElementById('schInpAmt').value.trim(),
    description: document.getElementById('schInpDesc').value.trim()
  };

  if (mode === 'add') {
    data.id = 'SCH-' + String(schemes.length + 1).padStart(2, '0');
    schemes.push(data);
    saveSchemes(schemes);
    closeModal('schemeModal');
    showToast(`Scheme ${data.name} added successfully!`, 'success');
  } else {
    const idx = schemes.findIndex(s => s.id === id);
    if (idx !== -1) {
      data.id = id;
      schemes[idx] = data;
      saveSchemes(schemes);
      closeModal('schemeModal');
      showToast(`Scheme ${id} updated!`, 'success');
    }
  }
}

/* ==========================================================================
   STEP 6 — ANNOUNCEMENTS MANAGEMENT
   ========================================================================== */
function getAnnouncements() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
}

function saveAnnouncements(list) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(list));
  touchUpdate();
  renderAnnouncementsTable();
}

function renderAnnouncementsTable() {
  const list = getAnnouncements();
  const container = document.getElementById('announcementsFullList');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<div style="padding:20px; text-align:center; color:#64748b;">No active announcements. Create one above!</div>';
    return;
  }

  container.innerHTML = list.map(a => `
    <div style="background: #ffffff; border: 1px solid var(--border-dash); border-radius: 8px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; gap: 14px;">
      <div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span class="status-badge ${a.priority === 'Emergency' ? 'delayed' : 'completed'}">${a.priority || 'Normal'}</span>
          <span style="font-size: 0.76rem; font-weight: 700; color: #f26522; background: #fff3ec; padding: 2px 8px; border-radius: 4px;">${a.category}</span>
          <span style="font-size: 0.74rem; color: #64748b;">📅 ${a.date}</span>
        </div>
        <h4 style="font-size: 1rem; color: #0f172a; margin-bottom: 6px;">${a.title}</h4>
        <p style="font-size: 0.85rem; color: #475569; line-height: 1.5; margin: 0;">${a.description}</p>
        ${a.attachment ? `<div style="margin-top: 6px; font-size: 0.78rem; color: #0284c7;">📎 Attachment: ${a.attachment}</div>` : ''}
      </div>
      <button class="action-icon-btn delete" onclick="deleteAnnouncement('${a.id}')">Delete</button>
    </div>
  `).join('');
}

window.deleteAnnouncement = function(id) {
  if (confirm('Delete this announcement?')) {
    const list = getAnnouncements().filter(a => a.id !== id);
    saveAnnouncements(list);
    showToast('Announcement deleted.', 'info');
  }
};

window.handleCreateAnnouncement = function(e) {
  e.preventDefault();
  const list = getAnnouncements();
  const newAnn = {
    id: 'ANN-' + String(list.length + 1).padStart(2, '0'),
    title: document.getElementById('annInpTitle').value.trim(),
    category: document.getElementById('annInpCategory').value,
    priority: document.getElementById('annInpPriority').value,
    date: document.getElementById('annInpDate').value,
    description: document.getElementById('annInpDesc').value.trim(),
    attachment: document.getElementById('annInpAttach').value.trim() || null
  };

  list.unshift(newAnn);
  saveAnnouncements(list);
  document.getElementById('createAnnouncementForm').reset();
  showToast('Announcement broadcasted to village portal!', 'success');
};

/* ==========================================================================
   STEP 5 — CITIZENS & GRIEVANCES
   ========================================================================== */
function getComplaints() {
  return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
}

function saveComplaints(complaints) {
  localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  touchUpdate();
  renderComplaintsTable();
  renderStatisticsCards();
}

function renderComplaintsTable() {
  const complaints = getComplaints();
  const total = complaints.length;
  const newCount = complaints.filter(c => c.status === 'Submitted').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'Under Review').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  if (document.getElementById('cStatTotal')) document.getElementById('cStatTotal').textContent = total;
  if (document.getElementById('cStatNew')) document.getElementById('cStatNew').textContent = newCount;
  if (document.getElementById('cStatInProgress')) document.getElementById('cStatInProgress').textContent = inProgress;
  if (document.getElementById('cStatResolved')) document.getElementById('cStatResolved').textContent = resolved;

  const pendingDashboard = newCount + inProgress;
  if (document.getElementById('compVal')) document.getElementById('compVal').textContent = pendingDashboard;
  if (document.getElementById('sidebarComplaintsBadge')) document.getElementById('sidebarComplaintsBadge').textContent = pendingDashboard;

  const tbody = document.getElementById('complaintsFullTableBody');
  if (tbody) {
    tbody.innerHTML = complaints.map(c => `
      <tr>
        <td><strong>${c.id}</strong><br><small style="color: #64748b;">${c.date}</small></td>
        <td><strong>${c.name}</strong><br><small style="color: #0369a1;">📞 ${c.mobile}</small></td>
        <td><strong>${c.category}</strong></td>
        <td><small>${c.location || 'Gaothan'}</small></td>
        <td><span class="priority-pill ${(c.priority || 'medium').toLowerCase()}">${c.priority || 'Medium'}</span></td>
        <td><span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span></td>
        <td><small>${c.assignedTo || 'Unassigned'}</small></td>
        <td>
          <div style="display: flex; gap: 4px;">
            <button class="action-icon-btn" onclick="viewComplaintDetails('${c.id}')">Details</button>
            <button class="action-icon-btn edit" onclick="openComplaintActionModal('${c.id}')">Update</button>
            ${c.status !== 'Resolved' ? `<button class="action-icon-btn resolve" onclick="markComplaintResolved('${c.id}')">✓</button>` : ''}
          </div>
        </td>
      </tr>
    `).join('');
  }
}

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
    showToast(`Complaint ${id} updated to ${status}.`, 'success');
  }
}

window.markComplaintResolved = function(complaintId) {
  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === complaintId);
  if (index !== -1) {
    complaints[index].status = 'Resolved';
    if (!complaints[index].adminResponse) {
      complaints[index].adminResponse = 'Inspected and resolved by Sarpanch administrative order.';
    }
    saveComplaints(complaints);
    showToast(`Complaint ${complaintId} marked as Resolved!`, 'success');
  }
};

window.viewComplaintDetails = function(complaintId) {
  const c = getComplaints().find(x => x.id === complaintId);
  if (!c) return;

  document.getElementById('cdTitle').textContent = `Investigation File: ${c.id}`;
  document.getElementById('cdContent').innerHTML = `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <h4 style="font-size: 1.15rem; color: #0f172a; margin: 0;">${c.id} — ${c.category}</h4>
        <span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span>
      </div>
      <small style="color: #64748b;">Filed: ${c.date} | Priority: <strong>${c.priority || 'Medium'}</strong></small>
    </div>

    <div class="profile-meta-grid" style="margin-bottom: 14px;">
      <div class="profile-meta-box">
        <div class="meta-label">Citizen</div>
        <div class="meta-value" style="font-size: 0.92rem;">${c.name}</div>
      </div>
      <div class="profile-meta-box">
        <div class="meta-label">Mobile</div>
        <div class="meta-value" style="font-size: 0.92rem;">📞 ${c.mobile}</div>
      </div>
      <div class="profile-meta-box" style="grid-column: span 2;">
        <div class="meta-label">Location / Area</div>
        <div class="meta-value" style="font-size: 0.92rem;">${c.location || 'Gaothan'}</div>
      </div>
    </div>

    <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
      <div class="meta-label" style="margin-bottom: 4px;">Description</div>
      <p style="font-size: 0.88rem; color: #334155; margin: 0;">${c.description}</p>
    </div>

    ${c.imageAttachment ? `
      <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <div class="meta-label" style="margin-bottom: 6px;">Attachment Photo</div>
        <img src="${c.imageAttachment}" alt="Evidence" style="max-width: 100%; border-radius: 6px; max-height: 220px; object-fit: contain;">
      </div>
    ` : ''}

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px;">
      <div class="meta-label" style="color: #166534; margin-bottom: 4px;">Assigned Officer & Action Taken</div>
      <div style="font-size: 0.85rem; font-weight: 700; color: #166534;">${c.assignedTo || 'Unassigned'}</div>
      <p style="font-size: 0.82rem; color: #14532d; margin-top: 4px;">${c.adminResponse || 'Awaiting initial inspection report.'}</p>
    </div>
  `;
  openModal('complaintDetailsModal');
};

function renderCitizensTable() {
  const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
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
        <button class="action-icon-btn" onclick="alert('Citizen Profile: ${c.fullName}, ${c.area}')">View</button>
      </td>
    </tr>
  `).join('');
}

window.filterCitizensTable = function() {
  const query = document.getElementById('citizenSearchInput').value.toLowerCase();
  document.querySelectorAll('#citizensTableBody tr').forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(query) ? '' : 'none';
  });
};

function handleAddCitizen(e) {
  e.preventDefault();
  const res = AaplaAuth.registerCitizen({
    fullName: document.getElementById('cInpName').value.trim(),
    mobile: document.getElementById('cInpMobile').value.trim(),
    area: document.getElementById('cInpArea').value,
    password: document.getElementById('cInpPass').value.trim()
  });

  if (res.success) {
    renderCitizensTable();
    closeModal('addCitizenModal');
    showToast('Citizen registered successfully!', 'success');
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
    popVal: Number(profile.population || 1668).toLocaleString('en-IN'),
    houseVal: Number(profile.households || 332).toLocaleString('en-IN'),
    cepVal: `${overallCep}/100`,
    projVal: projects.length.toString(),
    compVal: pendingComplaints.toString(),
    budgVal: profile.currentBudget || 'Data not available / Update required'
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
      notices.unshift({ id: 'NTC-' + (notices.length + 1), text: text, date: new Date().toISOString().split('T')[0], pinned: true });
      localStorage.setItem(AAPLA_STORAGE_KEYS.NOTICES, JSON.stringify(notices));
      input.value = '';
      renderNotices();
      showToast('Announcement posted to landing page ticker!', 'success');
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

  const schForm = document.getElementById('schemeForm');
  if (schForm) schForm.addEventListener('submit', handleSaveScheme);

  const annForm = document.getElementById('createAnnouncementForm');
  if (annForm) annForm.addEventListener('submit', handleCreateAnnouncement);

  const caForm = document.getElementById('complaintActionForm');
  if (caForm) caForm.addEventListener('submit', handleSaveComplaintAction);

  const addCitizenForm = document.getElementById('addCitizenForm');
  if (addCitizenForm) addCitizenForm.addEventListener('submit', handleAddCitizen);

  const editAdmForm = document.getElementById('editAdminProfileForm');
  if (editAdmForm) editAdmForm.addEventListener('submit', handleSaveAdminProfile);

  const pwdForm = document.getElementById('changeAdminPasswordForm');
  if (pwdForm) pwdForm.addEventListener('submit', handleChangeAdminPassword);
}

window.handleChangeAdminPassword = function(e) {
  e.preventDefault();
  const curr = document.getElementById('admCurrentPass').value;
  const newP = document.getElementById('admNewPass').value;
  const conf = document.getElementById('admConfirmPass').value;
  const admin = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE) || JSON.stringify(DEMO_ADMIN));
  if (curr !== admin.password && curr !== DEMO_ADMIN.password) {
    alert('Current password does not match.');
    return;
  }
  if (newP !== conf) {
    alert('New passwords do not match.');
    return;
  }
  if (newP.length < 6) {
    alert('Password must be at least 6 characters.');
    return;
  }
  admin.password = newP;
  localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(admin));
  closeModal('changeAdminPasswordModal');
  showToast('Administrator password changed successfully!', 'success');
};

// Generate Sector Report
window.generateReport = function(type) {
  generateSectorReport(type);
};

window.exportDataBackup = function() {
  const data = {
    profile: AaplaAuth.getVillageProfile(),
    cepScores: AaplaAuth.getCepScores(),
    projects: getProjects(),
    schemes: getSchemes(),
    announcements: getAnnouncements(),
    complaints: getComplaints(),
    citizens: JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]')
  };
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", jsonStr);
  dlAnchor.setAttribute("download", `aapla_gaav_backup_${new Date().toISOString().split('T')[0]}.json`);
  dlAnchor.click();
};

window.resetDemoData = function() {
  if (confirm('Reset all village projects, schemes, announcements, complaints, and profile to demo defaults?')) {
    localStorage.clear();
    window.location.reload();
  }
};
