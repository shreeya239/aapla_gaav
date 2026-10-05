/* ==========================================================================
   Aapla Gaav — Valivade Gram Panchayat
   Projects & Village Development Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initProjectsPage();
});

let currentStatusFilter = 'all';
let currentDeptFilter = 'all';
let searchQuery = '';

function initProjectsPage() {
  renderProjectsList();
  setupFilterHandlers();
  setupSearchHandler();
  setupModalHandlers();
  updateProjectsSummaryStats();
}

function getStoredProjects() {
  return AaplaData.getProjects();
}

function updateProjectsSummaryStats() {
  const projects = getStoredProjects();
  const total = projects.length;
  const inProgress = projects.filter(p => p.status === 'In Progress').length;
  const completed = projects.filter(p => p.status === 'Completed').length;
  const planned = projects.filter(p => p.status === 'Planned').length;
  const delayed = projects.filter(p => p.status === 'Delayed').length;

  const totalEl = document.getElementById('statTotalProjects');
  const progEl = document.getElementById('statInProgressProjects');
  const compEl = document.getElementById('statCompletedProjects');
  const planEl = document.getElementById('statPlannedProjects');

  if (totalEl) totalEl.textContent = total;
  if (progEl) progEl.textContent = inProgress;
  if (compEl) compEl.textContent = completed;
  if (planEl) planEl.textContent = planned + (delayed > 0 ? ` (${delayed} delayed)` : '');
}

function renderProjectsList() {
  const container = document.getElementById('projectsGrid');
  if (!container) return;

  const allProjects = getStoredProjects();
  const filtered = allProjects.filter(p => {
    const matchStatus = currentStatusFilter === 'all' || p.status.toLowerCase() === currentStatusFilter.toLowerCase();
    const matchDept = currentDeptFilter === 'all' || (p.department && p.department.toLowerCase() === currentDeptFilter.toLowerCase());
    const matchSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchDept && matchSearch;
  });

  const countBadge = document.getElementById('filteredCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} of ${allProjects.length} Projects`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin: 0 auto 12px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h3 style="font-size: 1.15rem; color: #334155; margin-bottom: 6px;">No projects found</h3>
        <p style="color: #64748b; font-size: 0.9rem;">Try adjusting your filter or search query to see development works.</p>
        <button class="btn btn-outline" style="margin-top: 14px;" onclick="resetProjectFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    let statusClass = 'progress';
    if (p.status === 'Completed') statusClass = 'completed';
    else if (p.status === 'Planned') statusClass = 'planned';
    else if (p.status === 'Delayed') statusClass = 'delayed';

    return `
      <div class="project-card" data-id="${p.id}">
        <div class="project-card-header">
          <div class="project-dept-tag">
            <span class="dept-dot"></span>
            ${p.department || p.category}
          </div>
          <span class="status-badge ${statusClass}">${p.status}</span>
        </div>

        <h3 class="project-title">${p.name}</h3>
        <p class="project-desc">${p.description ? p.description.substring(0, 110) + '...' : 'Valivade Gram Panchayat development work.'}</p>

        <div class="project-meta-grid">
          <div class="meta-item">
            <span class="meta-label">Location</span>
            <span class="meta-val">📍 ${p.location}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Sanctioned Budget</span>
            <span class="meta-val">₹${Number(p.budget).toLocaleString('en-IN')}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Amount Spent</span>
            <span class="meta-val">₹${Number(p.spent || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Target Completion</span>
            <span class="meta-val">📅 ${p.targetDate || p.endDate || '2026'}</span>
          </div>
        </div>

        <div class="project-progress-wrap">
          <div class="progress-labels">
            <span>Execution Progress</span>
            <strong style="color: var(--primary-navy);">${p.progress}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-bar-fill ${statusClass}" style="width: ${p.progress}%;"></div>
          </div>
        </div>

        <div class="project-card-footer">
          <button class="btn btn-outline btn-sm" onclick="viewProjectDetails('${p.id}')">
            View Details
          </button>
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 500;">ID: ${p.id}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupFilterHandlers() {
  document.querySelectorAll('.filter-pill[data-status]').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-pill[data-status]').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentStatusFilter = this.getAttribute('data-status');
      renderProjectsList();
    });
  });

  const deptSelect = document.getElementById('projectDeptSelect');
  if (deptSelect) {
    deptSelect.addEventListener('change', function() {
      currentDeptFilter = this.value;
      renderProjectsList();
    });
  }
}

function setupSearchHandler() {
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      searchQuery = this.value.trim();
      renderProjectsList();
    });
  }
}

window.resetProjectFilters = function() {
  currentStatusFilter = 'all';
  currentDeptFilter = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('projectSearchInput');
  if (searchInput) searchInput.value = '';
  const deptSelect = document.getElementById('projectDeptSelect');
  if (deptSelect) deptSelect.value = 'all';
  document.querySelectorAll('.filter-pill[data-status]').forEach(b => {
    if (b.getAttribute('data-status') === 'all') b.classList.add('active');
    else b.classList.remove('active');
  });
  renderProjectsList();
};

window.viewProjectDetails = function(projectId) {
  const projects = getStoredProjects();
  const p = projects.find(item => String(item.id) === String(projectId));
  if (!p) return;

  const titleEl = document.getElementById('modalProjectTitle');
  const bodyEl = document.getElementById('modalProjectBody');

  if (titleEl) titleEl.textContent = p.name;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
        <span class="status-badge ${p.status === 'Completed' ? 'completed' : p.status === 'Planned' ? 'planned' : 'progress'}">${p.status}</span>
        <span class="status-badge" style="background:#e0f2fe; color:#0369a1;">${p.department || p.category}</span>
        <span class="status-badge" style="background:#f1f5f9; color:#475569;">Project ID: ${p.id}</span>
      </div>

      <div style="margin-bottom: 18px;">
        <h4 style="font-size: 0.95rem; color: #0f172a; margin-bottom: 6px;">Description & Scope</h4>
        <p style="font-size: 0.9rem; color: #475569; line-height: 1.6;">${p.description || 'Village development project approved by Valivade Gram Panchayat Sabha.'}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 20px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Location</span>
          <p style="font-weight: 600; color: #0f172a;">📍 ${p.location}</p>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Approved Budget</span>
          <p style="font-weight: 700; color: #0f172a;">₹${Number(p.budget).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Expenditure to Date</span>
          <p style="font-weight: 600; color: #166534;">₹${Number(p.spent || 0).toLocaleString('en-IN')}</p>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Start Date</span>
          <p style="font-weight: 600; color: #0f172a;">${p.startDate || '2025-04-01'}</p>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Target Date</span>
          <p style="font-weight: 600; color: #0f172a;">${p.targetDate || p.endDate || '2026-03-31'}</p>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: #64748b; text-transform: uppercase;">Supervising Body</span>
          <p style="font-weight: 600; color: #0f172a;">Valivade Gram Panchayat</p>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-weight: 600; font-size: 0.85rem;">Work Execution Completion</span>
          <span style="font-weight: 700; color: var(--accent-saffron);">${p.progress}%</span>
        </div>
        <div class="progress-track" style="height: 12px;">
          <div class="progress-bar-fill ${p.status === 'Completed' ? 'completed' : 'progress'}" style="width: ${p.progress}%;"></div>
        </div>
      </div>
    `;
  }

  if (window.openModal) {
    window.openModal('projectDetailsModal');
  }
};

function setupModalHandlers() {
  // Setup project details modal close
}
