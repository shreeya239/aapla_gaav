/* ==========================================================================
   Aapla Gaav – CEP Authentication & State Management Module
   Pure Vanilla JavaScript & LocalStorage
   ========================================================================== */

var AAPLA_STORAGE_KEYS = window.AAPLA_STORAGE_KEYS || {
  ADMIN_SESSION: 'aapla_admin_session',
  CITIZEN_SESSION: 'aapla_citizen_session',
  CITIZENS_DB: 'aapla_citizens_db',
  COMPLAINTS: 'aapla_complaints_db',
  PROJECTS: 'aapla_projects_db',
  SCHEMES: 'aapla_schemes_db',
  ANNOUNCEMENTS: 'aapla_announcements_db',
  NOTICES: 'aapla_notices_db',
  VILLAGE_PROFILE: 'aapla_village_profile',
  CEP_SCORES: 'aapla_cep_scores',
  ADMIN_PROFILE: 'aapla_admin_profile',
  THEME: 'aapla_theme_pref',
  LANG: 'aapla_lang_pref',
  LAST_UPDATE: 'aapla_last_update_ts'
};
window.AAPLA_STORAGE_KEYS = AAPLA_STORAGE_KEYS;

// Official Demo Administrator Credentials
// Clearly marked as sample demo credentials; not claiming to belong to the real current Sarpanch.
var DEMO_ADMIN = window.DEMO_ADMIN || {
  adminId: 'admin@valivade',
  altAdminId: 'admin@aaplagav',
  password: 'Aapla@123',
  title: 'Gram Panchayat Administrator (Demo Account)',
  name: 'Administrator to update',
  village: 'Valivade (Walivade)',
  villageMr: 'वळिवडे',
  taluka: 'Karvir',
  district: 'Kolhapur',
  state: 'Maharashtra',
  pinCode: '416119',
  censusCode: '567409',
  mobile: 'Information needs to be updated',
  email: 'valivade.gp@kolhapur.gov.in',
  photo: 'assets/logo.png',
  isDemoAccount: true
};
window.DEMO_ADMIN = DEMO_ADMIN;

