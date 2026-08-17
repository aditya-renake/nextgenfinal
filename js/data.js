/**
 * Compass Data Store
 * Contains career categories, quiz questions, entrance exams information,
 * career roadmaps, and frequently asked questions.
 */

const CATS = [
  { id: 'eng',   name: 'Engineering & Tech',        short: 'TECH',        angle: 0 },
  { id: 'med',   name: 'Medicine & Health',         short: 'MEDICINE',    angle: 45 },
  { id: 'com',   name: 'Commerce & Business',       short: 'BUSINESS',    angle: 90 },
  { id: 'des',   name: 'Design & Creative Arts',    short: 'DESIGN',      angle: 135 },
  { id: 'media', name: 'Media & Communication',     short: 'MEDIA',       angle: 180 },
  { id: 'hum',   name: 'Humanities & Social Sci.',  short: 'HUMANITIES',  angle: 225 },
  { id: 'law',   name: 'Law & Public Policy',       short: 'LAW',         angle: 270 },
  { id: 'sci',   name: 'Pure Sciences & Research',  short: 'SCIENCE',     angle: 315 },
];

const QUESTIONS = [
  {
    q: "In a group project, what part do you gravitate to?",
    opts: [
      { t: "Sketching how the whole system should work", c: 'eng' },
      { t: "Making sure everyone's treated and credited fairly", c: 'law' },
      { t: "Pitching the idea so people actually buy in", c: 'com' },
      { t: "Making the final output look and feel right", c: 'des' },
    ]
  },
  {
    q: "Pick a way to spend a free Sunday.",
    opts: [
      { t: "Tinkering with gadgets or building a small app", c: 'eng' },
      { t: "Reading about how the human body works", c: 'med' },
      { t: "Reading the business and markets section", c: 'com' },
      { t: "Filming, writing, or editing something to post", c: 'media' },
    ]
  },
  {
    q: "A friend is visibly stressed. Your instinct is to:",
    opts: [
      { t: "Ask what's actually broken and fix it, step by step", c: 'eng' },
      { t: "Just sit with them and check how they're really doing", c: 'med' },
      { t: "Help them think through the numbers and options", c: 'com' },
      { t: "Help them see whether this is even fair to begin with", c: 'law' },
    ]
  },
  {
    q: "Which school subject did time fly by in?",
    opts: [
      { t: "Physics or Math problem sets", c: 'sci' },
      { t: "Biology", c: 'med' },
      { t: "Economics or Accountancy", c: 'com' },
      { t: "History, Political Science, or Psychology", c: 'hum' },
    ]
  },
  {
    q: "You're at a museum. Which wing do you head to first?",
    opts: [
      { t: "Space, robotics, and machines", c: 'eng' },
      { t: "Natural history and evolution", c: 'sci' },
      { t: "Ancient civilisations and art", c: 'hum' },
      { t: "Design and architecture", c: 'des' },
    ]
  },
  {
    q: "Which kind of win actually excites you?",
    opts: [
      { t: "Cracking a genuinely tough logic problem", c: 'eng' },
      { t: "Winning a debate or a moot court round", c: 'law' },
      { t: "Growing a small business or side hustle", c: 'com' },
      { t: "Getting a story or a post to really land", c: 'media' },
    ]
  },
  {
    q: "With one completely free year, you'd probably:",
    opts: [
      { t: "Build a startup idea or an app prototype", c: 'eng' },
      { t: "Shadow doctors or volunteer at a hospital", c: 'med' },
      { t: "Intern at a newsroom or content studio", c: 'media' },
      { t: "Travel and journal about different cultures", c: 'hum' },
    ]
  },
  {
    q: "Which book would you actually finish?",
    opts: [
      { t: "A scientist's biography or a research deep-dive", c: 'sci' },
      { t: "Something on how markets and economies actually work", c: 'com' },
      { t: "A design or architecture coffee-table book", c: 'des' },
      { t: "A courtroom drama or a real legal case study", c: 'law' },
    ]
  },
  {
    q: "What frustrates you most, honestly?",
    opts: [
      { t: "Systems or processes that are badly built", c: 'eng' },
      { t: "Injustice or people being treated unfairly", c: 'law' },
      { t: "Bad design — clunky apps, ugly spaces", c: 'des' },
      { t: "Misinformation or things explained badly", c: 'media' },
    ]
  },
  {
    q: "Picture your ideal workday. It involves:",
    opts: [
      { t: "Labs, experiments, and research papers", c: 'sci' },
      { t: "Patients, wards, or a clinic", c: 'med' },
      { t: "Clients, pitches, and spreadsheets", c: 'com' },
      { t: "People, stories, culture, and community", c: 'hum' },
    ]
  },
];

