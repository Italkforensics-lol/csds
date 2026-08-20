import { ClubEvent, ClubProject, ClubLeader, CTFChallenge } from '../types';

export interface AssociationInfo {
  name: string;
  shortName: string;
  tagline: string;
  established: string;
  motto: string;
  facultyMentors: { name: string; designation: string; department: string }[];
  overview: string;
  stats: {
    activeMembers: number;
    completedWorkshops: number;
    nationalCtfWins: number;
    openSourceProjects: number;
  };
}

export const ANONYMOUS_LAB_INFO: AssociationInfo = {
  name: 'The Anonymous Lab',
  shortName: 'TAL',
  tagline: 'Premier Department Association for Cyber Security, Threat Intelligence & Applied Data Science',
  established: '2024',
  motto: 'In Scientia Securitas • Through Knowledge We Secure',
  facultyMentors: [
    {
      name: 'Mr. Adarsh V P',
      designation: 'Assistant Professor & Co-ordinator',
      department: 'Department of CSDS (Cyber Security & Data Science)',
    },
    {
      name: 'Mrs. Ashmi Saji',
      designation: 'Assistant Professor',
      department: 'Department of Digital & Cyber Forensic Science',
    },
    {
      name: 'Mr. Anathakrishnan U K',
      designation: 'Assistant Professor',
      department: 'Department of Digital & Cyber Forensic Science',
    },
  ],
  overview:
    'The Anonymous Lab is the official student-led departmental association of the Department of Cyber Security & Data Science (CSDS) in collaboration with the Department of Digital & Cyber Forensic Science. It brings together aspiring cybersecurity practitioners and data scientists to explore secure programming, forensic analysis, sustainable computing, and data structures.',
  stats: {
    activeMembers: 64,
    completedWorkshops: 8,
    nationalCtfWins: 3,
    openSourceProjects: 6,
  },
};

export const CIPHER_X_CLUB_INFO = {
  name: 'Cipher X',
  associationParent: 'The Anonymous Lab',
  badge: 'Specialized Cyber Defense & Coding Club',
  tagline: 'Breaking Ciphers, Structuring Algorithms, Securing Systems',
  overview:
    'Cipher X is the specialized technical club under The Anonymous Lab. Cipher X focuses on hands-on Python data structures, Capture-the-Flag (CTF) challenges, cryptographic protocol auditing, secure coding practices, and sustainable computing initiatives.',
  focusAreas: [
    'Data Structures & Algorithmic Problem Solving in Python',
    'Applied Cryptography & Secure Communication Protocols',
    'Digital Forensics & Incident Response (DFIR)',
    'Green Computing & Digital Sustainability Initiatives',
    'Capture The Flag (CTF) Hands-on Defense Drills',
  ],
};

export const CIPHER_X_LEADERS: ClubLeader[] = [
  {
    name: 'Sruthi',
    role: 'Student Coordinator & Technical Lead',
    semester: 'Semester 1',
    specialty: 'Python Data Structures & Security Auditing',
    githubOrLinkedin: 'github.com/the-anonymous-lab',
  },
  {
    name: 'Kailas Krishna P. K.',
    role: 'Co-Lead & Coding Coordinator',
    semester: 'Semester 1',
    specialty: 'Algorithmic Problem Solving & Systems',
    githubOrLinkedin: 'github.com/the-anonymous-lab',
  },
  {
    name: 'Sai Sivan',
    role: 'CTF & Research Coordinator',
    semester: 'Semester 1',
    specialty: 'Threat Telemetry & Memory Models',
    githubOrLinkedin: 'linkedin.com/in/the-anonymous-lab',
  },
  {
    name: 'Amina Nihala K.',
    role: 'Projects & Sustainability Lead',
    semester: 'Semester 1',
    specialty: 'Green ICT & Energy Efficient Computing',
    githubOrLinkedin: 'linkedin.com/in/the-anonymous-lab',
  },
];

