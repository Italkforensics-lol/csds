import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ExternalLink, 
  UploadCloud, 
  Award, 
  Search, 
  User, 
  FileCheck, 
  MessageSquare,
  Code2,
  Trash2,
  File,
  Download,
  FileSpreadsheet,
  FileType,
  Sparkles,
  Info,
  Check,
  X
} from 'lucide-react';
import { Assignment, AssignmentSubmission, Course, UserRole, StudentEngagementProfile, FacultyProfile } from '../types';

interface AssignmentsManagerProps {
  assignments: Assignment[];
  courses: Course[];
  onAddAssignment: (assignment: Assignment) => void;
  onSubmitAssignment: (submission: AssignmentSubmission) => void;
  onGradeSubmission: (assignmentId: string, submissionId: string, grade: number, feedback: string) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  role: UserRole;
  students?: StudentEngagementProfile[];
  activeFaculty?: FacultyProfile | null;
}

export const AssignmentsManager: React.FC<AssignmentsManagerProps> = ({
  assignments,
  courses,
  onAddAssignment,
  onSubmitAssignment,
  onGradeSubmission,
  onDeleteAssignment,
  role,
  students = [],
  activeFaculty,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [activeAssignmentId, setActiveAssignmentId] = useState<string>(assignments[0]?.id || '');
  
  // Post New Assignment Modal (Faculty)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCourseId, setNewCourseId] = useState<string>(courses[0]?.id || '26DSC01');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newObjectives, setNewObjectives] = useState<string>('Implement core data structures / algorithms\nDocument complexity & performance\nFormat final solution as DOC or PDF report');
  const [newStarterUrl, setNewStarterUrl] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>(
    new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]
  );
  const [newPoints, setNewPoints] = useState<number>(100);

  // Submit Assignment (Student) Modal
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [selectedStudentName, setSelectedStudentName] = useState<string>(students[0]?.name || 'Sruthi');
  const [selectedStudentRoll, setSelectedStudentRoll] = useState<string>(students[0]?.rollNo || 'CSDS-2026-001');
  const [submissionContent, setSubmissionContent] = useState<string>('');
  
  // File Upload State (DOC / PDF)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: string;
    dataUrl?: string;
  } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Grade Modal (Faculty)
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [givenGrade, setGivenGrade] = useState<number>(90);
  const [givenFeedback, setGivenFeedback] = useState<string>('Well structured lab report with accurate complexity analysis.');

  // Notification Toast
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const filteredAssignments = assignments.filter((a) => {
    return selectedCourseFilter === 'all' || a.courseId === selectedCourseFilter;
  });

  const activeAssignment = assignments.find((a) => a.id === activeAssignmentId) || filteredAssignments[0] || assignments[0];

  // Quick Preset Generator for Faculty
  const applyPreset = (type: 'ds-python' | 'green-compute' | 'design-thinking') => {
    if (type === 'ds-python') {
      setNewCourseId('26DSCP1');
      setNewTitle('Lab 01: Singly Linked List ADT Implementation in Python');
      setNewDescription('Implement a custom Object-Oriented Singly Linked List with methods for insert, delete, search, reverse, and traverse. Measure Big-O execution time vs dynamic Python lists.');
      setNewObjectives('Define Node and SinglyLinkedList classes with Python type hinting\nHandle boundary conditions: empty list, single node, head/tail deletions\nInclude terminal output logs and time complexity table in DOC/PDF report');
      setNewStarterUrl('https://github.com/csds-department/ds-python-lab01');
      setNewPoints(100);
    } else if (type === 'green-compute') {
      setNewCourseId('26DSAE1');
      setNewTitle('Assignment 01: Data Center Energy & PUE Metric Audit Report');
      setNewDescription('Perform an institutional laboratory energy audit. Calculate daily kWh power consumption, cooling load, and evaluate Power Usage Effectiveness (PUE) improvements.');
      setNewObjectives('Calculate total facility power vs IT hardware equipment load\nAnalyze operational vs embodied carbon footprint\nPropose 3 hardware virtualization and e-waste policies in a formal DOC/PDF report');
      setNewStarterUrl('');
      setNewPoints(100);
    } else {
      setNewCourseId('26DSDT1');
      setNewTitle('Challenge 01: Design Thinking Empathy Mapping for Smart Campus Security');
      setNewDescription('Apply the 5 stages of Design Thinking (Empathize, Define, Ideate, Prototype, Test) to identify physical and digital access security pain points on campus.');
      setNewObjectives('Create an Empathy Map based on student/faculty interviews\nFormulate a Problem Statement (Point of View)\nSubmit a structured PDF/DOC report with visual user journey diagrams');
      setNewStarterUrl('');
      setNewPoints(50);
    }
  };

  // Handle File Change (DOC or PDF)
  const processSelectedFile = (file: File) => {
    setFileError(null);
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValid) {
      setFileError('Invalid file format. Please upload a PDF (.pdf) or Word document (.doc, .docx).');
      setUploadedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFileError('File size exceeds the 15MB limit. Please upload a smaller document.');
      setUploadedFile(null);
      return;
    }

    // Format file size
    const sizeInKb = (file.size / 1024).toFixed(1);
    const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`;

    let docType = 'pdf';
    if (fileNameLower.endsWith('.docx') || fileNameLower.endsWith('.doc')) {
      docType = 'doc';
    }

    // Read file as Base64 data URL for preview/download
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        type: docType,
        dataUrl: reader.result as string,
      });
    };
    reader.onerror = () => {
      setFileError('Failed to read document file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const assignment: Assignment = {
      id: `asg-${Date.now()}`,
      courseId: newCourseId,
      title: newTitle,
      description: newDescription,
      objectives: newObjectives.split('\n').map((o) => o.trim()).filter(Boolean),
      starterFilesUrl: newStarterUrl.trim() || undefined,
      dueDate: newDueDate,
      totalPoints: newPoints || 100,
      submissionType: 'Document (PDF / DOC)',
      allowedFormats: ['.pdf', '.doc', '.docx'],
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: activeFaculty?.name || 'Faculty Instructor',
      submissions: [],
    };

    onAddAssignment(assignment);
    setActiveAssignmentId(assignment.id);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Assignment "${assignment.title}" published successfully!`);
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment) return;

    if (!uploadedFile) {
      setFileError('Please attach a PDF or Word document before submitting.');
      return;
    }

    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: activeAssignment.id,
      studentId: `std-${Date.now()}`,
      studentName: selectedStudentName,
      studentRoll: selectedStudentRoll,
      submittedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      fileAttachment: uploadedFile.name,
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type,
      fileDataUrl: uploadedFile.dataUrl,
      content: submissionContent.trim() || 'Document submitted with student lab solution.',
      status: 'Submitted',
      maxGrade: activeAssignment.totalPoints,
    };

    onSubmitAssignment(newSub);
    setShowSubmitModal(false);
    setSubmissionContent('');
    setUploadedFile(null);
    setFileError(null);
    showToast(`Assignment submission received for ${selectedStudentName}!`);
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAssignment || !gradingSubmission) return;

    onGradeSubmission(activeAssignment.id, gradingSubmission.id, givenGrade, givenFeedback);
    setGradingSubmission(null);
    showToast(`Grade (${givenGrade}/${activeAssignment.totalPoints}) recorded successfully.`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete assignment: "${title}"?`)) {
      if (onDeleteAssignment) {
        onDeleteAssignment(id);
      }
      showToast(`Assignment "${title}" removed.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Banner */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Assignments &amp; Practical Lab Submissions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Faculty can create and publish course assignments with custom objectives and deadlines. Students can upload solutions as PDF (.pdf) or Word documents (.doc, .docx) with automatic grading evaluation.
            </p>
          </div>

          {role === 'faculty' && (
            <button
              id="btn-open-create-assignment"
              onClick={() => {
                setShowCreateModal(true);
                if (courses.length > 0) {
                  setNewCourseId(courses[0].id);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-sky-200 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment +</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      {assignments.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">No Assignments Posted Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {role === 'faculty'
                ? 'Create and publish your first assignment or lab task for Semester 1 students. You can define objectives, due dates, and accept PDF or DOC submissions.'
                : 'There are currently no active assignments posted by faculty for your enrolled courses. Check back soon for course updates.'}
            </p>
          </div>

          {role === 'faculty' && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-sky-200 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Assignment</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>or quick load:</span>
                <button
                  onClick={() => {
                    applyPreset('ds-python');
                    setShowCreateModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Data Structures Lab
                </button>
                <button
                  onClick={() => {
                    applyPreset('green-compute');
                    setShowCreateModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Green Computing Audit
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left 4 Cols: Assignment List & Filter */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Filter by Course
              </label>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
              >
                <option value="all">All Courses ({assignments.length} Total)</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignments List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredAssignments.map((asg) => {
                const isSelected = activeAssignment?.id === asg.id;
                const relatedCourse = courses.find((c) => c.id === asg.courseId);
                return (
                  <div
                    key={asg.id}
                    onClick={() => setActiveAssignmentId(asg.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition text-xs space-y-2 relative ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-400 shadow-xs ring-1 ring-sky-300'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {relatedCourse?.code || 'CSDS'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Due {asg.dueDate}</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {asg.title}
                    </h4>

                    <p className="text-slate-500 text-xs line-clamp-2">
                      {asg.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <FileType className="w-3.5 h-3.5 text-sky-600" />
                        <span>DOC / PDF</span>
                      </span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                        {asg.submissions.length} {asg.submissions.length === 1 ? 'Submission' : 'Submissions'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 8 Cols: Assignment Detail & Submission Table */}
          <div className="lg:col-span-8 space-y-6">
            {activeAssignment ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-sky-50 text-sky-700 border border-sky-200">
                        {courses.find((c) => c.id === activeAssignment.courseId)?.code || 'Course'}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <FileType className="w-3 h-3 text-sky-600" />
                        <span>Accepts: .pdf, .doc, .docx</span>
                      </span>
                      <span className="text-xs text-slate-500">
                        Max Marks: <strong className="text-sky-700">{activeAssignment.totalPoints} pts</strong>
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{activeAssignment.title}</h3>
                    <p className="text-xs text-slate-400">
                      Posted on {activeAssignment.createdAt} • Deadline: <strong className="text-rose-600">{activeAssignment.dueDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {role === 'student' && (
                      <button
                        id="btn-open-submit-modal"
                        onClick={() => {
                          setUploadedFile(null);
                          setFileError(null);
                          setShowSubmitModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition transform active:scale-95"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Submit Assignment (PDF/DOC)</span>
                      </button>
                    )}

                    {role === 'faculty' && onDeleteAssignment && (
                      <button
                        onClick={() => handleDelete(activeAssignment.id, activeAssignment.title)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description & Objectives */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-1">Problem Statement &amp; Guidelines:</span>
                    {activeAssignment.description}
                  </div>

                  {/* Objectives */}
                  {activeAssignment.objectives && activeAssignment.objectives.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Evaluation Objectives &amp; Criteria
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeAssignment.objectives.map((obj, i) => (
                          <div key={i} className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                            <span>{obj}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Starter Repo Link */}
                  {activeAssignment.starterFilesUrl && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Code2 className="w-4 h-4 text-sky-600" />
                        <span>Starter Repository / Reference Lab Files:</span>
                      </div>
                      <a
                        href={activeAssignment.starterFilesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Submissions Section */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-sky-600" />
                      <span>Student Submissions ({activeAssignment.submissions.length})</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      Cohort Semester 1
                    </span>
                  </div>

                  {activeAssignment.submissions.length > 0 ? (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold">
                            <tr>
                              <th className="p-3">Student</th>
                              <th className="p-3">Submitted At</th>
                              <th className="p-3">Document Attached</th>
                              <th className="p-3">Score / Evaluation</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeAssignment.submissions.map((sub) => {
                              const isDoc = sub.fileName?.toLowerCase().endsWith('.doc') || sub.fileName?.toLowerCase().endsWith('.docx');
                              return (
                                <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                                  <td className="p-3">
                                    <p className="font-semibold text-slate-900">{sub.studentName}</p>
                                    {sub.studentRoll && (
                                      <p className="text-[10px] text-slate-400 font-mono">{sub.studentRoll}</p>
                                    )}
                                  </td>
                                  <td className="p-3 text-slate-600">{sub.submittedAt}</td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-1.5">
                                      <span className={`p-1 rounded text-[10px] font-bold uppercase ${
                                        isDoc ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                      }`}>
                                        {isDoc ? 'DOC' : 'PDF'}
                                      </span>
                                      <div className="truncate max-w-[150px]">
                                        <p className="text-[11px] font-medium text-slate-800 truncate" title={sub.fileName || sub.fileAttachment}>
                                          {sub.fileName || sub.fileAttachment || 'document.pdf'}
                                        </p>
                                        {sub.fileSize && (
                                          <p className="text-[10px] text-slate-400">{sub.fileSize}</p>
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    {sub.status === 'Graded' ? (
                                      <div className="space-y-0.5">
                                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px]">
                                          {sub.grade} / {activeAssignment.totalPoints} pts
                                        </span>
                                        {sub.feedback && (
                                          <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{sub.feedback}"</p>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold text-[10px]">
                                        Pending Review
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {sub.fileDataUrl && (
                                        <a
                                          href={sub.fileDataUrl}
                                          download={sub.fileName || 'assignment-submission.pdf'}
                                          className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 bg-slate-100 hover:bg-sky-50 transition border border-slate-200"
                                          title="Download Document"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                      {role === 'faculty' ? (
                                        <button
                                          onClick={() => {
                                            setGradingSubmission(sub);
                                            setGivenGrade(sub.grade || 90);
                                            setGivenFeedback(sub.feedback || 'Well organized report with solid practical implementation.');
                                          }}
                                          className="text-xs font-semibold text-sky-700 hover:text-sky-800 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 transition border border-sky-200"
                                        >
                                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade & Feedback'}
                                        </button>
                                      ) : (
                                        <span className="text-slate-400 text-[11px] font-medium">Submitted</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1">
                      <p className="font-semibold text-slate-700">No submissions uploaded yet</p>
                      <p className="text-slate-400">
                        {role === 'faculty'
                          ? 'Student solutions will appear here as PDF or DOC documents once submitted.'
                          : 'Click "Submit Assignment" above to upload your completed PDF or Word report.'}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
                Select an assignment to view details.
              </div>
            )}
          </div>

        </div>
      )}

      {/* Post Assignment Modal (Faculty) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-200">
                  <FileText className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Create New Course Assignment &amp; Lab
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Template Selector */}
            <div className="flex items-center gap-2 flex-wrap p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Quick Templates:</span>
              </span>
              <button
                type="button"
                onClick={() => applyPreset('ds-python')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Data Structures Lab
              </button>
              <button
                type="button"
                onClick={() => applyPreset('green-compute')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Green Computing Audit
              </button>
              <button
                type="button"
                onClick={() => applyPreset('design-thinking')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Design Thinking Map
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Subject / Course</label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs font-medium"
                    required
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Accepted Submission Formats</label>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                    <FileType className="w-4 h-4 text-sky-600" />
                    <span className="font-semibold text-slate-800">PDF (.pdf) &amp; Word (.doc, .docx)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lab 01: Implementation of Singly Linked List ADT in Python"
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Detailed Problem Statement &amp; Guidelines</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe the practical challenge, data structures required, or case study analysis criteria..."
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Evaluation Objectives &amp; Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newObjectives}
                  onChange={(e) => setNewObjectives(e.target.value)}
                  placeholder="Implement SinglyLinkedList class with Node pointers&#10;Measure Big-O performance&#10;Format final report as PDF or DOC"
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Starter Repo / Materials (Optional)</label>
                  <input
                    type="url"
                    value={newStarterUrl}
                    onChange={(e) => setNewStarterUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks / Points</label>
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm shadow-sky-200 transition transform active:scale-95"
                >
                  Publish Assignment for Students
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Student Submit Modal (PDF or DOC) */}
      {showSubmitModal && activeAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-base">Submit Solution Document</h3>
                <p className="text-xs text-slate-500 truncate max-w-sm">{activeAssignment.title}</p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs">
              
              {/* Student Identification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Name</label>
                  {students.length > 0 ? (
                    <select
                      value={selectedStudentName}
                      onChange={(e) => {
                        setSelectedStudentName(e.target.value);
                        const matched = students.find((s) => s.name === e.target.value);
                        if (matched && matched.rollNo) {
                          setSelectedStudentRoll(matched.rollNo);
                        }
                      }}
                      className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 font-medium"
                      required
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} {s.rollNo ? `(${s.rollNo})` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={selectedStudentName}
                      onChange={(e) => setSelectedStudentName(e.target.value)}
                      placeholder="e.g. Sruthi"
                      className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200"
                      required
                    />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roll / Register Number</label>
                  <input
                    type="text"
                    value={selectedStudentRoll}
                    onChange={(e) => setSelectedStudentRoll(e.target.value)}
                    placeholder="e.g. CSDS-2026-001"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Document Upload Dropzone (DOC or PDF) */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">
                  Upload Lab Solution Document <span className="text-rose-500">*</span>
                  <span className="text-slate-400 font-normal ml-1">(Accepts .pdf, .doc, .docx up to 15MB)</span>
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                />

                {!uploadedFile ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                      isDragging
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-300'
                        : 'border-slate-200 hover:border-sky-400 bg-slate-50/60 hover:bg-sky-50/20'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-slate-800">
                      Click to browse or drag &amp; drop document here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      PDF (.pdf) or Microsoft Word document (.doc, .docx)
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        uploadedFile.type === 'doc'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-rose-600 text-white shadow-xs'
                      }`}>
                        {uploadedFile.type === 'doc' ? 'DOC' : 'PDF'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate text-xs">{uploadedFile.name}</p>
                        <p className="text-[10px] text-slate-500">{uploadedFile.size} • Ready for upload</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <p className="text-rose-600 text-[11px] flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>

              {/* Student Remarks / Methodology */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Remarks / Methodology Summary (Optional)
                </label>
                <textarea
                  rows={3}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Describe your implementation approach, test assertions, or key takeaways..."
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadedFile}
                  className="px-5 py-2.5 font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-sky-200 transition transform active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Submit Document</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Grade Submission Modal (Faculty) */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Evaluate Student Submission</h3>
                <p className="text-xs text-slate-500 font-medium">{gradingSubmission.studentName} {gradingSubmission.studentRoll && `(${gradingSubmission.studentRoll})`}</p>
              </div>
              <button onClick={() => setGradingSubmission(null)} className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-lg">✕</button>
            </div>

            {/* Submitted Document Info */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">Submitted Document:</span>
                {gradingSubmission.fileDataUrl && (
                  <a
                    href={gradingSubmission.fileDataUrl}
                    download={gradingSubmission.fileName || 'submission.pdf'}
                    className="flex items-center gap-1 text-sky-600 hover:text-sky-700 font-bold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Open</span>
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                <FileType className="w-4 h-4 text-sky-600 flex-shrink-0" />
                <span className="truncate">{gradingSubmission.fileName || gradingSubmission.fileAttachment || 'document.pdf'}</span>
                {gradingSubmission.fileSize && <span className="text-slate-400 text-[10px]">({gradingSubmission.fileSize})</span>}
              </div>
              {gradingSubmission.content && (
                <div className="pt-1">
                  <span className="font-semibold text-slate-600 block mb-0.5 text-[11px]">Student Notes:</span>
                  <p className="text-slate-600 italic">{gradingSubmission.content}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Marks Awarded (Max {activeAssignment?.totalPoints || 100} Points)
                </label>
                <input
                  type="number"
                  min={0}
                  max={activeAssignment?.totalPoints || 100}
                  value={givenGrade}
                  onChange={(e) => setGivenGrade(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-xl border border-slate-200 font-bold text-sm focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Feedback &amp; Review Remarks</label>
                <textarea
                  rows={3}
                  value={givenFeedback}
                  onChange={(e) => setGivenFeedback(e.target.value)}
                  placeholder="Provide constructive feedback on algorithmic accuracy, time complexity analysis, or report quality..."
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm shadow-sky-200 transition transform active:scale-95"
                >
                  Save Grade &amp; Send Feedback
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