const EXAM_INFO = {
  jeemain: {
    name: 'JEE Main',
    site: 'https://jeemain.nta.nic.in',
    body: 'National Testing Agency (NTA)',
    category: 'Engineering & Tech',
    badge: 'National Level',
    months: ['jan', 'feb', 'apr', 'oct', 'nov'],
    keyDates: 'Oct–Nov Reg (S1) • Jan Exam (S1) • Feb Reg (S2) • Apr Exam (S2)',
    timeline: 'Two sessions a year. Session 1 registration late Oct–Nov, exam in January. Session 2 registration in February, exam in April.',
    schedule: [
      { month: 'oct', phase: 'Registration', text: 'Session 1 Registration opens late October' },
      { month: 'nov', phase: 'Registration', text: 'Session 1 Application deadline & correction window' },
      { month: 'jan', phase: 'Exam Window', text: 'Session 1 Computer-Based Test (CBT) across India' },
      { month: 'feb', phase: 'Registration', text: 'Session 2 Online Registration window opens' },
      { month: 'apr', phase: 'Exam Window', text: 'Session 2 Exam window & All India Ranks declaration' }
    ]
  },
  jeeadv: {
    name: 'JEE Advanced',
    site: 'https://jeeadv.ac.in',
    body: 'IIT Organizing Committee',
    category: 'Engineering & Tech',
    badge: 'IIT Entrance',
    months: ['apr', 'may', 'jun'],
    keyDates: 'Apr Registration • Mid-to-Late May Exam',
    timeline: 'Registration opens right after JEE Main results, in April. Exam is held in mid-to-late May, same year.',
    schedule: [
      { month: 'apr', phase: 'Registration', text: 'Registration opens for top 2.5 Lakh JEE Main qualifiers' },
      { month: 'may', phase: 'Exam Window', text: 'Two compulsory 3-hour papers (Paper 1 & Paper 2)' },
      { month: 'jun', phase: 'Results & JoSAA', text: 'Rank list release & JoSAA seat allocation rounds start' }
    ]
  },
  bitsat: {
    name: 'BITSAT',
    site: 'https://www.bitsadmission.com',
    body: 'BITS Pilani',
    category: 'Engineering & Tech',
    badge: 'Premier University',
    months: ['dec', 'jan', 'feb', 'mar', 'apr', 'may'],
    keyDates: 'Dec–Mar Session 1 Reg • Apr & May Exams',
    timeline: 'Session 1 registration runs December–March, exam in mid-April. Session 2 registration in April–May, exam in late May.',
    schedule: [
      { month: 'dec', phase: 'Registration', text: 'Session 1 online application portal opens' },
      { month: 'jan', phase: 'Registration', text: 'Application window active for all campus courses' },
      { month: 'feb', phase: 'Registration', text: 'Application window active' },
      { month: 'mar', phase: 'Deadline', text: 'Session 1 registration closes & slot booking begins' },
      { month: 'apr', phase: 'Exam Window', text: 'Session 1 online computer-based exam' },
      { month: 'may', phase: 'Exam Window', text: 'Session 2 online exam across multiple slots' }
    ]
  },
  statecet: {
    name: 'State CET (MHT-CET, KCET, WBJEE)',
    site: null,
    body: "State CET Cells / Boards",
    category: 'Engineering & Tech',
    badge: 'State Level',
    months: ['feb', 'mar', 'apr', 'may'],
    keyDates: 'Feb–Mar Reg • Apr–May State Exams',
    timeline: "Typically registration in February–March with the exam in April–May, but this varies by state — check your own state's CET cell website.",
    schedule: [
      { month: 'feb', phase: 'Registration', text: 'State CET portals release official notification and forms' },
      { month: 'mar', phase: 'Registration', text: 'Form filling and state domicile verification' },
      { month: 'apr', phase: 'Exam Window', text: 'State engineering & technology entrance exams commence' },
      { month: 'may', phase: 'Exam Window', text: 'PCB/PCM exams conclude and answer keys released' }
    ]
  },
  neetug: {
    name: 'NEET-UG',
    site: 'https://neet.nta.nic.in',
    body: 'National Testing Agency (NTA)',
    category: 'Medicine & Health',
    badge: 'All India Medical',
    months: ['feb', 'mar', 'may', 'jun', 'jul'],
    keyDates: 'Feb–Mar Reg • 1st Sunday of May Exam • Jun/Jul Results',
    timeline: 'Registration in February–March. Exam is traditionally the first Sunday of May, with results by June–July.',
    schedule: [
      { month: 'feb', phase: 'Registration', text: 'NTA releases NEET-UG bulletin and registration begins' },
      { month: 'mar', phase: 'Registration', text: 'Registration deadline and image correction window' },
      { month: 'may', phase: 'Exam Window', text: 'Pen-and-paper national exam on the 1st Sunday of May' },
      { month: 'jun', phase: 'Results', text: 'All India Ranks & official scorecards announced' },
      { month: 'jul', phase: 'Counselling', text: 'MCC 15% AIQ and 85% State quota counselling begins' }
    ]
  },
  stateuniv: {
    name: 'State / University Paramedical & Health Entrance',
    site: null,
    body: 'Target Medical Colleges & Universities',
    category: 'Medicine & Health',
    badge: 'University Level',
    months: ['apr', 'may', 'jun', 'jul'],
    keyDates: 'Apr–May Reg • Jun–Jul Admissions',
    timeline: "Dates vary by state and college — check your target institution's admissions page directly.",
    schedule: [
      { month: 'apr', phase: 'Registration', text: 'Allied health & pharmacy admission portals open' },
      { month: 'may', phase: 'Application', text: 'Merit registration & verification window' },
      { month: 'jun', phase: 'Admissions', text: 'Entrance test / 12th board merit list released' },
      { month: 'jul', phase: 'Counselling', text: 'Document verification and seat allotment' }
    ]
  },
  cafoundation: {
    name: 'CA Foundation',
    site: 'https://www.icai.org',
    body: 'Institute of Chartered Accountants of India (ICAI)',
    category: 'Commerce & Finance',
    badge: 'Professional Certification',
    months: ['jan', 'may', 'jun', 'sep', 'dec'],
    keyDates: 'Trimester Exams: Jan, May/Jun, Sep',
    timeline: 'Held three times a year — January, May/June, and September. Register roughly 4 months before your chosen session.',
    schedule: [
      { month: 'jan', phase: 'Exam Window', text: 'January Examination Session' },
      { month: 'may', phase: 'Exam Window', text: 'May/June Examination Session' },
      { month: 'jun', phase: 'Exam Window', text: 'June Examination Session' },
      { month: 'sep', phase: 'Exam Window', text: 'September Examination Session' },
      { month: 'dec', phase: 'Registration', text: 'Mandatory 4-month study period registration cycle' }
    ]
  },
  cuet: {
    name: 'CUET UG',
    site: 'https://cuet.nta.nic.in',
    body: 'National Testing Agency (NTA)',
    category: 'Multi-Stream / Central Univ',
    badge: 'Central Universities',
    months: ['feb', 'mar', 'may', 'jun'],
    keyDates: 'Feb–Mar Reg • May Multi-Slot Exam Window',
    timeline: 'Registration in February–March, with the exam window running through May.',
    schedule: [
      { month: 'feb', phase: 'Registration', text: 'Common University Entrance Test (CUET UG) forms open' },
      { month: 'mar', phase: 'Registration', text: 'Subject domain selection and university choices deadline' },
      { month: 'may', phase: 'Exam Window', text: 'Multi-slot Computer-Based Test across India' },
      { month: 'jun', phase: 'Results', text: 'Normalized percentile scores declared for university admissions' }
    ]
  },
  bbaentrance: {
    name: 'Management Entrances (IPMAT, NPAT, SET)',
    site: null,
    body: 'IIM Indore / Rohtak, NMIMS, Symbiosis',
    category: 'Commerce & Management',
    badge: 'Top B-Schools',
    months: ['feb', 'mar', 'apr', 'may', 'jun'],
    keyDates: 'Feb–Apr Reg • May–Jun Tests & Interviews',
    timeline: "Most run alongside CUET, February–May — check your target university's admissions page.",
    schedule: [
      { month: 'feb', phase: 'Registration', text: 'IPMAT (5-Year Integrated Program) & NPAT forms release' },
      { month: 'mar', phase: 'Registration', text: 'SET and private university management forms active' },
      { month: 'apr', phase: 'Deadline', text: 'Admit cards distributed & test centre allocations' },
      { month: 'may', phase: 'Exam Window', text: 'IPMAT, NPAT, SET entrance tests conducted' },
      { month: 'jun', phase: 'Interviews', text: 'Personal Interview (PI) & Written Ability Test (WAT)' }
    ]
  },
  uceed: {
    name: 'UCEED (B.Des IITs)',
    site: 'https://uceed.iitb.ac.in',
    body: 'IIT Bombay',
    category: 'Design & Creative Arts',
    badge: 'IIT Design',
    months: ['oct', 'nov', 'jan', 'mar'],
    keyDates: 'Oct–Nov Reg • Mid-Jan National Exam',
    timeline: 'Registration opens in October and closes by early November. Exam is held in mid-January.',
    schedule: [
      { month: 'oct', phase: 'Registration', text: 'UCEED portal opens for B.Des at IIT Bombay, Delhi, Guwahati, etc.' },
      { month: 'nov', phase: 'Registration', text: 'Regular application closes; late fee window open' },
      { month: 'jan', phase: 'Exam Window', text: 'Part A (Computer-Based) & Part B (Drawing/Design) Exam' },
      { month: 'mar', phase: 'Results', text: 'Rank list release & B.Des joint seat allocation begins' }
    ]
  },
  niddat: {
    name: 'NID DAT (Prelims & Mains)',
    site: 'https://admissions.nid.edu',
    body: 'National Institute of Design',
    category: 'Design & Creative Arts',
    badge: 'National Design',
    months: ['oct', 'nov', 'dec', 'mar', 'apr', 'may'],
    keyDates: 'Oct–Dec Reg • Dec Prelims • Apr Mains',
    timeline: 'Registration October–December. Prelims held in December, Mains in March–April.',
    schedule: [
      { month: 'oct', phase: 'Registration', text: 'NID DAT registration opens for all NID campuses' },
      { month: 'nov', phase: 'Registration', text: 'Online form submission & category certificate verification' },
      { month: 'dec', phase: 'Prelims Exam', text: 'NID DAT Design Aptitude Test Prelims' },
      { month: 'mar', phase: 'Results', text: 'Prelims result announcement & DAT Mains shortlist' },
      { month: 'apr', phase: 'Mains Exam', text: 'DAT Mains (Studio Test & Personal Interviews)' },
      { month: 'may', phase: 'Final Merit', text: 'Final rank list & campus allotment' }
    ]
  },
  niftentrance: {
    name: 'NIFT Entrance Exam',
    site: 'https://www.nift.ac.in',
    body: 'National Institute of Fashion Technology (via NTA)',
    category: 'Design & Fashion',
    badge: 'National Fashion & Tech',
    months: ['dec', 'jan', 'feb', 'apr', 'may'],
    keyDates: 'Dec–Jan Reg • Feb CAT & GAT • Apr Situation Test',
    timeline: 'Registration December–January. Written exam (CAT & GAT) held in early February, results by April.',
    schedule: [
      { month: 'dec', phase: 'Registration', text: 'Online application notification and registration opens' },
      { month: 'jan', phase: 'Deadline', text: 'Last date for submission without late fees' },
      { month: 'feb', phase: 'Written Exam', text: 'Creative Ability Test (CAT) & General Ability Test (GAT)' },
      { month: 'apr', phase: 'Situation Test', text: 'Situation Test for B.Des shortlisted candidates' },
      { month: 'may', phase: 'Counselling', text: 'Seat allocation across 18 NIFT campuses nationwide' }
    ]
  },
  collegespecific: {
    name: 'Private Design Portfolio & Studio Tests',
    site: null,
    body: 'Srishti, Pearl, UID, MIT-ID',
    category: 'Design & Media',
    badge: 'Studio Test',
    months: ['feb', 'mar', 'apr', 'may', 'jun'],
    keyDates: 'Feb–May Portfolios & Studio Rounds',
    timeline: 'Usually runs alongside CUET, February–May — confirm directly with each college.',
    schedule: [
      { month: 'feb', phase: 'Portfolios', text: 'Portfolio submission and creative brief deadlines' },
      { month: 'mar', phase: 'Interviews', text: 'Studio material challenges and personal interviews' },
      { month: 'apr', phase: 'Offers', text: 'Merit lists and provisional admission letters' },
      { month: 'may', phase: 'Admissions', text: 'Seat confirmation and fee payment' }
    ]
  },
  duentrance: {
    name: 'Media, Journalism & Mass Comm Entrances',
    site: null,
    body: 'IIMC, IPU, Symbiosis (SET), Central Universities',
    category: 'Media & Communication',
    badge: 'Media Entrance',
    months: ['feb', 'mar', 'apr', 'may', 'jun'],
    keyDates: 'Feb–Apr Reg • May–Jun Written & GD Rounds',
    timeline: "Most Delhi University courses now admit via CUET; a few specific programmes still run their own test — check the university's site.",
    schedule: [
      { month: 'feb', phase: 'Notification', text: 'Mass Communication admission schedules released' },
      { month: 'mar', phase: 'Registration', text: 'Online form submission & current affairs portfolio' },
      { month: 'may', phase: 'Written Exam', text: 'Aptitude tests on media ethics, writing & awareness' },
      { month: 'jun', phase: 'GD & Interview', text: 'Group discussions and studio trial rounds' }
    ]
  },
  clat: {
    name: 'CLAT (Common Law Admission Test)',
    site: 'https://consortiumofnlus.ac.in',
    body: 'Consortium of National Law Universities',
    category: 'Law & Public Policy',
    badge: 'National Law Entrance',
    months: ['aug', 'sep', 'oct', 'nov', 'dec'],
    keyDates: 'Aug–Oct Reg • 1st Sunday of Dec Exam',
    timeline: 'Registration opens in August and runs through October/November. Exam is held the first Sunday of December.',
    schedule: [
      { month: 'aug', phase: 'Registration', text: 'Consortium of NLUs opens CLAT online portal' },
      { month: 'sep', phase: 'Registration', text: 'Sample question paper sets & open registration' },
      { month: 'oct', phase: 'Deadline', text: 'Application submission deadline' },
      { month: 'nov', phase: 'Admit Card', text: 'Hall ticket download & test guidelines published' },
      { month: 'dec', phase: 'Exam Window', text: 'National offline exam held on 1st Sunday of December' }
    ]
  },
  ailet: {
    name: 'AILET (NLU Delhi)',
    site: 'https://nationallawuniversitydelhi.in',
    body: 'National Law University, Delhi',
    category: 'Law & Public Policy',
    badge: 'NLU Delhi Solo',
    months: ['aug', 'sep', 'oct', 'nov', 'dec'],
    keyDates: 'Aug–Nov Reg • Mid-Dec Exam',
    timeline: 'Registration opens in August. Exam is held in mid-December, only for admission to NLU Delhi.',
    schedule: [
      { month: 'aug', phase: 'Registration', text: 'AILET application process live for B.A. LL.B.' },
      { month: 'sep', phase: 'Registration', text: 'Online application processing active' },
      { month: 'nov', phase: 'Deadline', text: 'Final registration closing date' },
      { month: 'dec', phase: 'Exam Window', text: 'Single-shift national entrance examination in mid-December' }
    ]
  },
  upsccse: {
    name: 'UPSC Civil Services (Reference Milestone)',
    site: 'https://upsc.gov.in',
    body: 'Union Public Service Commission',
    category: 'Civil Services & Policy',
    badge: 'Post-Graduation Goal',
    months: ['jan', 'feb', 'may', 'aug', 'sep'],
    keyDates: 'Jan/Feb Notification • May Prelims • Aug Mains',
    timeline: 'Notification released January/February. Prelims in late May, Mains from August (spread across 5 days), interview months later.',
    schedule: [
      { month: 'jan', phase: 'Notification', text: 'Official CSE notification released on upsc.gov.in' },
      { month: 'feb', phase: 'Registration', text: 'One Time Registration (OTR) and form submission' },
      { month: 'may', phase: 'Prelims Exam', text: 'CSAT & General Studies Preliminary Examination' },
      { month: 'aug', phase: 'Mains Exam', text: 'Written descriptive Mains across 9 subjective papers' }
    ]
  },
  iat: {
    name: 'IISER Aptitude Test (IAT)',
    site: 'https://iiseradmission.in',
    body: 'IISER Admission Committee',
    category: 'Pure Sciences & Research',
    badge: 'IISER Science',
    months: ['mar', 'apr', 'may', 'jun'],
    keyDates: 'Mar–Apr Reg • Early June National Exam',
    timeline: 'Registration March–April. Exam held in early June.',
    schedule: [
      { month: 'mar', phase: 'Registration', text: 'Application portal opens for 5-Year BS-MS at all 7 IISERs' },
      { month: 'apr', phase: 'Deadline', text: 'Registration deadline and mock test portal live' },
      { month: 'may', phase: 'Admit Card', text: 'Admit card download window' },
      { month: 'jun', phase: 'Exam Window', text: 'Computer-based test held in early June across India' }
    ]
  },
  nest: {
    name: 'NEST (NISER / CEBS)',
    site: 'https://www.nestexam.in',
    body: 'NISER Bhubaneswar & UM-DAE CEBS',
    category: 'Pure Sciences & Research',
    badge: 'Atomic Energy / NISER',
    months: ['jan', 'feb', 'mar', 'apr', 'jun'],
    keyDates: 'Jan–Apr Reg • Early June National Exam',
    timeline: 'Registration January–April. Exam held in early June.',
    schedule: [
      { month: 'jan', phase: 'Registration', text: 'Information brochure released & portal live' },
      { month: 'feb', phase: 'Registration', text: 'Online registration active' },
      { month: 'apr', phase: 'Deadline', text: 'Registration window closes' },
      { month: 'jun', phase: 'Exam Window', text: 'Computer-based test conducted in two sessions' }
    ]
  },
  isiat: {
    name: 'ISI Admission Test',
    site: 'https://www.isical.ac.in',
    body: 'Indian Statistical Institute',
    category: 'Pure Sciences & Math',
    badge: 'Premier Math & Stats',
    months: ['feb', 'mar', 'apr', 'may'],
    keyDates: 'Feb–Mar Reg • May Offline Exam',
    timeline: 'Registration February–March. Exam held in May, in offline mode.',
    schedule: [
      { month: 'feb', phase: 'Registration', text: 'Application portal opens for B.Stat (Hons) & B.Math (Hons)' },
      { month: 'mar', phase: 'Deadline', text: 'Application submission deadline' },
      { month: 'apr', phase: 'Admit Card', text: 'Hall tickets generated' },
      { month: 'may', phase: 'Exam Window', text: 'Objective & subjective advanced mathematics examination' }
    ]
  },
  nda: {
    name: 'NDA & NA Exam (National Defence Academy)',
    site: 'https://upsc.gov.in',
    body: 'Union Public Service Commission (UPSC)',
    category: 'Government, Defence & Public Services',
    badge: 'Armed Forces 10+2',
    months: ['dec', 'jan', 'apr', 'may', 'jun', 'sep'],
    keyDates: 'NDA-I: Dec Reg, Apr Exam • NDA-II: May Reg, Sep Exam',
    timeline: 'Conducted twice a year by UPSC for 12th pass/appearing students for Army, Navy & Air Force cadet entry.',
    schedule: [
      { month: 'dec', phase: 'Registration', text: 'NDA-I notification & online registration opens' },
      { month: 'jan', phase: 'Deadline', text: 'NDA-I application window closes' },
      { month: 'apr', phase: 'Exam Window', text: 'NDA-I Mathematics & General Ability offline test' },
      { month: 'may', phase: 'Registration', text: 'NDA-II notification & online application opens' },
      { month: 'jun', phase: 'Deadline', text: 'NDA-II registration window closes' },
      { month: 'sep', phase: 'Exam Window', text: 'NDA-II national examination held across India' }
    ]
  },
  cds: {
    name: 'CDS (Combined Defence Services)',
    site: 'https://upsc.gov.in',
    body: 'Union Public Service Commission (UPSC)',
    category: 'Government, Defence & Public Services',
    badge: 'Defence Post-Grad',
    months: ['dec', 'jan', 'apr', 'may', 'jun', 'sep'],
    keyDates: 'CDS-I: Dec Reg, Apr Exam • CDS-II: May Reg, Sep Exam',
    timeline: 'Twice a year exam for graduates seeking officer entry into Indian Army (IMA/OTA), Navy (INA), and Air Force (AFA).',
    schedule: [
      { month: 'dec', phase: 'Registration', text: 'CDS-I notification released on upsc.gov.in' },
      { month: 'apr', phase: 'Exam Window', text: 'CDS-I written examination across centres' },
      { month: 'may', phase: 'Registration', text: 'CDS-II online registration opens' },
      { month: 'sep', phase: 'Exam Window', text: 'CDS-II written examination' }
    ]
  },
  afcat: {
    name: 'AFCAT (Air Force Common Admission Test)',
    site: 'https://afcat.cdac.in',
    body: 'Indian Air Force (IAF)',
    category: 'Government, Defence & Public Services',
    badge: 'Air Force Officer',
    months: ['dec', 'jan', 'feb', 'jun', 'jul', 'aug'],
    keyDates: 'AFCAT 1: Dec Reg, Feb Exam • AFCAT 2: Jun Reg, Aug Exam',
    timeline: 'Conducted twice annually for Flying, Technical and Ground Duty branches in the Indian Air Force.',
    schedule: [
      { month: 'dec', phase: 'Registration', text: 'AFCAT 1 application window opens' },
      { month: 'feb', phase: 'Exam Window', text: 'AFCAT 1 Computer-Based Test' },
      { month: 'jun', phase: 'Registration', text: 'AFCAT 2 online application portal live' },
      { month: 'aug', phase: 'Exam Window', text: 'AFCAT 2 national examination' }
    ]
  },
  sscchsl: {
    name: 'SSC CHSL (10+2 Level Central Posts)',
    site: 'https://ssc.gov.in',
    body: 'Staff Selection Commission (SSC)',
    category: 'Government, Defence & Public Services',
    badge: '12th Pass Govt Entry',
    months: ['apr', 'may', 'jun', 'jul'],
    keyDates: 'Apr–May Reg • Jun–Jul Tier 1 Exam',
    timeline: 'National exam right after 12th for Lower Division Clerks (LDC), Junior Secretarial Assistants (JSA), and Data Entry Operators (DEO) in Central Ministries.',
    schedule: [
      { month: 'apr', phase: 'Registration', text: 'Official SSC CHSL notification released and online form opens' },
      { month: 'may', phase: 'Deadline', text: 'Online application and fee payment closure' },
      { month: 'jun', phase: 'Exam Window', text: 'Tier-1 Computer-Based Examination' },
      { month: 'jul', phase: 'Exam Window', text: 'Tier-1 exam concluding slots & answer keys release' }
    ]
  },
  ssccgl: {
    name: 'SSC CGL (Combined Graduate Level)',
    site: 'https://ssc.gov.in',
    body: 'Staff Selection Commission (SSC)',
    category: 'Government, Defence & Public Services',
    badge: 'Group B & C Officers',
    months: ['jun', 'jul', 'sep', 'oct'],
    keyDates: 'Jun–Jul Reg • Sep–Oct Tier 1 Exam',
    timeline: 'Recruitment for premier central government officer posts including Income Tax Inspector, Central Excise Inspector, Assistant Section Officer (ASO) in CSS, and CBI Sub-Inspector.',
    schedule: [
      { month: 'jun', phase: 'Registration', text: 'SSC CGL official notification and registration live' },
      { month: 'jul', phase: 'Deadline', text: 'Registration closing date' },
      { month: 'sep', phase: 'Exam Window', text: 'Tier-1 national examination window' },
      { month: 'oct', phase: 'Results', text: 'Tier-1 results and Tier-2 descriptive/CBT scheduling' }
    ]
  },
  ibpspo: {
    name: 'IBPS Bank PO & MT',
    site: 'https://www.ibps.in',
    body: 'Institute of Banking Personnel Selection',
    category: 'Government, Defence & Public Services',
    badge: 'Nationalized Banks',
    months: ['aug', 'sep', 'oct', 'nov'],
    keyDates: 'Aug Reg • Oct Prelims • Nov Mains',
    timeline: 'National entrance for Probationary Officer & Management Trainee roles across 11 public sector banks including PNB, Bank of Baroda, Canara Bank.',
    schedule: [
      { month: 'aug', phase: 'Registration', text: 'IBPS PO notification & online registration' },
      { month: 'sep', phase: 'Admit Card', text: 'Call letter download for preliminary test' },
      { month: 'oct', phase: 'Exam Window', text: 'Online Preliminary Examination' },
      { month: 'nov', phase: 'Mains Exam', text: 'Online Main Examination & descriptive test' }
    ]
  },
  sbipo: {
    name: 'SBI Probationary Officer (SBI PO)',
    site: 'https://sbi.co.in/careers',
    body: 'State Bank of India',
    category: 'Government, Defence & Public Services',
    badge: 'Premier Banking Officer',
    months: ['sep', 'oct', 'nov', 'dec', 'jan'],
    keyDates: 'Sep–Oct Reg • Nov Prelims • Dec/Jan Mains',
    timeline: 'The most prestigious public banking examination in India for officer entry into the State Bank of India.',
    schedule: [
      { month: 'sep', phase: 'Registration', text: 'SBI PO online recruitment portal live' },
      { month: 'oct', phase: 'Deadline', text: 'Registration deadline' },
      { month: 'nov', phase: 'Exam Window', text: 'SBI PO Preliminary Examination' },
      { month: 'dec', phase: 'Mains Exam', text: 'SBI PO Mains Examination & Psychometric Test' }
    ]
  },
  rbigradeb: {
    name: 'RBI Grade B Officer',
    site: 'https://rbi.org.in',
    body: 'Reserve Bank of India Services Board',
    category: 'Government, Defence & Public Services',
    badge: 'Central Banking Apex',
    months: ['may', 'jun', 'jul', 'aug', 'sep'],
    keyDates: 'May–Jun Reg • Jul Phase 1 • Aug Phase 2',
    timeline: 'Direct officer entry into India’s central bank, shaping monetary policy, financial supervision, and banking regulation.',
    schedule: [
      { month: 'may', phase: 'Notification', text: 'RBI Grade B notification released' },
      { month: 'jun', phase: 'Registration', text: 'Online application submission window' },
      { month: 'jul', phase: 'Exam Window', text: 'Phase 1 Computer-Based Test' },
      { month: 'aug', phase: 'Mains Exam', text: 'Phase 2 Economic, Financial & English descriptive test' }
    ]
  },
  capfac: {
    name: 'CAPF (Assistant Commandant - UPSC)',
    site: 'https://upsc.gov.in',
    body: 'Union Public Service Commission (UPSC)',
    category: 'Government, Defence & Public Services',
    badge: 'Paramilitary Officers',
    months: ['apr', 'may', 'aug'],
    keyDates: 'Apr–May Reg • August Written Exam',
    timeline: 'Direct entry as Assistant Commandant (Gazetted Officer) in BSF, CRPF, CISF, ITBP, and SSB.',
    schedule: [
      { month: 'apr', phase: 'Registration', text: 'UPSC CAPF (AC) notification and application opens' },
      { month: 'may', phase: 'Deadline', text: 'Application window closes' },
      { month: 'aug', phase: 'Exam Window', text: 'Paper 1 (General Ability) & Paper 2 (General Studies & Essay)' }
    ]
  }
};

