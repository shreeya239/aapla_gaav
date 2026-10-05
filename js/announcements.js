/* ==========================================================================
   Aapla Gaav — Valivade Gram Panchayat
   Announcements, Gram Sabha & Public Notices Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initAnnouncementsPage();
});

let currentCategoryFilter = 'all';
let currentPriorityFilter = 'all';
let announcementSearchQuery = '';

function initAnnouncementsPage() {
  renderAnnouncements();
  setupFilterTabs();
  setupSearch();
  setupModalDetails();
}

function getStoredAnnouncements() {
  return AaplaData.getAnnouncements();
}

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  if (!container) return;

  const announcements = getStoredAnnouncements();
  const filtered = announcements.filter(a => {
    const matchCat = currentCategoryFilter === 'all' || a.category.toLowerCase() === currentCategoryFilter.toLowerCase();
    const matchPri = currentPriorityFilter === 'all' || (a.priority && a.priority.toLowerCase() === currentPriorityFilter.toLowerCase());
    const matchQuery = !announcementSearchQuery ||
      a.title.toLowerCase().includes(announcementSearchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(announcementSearchQuery.toLowerCase());
    return matchCat && matchPri && matchQuery;
  });

  const countBadge = document.getElementById('announcementCountBadge');
  if (countBadge) countBadge.textContent = `${filtered.length} Notice${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box" style="text-align: center; padding: 48px 20px; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" style="margin: 0 auto 12px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3 style="font-size: 1.15rem; color: #334155; margin-bottom: 6px;">No announcements found</h3>
        <p style="color: #64748b; font-size: 0.9rem;">No notices match the selected category or search filters.</p>
        <button class="btn btn-outline" style="margin-top: 14px;" onclick="resetAnnouncementFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(a => {
    const isUrgent = a.priority === 'Urgent' || a.priority === 'High';
    return `
      <div class="announcement-item-card ${isUrgent ? 'urgent-card' : ''}" data-id="${a.id}">
        <div class="announcement-meta-row">
          <div class="announcement-badges">
            <span class="category-pill">${a.category}</span>
            <span class="priority-pill ${a.priority ? a.priority.toLowerCase() : 'normal'}">${a.priority || 'Normal'} Priority</span>
          </div>
          <div class="announcement-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            ${a.date}
          </div>
        </div>

        <h3 class="announcement-title">${a.title}</h3>
        <p class="announcement-summary">${a.description}</p>

        <div class="announcement-footer">
          <div class="issuer-info">
            <span style="font-size: 0.8rem; color: #64748b;">Issued by: <strong>${a.issuer || 'Valivade Gram Panchayat Office'}</strong></span>
          </div>
          <div class="announcement-actions">
            <button class="btn btn-outline btn-sm" onclick="viewAnnouncementModal('${a.id}')">
              Read Full Notice →
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupFilterTabs() {
  document.querySelectorAll('.announcement-filter-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.announcement-filter-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentCategoryFilter = this.getAttribute('data-category');
      renderAnnouncements();
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById('announcementSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      announcementSearchQuery = this.value.trim();
      renderAnnouncements();
    });
  }
}

window.resetAnnouncementFilters = function() {
  currentCategoryFilter = 'all';
  currentPriorityFilter = 'all';
  announcementSearchQuery = '';
  const searchInput = document.getElementById('announcementSearchInput');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.announcement-filter-tab').forEach(t => {
    if (t.getAttribute('data-category') === 'all') t.classList.add('active');
    else t.classList.remove('active');
  });
  renderAnnouncements();
};

window.viewAnnouncementModal = function(id) {
  const announcements = getStoredAnnouncements();
  const a = announcements.find(item => String(item.id) === String(id));
  if (!a) return;

  const titleEl = document.getElementById('modalNoticeTitle');
  const bodyEl = document.getElementById('modalNoticeBody');

  if (titleEl) titleEl.textContent = a.title;
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
        <span class="status-badge progress">${a.category}</span>
        <span class="status-badge ${a.priority === 'Urgent' ? 'delayed' : 'completed'}">${a.priority || 'Normal'} Priority</span>
        <span class="status-badge" style="background:#f1f5f9; color:#475569;">Date: ${a.date}</span>
      </div>

      <div style="font-size: 0.95rem; color: #1e293b; line-height: 1.7; margin-bottom: 20px; background: #f8fafc; padding: 18px; border-radius: 8px; border-left: 4px solid var(--accent-saffron);">
        ${a.description}
      </div>

      <div style="background: #f1f5f9; padding: 14px; border-radius: 6px; font-size: 0.85rem; color: #475569;">
        <strong>Authority:</strong> ${a.issuer || 'Valivade Gram Panchayat (Karvir, Kolhapur)'}<br>
        <strong>Notice Reference:</strong> VGP/NOT/${a.id}/2026<br>
        <strong>Compliance:</strong> All citizens and village stakeholders are requested to take note.
      </div>
    `;
  }

  if (window.openModal) {
    window.openModal('noticeDetailModal');
  }
};

function setupModalDetails() {
  // Modal handlers
}
