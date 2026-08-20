import React, { useState, useEffect } from 'react';
import { 
  Course, 
  Quiz, 
  Assignment, 
  NoteItem, 
  StudyPlan, 
  StudentEngagementProfile, 
  UserRole,
  AssignmentSubmission,
  NoteSummary,
  FacultyProfile 
} from './types';
import { 
  INITIAL_COURSES, 
  INITIAL_QUIZZES, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_NOTES, 
  INITIAL_STUDY_PLANS, 
  INITIAL_STUDENTS,
  DEFAULT_FACULTY_ACCOUNTS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { SyllabusAIGenerator } from './components/SyllabusAIGenerator';
import { NoteSummarizer } from './components/NoteSummarizer';
import { AssignmentsManager } from './components/AssignmentsManager';
import { QuizHub } from './components/QuizHub';
import { EngagementTracker } from './components/EngagementTracker';
import { AIConceptTutorModal } from './components/AIConceptTutorModal';
import { FacultyLoginModal } from './components/FacultyLoginModal';
import { AnonymousLabSection } from './components/AnonymousLabSection';
import { StudyMaterialsHub } from './components/StudyMaterialsHub';
import { ClubApplication } from './types';

export default function App() {
  // Faculty Authentication & Role State
  const [activeFaculty, setActiveFaculty] = useState<FacultyProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bca_csds_auth_faculty_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.error('Failed to load faculty auth state', e);
    }
    return DEFAULT_FACULTY_ACCOUNTS[0]; // Active default faculty: Mr. Adarsh V P
  });

  const [role, setRole] = useState<UserRole>('faculty');
  const [isFacultyLoginOpen, setIsFacultyLoginOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  // Application Data Stores with LocalStorage persistence
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem('bca_csds_quizzes_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load quizzes from localStorage', e);
    }
    return INITIAL_QUIZZES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bca_csds_quizzes_v2', JSON.stringify(quizzes));
    } catch (e) {
      console.error('Failed to persist quizzes', e);
    }
  }, [quizzes]);

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem('bca_csds_assignments_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load assignments from localStorage', e);
    }
    return INITIAL_ASSIGNMENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bca_csds_assignments_v2', JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to persist assignments', e);
    }
  }, [assignments]);

  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(INITIAL_STUDY_PLANS);

  // Club Applications State with LocalStorage persistence
  const [clubApplications, setClubApplications] = useState<ClubApplication[]>(() => {
    try {
      const saved = localStorage.getItem('bca_csds_club_apps_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load club applications from localStorage', e);
    }
    return [
      {
        id: 'app-cx-001',
        studentName: 'Sruthi',
        studentRoll: 'CSDS-2026-001',
        email: 'sruthi.csds@bca.edu',
        semester: 1,
        wing: 'Red Teaming & CTF',
        skillsAndTools: 'Python, Linux CLI, Wireshark, Cryptography',
        githubOrPortfolio: 'https://github.com/sruthi-cyber',
        statementOfPurpose: 'Passionate about packet analysis, ethical hacking, and competing in national university CTF leagues.',
        proposedProjectIdea: 'Python memory profiler & packet anomaly analyzer for campus labs.',
        submittedAt: '2026-08-15 10:30',
        status: 'Approved',
        reviewedBy: 'Mr. Adarsh V P (Faculty Coordinator)',
        facultyFeedback: 'Welcome to the Cipher X Red Teaming Wing!'
      },
      {
        id: 'app-cx-002',
        studentName: 'Aarav Nair',
        studentRoll: 'CSDS-2026-002',
        email: 'aarav.nair@bca.edu',
        semester: 1,
        wing: 'Blue Team SOC & SIEM',
        skillsAndTools: 'Elasticsearch, Suricata, Python, Log Analysis',
        githubOrPortfolio: 'https://github.com/aarav-soc',
        statementOfPurpose: 'Want to specialize in SIEM engineering, rule tuning, and incident response.',
        proposedProjectIdea: 'Real-time syslog parser & threat score calculator.',
        submittedAt: '2026-08-16 14:15',
        status: 'Pending Review',
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('bca_csds_club_apps_v2', JSON.stringify(clubApplications));
    } catch (e) {
      console.error('Failed to persist club applications', e);
    }
  }, [clubApplications]);

  const handleAddClubApplication = (newApp: ClubApplication) => {
    setClubApplications((prev) => [newApp, ...prev]);
  };

  const handleUpdateClubApplicationStatus = (
    appId: string,
    status: ClubApplication['status'],
    feedback?: string
  ) => {
    setClubApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status,
              facultyFeedback: feedback || app.facultyFeedback,
              reviewedBy: activeFaculty ? activeFaculty.name : 'Faculty Lead',
            }
          : app
      )
    );
  };
  
  // Student Roster with LocalStorage caching
  const [students, setStudents] = useState<StudentEngagementProfile[]>(() => {
    try {
      const saved = localStorage.getItem('bca_csds_students_roster_sem1_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 30) return parsed;
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return INITIAL_STUDENTS;
  });

  // Sync students to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bca_csds_students_roster_sem1_v1', JSON.stringify(students));
    } catch (e) {
      console.error('Failed to persist students to localStorage', e);
    }
  }, [students]);

  // Role Switch Handler with Faculty Authentication Guard
  const handleRoleChange = (newRole: UserRole) => {
    if (newRole === 'faculty') {
      if (!activeFaculty) {
        setIsFacultyLoginOpen(true);
        return;
      }
      setRole('faculty');
    } else {
      setRole('student');
    }
  };

  const handleFacultyLoginSuccess = (faculty: FacultyProfile) => {
    setActiveFaculty(faculty);
    setRole('faculty');
    setIsFacultyLoginOpen(false);
  };

  const handleFacultyLogout = () => {
    try {
      localStorage.removeItem('bca_csds_auth_faculty_v1');
    } catch {
      // ignore
    }
    setActiveFaculty(null);
    setRole('student');
    if (currentTab === 'syllabus-ai') {
      setCurrentTab('overview');
    }
  };

  // AI Tutor Modal
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);

  // Handlers for Syllabus AI Output
  const handleSaveGeneratedQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleSaveGeneratedPlan = (newPlan: StudyPlan) => {
    setStudyPlans((prev) => [newPlan, ...prev]);
  };

  // Handlers for Notes
  const handleAddNote = (newNote: NoteItem) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleUpdateNoteSummary = (noteId: string, summary: NoteSummary) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, summary } : n))
    );
  };

  // Handlers for Assignments
  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleDeleteAssignment = (asgId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== asgId));
  };

  const handleSubmitAssignment = (newSub: AssignmentSubmission) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === newSub.assignmentId) {
          return {
            ...asg,
            submissions: [newSub, ...asg.submissions],
          };
        }
        return asg;
      })
    );
  };

  const handleGradeSubmission = (
    assignmentId: string,
    submissionId: string,
    grade: number,
    feedback: string
  ) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            submissions: asg.submissions.map((s) =>
              s.id === submissionId
                ? { ...s, grade, feedback, status: 'Graded' }
                : s
            ),
          };
        }
        return asg;
      })
    );
  };

  const handleAddQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => [newQuiz, ...prev]);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  // Handlers for Student List Management
  const handleAddStudent = (newStudent: StudentEngagementProfile) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: StudentEngagementProfile) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleBulkImportStudents = (
    importedStudents: StudentEngagementProfile[],
    mode: 'append' | 'replace'
  ) => {
    if (mode === 'replace') {
      setStudents(importedStudents);
    } else {
      setStudents((prev) => {
        const existingRolls = new Set(prev.map((s) => s.rollNo.toUpperCase()));
        const filteredNew = importedStudents.filter(
          (s) => !existingRolls.has(s.rollNo.toUpperCase())
        );
        return [...filteredNew, ...prev];
      });
    }
  };

  const handleResetDefaultStudents = () => {
    setStudents(INITIAL_STUDENTS);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <Navbar
        role={role}
        onRoleChange={handleRoleChange}
        activeFaculty={activeFaculty}
        onOpenFacultyLogin={() => setIsFacultyLoginOpen(true)}
        onFacultyLogout={handleFacultyLogout}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        onOpenAITutor={() => setIsAITutorOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          role={role}
          activeFaculty={activeFaculty}
          onOpenFacultyLogin={() => setIsFacultyLoginOpen(true)}
          counts={{
            assignments: assignments.length,
            quizzes: quizzes.length,
            notes: notes.length,
            studyPlans: studyPlans.length,
          }}
        />

        {/* Dynamic Main View */}
        <main className="flex-1 min-w-0">
          {currentTab === 'overview' && (
            <DashboardOverview
              courses={courses}
              quizzes={quizzes}
              assignments={assignments}
              notes={notes}
              students={students}
              role={role}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenAITutor={() => setIsAITutorOpen(true)}
            />
          )}

          {currentTab === 'syllabus-ai' && (
            <SyllabusAIGenerator
              courses={courses}
              onSaveGeneratedQuiz={handleSaveGeneratedQuiz}
              onSaveGeneratedPlan={handleSaveGeneratedPlan}
              activeStudyPlans={studyPlans}
            />
          )}

          {currentTab === 'notes' && (
            <NoteSummarizer
              notes={notes}
              courses={courses}
              onAddNote={handleAddNote}
              onUpdateNoteSummary={handleUpdateNoteSummary}
              role={role}
            />
          )}

          {currentTab === 'assignments' && (
            <AssignmentsManager
              assignments={assignments}
              courses={courses}
              onAddAssignment={handleAddAssignment}
              onSubmitAssignment={handleSubmitAssignment}
              onGradeSubmission={handleGradeSubmission}
              onDeleteAssignment={handleDeleteAssignment}
              role={role}
              students={students}
              activeFaculty={activeFaculty}
            />
          )}

          {currentTab === 'quizzes' && (
            <QuizHub
              quizzes={quizzes}
              courses={courses}
              onOpenSyllabusAI={() => setCurrentTab('syllabus-ai')}
              onAddQuiz={handleAddQuiz}
              onDeleteQuiz={handleDeleteQuiz}
              role={role}
            />
          )}

          {currentTab === 'study-materials' && (
            <StudyMaterialsHub
              role={role}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'engagement' && (
            <EngagementTracker
              students={students}
              role={role}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onBulkImportStudents={handleBulkImportStudents}
              onResetDefaultStudents={handleResetDefaultStudents}
            />
          )}

          {currentTab === 'anonymous-lab' && (
            <AnonymousLabSection
              role={role}
              applications={clubApplications}
              onAddApplication={handleAddClubApplication}
              onUpdateApplicationStatus={handleUpdateClubApplicationStatus}
              onOpenAITutor={() => setIsAITutorOpen(true)}
            />
          )}
        </main>

      </div>

      {/* AI Concept Tutor Modal */}
      <AIConceptTutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
      />

      {/* Faculty Login Modal */}
      <FacultyLoginModal
        isOpen={isFacultyLoginOpen}
        onClose={() => setIsFacultyLoginOpen(false)}
        onLoginSuccess={handleFacultyLoginSuccess}
      />

    </div>
  );
}
