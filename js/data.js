/* ==========================================================================
   Aapla Gaav — Valivade Gram Panchayat (Karvir, Kolhapur)
   Master Data & LocalStorage Management Engine
   ========================================================================== */

var AAPLA_STORAGE_KEYS = window.AAPLA_STORAGE_KEYS = {
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

// Demo Administrator Profile for Valivade Gram Panchayat
var DEMO_ADMIN = window.DEMO_ADMIN = {
  adminId: 'admin@valivade',
  altAdminId: 'admin@aaplagav',
  password: 'Aapla@123',
  title: 'Gram Panchayat Administrator (Demo Account)',
  name: 'Administrator to update',
  village: 'Valivade (Walivade)',
  villageMr: 'वळिवडे',
  district: 'Kolhapur',
  districtMr: 'कोल्हापूर',
  taluka: 'Karvir',
  talukaMr: 'करवीर',
  state: 'Maharashtra',
  stateMr: 'महाराष्ट्र',
  pinCode: '416119',
  censusCode: '567409',
  mobile: 'Administrator to update',
  email: 'admin@valivade',
  sarpanchName: 'Administrator to update',
  gramSevakName: 'Administrator to update',
  officeTimings: '10:00 AM – 5:30 PM (Mon–Sat)',
  photo: 'assets/logo.png',
  isDemoAccount: true
};

// Seed initial database if empty or invalid
function initializeStorageDefaults() {
  // Purge legacy fictional Nagpur / 8542 keys
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

  // 1. Admin Profile
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE)) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.ADMIN_PROFILE, JSON.stringify(DEMO_ADMIN));
  }

  // 2. Village Profile - Valivade (Walivade), Karvir, Kolhapur (Census 2011 Reference Data)
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
      // Verified Census 2011 Reference Data
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
      sarpanchName: 'Administrator to update',
      gramSevakName: 'Administrator to update',
      panchayatMembers: 'Information needs to be updated by the Gram Panchayat administrator.',
      officeTimings: '10:00 AM to 05:30 PM (Monday to Saturday)',
      contactInfo: 'Valivade Gram Panchayat Bhavan, Valivade, Karvir, Kolhapur, Maharashtra 416119. Coordinates: 16.71979° N, 74.31259° E',
      mainOccupations: 'Agriculture, Sugarcane farming, Dairy cooperative, Commerce, Service sector',
      mainCrops: 'Sugarcane, Paddy (Rice), Soybean, Vegetables, Groundnut',
      latitude: '16.71979',
      longitude: '74.31259',
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

  // 3. CEP Scores
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

  // 4. Citizens DB
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB)) {
    const defaultCitizens = [
      {
        fullName: 'Anand Deshmukh',
        mobile: '9876543210',
        password: 'Citizen@123',
        area: 'Ward No. 03 (Shivaji Chowk)',
        aadharLast4: '4589',
        registeredDate: '2026-08-14',
        status: 'Active'
      },
      {
        fullName: 'Sunita Gaikwad',
        mobile: '9822334455',
        password: 'Citizen@123',
        area: 'Ward No. 01 (Gram Panchayat Bhavan)',
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
        area: 'Ward No. 04 (Z.P. School Area)',
        aadharLast4: '6102',
        registeredDate: '2026-09-22',
        status: 'Active'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(defaultCitizens));
  }

  // 5. Development Projects (Tagged [DEMO])
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS)) {
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
        location: 'Ward 5 Krushi Parisar',
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
        description: 'Automated weather sensor and soil testing lab providing rapid NPK test reports to farmers.'
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
        description: 'Setting up 24x7 emergency maternity room, pathology test counter, cold storage for vaccines, and solar backup.'
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

  // 6. Complaints DB
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS)) {
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
        description: 'Deep potholes on bypass road causing risk to two-wheelers and transport vehicles.',
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
        location: 'Ward No. 03, Shivaji Chowk lane 4',
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
        description: 'Sub-canal water release schedule notification delayed for sugarcane fields.',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'Irrigation Dept Liaison Officer',
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
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(defaultComplaints));
  }

  // 7. Government Schemes
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES)) {
    const defaultSchemes = [
      {
        id: 'SCH-01',
        name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        department: 'Agriculture & Farmers Welfare',
        beneficiaries: 1420,
        applications: 1450,
        approved: 1420,
        pending: 30,
        completed: 1420,
        amountDistributed: '₹85,20,000',
        description: 'Direct income support of ₹6,000 per year in three equal installments to all landholder farmer families.',
        eligibility: 'All landholding farmer families with cultivable land.',
        documents: 'Aadhaar, Land 7/12 extract, Bank passbook linked to Aadhaar.',
        officialLink: 'https://pmkisan.gov.in'
      },
      {
        id: 'SCH-02',
        name: 'PMAY (Pradhan Mantri Awas Yojana - Gramin)',
        department: 'Ministry of Rural Development',
        beneficiaries: 48,
        applications: 65,
        approved: 48,
        pending: 17,
        completed: 36,
        amountDistributed: '₹57,60,000',
        description: 'Financial assistance of ₹1.20 lakh per household for constructing pucca disaster-resilient houses.',
        eligibility: 'Houseless families or families living in kutcha/dilapidated houses.',
        documents: 'Aadhaar, Ration card, Bank passbook, Gram Sabha resolution.',
        officialLink: 'https://pmayg.nic.in'
      },
      {
        id: 'SCH-03',
        name: 'MGNREGA (Mahatma Gandhi National Rural Employment)',
        department: 'Rural Employment Guarantee',
        beneficiaries: 640,
        applications: 670,
        approved: 640,
        pending: 30,
        completed: 610,
        amountDistributed: '₹42,80,000',
        description: '100 days of guaranteed wage employment annually for unskilled manual water-conservation works.',
        eligibility: 'Adult members of rural households willing to do manual unskilled work.',
        documents: 'Aadhaar, Age proof, Bank details, Passport size photos.',
        officialLink: 'https://nrega.nic.in'
      },
      {
        id: 'SCH-04',
        name: 'Jal Jeevan Mission (Har Ghar Jal)',
        department: 'Drinking Water & Sanitation',
        beneficiaries: 332,
        applications: 332,
        approved: 332,
        pending: 0,
        completed: 332,
        amountDistributed: '₹24,50,000',
        description: 'Providing functional household tap water connection (FHTC) of 55 LPCD potable water to every home.',
        eligibility: 'All rural households in Valivade village (100% saturation target).',
        documents: 'Property tax receipt, Household ID proof.',
        officialLink: 'https://jaljeevanmission.gov.in'
      },
      {
        id: 'SCH-05',
        name: 'Swachh Bharat Mission (Grameen - ODF Plus)',
        department: 'Ministry of Jal Shakti',
        beneficiaries: 332,
        applications: 332,
        approved: 332,
        pending: 0,
        completed: 332,
        amountDistributed: '₹8,50,000',
        description: 'ODF-Plus sustainability, community sanitation blocks, and liquid/solid bio-waste management.',
        eligibility: 'Households without access to sanitary toilets.',
        documents: 'Aadhaar card, Bank account details, Residence proof.',
        officialLink: 'https://swachhbharatmission.gov.in'
      },
      {
        id: 'SCH-06',
        name: 'Pradhan Mantri Ujjwala Yojana (PMUY)',
        department: 'Petroleum & Natural Gas',
        beneficiaries: 890,
        applications: 920,
        approved: 890,
        pending: 30,
        completed: 890,
        amountDistributed: '₹14,24,000',
        description: 'Deposit-free LPG cylinder connections to women from rural below-poverty households.',
        eligibility: 'Adult women belonging to BPL or underprivileged rural families.',
        documents: 'BPL Ration Card, Aadhaar of all family members, Bank passbook.',
        officialLink: 'https://www.pmuy.gov.in'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.SCHEMES, JSON.stringify(defaultSchemes));
  }

  // 8. Announcements
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS)) {
    const defaultAnnouncements = [
      {
        id: 'ANN-01',
        title: 'Special Autumn Gram Sabha Meeting — Valivade Gram Panchayat',
        category: 'Gram Sabha announcements',
        priority: 'High',
        date: '2026-10-15',
        description: 'Mandatory Gram Sabha at Valivade Gram Panchayat Bhavan to review annual welfare records and 15th Finance Commission action plan.',
        attachment: 'Gram_Sabha_Agenda_Notice.pdf'
      },
      {
        id: 'ANN-02',
        title: 'Free Health Checkup & Ayushman Camp — Karvir Division',
        category: 'Health camps',
        priority: 'Normal',
        date: '2026-10-10',
        description: 'Medical camp in coordination with Kolhapur District Health Department (CPR Hospital). Free biometric card generation at Village Health Sub-Centre.',
        attachment: 'Health_Camp_Schedule.pdf'
      },
      {
        id: 'ANN-03',
        title: 'Swachhata Pakhwada Cleanliness Drive — Valivade',
        category: 'Cleanliness drives',
        priority: 'Normal',
        date: '2026-10-08',
        description: 'All-ward sanitation drive and dry/wet waste segregation awareness program. Citizen volunteers encouraged to participate.',
        attachment: 'Cleanliness_Drive_Route.pdf'
      },
      {
        id: 'ANN-04',
        title: 'Panchganga Canal Water Release & Irrigation Advisory',
        category: 'Government notices',
        priority: 'High',
        date: '2026-10-06',
        description: 'Kolhapur Irrigation Division scheduled canal discharge notice for sugarcane and winter crops.',
        attachment: 'Canal_Schedule_Karvir.pdf'
      },
      {
        id: 'ANN-05',
        title: 'Heavy Rainfall Alert & River Basin Advisory',
        category: 'Emergency notices',
        priority: 'Emergency',
        date: '2026-10-04',
        description: 'Karvir Taluka disaster management cell advisory: avoid low-lying river bank paths and secure cattle during sudden squalls.',
        attachment: 'Disaster_Advisory_Karvir.pdf'
      }
    ];
    localStorage.setItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(defaultAnnouncements));
  }

  // 9. Last update timestamp
  if (!localStorage.getItem(AAPLA_STORAGE_KEYS.LAST_UPDATE)) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }));
  }
}

