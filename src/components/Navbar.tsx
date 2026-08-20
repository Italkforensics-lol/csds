import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  Bell, 
  Layers,
  Lock,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { UserRole, FacultyProfile } from '../types';

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeFaculty: FacultyProfile | null;
  onOpenFacultyLogin: () => void;
  onFacultyLogout: () => void;
  selectedSemester: number;
  onSemesterChange: (sem: number) => void;
  onOpenAITutor: () => void;
  unreadNotificationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  onRoleChange,
  activeFaculty,
  onOpenFacultyLogin,
  onFacultyLogout,
  selectedSemester,
  onSemesterChange,
  onOpenAITutor,
  unreadNotificationsCount = 3
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Department Branding */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0f172a] flex items-center justify-center text-sky-400 font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900">
                  BCA<span className="text-sky-600">.CS+DS</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                  Academic Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cyber Security &amp; Data Science Department
              </p>
            </div>
          </div>

          {/* Right Actions: Semester, AI Tutor, Role Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Semester Selector */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Semester:</span>
              <select
                id="semester-select"
                value={selectedSemester}
                onChange={(e) => onSemesterChange(Number(e.target.value))}
                aria-label="Select Academic Semester"
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value={1}>Sem 1 (Active Batch)</option>
                <option value={2}>Sem 2 (Upcoming)</option>
                <option value={0}>All Semesters</option>
              </select>
            </div>

            {/* Quick AI Concept Explainer Button */}
            <button
              id="btn-ai-tutor"
              onClick={onOpenAITutor}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition shadow-xs"
              title="Ask AI CyberSec & Data Science Concept Explainer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">AI Concept Tutor</span>
              <span className="sm:hidden">AI Tutor</span>
            </button>

            {/* Authentication / View Control */}
            {role === 'faculty' && activeFaculty ? (
              <div className="relative">
                <button
                  id="faculty-profile-dropdown-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-slate-800 transition"
                >
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    {activeFaculty.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="leading-tight font-bold text-slate-100">{activeFaculty.name}</p>
                    <p className="text-[10px] text-sky-400 font-normal">Faculty Auth Active</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 space-y-2 z-50 text-xs animate-fade-in">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="font-bold text-slate-900">{activeFaculty.name}</p>
                      <p className="text-[11px] text-slate-500">{activeFaculty.designation}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeFaculty.email}</p>
                    </div>

                    <div className="pt-1 border-t border-slate-100 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onRoleChange('student');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-slate-700 hover:bg-slate-50 rounded-lg font-medium transition text-left"
                      >
                        <UserCheck className="w-4 h-4 text-sky-600" />
                        <span>Preview Student View</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onFacultyLogout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out Faculty Session</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  id="role-btn-student"
                  onClick={() => onRoleChange('student')}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-sky-600 text-white shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Student View</span>
                </button>

                <button
                  id="btn-faculty-login"
                  onClick={onOpenFacultyLogin}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white transition"
                  title="Authenticate as Faculty / Department Head"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Faculty Login</span>
                  <span className="sm:hidden">Login</span>
                </button>
              </div>
            )}

            {/* Notification Indicator */}
            <div className="relative">
              <button 
                id="btn-notifications"
                className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition border border-slate-200 shadow-xs"
                title="Department Live Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

