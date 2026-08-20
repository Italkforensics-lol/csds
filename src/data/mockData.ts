import { Course, Quiz, Assignment, NoteItem, StudyPlan, StudentEngagementProfile, FacultyProfile } from '../types';

export const DEFAULT_FACULTY_ACCOUNTS: (FacultyProfile & { defaultPin: string })[] = [
  {
    id: 'fac-1',
    name: 'Mr. Adarsh V P',
    email: 'adarsh.vp@bca.edu',
    designation: 'Assistant Professor & Co-ordinator',
    department: 'Department of CSDS',
    coursesAssigned: ['26DSC01', '26DSCP1', '26DSDT1'],
    defaultPin: 'faculty123',
  },
  {
    id: 'fac-2',
    name: 'Mrs. Ashmi Saji',
    email: 'ashmi.saji@bca.edu',
    designation: 'Assistant Professor',
    department: 'Department of Digital & Cyber Forensic Science',
    coursesAssigned: ['26DSAE1'],
    defaultPin: 'faculty123',
  },
  {
    id: 'fac-3',
    name: 'Mr. Anathakrishnan U K',
    email: 'ananthakrishnan.uk@bca.edu',
    designation: 'Assistant Professor',
    department: 'Department of Digital & Cyber Forensic Science',
    coursesAssigned: ['26DSEVS1'],
    defaultPin: 'faculty123',
  },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '26DSC01',
    code: '26DSC01',
    name: 'Data Structures Using Python',
    semester: 1,
    credits: 4,
    instructor: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator, Dept of CSDS)',
    category: 'Core 1',
    description: 'Python memory model, dynamic arrays, linked lists (singly, doubly, circular), stacks, queues, binary trees, recursion trees, and asymptotic analysis (Big-O, Omega, Theta).',
    enrolledStudentsCount: 32,
  },
  {
    id: '26DSCP1',
    code: '26DSCP1',
    name: 'Data Structures Using Python Lab',
    semester: 1,
    credits: 2,
    instructor: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator, Dept of CSDS)',
    category: 'Core 1 Practical',
    description: 'Practical lab implementations of linear and non-linear data structures, searching & sorting algorithms, memory allocation profiling, and algorithmic problem solving.',
    enrolledStudentsCount: 32,
  },
  {
    id: '26DSS01',
    code: '26DSS01',
    name: 'IT Informatics',
    semester: 1,
    credits: 3,
    instructor: 'L&T Industry Faculty',
    category: 'SECC 1',
    description: 'Modern IT infrastructure, enterprise software tools, collaborative computing, information architecture, cloud services, and cyber hygiene in industry environments.',
    enrolledStudentsCount: 32,
  },
  {
    id: '26DSAE1',
    code: '26DSAE1',
    name: 'Digital Sustainability and Green Computing',
    semester: 1,
    credits: 3,
    instructor: 'Mrs. Ashmi Saji (Asst. Prof, Dept of Digital & Cyber Forensic Science)',
    category: 'AECC 1',
    description: 'Environmental impact of computing technologies, data center energy efficiency, carbon metrics (PUE, CUE), green software engineering, and e-waste management regulations.',
    enrolledStudentsCount: 32,
  },
  {
    id: '26DSEVS1',
    code: '26DSEVS1',
    name: 'Environmental Studies (EVS)',
    semester: 1,
    credits: 2,
    instructor: 'Mr. Anathakrishnan U K (Asst. Prof, Dept of Digital & Cyber Forensic Science)',
    category: 'AECC 2',
    description: 'Ecology, biodiversity conservation, pollution prevention, sustainable development goals (SDGs), and environmental regulatory compliance.',
    enrolledStudentsCount: 32,
  },
  {
    id: '26DSDT1',
    code: '26DSDT1',
    name: 'Design Thinking & Problem Solving',
    semester: 1,
    credits: 2,
    instructor: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator, Dept of CSDS)',
    category: 'SEC',
    description: 'Human-centered design process: Empathize, Define, Ideate, Prototype, and Test. Application of creative thinking frameworks to technology and cyber challenges.',
    enrolledStudentsCount: 32,
  }
];

