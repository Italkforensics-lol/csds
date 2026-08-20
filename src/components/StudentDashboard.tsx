import React from 'react';
import { 
  FileText, 
  HelpCircle, 
  Download, 
  BookMarked, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ArrowRight,
  Shield, 
  Lock,
  Layers,
  Award,
  AlertCircle,
  FolderDown
} from 'lucide-react';
import { Course, Assignment, Quiz, NoteItem, ClubApplication } from '../types';

interface StudentDashboardProps {
  courses: Course[];
  assignments: Assignment[];
  quizzes: Quiz[];
  notes: NoteItem[];
  clubApplications: ClubApplication[];
  onNavigate: (tab: string) => void;
  onOpenAITutor: () => void;
  studentName?: string;
  studentRoll?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  courses,
  assignments,
  quizzes,
  notes,
  clubApplications,
  onNavigate,
  onOpenAITutor,
  studentName = 'Sruthi',
  studentRoll = 'CSDS-2026-001'
}) => {
  // Compute student-specific metrics
  const mySubmissions = assignments.flatMap(a => 
    a.submissions.filter(s => s.studentName.toLowerCase().includes(studentName.toLowerCase()) || s.studentRoll === studentRoll)
  );
  
  const pendingAssignments = assignments.filter(a => 
    !a.submissions.some(s => s.studentName.toLowerCase().includes(studentName.toLowerCase()) || s.studentRoll === studentRoll)
  );

  const myApplication = clubApplications.find(
    app => app.studentRoll === studentRoll || app.studentName.toLowerCase().includes(studentName.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Student Welcome & Identity Header */}
      <header className="bg-gradient-to-r from-[#0f172a] via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Student Academic Space</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">Roll: {studentRoll}</span>
              <span className="text-xs text-slate-500">&bull; Semester 1 (Batch 2026)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {studentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              BCA Cyber Security with Data Science. You have full student access to upload assignments, take timed assessments, download study materials, summarize lecture notes, and collaborate in Cipher X club.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={onOpenAITutor}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Ask AI Tutor</span>
            </button>

            <button
              onClick={() => onNavigate('assignments')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/30 transition transform active:scale-95 whitespace-nowrap"
            >
              <span>Upload Assignment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Student Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              My Submissions
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-white">{mySubmissions.length}</span>
              <span className="text-[11px] text-emerald-400 font-medium">/{assignments.length} Total</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {pendingAssignments.length > 0 ? `${pendingAssignments.length} pending submission` : 'All caught up!'}
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Quizzes Available
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-white">{quizzes.length}</span>
              <span className="text-[11px] text-sky-400 font-medium">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Timed MCQ assessments</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Study Materials
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-bold text-white">8 Files</span>
              <span className="text-[11px] text-indigo-300 font-medium">PDF/Docs</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Official syllabi &amp; manuals</p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Cipher X Club
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xs sm:text-sm font-bold text-emerald-400 truncate">
                {myApplication ? myApplication.status : 'Apply to Wing'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {myApplication ? myApplication.wing : 'Red Team / SOC'}
            </p>
          </div>
        </div>
      </header>

      {/* The 5 Permitted Student Core Capabilities */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Student Action Center</h2>
            <p className="text-xs text-slate-500">Direct shortcuts to your 5 authorized student academic tools</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Action 1: Upload Assignments */}
          <div 
            onClick={() => onNavigate('assignments')}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                01 &bull; Submit
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition">
                Upload Assignments
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Submit lab reports in PDF / DOC format, check deadlines, and review feedback.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
              <span>View Assignments</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Action 2: Do Quizzes */}
          <div 
            onClick={() => onNavigate('quizzes')}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                02 &bull; Test
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Do Quizzes
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Take timed multiple-choice assessments with instant scoring and explanations.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Take Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Action 3: Download Study Materials */}
          <div 
            onClick={() => onNavigate('study-materials')}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                03 &bull; PDFs
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Download Materials
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Download official syllabi, lab sheets, and reference notes in PDF format.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
              <span>Download Files</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Action 4: Key Concept Summarizer */}
          <div 
            onClick={() => onNavigate('notes')}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <BookMarked className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                04 &bull; AI Notes
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                Concept Summarizer
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate structured lecture summaries, flashcards, and conceptual quizzes.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Summarize Notes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Action 5: The Anonymous Lab & Club */}
          <div 
            onClick={() => onNavigate('anonymous-lab')}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-pink-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                05 &bull; Club
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition">
                Apply &amp; Access Club
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Join Cipher X cyber wings, solve CTF war games, and track application status.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-pink-600">
              <span>Enter Lab &amp; Apply</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </section>

      {/* Main Student Two-Column Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Active Assignments & Upcoming Assessments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Assignments List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Your Assignments &amp; Lab Submissions</h3>
              </div>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <span>View All ({assignments.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {assignments.slice(0, 3).map((assignment) => {
                const isSubmitted = assignment.submissions.some(
                  s => s.studentName.toLowerCase().includes(studentName.toLowerCase()) || s.studentRoll === studentRoll
                );
                const submission = assignment.submissions.find(
                  s => s.studentName.toLowerCase().includes(studentName.toLowerCase()) || s.studentRoll === studentRoll
                );

                return (
                  <div 
                    key={assignment.id} 
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                          {assignment.courseId}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{assignment.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Due: {assignment.dueDate}
                        </span>
                        <span>&bull; {assignment.points} Points</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSubmitted ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submitted ({submission?.grade ? `${submission.grade}/${assignment.points} Pts` : 'Under Review'})</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onNavigate('assignments')}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-xs transition"
                        >
                          Upload PDF
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Quizzes */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">Available Quizzes &amp; Self-Assessments</h3>
              </div>
              <button
                onClick={() => onNavigate('quizzes')}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Take a Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quizzes.slice(0, 4).map((quiz) => (
                <div key={quiz.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                      {quiz.courseId}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{quiz.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{quiz.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">
                      {quiz.questions?.length || 5} Questions &bull; {quiz.timeLimitMinutes || 15}m
                    </span>
                    <button
                      onClick={() => onNavigate('quizzes')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                    >
                      Start
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Study Materials & Club Membership Box */}
        <div className="space-y-6">
          
          {/* Quick Study Materials Download Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-indigo-600" />
                <span>Study Materials &amp; Syllabi</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-mono">
                Sem 1
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Official PDF curriculum syllabi and lab roadmaps ready for direct download.
            </p>

            <div className="space-y-2">
              <div 
                onClick={() => onNavigate('study-materials')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    PDF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Python Data Structures</h5>
                    <span className="text-[10px] text-slate-500">2.4 MB &bull; Syllabus &amp; Lab Manual</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-indigo-600" />
              </div>

              <div 
                onClick={() => onNavigate('study-materials')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                    PDF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Green Computing &amp; ESG</h5>
                    <span className="text-[10px] text-slate-500">1.8 MB &bull; Comprehensive Syllabus</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-emerald-600" />
              </div>

              <div 
                onClick={() => onNavigate('study-materials')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center">
                    PDF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Cybersecurity Fundamentals</h5>
                    <span className="text-[10px] text-slate-500">3.1 MB &bull; Course Handbook</span>
                  </div>
                </div>
                <Download className="w-4 h-4 text-sky-600" />
              </div>
            </div>

            <button
              onClick={() => onNavigate('study-materials')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition text-center block"
            >
              Browse All Study Materials &rarr;
            </button>
          </div>

          {/* Cipher X Membership Status Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">The Anonymous Lab</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold">
                Cipher X
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Application Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                  {myApplication ? myApplication.status : 'Not Submitted'}
                </span>
              </div>
              <p className="text-slate-300 text-[11px]">
                {myApplication 
                  ? `Assigned Wing: ${myApplication.wing}`
                  : 'Apply to join Red Team, SOC, Cryptography or Forensics wings.'}
              </p>
            </div>

            <button
              onClick={() => onNavigate('anonymous-lab')}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Open Cipher X Portal &amp; CTF
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