const CAREERS = [
  {
    cat: 'eng',
    title: 'Software & Computer Science Engineer',
    stream: 'Science (PCM)',
    examKeys: ['jeemain', 'jeeadv', 'bitsat', 'statecet'],
    one: 'Design and build the software, apps and systems that run everything else.',
    roadmap: [
      ['12th — PCM', 'Physics, Chemistry, Maths with a strong Maths score'],
      ['Entrance', 'JEE Main/Advanced, BITSAT, or your state CET'],
      ['Degree', 'B.Tech / B.E. in Computer Science or IT (4 years)'],
      ['Specialise', 'Web, mobile, AI/ML, cloud, or cybersecurity electives + internships'],
      ['Roles', 'Software Developer, Data Engineer, Cloud Architect, SDE']
    ],
    skills: 'Logical reasoning, coding, maths, patience with debugging.'
  },
  {
    cat: 'eng',
    title: 'Core, Mechanical & Electronics Engineer',
    stream: 'Science (PCM)',
    examKeys: ['jeemain', 'jeeadv', 'statecet'],
    one: 'Design the physical machines, circuits and infrastructure the world runs on.',
    roadmap: [
      ['12th — PCM', 'Physics, Chemistry, Maths'],
      ['Entrance', 'JEE Main/Advanced or state CET'],
      ['Degree', 'B.Tech/B.E. in Mechanical, Electrical, Civil or Electronics (4 years)'],
      ['Specialise', 'Robotics, automotive, energy, or core-industry internships'],
      ['Roles', 'Design Engineer, Site Engineer, R&D, Manufacturing']
    ],
    skills: 'Spatial reasoning, physics fundamentals, hands-on problem-solving.'
  },
  {
    cat: 'med',
    title: 'Doctor (MBBS)',
    stream: 'Science (PCB)',
    examKeys: ['neetug'],
    one: 'Diagnose and treat patients directly, with a path into any medical specialty later.',
    roadmap: [
      ['12th — PCB', 'Physics, Chemistry, Biology'],
      ['Entrance', 'NEET-UG (single national exam for MBBS)'],
      ['Degree', 'MBBS — 4.5 years + 1 year compulsory internship'],
      ['Specialise', 'Optional PG — MD/MS via NEET-PG, 3 more years'],
      ['Roles', 'General Physician, Surgeon (post-PG), Specialist']
    ],
    skills: 'Memory + stamina, calm under pressure, genuine care for people.'
  },
  {
    cat: 'med',
    title: 'Allied Health — Nursing, Physiotherapy, Pharmacy',
    stream: 'Science (PCB)',
    examKeys: ['stateuniv', 'neetug'],
    one: 'Hands-on healthcare roles with shorter degrees and strong, steady demand.',
    roadmap: [
      ['12th — PCB', 'Physics, Chemistry, Biology'],
      ['Entrance', 'College or state-level entrance exam'],
      ['Degree', 'B.Sc Nursing / BPT / B.Pharm — 3 to 4 years'],
      ['Specialise', 'ICU, sports rehab, clinical pharmacy, or hospital administration'],
      ['Roles', 'Nurse, Physiotherapist, Pharmacist, Clinical Researcher']
    ],
    skills: 'Empathy, physical stamina, attention to detail.'
  },
  {
    cat: 'com',
    title: 'Chartered Accountancy & Finance',
    stream: 'Commerce (Maths optional)',
    examKeys: ['cafoundation'],
    one: 'Master how money, audits and taxes actually work across every industry.',
    roadmap: [
      ['12th — Commerce', 'Accountancy, Economics, Business Studies'],
      ['Entrance', 'CA Foundation, sat directly after 12th'],
      ['Path', 'CA Intermediate → 2yr Articleship → CA Final (or B.Com in parallel)'],
      ['Specialise', 'Audit, taxation, or corporate finance'],
      ['Roles', 'Chartered Accountant, Financial Analyst, Auditor']
    ],
    skills: 'Comfort with numbers, discipline, patience for a multi-year path.'
  },
  {
    cat: 'com',
    title: 'Business Management & Entrepreneurship',
    stream: 'Any stream',
    examKeys: ['cuet', 'bbaentrance'],
    one: 'Learn how businesses are actually run, then build or manage one.',
    roadmap: [
      ['12th — Any stream', 'A strong overall academic record'],
      ['Entrance', 'CUET or college-specific BBA entrance test'],
      ['Degree', 'BBA (3 years), often followed by an MBA'],
      ['Specialise', 'Marketing, finance, operations, or a founder track'],
      ['Roles', 'Product Manager, Consultant, Founder, Brand Manager']
    ],
    skills: 'Communication, comfort with ambiguity, people skills.'
  },
  {
    cat: 'des',
    title: 'UX & Product Design',
    stream: 'Any stream (portfolio-based)',
    examKeys: ['uceed', 'niddat', 'niftentrance'],
    one: 'Shape how digital products look, feel and actually work for people.',
    roadmap: [
      ['12th — Any stream', 'A design portfolio matters more than marks'],
      ['Entrance', 'UCEED or NID/NIFT Design Aptitude Test'],
      ['Degree', 'B.Des in Product, UX or Communication Design (4 years)'],
      ['Specialise', 'UX research, interaction design, or visual design'],
      ['Roles', 'UX Designer, Product Designer, Design Researcher']
    ],
    skills: 'Visual sense, empathy for users, comfort with feedback loops.'
  },
  {
    cat: 'des',
    title: 'Fashion & Communication Design',
    stream: 'Any stream (portfolio-based)',
    examKeys: ['niftentrance', 'uceed'],
    one: 'Design clothing, branding or visual campaigns people actually wear and see.',
    roadmap: [
      ['12th — Any stream', 'Sketching or a design portfolio helps'],
      ['Entrance', 'NIFT entrance exam + situation test'],
      ['Degree', 'B.Des in Fashion or Communication Design (4 years)'],
      ['Specialise', 'Apparel, textiles, branding, or styling'],
      ['Roles', 'Fashion Designer, Brand Designer, Stylist']
    ],
    skills: 'Trend awareness, craftsmanship, a strong personal aesthetic.'
  },
  {
    cat: 'media',
    title: 'Journalism & Content Strategy',
    stream: 'Any stream',
    examKeys: ['cuet', 'collegespecific'],
    one: "Report, research and explain what's actually happening to an audience.",
    roadmap: [
      ['12th — Any stream', 'Strong written English is the real prerequisite'],
      ['Entrance', 'CUET or the college\'s own writing test'],
      ['Degree', 'BA Journalism & Mass Communication (3 years)'],
      ['Specialise', 'Print, broadcast, digital, or long-form content'],
      ['Roles', 'Reporter, Editor, Content Strategist']
    ],
    skills: 'Curiosity, fast writing, comfort talking to strangers.'
  },
  {
    cat: 'media',
    title: 'Film, Animation & Digital Media',
    stream: 'Any stream (portfolio helps)',
    examKeys: ['collegespecific'],
    one: 'Tell stories through video, animation or social-first content.',
    roadmap: [
      ['12th — Any stream', 'A demo reel or sample edits help at admission'],
      ['Entrance', 'Portfolio review or entrance test, varies by college'],
      ['Degree', 'BA Film / Animation / Digital Media (3 years)'],
      ['Specialise', 'Editing, animation, cinematography, or social content'],
      ['Roles', 'Video Editor, Animator, Filmmaker, Content Creator']
    ],
    skills: 'Visual storytelling, technical software skills, persistence.'
  },
  {
    cat: 'hum',
    title: 'Psychology',
    stream: 'Any stream',
    examKeys: ['cuet', 'collegespecific'],
    one: 'Understand how people think and behave, then apply it professionally.',
    roadmap: [
      ['12th — Any stream', "Biology helps but isn't mandatory everywhere"],
      ['Entrance', "CUET or the university's own entrance test"],
      ['Degree', 'BA/BSc Psychology (3 years)'],
      ['Specialise', 'MA + license required for clinical practice'],
      ['Roles', 'Counsellor, HR Specialist, Researcher (with MA/PhD)']
    ],
    skills: 'Active listening, patience, comfort with ambiguity.'
  },
  {
    cat: 'hum',
    title: 'Economics & Public Policy',
    stream: 'Any stream (Maths helps)',
    examKeys: ['cuet', 'duentrance'],
    one: 'Study how decisions, money and policy shape everyday life at scale.',
    roadmap: [
      ['12th — Any stream', 'Maths strongly recommended'],
      ['Entrance', 'CUET or specific university entrance'],
      ['Degree', 'BA Economics (3 years)'],
      ['Specialise', 'MA Economics, or pivot into Civil Services prep'],
      ['Roles', 'Policy Analyst, Economist, Civil Services Officer']
    ],
    skills: 'Analytical thinking, comfort with data, clear writing.'
  },
  {
    cat: 'law',
    title: 'Law (5-Year Integrated)',
    stream: 'Any stream',
    examKeys: ['clat', 'ailet'],
    one: 'Represent people and organisations, or shape policy from inside the system.',
    roadmap: [
      ['12th — Any stream', 'English and reasoning matter most'],
      ['Entrance', 'CLAT (26 NLUs) or AILET (NLU Delhi only)'],
      ['Degree', 'BA LLB / BBA LLB — 5-year integrated course'],
      ['Specialise', 'Litigation, corporate law, or judiciary exam prep'],
      ['Roles', 'Litigator, Corporate Lawyer, Legal Advisor, Judge (later)']
    ],
    skills: 'Reading stamina, argumentation, attention to detail.'
  },
  {
    cat: 'law',
    title: 'Civil Services Track',
    stream: 'Any stream',
    examKeys: ['upsccse'],
    one: "Serve in India's administrative, police or foreign services.",
    roadmap: [
      ['12th — Any stream', 'Any stream works, so pick what genuinely interests you'],
      ['Degree', "Any bachelor's degree (3 years)"],
      ['Entrance', 'UPSC CSE — Prelims, Mains, Interview'],
      ['Prep', '1-2 years of dedicated, structured preparation'],
      ['Roles', 'IAS, IPS, IFS, and allied civil service officer roles']
    ],
    skills: 'Discipline, broad general knowledge, long-haul persistence.'
  },
  {
    cat: 'sci',
    title: 'Research Science',
    stream: 'Science (PCM/PCB)',
    examKeys: ['iat', 'jeemain', 'nest'],
    one: "Push the boundary of what's known, in a lab instead of an office.",
    roadmap: [
      ['12th — PCM or PCB', 'Strong fundamentals in your chosen science'],
      ['Entrance', 'IISER Aptitude Test, JEE, or NEST'],
      ['Degree', 'BS-MS integrated program (5 years)'],
      ['Specialise', 'PhD for a research-scientist or professor track'],
      ['Roles', 'Research Scientist, Lab Lead, Professor (with PhD)']
    ],
    skills: 'Deep curiosity, patience with failed experiments, precision.'
  },
  {
    cat: 'sci',
    title: 'Data Science & Statistics',
    stream: 'Science (PCM)',
    examKeys: ['cuet', 'isiat', 'statecet'],
    one: 'Turn raw data into decisions — one of the fastest-growing fields right now.',
    roadmap: [
      ['12th — PCM', 'Strong Maths score matters most'],
      ['Entrance', 'CUET, ISI Admission Test, or state-level entrance'],
      ['Degree', 'BSc Statistics / Data Science / Maths (3 years)'],
      ['Specialise', 'Machine learning, analytics, or applied statistics'],
      ['Roles', 'Data Scientist, Data Analyst, ML Engineer']
    ],
    skills: 'Maths, coding basics, comfort finding patterns in noise.'
  },
];

