import { Student, Program, Assignment, MockTest, Question } from './types';

export const PROGRAMS: Program[] = [
  {
    id: 'foundation',
    title: 'Junior Secondary (7th-10th)',
    subtitle: 'All Subjects Core Classes',
    description: 'Building strong conceptual roots in Mathematics, Science, English, and Social Studies to ensure school board excellence and strong study habits.',
    icon: 'school',
    highlights: [
      'Complete Core Concepts Coverage',
      'Interactive Smart Visualization',
      'Regular Progress & Diagnostic Reviews',
      'Special Subject-wise Doubt Sessions'
    ],
    actionText: 'Enroll Now'
  },
  {
    id: 'senior-science',
    title: 'Senior Science (11th-12th)',
    subtitle: 'Medical & Non-Medical Streams',
    description: 'In-depth, concept-focused coaching for Physics, Chemistry, Mathematics (PCM), and Biology (PCB) fully mapped to secondary board standards.',
    icon: 'medical_services',
    highlights: [
      'Experienced Subject Matter Experts',
      'Rigorous Board-Format Practice Tests',
      'Comprehensive Theory & Practical Help',
      'Daily Practice Problem Sheets'
    ],
    actionText: 'Top Choice - Enroll',
    badge: 'MOST POPULAR'
  },
  {
    id: 'senior-commerce',
    title: 'Senior Commerce (11th-12th)',
    subtitle: 'Accounts, Economics & Business',
    description: 'Detailed study sessions for Accountancy, Business Studies, Economics, and Core Mathematics to achieve academic distinction.',
    icon: 'target',
    highlights: [
      'Step-by-step Accounts Problem Solving',
      'Interactive Case Study Analysis',
      'Economics Graph & Theory Mastery',
      'Regular Answer Presentation Drills'
    ],
    actionText: 'Enroll Now'
  }
];