export const INITIAL_SYLLABUS_PRESETS: { [key: string]: { title: string; courseId: string; content: string } } = {
  '26DSC01': {
    title: '26DSC01 Data Structures Using Python (Syllabus)',
    courseId: '26DSC01',
    content: `Unit 1: Introduction to Data Structures & Python OOP Foundations
- Abstract Data Types (ADT), Primitive vs Non-Primitive Data Structures.
- Python memory management, mutable vs immutable references, list comprehension, generators.
- Algorithmic Complexity: Asymptotic notations (Big O, Big Omega, Big Theta), Space-Time trade-offs.

Unit 2: Linear Data Structures (Arrays & Linked Lists)
- Dynamic Array implementation in Python (resizing strategy, amortized O(1) append).
- Singly Linked Lists: Node creation, traversal, insertion, deletion, reversing.
- Doubly Linked Lists and Circular Linked Lists: Operations and edge cases.

Unit 3: Stacks, Queues & Recursion
- Stack ADT: Implementation using arrays and linked lists. Applications (Infix to Postfix conversion, Parentheses matching).
- Queue ADT: Linear Queue, Circular Queue, Deque (Double Ended Queue), Priority Queue with heapq.
- Recursion: Base cases, recursion stack trace, tower of hanoi, backtracking.

Unit 4: Non-Linear Data Structures & Sorting
- Trees: Binary Trees, Binary Search Tree (BST) operations (Insert, Search, Delete, In-order/Pre-order/Post-order traversals).
- Graphs: Adjacency Matrix vs Adjacency List, BFS and DFS traversals.
- Searching & Sorting: Linear Search, Binary Search, Bubble Sort, Insertion Sort, Merge Sort, Quick Sort.`
  },
  '26DSAE1': {
    title: '26DSAE1 Digital Sustainability and Green Computing (Syllabus)',
    courseId: '26DSAE1',
    content: `Unit 1: Foundations of Green ICT & Environmental Impact
- Carbon footprint of modern digital technology, life-cycle assessment (LCA) of hardware.
- Embodied carbon vs operational carbon in cloud computing.
- Global climate initiatives, Kyoto Protocol, Paris Agreement, and UN Sustainable Development Goals (SDG 7, 9, 12, 13).

Unit 2: Energy Efficient Data Centers & Cloud Infrastructure
- Power Usage Effectiveness (PUE), Carbon Usage Effectiveness (CUE), Water Usage Effectiveness (WUE).
- Thermal management, liquid cooling, dynamic server provisioning, virtualization benefits.
- Renewable energy integration in hyperscale cloud facilities.

Unit 3: Green Software Engineering & Algorithmic Efficiency
- Software carbon intensity (SCI) specifications.
- Energy-efficient programming: optimizing algorithms, minimizing idle CPU cycles, caching strategies.
- Network data transfer optimization and mobile battery longevity.

Unit 4: E-Waste Management & Circular Economy
- Hazardous substances in electronics (RoHS, WEEE directives).
- Electronic waste collection, recycling techniques, material recovery (precious metals).
- Circular economy principles: repairability, refurbishment, extended producer responsibility (EPR).`
  }
};

export const INITIAL_QUIZZES: Quiz[] = [];

