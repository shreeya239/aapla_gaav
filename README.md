# Aapla Gaav – CEP (Citizen Empowerment Platform)

A digital village management and governance platform built strictly with **HTML5, CSS3, and Vanilla JavaScript**.

> **Zero External Dependencies / Frameworks**  
> Works directly by opening `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

---

## 🌟 Key Highlights & Features

### 1. Landing Page (`index.html`)
- **Official E-Panchayat Header:** Maharashtra Gram Panchayat insignia, emergency helpline (`1800-233-0456`), and English/Marathi language toggle.
- **Hero Banner:** Tagline: *“Our Village. Our Progress. Our Future.”* featuring a custom pure-SVG smart village illustration depicting solar streetlights, Jal Jeevan water tank, modern Z.P. school, and agricultural prosperity.
- **Village Statistics Ribbon:** Quick demographic overview showing population, households, CEP rating, and projects.
- **About Aapla Gaav:** Village profile, administrative leadership overview, and Sarpanch profile card.
- **Direct Citizen Services:** Online application portal for Birth & Death Certificates, 7/12 & 8A Land Records, Water Tap Connections, Property Tax (Ghar Patti), Caste & Income Certificates, and Public Grievances.
- **Government Schemes Directory:** Comprehensive information on PMAY-G, Jal Jeevan Mission, PM-KISAN, MGNREGA, Ayushman Bharat, and Solar Pump Schemes.
- **Public Grievance Submission:** Live citizen complaint submission form that dynamically registers complaints into `localStorage` and forwards them directly to the Sarpanch Admin Dashboard.
- **Gram Panchayat Directory & Contacts:** Direct contacts for Sarpanch, Up-Sarpanch, Gram Sevak, and Talathi, including office location and working hours.

---

### 2. Dual Authentication System (`js/auth.js`)
- **Citizen Portal Modal:**
  - Login with Mobile Number and Password.
  - **Create Account:** Register new citizen with Full Name, Mobile, Ward selection, and Password.
  - **Forgot Password:** Instant secure password reset flow.
  - **Demo Citizen Account:** Mobile: `9876543210` | Password: `Citizen@123` (includes 1-click autofill).
  - **Citizen Profile View:** Displays active grievances filed by the citizen and status tracking.
- **Village Administrator Login Modal:**
  - Distinct high-security dark administrative interface for the Sarpanch and Gram Panchayat officials.
  - **Demo Credentials:**
    - **Admin ID:** `admin@aaplagav`
    - **Password:** `Aapla@123`
    - Includes **1-Click Auto-Fill Demo Admin** button.
  - Redirects securely to `dashboard.html`.
  - Passwords are strictly protected and never exposed in the dashboard.

---

### 3. Administrator / Sarpanch Dashboard (`dashboard.html`)
- **Header Console:**
  - Live auto-updating date and time.
  - Last dashboard update / sync timestamp.
  - Notifications bell with interactive unread administrative alerts popover.
  - Administrator Profile chip (`Shri. Rajesh Patil — Sarpanch • Aapla Gaav`).
  - One-click secure logout button.
- **Welcome Banner:**
  - *“Welcome, Village Administrator — Sarpanch Desk”*
  - *“Aapla Gaav, Nagpur, Maharashtra”*
- **Main Statistics Cards (Large Metric Tiles):**
  1. **Population:** `8,542` (Gender ratio: 4,390 M / 4,152 F)
  2. **Households:** `1,982` (100% Piped Tap Water coverage)
  3. **CEP Score:** `78/100` (Grade A - High Performing Panchayat)
  4. **Active Projects:** `12` (3 nearing completion)
  5. **Pending Complaints:** `18` (Actionable SLA tracking)
  6. **Village Budget:** `₹1,24,50,000` (FY 2026-27 public fund)
- **CEP Performance Analytics:**
  - **Visual CEP Gauge:** Animated SVG radial circular score gauge showing `78 / 100`.
  - **Category Breakdown:**
    - Water & Sanitation — **88%**
    - Education — **82%**
    - Agriculture — **81%**
    - Digital Services — **76%**
    - Health — **74%**
    - Environment — **72%**
    - Infrastructure — **69%**
  - **Quarterly Progression SVG Chart:** Visualizes continuous progress from 68% up to 78%.
- **Active Projects Tracker:**
  - 12 active village works with sanctioned budgets, expenditure, completion percentage, and status indicators.
- **Interactive Grievance Redressal Command Center:**
  - Real-time complaints table synced with citizen submissions.
  - Filter by All, Pending, and Resolved.
  - **“✓ Mark Resolved”** action that immediately updates status, syncs `localStorage`, and updates the pending counter.
- **Village Budget Utilization:** Detailed breakdown across water, roads, health, solar energy, and CSC operations.
- **Notice Board Broadcaster:** Allows the Sarpanch to publish announcements that immediately update the scrolling ticker on the public landing page.

---

## 🚀 How to Run

1. Open File Explorer to `c:\shreeya\aapla_gaav_`.
2. Double-click on [index.html](file:///c:/shreeya/aapla_gaav_/index.html) to open in your default browser.
3. Click **“Admin Login”** on the navigation bar, click **“1-Click Auto-Fill Demo Admin”**, and log in to explore the Sarpanch Dashboard.
4. Or open [dashboard.html](file:///c:/shreeya/aapla_gaav_/dashboard.html) directly to inspect the administrator console.