export const STUDENTS: Student[] = [
  {
    id: 'manav',
    name: 'Manav Saxena',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoX4c0vfp0pQqKQlQeWLCdp4pI7__gppfThqxFSy85LQqtQxBONr5hxalz5_UuMF2steGLtLN6zkuhSe2MQZ1BfA7JsEWWyjEadHF5MzwlvZ1gSvuzx1NUVC1IYwSRrfuC0bgapVOCmtx1NFgwmTnOmC84ut48RqdkUbIxk15VO1au1YuYnQ_l_3sbr4yCYi-QIXg3-YvyLTjC8bunfg9NpyiS0PY_psS1Rz3oxLp12b-ZOzTz7XTBV24oOmL6s0NFKg',
    achievement: 'Outstanding Board Marks',
    stream: 'Non-Medical',
    scoreInfo: 'Maths: 98/100, Physics: 96/100',
    quote: "The Success Institute didn't just teach me formulas; they taught me how to understand the underlying physical concepts. The teachers were always available for doubt clearance.",
    journey: [
      { phase: 'Phase 1: Concept Building', description: 'Joined in Class 11. Mastered core mathematics, chemistry, and mechanics foundations.' },
      { phase: 'Phase 2: Practice Sheets', description: 'Solved over 400 school-level physics problems monthly and participated in weekly tests.' },
      { phase: 'Phase 3: Board Preparation', description: 'Focused on weak-area analysis and presentation during board pattern mock drills.' }
    ]
  },
  {
    id: 'ragini',
    name: 'Ragini',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMVCLPbbI5_L2B5ndOLbuhohihwKoq2OJSEtO_-xsQULdSmG8fpz1Lic8HUomHNvY_LVS8Z9wcRoOTvKLQOz3ER_Coc9i5garVZFCDdGZvLFuYlbJyfJWsDsl-9ZhtUM03HKJWIZKEIei7PbuHm2HcL3SIDbQlm6gqpphaw8bfrb0pybudnwql_RdXyJOEfeQrCFGmkkngB_HkSIngK84Sa0QRK2F4St16NjRqk7RAt9tVC48eyZvn-j2sXkVak7Jgxg',
    achievement: 'Top Subject Performer',
    stream: 'Medical',
    scoreInfo: '100/100 in Biology & 98 in Chemistry',
    quote: "The personal mentorship at the institute made all the difference. Regular test analysis sessions pointed out exactly where my diagram labelling and definitions needed improvement.",
    journey: [
      { phase: 'Phase 1: Textbook Mastery', description: 'Covered and revised core biology textbooks more than 8 times with comprehensive faculty sheets.' },
      { phase: 'Phase 2: Writing Speed', description: 'Engaged in timed exam simulations to perfect subjective writing speed.' },
      { phase: 'Phase 3: Final Success', description: 'Achieved top marks in the annual secondary board exams with perfect biology scores.' }
    ]
  },
  {
    id: 'nisha',
    name: 'Nisha',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhp5cXYsQafeDK3AihMOSP2Ar8pzuN__aVugOObLQsvKiSNDvqWpmKBf4vnY6M9NJoVJMyA9jWfk_4VpygqSNq1TqlJB1JgChJjEdFFDDsHTmX4wJNvokcjjst7VJRVqGd8tERR5PrWfbUonEbTMHO4PzElvd6q8fvsEq9HG4ErOXcHDiIy3M9V25pmgVqYikXEFgigOHAfGJltXaUmDrW_fZNw1tSLxTZY_dUh-wQhINZkqqPLkVzCOChbiLAAhLR1g',
    achievement: 'District Board Topper',
    stream: 'Foundation',
    scoreInfo: '98% Overall Aggregate in Grade 10',
    quote: "Balancing all secondary school subjects can be extremely stressful, but the well-planned schedules and equal focus on social sciences and languages made it smooth.",
    journey: [
      { phase: 'Phase 1: Concept Alignment', description: 'Mapped school textbooks alongside reference workbooks to avoid overlapping studies.' },
      { phase: 'Phase 2: Answer Presentation', description: 'Trained in custom answer presentation, neat diagrams, and step-marking with senior faculties.' },
      { phase: 'Phase 3: School Honors', description: 'Scored an incredible 98% overall aggregate in Grade 10, setting a local record.' }
    ]
  },
  {
    id: 'jahnvi',
    name: 'Jahnvi',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJCBAwPrnzpaqKKVgRt6SwyY2kvKKsBLvOYngcz1jHbUtCzaczHpGu8y9SpdqhLi7hS9VmHFcvGihNEIJQhBRwsGqxTGXPrPVj0lPVIr-gE7D6GNDadf-RjSisoEpEH3B-dw1_K8dVALBKg9noOB_8AbgBdj8Eyu8lis4_TsfZu2UHG6eQonZ5RBsTGWjlmLhcJRT6GmaFCDsfuJDIrtZHUGyWHJASf5NtQdmE--5YPcP8QxaP6yU4sEdQ-ZZG1whKMQ',
    achievement: 'Commerce Stream Merit',
    stream: 'Commerce',
    scoreInfo: '96/100 in Economics & Accounts',
    quote: "The practical case study approach in business and precise accounts problem-solving tricks at the institute were top-notch.",
    journey: [
      { phase: 'Phase 1: Fundamentals', description: 'Mastered double-entry bookkeeping, ledger principles, and microeconomics graphs.' },
      { phase: 'Phase 2: Practice Sheets', description: 'Completed 50+ board mock question papers under rigorous classroom timers.' },
      { phase: 'Phase 3: Merit Placement', description: 'Placed in the state-top 1% with commerce distinction, securing tier-1 college entry.' }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    title: 'Fluid Mechanics Board Questions & NCERT Solutions',
    subject: 'Physics',
    dueDate: 'July 10, 2026',
    status: 'pending'
  },
  {
    id: 'asg-02',
    title: 'Aldehydes, Ketones & Carboxylic Acid Concept Map',
    subject: 'Chemistry',
    dueDate: 'July 12, 2026',
    status: 'pending'
  },
  {
    id: 'asg-03',
    title: 'Trigonometric Equations & Board Worksheet',
    subject: 'Mathematics',
    dueDate: 'July 08, 2026',
    status: 'completed'
  },
  {
    id: 'asg-04',
    title: 'NCERT Plant Kingdom Diagrams & Anatomy Review',
    subject: 'Biology',
    dueDate: 'July 15, 2026',
    status: 'pending'
  }
];

export const INITIAL_TESTS: MockTest[] = [
  {
    id: 'test-01',
    title: 'Unit Test Series: Physics Mechanics',
    subject: 'Physics',
    totalQuestions: 5,
    durationMinutes: 10,
    status: 'available'
  },
  {
    id: 'test-02',
    title: 'Unit Test Series: Biomolecules & Organic Synthesis',
    subject: 'Chemistry',
    totalQuestions: 5,
    durationMinutes: 10,
    status: 'available'
  },
  {
    id: 'test-03',
    title: 'Unit Test Series: Matrices & Coordinate Geometry',
    subject: 'Mathematics',
    totalQuestions: 5,
    durationMinutes: 10,
    status: 'completed',
    score: 80
  },
  {
    id: 'test-04',
    title: 'Board Format Biology Speed Test',
    subject: 'Biology',
    totalQuestions: 5,
    durationMinutes: 5,
    status: 'available'
  }
];

export const TEST_QUESTIONS: Record<string, Question[]> = {
  'test-01': [
    {
      id: 'q-p1',
      text: 'What is the work done by a conservative force around a closed loop path?',
      options: ['Always positive', 'Always negative', 'Exactly Zero', 'Depends on the shape of the path'],
      correctIndex: 2,
      explanation: 'By definition, a conservative force is one for which the work done in moving an object between two points is independent of the path taken. Therefore, the work done along a closed loop path starting and ending at the same point is exactly zero.'
    },
    {
      id: 'q-p2',
      text: 'A ball is thrown vertically upwards in a vacuum. Which of the following quantities remains constant throughout its flight?',
      options: ['Speed', 'Kinetic Energy', 'Mechanical Energy', 'Velocity'],
      correctIndex: 2,
      explanation: 'In a vacuum, there is no air resistance (non-conservative dissipation). Therefore, total mechanical energy (Potential Energy + Kinetic Energy) remains conserved and constant throughout the motion.'
    },
    {
      id: 'q-p3',
      text: 'A bullet is fired horizontally from a rifle, and at the same instant another bullet is dropped vertically from the same height. If air resistance is neglected:',
      options: ['The dropped bullet hits the ground first', 'The fired bullet hits the ground first', 'Both hit the ground at the exact same time', 'Depends on the weight of the bullets'],
      correctIndex: 2,
      explanation: 'The vertical motion and horizontal motion of a projectile are independent. Both bullets start with zero vertical velocity and experience the exact same acceleration due to gravity (g). Thus, they will hit the flat ground at the same time.'
    },
    {
      id: 'q-p4',
      text: 'The moment of inertia of a solid cylinder of mass M and radius R about its central longitudinal axis is:',
      options: ['M R²', '0.5 M R²', '0.4 M R²', '2 M R²'],
      correctIndex: 1,
      explanation: 'For a solid cylinder (or a solid disk) of mass M and radius R, the moment of inertia about its axis of symmetry is (1/2) * M * R².'
    },
    {
      id: 'q-p5',
      text: 'If the kinetic energy of a body is increased by 300%, by what percentage does its momentum increase?',
      options: ['300%', '200%', '100%', '50%'],
      correctIndex: 2,
      explanation: 'Momentum P is proportional to the square root of Kinetic Energy (KE): P = sqrt(2m * KE). If KE is increased by 300%, its new value is 4 times the original (KE_new = 4 * KE_old). Taking the square root, P_new = sqrt(4) * P_old = 2 * P_old, which is a 100% increase.'
    }
  ],
  'test-02': [
    {
      id: 'q-c1',
      text: 'Which functional group is characterized by a carbon atom double-bonded to an oxygen atom (C=O)?',
      options: ['Ether', 'Alcohol', 'Carbonyl', 'Ester'],
      correctIndex: 2,
      explanation: 'A carbonyl group is a functional group composed of a carbon atom double-bonded to an oxygen atom (C=O), found in aldehydes, ketones, carboxylic acids, and esters.'
    },
    {
      id: 'q-c2',
      text: 'Which of the following carbohydrates is classified as a non-reducing sugar?',
      options: ['Glucose', 'Fructose', 'Maltose', 'Sucrose'],
      correctIndex: 3,
      explanation: 'Sucrose is a non-reducing sugar because its glycosidic bond is formed between the reducing groups of both glucose and fructose (C1 of alpha-glucose and C2 of beta-fructose), meaning there is no free hemiacetal or hemiketal group.'
    },
    {
      id: 'q-c3',
      text: 'What type of polymer is Nylon-6,6?',
      options: ['Polyester', 'Polyamide', 'Polyurethane', 'Addition Polymer'],
      correctIndex: 1,
      explanation: 'Nylon-6,6 is a synthetic polyamide made by the condensation reaction of adipic acid and hexamethylenediamine.'
    },
    {
      id: 'q-c4',
      text: 'The denaturation of proteins involves the breakdown of which structure?',
      options: ['Primary Structure', 'Secondary and Tertiary Structure', 'Peptide bonds', 'None of the above'],
      correctIndex: 1,
      explanation: 'Denaturation of proteins involves the disruption of secondary, tertiary, and quaternary structures (hydrogen bonds, disulfide bridges, ionic bonds), leaving the primary amino acid sequence (covalent peptide bonds) intact.'
    },
    {
      id: 'q-c5',
      text: 'Which catalyst is commonly used in the hydrogenation of vegetable oils to form solid fats?',
      options: ['Iron (Fe)', 'Finely divided Nickel (Ni)', 'Platinum (Pt)', 'V2O5'],
      correctIndex: 1,
      explanation: 'Finely divided nickel (Ni) acts as a highly effective catalyst in the industrial organic hydrogenation process to convert liquid unsaturated vegetable oils into solid saturated fats (margarine).'
    }
  ],
  'test-04': [
    {
      id: 'q-b1',
      text: 'Which organelle in eukaryotic cells is primarily responsible for ATP synthesis?',
      options: ['Lysosome', 'Mitochondria', 'Chloroplast', 'Golgi Apparatus'],
      correctIndex: 1,
      explanation: 'Mitochondria are often referred to as the "powerhouses of the cell" because they perform cellular respiration to generate adenosine triphosphate (ATP), the primary energy currency of the cell.'
    },
    {
      id: 'q-b2',
      text: 'In plant cells, the primary component of the cell wall is:',
      options: ['Chitin', 'Peptidoglycan', 'Cellulose', 'Keratin'],
      correctIndex: 2,
      explanation: 'The primary cell wall of green plants is made mainly of cellulose, a complex carbohydrate (polysaccharide) consisting of a linear chain of beta-linked glucose units.'
    },
    {
      id: 'q-b3',
      text: 'Which plant hormone is primarily responsible for promoting cell division and delaying leaf senescence?',
      options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Abscisic Acid'],
      correctIndex: 2,
      explanation: 'Cytokinins are a class of plant growth substances (hormones) that promote cell division (cytokinesis) in plant roots and shoots, and delay aging (senescence).'
    },
    {
      id: 'q-b4',
      text: 'Double fertilization is a unique characteristic feature of which plant group?',
      options: ['Bryophytes', 'Pteridophytes', 'Gymsomperms', 'Angiosperms'],
      correctIndex: 3,
      explanation: 'Double fertilization is a complex and highly specialized fertilization mechanism unique to angiosperms (flowering plants) that involves the joining of a female gametophyte with two male gametes.'
    },
    {
      id: 'q-b5',
      text: 'Which pigment is responsible for absorbing red and far-red light to control photoperiodism in plants?',
      options: ['Chlorophyll a', 'Carotenoids', 'Phytoplankton', 'Phytochrome'],
      correctIndex: 3,
      explanation: 'Phytochrome is a photoreceptor pigment used by plants to detect red and far-red light. It plays a critical role in regulating photoperiodic responses such as flowering, seed germination, and circadian rhythms.'
    }
  ]
};