// Seed initial database if empty or missing new schema keys
function initializeStorageDefaults() {
  // Check for legacy fictional data and reset to Valivade, Kolhapur
  const existingVp = localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE);
  const existingPrj = localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS);
  if ((existingVp && (existingVp.includes('Nagpur') || existingVp.includes('8542') || !existingVp.includes('Valivade'))) ||
      (existingPrj && (existingPrj.includes('Nagpur') || !existingPrj.includes('[DEMO]')))) {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.SCHEMES);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(AAPLA_STORAGE_KEYS.NOTICES);
  }

  // 1. Village Profile (STEP 3 & Census 2011 Reference Data)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE)) {
    const defaultProfile = {
      villageName: 'Valivade (Walivade)',
      villageNameMr: 'वळिवडे',
      gramPanchayat: 'Valivade Gram Panchayat',
      gramPanchayatMr: 'वळिवडे ग्रामपंचायत',
      district: 'Kolhapur',
      districtMr: 'कोल्हापूर',
      taluka: 'Karvir',
      talukaMr: 'करवीर',
      state: 'Maharashtra',
      stateMr: 'महाराष्ट्र',
      pinCode: '416119',
      censusCode: '567409',
      // Real Census 2011 Reference Data
      population: 1668,
      households: 332,
      malePopulation: 865,
      femalePopulation: 803,
      childrenZeroToSix: 187,
      sexRatio: '928 females per 1,000 males',
      villageArea: '588.44 hectares (5.88 sq. km)',
      villageAreaHa: 588.44,
      literacyRate: '67.63%',
      maleLiteracy: '75.95%',
      femaleLiteracy: '58.66%',
      dataSource: 'Census 2011 / Reference Data',
      current2026Population: 'Data not available / Update required',
      currentBudget: 'Data not available / Update required',
      // Real administrative context
      sarpanchName: 'Administrator to update',
      gramSevakName: 'Administrator to update',
      panchayatMembers: 'Information needs to be updated by the Gram Panchayat administrator.',
      officeTimings: '10:00 AM to 05:30 PM (Monday to Saturday)',
      contactInfo: 'Valivade Gram Panchayat Bhavan, Valivade, Karvir, Kolhapur, Maharashtra 416119. Coordinates: 16.71979° N, 74.31259° E',
      mainOccupations: 'Agriculture, Sugarcane farming, Dairy cooperative, Commerce, Service sector',
      mainCrops: 'Sugarcane, Paddy (Rice), Soybean, Vegetables, Groundnut',
      latitude: '16.71979',
      longitude: '74.31259',
      // Sectoral real-world indicators
      educationDetails: 'Zilla Parishad Primary School, Valivade. Secondary & higher education accessible in Karvir / Kolhapur cluster.',
      waterDetails: 'Piped drinking water distribution network; Panchganga river basin recharge zone.',
      sanitationDetails: 'ODF Gram Panchayat status; household sanitary latrine coverage.',
      agricultureDetails: 'Fertile black soil of Panchganga basin; canal & lift irrigation for sugarcane.',
      infrastructureDetails: 'Connected via Kolhapur-Hupari / Karvir regional road link; Valivade railway halt nearby.',
      schemesStatus: 'Information needs to be updated by the Gram Panchayat administrator.',
      developmentStatus: 'Information needs to be updated by the Gram Panchayat administrator.'
    };
    localStorage.setItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE, JSON.stringify(defaultProfile));
  }

  // 2. CEP Scores (STEP 4)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.CEP_SCORES)) {
    const defaultCep = {
      education: 82,
      health: 74,
      water: 88,
      infrastructure: 69,
      agriculture: 81,
      environment: 72,
      digital: 76
    };
    localStorage.setItem(AAPLA_STORAGE_KEYS.CEP_SCORES, JSON.stringify(defaultCep));
  }

  // 3. Seed Citizen DB (STEP 5)
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB)) {
    const defaultCitizens = [
      {
        fullName: 'Anand Deshmukh',
        mobile: '9876543210',
        password: 'Citizen@123',
        area: 'Ward No. 03 (Shivaji Nagar)',
        aadharLast4: '4589',
        registeredDate: '2026-08-14',
        status: 'Active'
      },
      {
        fullName: 'Sunita Gaikwad',
        mobile: '9822334455',
        password: 'Citizen@123',
        area: 'Ward No. 01 (Gram Panchayat Chowk)',
        aadharLast4: '9012',
        registeredDate: '2026-09-02',
        status: 'Active'
      },
      {
        fullName: 'Rameshwar Kale',
        mobile: '9822114455',
        password: 'Citizen@123',
        area: 'Ward No. 01 (Gaothan Chowk)',
        aadharLast4: '3310',
        registeredDate: '2026-09-12',
        status: 'Active'
      },
      {
        fullName: 'Kavita Joshi',
        mobile: '9422012345',
        password: 'Citizen@123',
        area: 'Ward No. 02 (Mandir Area)',
        aadharLast4: '7721',
        registeredDate: '2026-09-18',
        status: 'Active'
      },
      {
        fullName: 'Prakash Shinde',
        mobile: '9890123456',
        password: 'Citizen@123',
        area: 'Ward No. 04 (School & PHC)',
        aadharLast4: '6102',
        registeredDate: '2026-09-22',
        status: 'Active'
      },
      {
        fullName: 'Vandana More',
        mobile: '9765432109',
        password: 'Citizen@123',
        area: 'Ward No. 03 (Shivaji Nagar)',
        aadharLast4: '8841',
        registeredDate: '2026-09-25',
        status: 'Active'
      },
      {
        fullName: 'Suresh Bhende',
        mobile: '9823456781',
        password: 'Citizen@123',
        area: 'Ward No. 05 (Krushi Parisar)',
        aadharLast4: '1920',
        registeredDate: '2026-09-28',
        status: 'Pending Verification'
      },
      {
        fullName: 'Ganesh Wankhede',
        mobile: '9850123987',
        password: 'Citizen@123',
        area: 'Ward No. 02 (Mandir Area)',
        aadharLast4: '4432',
        registeredDate: '2026-10-01',
        status: 'Active'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(defaultCitizens));
  }

  // 4. Seed Complaints DB with AG-2026-XXXXX format and full status lifecycles (STEP 5)
  const existingComplaints = localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS);
  if (!existingComplaints || !existingComplaints.includes('AG-2026-')) {
    const defaultComplaints = [
      {
        id: 'AG-2026-00101',
        name: 'Kavita Joshi',
        mobile: '9422012345',
        category: 'Water',
        location: 'Ward No. 02, Near Vitthal Mandir tap',
        description: 'Low water pressure in pipeline tap during morning supply. Water barely fills two buckets.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Water Supply Junior Engineer',
        adminResponse: 'Inspection team dispatched. Valve booster repair underway in Ward 2 line.',
        date: '2026-10-02',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00102',
        name: 'Prakash Shinde',
        mobile: '9890123456',
        category: 'Electricity',
        location: 'Ward No. 04, Pole #14 near Z.P. School',
        description: 'Streetlight pole #14 non-functional for past 3 days. Lane is pitch dark at night.',
        priority: 'Medium',
        status: 'Assigned',
        assignedTo: 'MSEDCL Lineman',
        adminResponse: 'Work order #EL-89 issued for LED replacement.',
        date: '2026-10-02',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00103',
        name: 'Rameshwar Kale',
        mobile: '9822114455',
        category: 'Roads',
        location: 'Ward No. 01, Main Gaothan bypass road',
        description: 'Deep potholes on bypass road causing risk to two-wheelers and bullock carts.',
        priority: 'High',
        status: 'Under Review',
        assignedTo: 'Gram Sevak (In-Charge)',
        adminResponse: 'Surveyed by civil supervisor. Added to emergency gravel patch plan.',
        date: '2026-10-01',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00104',
        name: 'Vandana More',
        mobile: '9765432109',
        category: 'Sanitation',
        location: 'Ward No. 03, Shivaji Nagar lane 4',
        description: 'Weekly garbage tractor skipped collection. Waste bins overflowing.',
        priority: 'Medium',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminResponse: '',
        date: '2026-10-01',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00105',
        name: 'Suresh Bhende',
        mobile: '9823456781',
        category: 'Agriculture',
        location: 'Ward No. 05, Sub-canal distributor gate',
        description: 'Sub-canal water release schedule notification delayed. Farmers need water for gram crop.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Irrigation Dept Liason Officer',
        adminResponse: 'Canal release scheduled for Wednesday 6:00 AM. Circular posted.',
        date: '2026-09-30',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00106',
        name: 'Ganesh Wankhede',
        mobile: '9850123987',
        category: 'Health',
        location: 'Ward No. 02, Near village pond drainage',
        description: 'Mosquito breeding in stagnant water near pond area. Fogging urgently needed.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Health Inspector (Sub-Center)',
        adminResponse: 'Larvicide chemical spraying completed. Malathion fogging scheduled tomorrow.',
        date: '2026-09-30',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00107',
        name: 'Meena Thakre',
        mobile: '9822445566',
        category: 'Water',
        location: 'Ward No. 03, Pipeline cross junction',
        description: 'Turbid muddy water discharge during morning supply.',
        priority: 'High',
        status: 'Under Review',
        assignedTo: 'Water Works Supervisor',
        adminResponse: 'Flushing pipeline from overhead tank.',
        date: '2026-09-29',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00108',
        name: 'Dnyaneshwar Raut',
        mobile: '9423112233',
        category: 'Other',
        location: 'Ward No. 01, CSC Kendra',
        description: 'CSC kiosk biometric scanner issue for senior citizen pension.',
        priority: 'Low',
        status: 'Resolved',
        assignedTo: 'CSC VLE Operator',
        adminResponse: 'Biometric iris scanner configured. Citizen verified and pension disbursed.',
        date: '2026-09-29',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00109',
        name: 'Sanjay Ghonge',
        mobile: '9823998877',
        category: 'Sanitation',
        location: 'Ward No. 04, Weekly Bazaar Ground',
        description: 'Public dustbins overflowing after Sunday market.',
        priority: 'Medium',
        status: 'In Progress',
        assignedTo: 'Sanitation Squad Lead',
        adminResponse: 'Sanitation team deployed for clearing.',
        date: '2026-09-28',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00110',
        name: 'Pooja Chimote',
        mobile: '9422887766',
        category: 'Education',
        location: 'Ward No. 05, Anganwadi #3',
        description: 'Anganwadi veranda roof tile cracked; rainwater seeping inside.',
        priority: 'High',
        status: 'Assigned',
        assignedTo: 'PWD Gram Panchayat Contractor',
        adminResponse: 'Mason hired. Tiles replaced on priority.',
        date: '2026-09-28',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00111',
        name: 'Ashok Lambat',
        mobile: '9822665544',
        category: 'Roads',
        location: 'Ward No. 02, Near ST Bus stand',
        description: 'Drainage chamber concrete cover dislodged, causing traffic hazard.',
        priority: 'Critical',
        status: 'In Progress',
        assignedTo: 'Civil Work Supervisor',
        adminResponse: 'Barricade installed. New heavy-duty RCC slab delivered for placement.',
        date: '2026-09-27',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00112',
        name: 'Rekha Meshram',
        mobile: '9765112244',
        category: 'Water',
        location: 'Ward No. 03, Plot 22',
        description: 'Meter reading correction requested for house tap connection.',
        priority: 'Low',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminResponse: '',
        date: '2026-09-27',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00113',
        name: 'Arjun Bhoyar',
        mobile: '9822331199',
        category: 'Other',
        location: 'Ward No. 04, Smashan Bhumi road',
        description: 'Fallen banyan tree branch blocking cart track.',
        priority: 'Medium',
        status: 'Resolved',
        assignedTo: 'Gram Rozgar Sevak',
        adminResponse: 'Tree branch safely cleared with chainsaw team.',
        date: '2026-09-26',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00114',
        name: 'Nitin Sonwane',
        mobile: '9422334411',
        category: 'Electricity',
        location: 'Ward No. 01, Gaothan transformer',
        description: 'Sparks observed on jumper wire near distribution transformer.',
        priority: 'Critical',
        status: 'In Progress',
        assignedTo: 'MSEDCL Junior Engineer',
        adminResponse: 'Shut-down taken for 45 minutes; loose conductor clamped tightly.',
        date: '2026-09-26',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00115',
        name: 'Chhaya Dhote',
        mobile: '9890445522',
        category: 'Other',
        location: 'Ward No. 05, House 71',
        description: 'PMAY-G 2nd installment geo-tag verification pending.',
        priority: 'Medium',
        status: 'Under Review',
        assignedTo: 'Gram Sevak',
        adminResponse: 'Awaits mobile app sync with AwaasSoft portal.',
        date: '2026-09-25',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00116',
        name: 'Bhagwan Tidke',
        mobile: '9822778811',
        category: 'Agriculture',
        location: 'Ward No. 02, Shivar 44',
        description: 'Cotton pink bollworm pest attack advisory needed.',
        priority: 'Medium',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminResponse: '',
        date: '2026-09-25',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00117',
        name: 'Sunil Mahajan',
        mobile: '9765332211',
        category: 'Sanitation',
        location: 'Ward No. 03, Community Toilet complex',
        description: 'Running water motor tripped at public toilet block.',
        priority: 'High',
        status: 'Assigned',
        assignedTo: 'Plumbing contractor',
        adminResponse: 'Starter capacitor repair ongoing.',
        date: '2026-09-24',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00118',
        name: 'Shalini Nikhade',
        mobile: '9822110099',
        category: 'Water',
        location: 'Ward No. 04, Handpump #3',
        description: 'Borewell handpump chain disconnected inside casing.',
        priority: 'Medium',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminResponse: '',
        date: '2026-09-24',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00119',
        name: 'Tukaram Borikar',
        mobile: '9422001122',
        category: 'Roads',
        location: 'Ward No. 01, Gaothan lane 2',
        description: 'Gravel loose on slope after downpour.',
        priority: 'Low',
        status: 'Submitted',
        assignedTo: 'Unassigned',
        adminResponse: '',
        date: '2026-09-23',
        imageAttachment: null
      },
      {
        id: 'AG-2026-00120',
        name: 'Manish Uike',
        mobile: '9890998877',
        category: 'Electricity',
        location: 'Ward No. 05, Krushi transformer #2',
        description: 'Phase imbalance causing agricultural pump tripping.',
        priority: 'Medium',
        status: 'Under Review',
        assignedTo: 'MSEDCL Sub-station operator',
        adminResponse: 'Load balancing will be conducted tomorrow.',
        date: '2026-09-22',
        imageAttachment: null
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(defaultComplaints));
  }

  // 5. Seed Projects DB with complete schema and required example projects (STEP 4)
  const existingProjects = localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS);
  if (!existingProjects || !existingProjects.includes('startDate')) {
    const defaultProjects = [
      {
        id: 'PRJ-2026-01',
        name: '[DEMO] Village Road Improvement',
        department: 'Public Works (PWD)',
        category: 'Infrastructure',
        location: 'Ward 3 to Main Karvir Link Road',
        budget: '₹22,80,000',
        budgetNum: 2280000,
        spent: '₹15,50,000',
        spentNum: 1550000,
        startDate: '2026-01-15',
        expectedCompletionDate: '2026-11-30',
        progress: 68,
        status: 'In Progress',
        description: 'Construction of 2.4 km asphalt concrete road with side stone pitching and storm water culverts.'
      },
      {
        id: 'PRJ-2026-02',
        name: '[DEMO] New Water Tank',
        department: 'Water & Sanitation (Jal Jeevan)',
        category: 'Water & Sanitation',
        location: 'Ward 2 Hilltop Reservoir Site',
        budget: '₹34,50,000',
        budgetNum: 3450000,
        spent: '₹29,32,500',
        spentNum: 2932500,
        startDate: '2025-10-10',
        expectedCompletionDate: '2026-10-25',
        progress: 85,
        status: 'In Progress',
        description: '1.5 Lakh Litre RCC Elevated Storage Reservoir (ESR) with automated telemetry chlorinated filtration.'
      },
      {
        id: 'PRJ-2026-03',
        name: '[DEMO] Solar Street Lights',
        department: 'Renewable Energy (MEDA)',
        category: 'Infrastructure',
        location: 'All Wards & Shivar Links',
        budget: '₹8,50,000',
        budgetNum: 850000,
        spent: '₹7,82,000',
        spentNum: 782000,
        startDate: '2026-02-01',
        expectedCompletionDate: '2026-10-15',
        progress: 92,
        status: 'In Progress',
        description: 'Installation of 120 high-efficiency solar LED smart poles with dusk-to-dawn sensors and LiFePO4 batteries.'
      },
      {
        id: 'PRJ-2026-04',
        name: '[DEMO] School Renovation',
        department: 'School Education Dept',
        category: 'Education',
        location: 'Z.P. Primary Campus, Valivade',
        budget: '₹14,50,000',
        budgetNum: 1450000,
        spent: '₹14,50,000',
        spentNum: 1450000,
        startDate: '2025-11-01',
        expectedCompletionDate: '2026-08-15',
        progress: 100,
        status: 'Completed',
        description: 'Refurbishing 6 classrooms, smart interactive board installation, computer lab setup, and separate hygienic washrooms.'
      },
      {
        id: 'PRJ-2026-05',
        name: '[DEMO] Drainage Project',
        department: 'Sanitation & Health',
        category: 'Infrastructure',
        location: 'Ward 1 and Ward 4 Gaothan',
        budget: '₹11,20,000',
        budgetNum: 1120000,
        spent: '₹4,48,000',
        spentNum: 448000,
        startDate: '2026-04-10',
        expectedCompletionDate: '2026-12-15',
        progress: 40,
        status: 'In Progress',
        description: 'Underground closed masonry drainage network preventing mosquito breeding and wastewater overflow.'
      },
      {
        id: 'PRJ-2026-06',
        name: '[DEMO] Community Hall (Samaj Mandir)',
        department: 'Social Justice & Rural Dev',
        category: 'Infrastructure',
        location: 'Near Gram Panchayat Bhavan',
        budget: '₹18,00,000',
        budgetNum: 1800000,
        spent: '₹2,50,000',
        spentNum: 250000,
        startDate: '2026-08-01',
        expectedCompletionDate: '2027-03-31',
        progress: 15,
        status: 'Planned',
        description: 'Multipurpose public hall with seating capacity for 400 citizens for Gram Sabhas, weddings, and self-help group workshops.'
      },
      {
        id: 'PRJ-2026-07',
        name: '[DEMO] Anganwadi Development',
        department: 'Women & Child Welfare',
        category: 'Education',
        location: 'Ward 5 Krushi Nagar',
        budget: '₹6,80,000',
        budgetNum: 680000,
        spent: '₹6,46,000',
        spentNum: 646000,
        startDate: '2026-03-01',
        expectedCompletionDate: '2026-10-10',
        progress: 95,
        status: 'In Progress',
        description: 'Building child-friendly model Anganwadi center equipped with nutritional food preparation area and educational play equipment.'
      },
      {
        id: 'PRJ-2026-08',
        name: '[DEMO] Farmers Soil Health & Weather Station',
        department: 'Agriculture Dept',
        category: 'Agriculture',
        location: 'Krushi Vikas Kendra',
        budget: '₹6,20,000',
        budgetNum: 620000,
        spent: '₹4,03,000',
        spentNum: 403000,
        startDate: '2026-05-01',
        expectedCompletionDate: '2026-11-15',
        progress: 65,
        status: 'In Progress',
        description: 'Automated weather sensor and soil testing lab providing rapid NPK test reports to 1,420 farmers.'
      },
      {
        id: 'PRJ-2026-09',
        name: '[DEMO] Primary Health Center (PHC) Upgrade',
        department: 'Public Health Dept',
        category: 'Health',
        location: 'Valivade Primary Health Sub-Center',
        budget: '₹16,00,000',
        budgetNum: 1600000,
        spent: '₹9,60,000',
        spentNum: 960000,
        startDate: '2026-02-15',
        expectedCompletionDate: '2026-12-31',
        progress: 60,
        status: 'In Progress',
        description: 'Setting up 24x7 emergency maternity ward, pathology test counter, cold storage for vaccines, and solar backup.'
      },
      {
        id: 'PRJ-2026-10',
        name: '[DEMO] Village Waste Segregation & Bio-Compost Unit',
        department: 'Swachh Bharat Mission',
        category: 'Environment',
        location: 'Gaothan Outskirts',
        budget: '₹7,40,000',
        budgetNum: 740000,
        spent: '₹5,18,000',
        spentNum: 518000,
        startDate: '2026-03-10',
        expectedCompletionDate: '2026-11-20',
        progress: 70,
        status: 'In Progress',
        description: 'Solid and liquid waste processing facility converting wet organic village garbage into subsidized bio-fertilizer for farmers.'
      },
      {
        id: 'PRJ-2026-11',
        name: '[DEMO] Groundwater Recharge Well & Lake Desilting',
        department: 'Watershed & Water Resources',
        category: 'Environment',
        location: 'Valivade Talao (Lake)',
        budget: '₹5,50,000',
        budgetNum: 550000,
        spent: '₹4,95,000',
        spentNum: 495000,
        startDate: '2026-01-20',
        expectedCompletionDate: '2026-09-30',
        progress: 90,
        status: 'Delayed',
        description: 'Excavation of silt and construction of 8 recharge shafts along lake catchment basin to lift groundwater table.'
      },
      {
        id: 'PRJ-2026-12',
        name: '[DEMO] CCTV Surveillance & Public Announcement PA System',
        department: 'Home & Panchayat Security',
        category: 'Infrastructure',
        location: 'Key Chowks & School Zones',
        budget: '₹2,10,000',
        budgetNum: 210000,
        spent: '₹1,51,200',
        spentNum: 151200,
        startDate: '2026-06-01',
        expectedCompletionDate: '2026-11-05',
        progress: 72,
        status: 'In Progress',
        description: '16 HD weather-proof IP cameras and ward-wise loudspeaker sirens linked to Gram Panchayat security console.'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.PROJECTS, JSON.stringify(defaultProjects));
  }

  // 6. Seed Notices DB
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.NOTICES)) {
    const defaultNotices = [
      { id: 'NTC-01', text: 'Special Gram Sabha scheduled on 15th October at 10:00 AM in Gram Panchayat Hall.', date: '2026-10-03', pinned: true },
      { id: 'NTC-02', text: 'Free Ayushman Health Checkup & Golden Card distribution camp this Saturday.', date: '2026-10-02', pinned: false },
      { id: 'NTC-03', text: 'Applications open for PM-KISAN e-KYC biometric verification at Village CSC kiosk.', date: '2026-09-28', pinned: false }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.NOTICES, JSON.stringify(defaultNotices));
  }

  // 7. Seed Last update timestamp
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.LAST_UPDATE)) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }));
  }
}

