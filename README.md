# Aapla Gaav – CEP (Citizen Empowerment Platform)

A digital village management and governance web application built strictly using **HTML5, CSS3, and Vanilla JavaScript**.

> **Zero External Dependencies / Frameworks**  
> No React, Vue, Angular, Bootstrap, Tailwind, Node.js, or any frontend/backend frameworks.  
> Works completely and natively by opening `index.html` directly in any standard web browser (Chrome, Edge, Firefox, Safari).

---

## 📂 File Structure

```text
aapla_gaav_/
│
├── index.html          # Public landing page with citizen portal, schemes, statistics & grievance form
├── login.html          # Dedicated citizen login, registration & password reset portal
├── admin-login.html    # Dedicated village administrator / Sarpanch secure login portal
├── dashboard.html      # Full 16-item Village Administrator & CEP management command center
├── style.css           # Master stylesheet (Responsive layout, Dark Mode, Toasts, Modals, Print styles)
├── script.js           # Master Vanilla JS engine (LocalStorage DB, Session security, Translations, Reports)
│
├── assets/
│   ├── logo.png        # Official Aapla Gaav emblem & Sarpanch profile seal
│   └── village.jpg     # Village photographic asset
│
├── css/
│   ├── style.css       # Core landing page styles
│   └── dashboard.css   # Administrator console styles
│
├── js/
│   ├── auth.js         # Authentication, database seeding & session security guards
│   ├── dashboard.js    # Administrator dashboard interactive CRUD logic & charts
│   └── main.js         # Landing page interactions, citizen modals & ticker
│
└── README.md           # Comprehensive platform documentation & testing guide
```

---

## 🔑 Demo Access Credentials

