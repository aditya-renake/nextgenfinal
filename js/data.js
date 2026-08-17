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
    timeline: 'Two sessions a year. Session 1 registration late Oct–Nov, exam in January. Session 2 registration in February, exam in April.'
  },
  jeeadv: {
    name: 'JEE Advanced',
    site: 'https://jeeadv.ac.in',
    body: 'A rotating IIT (only for JEE Main top scorers)',
    timeline: 'Registration opens right after JEE Main results, in April. Exam is held in mid-to-late May, same year.'
  },
  bitsat: {
    name: 'BITSAT',
    site: 'https://www.bitsadmission.com',
    body: 'BITS Pilani',
    timeline: 'Session 1 registration runs December–March, exam in mid-April. Session 2 registration in April–May, exam in late May.'
  },
  statecet: {
    name: 'State CET',
    site: null,
    body: "Your state's CET cell (varies by state, e.g. MHT-CET for Maharashtra)",
    timeline: "Typically registration in February–March with the exam in April–May, but this varies by state — check your own state's CET cell website."
  },
  neetug: {
    name: 'NEET-UG',
    site: 'https://neet.nta.nic.in',
    body: 'National Testing Agency (NTA)',
    timeline: 'Registration in February–March. Exam is traditionally the first Sunday of May, with results by June–July.'
  },
  stateuniv: {
    name: 'State / university entrance',
    site: null,
    body: 'Varies by institution',
    timeline: "Dates vary by state and college — check your target institution's admissions page directly."
  },
  cafoundation: {
    name: 'CA Foundation',
    site: 'https://www.icai.org',
    body: 'Institute of Chartered Accountants of India (ICAI)',
    timeline: 'Held three times a year — January, May/June, and September. Register roughly 4 months before your chosen session.'
  },
  cuet: {
    name: 'CUET UG',
    site: 'https://cuet.nta.nic.in',
    body: 'National Testing Agency (NTA)',
    timeline: 'Registration in February–March, with the exam window running through May.'
  },
  bbaentrance: {
    name: 'University-specific BBA entrance',
    site: null,
    body: 'Varies by university',
    timeline: "Most run alongside CUET, February–May — check your target university's admissions page."
  },
  uceed: {
    name: 'UCEED',
    site: 'https://uceed.iitb.ac.in',
    body: 'IIT Bombay',
    timeline: 'Registration opens in October and closes by early November. Exam is held in mid-January.'
  },
  niddat: {
    name: 'NID DAT',
    site: 'https://admissions.nid.edu',
    body: 'National Institute of Design',
    timeline: 'Registration October–December. Prelims held in December, Mains in March–April.'
  },
  niftentrance: {
    name: 'NIFT Entrance Exam',
    site: 'https://www.nift.ac.in',
    body: 'National Institute of Fashion Technology (via NTA)',
    timeline: 'Registration December–January. Written exam (CAT & GAT) held in early February, results by April.'
  },
  collegespecific: {
    name: 'College-specific portfolio / interview',
    site: null,
    body: 'Varies by institution',
    timeline: 'Usually runs alongside CUET, February–May — confirm directly with each college.'
  },
  duentrance: {
    name: 'University-specific entrance',
    site: null,
    body: 'Varies by university',
    timeline: "Most Delhi University courses now admit via CUET; a few specific programmes still run their own test — check the university's site."
  },
  clat: {
    name: 'CLAT',
    site: 'https://consortiumofnlus.ac.in',
    body: 'Consortium of National Law Universities',
    timeline: 'Registration opens in August and runs through October/November. Exam is held the first Sunday of December.'
  },
  ailet: {
    name: 'AILET',
    site: 'https://nationallawuniversitydelhi.in',
    body: 'National Law University, Delhi',
    timeline: 'Registration opens in August. Exam is held in mid-December, only for admission to NLU Delhi.'
  },
  upsccse: {
    name: 'UPSC Civil Services Exam',
    site: 'https://upsc.gov.in',
    body: 'Union Public Service Commission',
    timeline: 'Notification released January/February. Prelims in late May, Mains from August (spread across 5 days), interview months later.'
  },
  iat: {
    name: 'IISER Aptitude Test (IAT)',
    site: 'https://iiseradmission.in',
    body: 'IISER admission committee',
    timeline: 'Registration March–April. Exam held in early June.'
  },
  nest: {
    name: 'NEST',
    site: 'https://www.nestexam.in',
    body: 'NISER Bhubaneswar / UM-DAE CEBS',
    timeline: 'Registration January–April. Exam held in early June.'
  },
  isiat: {
    name: 'ISI Admission Test',
    site: 'https://www.isical.ac.in',
    body: 'Indian Statistical Institute',
    timeline: 'Registration February–March. Exam held in May, in offline mode.'
  },
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
  module.exports = { CATS, QUESTIONS, EXAM_INFO, CAREERS, FAQS };
}
