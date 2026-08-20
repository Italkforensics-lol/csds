import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  BookOpen, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Copy, 
  Check, 
  FileType, 
  Sparkles, 
  Shield, 
  Code2, 
  Cpu, 
  Binary, 
  Eye, 
  X,
  FileSpreadsheet,
  Bookmark
} from 'lucide-react';
import { Course, StudyPlan, UserRole, StudyMaterialItem } from '../types';
import { INITIAL_SYLLABUS_PRESETS } from '../data/mockData';

interface StudyMaterialsHubProps {
  courses: Course[];
  studyPlans: StudyPlan[];
  role: UserRole;
  onOpenSyllabusAI?: () => void;
}

export const StudyMaterialsHub: React.FC<StudyMaterialsHubProps> = ({
  courses,
  studyPlans,
  role,
  onOpenSyllabusAI,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Preview Modal State
  const [previewMaterial, setPreviewMaterial] = useState<{
    title: string;
    courseCode: string;
    category: string;
    content: string;
    downloadFilename: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setDownloadSuccessToast(msg);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Content copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string, type: 'txt' | 'doc' | 'pdf' | 'md' = 'txt') => {
    let mimeType = 'text/plain';
    let formattedContent = content;

    if (type === 'doc') {
      mimeType = 'application/msword';
      formattedContent = `\uFEFF${content}`;
    } else if (type === 'pdf') {
      mimeType = 'application/pdf';
    } else if (type === 'md') {
      mimeType = 'text/markdown';
    }

    const blob = new Blob([formattedContent], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Downloaded "${filename}" successfully!`);
  };

  // Comprehensive Catalog of Official Course Study Materials
  const defaultMaterials: StudyMaterialItem[] = [
    {
      id: 'mat-syl-26dsc01',
      courseId: '26DSC01',
      title: '26DSC01: Data Structures Using Python — Official Course Syllabus',
      category: 'Official Syllabus',
      format: 'PDF',
      fileSize: '340 KB',
      description: 'Comprehensive 4-credit course syllabus covering Python OOP, memory profiling, Singly/Doubly Linked Lists, Stacks, Queues, Binary Trees, and Asymptotic Complexity.',
      downloadFilename: '26DSC01_Data_Structures_Python_Syllabus.txt',
      uploadedBy: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator)',
      uploadedAt: '2026-08-01',
      tags: ['Data Structures', 'Python', 'OOP', 'Algorithms', 'Syllabus'],
      content: INITIAL_SYLLABUS_PRESETS['26DSC01']?.content || `Unit 1: Introduction to Data Structures & Python OOP Foundations
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

Unit 4: Non-Linear Data Structures (Trees & Binary Search Trees)
- Tree terminologies: Root, leaf, depth, height, degree.
- Binary Trees: Array representation vs Linked node representation.
- Tree Traversals: In-order, Pre-order, Post-order, Level-order (BFS).
- Binary Search Tree (BST): Insertion, Searching, Deletion algorithms, In-order predecessor/successor.

Unit 5: Searching, Sorting & Algorithmic Applications
- Searching: Linear Search vs Binary Search with boundary conditions.
- Sorting: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort (analysis and recurrence relations).
- Real-world cyber security application: Packet header lookup using hash tables, Cryptographic key trees.

Recommended Reference Textbooks:
1. Michael T. Goodrich, Roberto Tamassia, Michael H. Goldwasser - "Data Structures and Algorithms in Python", Wiley.
2. John V. Guttag - "Introduction to Computation and Programming Using Python", MIT Press.`,
    },
    {
      id: 'mat-syl-26dsae1',
      courseId: '26DSAE1',
      title: '26DSAE1: Digital Sustainability and Green Computing — Official Syllabus',
      category: 'Official Syllabus',
      format: 'PDF',
      fileSize: '280 KB',
      description: 'Department curriculum covering data center energy metrics, Power Usage Effectiveness (PUE), Carbon Usage Effectiveness (CUE), e-waste lifecycle, and green cloud architectures.',
      downloadFilename: '26DSAE1_Digital_Sustainability_Green_Computing_Syllabus.txt',
      uploadedBy: 'Mrs. Ashmi Saji (Asst. Prof, Dept of Cyber Forensics)',
      uploadedAt: '2026-08-01',
      tags: ['Green Computing', 'Sustainability', 'PUE', 'E-Waste', 'Forensics'],
      content: INITIAL_SYLLABUS_PRESETS['26DSAE1']?.content || `Unit 1: Foundations of Green Computing & Environmental Footprint
- Carbon footprint of the ICT sector: Hardware manufacturing, operational power, cooling infrastructure.
- Embodied Carbon vs Operational Carbon: Scope 1, Scope 2, and Scope 3 greenhouse gas emissions.
- Global sustainability standards: Greenhouse Gas (GHG) Protocol, ISO 14001, Energy Star rating.

Unit 2: Data Center Energy Metrics & Efficiency Engineering
- Power Usage Effectiveness (PUE): Mathematical formula, target thresholds (ideal 1.0 vs legacy 2.0+).
- Carbon Usage Effectiveness (CUE) and Water Usage Effectiveness (WUE).
- Cooling architectures: Free-air economizers, liquid immersion cooling, hot/cold aisle containment.

Unit 3: Energy-Aware Software & Green Code Optimization
- Algorithmic energy efficiency: Computational complexity vs CPU thermal wattage.
- Dynamic Voltage and Frequency Scaling (DVFS), CPU sleep states (C-states/P-states).
- Green Cloud computing: Server virtualization, containerization, intelligent workload consolidation.

Unit 4: E-Waste Management, Circular Economy & Digital Forensics
- E-waste lifecycle: Toxic components (Lead, Cadmium, Mercury, BFRs), safe recycling practices.
- Extended Producer Responsibility (EPR) regulations in India (E-Waste Rules 2022).
- Forensic data sanitization vs hardware destruction (NIST SP 800-88 standards for secure media sanitization).

Unit 5: Sustainable AI, Green Data Science & Policy Frameworks
- Energy consumption of Large Language Models and deep neural networks during training vs inference.
- Edge AI vs centralized cloud inference: Energy trade-off analysis.
- National and international green IT policies and corporate sustainability reports.

Recommended Reference Textbooks:
1. Jason Harris - "Green Computing and Green IT Best Practice", Emereo Publishing.
2. Bud E. Smith - "Green Computing: Tools and Techniques for Saving Energy, Money, and Resources", CRC Press.`,
    },
    {
      id: 'mat-syl-26dsdt1',
      courseId: '26DSDT1',
      title: '26DSDT1: Design Thinking & Problem Solving — Official Syllabus',
      category: 'Official Syllabus',
      format: 'PDF',
      fileSize: '260 KB',
      description: 'Framework covering the 5 phases of Design Thinking (Empathize, Define, Ideate, Prototype, Test) applied to Cyber Security and Data Science user experiences.',
      downloadFilename: '26DSDT1_Design_Thinking_Syllabus.txt',
      uploadedBy: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator)',
      uploadedAt: '2026-08-01',
      tags: ['Design Thinking', 'Problem Solving', 'UX', 'Cyber Security'],
      content: INITIAL_SYLLABUS_PRESETS['26DSDT1']?.content || `Unit 1: Introduction to Design Thinking & Human-Centered Mindset
- Principles of Design Thinking: User empathy, bias toward action, radical collaboration, iterative prototyping.
- Divergent vs Convergent thinking in technical problem solving.
- Double Diamond design framework (Discover, Define, Develop, Deliver).

Unit 2: Empathize & Discover
- User research methodologies: Empathy interviews, immersive observation, shadowing, surveys.
- Developing Empathy Maps (Says, Thinks, Does, Feels).
- User persona creation and Journey Mapping in security and data workflows.

Unit 3: Define (Point of View & Problem Statements)
- Synthesizing qualitative and quantitative research findings.
- Formulating actionable "How Might We" (HMW) questions.
- Crafting user-centric Problem Statements (User + Need + Insight).

Unit 4: Ideate & Prototype
- Brainstorming techniques: Worst Possible Idea, SCAMPER, Crazy Eights, Mind Mapping.
- Low-fidelity vs High-fidelity prototyping in software and cyber tools.
- Paper prototyping, wireframing, interactive CLI/UI mockups for security tools.

Unit 5: Testing, Iteration & Cyber Defense Case Studies
- Usability testing protocols, heuristic evaluation, collecting actionable user feedback.
- Case Study 1: Designing an intuitive SIEM alert triage dashboard for junior SOC analysts.
- Case Study 2: Designing accessible 2FA/MFA authentication flows for non-technical enterprise employees.

Recommended Reference Textbooks:
1. Tim Brown - "Change by Design: How Design Thinking Transforms Organizations", HarperBusiness.
2. Idris Mootee - "Design Thinking for Strategic Innovation", Wiley.`,
    },
    {
      id: 'mat-syl-26dscp1',
      courseId: '26DSCP1',
      title: '26DSCP1: Python Data Structures Lab Manual & Experiments List',
      category: 'Lab Manual',
      format: 'DOC',
      fileSize: '410 KB',
      description: 'Comprehensive 12-experiment laboratory manual with code stubs, expected input/output test cases, and memory profiling tasks.',
      downloadFilename: '26DSCP1_Python_Data_Structures_Lab_Manual.txt',
      uploadedBy: 'Mr. Adarsh V P (Asst. Prof & Co-ordinator)',
      uploadedAt: '2026-08-05',
      tags: ['Lab Manual', 'Python', 'Data Structures', 'Experiments'],
      content: `BCA CYBER SECURITY & DATA SCIENCE — SEMESTER 1
COURSE CODE: 26DSCP1 — DATA STRUCTURES USING PYTHON LAB MANUAL

List of Prescribed Practical Experiments:

Experiment 1: Python Memory Mutability & Complexity Profiler
- Objective: Write a Python program to profile memory addresses using id(), track variable references, and benchmark execution time using the timeit and sys modules.

Experiment 2: Dynamic Array Resizing Simulation
- Objective: Implement a CustomArray ADT with dynamic resizing (geometric growth strategy) and benchmark amortized insertion cost vs standard Python list.

Experiment 3: Singly Linked List ADT Implementation
- Objective: Implement Node and SinglyLinkedList classes with operations: insert_at_beginning, insert_at_end, delete_node, search_value, and reverse_list.

Experiment 4: Doubly Linked List with Sentinel Guard Nodes
- Objective: Implement a Doubly Linked List utilizing header and trailer sentinel nodes to eliminate extremity edge conditions during node insertion and deletion.

Experiment 5: Stack ADT & Balanced Parentheses Evaluator
- Objective: Implement a Stack using a singly linked list. Utilize it to parse source code strings and validate matching brackets ((), {}, []).

Experiment 6: Infix to Postfix Conversion & Expression Tree Evaluator
- Objective: Convert mathematical infix expressions into postfix notation using operator precedence and evaluate the resulting postfix stack.

Experiment 7: Circular Queue for Task Scheduling Simulation
- Objective: Implement a fixed-capacity Circular Queue ADT with enqueue, dequeue, is_empty, and is_full methods to simulate a Round-Robin CPU scheduler.

Experiment 8: Double-Ended Queue (Deque) for Palindrome Verification
- Objective: Construct a Deque ADT and implement a high-efficiency palindrome checking function.

Experiment 9: Binary Search Tree (BST) Construction & Recursive Traversals
- Objective: Implement BST node insertion, search, and the three standard depth-first traversals (Pre-order, In-order, Post-order).

Experiment 10: Algorithmic Sorting Benchmark
- Objective: Implement Bubble Sort, Insertion Sort, Merge Sort, and Quick Sort in Python. Generate random integer arrays of size N = [100, 1000, 5000, 10000] and graph execution time vs N.

Experiment 11: Binary Search with Boundary Indexing
- Objective: Implement iterative and recursive Binary Search algorithms on sorted dataset. Handle duplicate key edge cases.

Experiment 12: Capstone Mini-Project: Packet Header Lookup Hash Table
- Objective: Implement a Chained Hash Table ADT with custom hash function to store and search network packet IP metadata in O(1) expected time.`,
    },
    {
      id: 'mat-cs-python-cheat',
      courseId: '26DSC01',
      title: 'Python OOP & Asymptotic Complexity Quick Reference Cheatsheet',
      category: 'Lecture Cheat Sheet',
      format: 'DOC',
      fileSize: '190 KB',
      description: 'Compact 2-page revision cheat sheet summarizing Big-O time/space bounds for all core data structures and Python CPython internal memory rules.',
      downloadFilename: 'Python_OOP_Complexity_Cheatsheet.txt',
      uploadedBy: 'Mr. Adarsh V P (Asst. Prof)',
      uploadedAt: '2026-08-10',
      tags: ['Cheatsheet', 'Big-O', 'Python', 'Exam Prep'],
      content: `DATA STRUCTURES & ALGORITHMS QUICK REFERENCE CHEATSHEET
Department of BCA Cyber Security with Data Science

1. Asymptotic Complexity Reference Table:
--------------------------------------------------------------------------------------
Data Structure            | Access     | Search     | Insertion  | Deletion   | Space
--------------------------------------------------------------------------------------
Dynamic Array (Python list)| O(1)       | O(N)       | O(1)* amort| O(N)       | O(N)
Singly Linked List         | O(N)       | O(N)       | O(1) head  | O(1) head  | O(N)
Doubly Linked List         | O(N)       | O(N)       | O(1) h/t   | O(1) node  | O(N)
Stack (Array / List)       | O(N)       | O(N)       | O(1) push  | O(1) pop   | O(N)
Queue (Deque)              | O(N)       | O(N)       | O(1) enq   | O(1) deq   | O(N)
Binary Search Tree (Avg)   | O(log N)   | O(log N)   | O(log N)   | O(log N)   | O(N)
Binary Search Tree (Worst) | O(N)       | O(N)       | O(N)       | O(N)       | O(N)
Hash Table (Dictionary)    | N/A        | O(1) avg   | O(1) avg   | O(1) avg   | O(N)
--------------------------------------------------------------------------------------

2. Python Memory Rules:
- Immutable Types: int, float, bool, str, tuple, frozenset (Modifying creates a new object in memory).
- Mutable Types: list, dict, set, bytearray, user-defined class instances (Modified in-place).
- 'is' operator checks memory reference equality (id(a) == id(b)).
- '==' operator checks value/content equality.

3. Python List Growth Pattern (CPython):
- When capacity exceeded: new_capacity = (size + (size >> 3) + 6) & ~3
- Guarantees O(1) amortized time per append operation despite occasional O(N) reallocation.`,
    },
    {
      id: 'mat-cs-green-calc',
      courseId: '26DSAE1',
      title: 'Data Center PUE Calculation & Carbon Audit Formula Workbook',
      category: 'Exam Reference',
      format: 'DOC',
      fileSize: '210 KB',
      description: 'Step-by-step mathematical guide and problem walkthroughs for PUE, CUE, WUE, and Scope 1/2/3 carbon calculations.',
      downloadFilename: 'PUE_Carbon_Audit_Formulas.txt',
      uploadedBy: 'Mrs. Ashmi Saji (Asst. Prof)',
      uploadedAt: '2026-08-12',
      tags: ['PUE', 'Formulas', 'Green IT', 'Audit Guide'],
      content: `DIGITAL SUSTAINABILITY & GREEN COMPUTING FORMULA HANDBOOK

1. Power Usage Effectiveness (PUE):
   PUE = Total Facility Energy / IT Equipment Energy
   - Ideal PUE = 1.0 (100% power utilized by computing hardware, zero cooling overhead)
   - Industry Average = 1.55 - 1.80
   - Modern Hyperscale Green Data Centers (Google, AWS) = 1.10 - 1.15

2. Data Center Infrastructure Efficiency (DCiE):
   DCiE = (IT Equipment Energy / Total Facility Energy) * 100% = (1 / PUE) * 100%

3. Carbon Usage Effectiveness (CUE):
   CUE = Total CO2 Emissions from Facility Energy (kg CO2eq) / IT Equipment Energy (kWh)

4. Water Usage Effectiveness (WUE):
   WUE = Annual Site Water Usage (Liters) / IT Equipment Energy (kWh)

5. Solved Example:
   Facility Total Energy = 1,200,000 kWh / month
   Servers + Network IT Power = 800,000 kWh / month
   Cooling + Lighting Overhead = 400,000 kWh / month

   Calculation:
   PUE = 1,200,000 / 800,000 = 1.50
   DCiE = (800,000 / 1,200,000) * 100% = 66.67%
   Overhead Energy Ratio = 33.33%`,
    }
  ];

  // Merge default study materials with study plans generated by faculty
  const formattedStudyPlansAsMaterials: StudyMaterialItem[] = studyPlans.map((plan) => ({
    id: `mat-plan-${plan.id}`,
    courseId: plan.courseId,
    title: plan.title,
    category: 'Study Roadmap',
    format: 'Markdown',
    fileSize: `${Math.max(12, plan.weeks.length * 4)} KB`,
    description: `${plan.totalWeeks}-week structured laboratory roadmap with weekly learning objectives, tools (${plan.keyToolsFrameworks.slice(0, 3).join(', ')}), and capstone project milestone.`,
    downloadFilename: `${plan.title.replace(/[^a-zA-Z0-9]/g, '_')}_Roadmap.md`,
    uploadedBy: 'Faculty AI Curriculum Studio',
    uploadedAt: plan.createdAt,
    tags: ['Study Plan', 'Weekly Roadmap', 'Lab Tasks', 'Capstone'],
    content: `# ${plan.title}
Target Audience: ${plan.targetAudience}
Duration: ${plan.totalWeeks} Weeks
Prerequisites: ${plan.prerequisites.join(', ')}
Key Frameworks & Tools: ${plan.keyToolsFrameworks.join(', ')}

## Capstone Project Blueprint:
${plan.capstoneProjectIdea}

---

## Weekly Curriculum & Laboratory Roadmaps:

${plan.weeks.map((w) => `### Week ${w.weekNumber}: ${w.theme}
- **Topics Covered:** ${w.topics.join(', ')}
- **Core Objectives:** ${w.learningObjectives.join('; ')}
- **Practical Lab Mission:** ${w.practicalLabMission.title}
  * Tools: ${w.practicalLabMission.tools.join(', ')}
  * Brief: ${w.practicalLabMission.description}
- **Recommended Readings:** ${w.recommendedReadings.join('; ')}
- **Checkpoint Milestone:** ${w.checkpointMilestone}
`).join('\n\n')}`,
  }));

  const allMaterials = [...defaultMaterials, ...formattedStudyPlansAsMaterials];

  const filteredMaterials = allMaterials.filter((item) => {
    const matchesCourse = selectedCourseFilter === 'all' || item.courseId === selectedCourseFilter;
    const matchesCategory = selectedCategoryFilter === 'all' || item.category === selectedCategoryFilter;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Banner */}
      {downloadSuccessToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Study Materials &amp; Curriculum Repository
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Direct Download Hub
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Access and download official Semester 1 syllabi, structured multi-week laboratory roadmaps, lecture cheatsheets, and reference manuals in Word (.doc), PDF, and Markdown formats.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {role === 'faculty' && onOpenSyllabusAI && (
              <button
                onClick={onOpenSyllabusAI}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm shadow-sky-200 transition transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Study Plan with AI +</span>
              </button>
            )}

            {role === 'student' && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student Download Access Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search syllabus units, roadmaps, lab manuals, cheat sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Subject Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Subjects ({allMaterials.length} Items)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Official Syllabus">Official Syllabi</option>
              <option value="Study Roadmap">Study Roadmaps</option>
              <option value="Lab Manual">Lab Manuals</option>
              <option value="Lecture Cheat Sheet">Lecture Cheat Sheets</option>
              <option value="Exam Reference">Exam References</option>
            </select>
          </div>

        </div>

        {/* Quick Tags Bar */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Quick Filters:</span>
          {['Python Data Structures', 'Green Computing', 'Design Thinking', 'Lab Manual', 'Study Roadmap'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(searchQuery === tag ? '' : tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                searchQuery === tag
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tag}
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-rose-600 hover:underline ml-auto"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No study materials matched your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your subject or category filters to view all available department resources.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => {
            const course = courses.find((c) => c.id === item.courseId);
            const isDoc = item.format === 'DOC';
            const isPdf = item.format === 'PDF';
            const isMd = item.format === 'Markdown';

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {course?.code || 'CSDS'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.category === 'Official Syllabus' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      item.category === 'Study Roadmap' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      item.category === 'Lab Manual' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Metadata Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {item.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-medium">
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 font-mono ml-auto">
                      {item.fileSize}
                    </span>
                  </div>

                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  
                  {/* Preview Button */}
                  <button
                    onClick={() => setPreviewMaterial({
                      title: item.title,
                      courseCode: course?.code || 'CSDS',
                      category: item.category,
                      content: item.content,
                      downloadFilename: item.downloadFilename,
                    })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {/* Quick Download Button (DOC / Text) */}
                  <button
                    onClick={() => handleDownloadFile(item.downloadFilename, item.content, 'doc')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition transform active:scale-95"
                    title={`Download ${item.downloadFilename}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* FULL-SCREEN DOCUMENT PREVIEW MODAL */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {previewMaterial.courseCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {previewMaterial.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  {previewMaterial.title}
                </h3>
              </div>

              <button
                onClick={() => setPreviewMaterial(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
              {previewMaterial.content}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Department of BCA Cyber Security with Data Science
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyContent(previewMaterial.content, 'modal')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  {copiedId === 'modal' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId === 'modal' ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={() => handleDownloadFile(previewMaterial.downloadFilename, previewMaterial.content, 'doc')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Document (.doc / .txt)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
