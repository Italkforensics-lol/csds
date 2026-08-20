import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Flag, 
  Users, 
  Calendar, 
  Code2, 
  Sparkles, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ChevronRight, 
  Lock, 
  Unlock, 
  Github, 
  Send,
  Zap,
  Bookmark,
  Layers,
  HelpCircle,
  X,
  FileCheck,
  Clock,
  UserCheck,
  Plus
} from 'lucide-react';
import { 
  ANONYMOUS_LAB_INFO, 
  CIPHER_X_CLUB_INFO, 
  CIPHER_X_LEADERS, 
  CIPHER_X_EVENTS, 
  CIPHER_X_PROJECTS, 
  CIPHER_X_CHALLENGES 
} from '../data/associationData';
import { UserRole, ClubApplication } from '../types';

interface AnonymousLabSectionProps {
  role: UserRole;
  onOpenAITutor: () => void;
  applications?: ClubApplication[];
  onAddApplication?: (app: ClubApplication) => void;
  onUpdateApplicationStatus?: (appId: string, status: 'Pending Review' | 'Approved' | 'Shortlisted for Interview' | 'Declined', feedback?: string) => void;
}

export const AnonymousLabSection: React.FC<AnonymousLabSectionProps> = ({
  role,
  onOpenAITutor,
  applications = [],
  onAddApplication,
  onUpdateApplicationStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'cipher-x' | 'apply' | 'events' | 'projects' | 'ctf-arena' | 'team'>('cipher-x');
  const [rsvpEvents, setRsvpEvents] = useState<string[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [flagInputs, setFlagInputs] = useState<Record<string, string>>({});
  const [flagFeedback, setFlagFeedback] = useState<Record<string, { success: boolean; msg: string }>>({});
  const [showHintId, setShowHintId] = useState<string | null>(null);

  // Membership modal / form
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: 'Sruthi',
    rollNo: 'CSDS-2026-001',
    email: 'sruthi.csds@bca.edu',
    semester: 1,
    wing: 'Red Teaming & CTF' as ClubApplication['wing'],
    skillsAndTools: 'Python, Linux, Wireshark, Basic Cryptography',
    githubOrPortfolio: 'https://github.com/sruthi-cyber',
    statementOfPurpose: 'Passionate about cyber security research, packet inspection, and competitive CTF hacking with Cipher X team.',
    proposedProjectIdea: 'Automated Python packet anomaly detector for local network threat detection.',
  });
  const [joinSuccessMsg, setJoinSuccessMsg] = useState<string | null>(null);

  // Internal local applications fallback if not provided by prop
  const [localApps, setLocalApps] = useState<ClubApplication[]>([
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
  ]);

  const activeApplicationsList = applications.length > 0 ? applications : localApps;

  // Handle Event RSVP
  const handleToggleRSVP = (eventId: string, title: string) => {
    if (rsvpEvents.includes(eventId)) {
      setRsvpEvents(rsvpEvents.filter(id => id !== eventId));
    } else {
      setRsvpEvents([...rsvpEvents, eventId]);
    }
  };

  // Handle Flag Submission
  const handleFlagSubmit = (challengeId: string) => {
    const input = (flagInputs[challengeId] || '').trim().toLowerCase();
    
    // Sample acceptable flags
    const validFlags: Record<string, string[]> = {
      'ctf-1': ['tal{fermat_factor_cracked}', 'fermat', 'tal{small_prime_diff}'],
      'ctf-2': ['tal{icmp_tunnel_exposed}', 'icmp_payload', 'tal{base64_exfil_found}'],
      'ctf-3': ['tal{ret2win_pwned}', 'ret2win', 'tal{rip_overwritten_72}'],
      'ctf-4': ['tal{jwt_none_admin_bypass}', 'alg:none', 'tal{token_forged_admin}'],
    };

    const accepted = validFlags[challengeId] || ['tal{flag}'];
    const isCorrect = accepted.some(f => input.includes(f) || input.toLowerCase() === f);

    if (isCorrect || input.startsWith('tal{')) {
      setSolvedChallenges(prev => [...new Set([...prev, challengeId])]);
      setFlagFeedback(prev => ({
        ...prev,
        [challengeId]: { success: true, msg: 'Flag captured! Score updated.' }
      }));
    } else {
      setFlagFeedback(prev => ({
        ...prev,
        [challengeId]: { success: false, msg: 'Incorrect flag. Check the hint!' }
      }));
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.name.trim() || !joinForm.rollNo.trim()) return;

    const newApp: ClubApplication = {
      id: `app-cx-${Date.now().toString().slice(-4)}`,
      studentName: joinForm.name,
      studentRoll: joinForm.rollNo,
      email: joinForm.email,
      semester: Number(joinForm.semester),
      wing: joinForm.wing,
      skillsAndTools: joinForm.skillsAndTools,
      githubOrPortfolio: joinForm.githubOrPortfolio,
      statementOfPurpose: joinForm.statementOfPurpose,
      proposedProjectIdea: joinForm.proposedProjectIdea,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending Review',
    };

    if (onAddApplication) {
      onAddApplication(newApp);
    } else {
      setLocalApps(prev => [newApp, ...prev]);
    }

    setJoinSuccessMsg(`Application #${newApp.id.toUpperCase()} submitted successfully! Your application for "${joinForm.wing}" is now under review.`);
    setTimeout(() => {
      setIsJoinModalOpen(false);
      setJoinSuccessMsg(null);
      setActiveTab('apply');
    }, 2000);
  };

  const handleStatusChange = (appId: string, newStatus: ClubApplication['status'], feedback?: string) => {
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(appId, newStatus, feedback);
    } else {
      setLocalApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus, facultyFeedback: feedback || a.facultyFeedback } : a));
    }
  };

  const totalPoints = solvedChallenges.reduce((acc, id) => {
    const ch = CIPHER_X_CHALLENGES.find(c => c.id === id);
    return acc + (ch ? ch.points : 0);
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* Association Hero Banner */}
      <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        
        {/* Subtle background tech accents */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                Department Association
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                Est. {ANONYMOUS_LAB_INFO.established} &bull; BCA CyberSec + Data Science
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Anonymous Lab
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {ANONYMOUS_LAB_INFO.tagline}. A student-driven research and defense collective pioneering ethical hacking, cryptographic protocol analysis, SIEM engineering, and ML threat intelligence.
            </p>

            <div className="pt-1 flex items-center gap-4 text-xs text-slate-400">
              <span><strong>Motto:</strong> <em>{ANONYMOUS_LAB_INFO.motto}</em></span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Association Stats</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <span className="text-xl font-extrabold text-sky-400 block">{ANONYMOUS_LAB_INFO.stats.activeMembers}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Members</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
                <span className="text-xl font-extrabold text-emerald-400 block">{ANONYMOUS_LAB_INFO.stats.nationalCtfWins}</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">CTF Trophies</span>
              </div>
            </div>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-sky-400/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Join Association &amp; Club</span>
            </button>
          </div>

        </div>

      </div>

      {/* Navigation Sub-Tabs for Association & Cipher X */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex items-center gap-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('cipher-x')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cipher-x'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Cipher X Club Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('apply')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'apply'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Apply &amp; Membership Status</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
            {activeApplicationsList.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'events'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Workshops &amp; Events</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
            {CIPHER_X_EVENTS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Open-Source Cyber Tools</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-mono">
            {CIPHER_X_PROJECTS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ctf-arena')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ctf-arena'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Cipher X CTF Challenges</span>
          {solvedChallenges.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-700 font-bold rounded">
              {totalPoints} pts
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'team'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Leads &amp; Mentors</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: APPLY & MEMBERSHIP STATUS */}
      {/* ========================================================================= */}
      {activeTab === 'apply' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {role === 'faculty' ? 'Club Applications Management' : 'Cipher X & Anonymous Lab Membership Portal'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold font-mono">
                  {activeApplicationsList.length} Applications
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {role === 'faculty'
                  ? 'Review student applications, verify technical wing preferences, and evaluate project proposals for the department association.'
                  : 'Apply to join specialized research wings, participate in CTF teams, and access lab equipment and open-source repos.'}
              </p>
            </div>

            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition transform active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Application</span>
            </button>
          </div>

          {/* Application Cards List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {role === 'faculty' ? 'Received Student Applications' : 'Your Submitted Applications & Status'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeApplicationsList.map((app) => {
                const statusColor = 
                  app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  app.status === 'Shortlisted for Interview' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  app.status === 'Declined' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-amber-50 text-amber-700 border-amber-200';

                return (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-300 transition space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{app.studentName}</h4>
                            <span className="text-xs font-mono font-semibold text-slate-500">({app.studentRoll})</span>
                          </div>
                          <p className="text-xs text-sky-600 font-semibold mt-0.5">{app.wing}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusColor}`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Semester:</span>
                          <span className="font-semibold text-slate-800">Sem {app.semester}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Submitted:</span>
                          <span className="font-mono text-[11px] text-slate-700">{app.submittedAt}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Skills &amp; Tools:</span>
                          <span className="text-slate-800 font-medium">{app.skillsAndTools}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <span className="text-[11px] font-bold text-slate-700 block">Statement of Purpose:</span>
                        <p className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 text-[11px] leading-relaxed italic">
                          "{app.statementOfPurpose}"
                        </p>
                      </div>

                      {app.proposedProjectIdea && (
                        <div className="space-y-1 text-xs">
                          <span className="text-[11px] font-bold text-slate-700 block">Proposed Project / Research:</span>
                          <p className="text-slate-600 text-[11px]">
                            {app.proposedProjectIdea}
                          </p>
                        </div>
                      )}

                      {app.githubOrPortfolio && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                          <Github className="w-3.5 h-3.5" />
                          <a href={app.githubOrPortfolio} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline truncate">
                            {app.githubOrPortfolio}
                          </a>
                        </div>
                      )}

                      {app.facultyFeedback && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                          <span className="font-bold flex items-center gap-1 text-[11px]">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Faculty Feedback:
                          </span>
                          <p className="text-[11px] text-emerald-800">
                            {app.facultyFeedback}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Faculty Action Controls */}
                    {role === 'faculty' && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-slate-500">Update Status:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(app.id, 'Approved', 'Application approved! Assigned to wing lead.')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'Shortlisted for Interview', 'Shortlisted for practical technical round.')}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Interview
                          </button>
                          <button
                            onClick={() => handleStatusChange(app.id, 'Pending Review')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: CIPHER X CLUB HUB */}
      {/* ========================================================================= */}
      {activeTab === 'cipher-x' && (
        <div className="space-y-6">
          
          {/* Cipher X Feature Spotlight Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="h-12 w-12 rounded-2xl bg-[#0f172a] text-sky-400 flex items-center justify-center font-black text-xl shadow-xs">
                  CX
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">Cipher X</h2>
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold">
                      {CIPHER_X_CLUB_INFO.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Operating under <strong>The Anonymous Lab</strong> &bull; {CIPHER_X_CLUB_INFO.tagline}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('ctf-arena')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition"
                >
                  Enter CTF War Games &rarr;
                </button>
                <button
                  onClick={() => setIsJoinModalOpen(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-sm transition"
                >
                  Apply to Join
                </button>
              </div>
            </div>

            {/* Club Overview Text */}
            <div className="text-xs text-slate-600 leading-relaxed max-w-4xl">
              {CIPHER_X_CLUB_INFO.overview}
            </div>

            {/* 5 Core Wings Grid */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Specialized Technical Wings &amp; Domains
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CIPHER_X_CLUB_INFO.focusAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3 hover:bg-white hover:border-sky-300 transition"
                  >
                    <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex-shrink-0">
                      {idx === 0 ? <Flag className="w-4 h-4" /> : idx === 1 ? <Lock className="w-4 h-4" /> : idx === 2 ? <Shield className="w-4 h-4" /> : idx === 3 ? <Terminal className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-slate-800">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Association Mentorship Banner */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800">Faculty Mentorship &amp; Guidance:</span>
                <p className="text-slate-500">
                  Guided by <strong>Dr. Rajesh Sharma</strong> (Professor &amp; HoD) and <strong>Dr. Priya Nambiar</strong> (Associate Professor, Data Science).
                </p>
              </div>
              <button
                onClick={onOpenAITutor}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-sky-700 font-semibold rounded-lg border border-slate-200 transition text-xs whitespace-nowrap self-start sm:self-auto"
              >
                Ask Association AI Mentor
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EVENTS & WORKSHOPS */}
      {/* ========================================================================= */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming &amp; Recent Department Events</h3>
              <p className="text-xs text-slate-500">Workshops, bootcamps, and CTF competitions hosted by Cipher X and The Anonymous Lab.</p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-lg border border-sky-100">
              {rsvpEvents.length} RSVP'd
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIPHER_X_EVENTS.map((event) => {
              const isRsvpd = rsvpEvents.includes(event.id);
              return (
                <div
                  key={event.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        event.status === 'Upcoming'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : event.status === 'Live Now'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {event.status}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{event.date}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{event.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3">{event.description}</p>

                    <div className="space-y-1 text-[11px] text-slate-600 pt-1">
                      <p><strong>Location:</strong> {event.location}</p>
                      <p><strong>Speaker / Host:</strong> {event.speakerOrHost}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {event.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {event.attendeesCount + (isRsvpd ? 1 : 0)} Registered
                    </span>

                    {event.status === 'Upcoming' ? (
                      <button
                        onClick={() => handleToggleRSVP(event.id, event.title)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                          isRsvpd
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                        }`}
                      >
                        {isRsvpd ? '✓ RSVP Confirmed' : 'RSVP for Event'}
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Event Concluded
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OPEN SOURCE PROJECTS */}
      {/* ========================================================================= */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student-Engineered Security Tools &amp; Repositories</h3>
            <p className="text-xs text-slate-500">Open-source software, forensic triage utilities, and ML models authored by members of The Anonymous Lab.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIPHER_X_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                      {project.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{project.starsOrForks}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{project.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{project.description}</p>
                  
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span><strong>Project Leads:</strong> {project.leads.join(', ')}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    project.status === 'Published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : project.status === 'Active'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {project.status}
                  </span>

                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold text-xs"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>View Repository &rarr;</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CTF CHALLENGES ARENA */}
      {/* ========================================================================= */}
      {activeTab === 'ctf-arena' && (
        <div className="space-y-4">
          
          {/* CTF Scoreboard Banner */}
          <div className="bg-[#0f172a] rounded-2xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flag className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-base">Cipher X CTF Challenge Arena</h3>
              </div>
              <p className="text-xs text-slate-400">
                Solve weekly cryptography, forensics, and reverse engineering challenges. Enter captured flags to earn leaderboard points!
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Your Score</span>
                <span className="text-lg font-black text-sky-400">{totalPoints} PTS</span>
              </div>
              <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">Solved</span>
                <span className="text-lg font-black text-emerald-400">{solvedChallenges.length} / {CIPHER_X_CHALLENGES.length}</span>
              </div>
            </div>
          </div>

          {/* Challenges List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CIPHER_X_CHALLENGES.map((ch) => {
              const isSolved = solvedChallenges.includes(ch.id);
              const feedback = flagFeedback[ch.id];
              const isHintShowing = showHintId === ch.id;

              return (
                <div
                  key={ch.id}
                  className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition ${
                    isSolved ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {ch.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ch.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : ch.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {ch.difficulty}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-sky-700">+{ch.points} PTS</span>
                    </div>

                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{ch.title}</h4>
                      {isSolved && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Solved
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>

                    {/* Hint Trigger */}
                    <div>
                      <button
                        onClick={() => setShowHintId(isHintShowing ? null : ch.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-sky-600 flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>{isHintShowing ? 'Hide Hint' : 'Show Challenge Hint'}</span>
                      </button>

                      {isHintShowing && (
                        <div className="mt-1.5 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-fade-in">
                          <strong>Hint:</strong> {ch.flagHint}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Flag Submission Field */}
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        disabled={isSolved}
                        value={flagInputs[ch.id] || ''}
                        onChange={(e) => setFlagInputs({ ...flagInputs, [ch.id]: e.target.value })}
                        placeholder={isSolved ? 'Challenge Flag Solved ✓' : 'Enter Flag: TAL{...}'}
                        className="flex-1 px-3 py-1.5 bg-slate-50 text-slate-900 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono disabled:bg-slate-100 disabled:text-slate-500"
                      />
                      <button
                        disabled={isSolved || !(flagInputs[ch.id] || '').trim()}
                        onClick={() => handleFlagSubmit(ch.id)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Submit</span>
                      </button>
                    </div>

                    {feedback && (
                      <p className={`text-[11px] font-semibold ${feedback.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {feedback.msg}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: STUDENT LEADS & MENTORS */}
      {/* ========================================================================= */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          
          {/* Student Core Committee */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Cipher X Student Leadership (2025 - 2026)</h3>
            <p className="text-xs text-slate-500">Student coordinators steering workshops, red/blue team challenges, and open-source development.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CIPHER_X_LEADERS.map((leader, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-300 transition text-center flex flex-col items-center justify-between"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-sky-400 font-bold flex items-center justify-center text-sm shadow-xs">
                    {leader.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{leader.name}</h4>
                    <p className="text-xs font-semibold text-sky-700">{leader.role}</p>
                    <span className="inline-block text-[10px] text-slate-400 font-mono">{leader.semester}</span>
                    <p className="text-[11px] text-slate-500 pt-1">{leader.specialty}</p>
                  </div>

                  {leader.githubOrLinkedin && (
                    <div className="pt-2 border-t border-slate-100 w-full text-center">
                      <span className="text-[10px] text-slate-400 font-mono truncate block">
                        {leader.githubOrLinkedin}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Department Faculty Advisory */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Department Faculty Advisors</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ANONYMOUS_LAB_INFO.facultyMentors.map((mentor, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                    {mentor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{mentor.name}</h4>
                    <p className="text-[11px] text-sky-700 font-semibold">{mentor.designation}</p>
                    <p className="text-[10px] text-slate-500">{mentor.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* JOIN ASSOCIATION & CIPHER X MODAL */}
      {/* ========================================================================= */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#0f172a] text-sky-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Join The Anonymous Lab &amp; Cipher X
                  </h3>
                  <p className="text-xs text-slate-500">Student Membership Registration</p>
                </div>
              </div>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {joinSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{joinSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={joinForm.name}
                    onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                    placeholder="e.g. Aarav Nair"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Roll Number *</label>
                    <input
                      type="text"
                      required
                      value={joinForm.rollNo}
                      onChange={(e) => setJoinForm({ ...joinForm, rollNo: e.target.value })}
                      placeholder="BCA-2024-001"
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                    <select
                      value={joinForm.semester}
                      onChange={(e) => setJoinForm({ ...joinForm, semester: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    >
                      <option value="1">Sem 1</option>
                      <option value="2">Sem 2</option>
                      <option value="3">Sem 3</option>
                      <option value="4">Sem 4</option>
                      <option value="5">Sem 5</option>
                      <option value="6">Sem 6</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Technical Wing *</label>
                  <select
                    value={joinForm.wing}
                    onChange={(e) => setJoinForm({ ...joinForm, wing: e.target.value as ClubApplication['wing'] })}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="Red Teaming & CTF">Red Teaming &amp; CTF (Cipher X)</option>
                    <option value="Blue Team SOC & SIEM">Blue Team SOC &amp; SIEM Defense</option>
                    <option value="Applied Cryptography">Applied Cryptography &amp; PKI</option>
                    <option value="Data Science & AI Defense">Data Science &amp; AI Threat Intelligence</option>
                    <option value="Digital Forensics & Green IT">Digital Forensics &amp; Green IT</option>
                    <option value="Open-Source Dev & Tooling">Open-Source Dev &amp; Tooling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Skills &amp; Cyber Tools</label>
                  <input
                    type="text"
                    value={joinForm.skillsAndTools}
                    onChange={(e) => setJoinForm({ ...joinForm, skillsAndTools: e.target.value })}
                    placeholder="e.g. Python, Wireshark, Linux, Burp Suite, Cryptography"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub / Portfolio URL</label>
                  <input
                    type="url"
                    value={joinForm.githubOrPortfolio}
                    onChange={(e) => setJoinForm({ ...joinForm, githubOrPortfolio: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statement of Purpose / Why do you want to join? *</label>
                  <textarea
                    rows={2}
                    required
                    value={joinForm.statementOfPurpose}
                    onChange={(e) => setJoinForm({ ...joinForm, statementOfPurpose: e.target.value })}
                    placeholder="Explain your technical interests, motivation, and what you aim to build or learn..."
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposed Mini-Project or Research Idea</label>
                  <input
                    type="text"
                    value={joinForm.proposedProjectIdea}
                    onChange={(e) => setJoinForm({ ...joinForm, proposedProjectIdea: e.target.value })}
                    placeholder="e.g. Automated packet inspection script or Green IT energy logger"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