// Data Access API
var AaplaData = window.AaplaData = {
  getVillageProfile: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE) || '{}');
  },
  saveVillageProfile: function(profile) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.VILLAGE_PROFILE, JSON.stringify(profile));
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
  },
  getCepScores: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CEP_SCORES) || '{}');
  },
  saveCepScores: function(scores) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.CEP_SCORES, JSON.stringify(scores));
    localStorage.setItem(AAPLA_STORAGE_KEYS.LAST_UPDATE, new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
  },
  getProjects: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.PROJECTS) || '[]');
  },
  saveProjects: function(projects) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  },
  getComplaints: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.COMPLAINTS) || '[]');
  },
  saveComplaints: function(complaints) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  },
  getSchemes: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.SCHEMES) || '[]');
  },
  saveSchemes: function(schemes) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  },
  getAnnouncements: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS) || '[]');
  },
  saveAnnouncements: function(announcements) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },
  getCitizens: function() {
    return JSON.parse(localStorage.getItem(AAPLA_STORAGE_KEYS.CITIZENS_DB) || '[]');
  },
  saveCitizens: function(citizens) {
    localStorage.setItem(AAPLA_STORAGE_KEYS.CITIZENS_DB, JSON.stringify(citizens));
  }
};

// Auto initialize on script load
initializeStorageDefaults();