export const CIPHER_X_EVENTS: ClubEvent[] = [
  {
    id: 'evt-1',
    title: 'Python Data Structures Sprint & Code Arena 2026',
    date: 'September 15, 2026',
    type: 'Coding Competition',
    location: 'CSDS Computer Lab 1',
    speakerOrHost: 'Cipher X Core Committee & Mr. Adarsh V P',
    status: 'Upcoming',
    attendeesCount: 32,
    description: 'Hands-on speed coding sprint focused on implementing Linked Lists, Stacks, and Queues from scratch with unit tests in Python.',
    tags: ['Python', 'Data Structures', 'Coding Sprint', 'Algorithms'],
  },
  {
    id: 'evt-2',
    title: 'Green Computing & E-Waste Awareness Workshop',
    date: 'September 28, 2026',
    type: 'Hands-on Workshop',
    location: 'Seminar Hall 1',
    speakerOrHost: 'Mrs. Ashmi Saji & Cipher X Sustainability Wing',
    status: 'Upcoming',
    attendeesCount: 45,
    description: 'Interactive session exploring Power Usage Effectiveness (PUE) in modern cloud data centers and responsible institutional e-waste management.',
    tags: ['Green Computing', 'Sustainability', 'PUE', 'E-Waste'],
  },
  {
    id: 'evt-3',
    title: 'Inaugural Cyber Security & Data Science Orientation',
    date: 'August 12, 2026',
    type: 'Department Orientation',
    location: 'Auditorium 2',
    speakerOrHost: 'Mr. Adarsh V P, Mrs. Ashmi Saji & Mr. Anathakrishnan U K',
    status: 'Completed',
    attendeesCount: 60,
    description: 'Welcome session introducing the curriculum, The Anonymous Lab association, Cipher X club activities, and academic resources.',
    tags: ['Orientation', 'CSDS', 'Academics'],
  },
];

export const CIPHER_X_PROJECTS: ClubProject[] = [
  {
    id: 'proj-1',
    title: 'PyDS-Visualizer: Interactive Memory & Pointer Visualizer',
    description: 'An open-source Python tool that generates step-by-step visual diagrams of Linked Lists, Trees, and Stacks in heap memory.',
    category: 'Educational Tool',
    leads: ['Sruthi', 'Kailas Krishna P. K.'],
    githubUrl: 'https://github.com/the-anonymous-lab/pyds-visualizer',
    starsOrForks: '⭐ 48 • 🍴 12',
    status: 'Active',
  },
  {
    id: 'proj-2',
    title: 'GreenAudit: Institutional Lab Energy Profiler',
    description: 'A lightweight utility that calculates estimated energy consumption and carbon emissions for computer laboratory workstations.',
    category: 'Sustainability Tool',
    leads: ['Amina Nihala K.'],
    githubUrl: 'https://github.com/the-anonymous-lab/green-audit',
    starsOrForks: '⭐ 32 • 🍴 8',
    status: 'Active',
  },
];

export const CIPHER_X_CHALLENGES: CTFChallenge[] = [
  {
    id: 'ctf-1',
    title: 'Singly Linked List Loop Detector',
    category: 'Data Structures',
    difficulty: 'Easy',
    points: 100,
    solvesCount: 22,
    description: "A linked list has a cycle created by a corrupted next pointer. Use Floyd's Tortoise and Hare algorithm to find the flag encoded at the intersection node.",
    flagHint: 'Use two pointers moving at speed 1 and speed 2.',
  },
  {
    id: 'ctf-2',
    title: 'Stack Parentheses Decryption',
    category: 'Algorithms',
    difficulty: 'Medium',
    points: 150,
    solvesCount: 18,
    description: 'An encrypted message was scrambled inside nested parentheses. Implement a stack-based bracket evaluator to unscramble the secret flag.',
    flagHint: 'Push opening brackets and pop matching pairs while recording interior characters.',
  },
  {
    id: 'ctf-3',
    title: 'Data Center PUE Power Challenge',
    category: 'Sustainability',
    difficulty: 'Medium',
    points: 150,
    solvesCount: 14,
    description: 'Given facility power readings and cooling metrics, calculate the exact PUE ratio to unlock the configuration flag.',
    flagHint: 'PUE = Total Facility Power / IT Equipment Power.',
  },
];
