import React from 'react';
import { 
  Users, 
  BookOpen, 
  Sparkles, 
  FileText, 
  HelpCircle, 
  TrendingUp, 
  ShieldAlert, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Shield, 
  UploadCloud, 
  Code2, 
  ExternalLink,
  Layers,
  Award,
  Download,
  BookMarked,
  Terminal,
  UserCheck
} from 'lucide-react';
import { Course, Assignment, Quiz, NoteItem, StudentEngagementProfile, UserRole } from '../types';

interface DashboardOverviewProps {
  courses: Course[];
  assignments: Assignment[];
  quizzes: Quiz[];
  notes: NoteItem[];
  students: StudentEngagementProfile[];
  onNavigate: (tab: string) => void;
  role: UserRole;
  onOpenAITutor: () => void;
  activeFaculty?: any;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  courses,
  assignments,
  quizzes,
  notes,
  students,
  onNavigate,
  role,
  onOpenAITutor,
  activeFaculty,
}) => {
  const totalStudents = students.length || 32;
  const avgEngagement = Math.round(
    students.reduce((acc, s) => acc + s.engagementScore, 0) / (students.length || 1)
  );
  const totalSubmissions = assignments.reduce((acc, a) => acc + a.submissions.length, 0);
  const pendingGradingCount = assignments.reduce((acc, a) => 
    acc + a.submissions.filter(s => s.status !== 'Graded').length, 0
  );
  const recentSubmissionsList = assignments.flatMap(a => a.submissions).slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Top Header Command Center */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-sky-700" />
              <span>Faculty Academic Command Center</span>
            </span>
            <span className="text-xs text-slate-400">&bull; BCA Cyber Security &amp; Data Science</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Department Academic Center
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Semester 1 Cohort ({totalStudents} Students enrolled) &bull; {totalSubmissions} active submissions ({pendingGradingCount} pending evaluation).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-open-tutor-quick"
            onClick={onOpenAITutor}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Ask AI Tutor</span>
          </button>
          
          <button
            id="btn-header-new-post"
            onClick={() => onNavigate('syllabus-ai')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm shadow-sky-200 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New AI Syllabus &amp; Quiz +</span>
          </button>
        </div>
      </header>

      {/* 4 Metric Cards in Clean White */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Student Engagement
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgEngagement}%</span>
            <span className="text-emerald-500 text-xs font-semibold mb-0.5">&uarr; 4.2%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgEngagement}%` }}></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Assignment Submissions
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalSubmissions}</span>
            <span className="text-slate-400 text-xs font-medium mb-0.5">Recorded</span>
          </div>
          <div className="flex gap-1 mt-4 h-5 items-end">
            <div className="w-full bg-sky-100 h-[40%] rounded-xs"></div>
            <div className="w-full bg-sky-200 h-[60%] rounded-xs"></div>
            <div className="w-full bg-sky-400 h-[90%] rounded-xs"></div>
            <div className="w-full bg-sky-300 h-[70%] rounded-xs"></div>
            <div className="w-full bg-sky-500 h-[100%] rounded-xs"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Active Assessments
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">{quizzes.length + notes.length}</span>
            <span className="text-slate-400 text-xs font-medium mb-0.5">Quizzes &amp; Notes</span>
          </div>
          <div className="mt-3 flex -space-x-2">
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">CS</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-700">DS</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[9px] font-bold text-white">AI</div>
            <div className="w-6 h-6 rounded-full border-2 border-white bg-sky-500 text-[8px] flex items-center justify-center text-white font-bold">+12</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Study Materials &amp; Syllabi
          </p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-slate-900">8 Files</span>
            <span className="text-indigo-600 text-xs font-semibold mb-0.5">Ready to Download</span>
          </div>
          <div className="mt-3 flex gap-1.5 items-center">
            <div className="flex-1 h-1 bg-indigo-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-indigo-500 rounded-full"></div>
            <div className="flex-1 h-1 bg-indigo-500/30 rounded-full"></div>
          </div>
        </div>

      </section>

      {/* Main 5-Column Grid (3 Cols Left + 2 Cols Right) */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3 Columns */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* AI Intelligent Processor Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span>AI Intelligent Processor</span>
              </h3>
              <span className="px-2 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider border border-purple-200">
                Powered by Gemini AI
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Drop Target 1: Upload Syllabus */}
              <div 
                id="card-trigger-syllabus"
                onClick={() => onNavigate('syllabus-ai')}
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-sky-400 transition-colors cursor-pointer bg-slate-50/50 group"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Upload Syllabus</p>
                <p className="text-[11px] text-slate-400">Generate Quiz &amp; Study Plan</p>
              </div>

              {/* Drop Target 2: Upload Lecture Notes */}
              <div 
                id="card-trigger-notes"
                onClick={() => onNavigate('notes')}
                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50/50 group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Upload Lecture Notes</p>
                <p className="text-[11px] text-slate-400">Summarize to Key Concepts</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-xs text-slate-600 font-medium">
                  AI engine ready. Ingest syllabi, network traces, or lecture markdown files.
                </p>
              </div>
              <button 
                onClick={() => onNavigate('syllabus-ai')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700"
              >
                Launch Studio &rarr;
              </button>
            </div>
          </div>

          {/* Recent Assignment Submissions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Recent Assignment Submissions</h3>
              <button
                onClick={() => onNavigate('assignments')}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700"
              >
                View All &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {recentSubmissionsList.length > 0 ? (
                recentSubmissionsList.map((sub, idx) => {
                  const initials = sub.studentName
                    ? sub.studentName
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'ST';

                  return (
                    <div 
                      key={sub.id || idx}
                      className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50/70 transition"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-xs font-bold text-sky-700 border border-sky-200/80 flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                            {sub.studentName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {sub.studentRoll ? `${sub.studentRoll} • ${sub.submittedAt}` : sub.submittedAt}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">No student submissions recorded yet</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Submissions in PDF or DOC format will appear here as students submit their assignments.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Core Specialization Courses */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Active Department Courses</h3>
              <span className="text-xs text-slate-400 font-medium">Semester 1 Cohort</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {c.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-1">
                      {c.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                      {c.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{c.instructor}</span>
                    <button
                      onClick={() => onNavigate('syllabus-ai')}
                      className="text-sky-600 font-semibold text-[11px] hover:underline"
                    >
                      AI Plan &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Dark Signature Engagement Radar */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-[#0f172a] rounded-2xl p-6 text-white shadow-xl shadow-slate-200 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></span>
                <span>Real-Time Engagement</span>
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">UNIT 1: Python Memory &amp; Lists</div>
                    <div className="font-bold text-sky-400">96%</div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">UNIT 2: Linked Lists ADT</div>
                    <div className="font-bold text-sky-400">88%</div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">UNIT 3: Stacks, Queues &amp; Recursion</div>
                    <div className="font-bold text-amber-400">74%</div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">UNIT 4: Trees, Graphs &amp; Sorting</div>
                    <div className="font-bold text-slate-500">30%</div>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-700 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insights box inside telemetry */}
            <div className="mt-8 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
              <p className="text-xs text-sky-400 font-bold uppercase tracking-wider">
                AI Academic Insights
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unit 3 Stack &amp; Queue recursion tracing has 12% lower completion. Consider generating a practice quiz and flashcards.
              </p>
              <button
                onClick={() => onNavigate('notes')}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 pt-1 block underline"
              >
                Generate Summary Sheet &rarr;
              </button>
            </div>
          </div>

          {/* Quick Department Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>Upcoming Milestones</span>
            </h4>

            <div className="space-y-2">
              {assignments.slice(0, 2).map((asg) => (
                <div key={asg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-800 line-clamp-1">{asg.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Due: {asg.dueDate} &bull; {asg.submissionType}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Department Association & Club Spotlight */}
          <div className="bg-gradient-to-br from-[#0f172a] to-slate-900 rounded-2xl p-5 text-white border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                The Anonymous Lab
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                Cipher X Club
              </span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-white">Python Data Structures Sprint 2026</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Department coding competition &amp; algorithmic speed run in CSDS Computer Lab 1.
              </p>
            </div>

            <button
              onClick={() => onNavigate('anonymous-lab')}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              <span>Explore Lab &amp; War Games</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </section>

    </div>
  );
};