// Run seed on script load
initializeStorageDefaults();

/* ==========================================================================
   Admin Authentication Logic & Data API
   ========================================================================== */

var AaplaAuth = window.AaplaAuth || {
  // Validate Administrator Login
  loginAdmin: function(adminId, password) {
    const cleanId = adminId.trim().toLowerCase();
    const cleanPass = password.trim();
    const isIdMatch = cleanId === DEMO_ADMIN.adminId.toLowerCase() || 
                      cleanId === 'admin@valivade' || 
                      cleanId === 'admin@aaplagav';
    if (isIdMatch && cleanPass === DEMO_ADMIN.password) {
      const session = {
        adminId: cleanId,
        name: DEMO_ADMIN.name,
        role: DEMO_ADMIN.title,
        village: DEMO_ADMIN.village,
        taluka: DEMO_ADMIN.taluka,
        district: DEMO_ADMIN.district,
        state: DEMO_ADMIN.state,
        token: 'auth_' + Math.random().toString(36).substring(2),
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
      localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }));
      return { success: true };
    }
    return { 
      success: false, 
      message: 'Invalid Admin ID or Password. Please check demo credentials: admin@valivade / Aapla@123' 
    };
  },

  // Check if Admin is logged in
  getAdminSession: function() {
    const raw = localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Route Guard: Require Admin Session
  requireAdmin: function() {
    const session = this.getAdminSession();
    if (!session) {
      window.location.href = 'admin-login.html';
      return false;
    }
    return true;
  },

  // Admin Logout
  logoutAdmin: function() {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.ADMIN_SESSION);
    window.location.href = 'index.html';
  },

  // Citizen Registration
  registerCitizen: function(data) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    
    // Check if mobile already exists
    const exists = citizens.some(c => c.mobile === data.mobile.trim());
    if (exists) {
      return { success: false, message: 'This mobile number is already registered. Please log in.' };
    }

    const newCitizen = {
      fullName: data.fullName.trim(),
      mobile: data.mobile.trim(),
      password: data.password.trim(),
      area: data.area || data.ward || 'Ward 1',
      aadharLast4: data.aadharLast4 || 'XXXX',
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    citizens.push(newCitizen);
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(citizens));

    // Auto-login citizen
    const session = {
      fullName: newCitizen.fullName,
      mobile: newCitizen.mobile,
      ward: newCitizen.area,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION, JSON.stringify(session));

    return { success: true, citizen: session };
  },

  // Citizen Login
  loginCitizen: function(mobile, password) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    const citizen = citizens.find(c => c.mobile === mobile.trim() && c.password === password.trim());

    if (citizen) {
      const session = {
        fullName: citizen.fullName,
        mobile: citizen.mobile,
        ward: citizen.area || 'Ward 3',
        loginTime: new Date().toISOString()
      };
      localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION, JSON.stringify(session));
      return { success: true, citizen: session };
    }

    return { 
      success: false, 
      message: 'Invalid Mobile Number or Password. Use Demo: 9876543210 / Citizen@123 or create an account.' 
    };
  },

  // Citizen Session
  getCitizenSession: function() {
    const raw = localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  // Citizen Logout
  logoutCitizen: function() {
    localStorage.removeItem(AAPLA_STORAGE_KEYS.CITIZEN_SESSION);
  },

  // Reset password simulation
  resetCitizenPassword: function(mobile, newPassword) {
    const citizens = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
    const index = citizens.findIndex(c => c.mobile === mobile.trim());
    if (index === -1) {
      return { success: false, message: 'No registered citizen found with this mobile number.' };
    }
    citizens[index].password = newPassword.trim();
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(citizens));
    return { success: true, message: 'Password updated successfully! You can now log in.' };
  },

  // Helper to generate AG-2026-XXXXX complaint IDs
  generateComplaintId: function() {
    const complaints = JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
    const nextNum = complaints.length + 101;
    return `AG-2026-${String(nextNum).padStart(5, '0')}`;
  },

  // Helper to get Village Profile
  getVillageProfile: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE) || '{}');
  },

  // Helper to save Village Profile
  saveVillageProfile: function(profile) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE, JSON.stringify(profile));
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }));
  },

  // Helper to get CEP Scores
  getCepScores: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CEP_SCORES) || '{}');
  },

  // Helper to save CEP Scores
  saveCepScores: function(scores) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.CEP_SCORES, JSON.stringify(scores));
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }));
  }
};

// Expose globally
window.AaplaAuth = AaplaAuth;
window.AAPLA_STORAGE_KEYS = AAPLA_STORAGE_KEYS;
window.DEMO_ADMIN = DEMO_ADMIN;