### Village Administrator / Sarpanch Login
- **Login Portal:** [admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html) or click **“Admin Login”** on [index.html](file:///c:/shreeya/aapla_gaav_/index.html)
- **Admin ID:** `admin@aaplagav`
- **Password:** `Aapla@123`
- *Features 1-Click Auto-Fill Demo Credentials button on both portals.*

### Citizen Portal Login
- **Login Portal:** [login.html](file:///c:/shreeya/aapla_gaav_/login.html) or click **“Citizen Portal”** on [index.html](file:///c:/shreeya/aapla_gaav_/index.html)
- **Mobile Number:** `9876543210`
- **Password:** `Citizen@123`
- *New citizens can also register their account directly with any 10-digit mobile number.*

---

## 🏛️ Comprehensive Feature Guide by Step

### STEP 1 — Landing Page & Dual Login System
- **Hero Banner:** Tagline: *“Our Village. Our Progress. Our Future.”* with village imagery and scalable SVG civic art.
- **Demographic Ribbon:** Displays live counters for Population (8,542), Households (1,982), CEP Score (78/100), Active Projects (12), Pending Complaints (18), and Village Budget (₹1,24,50,000).
- **Public Services Section:** 6 civic services with instant modal action sheets:
  1. Birth & Death Certificates
  2. 7/12 & 8A Land Records Extract
  3. Water Tap Connections (Har Ghar Jal)
  4. Property Tax (Ghar Patti) Online Payment
  5. Caste & Income Certificates
  6. E-Panchayat Kiosk & Hall Bookings
- **Citizen Portal Login & Account Creation:**
  - Citizen login with mobile number and password
  - "Create Account" modal with instant validation and registration
  - "Forgot Password" self-service reset flow
  - Preloaded citizen account: `9876543210` / `Citizen@123` (Anand Deshmukh)
- **Administrator Login:**
  - Dedicated Sarpanch login dialog and separate portal ([admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html))
  - Password is never exposed in URL or unmasked text in normal dashboard views
  - Redirects securely to `dashboard.html` upon authentication

---

### STEP 2 — Admin Dashboard & Executive Overview
- **Executive Welcome:** "Welcome back, Sarpanch — Aapla Gaav, Nagpur, Maharashtra".
- **Dynamic Clock & Sync Status:** Live current day, formatted Indian calendar date, and timestamp of last database sync.
- **Administrative Alerts Popover:** Unread notifications drawer with instant access to Gram Sabha quorum notices and water repair updates.
- **6 Large Metric Stat Cards:**
  1. **Population:** `8,542` (with gender breakdown)
  2. **Households:** `1,982` (100% electrified)
  3. **CEP Score:** `78/100` (A+ Grade)
  4. **Active Projects:** `12` (village development works)
  5. **Pending Complaints:** `18` (live grievance tickets)
  6. **Village Budget:** `₹1,24,50,000` (FY 2026-27 Gram Panchayat allocation)
- **Visual CEP Gauge & Breakdown:**
  - Pure SVG animated radial progress gauge displaying overall score: **78 / 100**
  - Color-coded progress bars for all 7 developmental pillars:
    - 💧 **Water & Sanitation:** `88%`
    - 🎓 **Education:** `82%`
    - 🌾 **Agriculture:** `81%`
    - 💻 **Digital Services:** `76%`
    - 🏥 **Health:** `74%`
    - 🌳 **Environment:** `72%`
    - 🛣️ **Infrastructure:** `69%`
  - Historical quarterly performance trend chart (SVG sparkline from Q3 '25 to Current).

---

### STEP 3 — Village Profile & 16-Item Navigation Sidebar
- **16 Comprehensive Sidebar Navigation Views:**
  1. Dashboard
  2. Village Profile
  3. CEP Overview
  4. Projects
  5. Education
  6. Health
  7. Water & Sanitation
  8. Agriculture
  9. Infrastructure
  10. Government Schemes
  11. Complaints
  12. Announcements
  13. Citizens
  14. Documents
  15. Reports
  16. Settings
- **Village Profile Management:**
  - View & Edit modal covering all requested demographic indicators:
    - Village name: *Aapla Gaav*
    - District: *Nagpur*
    - Taluka: *Nagpur Rural*
    - State: *Maharashtra*
    - Population: *8,542*
    - Households: *1,982*
    - Village area: *14.8 sq. km (1,480 Hectares)*
    - Literacy rate: *86.4%*
    - Male population: *4,390*
    - Female population: *4,152*
    - Main occupations: *Agriculture, Agro-Processing, Dairy Farming, Handloom, Local Commerce*
    - Main crops: *Nagpur Oranges, Cotton, Soybean, Wheat, Gram (Chana), Tur Dal*
    - Contact info: *Gram Panchayat Bhavan, Shivaji Maharaj Chowk, Aapla Gaav*
  - Instant persistence to `localStorage` with live header and banner updates.

---

### STEP 4 — Projects, Development & Dynamic CEP Management
- **Village Development Projects CRUD System:**
  - **Add Project:** Create new capital works with Name, Department, Category, Location, Budget, Amount Spent, Start Date, Expected Completion Date, Progress %, Status, and Description.
  - **Edit Project:** Modify budget, milestones, contractor scope, and progress percentage.
  - **Delete Project:** Soft-confirmation deletion that updates the project count across cards.
  - **Status Filtering:** Tab filter by `Planned`, `In Progress`, `Completed`, `Delayed`.
  - **Detailed Project Inspection Modal:** Shows budget breakdown, site location, timeline, and scope.
  - **12 Preloaded Development Projects:**
    1. Village Road Improvement (Concrete bypass road)
    2. New Water Tank (50,000 Litre elevated storage reservoir)
    3. Solar Street Lights (120 automated LED poles)
    4. School Renovation (Smart digital computer classroom)
    5. Drainage Project (Underground covered storm-water network)
    6. Community Hall (Multi-purpose Samaj Mandir hall)
    7. Anganwadi Development (Child nutrition & play zone upgrade)
    8. Soil Testing Lab & Farmer Facilitation Centre
    9. PHC Primary Health Centre Solar Power & Cold Chain
    10. Solid Waste Management & Bio-Composting Unit
    11. Groundwater Recharge & De-silting of Aapla Gaav Lake
    12. CCTV Surveillance & Public PA Audio Announcement System
- **Dynamic CEP Management:**
  - Interactive sliders for all 7 pillars (Education, Health, Water, Infra, Agri, Environment, Digital).
  - Real-time recalculation of average composite score as sliders move.
  - One-click **“Save CEP Indicators”** saves changes to `localStorage` and automatically updates dashboard radial score, badges, and breakdown bars!

---

### STEP 5 — Citizen Management & Grievance Redressal
- **Citizen Management Directory:**
  - 4 Key Metrics: Total Citizens (`8,542`), Registered Citizens (`1,420`), New Registrations (`38`), Active Users (`215`).
  - Searchable citizen table with Name, Mobile, Ward Area, Registration Date, and Status.
  - Modal to register new village residents with assigned wards.
- **Citizen Grievance Redressal System:**
  - Citizen complaint submission form on landing page and citizen portal with file attachment.
  - Unique sequential ticket IDs: **`AG-2026-XXXXX`** (e.g., `AG-2026-00101`, `AG-2026-00125`).
  - Categories: *Water, Roads, Electricity, Sanitation, Education, Health, Agriculture, Other*.
  - 5 Dashboard Metrics: Total Complaints, New Complaints, In Progress, Resolved, Average Turnaround (`1.8 Days`).
  - **Complete 5-Stage Administrative Lifecycle:**
    `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`
  - Administrator can:
    - Inspect full grievance file with citizen photo attachments.
    - Assign ticket to specific officers (Gram Sevak, Water Engineer, MSEDCL Lineman, Health Inspector).
    - Update progress status and document official resolution notes.
    - 1-click **“Mark Resolved”** button.

---

### STEP 6 — Government Schemes, Announcements & Comprehensive Reports
- **Government Schemes Directory:**
  - Tracks 6 major central and state flagship welfare schemes:
    1. **PM-KISAN** (Pradhan Mantri Kisan Samman Nidhi)
    2. **PMAY** (Pradhan Mantri Awas Yojana - Gramin)
    3. **MGNREGA** (Rural Employment Guarantee)
    4. **Jal Jeevan Mission** (Har Ghar Jal 100% tap water)
    5. **Swachh Bharat Mission** (Grameen ODF-Plus)
    6. **Pradhan Mantri Ujjwala Yojana** (PMUY Clean Cooking Gas)
  - Detailed Metrics for Each Scheme:
    - Eligible Beneficiaries
    - Applications Received
    - Approved Beneficiaries
    - Pending Applications
    - Completed / Saturated
    - Amount Distributed (e.g. ₹85,20,000 for PM-KISAN, ₹1.24 Cr for JJM)
  - Administrator can **Add New Scheme** or **Edit Existing Scheme** metrics via interactive modal.
- **Village Announcements & Notice Board:**
  - Administrator can broadcast official notices with:
    - Title
    - Category: *Gram Sabha announcements, Village meetings, Government notices, Health camps, Cleanliness drives, Emergency notices*
    - Priority: *Normal, High, Emergency*
    - Date of event / publication
    - Document attachment name
    - Detailed description
  - Rendered in active announcements feed with priority badges and category tags.
  - Instant scrolling ticker update tool that feeds directly into the live marquee on `index.html`.
- **Comprehensive Reports Engine (9 Sectors):**
  - Individual report generation and printing cards for all 9 sectors:
    1. **CEP Performance** (7-pillar audit score certificate)
    2. **Village Development** (Demographic baseline & Finance Commission roadmap)
    3. **Projects** (Budget sanctions, spent ratios, progress %, and completion dates)
    4. **Education** (Literacy tracking, school equipment, and mid-day meal audits)
    5. **Health** (PHC operations, immunization saturation, and Ayushman cards)
    6. **Water & Sanitation** (Har Ghar Jal 100% potability and waste compliance)
    7. **Agriculture** (Soil health, sub-canal irrigation, and crop yield records)
    8. **Complaints** (Grievance turnaround velocity, SLA logs, and officer resolution rates)
    9. **Government Schemes** (Beneficiary disbursement tables and saturation)
  - Every sector includes:
    - **“Generate Report”** button to preview formatted executive audit summary.
    - **“Print / Save as PDF”** button utilizing native browser **`window.print()`** with print-optimized CSS!

---

### STEP 7 — Security, Admin Settings & Polish

#### 👤 Official Administrator Profile (Demo Data)
- **Name:** Shri. Suresh Patil
- **Designation:** Sarpanch
- **Village:** Aapla Gaav
- **District:** Nagpur
- **Taluka:** Nagpur Rural
- **State:** Maharashtra
- **Mobile:** `+91 94221 88990`
- **Email:** `suresh.patil@aaplagav.gov.in`
- **Profile Photo:** Official emblem badge (`assets/logo.png`)
- Includes **“Edit Administrator Profile”** modal to update profile attributes in `localStorage`.

#### 🔒 Authentication & Session Security (Client-Side Demo)
- **Login & Logout:** Controlled via `AaplaAuth` module in `script.js` and `js/auth.js`.
- **Protected Dashboard:** `AaplaAuth.requireAdmin()` runs on `dashboard.html` load; unauthenticated direct access is blocked and redirected to `admin-login.html`.
- **Session Persistence:** Active session stored in `localStorage` under `aapla_admin_session`.
- **Inactivity Session Timeout:** Automatically monitors user activity timestamps; logs out the session if inactive for **30 minutes** (1,800,000 ms).
- **Password Change UI:** Modal allowing the administrator to update password with length and match verification.

> ### ⚠️ Security Disclaimer
> This project implements **client-side demo authentication** using browser `localStorage` and JavaScript session timers for demonstration, educational, and evaluation purposes.  
> **It is NOT production-grade security.**  
> A real, production-grade deployment of a government digital platform must employ:
> 1. A secure backend server (e.g. Node.js, Python, Go, Java).
> 2. An enterprise relational database (e.g. PostgreSQL) with role-based access control.
> 3. Cryptographic password hashing (bcrypt, Argon2, PBKDF2) with random salts.
> 4. Secure HTTP-only, SameSite, Secure cookie-based sessions or signed JWT tokens.
> 5. Mandatory SSL/HTTPS encryption across all endpoints.
> 6. Server-side authorization, input sanitization, rate limiting, and CSRF protection.

#### 🎨 Extra Features
- **English / Marathi Language Switcher:** Instant toggle between English and Marathi (`आपले गाव`) with persistent preference storage.
- **Dark Mode / Light Mode:** High-contrast dark theme toggle with CSS variable overrides for comfortable night governance.
- **Floating Toast Notifications:** Non-blocking status notifications (success, info, warning) for all CRUD actions.
- **Global Search:** Topbar search across development projects, grievance tickets, and government welfare schemes.
- **Data Export & Reset:** Download complete village state as `.json` or reset to clean demo defaults.
- **Responsive Mobile Layout:** Responsive sidebar drawer, collapsible header menu, and adaptive card grids.

---

## 🧪 Comprehensive Testing Guide

Follow these steps to test every single feature and workflow:

### 1. Test Citizen Login & Registration
1. Open [index.html](file:///c:/shreeya/aapla_gaav_/index.html) in your browser.
2. Click **“Citizen Portal”** in the top navigation bar.
3. Test preloaded login: Mobile `9876543210` / Password `Citizen@123`. Click **Log In as Citizen**.
4. Confirm the Citizen Dashboard modal opens showing your name (*Anand Deshmukh*), ward, and filed grievances.
5. Sign out, click **Citizen Portal** again, switch to **Create Account**, enter a new name and 10-digit number, and click **Create Citizen Account**. Confirm account creation and automatic login.
6. Open [login.html](file:///c:/shreeya/aapla_gaav_/login.html) to test the dedicated full-page citizen portal.

### 2. Test Admin Login & Protected Route Guard
1. Click **“Admin Login”** on the homepage or open [admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html).
2. Click **“1-Click Auto-Fill Demo Admin”** (`admin@aaplagav` / `Aapla@123`).
3. Click **Secure Admin Login**.
4. Confirm successful redirect to [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html).
5. In a new private/incognito window or after clearing localStorage, try opening [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html) directly: confirm it blocks unauthenticated access and redirects back to `admin-login.html`.

### 3. Test Village Profile Editing (STEP 3)
1. In `dashboard.html`, click **“Village Profile”** in the sidebar.
2. Click **“Edit Village Information”**.
3. Change the population to `8,600` or edit the village area.
4. Click **“Save Village Information”**.
5. Confirm the green toast notification appears and the population card updates immediately.

### 4. Test Projects CRUD (STEP 4)
1. Click **“Projects”** in the sidebar.
2. Click **“+ Add New Project”**. Fill out the form with a new project name, select category, budget (`₹5,00,000`), progress `40%`, and status `In Progress`. Click **Save Project**.
3. Confirm the project appears in the table.
4. Click the **✎** (Edit) button on any project, change its progress or status to `Completed`, and save.
5. Click the status filter tabs (**In Progress**, **Completed**, **Delayed**) to verify filtering.
6. Click the **🗑** (Delete) button to remove a project and confirm the count updates.

### 5. Test CEP Score Adjustments (STEP 4)
1. Click **“CEP Overview”** in the sidebar.
2. Scroll to the **“Interactive Indicator Adjustment Console”**.
3. Drag the **Water & Sanitation** slider to `95%` and **Education** to `90%`.
4. Observe the live calculated composite score update in real-time.
5. Click **“Save CEP Indicators”**.
6. Switch to the **Dashboard** view and verify the central radial SVG gauge updates to the new score.

### 6. Test Citizen Grievance Submission & Resolution (STEP 5)
1. Return to [index.html](file:///c:/shreeya/aapla_gaav_/index.html) and scroll to the **“Lodge a Citizen Grievance”** section.
2. Fill out the form (Name: *Sunil Patil*, Category: *Water*, Priority: *High*, Description: *Pipeline leak near main gate*).
3. Submit the form. Notice the generated tracking ID (e.g. `AG-2026-00121`).
4. Go to [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html) and click **“Complaints”** in the sidebar.
5. Locate the newly filed ticket in the table.
6. Click **“Update”**, assign it to *Gram Sevak Smt. Sunita Kulkarni*, change status to `In Progress`, enter response notes, and save.
7. Click the green **✓** button to mark it `Resolved` and verify the pending complaint counter decrements.

### 7. Test Government Schemes (STEP 6)
1. In `dashboard.html`, click **“Government Schemes”** in the sidebar.
2. Observe all 6 flagship schemes (PM-KISAN, PMAY, MGNREGA, Jal Jeevan, SBM, Ujjwala) with their metrics.
3. Click **“+ Add New Scheme”**, enter details, and save.
4. Click **“✎ Edit”** on any scheme to update approved count or amount distributed.

### 8. Test Announcements (STEP 6)
1. In `dashboard.html`, click **“Announcements”** in the sidebar.
2. In the **“Create New Village Announcement”** form, select category *Health camps*, set priority *High*, set date, and enter description.
3. Click **“📢 Publish Official Announcement”**.
4. Confirm it appears immediately in the active announcements list.
5. Enter text into the **“Homepage Scrolling Ticker”** form and submit; return to `index.html` to see the live marquee ticker update.

### 9. Test Reports & Print/Save as PDF (STEP 6)
1. In `dashboard.html`, click **“Reports”** in the sidebar.
2. Notice all 9 sector report cards (CEP, Development, Projects, Education, Health, Water, Agriculture, Complaints, Schemes).
3. Click **“🖨️ Print / PDF”** on any sector card (e.g. CEP Performance or Projects).
4. Verify a clean printable window opens with the official Gram Panchayat letterhead, audit table, Sarpanch signature block, and triggers the browser's native **`window.print()`** dialog!

### 10. Test Admin Profile, Security & Password Change (STEP 7)
1. In `dashboard.html`, click **“Settings”** in the sidebar or click Suresh Patil's admin chip in the topbar.
2. Verify Suresh Patil's profile details are displayed.
3. Click **“✎ Edit Profile”**, modify the email or mobile, and save.
4. Click **“🔑 Change Administrator Password”**, enter `Aapla@123` as current, and specify a new password. Confirm update.
5. In the topbar, click **“🌓”** to toggle Dark Mode on and off.
6. Click **“मराठी”** to switch language to Marathi, then click **“EN”** to restore English.
7. Test the search bar: type `Water` and press Enter to see global search results.
8. Click **“Logout”** to securely terminate the administrator session.

---

## 💻 Tech Stack & Compliance

- **Markup:** Semantic HTML5 (`<header>`, `<main>`, `<aside>`, `<nav>`, `<section>`, `<table>`, `<dialog>`).
- **Styling:** Modular CSS3 with Custom Properties (CSS variables), Flexbox, CSS Grid, media queries for all device sizes, and `@media print` print styles.
- **Logic:** Vanilla JavaScript (ES6+) with zero build tools, bundlers, or external packages.
- **Persistence:** Browser `localStorage` with initial JSON seeding and validation.
- **Portability:** Opens directly via `file:///` protocol in any browser without needing a local web server.
