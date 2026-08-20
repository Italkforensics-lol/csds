import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ShieldAlert, 
  Search, 
  Download, 
  Award, 
  Activity,
  UserPlus,
  Upload,
  Edit2,
  Trash2,
  RotateCcw,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { StudentEngagementProfile, UserRole } from '../types';

interface EngagementTrackerProps {
  students: StudentEngagementProfile[];
  role: UserRole;
  onAddStudent: (student: StudentEngagementProfile) => void;
  onUpdateStudent: (student: StudentEngagementProfile) => void;
  onDeleteStudent: (studentId: string) => void;
  onBulkImportStudents: (students: StudentEngagementProfile[], mode: 'append' | 'replace') => void;
  onResetDefaultStudents?: () => void;
  onSendNudge?: (studentId: string) => void;
}

export const EngagementTracker: React.FC<EngagementTrackerProps> = ({
  students,
  role,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onBulkImportStudents,
  onResetDefaultStudents,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [focusFilter, setFocusFilter] = useState<string>('all');
  const [nudgedStudentIds, setNudgedStudentIds] = useState<string[]>([]);
  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<StudentEngagementProfile | null>(null);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState<boolean>(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentEngagementProfile | null>(null);

  // Single Student Form State
  const [formData, setFormData] = useState<{
    name: string;
    rollNo: string;
    email: string;
    semester: number;
    specializationFocus: 'Cyber Defense' | 'Data Analytics' | 'Threat Intelligence' | 'AI Security';
    attendanceRate: number;
    assignmentsSubmittedCount: number;
    totalAssignmentsCount: number;
    quizzesTakenCount: number;
    averageQuizScore: number;
    recentActivity: string;
  }>({
    name: '',
    rollNo: '',
    email: '',
    semester: 1,
    specializationFocus: 'Cyber Defense',
    attendanceRate: 85,
    assignmentsSubmittedCount: 4,
    totalAssignmentsCount: 4,
    quizzesTakenCount: 3,
    averageQuizScore: 85,
    recentActivity: 'Active on cyber lab workstations',
  });

  // Bulk Import Form State
  const [rawCsvText, setRawCsvText] = useState<string>('');
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [csvParseError, setCsvParseError] = useState<string | null>(null);

  const showNotification = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4500);
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.rollNo && s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.specializationFocus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesFocus = focusFilter === 'all' || s.specializationFocus === focusFilter;
    return matchesSearch && matchesStatus && matchesFocus;
  });

  // Calculate Metrics
  const total = students.length || 1;
  const excellingCount = students.filter((s) => s.status === 'Excelling').length;
  const onTrackCount = students.filter((s) => s.status === 'On Track').length;
  const needsAttentionCount = students.filter((s) => s.status === 'Needs Attention').length;
  const atRiskCount = students.filter((s) => s.status === 'At Risk').length;

  const avgEngagement = Math.round(students.reduce((a, b) => a + b.engagementScore, 0) / total);
  const avgAttendance = Math.round(students.reduce((a, b) => a + b.attendanceRate, 0) / total);
  const avgQuizScore = Math.round(students.reduce((a, b) => a + b.averageQuizScore, 0) / total);

  // Send Academic Support Nudge
  const handleNudgeStudent = (student: StudentEngagementProfile) => {
    setNudgedStudentIds((prev) => [...prev, student.id]);
    showNotification(`Academic advisory alert sent to ${student.name} via student portal.`, 'info');
  };

  // Helper to compute engagement score & status from metrics
  const computeEngagementAndStatus = (
    attendance: number,
    submitted: number,
    totalAsg: number,
    avgQuiz: number
  ): { engagementScore: number; status: 'Excelling' | 'On Track' | 'Needs Attention' | 'At Risk' } => {
    const asgRate = totalAsg > 0 ? (submitted / totalAsg) * 100 : 80;
    // 35% attendance + 35% assignments + 30% quiz score
    const engagement = Math.min(100, Math.max(0, Math.round(
      (attendance * 0.35) + (asgRate * 0.35) + (avgQuiz * 0.30)
    )));

    let status: 'Excelling' | 'On Track' | 'Needs Attention' | 'At Risk' = 'On Track';
    if (engagement >= 88 && attendance >= 80) {
      status = 'Excelling';
    } else if (engagement >= 72 && attendance >= 75) {
      status = 'On Track';
    } else if (engagement >= 55) {
      status = 'Needs Attention';
    } else {
      status = 'At Risk';
    }
    return { engagementScore: engagement, status };
  };

  // Open Add Student Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      rollNo: '',
      email: '',
      semester: 5,
      specializationFocus: 'Cyber Defense',
      attendanceRate: 90,
      assignmentsSubmittedCount: 4,
      totalAssignmentsCount: 4,
      quizzesTakenCount: 3,
      averageQuizScore: 85,
      recentActivity: 'Enrolled in BCA Cyber Security & Data Science',
    });
    setIsAddEditModalOpen(true);
  };

  // Open Edit Student Modal
  const handleOpenEditModal = (student: StudentEngagementProfile) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      rollNo: student.rollNo || '',
      email: student.email || '',
      semester: student.semester,
      specializationFocus: student.specializationFocus,
      attendanceRate: student.attendanceRate,
      assignmentsSubmittedCount: student.assignmentsSubmittedCount,
      totalAssignmentsCount: student.totalAssignmentsCount,
      quizzesTakenCount: student.quizzesTakenCount,
      averageQuizScore: student.averageQuizScore,
      recentActivity: student.recentActivity || 'Updated student profile',
    });
    setIsAddEditModalOpen(true);
  };

  // Save Single Student (Add or Edit)
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotification('Please provide the student name.', 'error');
      return;
    }

    const { engagementScore, status } = computeEngagementAndStatus(
      formData.attendanceRate,
      formData.assignmentsSubmittedCount,
      formData.totalAssignmentsCount,
      formData.averageQuizScore
    );

    if (editingStudent) {
      // Update existing
      const updated: StudentEngagementProfile = {
        ...editingStudent,
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim() ? formData.rollNo.trim().toUpperCase() : undefined,
        email: formData.email.trim() ? formData.email.trim().toLowerCase() : undefined,
        semester: Number(formData.semester),
        specializationFocus: formData.specializationFocus,
        attendanceRate: Number(formData.attendanceRate),
        assignmentsSubmittedCount: Number(formData.assignmentsSubmittedCount),
        totalAssignmentsCount: Number(formData.totalAssignmentsCount),
        quizzesTakenCount: Number(formData.quizzesTakenCount),
        averageQuizScore: Number(formData.averageQuizScore),
        engagementScore,
        status,
        recentActivity: formData.recentActivity || 'Profile telemetry updated',
        lastActive: 'Just now',
      };
      onUpdateStudent(updated);
      showNotification(`Student ${updated.name} profile updated successfully.`);
    } else {
      // Create new
      const newStudent: StudentEngagementProfile = {
        id: `stud-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim() ? formData.rollNo.trim().toUpperCase() : undefined,
        email: formData.email.trim() ? formData.email.trim().toLowerCase() : undefined,
        semester: Number(formData.semester),
        specializationFocus: formData.specializationFocus,
        attendanceRate: Number(formData.attendanceRate),
        assignmentsSubmittedCount: Number(formData.assignmentsSubmittedCount),
        totalAssignmentsCount: Number(formData.totalAssignmentsCount),
        quizzesTakenCount: Number(formData.quizzesTakenCount),
        averageQuizScore: Number(formData.averageQuizScore),
        engagementScore,
        status,
        recentActivity: formData.recentActivity || 'Added to BCA Cyber Security & Data Science cohort',
        lastActive: 'Just added',
      };
      onAddStudent(newStudent);
      showNotification(`Student ${newStudent.name} added to cohort roster.`);
    }

    setIsAddEditModalOpen(false);
    setEditingStudent(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    onDeleteStudent(studentToDelete.id);
    showNotification(`Removed ${studentToDelete.name} from the roster.`, 'info');
    setStudentToDelete(null);
  };

  // Parse and Process Bulk CSV Text
  const handleProcessBulkImport = () => {
    setCsvParseError(null);
    if (!rawCsvText.trim()) {
      setCsvParseError('Please enter CSV data or upload a valid CSV roster file.');
      return;
    }

    try {
      const lines = rawCsvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length === 0) {
        setCsvParseError('No rows detected.');
        return;
      }

      // Check if first line is a header
      let startIndex = 0;
      const firstLineLower = lines[0].toLowerCase();
      if (firstLineLower.includes('roll') || firstLineLower.includes('name') || firstLineLower.includes('email')) {
        startIndex = 1;
      }

      const parsedList: StudentEngagementProfile[] = [];

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length < 2) continue;

        const rollNo = parts[0] || `BCA-2024-${(students.length + i + 1).toString().padStart(3, '0')}`;
        const name = parts[1] || `Student ${i}`;
        const email = parts[2] || `${name.toLowerCase().replace(/\s+/g, '.')}@bca.edu`;
        const semester = parseInt(parts[3], 10) || 5;
        const specialization = (parts[4] as any) || 'Cyber Defense';
        const attendanceRate = parseInt(parts[5], 10) || 85;
        const assignmentsSubmitted = parseInt(parts[6], 10) || 4;
        const totalAssignments = parseInt(parts[7], 10) || 4;
        const quizzesTaken = parseInt(parts[8], 10) || 3;
        const avgQuizScore = parseInt(parts[9], 10) || 82;

        const validFocus: 'Cyber Defense' | 'Data Analytics' | 'Threat Intelligence' | 'AI Security' = 
          ['Cyber Defense', 'Data Analytics', 'Threat Intelligence', 'AI Security'].includes(specialization)
            ? specialization
            : 'Cyber Defense';

        const { engagementScore, status } = computeEngagementAndStatus(
          attendanceRate,
          assignmentsSubmitted,
          totalAssignments,
          avgQuizScore
        );

        parsedList.push({
          id: `stud-csv-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          rollNo: rollNo.toUpperCase(),
          name,
          email: email.toLowerCase(),
          semester,
          specializationFocus: validFocus,
          attendanceRate,
          assignmentsSubmittedCount: assignmentsSubmitted,
          totalAssignmentsCount: totalAssignments,
          quizzesTakenCount: quizzesTaken,
          averageQuizScore: avgQuizScore,
          engagementScore,
          status,
          recentActivity: 'Imported via CSV batch roster',
          lastActive: '1 day ago',
        });
      }

      if (parsedList.length === 0) {
        setCsvParseError('Could not parse any valid student records from the provided CSV data.');
        return;
      }

      onBulkImportStudents(parsedList, importMode);
      showNotification(`Successfully imported ${parsedList.length} students into the department roster!`);
      setIsBulkImportOpen(false);
      setRawCsvText('');
    } catch (err: any) {
      setCsvParseError(`Parsing error: ${err.message || 'Malformed CSV format'}`);
    }
  };

  // Load sample CSV template
  const handleLoadSampleCSV = () => {
    const sample = `Name,Specialization,Semester,Attendance,AssignmentsSubmitted,TotalAssignments,QuizzesTaken,AvgQuizScore
Tanvi Deshmukh,Cyber Defense,5,92,4,4,4,94
Karthik Subramanian,Data Analytics,5,88,4,4,3,86
Ananya Roy,Threat Intelligence,5,79,3,4,3,76
Devansh Mehta,AI Security,5,64,2,4,2,62
Meera Pillai,Cyber Defense,5,96,4,4,4,98`;
    setRawCsvText(sample);
  };

  // Handle File Upload for CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawCsvText(content);
      }
    };
    reader.readAsText(file);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    const headers = ['Name', 'Specialization Focus', 'Semester', 'Attendance %', 'Assignments Submitted', 'Total Assignments', 'Quizzes Taken', 'Avg Quiz Score', 'Engagement Score', 'Status', 'Recent Activity'];
    const rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.specializationFocus}"`,
      s.semester,
      s.attendanceRate,
      s.assignmentsSubmittedCount,
      s.totalAssignmentsCount,
      s.quizzesTakenCount,
      s.averageQuizScore,
      s.engagementScore,
      s.status,
      `"${s.recentActivity || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BCA_CyberSec_DS_Students_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Department Student Roster &amp; Engagement Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Manage your official BCA Cyber Security with Data Science student list. Add, edit, bulk import roster CSVs, and monitor real-time academic engagement.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {role === 'faculty' && (
            <>
              <button
                id="btn-add-student"
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-sm shadow-sky-200 transition transform active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Student</span>
              </button>

              <button
                id="btn-bulk-import-csv"
                onClick={() => {
                  setIsBulkImportOpen(true);
                  setCsvParseError(null);
                }}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm border border-slate-200 transition"
              >
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Bulk Import CSV</span>
              </button>
            </>
          )}

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm border border-slate-200 transition shadow-xs"
            title="Download full student CSV report"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationMsg && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center justify-between gap-2 shadow-sm animate-fade-in ${
          notificationMsg.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : notificationMsg.type === 'info'
            ? 'bg-amber-50 border-amber-200 text-amber-800'
            : 'bg-sky-50 border-sky-200 text-sky-800'
        }`}>
          <div className="flex items-center gap-2">
            {notificationMsg.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            ) : notificationMsg.type === 'info' ? (
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0" />
            )}
            <span>{notificationMsg.text}</span>
          </div>
          <button onClick={() => setNotificationMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Cohort Engagement Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{students.length}</span>
            <span className="text-xs text-sky-700 font-semibold">Active Roster &bull; Sem 5</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-600 rounded-full" style={{ width: `${Math.min(100, (students.length / 50) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Engagement</span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgEngagement}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Average Index</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-600 rounded-full" style={{ width: `${avgEngagement}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgAttendance}%</span>
            <span className="text-xs text-slate-500">Regular Classes</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${avgAttendance}%` }} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Distribution</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold pt-1">
            <span className="text-emerald-600">{excellingCount} Excelling</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-sky-600">{onTrackCount} On Track</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-rose-600">{atRiskCount} At Risk</span>
          </div>
          <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-100">
            <div className="bg-emerald-500" style={{ width: `${(excellingCount / total) * 100}%` }} />
            <div className="bg-sky-500" style={{ width: `${(onTrackCount / total) * 100}%` }} />
            <div className="bg-amber-500" style={{ width: `${(needsAttentionCount / total) * 100}%` }} />
            <div className="bg-rose-500" style={{ width: `${(atRiskCount / total) * 100}%` }} />
          </div>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            id="search-students-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or specialization track..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Focus Track Dropdown */}
          <select
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Tracks</option>
            <option value="Cyber Defense">Cyber Defense</option>
            <option value="Data Analytics">Data Analytics</option>
            <option value="Threat Intelligence">Threat Intelligence</option>
            <option value="AI Security">AI Security</option>
          </select>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {(['all', 'Excelling', 'On Track', 'Needs Attention', 'At Risk'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Students Telemetry Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Showing {filteredStudents.length} of {students.length} Students
          </span>
          {onResetDefaultStudents && (
            <button
              onClick={onResetDefaultStudents}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
              title="Reset to initial department roster"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Sample Roster</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-3">Track / Focus</th>
                <th className="py-3.5 px-3">Attendance</th>
                <th className="py-3.5 px-3">Assignments</th>
                <th className="py-3.5 px-3">Quizzes Taken</th>
                <th className="py-3.5 px-3">Avg Quiz</th>
                <th className="py-3.5 px-3">Engagement Index</th>
                <th className="py-3.5 px-3">Status</th>
                {role === 'faculty' && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No student records found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isNudged = nudgedStudentIds.includes(student.id);
                  const initials = student.name
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase() || 'ST';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Student Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-700 font-bold text-[11px] flex items-center justify-center border border-sky-200/80 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{student.name}</p>
                            {student.rollNo && (
                              <p className="text-[10px] font-mono text-slate-400">{student.rollNo}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Track */}
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                          {student.specializationFocus}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="py-3.5 px-3">
                        <span className={`font-bold font-mono ${
                          student.attendanceRate >= 85 ? 'text-emerald-600' : student.attendanceRate >= 75 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      {/* Assignments */}
                      <td className="py-3.5 px-3 font-mono">
                        <span className="text-slate-900 font-bold">{student.assignmentsSubmittedCount}</span>
                        <span className="text-slate-400"> / {student.totalAssignmentsCount}</span>
                      </td>

                      {/* Quizzes Taken */}
                      <td className="py-3.5 px-3 font-mono text-slate-800">
                        {student.quizzesTakenCount} Tests
                      </td>

                      {/* Avg Quiz Score */}
                      <td className="py-3.5 px-3 font-mono font-bold text-sky-700">
                        {student.averageQuizScore}%
                      </td>

                      {/* Engagement Bar */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1 min-w-[90px]">
                          <div className="flex justify-between text-[10px] font-bold text-slate-700">
                            <span>{student.engagementScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                student.engagementScore >= 88
                                  ? 'bg-emerald-500'
                                  : student.engagementScore >= 72
                                  ? 'bg-sky-500'
                                  : student.engagementScore >= 55
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${student.engagementScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            student.status === 'Excelling'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : student.status === 'On Track'
                              ? 'bg-sky-50 text-sky-700 border border-sky-200'
                              : student.status === 'Needs Attention'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Faculty Action Buttons */}
                      {role === 'faculty' && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Edit Button */}
                            <button
                              onClick={() => handleOpenEditModal(student)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-sky-700 border border-slate-200 transition"
                              title="Edit Student Information"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => setStudentToDelete(student)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Nudge Button */}
                            {isNudged ? (
                              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 pl-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Nudged</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleNudgeStudent(student)}
                                className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-sky-700 border border-slate-200 transition whitespace-nowrap"
                                title="Send Academic Check-in Message"
                              >
                                Nudge
                              </button>
                            )}

                          </div>
                        </td>
                      )}

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT STUDENT MODAL */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                  {editingStudent ? <Edit2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingStudent ? `Edit Student: ${editingStudent.name}` : 'Add New Student to Roster'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    BCA Cyber Security with Data Science Cohort
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              
              {/* Full Name & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tanvi Deshmukh"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                  >
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Specialization Track */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization Focus Track</label>
                <select
                  value={formData.specializationFocus}
                  onChange={(e) => setFormData({ ...formData, specializationFocus: e.target.value as any })}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="Cyber Defense">Cyber Defense</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Threat Intelligence">Threat Intelligence</option>
                  <option value="AI Security">AI Security</option>
                </select>
              </div>

              {/* Optional Identifiers (can be added later) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Register Number <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 2401 (Optional)"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-500 mb-1">
                    Institutional Email <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. student@bca.edu (Optional)"
                    className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Academic Metrics Group */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 block">Current Academic Telemetry</span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Attendance %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.attendanceRate}
                      onChange={(e) => setFormData({ ...formData, attendanceRate: Number(e.target.value) })}
                      className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Lab Submissions</label>
                    <input
                      type="number"
                      min={0}
                      max={formData.totalAssignmentsCount || 10}
                      value={formData.assignmentsSubmittedCount}
                      onChange={(e) => setFormData({ ...formData, assignmentsSubmittedCount: Number(e.target.value) })}
                      className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Quizzes Taken</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={formData.quizzesTakenCount}
                      onChange={(e) => setFormData({ ...formData, quizzesTakenCount: Number(e.target.value) })}
                      className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Avg Quiz Score %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formData.averageQuizScore}
                      onChange={(e) => setFormData({ ...formData, averageQuizScore: Number(e.target.value) })}
                      className="w-full bg-white text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 mb-1">Recent Activity / Status Note</label>
                  <input
                    type="text"
                    value={formData.recentActivity}
                    onChange={(e) => setFormData({ ...formData, recentActivity: e.target.value })}
                    placeholder="e.g. Completed Memory Forensics Lab Milestone"
                    className="w-full bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-sm shadow-sky-200"
                >
                  {editingStudent ? 'Update Student Record' : 'Save to Department Roster'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK CSV IMPORT MODAL */}
      {/* ========================================================================= */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Bulk Import Department Students
                  </h3>
                  <p className="text-xs text-slate-500">
                    Import batches of student records via CSV upload or comma-separated text.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkImportOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* CSV Format Guide */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Expected CSV Columns Format:</span>
                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  className="text-[11px] font-bold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Load Sample Template
                </button>
              </div>
              <code className="text-[11px] text-slate-600 block font-mono bg-white p-2 rounded border border-slate-200">
                Roll No, Name, Email, Semester, Specialization, Attendance%, AsgSubmitted, TotalAsg, QuizzesTaken, AvgQuizScore
              </code>
            </div>

            {/* File Upload Trigger */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition">
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>Upload .CSV File</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">or paste records directly below:</span>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={7}
                value={rawCsvText}
                onChange={(e) => setRawCsvText(e.target.value)}
                placeholder={`BCA-2024-015, Arjun Sen, arjun.sen@bca.edu, 5, Cyber Defense, 90, 4, 4, 3, 88\nBCA-2024-016, Priyanka Das, priyanka.d@bca.edu, 5, Data Analytics, 85, 4, 4, 3, 82`}
                className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white text-xs font-mono"
              />
            </div>

            {/* Import Mode Options */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <span>Import Mode:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="text-sky-600"
                />
                <span>Append to Existing Roster (Skip Duplicate Roll Nos)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-sky-600"
                />
                <span>Replace Entire Roster</span>
              </label>
            </div>

            {csvParseError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{csvParseError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkImportOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcessBulkImport}
                className="px-5 py-2 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition shadow-sm shadow-sky-200 text-xs"
              >
                Process &amp; Import Students
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE STUDENT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-full bg-rose-50 border border-rose-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Remove Student?</h3>
            </div>
            
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong className="text-slate-900">{studentToDelete.name}</strong> ({studentToDelete.rollNo}) from the department roster? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