const COURSE_BRANCHES = [
  {
    id: 'eng',
    name: 'Engineering & Technology',
    icon: '⚡',
    badge: 'PCM Track',
    degrees: 'B.Tech / B.E. / BS-MS (4 Years)',
    desc: 'Core architecture of computing software, artificial intelligence, semiconductor chips, electric vehicles, and aerospace propulsion.',
    streamReq: 'Class 12 Science with Physics, Chemistry & Mathematics (PCM)',
    branches: [
      {
        name: 'Computer Science & Engineering (CSE)',
        specialisations: 'Artificial Intelligence, Machine Learning, Cloud Architecture, Cyber Security, Full-Stack Systems',
        scope: 'Software Architect, Machine Learning Engineer, Cloud Solutions Specialist, High-Frequency Trading Developer',
        duration: '4 Years',
        topColleges: 'IITs, NITs, IIITs, BITS Pilani, Top State Universities',
        salaryRange: '₹8 - 45+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CET']
      },
      {
        name: 'Artificial Intelligence & Data Science (AI/DS)',
        specialisations: 'Deep Learning, Neural Networks, Natural Language Processing (NLP), Big Data Analytics, MLOps',
        scope: 'AI Research Scientist, Data Engineer, Quantitative Analyst, Algorithm Specialist',
        duration: '4 Years',
        topColleges: 'IIT Hyderabad, IIT Bombay, IIIT Hyderabad, BITS Pilani',
        salaryRange: '₹10 - 50+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT']
      },
      {
        name: 'Electronics & Communication (ECE / VLSI)',
        specialisations: 'VLSI Chip Design, Embedded Systems, IoT, 5G/6G Telecom, Robotics & Sensor Interfacing',
        scope: 'Semiconductor Design Engineer (NVIDIA/Intel), Embedded Firmware Developer, Telecom Architect',
        duration: '4 Years',
        topColleges: 'IITs, NIT Trichy, NIT Surathkal, BITS Pilani',
        salaryRange: '₹7 - 35+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CET']
      },
      {
        name: 'Aerospace & Aeronautical Engineering',
        specialisations: 'Avionics, Aerodynamics, Rocket Propulsion, Spacecraft Dynamics, Autonomous Drone Tech',
        scope: 'Flight Dynamics Engineer, Propulsion Scientist (ISRO / DRDO), Aerospace Simulation Consultant',
        duration: '4 Years',
        topColleges: 'IIT Madras, IIT Kanpur, IIT Bombay, IIST Thiruvananthapuram',
        salaryRange: '₹8 - 30+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'IIST Admission']
      },
      {
        name: 'Mechanical & Robotics Engineering',
        specialisations: 'Robotics & Automation, Electric Vehicle (EV) Powertrains, CAD/CAM, Mechatronics, Thermal Systems',
        scope: 'Industrial Automation Engineer, EV Designer (Tesla/Ola/Tata Motors), Mechatronics Specialist',
        duration: '4 Years',
        topColleges: 'IITs, NITs, BITS Pilani, DTU Delhi, COEP Pune',
        salaryRange: '₹6 - 22+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CET']
      },
      {
        name: 'Biotechnology & Biomedical Engineering',
        specialisations: 'Genomics & Bioinformatics, Medical Imaging Systems, Neural Prosthetics, Bioprocess Engineering',
        scope: 'Bioinformatics Scientist, Medical Device Engineer, Pharma R&D Specialist',
        duration: '4 Years',
        topColleges: 'IIT Roorkee, IIT Delhi, Manipal, Vellore Institute of Technology',
        salaryRange: '₹6 - 20+ LPA',
        exams: ['JEE Main', 'State CET', 'Target Univ Entrance']
      },
      {
        name: 'Civil & Smart Infrastructure Engineering',
        specialisations: 'Structural Dynamics, Smart City Transportation, Geotechnical Engineering, Environmental Systems',
        scope: 'Mega-Infrastructure Consultant, Structural Engineer, Urban Transportation Planner',
        duration: '4 Years',
        topColleges: 'IITs, NITs, CEG Chennai, Jadavpur University',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'State CET']
      },
      {
        name: 'Chemical & Materials Science Engineering',
        specialisations: 'Nanomaterials, Polymer Sciences, Petrochemical & Renewable Energy, Process Design Automation',
        scope: 'Advanced Materials Scientist, Energy Storage Specialist, Petrochemical Process Engineer',
        duration: '4 Years',
        topColleges: 'ICT Mumbai, IIT Bombay, IIT Madras, NIT Trichy',
        salaryRange: '₹6 - 24+ LPA',
        exams: ['JEE Main', 'JEE Advanced', 'MHT-CET']
      }
    ]
  },
  {
    id: 'med',
    name: 'Medicine, Healthcare & Clinical Sciences',
    icon: '🩺',
    badge: 'PCB Track',
    degrees: 'MBBS / BDS / B.Pharm / BPT / BAMS (4 to 5.5 Years)',
    desc: 'Clinical practice, diagnostics, surgical specialization, pharmacotherapy, and physiotherapy rehabilitation.',
    streamReq: 'Class 12 Science with Physics, Chemistry & Biology (PCB)',
    branches: [
      {
        name: 'MBBS (Bachelor of Medicine & Bachelor of Surgery)',
        specialisations: 'General Medicine, Cardiology, Neurology, General Surgery, Paediatrics, Radiology',
        scope: 'Physician, Surgeon, Medical Officer, Hospital Clinical Specialist',
        duration: '5.5 Years (incl. 1-Year Compulsory Paid Internship)',
        topColleges: 'AIIMS New Delhi, CMC Vellore, JIPMER, KGMU, Grant Medical College',
        salaryRange: '₹9 - 30+ LPA (Substantially rises after MD/MS)',
        exams: ['NEET-UG']
      },
      {
        name: 'BDS (Bachelor of Dental Surgery)',
        specialisations: 'Orthodontics, Oral & Maxillofacial Surgery, Prosthodontics, Periodontics, Aesthetic Dentistry',
        scope: 'Dental Surgeon, Cosmetic Dentist, Maxillofacial Consultant',
        duration: '5 Years (incl. Internship)',
        topColleges: 'Maulana Azad Dental Institute, Manipal Dental College, King George Dental',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['NEET-UG']
      },
      {
        name: 'B.Pharm & Pharm.D (Pharmacy & Clinical Pharmacology)',
        specialisations: 'Clinical Research, Drug Formulation & Discovery, Regulatory Affairs, Pharmacovigilance',
        scope: 'Clinical Pharmacist, Drug Safety Associate, Formulations R&D Scientist',
        duration: '4 Years (B.Pharm) / 6 Years (Pharm.D)',
        topColleges: 'NIPER, Jamia Hamdard, BITS Pilani, Manipal College of Pharmaceutical Sciences',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['State CET', 'BITSAT', 'NEET-UG / University Entrance']
      },
      {
        name: 'BPT (Physiotherapy & Sports Rehabilitation)',
        specialisations: 'Sports Injury Rehab, Orthopaedic PT, Neuro-Physiotherapy, Cardiopulmonary Rehab',
        scope: 'Sports Team Physiotherapist, Clinical Physiotherapy Consultant, Rehabilitation Specialist',
        duration: '4.5 Years (incl. 6-Month Internship)',
        topColleges: 'KEM Hospital Mumbai, CMC Vellore, Manipal College of Health Professions',
        salaryRange: '₹4.5 - 15+ LPA',
        exams: ['NEET-UG / State Paramedical Entrance']
      },
      {
        name: 'BAMS / BHMS (Ayurvedic & Alternative Medicine)',
        specialisations: 'Kayachikitsa, Panchakarma, Shalya Tantra, Integrative Wellness Medicine',
        scope: 'Ayurvedic Medical Practitioner, Wellness Director, Alternative Medicine Researcher',
        duration: '5.5 Years',
        topColleges: 'National Institute of Ayurveda Jaipur, ITRA Jamnagar, BHU Varanasi',
        salaryRange: '₹5 - 16+ LPA',
        exams: ['NEET-UG']
      },
      {
        name: 'B.Sc Nursing & Critical Care Sciences',
        specialisations: 'Emergency Medicine, ICU Care, Paediatric Nursing, Global Public Health',
        scope: 'Nursing Officer, Clinical Care Specialist, Global Healthcare Practitioner (UK/USA/Gulf)',
        duration: '4 Years',
        topColleges: 'AIIMS, CMC Vellore, Armed Forces Medical College (AFMC B.Sc)',
        salaryRange: '₹4.5 - 14+ LPA (High International Mobility)',
        exams: ['NEET-UG / AIIMS Nursing Entrance / Military Nursing']
      },
      {
        name: 'Allied Diagnostic & Imaging Sciences',
        specialisations: 'Medical Radiology (MRI/CT), Medical Lab Technology (MLT), Optometry, Anaesthesia Tech',
        scope: 'Diagnostic Technologist, Radiology Imaging Specialist, Clinical Lab Supervisor',
        duration: '3 to 4 Years',
        topColleges: 'AIIMS, PGIMER Chandigarh, Manipal, Jamia Hamdard',
        salaryRange: '₹4 - 12+ LPA',
        exams: ['State Paramedical Tests / 12th Merit']
      }
    ]
  },
  {
    id: 'com',
    name: 'Commerce, Finance & Management',
    icon: '📈',
    badge: 'Commerce / Any Stream',
    degrees: 'CA / BBA / BMS / B.Com (Hons) / IPM / Actuarial (3 to 5 Years)',
    desc: 'Corporate accounting, investment banking, portfolio management, business analytics, and executive leadership.',
    streamReq: 'Commerce or Science/Humanities with Mathematics/Economics preferred',
    branches: [
      {
        name: 'Chartered Accountancy (CA - ICAI)',
        specialisations: 'Statutory Auditing, Direct & International Taxation, Forensic Accounting, Corporate Finance',
        scope: 'Partner at Audit Firm, Chief Financial Officer (CFO), Financial Controller',
        duration: '4.5 - 5 Years (Foundation + Inter + 2 Years Articleship + Final)',
        topColleges: 'Institute of Chartered Accountants of India (ICAI)',
        salaryRange: '₹9 - 30+ LPA',
        exams: ['CA Foundation (Jan / May / Sep)']
      },
      {
        name: 'Management & Business Administration (BBA / BMS / IPM)',
        specialisations: 'Strategic Marketing, Human Resources, Supply Chain & Logistics, General Management',
        scope: 'Brand Manager, Management Consultant, Operations Executive, Business Development Lead',
        duration: '3 Years (BBA) / 5 Years (IPM Integrated)',
        topColleges: 'IIM Indore (IPM), IIM Rohtak, NMIMS Mumbai, Shaheed Sukhdev College (DU), Symbiosis',
        salaryRange: '₹7 - 26+ LPA',
        exams: ['IPMAT', 'CUET UG', 'NPAT', 'SET']
      },
      {
        name: 'Investment Banking & CFA Track',
        specialisations: 'Equity Research, Mergers & Acquisitions (M&A), Private Equity, Valuation Modeling',
        scope: 'Investment Banking Analyst, Portfolio Manager, Equity Research Associate',
        duration: '3 Years (Undergraduate Degree) + CFA Program',
        topColleges: 'SRCC (Delhi University), St. Xavier’s College, Christ University',
        salaryRange: '₹10 - 35+ LPA',
        exams: ['CUET UG', 'CFA Level 1 Entry']
      },
      {
        name: 'Company Secretary (CS) & CMA (Cost & Management)',
        specialisations: 'Corporate Governance, Securities Law, Secretarial Audit, Cost Optimization',
        scope: 'Company Secretary, Chief Compliance Officer, Cost & Management Auditor',
        duration: '3 - 4 Years',
        topColleges: 'ICSI (Company Secretaries of India) / ICMAI',
        salaryRange: '₹6 - 20+ LPA',
        exams: ['CSEET (CS Executive Entrance)']
      },
      {
        name: 'Actuarial Science & Quantitative Risk',
        specialisations: 'Life & General Insurance Math, Financial Risk Analytics, Pension Modeling',
        scope: 'Actuary, Risk Analyst, Financial Quantitative Strategist',
        duration: '3 - 5 Years (Clearing IAI / IFoA Papers alongside Degree)',
        topColleges: 'Institute of Actuaries of India (IAI), ISI Kolkata, Delhi University',
        salaryRange: '₹10 - 40+ LPA',
        exams: ['ACET (Actuarial Common Entrance Test)']
      },
      {
        name: 'Economics & Financial Analytics (B.Sc / B.A. Hons)',
        specialisations: 'Econometrics, Policy Analysis, Macroeconomic Forecasting, Financial Market Modeling',
        scope: 'Economic Analyst, Central Bank Policy Consultant, Macroeconomic Researcher',
        duration: '3 to 4 Years',
        topColleges: 'St. Stephen’s College, SRCC, Ashoka University, Loyola Chennai',
        salaryRange: '₹7 - 24+ LPA',
        exams: ['CUET UG']
      }
    ]
  },
  {
    id: 'des',
    name: 'Design, Architecture & Creative Arts',
    icon: '🎨',
    badge: 'Aptitude / Any Stream',
    degrees: 'B.Des / B.Arch / B.F.A. (4 to 5 Years)',
    desc: 'Digital product interfaces, user research, industrial prototyping, fashion, and spatial architecture.',
    streamReq: 'Any Stream for Design (PCM mandatory for B.Arch Architecture)',
    branches: [
      {
        name: 'UI/UX & Interaction Design',
        specialisations: 'Product Design Systems, User Experience Research, Interactive Prototyping, Mobile/Web UX',
        scope: 'Lead UX Designer, Product Designer, Interaction Architect',
        duration: '4 Years (B.Des)',
        topColleges: 'IIT Bombay (IDC), NID Ahmedabad, IIT Guwahati, Srishti Institute, MIT-ID',
        salaryRange: '₹8 - 32+ LPA',
        exams: ['UCEED', 'NID DAT']
      },
      {
        name: 'Product & Industrial Design',
        specialisations: 'Consumer Hardware Design, Ergonomics, Automotive Styling, Sustainable Packaging',
        scope: 'Industrial Designer, Consumer Electronics Product Stylist, CAD Design Engineer',
        duration: '4 Years',
        topColleges: 'NID Ahmedabad, IIT Bombay, IIT Delhi, MIT Institute of Design',
        salaryRange: '₹7 - 25+ LPA',
        exams: ['UCEED', 'NID DAT']
      },
      {
        name: 'B.Arch (Architecture & Urban Planning)',
        specialisations: 'Sustainable Architecture, Landscape Architecture, Urban Spatial Planning, Interior Design',
        scope: 'Licensed Architect, Urban Planner, Sustainable Design Consultant',
        duration: '5 Years',
        topColleges: 'IIT Roorkee, IIT Kharagpur, CEPT University Ahmedabad, SPA New Delhi',
        salaryRange: '₹5 - 20+ LPA',
        exams: ['NATA', 'JEE Main Paper 2']
      },
      {
        name: 'Fashion Design & Luxury Technology',
        specialisations: 'Apparel Design, Textile Technology, Sustainable Fashion, Luxury Brand Management',
        scope: 'Fashion Designer, Apparel Creative Director, Textile Technologist',
        duration: '4 Years',
        topColleges: 'NIFT New Delhi, NIFT Mumbai, Pearl Academy',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['NIFT Entrance (CAT & GAT)']
      },
      {
        name: 'Animation, Visual Effects (VFX) & Game Art',
        specialisations: '3D Character Animation, Unreal/Unity Game Art, Motion Capture, CGI Compositing',
        scope: '3D Animator, VFX Artist, Game Environment Designer, Technical Artist',
        duration: '3 to 4 Years',
        topColleges: 'NID, Whistling Woods International, Rubika India',
        salaryRange: '₹5 - 22+ LPA',
        exams: ['NID DAT / College Portfolio Tests']
      }
    ]
  },
  {
    id: 'law',
    name: 'Law, Legal Studies & Public Policy',
    icon: '⚖️',
    badge: 'Any Stream',
    degrees: 'B.A. LL.B. / B.B.A. LL.B. (5-Year Integrated)',
    desc: 'Corporate governance, cross-border mergers, dispute litigation, intellectual property, and civil rights.',
    streamReq: 'Any Stream in Class 12 (Arts, Commerce, or Science)',
    branches: [
      {
        name: 'Corporate & Commercial Law',
        specialisations: 'Mergers & Acquisitions (M&A), Banking & Securities Law, Competition Law, Contract Negotiation',
        scope: 'Corporate Associate at Tier-1 Law Firm, In-House Legal Counsel',
        duration: '5 Years',
        topColleges: 'NLSIU Bengaluru, NALSAR Hyderabad, WBNUJS Kolkata, NLU Delhi',
        salaryRange: '₹14 - 22+ LPA (Tier-1 Firms)',
        exams: ['CLAT', 'AILET']
      },
      {
        name: 'Cyber Law, AI Governance & Intellectual Property (IPR)',
        specialisations: 'Patent Prosecution, Data Privacy & GDPR, AI Ethics & Legal Compliance, Trademark Law',
        scope: 'Tech Legal Counsel, Patent Attorney, Data Protection Officer',
        duration: '5 Years',
        topColleges: 'NLUs, IIT Kharagpur (RGSOIPL), Jindal Global Law School',
        salaryRange: '₹10 - 25+ LPA',
        exams: ['CLAT', 'AILET', 'LSAT India']
      },
      {
        name: 'Litigation, Criminal Justice & Judiciary',
        specialisations: 'Constitutional Law, Criminal Trial Practice, Appellate Litigation, Human Rights',
        scope: 'High Court / Supreme Court Litigator, Public Prosecutor, Judicial Magistrate (via PCS-J)',
        duration: '5 Years',
        topColleges: 'Faculty of Law (DU), ILS Law College Pune, National Law Universities',
        salaryRange: 'Independent / State Judicial Pay Scale',
        exams: ['CLAT', 'CUET UG', 'State Judiciary Exams (post LLB)']
      },
      {
        name: 'International Law & Commercial Arbitration',
        specialisations: 'International Trade Law, Maritime Disputes, Cross-Border Commercial Arbitration',
        scope: 'Arbitration Counsel, International Trade Advisor, Diplomatic Legal Attaché',
        duration: '5 Years',
        topColleges: 'NLSIU Bengaluru, NLU Delhi, Symbiosis Law School',
        salaryRange: '₹12 - 30+ LPA',
        exams: ['CLAT', 'AILET']
      }
    ]
  },
  {
    id: 'sci',
    name: 'Pure Sciences, Mathematics & Deep Research',
    icon: '🔬',
    badge: 'Science Track',
    degrees: 'BS-MS / B.Sc (Hons) / B.Stat / B.Math (3 to 5 Years)',
    desc: 'Fundamental physics, mathematical computation, planetary sciences, genomics, and atomic energy.',
    streamReq: 'Class 12 Science (PCM or PCB)',
    branches: [
      {
        name: 'Theoretical & Applied Physics',
        specialisations: 'Quantum Computing, Condensed Matter Physics, Astrophysics & Cosmology, Photonics',
        scope: 'Research Scientist, Quantum Computing Engineer, Lab Director (ISRO / CERN)',
        duration: '5 Years (BS-MS Integrated)',
        topColleges: 'IISc Bengaluru, IISERs (Pune, Kolkata, Mohali, Bhopal), NISER Bhubaneswar',
        salaryRange: '₹8 - 25+ LPA (Global Fellowship & R&D Labs)',
        exams: ['IISER Aptitude Test (IAT)', 'NEST', 'JEE Advanced']
      },
      {
        name: 'Mathematical Sciences & Statistical Computing',
        specialisations: 'Algorithmic Graph Theory, Stochastic Processes, Cryptography, Mathematical Modeling',
        scope: 'Quantitative Researcher, Cryptographer, Data Modeling Scientist, Algorithmic Trader',
        duration: '3 to 4 Years (B.Stat / B.Math)',
        topColleges: 'ISI Kolkata, CMI Chennai, IISc Bengaluru, Delhi University',
        salaryRange: '₹14 - 40+ LPA',
        exams: ['ISI Admission Test', 'CMI Entrance', 'IAT']
      },
      {
        name: 'Genomics, Molecular Biology & Biochemistry',
        specialisations: 'CRISPR Gene Editing, Synthetic Biology, Immunology, Structural Proteomics',
        scope: 'Genomics Researcher, Biotech R&D Lead, Molecular Diagnostics Specialist',
        duration: '5 Years',
        topColleges: 'IISc Bengaluru, IISERs, JNU, University of Hyderabad',
        salaryRange: '₹7 - 22+ LPA',
        exams: ['IAT', 'NEST', 'CUET UG']
      },
      {
        name: 'Chemical & Energy Materials Research',
        specialisations: 'Next-Gen Battery Chemistry, Green Catalysis, Nano-Biomaterials, Polymer Synthesis',
        scope: 'Energy Storage Scientist, Formulation Specialist, Advanced Materials Researcher',
        duration: '4 to 5 Years',
        topColleges: 'IISc Bengaluru, IISERs, IITs, ICT Mumbai',
        salaryRange: '₹7 - 20+ LPA',
        exams: ['IAT', 'NEST', 'JEE Advanced']
      }
    ]
  },
  {
    id: 'media',
    name: 'Media, Journalism & Communications',
    icon: '🎙️',
    badge: 'Any Stream',
    degrees: 'B.A. Journalism / B.M.M. / B.Sc Digital Media (3 Years)',
    desc: 'Digital news reporting, documentary filmmaking, brand PR, podcasting, and social media ecosystem.',
    streamReq: 'Any Stream in Class 12 with strong communication and language aptitude',
    branches: [
      {
        name: 'Digital & Investigative Journalism',
        specialisations: 'Data Journalism, Broadcast Production, Long-form Investigative Writing, Geopolitical Media',
        scope: 'Senior News Correspondent, Investigative Journalist, Digital Editor',
        duration: '3 Years',
        topColleges: 'IIMC New Delhi, Asian College of Journalism (ACJ), Delhi University, Symbiosis',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['CUET UG', 'IIMC Entrance', 'SET']
      },
      {
        name: 'Film Direction, Cinematography & Production',
        specialisations: 'Screenwriting, Cinematography, Sound Design, Video Post-Production & Color Grading',
        scope: 'Film Director, Director of Photography (DoP), Production Head, Creative Producer',
        duration: '3 Years',
        topColleges: 'FTII Pune, SRFTI Kolkata, Whistling Woods International',
        salaryRange: '₹6 - 25+ LPA',
        exams: ['JET (FTII / SRFTI Entrance)', 'Portfolio Review']
      },
      {
        name: 'Public Relations, Brand Strategy & Advertising',
        specialisations: 'Corporate Communications, Crisis Management, Influencer Strategy, Media Buying',
        scope: 'PR Account Director, Brand Strategy Lead, Advertising Copywriter',
        duration: '3 Years',
        topColleges: 'St. Xavier’s College Mumbai, Delhi University, Christ University',
        salaryRange: '₹5 - 18+ LPA',
        exams: ['CUET UG', 'University Entrance']
      }
    ]
  },
  {
    id: 'gov',
    name: 'Government, Defence & Civil Services',
    icon: '🏛️',
    badge: 'Direct 12th & Graduation',
    degrees: 'NDA / UPSC CSE / CDS / SSC / Banking (Direct After 12th & Graduation)',
    desc: 'Officer cadet training in the Armed Forces, civil administration, diplomatic service, and banking authority.',
    streamReq: 'Class 12 Pass (PCM required for Air Force & Naval Academy in NDA; Any Stream for Army)',
    branches: [
      {
        name: 'National Defence Academy (NDA - Army, Navy, Air Force)',
        specialisations: 'Military Strategy, Aeronautical Navigation, Naval Warfare, Combat Leadership',
        scope: 'Commissioned Officer (Lieutenant / Sub Lieutenant / Flying Officer in Indian Armed Forces)',
        duration: '3 Years NDA Khadakwasla + 1 Year IMA/INA/AFA',
        topColleges: 'National Defence Academy (NDA Khadakwasla, Pune)',
        salaryRange: '₹10 - 22+ LPA (Level 10 Pay Matrix + Military Allowances & Free Healthcare/Housing)',
        exams: ['NDA & NA Exam (UPSC) + 5-Day SSB Interview']
      },
      {
        name: 'Indian Navy & Army 10+2 B.Tech Cadet Entry Scheme',
        specialisations: 'Executive, Marine Engineering, Electrical & Naval Architecture Branches',
        scope: 'Sub Lieutenant (Commissioned Officer with Free B.Tech at INA Ezhimala)',
        duration: '4 Years',
        topColleges: 'Indian Naval Academy (INA) Ezhimala',
        salaryRange: '₹10 - 22+ LPA + Full Sponsorship',
        exams: ['JEE Main Rank + Direct Services Selection Board (SSB) Interview']
      },
      {
        name: 'Civil Services (IAS, IPS, IFS, IRS via UPSC CSE)',
        specialisations: 'District Public Administration, Police Leadership, Diplomatic Missions, Revenue Policy',
        scope: 'District Magistrate (IAS), Superintendent of Police (IPS), Ambassador (IFS)',
        duration: 'Graduation Degree + UPSC Examination Cycle',
        topColleges: 'LBSNAA Mussoorie, SVPNPA Hyderabad',
        salaryRange: 'Government Apex Pay Scale + Central Amenities',
        exams: ['UPSC Civil Services Exam (Prelims, Mains, Interview)']
      },
      {
        name: 'Combined Defence Services (CDS) & AFCAT (Air Force)',
        specialisations: 'Short Service / Permanent Commission for Military Officers post-graduation',
        scope: 'Captain, Major, Squadron Leader in Armed Forces',
        duration: '1 to 1.5 Years Military Academy Training',
        topColleges: 'IMA Dehradun, OTA Chennai, Air Force Academy (AFA)',
        salaryRange: 'Defence Officer Pay Scale + Allowances',
        exams: ['CDS (UPSC)', 'AFCAT (IAF) + SSB Interview']
      },
      {
        name: 'Central Ministries & Banking Officers (SSC CGL / CHSL, IBPS & SBI PO)',
        specialisations: 'Audit, Income Tax, Customs, Enforcement, Commercial & Central Banking',
        scope: 'Income Tax Inspector, Assistant Section Officer, Bank Probationary Officer (PO)',
        duration: 'Direct Recruitment via Competitive Exam',
        topColleges: 'Central Government Ministries & Nationalized Banks',
        salaryRange: '₹6 - 15+ LPA',
        exams: ['SSC CGL', 'SSC CHSL (12th Level)', 'IBPS PO', 'SBI PO', 'RBI Grade B']
      }
    ]
  }
];