export const INITIAL_ASSIGNMENTS: Assignment[] = [];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    courseId: '26DSC01',
    title: 'Lecture 03: Python Memory Model, Object References & Dynamic Arrays',
    moduleName: 'Unit 1: Foundations & Python Memory',
    uploadedBy: 'Mr. Adarsh V P',
    uploadedAt: '2026-08-18',
    fileType: 'code',
    tags: ['Python', 'Memory Model', 'Lists', 'Dynamic Arrays', 'Time Complexity'],
    content: `Python Memory Management & Data Structure Internals:
1. Everything in Python is an Object:
   - Variables are not memory slots holding raw bytes; they are reference pointers to objects in heap memory.
   - id() returns the memory address of an object.
   - 'is' compares identity (memory addresses); '==' compares values.

2. Dynamic Arrays (list in Python):
   - In C/C++, standard arrays have fixed sizes allocated contiguous in memory.
   - Python's list is a contiguous array of pointers to objects (PyObject* pointers).
   - Growth Strategy: When a list exceeds its allocated capacity, Python allocates a new chunk with formula: new_allocated = (size >> 3) + (size < 9 ? 3 : 6) + size.
   - Elements are copied to the new block and old block is freed.

3. Time Complexity Summary of Python List Operations:
   - Indexing [i]: O(1)
   - Append [val]: O(1) Amortized
   - Pop from end [-1]: O(1)
   - Insert [0, val]: O(N) (Requires shifting all N elements right)
   - Pop from start [0]: O(N) (Requires shifting all elements left; prefer collections.deque for O(1) FIFO queues)
   - Search 'in': O(N)
   - Sort: O(N log N) via Timsort`,
    summary: {
      executiveSummary: 'This lecture covers how Python manages objects in memory via reference pointers, how dynamic lists dynamically resize, and the exact computational time complexity of linear list operations.',
      keyConcepts: [
        {
          term: 'Reference Pointers',
          definition: 'Variables in Python hold memory references (addresses) to PyObject structures located on the heap.',
          importance: 'Understanding reference vs value semantics prevents unexpected mutation bugs when passing lists to functions.',
          exampleOrCommand: 'a = [1, 2]; b = a; b.append(3) # mutates both a and b'
        },
        {
          term: 'Dynamic Array Resizing',
          definition: 'A mechanism where the runtime allocates larger contiguous memory blocks when current capacity is exhausted.',
          importance: 'Ensures average append performance is O(1) while accommodating variable amounts of data.',
          exampleOrCommand: 'list.append() operates in O(1) amortized time.'
        },
        {
          term: 'Timsort',
          definition: 'A hybrid stable sorting algorithm derived from Merge Sort and Insertion Sort used in Python.',
          importance: 'Provides O(N log N) worst-case and O(N) best-case time complexity on real-world partially ordered datasets.',
          exampleOrCommand: 'my_list.sort()'
        }
      ],
      criticalTakeaways: [
        'Python lists store arrays of object pointers, not raw values in-place.',
        'Inserting or deleting at index 0 costs O(N) time; use collections.deque for efficient queues.',
        'Appending to the end is O(1) amortized due to geometric over-allocation.'
      ],
      securityOrDataInsight: 'Optimization Rule: When processing high-frequency data streams, pre-allocate list capacities or leverage NumPy arrays to eliminate Python object reference overhead.',
      quickReviewQuestions: [
        {
          question: 'Why is inserting at index 0 in a Python list O(N)?',
          answer: 'Because all existing N elements must be physically shifted one index to the right in the contiguous pointer array.'
        },
        {
          question: 'Which module should be used when O(1) insertion and deletion at both ends is needed?',
          answer: 'collections.deque (Double-ended Queue).'
        }
      ],
      generatedAt: '2026-08-18 11:15'
    }
  },
  {
    id: 'note-2',
    courseId: '26DSAE1',
    title: 'Lecture 02: Power Usage Effectiveness (PUE) & Data Center Energy Metrics',
    moduleName: 'Unit 2: Green Infrastructure',
    uploadedBy: 'Mrs. Ashmi Saji',
    uploadedAt: '2026-08-19',
    fileType: 'text',
    tags: ['PUE', 'Green Computing', 'Data Centers', 'Energy Efficiency', 'Sustainability'],
    content: `Energy Metrics for Sustainable Computing Infrastructure:
1. Power Usage Effectiveness (PUE):
   Formula: PUE = Total Facility Power / IT Equipment Power
   - Benchmark: PUE = 1.0 (Theoretical Perfection)
   - Industry Average: ~1.55 - 1.60
   - Hyperscale Cloud Centers (Google/AWS/Azure): ~1.10 - 1.15

2. Carbon Usage Effectiveness (CUE):
   Formula: CUE = Total CO2 Equivalent Emissions from Facility Energy / Total IT Equipment Energy (kgCO2eq / kWh)

3. Water Usage Effectiveness (WUE):
   Formula: WUE = Annual Water Usage (liters) / Total IT Equipment Energy (kWh)

4. Strategies for Improving PUE:
   - Hot Aisle / Cold Aisle Containment to prevent warm exhaust air recirculation.
   - Free Cooling (Economizers) utilizing ambient cool outside air or water bodies.
   - Liquid Immersion Cooling for high-density AI/ML server racks.
   - Dynamic Voltage and Frequency Scaling (DVFS) for idle server CPUs.`
  }
];

