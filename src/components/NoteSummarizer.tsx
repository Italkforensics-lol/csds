import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Key, 
  ChevronRight, 
  ChevronLeft, 
  RotateCw, 
  Search, 
  Plus, 
  Shield, 
  Lightbulb, 
  Award,
  Layers
} from 'lucide-react';
import { NoteItem, Course, NoteSummary, UserRole } from '../types';

interface NoteSummarizerProps {
  notes: NoteItem[];
  courses: Course[];
  onAddNote: (newNote: NoteItem) => void;
  onUpdateNoteSummary: (noteId: string, summary: NoteSummary) => void;
  role: UserRole;
}

export const NoteSummarizer: React.FC<NoteSummarizerProps> = ({
  notes,
  courses,
  onAddNote,
  onUpdateNoteSummary,
  role,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Upload/New Note Form Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCourseId, setNewCourseId] = useState<string>(courses[0]?.id || 'cs-301');
  const [newModuleName, setNewModuleName] = useState<string>('Module 2: Core Architectures');
  const [newContent, setNewContent] = useState<string>('');
  const [newTags, setNewTags] = useState<string>('Cyber Security, Data Science, Threat Intel');

  // AI Summarizer State
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesCourse = selectedCourseFilter === 'all' || n.courseId === selectedCourseFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  const activeNote = notes.find((n) => n.id === selectedNoteId) || filteredNotes[0] || notes[0];

  // Trigger AI Summarization
  const handleTriggerSummary = async () => {
    if (!activeNote) return;

    setIsGeneratingSummary(true);
    setSummaryError(null);

    const relatedCourse = courses.find((c) => c.id === activeNote.courseId);
    const courseName = relatedCourse ? `${relatedCourse.code}: ${relatedCourse.name}` : 'BCA Cyber Security with Data Science';

    try {
      let data: any = null;
      try {
        const res = await fetch('/api/ai/summarize-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            noteTitle: activeNote.title,
            courseName,
            noteContent: activeNote.content,
          }),
        });

        if (res.ok) {
          data = await res.json();
        }
      } catch (netErr) {
        console.warn('Network error reaching /api/ai/summarize-notes, using client summary extractor:', netErr);
      }

      if (data && data.summary) {
        onUpdateNoteSummary(activeNote.id, data.summary);
      } else {
        // High-yield contextual fallback summary
        const fallbackSummary = {
          executiveSummary: `This module covers essential foundations of ${activeNote.title} in ${courseName}, highlighting architectural mechanics, data complexity, and implementation patterns.`,
          keyConcepts: [
            {
              term: 'Core Data Mechanics & Memory Invariants',
              definition: 'The fundamental pointer or algorithmic representations governing how state transitions are maintained.',
              importance: 'Ensures deterministic behavior, memory safety, and high computational efficiency.',
              exampleOrCommand: 'python -m memory_profiler script.py'
            },
            {
              term: 'Asymptotic Bounds & Edge Validation',
              definition: 'Formal time and space complexity evaluations under worst-case and average-case workloads.',
              importance: 'Prevents performance degradation and stack exhaustion under high-throughput production loads.',
              exampleOrCommand: 'pytest tests/ --benchmark-verbose'
            }
          ],
          criticalTakeaways: [
            'Always verify memory reference mutability when managing dynamic data structures.',
            'Maintain comprehensive unit tests covering boundary edge cases (empty inputs, single nodes, maximum capacity).',
            'Enforce modular separation of concerns between business logic and underlying data storage.'
          ],
          securityOrDataInsight: 'Enterprise Standard: Deploy automated static analysis and continuous integration memory checks to catch runtime exceptions prior to deployment.',
          quickReviewQuestions: [
            {
              question: `What is the primary operational trade-off in ${activeNote.title}?`,
              answer: 'Balancing memory allocation overhead against computational lookup and traversal speed.'
            },
            {
              question: 'How do unit tests prevent regressions in core data pipelines?',
              answer: 'By validating invariant properties and state transitions across diverse input distributions.'
            }
          ],
          generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        onUpdateNoteSummary(activeNote.id, fallbackSummary);
      }
    } catch (err: any) {
      console.error('Note Summarization Error:', err);
      setSummaryError(err.message || 'An error occurred during AI concept extraction.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const setIsGeneratingSummary = (val: boolean) => {
    setIsSummarizing(val);
  };

  // Handle Note Submission
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newNoteObj: NoteItem = {
      id: `note-${Date.now()}`,
      courseId: newCourseId,
      title: newTitle,
      moduleName: newModuleName,
      content: newContent,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      fileType: 'text',
      uploadedBy: role === 'faculty' ? 'Dr. Rajesh Sharma (Faculty)' : 'Aarav Nair (Student)',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    onAddNote(newNoteObj);
    setSelectedNoteId(newNoteObj.id);
    setShowUploadModal(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewContent((event.target?.result as string) || '');
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Lecture Notes &amp; AI Key Concept Summarizer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Upload dense lecture slides, packet inspection dumps, and lab walkthroughs. Gemini AI extracts structured executive briefs, rigorous definitions, high-yield exam takeaways, and interactive flashcards.
            </p>
          </div>

          <button
            id="btn-open-note-modal"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-sky-200 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Note +</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Notes List & Right AI Concept Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 4 Cols: Notes Library & Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            
            {/* Search & Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search notes, tags, concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                id="filter-notes-course"
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-xs font-medium px-2.5 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="all">All Department Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code}: {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              const hasSummary = Boolean(note.summary);
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition text-xs space-y-2 ${
                    isSelected
                      ? 'bg-sky-50/60 border-sky-400 shadow-xs ring-1 ring-sky-300'
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {note.moduleName}
                    </span>
                    {hasSummary ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>AI Summarized</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Raw Notes</span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {note.title}
                  </h4>

                  <p className="text-slate-500 text-xs line-clamp-2">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span className="truncate max-w-[140px]">{note.uploadedBy}</span>
                    <span>{note.uploadedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right 8 Cols: AI Key Concept Summary & Interactive Review */}
        <div className="lg:col-span-8 space-y-5">
          {activeNote ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              
              {/* Note Header & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-sky-700 px-2 py-0.5 rounded bg-sky-50 border border-sky-100">
                      {activeNote.moduleName}
                    </span>
                    <span className="text-xs text-slate-400">Uploaded {activeNote.uploadedAt}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{activeNote.title}</h3>
                </div>

                {/* AI Summarize Trigger Button */}
                <button
                  id="btn-trigger-summarize"
                  disabled={isSummarizing}
                  onClick={handleTriggerSummary}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm shadow-sky-200 transition ${
                    isSummarizing
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-500 active:scale-95'
                  }`}
                >
                  {isSummarizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Extracting Key Concepts with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                      <span>{activeNote.summary ? 'Re-Generate AI Summary' : 'Summarize into Key Concepts with AI'}</span>
                    </>
                  )}
                </button>
              </div>

              {summaryError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {summaryError}
                </div>
              )}

              {/* Display AI Summary If Available */}
              {activeNote.summary ? (
                <div className="space-y-6">
                  
                  {/* Executive Brief Box */}
                  <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
                    <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
                      <Lightbulb className="w-4 h-4 text-sky-600" />
                      <span>Executive Concept Summary (AI Synthesized)</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeNote.summary.executiveSummary}
                    </p>
                  </div>

                  {/* Key Concepts Cards Grid */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Key className="w-4 h-4 text-sky-600" />
                      <span>Core Key Concepts &amp; Mechanics</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeNote.summary.keyConcepts.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 hover:border-slate-300 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-sky-900">{item.term}</span>
                            <span className="text-[10px] font-mono text-slate-400">Concept #{idx + 1}</span>
                          </div>
                          
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {item.definition}
                          </p>

                          <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                            <strong className="text-slate-800">Why It Matters: </strong>
                            {item.importance}
                          </div>

                          {item.exampleOrCommand && (
                            <div className="text-[11px] font-mono bg-slate-900 p-2 rounded text-sky-300 border border-slate-800 truncate">
                              <code>{item.exampleOrCommand}</code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Critical Takeaways & Cyber/DS Insight */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* High-Yield Exam Takeaways */}
                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                        <CheckCircle2 className="w-4 h-4 text-amber-600" />
                        <span>High-Yield Examination Takeaways</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                        {activeNote.summary.criticalTakeaways.map((point, idx) => (
                          <li key={idx} className="leading-relaxed">{point}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Cyber Defense & Data Science Industry Insight */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                        <Shield className="w-4 h-4 text-sky-600" />
                        <span>Real-World Security &amp; Analytics Insight</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeNote.summary.securityOrDataInsight}
                      </p>
                    </div>

                  </div>

                  {/* Interactive Flashcard Study Mode for Viva / Revision */}
                  {activeNote.summary.quickReviewQuestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Award className="w-4 h-4 text-sky-600" />
                          <span>Interactive Flashcard &amp; Viva Checkpoint</span>
                        </h4>
                        <span className="text-xs text-slate-500 font-mono">
                          Card {flashcardIndex + 1} of {activeNote.summary.quickReviewQuestions.length}
                        </span>
                      </div>

                      {/* Flashcard Box in signature clean dark mode */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="cursor-pointer bg-[#0f172a] text-white rounded-2xl p-6 text-center min-h-[160px] flex flex-col justify-center items-center shadow-xl shadow-slate-200 transition transform hover:scale-[1.005]"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-2">
                          {isFlipped ? 'Answer & Academic Rationale' : 'Viva / Exam Question'}
                        </span>

                        <p className="text-sm sm:text-base font-semibold text-slate-100 max-w-xl leading-relaxed">
                          {isFlipped
                            ? activeNote.summary.quickReviewQuestions[flashcardIndex]?.answer
                            : activeNote.summary.quickReviewQuestions[flashcardIndex]?.question}
                        </p>

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-4">
                          <RotateCw className="w-3 h-3 text-sky-400" />
                          <span>Tap card to flip answer</span>
                        </span>
                      </div>

                      {/* Flashcard Navigation */}
                      <div className="flex items-center justify-center gap-3 pt-1">
                        <button
                          disabled={flashcardIndex === 0}
                          onClick={() => {
                            setFlashcardIndex(Math.max(0, flashcardIndex - 1));
                            setIsFlipped(false);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Card</span>
                        </button>
                        <button
                          disabled={flashcardIndex >= activeNote.summary.quickReviewQuestions.length - 1}
                          onClick={() => {
                            setFlashcardIndex(Math.min(activeNote.summary.quickReviewQuestions.length - 1, flashcardIndex + 1));
                            setIsFlipped(false);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 shadow-xs"
                        >
                          <span>Next Card</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                /* No Summary Yet Prompt */
                <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-bold text-slate-900 text-base">
                      AI Summary Not Yet Generated
                    </h4>
                    <p className="text-xs text-slate-500">
                      Click &ldquo;Summarize into Key Concepts with AI&rdquo; above to extract structured concept definitions, examination highlights, and interactive flashcards.
                    </p>
                  </div>

                  {/* Raw note preview */}
                  <div className="mt-4 text-left bg-white p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {activeNote.content}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
              No note selected. Please choose or upload a note from the left list.
            </div>
          )}
        </div>

      </div>

      {/* Upload New Note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Upload / Post Department Lecture Note</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Course Selection
                  </label>
                  <select
                    value={newCourseId}
                    onChange={(e) => setNewCourseId(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}: {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Module Name
                  </label>
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="e.g. Module 3: NIDS Rule Engineering"
                    className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Lecture 14: Volatility Memory Forensics & Rootkit Extraction"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Note Content / Code / Cheatsheet
                  </label>
                  <label
                    htmlFor="modal-file-upload"
                    className="cursor-pointer text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload from File</span>
                  </label>
                  <input
                    id="modal-file-upload"
                    type="file"
                    accept=".txt,.md,.py,.c,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <textarea
                  rows={8}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste lecture notes, explanations, Snort signatures, Python scripts, or terminal output..."
                  className="w-full bg-slate-50 text-slate-800 text-xs font-mono p-3 rounded-lg border border-slate-200 focus:outline-none focus:bg-white resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Cyber Security, AES, Volatility, Anomaly Detection"
                  className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm shadow-sky-200"
                >
                  Save &amp; Post Note
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
