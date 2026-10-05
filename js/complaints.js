/* ==========================================================================
   Aapla Gaav — Valivade Gram Panchayat
   Citizen Grievances & Complaints Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  initComplaintsPage();
});

function initComplaintsPage() {
  setupGrievanceForm();
  setupTrackerSearch();
  renderRecentPublicComplaints();
  autoFillCitizenDetailsIfLogged();
}

function autoFillCitizenDetailsIfLogged() {
  if (typeof AaplaAuth !== 'undefined') {
    const session = AaplaAuth.getCitizenSession();
    if (session) {
      const nameInput = document.getElementById('complaintCitizenName');
      const mobileInput = document.getElementById('complaintCitizenMobile');
      const locationInput = document.getElementById('complaintLocation');

      if (nameInput && !nameInput.value) nameInput.value = session.fullName;
      if (mobileInput && !mobileInput.value) mobileInput.value = session.mobile;
      if (locationInput && !locationInput.value) locationInput.value = session.ward || 'Valivade';
    }
  }
}

function setupGrievanceForm() {
  const form = document.getElementById('grievanceLodgeForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('complaintCitizenName').value.trim();
    const mobile = document.getElementById('complaintCitizenMobile').value.trim();
    const category = document.getElementById('complaintCategory').value;
    const location = document.getElementById('complaintLocation').value.trim();
    const description = document.getElementById('complaintDescription').value.trim();
    const priority = document.getElementById('complaintPriority') ? document.getElementById('complaintPriority').value : 'Medium';

    if (!name || !mobile || !category || !location || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingId = `AG-2026-${randomSuffix}`;
    const today = new Date().toISOString().split('T')[0];

    const newComplaint = {
      id: trackingId,
      citizenName: name,
      mobile: mobile,
      category: category,
      location: location,
      description: description,
      priority: priority,
      date: today,
      status: 'Submitted',
      stage: 1, // 1: Submitted, 2: Under Review, 3: Assigned, 4: In Progress, 5: Resolved
      assignedTo: 'Gram Sevak / Field Inspector, Valivade',
      notes: 'Grievance received via Aapla Gaav digital portal. Acknowledged by Gram Panchayat desk.'
    };

    const complaints = AaplaData.getComplaints();
    complaints.unshift(newComplaint);
    AaplaData.saveComplaints(complaints);

    // Show confirmation modal or alert
    showGrievanceSuccess(newComplaint);
    form.reset();
    renderRecentPublicComplaints();
  });
}

function showGrievanceSuccess(c) {
  const modal = document.getElementById('grievanceSuccessModal');
  const idEl = document.getElementById('successTrackingId');
  const detailsEl = document.getElementById('successDetails');

  if (idEl) idEl.textContent = c.id;
  if (detailsEl) {
    detailsEl.innerHTML = `
      <strong>Category:</strong> ${c.category}<br>
      <strong>Location:</strong> ${c.location}<br>
      <strong>Date:</strong> ${c.date}<br>
      <strong>Status:</strong> ${c.status}
    `;
  }

  if (modal && window.openModal) {
    window.openModal('grievanceSuccessModal');
  } else {
    alert(`Grievance Lodged Successfully!\nYour Tracking ID is: ${c.id}\nPlease save this ID to track resolution.`);
  }

  // Auto-switch to tracking view
  const trackInput = document.getElementById('trackingIdInput');
  if (trackInput) {
    trackInput.value = c.id;
    searchComplaintById(c.id);
  }
}

function setupTrackerSearch() {
  const searchBtn = document.getElementById('trackGrievanceBtn');
  const searchInput = document.getElementById('trackingIdInput');

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      const q = searchInput.value.trim();
      if (!q) {
        alert('Please enter a Tracking ID (e.g. AG-2026-84920) or 10-digit mobile number.');
        return;
      }
      searchComplaintById(q);
    });

    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }
}

window.searchComplaintById = function(query) {
  const complaints = AaplaData.getComplaints();
  const found = complaints.find(c => 
    c.id.toLowerCase() === query.toLowerCase() || 
    c.mobile === query
  );

  const resultContainer = document.getElementById('trackingResultSection');
  if (!resultContainer) return;

  if (!found) {
    resultContainer.innerHTML = `
      <div class="empty-state-box" style="padding: 24px; text-align: center; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px;">
        <p style="color: #c53030; font-weight: 600; margin-bottom: 4px;">No grievance found matching "${query}"</p>
        <p style="color: #718096; font-size: 0.85rem;">Please double check your 10-character grievance tracking ID or mobile number.</p>
      </div>
    `;
    resultContainer.style.display = 'block';
    return;
  }

  let stage = found.stage || 1;
  if (found.status === 'Resolved') stage = 5;
  else if (found.status === 'In Progress') stage = 4;
  else if (found.status === 'Assigned') stage = 3;
  else if (found.status === 'Under Review') stage = 2;

  resultContainer.innerHTML = `
    <div class="grievance-track-card" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 600;">Grievance Token</span>
          <h3 style="font-size: 1.25rem; color: var(--primary-navy); margin-top: 2px;">${found.id}</h3>
        </div>
        <div style="text-align: right;">
          <span class="status-badge ${found.status === 'Resolved' ? 'completed' : 'progress'}" style="font-size: 0.85rem; padding: 6px 12px;">
            ${found.status}
          </span>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">Filed on: ${found.date}</div>
        </div>
      </div>

      <!-- 5-Step Timeline -->
      <div class="timeline-stepper" style="margin: 28px 0 24px 0;">
        <div class="stepper-item ${stage >= 1 ? 'completed' : ''} ${stage === 1 ? 'active' : ''}">
          <div class="stepper-circle">${stage > 1 ? '✓' : '1'}</div>
          <div class="stepper-label">Lodged</div>
        </div>
        <div class="stepper-line ${stage >= 2 ? 'active' : ''}"></div>
        <div class="stepper-item ${stage >= 2 ? 'completed' : ''} ${stage === 2 ? 'active' : ''}">
          <div class="stepper-circle">${stage > 2 ? '✓' : '2'}</div>
          <div class="stepper-label">Under Review</div>
        </div>
        <div class="stepper-line ${stage >= 3 ? 'active' : ''}"></div>
        <div class="stepper-item ${stage >= 3 ? 'completed' : ''} ${stage === 3 ? 'active' : ''}">
          <div class="stepper-circle">${stage > 3 ? '✓' : '3'}</div>
          <div class="stepper-label">Assigned</div>
        </div>
        <div class="stepper-line ${stage >= 4 ? 'active' : ''}"></div>
        <div class="stepper-item ${stage >= 4 ? 'completed' : ''} ${stage === 4 ? 'active' : ''}">
          <div class="stepper-circle">${stage > 4 ? '✓' : '4'}</div>
          <div class="stepper-label">In Progress</div>
        </div>
        <div class="stepper-line ${stage >= 5 ? 'active' : ''}"></div>
        <div class="stepper-item ${stage >= 5 ? 'completed' : ''} ${stage === 5 ? 'active' : ''}">
          <div class="stepper-circle">${stage === 5 ? '✓' : '5'}</div>
          <div class="stepper-label">Resolved</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.88rem;">
        <div>
          <span style="color: #64748b; font-size: 0.75rem;">COMPLAINANT</span>
          <p style="font-weight: 600; color: #0f172a;">${found.citizenName}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem;">DEPARTMENT / CATEGORY</span>
          <p style="font-weight: 600; color: #0f172a;">${found.category}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem;">LOCATION / WARD</span>
          <p style="font-weight: 600; color: #0f172a;">📍 ${found.location}</p>
        </div>
        <div>
          <span style="color: #64748b; font-size: 0.75rem;">OFFICER IN-CHARGE</span>
          <p style="font-weight: 600; color: #0f172a;">${found.assignedTo || 'Gram Sevak Office'}</p>
        </div>
      </div>

      <div style="margin-top: 16px;">
        <h5 style="font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Grievance Description:</h5>
        <p style="font-size: 0.9rem; color: #1e293b; background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 3px solid var(--accent-saffron);">${found.description}</p>
      </div>

      <div style="margin-top: 14px;">
        <h5 style="font-size: 0.85rem; color: #475569; margin-bottom: 4px;">Latest Action / Resolution Note:</h5>
        <p style="font-size: 0.88rem; color: #166534; background: #ecfdf5; padding: 12px; border-radius: 6px; border-left: 3px solid #10b981;">
          ${found.notes || 'Inspection scheduled with engineering wing.'}
        </p>
      </div>
    </div>
  `;
  resultContainer.style.display = 'block';
};

function renderRecentPublicComplaints() {
  const container = document.getElementById('recentComplaintsList');
  if (!container) return;

  const complaints = AaplaData.getComplaints();
  if (complaints.length === 0) {
    container.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No public complaints recorded.</p>';
    return;
  }

  container.innerHTML = complaints.slice(0, 6).map(c => `
    <div class="complaint-summary-card" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px;">
      <div>
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
          <strong style="color: var(--primary-navy); font-size: 0.9rem;">${c.id}</strong>
          <span style="font-size: 0.75rem; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569;">${c.category}</span>
        </div>
        <p style="font-size: 0.82rem; color: #64748b; margin: 0;">📍 ${c.location} &nbsp;•&nbsp; 📅 ${c.date}</p>
      </div>
      <div>
        <span class="status-badge ${c.status === 'Resolved' ? 'completed' : 'progress'}" style="font-size: 0.75rem;">
          ${c.status}
        </span>
      </div>
    </div>
  `).join('');
}
