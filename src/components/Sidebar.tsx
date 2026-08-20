import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  HelpCircle, 
  BookMarked, 
  TrendingUp, 
  Sparkles, 
  Shield, 
  Binary, 
  Lock, 
  Terminal,
  Download,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { ViewTab, UserRole, FacultyProfile } from '../types';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  role: UserRole;
  activeFaculty?: FacultyProfile | null;
  onOpenFacultyLogin?: () => void;
  counts: {
    assignments: number;
    quizzes: number;
    notes: number;
    studyPlans: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  role,
  activeFaculty,
  onOpenFacultyLogin,
  counts,
}) => {
  const facultyNavItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'syllabus-ai',
      label: 'Syllabus & AI Studio',
      icon: Sparkles,
      badge: 'AI',
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
    },
    {
      id: 'assignments',
      label: 'Assignments & Labs',
      icon: FileText,
      badge: counts.assignments > 0 ? `${counts.assignments}` : null,
    },
    {
      id: 'quizzes',
      label: 'Quiz Management',
      icon: HelpCircle,
      badge: counts.quizzes > 0 ? `${counts.quizzes}` : null,
    },
    {
      id: 'study-materials',
      label: 'Study Materials Repository',
      icon: Download,
      badge: 'PDF',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'notes',
      label: 'Key Concept Summaries',
      icon: BookMarked,
      badge: counts.notes > 0 ? `${counts.notes}` : null,
    },
    {
      id: 'engagement',
      label: 'Student Analytics & Roster',
      icon: TrendingUp,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'anonymous-lab',
      label: 'The Anonymous Lab',
      subLabel: 'Cipher X Club & Apps',
      icon: Terminal,
      badge: 'Club',
      badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    },
  ];

  const studentNavItems = [
    {
      id: 'overview',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assignments',
      label: 'Upload Assignments',
      subLabel: 'PDF/DOC Submission',
      icon: FileText,
      badge: counts.assignments > 0 ? `${counts.assignments}` : null,
    },
    {
      id: 'quizzes',
      label: 'Do Quizzes',
      subLabel: 'Timed Tests & Review',
      icon: HelpCircle,
      badge: counts.quizzes > 0 ? `${counts.quizzes}` : null,
    },
    {
      id: 'study-materials',
      label: 'Download Study Materials',
      subLabel: 'PDFs & Lab Manuals',
      icon: Download,
      badge: 'PDF',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    },
    {
      id: 'notes',
      label: 'Key Concept Summarizer',
      subLabel: 'AI Notes & Flashcards',
      icon: BookMarked,
      badge: 'AI',
      badgeColor: 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
    },
    {
      id: 'anonymous-lab',
      label: 'Apply & Access Club',
      subLabel: 'Cipher X & CTF Arena',
      icon: Terminal,
      badge: 'Apply',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    },
  ];

  const navItems = role === 'faculty' ? facultyNavItems : studentNavItems;

  return (
    <aside id="main-sidebar" className="w-full md:w-64 bg-[#0f172a] rounded-2xl flex flex-col text-slate-300 flex-shrink-0 shadow-sm overflow-hidden self-start">
      
      {/* Brand Header */}
      <div className="p-6 pb-4">
        <h1 className="text-white font-bold text-xl tracking-tight">
          BCA<span className="text-sky-400">.CS+DS</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
          Cyber Security Hub
        </p>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-500/10 text-sky-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 text-left">
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
                <div className="truncate">
                  <span className="block truncate">{item.label}</span>
                  {item.subLabel && (
                    <span className="block text-[10px] text-sky-400/80 font-mono -mt-0.5 font-normal">
                      {item.subLabel}
                    </span>
                  )}
                </div>
              </div>
              {item.badge && (
                <span
                  className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Track info cards */}
      <div className="p-4 pt-3 space-y-2 border-t border-slate-800/80 mt-4">
        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold mb-0.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Cyber Security &amp; Data Science</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Python Data Structures, Design Thinking &amp; Algorithms
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/70 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-0.5">
            <Binary className="w-3.5 h-3.5" />
            <span>Digital Sustainability &amp; Forensics</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Green Computing, PUE Metrics &amp; E-Waste Lifecycle
          </p>
        </div>
      </div>

      {/* User Identity Footer */}
      <div className="p-4 bg-slate-900/80 border-t border-slate-800/90 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs border border-slate-700 flex-shrink-0">
              {role === 'faculty' 
                ? (activeFaculty ? activeFaculty.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'AV') 
                : 'ST'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {role === 'faculty' 
                  ? (activeFaculty ? activeFaculty.name : 'Mr. Adarsh V P') 
                  : 'Sruthi (Student)'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {role === 'faculty' 
                  ? (activeFaculty ? activeFaculty.designation : 'Asst. Prof & Co-ordinator') 
                  : 'BCA CSDS • Sem 1'}
              </p>
            </div>
          </div>

          {role === 'student' && onOpenFacultyLogin && (
            <button
              onClick={onOpenFacultyLogin}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-sky-400 transition"
              title="Faculty Sign In"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

    </aside>
  );
};