const FAQS = [
  {
    q: "I still don't know what I want. Is that a problem?",
    a: "No — at 17 or 18, almost nobody has a fixed answer, whatever it looks like from outside. Treat the quiz result as a direction to research this month, not a decision to make today."
  },
  {
    q: "Can I switch streams later — say, Commerce to Design, or Science to Law?",
    a: "Yes, more easily than most people assume. Many design, law, media and management courses accept any stream. Medicine and core engineering are the main exceptions, since they require PCB or PCM specifically."
  },
  {
    q: "Is choosing Arts/Humanities actually a good decision?",
    a: "It's one of the widest-open paths there is — psychology, economics, law, civil services, journalism and design all sit downstream of it. The 'safe' reputation of Science often has more to do with family expectations than actual outcomes."
  },
  {
    q: "Government job or private sector — which is the better bet?",
    a: "They optimise for different things. Government roles (via UPSC, state PSCs, banking exams) tend to offer stability and long-term security; private-sector roles tend to move faster and pay more early on, with less certainty. Neither is universally 'better' — it depends what you value at 25 versus at 45."
  },
  {
    q: "Should I take a gap year to prepare for an entrance exam?",
    a: "It can work well if you have a specific exam and a real study plan — NEET or CLAT droppers, for example, often improve. It works poorly as an open-ended 'figure it out' year. If you take one, put a structure and an end date on it."
  },
  {
    q: "How much should entrance exam difficulty influence my choice?",
    a: "Some, but not entirely. A field worth 5 hard years is different from a hard exam you're only chasing because it's competitive. Weigh the exam and the actual day-to-day work of the career roughly equally."
  },
];

// Node.js module export compatibility for backend/tests if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATS, QUESTIONS, EXAM_INFO, CAREERS, COURSE_BRANCHES, FAQS };
}
