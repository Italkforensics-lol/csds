export interface Course {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  instructor: string;
  description: string;
  category: 'Core 1' | 'Core 1 Practical' | 'SECC 1' | 'AECC 1' | 'AECC 2' | 'SEC' | 'Cyber Security' | 'Data Science' | 'Core Computer Science';
  enrolledStudentsCount: number;
  icon?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topicTag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  questions: QuizQuestion[];
  createdAt: string;
  dueDate: string;
  isPublished: boolean;
  generatedByAI?: boolean;
  createdBy?: string;
  attemptsCount: number;
  averageScore?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  score: number;
  totalScore: number;
  percentage: number;
  completedAt: string;
  answers: { [questionId: string]: number };
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  studentRoll?: string;
  submittedAt: string;
  status: 'Submitted' | 'Late' | 'Graded' | 'Pending Review';
  content: string;
  fileAttachment?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string; // 'pdf' | 'doc' | 'docx'
  fileDataUrl?: string; // Base64 data URL for preview/download
  grade?: number;
  maxGrade: number;
  feedback?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  objectives: string[];
  starterFilesUrl?: string;
  dueDate: string;
  totalPoints: number;
  submissionType: string;
  allowedFormats?: string[]; // e.g. ['.pdf', '.doc', '.docx']
  createdAt: string;
  createdBy?: string;
  submissions: AssignmentSubmission[];
}

export interface NoteItem {
  id: string;
  courseId: string;
  title: string;
  moduleName: string;
  uploadedBy: string;
  uploadedAt: string;
  content: string;
  tags: string[];
  fileType: 'doc' | 'pdf' | 'code' | 'text';
  summary?: NoteSummary;
}

export interface NoteSummary {
  executiveSummary: string;
  keyConcepts: {
    term: string;
    definition: string;
    importance: string;
    exampleOrCommand?: string;
  }[];
  criticalTakeaways: string[];
  securityOrDataInsight: string;
  quickReviewQuestions: {
    question: string;
    answer: string;
  }[];
  generatedAt: string;
}

export interface StudyPlanWeek {
  weekNumber: number;
  theme: string;
  topics: string[];
  learningObjectives: string[];
  practicalLabMission: {
    title: string;
    tools: string[];
    description: string;
  };
  recommendedReadings: string[];
  checkpointMilestone: string;
}

export interface StudyPlan {
  id: string;
  courseId: string;
  title: string;
  targetAudience: string;
  totalWeeks: number;
  prerequisites: string[];
  weeks: StudyPlanWeek[];
  keyToolsFrameworks: string[];
  capstoneProjectIdea: string;
  createdAt: string;
}

export interface StudentEngagementProfile {
  id: string;
  name: string;
  rollNo?: string;
  email?: string;
  semester: number;
  attendanceRate: number; // 0-100
  assignmentsSubmittedCount: number;
  totalAssignmentsCount: number;
  quizzesTakenCount: number;
  averageQuizScore: number;
  engagementScore: number; // 0-100 calculated
  status: 'Excelling' | 'On Track' | 'Needs Attention' | 'At Risk';
  recentActivity: string;
  lastActive: string;
  specializationFocus: 'Cyber Defense' | 'Data Analytics' | 'Threat Intelligence' | 'AI Security';
}

export interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  coursesAssigned: string[];
  avatarUrl?: string;
}

export interface ClubLeader {
  name: string;
  role: string;
  semester: string;
  specialty: string;
  githubOrLinkedin?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  type: 'CTF Competition' | 'Hands-on Workshop' | 'Guest Lecture' | 'Hackathon' | 'Research Seminar' | 'Coding Competition' | 'Department Orientation';
  location: string;
  speakerOrHost: string;
  status: 'Upcoming' | 'Live Now' | 'Completed';
  attendeesCount: number;
  description: string;
  tags: string[];
}

export interface ClubProject {
  id: string;
  title: string;
  description: string;
  category: 'Security Tooling' | 'AI Threat Model' | 'Cryptanalysis' | 'Forensics Script' | 'Educational Tool' | 'Sustainability Tool';
  leads: string[];
  githubUrl?: string;
  starsOrForks: string;
  status: 'Active' | 'Beta' | 'Published';
}

export interface CTFChallenge {
  id: string;
  title: string;
  category: 'Cryptography' | 'Web Exploitation' | 'Reverse Engineering' | 'Forensics' | 'Network Defense' | 'Data Structures' | 'Algorithms' | 'Sustainability';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  points: number;
  solvesCount: number;
  description: string;
  flagHint: string;
}

export interface ClubApplication {
  id: string;
  studentName: string;
  studentRoll: string;
  email: string;
  semester: number;
  wing: 'Red Teaming & CTF' | 'Blue Team SOC & SIEM' | 'AI Security & Threat Intel' | 'Digital Forensics & Green IT' | 'Open-Source Dev' | 'Executive Coordinator';
  skillsAndTools: string;
  githubOrPortfolio?: string;
  statementOfPurpose: string;
  proposedProjectIdea?: string;
  submittedAt: string;
  status: 'Pending Review' | 'Approved' | 'Shortlisted for Interview' | 'Declined';
  reviewedBy?: string;
  facultyFeedback?: string;
}

export interface StudyMaterialItem {
  id: string;
  courseId: string;
  title: string;
  category: 'Official Syllabus' | 'Study Roadmap' | 'Lecture Cheat Sheet' | 'Lab Manual' | 'Exam Reference';
  format: 'PDF' | 'DOC' | 'TXT' | 'Markdown';
  fileSize: string;
  description: string;
  content: string;
  downloadFilename: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export type ViewTab = 
  | 'overview'
  | 'syllabus-ai'
  | 'assignments'
  | 'quizzes'
  | 'notes'
  | 'study-materials'
  | 'engagement'
  | 'anonymous-lab';

export type UserRole = 'faculty' | 'student';