export const INITIAL_STUDENTS: StudentEngagementProfile[] = [
  {
    id: 'std-101',
    name: 'Sruthi',
    semester: 1,
    attendanceRate: 96,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 94.0,
    engagementScore: 96,
    status: 'Excelling',
    recentActivity: 'Submitted Singly Linked List Lab and Green Computing Report',
    lastActive: '12 mins ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-102',
    name: 'Kailas Krishna P. K.',
    semester: 1,
    attendanceRate: 94,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 92.5,
    engagementScore: 94,
    status: 'Excelling',
    recentActivity: 'Completed Singly Linked List Implementation in Python',
    lastActive: '25 mins ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-103',
    name: 'Sai Sivan',
    semester: 1,
    attendanceRate: 91,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 88.0,
    engagementScore: 89,
    status: 'On Track',
    recentActivity: 'Submitted Data Structures Lab 01',
    lastActive: '1 hour ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-104',
    name: 'Shamil A.',
    semester: 1,
    attendanceRate: 88,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 84.0,
    engagementScore: 85,
    status: 'On Track',
    recentActivity: 'Attempted Python Data Structures Checkpoint Assessment',
    lastActive: '2 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-105',
    name: 'Mohamed Ashmil K.',
    semester: 1,
    attendanceRate: 85,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 78.5,
    engagementScore: 80,
    status: 'On Track',
    recentActivity: 'Reviewed Python memory model and dynamic arrays notes',
    lastActive: '3 hours ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-106',
    name: 'Pranap A. R.',
    semester: 1,
    attendanceRate: 92,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 89.0,
    engagementScore: 91,
    status: 'Excelling',
    recentActivity: 'Completed Green Computing PUE metrics quiz',
    lastActive: '45 mins ago',
    specializationFocus: 'AI Security'
  },
  {
    id: 'std-107',
    name: 'Muhammed Hashim K.',
    semester: 1,
    attendanceRate: 79,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 1,
    averageQuizScore: 72.0,
    engagementScore: 74,
    status: 'Needs Attention',
    recentActivity: 'Practicing singly linked list node insertion algorithms',
    lastActive: '1 day ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-108',
    name: 'Amina Nihala K.',
    semester: 1,
    attendanceRate: 97,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 96.0,
    engagementScore: 97,
    status: 'Excelling',
    recentActivity: 'Tested recursive function stack trace in Python',
    lastActive: '15 mins ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-109',
    name: 'Afnan P.',
    semester: 1,
    attendanceRate: 83,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 79.0,
    engagementScore: 81,
    status: 'On Track',
    recentActivity: 'Reviewed Singly Linked List ADT operations',
    lastActive: '4 hours ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-110',
    name: 'Goutham',
    semester: 1,
    attendanceRate: 89,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 85.5,
    engagementScore: 87,
    status: 'On Track',
    recentActivity: 'Analyzed Big-O time complexity of sorting algorithms',
    lastActive: '2 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-111',
    name: 'Rithu Nanda',
    semester: 1,
    attendanceRate: 95,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 93.0,
    engagementScore: 94,
    status: 'Excelling',
    recentActivity: 'Submitted Python Data Structures Lab 01 report',
    lastActive: '30 mins ago',
    specializationFocus: 'AI Security'
  },
  {
    id: 'std-112',
    name: 'Swathi K.',
    semester: 1,
    attendanceRate: 93,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 90.5,
    engagementScore: 92,
    status: 'Excelling',
    recentActivity: 'Completed Quiz on Green ICT and PUE Formulas',
    lastActive: '1 hour ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-113',
    name: 'Anshid M.',
    semester: 1,
    attendanceRate: 86,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 81.0,
    engagementScore: 83,
    status: 'On Track',
    recentActivity: 'Practiced stack ADT parentheses matching algorithm',
    lastActive: '5 hours ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-114',
    name: 'Muhammed Nihal',
    semester: 1,
    attendanceRate: 82,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 77.0,
    engagementScore: 78,
    status: 'On Track',
    recentActivity: 'Reviewed dynamic array resizing formulas in Python',
    lastActive: '6 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-115',
    name: 'Mohammed Hashique',
    semester: 1,
    attendanceRate: 74,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 1,
    averageQuizScore: 68.0,
    engagementScore: 70,
    status: 'Needs Attention',
    recentActivity: 'Consulted faculty advisory for lab exercise support',
    lastActive: '1 day ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-116',
    name: 'Hisham C.',
    semester: 1,
    attendanceRate: 87,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 83.5,
    engagementScore: 85,
    status: 'On Track',
    recentActivity: 'Implemented Node class and traversal in Python',
    lastActive: '3 hours ago',
    specializationFocus: 'AI Security'
  },
  {
    id: 'std-117',
    name: 'Nandhana',
    semester: 1,
    attendanceRate: 98,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 97.0,
    engagementScore: 98,
    status: 'Excelling',
    recentActivity: 'Submitted Singly Linked List with Unit Tests',
    lastActive: '10 mins ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-118',
    name: 'Mohamed Rinshad',
    semester: 1,
    attendanceRate: 84,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 79.5,
    engagementScore: 81,
    status: 'On Track',
    recentActivity: 'Completed Python Linear Data Structures Quiz',
    lastActive: '4 hours ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-119',
    name: 'Devanarayanan S. P.',
    semester: 1,
    attendanceRate: 91,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 88.5,
    engagementScore: 90,
    status: 'Excelling',
    recentActivity: 'Benchmarked time complexity of linked list vs dynamic list',
    lastActive: '1 hour ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-120',
    name: 'Muhammed Nishad',
    semester: 1,
    attendanceRate: 80,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 75.0,
    engagementScore: 76,
    status: 'On Track',
    recentActivity: 'Practiced double linked list bidirectional pointers',
    lastActive: '7 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-121',
    name: 'Muhammed Rumaiz',
    semester: 1,
    attendanceRate: 77,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 1,
    averageQuizScore: 70.0,
    engagementScore: 72,
    status: 'Needs Attention',
    recentActivity: 'Reviewed lecture notes on PUE and Green Computing',
    lastActive: '1 day ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-122',
    name: 'Hariprasad',
    semester: 1,
    attendanceRate: 90,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 87.0,
    engagementScore: 89,
    status: 'On Track',
    recentActivity: 'Completed Lab 01 test cases on Singly Linked List',
    lastActive: '2 hours ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-123',
    name: 'Athul',
    semester: 1,
    attendanceRate: 85,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 80.0,
    engagementScore: 82,
    status: 'On Track',
    recentActivity: 'Explored recursion stack memory frames in Python',
    lastActive: '4 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-124',
    name: 'Shaheem',
    semester: 1,
    attendanceRate: 88,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 84.0,
    engagementScore: 86,
    status: 'On Track',
    recentActivity: 'Attempted Green Computing foundations assessment',
    lastActive: '3 hours ago',
    specializationFocus: 'AI Security'
  },
  {
    id: 'std-125',
    name: 'Ashique',
    semester: 1,
    attendanceRate: 83,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 78.0,
    engagementScore: 80,
    status: 'On Track',
    recentActivity: 'Studied singly linked list deletion edge cases',
    lastActive: '5 hours ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-126',
    name: 'Hanoon',
    semester: 1,
    attendanceRate: 92,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 89.5,
    engagementScore: 91,
    status: 'Excelling',
    recentActivity: 'Submitted Lab 01 report with recursion trace',
    lastActive: '35 mins ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-127',
    name: 'Muhammed Sinan',
    semester: 1,
    attendanceRate: 87,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 82.0,
    engagementScore: 84,
    status: 'On Track',
    recentActivity: 'Reviewed asymptotic Big-O notations for sorting',
    lastActive: '3 hours ago',
    specializationFocus: 'Threat Intelligence'
  },
  {
    id: 'std-128',
    name: 'Anoop V.',
    semester: 1,
    attendanceRate: 81,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 76.0,
    engagementScore: 77,
    status: 'On Track',
    recentActivity: 'Completed Python Lists & Big-O Quiz',
    lastActive: '6 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-129',
    name: 'Hibha Sherin U.',
    semester: 1,
    attendanceRate: 97,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 95.0,
    engagementScore: 96,
    status: 'Excelling',
    recentActivity: 'Submitted Singly Linked List Lab with O(1) tail optimization',
    lastActive: '20 mins ago',
    specializationFocus: 'AI Security'
  },
  {
    id: 'std-130',
    name: 'Sreejith',
    semester: 1,
    attendanceRate: 90,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 86.0,
    engagementScore: 88,
    status: 'On Track',
    recentActivity: 'Tested queue ADT implementation in Python',
    lastActive: '2 hours ago',
    specializationFocus: 'Cyber Defense'
  },
  {
    id: 'std-131',
    name: 'Gokul V.',
    semester: 1,
    attendanceRate: 88,
    assignmentsSubmittedCount: 1,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 82.5,
    engagementScore: 84,
    status: 'On Track',
    recentActivity: 'Attempted Data Structures Checkpoint Assessment',
    lastActive: '4 hours ago',
    specializationFocus: 'Data Analytics'
  },
  {
    id: 'std-132',
    name: 'Anirudh S.',
    semester: 1,
    attendanceRate: 94,
    assignmentsSubmittedCount: 2,
    totalAssignmentsCount: 2,
    quizzesTakenCount: 2,
    averageQuizScore: 91.0,
    engagementScore: 93,
    status: 'Excelling',
    recentActivity: 'Implemented Node pointers and memory profiling in Python',
    lastActive: '45 mins ago',
    specializationFocus: 'Cyber Defense'
  }
];

