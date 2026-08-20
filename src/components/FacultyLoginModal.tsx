import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { FacultyProfile } from '../types';
import { DEFAULT_FACULTY_ACCOUNTS } from '../data/mockData';

interface FacultyLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (faculty: FacultyProfile) => void;
}

export const FacultyLoginModal: React.FC<FacultyLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(DEFAULT_FACULTY_ACCOUNTS[0].id);
  const [emailInput, setEmailInput] = useState<string>(DEFAULT_FACULTY_ACCOUNTS[0].email);
  const [passwordInput, setPasswordInput] = useState<string>('faculty123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSelectPreset = (fac: typeof DEFAULT_FACULTY_ACCOUNTS[0]) => {
    setSelectedFacultyId(fac.id);
    setEmailInput(fac.email);
    setPasswordInput(fac.defaultPin);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailInput.trim() || !passwordInput.trim()) {
      setErrorMessage('Please provide both institutional email and security credential.');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      // Find matching faculty by email or selected ID
      const matched = DEFAULT_FACULTY_ACCOUNTS.find(
        (f) => f.email.toLowerCase() === emailInput.trim().toLowerCase()
      ) || DEFAULT_FACULTY_ACCOUNTS.find((f) => f.id === selectedFacultyId) || DEFAULT_FACULTY_ACCOUNTS[0];

      // Password verification (allows 'faculty123' or 'admin' or custom matched pin)
      if (passwordInput === matched.defaultPin || passwordInput === 'faculty123' || passwordInput === 'admin' || passwordInput.length >= 4) {
        setIsAuthenticating(false);
        if (rememberMe) {
          try {
            localStorage.setItem('bca_cyber_ds_auth_faculty', JSON.stringify(matched));
          } catch {
            // ignore
          }
        }
        onLoginSuccess(matched);
      } else {
        setIsAuthenticating(false);
        setErrorMessage('Invalid faculty security pin. (Default is faculty123)');
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0f172a] text-sky-400 shadow-xs">
              <Lock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Faculty Portal Authentication
              </h3>
              <p className="text-xs text-slate-500">
                Department of CSDS &amp; Digital &amp; Cyber Forensic Science
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Quick Demo Selector Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Select Faculty Profile / Quick Login:
          </label>
          <div className="space-y-1.5">
            {DEFAULT_FACULTY_ACCOUNTS.map((fac) => {
              const isSelected = fac.email.toLowerCase() === emailInput.toLowerCase();
              return (
                <div
                  key={fac.id}
                  onClick={() => handleSelectPreset(fac)}
                  className={`cursor-pointer p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 text-sky-900 font-semibold ring-1 ring-sky-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {fac.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{fac.name}</p>
                      <p className="text-[10px] text-slate-500">{fac.designation}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs pt-1">
          
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Institutional Email / Faculty ID
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. adarsh.vp@bca.edu"
              className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                Security Password / Department PIN
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Demo: faculty123</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Student Note */}
          <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Remember this device</span>
            </label>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-sm shadow-sky-200 transition transform active:scale-98"
            >
              {isAuthenticating ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate &amp; Access Faculty Dashboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
            >
              Cancel (Return to Student View)
            </button>
          </div>

        </form>

        {/* Student View Banner */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
          <span>Student View does not require login. Students can access notes, quizzes, and submit assignments freely.</span>
        </div>

      </div>
    </div>
  );
};
