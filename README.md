# Aapla Gaav — Valivade | CEP (Citizen Empowerment Platform)

A digital village management and governance web application for **Valivade (Walivade) — वळिवडे**, Karvir Taluka, Kolhapur District, Maharashtra, built strictly using **HTML5, CSS3, and Vanilla JavaScript**.

> **Zero External Dependencies / Frameworks**  
> No React, Vue, Angular, Bootstrap, Tailwind, Node.js, or any frontend/backend frameworks.  
> Works completely and natively by opening `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 📍 Village Identity & Reference Information

- **Village Name:** Valivade (Walivade)
- **Marathi Name:** वळिवडे
- **Gram Panchayat:** Valivade Gram Panchayat (वळिवडे ग्रामपंचायत)
- **Taluka:** Karvir (Karveer)
- **District:** Kolhapur
- **State:** Maharashtra
- **PIN Code:** 416119
- **Village Census Code:** 567409
- **Geographic Coordinates:** 16.71979° N, 74.31259° E
- **Geographical Area:** 588.44 hectares (5.88 sq. km)

### 📊 Census 2011 / Reference Data
*All demographic baseline figures are sourced from Census 2011 and clearly segregated from current 2026 unverified data:*
- **Total Population:** 1,668
- **Male Population:** 865 (51.86%)
- **Female Population:** 803 (48.14%)
- **Sex Ratio:** 928 females per 1,000 males
- **Total Households:** 332
- **Children (0–6 years):** 187
- **Literacy Rate:** 67.63%
  - Male Literacy: 75.95%
  - Female Literacy: 58.66%
- **Current 2026 Population / Budget:** *“Data not available / Update required”* (unverified values are never fabricated).

---

## 📂 File Structure

```text
aapla_gaav_/
│
├── index.html          # Public landing page with citizen portal, schemes, statistics, OpenStreetMap & grievance form
├── login.html          # Dedicated citizen login, registration & password reset portal
├── admin-login.html    # Dedicated Valivade Gram Panchayat Administrator secure login portal
├── dashboard.html      # Full 16-item Village Administrator & CEP management command center
├── style.css           # Master stylesheet (Responsive layout, Dark Mode, Toasts, Modals, Print styles)
├── script.js           # Master Vanilla JS engine (LocalStorage DB, Session security, Translations, Reports)
│
├── assets/
│   ├── logo.png        # Official Valivade Gram Panchayat emblem & profile seal
│   └── village.jpg     # Village photographic asset
│
├── css/
│   ├── style.css       # Core landing page styles
│   └── dashboard.css   # Administrator console styles
│
├── js/
│   ├── auth.js         # Authentication, Valivade database seeding & session security guards
│   ├── dashboard.js    # Administrator dashboard interactive CRUD logic & charts
│   └── main.js         # Landing page interactions, citizen modals & ticker
│
└── README.md           # Comprehensive platform documentation & testing guide
```

---

## 🔑 Demo Access Credentials

### Village Administrator Login
- **Login Portal:** [admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html) or click **“Sarpanch Desk (Admin)”** on [index.html](file:///c:/shreeya/aapla_gaav_/index.html)
- **Admin ID:** `admin@valivade` (also accepts legacy `admin@aaplagav`)
- **Password:** `Aapla@123`
- *Features 1-Click Auto-Fill Demo Credentials button on both portals.*
- *Note: These are simulated demonstration credentials and do not represent the current elected Sarpanch or individual officials.*

### Citizen Portal Login
- **Login Portal:** [login.html](file:///c:/shreeya/aapla_gaav_/login.html) or click **“Citizen Portal”** on [index.html](file:///c:/shreeya/aapla_gaav_/index.html)
- **Mobile Number:** `9876543210`
- **Password:** `Citizen@123`
- *New citizens can also register their account directly with any 10-digit mobile number.*

---

## 🏛️ Comprehensive Feature Guide by Step

### STEP 1 — Landing Page & Dual Login System
- **Hero Banner:** Tagline: *“Our Village. Our Progress. Our Future.”* with village imagery, badge for *Valivade Gram Panchayat, Karvir, Kolhapur (Maharashtra)*, and scalable SVG civic art.
- **Demographic Ribbon:** Displays live counters for Population (1,668 - Census 2011), Households (332), Area (588.44 ha), Literacy (67.63%), CEP Score (78/100), and Annual Budget status (*“Data not available / Update required”*).
- **Embedded Location Map:** Interactive OpenStreetMap iframe showing exact coordinates for Valivade Gram Panchayat (`16.71979° N, 74.31259° E`).
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
  - Dedicated Valivade Gram Panchayat login dialog and separate portal ([admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html))
  - Password is never exposed in URL or unmasked text in normal dashboard views
  - Redirects securely to `dashboard.html` upon authentication

---

### STEP 2 — Admin Dashboard & Executive Overview
- **Executive Welcome:** "Welcome, Village Administrator — Valivade Gram Panchayat, Karvir, Kolhapur, Maharashtra".
- **Dynamic Clock & Sync Status:** Live current day, formatted Indian calendar date, and timestamp of last database sync.
- **Administrative Alerts Popover:** Unread notifications drawer with instant access to Gram Sabha quorum notices and water repair updates.
- **Metric Stat Cards:**
  1. **Population:** `1,668` (Census 2011 / Reference Data with gender split: `865 M / 803 F`, Sex Ratio: `928`)
  2. **Households:** `332` (Census 2011 Reference Data; Village Area: `588.44 ha`)
  3. **CEP Score:** `78/100` (Grade A Benchmark)
  4. **Active Projects:** `12` (Demo sample development projects)
  5. **Pending Complaints:** `18` (Live grievance tickets)
  6. **Village Budget:** `Data not available / Update required` (clearly indicated for administrator update)
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

---

### STEP 3 — Detailed Valivade Village Profile (8 Distinct Sectors)
Accessible via the 16-item sidebar under **“Village Profile”**:
1. **Demographics:** Population (1,668), Male (865), Female (803), Households (332), Children (187), Sex Ratio (928), Area (588.44 ha).
2. **Education:** Literacy rate (67.63%), Male (75.95%), Female (58.66%), Zilla Parishad Primary School, Valivade.
3. **Agriculture:** Sugarcane farming, Dairy cooperative, Panchganga basin canal & lift irrigation; secondary crops (paddy, soybean, vegetables).
4. **Water:** Piped drinking water distribution network, Panchganga river basin groundwater recharge.
5. **Sanitation:** ODF Gram Panchayat status, 100% individual household latrine (IHHL) coverage.
6. **Infrastructure:** Regional road connectivity (Kolhapur-Hupari/Karvir road), Valivade railway halt (Miraj-Kolhapur line).
7. **Government Schemes:** State and central flagship schemes (PM-KISAN, PMAY-G, MGNREGA, Jal Jeevan, SBM-G, PMUY).
8. **Village Development:** Valivade Gram Panchayat Development Plan (GPDP) status.
- *Where official data is verified from Census 2011, it is presented cleanly. Where not verified, it explicitly displays: “Information needs to be updated by the Gram Panchayat administrator.”*
- **Geographic Map View:** Embedded OpenStreetMap centered on Valivade (`16.71979° N, 74.31259° E`).
- **Edit Village Information Modal:** Allows administrator to edit and persist profile changes in `localStorage`.

---

### STEP 4 — Projects, Development & Dynamic CEP Management
- **Village Development Projects CRUD System:**
  - **Add Project:** Create new capital works with Name, Department, Category, Location, Budget, Amount Spent, Start Date, Expected Completion Date, Progress %, Status, and Description.
  - **Edit Project:** Modify budget, milestones, contractor scope, and progress percentage.
  - **Delete Project:** Soft-confirmation deletion that updates project counts across cards.
  - **Status Filtering:** Tab filter by `Planned`, `In Progress`, `Completed`, `Delayed`.
  - **Demo Tagging:** All sample/fictional records are clearly labeled with a **`[DEMO]`** badge for transparent data segregation.
- **Dynamic CEP Management:**
  - Interactive sliders for all 7 pillars (Education, Health, Water, Infra, Agri, Environment, Digital).
  - Real-time recalculation of average composite score as sliders move.
  - One-click **“Save CEP Indicators”** saves changes to `localStorage` and automatically updates dashboard radial score, badges, and breakdown bars.

---

### STEP 5 — Citizen Management & Grievance Redressal
- **Citizen Management Directory:**
  - 4 Key Metrics: Total Citizens (`1,668` Census 2011 Reference), Registered Citizens (`1,420`), New Registrations (`38`), Active Users (`215`).
  - Searchable citizen table with Name, Mobile, Ward Area, Registration Date, and Status.
  - Modal to register new village residents with assigned wards.
- **Citizen Grievance Redressal System:**
  - Citizen complaint submission form on landing page and citizen portal with file attachment.
  - Unique sequential ticket IDs: **`AG-2026-XXXXX`** (e.g., `AG-2026-00101`, `AG-2026-00125`).
  - Categories: *Water, Roads, Electricity, Sanitation, Education, Health, Agriculture, Other*.
  - 5 Dashboard Metrics: Total Complaints, New Complaints, In Progress, Resolved, Average Turnaround (`1.8 Days`).
  - **Complete 5-Stage Administrative Lifecycle:**
    `Submitted` → `Under Review` → `Assigned` → `In Progress` → `Resolved`
  - Assigned officers use generic administrative titles (e.g. *Water Supply Junior Engineer, Gram Sevak In-Charge, Health Inspector*).

---

### STEP 6 — Government Schemes, Announcements & Comprehensive Reports
- **Government Schemes Directory:**
  - Tracks 6 flagship welfare schemes: PM-KISAN, PMAY-G, MGNREGA, Jal Jeevan Mission, Swachh Bharat Mission, PM Ujjwala Yojana.
  - Tracks beneficiaries (scaled to Valivade's 332 households baseline), applications, approvals, disbursements.
  - Administrator can add or edit scheme metrics.
- **Village Announcements & Notice Board:**
  - Category filters: Gram Sabha announcements, Health camps, Cleanliness drives, Government notices.
  - Direct live ticker update tool that synchronizes with the marquee on `index.html`.
- **Comprehensive Reports Engine (9 Sectors):**
  - Report generation for all 9 sectors with Valivade Gram Panchayat official letterhead, Census code (567409), Karvir, Kolhapur heading.
  - **“Print / Save as PDF”** button utilizing native browser **`window.print()`** with print-optimized styling.

---

### STEP 7 — Security, Admin Settings & Polish

#### 👤 Official Administrator Profile (Demo Data)
- **Role:** Gram Panchayat Administrator
- **Sarpanch / Gram Sevak Name:** `Administrator to update` (No fabricated real names)
- **Village:** Valivade (Walivade)
- **Taluka:** Karvir
- **District:** Kolhapur
- **State:** Maharashtra
- **Email:** `admin@valivade`
- Includes **“Edit Administrator Profile”** modal to update profile attributes in `localStorage`.

#### 🔒 Authentication & Session Security (Client-Side Demo)
- **Login & Logout:** Controlled via `AaplaAuth` module in `script.js` and `js/auth.js`.
- **Protected Dashboard:** Direct unauthenticated access to `dashboard.html` is blocked and redirected to `admin-login.html`.
- **Session Persistence:** Active session stored in `localStorage` under `aapla_admin_session`.
- **Inactivity Session Timeout:** Automatically monitors user activity timestamps; logs out the session if inactive for **30 minutes** (1,800,000 ms).
- **Password Change UI:** Modal allowing the administrator to update password with length and match verification.

> ### ⚠️ Security Disclaimer
> This project implements **client-side demo authentication** using browser `localStorage` and JavaScript session timers for demonstration, educational, and evaluation purposes.  
> **It is NOT production-grade security.**  
> A real, production-grade deployment of a government digital platform must employ a secure backend server, database, cryptographic password hashing, HTTP-only signed session tokens/JWT, SSL/HTTPS encryption, and server-side authorization.

#### 🎨 Extra Features
- **English / Marathi Language Switcher:** Instant toggle between English and Marathi (`आपले गाव — वळिवडे`) with persistent preference storage.
- **Dark Mode / Light Mode:** High-contrast dark theme toggle with CSS variable overrides.
- **Floating Toast Notifications:** Non-blocking status notifications (success, info, warning) for all CRUD actions.
- **Global Search:** Topbar search across development projects, grievance tickets, and government welfare schemes.
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
1. Click **“Sarpanch Desk (Admin)”** on the homepage or open [admin-login.html](file:///c:/shreeya/aapla_gaav_/admin-login.html).
2. Click **“1-Click Auto-Fill Demo Admin”** (`admin@valivade` / `Aapla@123`).
3. Click **Secure Login to Administrator Dashboard**.
4. Confirm successful redirect to [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html).
5. In a new private/incognito window or after clearing localStorage, try opening [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html) directly: confirm it blocks unauthenticated access and redirects back to `admin-login.html`.

### 3. Test Village Profile (STEP 3 & 5)
1. In `dashboard.html`, click **“Village Profile”** in the sidebar.
2. Confirm the 8 distinct sector sections are rendered with Census 2011 verified figures (Pop: `1,668`, Households: `332`, Area: `588.44 ha`, Literacy: `67.63%`).
3. Confirm unverified fields display: *“Information needs to be updated by the Gram Panchayat administrator.”*
4. Confirm the OpenStreetMap iframe displays the map for Valivade, Kolhapur (`16.71979° N, 74.31259° E`).
5. Click **“Edit Village Information”**, edit any field, save, and confirm updates persist in `localStorage`.

### 4. Test Projects CRUD (STEP 4)
1. Click **“Projects”** in the sidebar.
2. Notice preloaded projects have the **`[DEMO]`** tag.
3. Click **“+ Add New Project”**. Fill out the form with a new project name, select category, budget (`₹5,00,000`), progress `40%`, and status `In Progress`. Click **Save Project**.
4. Confirm the project appears in the table.
5. Click the **✎** (Edit) button on any project, change its progress or status to `Completed`, and save.
6. Click the status filter tabs (**In Progress**, **Completed**, **Delayed**) to verify filtering.
7. Click the **🗑** (Delete) button to remove a project and confirm the count updates.

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
6. Click **“Update”**, assign it to *Gram Sevak (In-Charge)*, change status to `In Progress`, enter response notes, and save.
7. Click the green **✓** button to mark it `Resolved` and verify the pending complaint counter decrements.

### 7. Test Government Schemes & Announcements (STEP 6)
1. In `dashboard.html`, click **“Government Schemes”** in the sidebar.
2. Observe all 6 flagship schemes with their metrics. Click **“+ Add New Scheme”** or **“✎ Edit”** on any scheme.
3. Click **“Announcements”** in the sidebar. Publish a new announcement or update the homepage scrolling marquee.

### 8. Test Reports & Print/Save as PDF (STEP 6)
1. In `dashboard.html`, click **“Reports”** in the sidebar.
2. Click **“🖨️ Print / PDF”** on any sector card (e.g. CEP Performance or Projects).
3. Verify a printable window opens with the official Valivade Gram Panchayat letterhead (Karvir, Kolhapur) and triggers the browser's native **`window.print()`** dialog.

### 9. Test Admin Profile & Settings (STEP 7)
1. In `dashboard.html`, click **“Settings”** in the sidebar.
2. Verify the administrator profile card displays *Valivade Gram Panchayat, Karvir, Kolhapur*.
3. Click **“✎ Edit Profile”** to test editing administrator fields.
4. Click **“🔑 Change Administrator Password”**, test updating credentials.
5. Test the **Dark Mode** toggle and **Language Switcher (EN / मराठी)**.
6. Click **“Logout”** to terminate the session.

---

## 💻 Tech Stack & Compliance

- **Markup:** Semantic HTML5 (`<header>`, `<main>`, `<aside>`, `<nav>`, `<section>`, `<table>`, `<dialog>`).
- **Styling:** Modular CSS3 with Custom Properties (CSS variables), Flexbox, CSS Grid, media queries for all device sizes, and `@media print` print styles.
- **Logic:** Vanilla JavaScript (ES6+) with zero build tools, bundlers, or external packages.
- **Persistence:** Browser `localStorage` with initial JSON seeding and auto-migration from legacy data.
- **Portability:** Opens directly via `file:///` protocol in any browser without needing a local web server.