export const INITIAL_STUDY_PLAN: StudyPlan = {
  id: 'plan-1',
  courseId: '26DSC01',
  title: '26DSC01: 8-Week Master Study & Hands-On Lab Roadmap',
  targetAudience: 'BCA Cyber Security & Data Science - 1st Semester Cohort',
  totalWeeks: 8,
  prerequisites: ['Basic Python Syntax', 'Computer Fundamentals', 'Logical Thinking'],
  keyToolsFrameworks: ['Python 3.11+', 'Jupyter Notebook', 'VS Code', 'pytest', 'memory_profiler'],
  capstoneProjectIdea: 'Build an Interactive Memory-Visualized Data Structures Toolkit in Python covering Dynamic Arrays, Singly/Doubly Linked Lists, Stacks, Queues, and BST with performance benchmarks.',
  createdAt: '2026-08-18',
  weeks: [
    {
      weekNumber: 1,
      theme: 'Python Memory Model, Object References & Big-O Complexity',
      topics: ['Primitive vs Non-Primitive types', 'Reference semantics & heap allocation', 'Asymptotic analysis (Big-O, Omega, Theta)'],
      learningObjectives: ['Trace Python variable references in memory', 'Compute time and space complexity of code snippets'],
      practicalLabMission: {
        title: 'Lab 1: Memory Profiling & Time Complexity of Python Lists',
        tools: ['Python', 'timeit', 'sys.getsizeof'],
        description: 'Measure the resizing thresholds of Python lists and graph execution time vs input size N.'
      },
      recommendedReadings: ['Guttag: Introduction to Computation and Programming Using Python', 'Python Data Structures Official Documentation'],
      checkpointMilestone: 'Submit Lab 1 report & Complete Quiz 1'
    },
    {
      weekNumber: 2,
      theme: 'Linear Data Structures: Dynamic Arrays & Singly Linked Lists',
      topics: ['Array memory layout', 'Node class architecture', 'Insertion, Deletion, and Traversal in Singly Linked Lists'],
      learningObjectives: ['Implement Singly Linked List from scratch using Python classes', 'Handle boundary edge cases (empty list, single node, deletion at head/tail)'],
      practicalLabMission: {
        title: 'Lab 2: OOP Singly Linked List Implementation',
        tools: ['VS Code', 'Python 3'],
        description: 'Construct a Singly Linked List ADT with prepend, append, delete_by_value, and search methods.'
      },
      recommendedReadings: ['Goodrich, Tamassia: Data Structures and Algorithms in Python (Ch. 7)', 'RealPython: Linked Lists in Python'],
      checkpointMilestone: 'Interactive Linked List test suite passing'
    },
    {
      weekNumber: 3,
      theme: 'Advanced Linked Lists: Doubly & Circular Linked Lists',
      topics: ['Doubly Linked List pointers (prev & next)', 'Circular Linked Lists', 'Applications in memory caching and browser tab history'],
      learningObjectives: ['Implement bidirectional traversal', 'Perform O(1) deletion given node reference in Doubly Linked List'],
      practicalLabMission: {
        title: 'Lab 3: Doubly Linked List with Sentinel Nodes',
        tools: ['Python', 'pytest'],
        description: 'Build a Doubly Linked List with header and trailer sentinel nodes to eliminate special-case edge checks.'
      },
      recommendedReadings: ['Data Structures & Algorithms in Python (Ch. 7.3)', 'CS50 Data Structures Lectures'],
      checkpointMilestone: 'Assignment 1 Submission'
    },
    {
      weekNumber: 4,
      theme: 'Stack ADT & Expression Evaluation',
      topics: ['LIFO principle', 'Stack implementation using lists vs linked nodes', 'Infix to Postfix conversion, Parentheses matching'],
      learningObjectives: ['Solve parsing and evaluation problems using Stack ADT', 'Trace function call stack frames during recursion'],
      practicalLabMission: {
        title: 'Lab 4: Syntax Validator & Arithmetic Expression Evaluator',
        tools: ['Python', 'Jupyter Notebook'],
        description: 'Build an automated balanced bracket checker for source code and evaluate postfix expressions.'
      },
      recommendedReadings: ['Aho, Ullman: Foundations of Computer Science', 'LeetCode Stack Problems Collection'],
      checkpointMilestone: 'Mid-term Checkpoint Assessment'
    }
  ]
};

export const INITIAL_STUDY_PLANS: StudyPlan[] = [INITIAL_STUDY_PLAN];
