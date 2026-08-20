import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Play, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen,
  Plus,
  Trash2,
  ListOrdered,
  FileQuestion,
  Layers,
  AlertCircle,
  Tag,
  Check
} from 'lucide-react';
import { Quiz, QuizQuestion, Course, UserRole } from '../types';

interface QuizHubProps {
  quizzes: Quiz[];
  courses: Course[];
  onOpenSyllabusAI: () => void;
  onAddQuiz: (quiz: Quiz) => void;
  onDeleteQuiz?: (quizId: string) => void;
  role: UserRole;
}

interface NewQuestionDraft {
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  explanation: string;
  topicTag: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const QuizHub: React.FC<QuizHubProps> = ({
  quizzes,
  courses,
  onOpenSyllabusAI,
  onAddQuiz,
  onDeleteQuiz,
  role,
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [activeQuizForTaking, setActiveQuizForTaking] = useState<Quiz | null>(null);

  // Active Quiz State (Taking Quiz)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionIdx: number]: number }>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);

  // Create Quiz Modal State (Faculty)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCourseId, setNewCourseId] = useState<string>(courses[0]?.id || '26DSC01');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newDuration, setNewDuration] = useState<number>(15);
  const [newTotalMarks, setNewTotalMarks] = useState<number>(20);
  const [newDueDate, setNewDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  
  // Questions Draft in Creator
  const [draftQuestions, setDraftQuestions] = useState<NewQuestionDraft[]>([
    {
      question: 'What is the average time complexity to access an element by index in a contiguous dynamic array?',
      options: ['O(1)', 'O(N)', 'O(log N)', 'O(N^2)'],
      correctAnswerIndex: 0,
      explanation: 'Array indices are direct pointer arithmetic offsets from the base address, taking constant O(1) time.',
      topicTag: 'Array Data Structures',
      difficulty: 'Beginner',
    },
    {
      question: 'Which of the following describes Power Usage Effectiveness (PUE) in green computing?',
      options: [
        'Total Facility Power / IT Equipment Power',
        'IT Equipment Power / Total Facility Power',
        'Server Power * Cooling Capacity',
        'Embodied Carbon / Hardware Lifespan'
      ],
      correctAnswerIndex: 0,
      explanation: 'PUE is the ratio of total facility power consumed to the energy utilized exclusively by IT computing infrastructure.',
      topicTag: 'PUE & Green IT Metrics',
      difficulty: 'Intermediate',
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredQuizzes = quizzes.filter(
    (q) => selectedCourseFilter === 'all' || q.courseId === selectedCourseFilter
  );

  // Timer Effect
  useEffect(() => {
    if (!activeQuizForTaking || isQuizSubmitted) return;

    if (timeLeftSeconds <= 0) {
      handleFinalizeQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuizForTaking, isQuizSubmitted, timeLeftSeconds]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuizForTaking(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setIsQuizSubmitted(false);
    setTimeLeftSeconds(quiz.durationMinutes * 60);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isQuizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleFinalizeQuiz = () => {
    setIsQuizSubmitted(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Fallback
    }
  };

  // Calculate Score
  const calculateResults = () => {
    if (!activeQuizForTaking) return { score: 0, total: 0, percentage: 0, correctCount: 0 };
    let correctCount = 0;
    activeQuizForTaking.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const totalQuestions = activeQuizForTaking.questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = Math.round((correctCount / totalQuestions) * activeQuizForTaking.totalMarks);

    return {
      score,
      total: activeQuizForTaking.totalMarks,
      percentage,
      correctCount,
      totalQuestions,
    };
  };

  // Add Question to Draft
  const handleAddQuestionDraft = () => {
    setDraftQuestions((prev) => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: '',
        topicTag: 'General Computer Science',
        difficulty: 'Beginner',
      }
    ]);
  };

  const handleRemoveQuestionDraft = (index: number) => {
    if (draftQuestions.length <= 1) {
      alert('A quiz must contain at least 1 question.');
      return;
    }
    setDraftQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestionField = (index: number, field: keyof NewQuestionDraft, value: any) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    setDraftQuestions((prev) => {
      const updated = [...prev];
      const newOptions = [...updated[qIndex].options] as [string, string, string, string];
      newOptions[optIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options: newOptions };
      return updated;
    });
  };

  // Quick Preset Question Loader
  const loadPresetQuestions = (type: 'ds' | 'green' | 'dt') => {
    if (type === 'ds') {
      setNewCourseId('26DSC01');
      setNewTitle('Quiz 01: Python Memory & Linear Data Structures');
      setNewDescription('Assessment covering Python dynamic arrays, Singly Linked List pointer operations, and Big-O efficiency analysis.');
      setDraftQuestions([
        {
          question: 'What is the amortized time complexity of appending an item to a Python dynamic list?',
          options: ['O(1) amortized', 'O(N)', 'O(log N)', 'O(N^2)'],
          correctAnswerIndex: 0,
          explanation: 'Dynamic arrays use over-allocation geometric scaling, ensuring O(1) amortized insertion cost.',
          topicTag: 'Python List Internals',
          difficulty: 'Beginner'
        },
        {
          question: 'In a singly linked list without a tail pointer, what is the time complexity to insert at the tail?',
          options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
          correctAnswerIndex: 1,
          explanation: 'Without a dedicated tail pointer, traversal from the head node through all N elements is required.',
          topicTag: 'Linked Lists',
          difficulty: 'Beginner'
        },
        {
          question: 'Which data structure enforces LIFO (Last In First Out) ordering?',
          options: ['Queue', 'Stack', 'Priority Queue', 'Binary Tree'],
          correctAnswerIndex: 1,
          explanation: 'Stacks operate strictly with LIFO discipline, utilized in recursion call stacks and expression parsing.',
          topicTag: 'Stacks',
          difficulty: 'Beginner'
        }
      ]);
    } else if (type === 'green') {
      setNewCourseId('26DSAE1');
      setNewTitle('Quiz 01: Sustainable Computing & PUE Fundamentals');
      setNewDescription('Assessment on Power Usage Effectiveness (PUE), data center energy efficiency, and embodied vs operational carbon.');
      setDraftQuestions([
        {
          question: 'What does a Power Usage Effectiveness (PUE) ratio of 1.0 signify in data center infrastructure?',
          options: [
            '100% of facility power is utilized exclusively by IT computing equipment (ideal efficiency)',
            'The data center generates zero carbon emissions',
            'Cooling fans consume equal electricity to servers',
            'All workloads are processed on solar power'
          ],
          correctAnswerIndex: 0,
          explanation: 'PUE = (Total Facility Energy) / (IT Equipment Energy). 1.0 represents zero overhead losses for cooling or lighting.',
          topicTag: 'PUE Metrics',
          difficulty: 'Intermediate'
        },
        {
          question: 'Which of the following refers to "Embodied Carbon" in computer hardware?',
          options: [
            'Electricity consumed during runtime execution',
            'Greenhouse gases generated during raw material extraction, device fabrication, shipping, and disposal',
            'Heat generated by microprocessors under peak thermal load',
            'Data storage carbon equivalents'
          ],
          correctAnswerIndex: 1,
          explanation: 'Embodied carbon is the carbon emissions embedded across the supply chain and manufacturing lifecycle of hardware.',
          topicTag: 'Lifecycle Assessment',
          difficulty: 'Intermediate'
        }
      ]);
    } else {
      setNewCourseId('26DSDT1');
      setNewTitle('Quiz 01: Design Thinking 5-Stage Methodology');
      setNewDescription('Assessment on Empathize, Define, Ideate, Prototype, and Test phases in user-centric software design.');
      setDraftQuestions([
        {
          question: 'In the Design Thinking process, which stage immediately follows "Empathize"?',
          options: ['Define (Problem Statement)', 'Ideate', 'Prototype', 'Test'],
          correctAnswerIndex: 0,
          explanation: 'After gathering user empathy data, the team synthesizes findings to Define an actionable Point of View (POV).',
          topicTag: 'Design Thinking Phases',
          difficulty: 'Beginner'
        }
      ]);
    }
  };

  const handleSaveCreatedQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Validate questions
    for (let i = 0; i < draftQuestions.length; i++) {
      const q = draftQuestions[i];
      if (!q.question.trim()) {
        alert(`Please provide text for Question #${i + 1}`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`Please fill in all 4 options for Question #${i + 1}`);
        return;
      }
    }

    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      courseId: newCourseId,
      title: newTitle,
      description: newDescription || 'Standard course assessment.',
      durationMinutes: newDuration || 15,
      totalMarks: newTotalMarks || 20,
      dueDate: newDueDate,
      createdAt: new Date().toISOString().split('T')[0],
      isPublished: true,
      attemptsCount: 0,
      questions: draftQuestions.map((q, idx) => ({
        id: `q-${Date.now()}-${idx}`,
        question: q.question,
        options: q.options,
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation || 'Refer to course lecture notes and reference textbook.',
        topicTag: q.topicTag || 'General',
        difficulty: q.difficulty,
      })),
    };

    onAddQuiz(newQuiz);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    showToast(`Quiz "${newQuiz.title}" created & published!`);
  };

  const handleDeleteQuiz = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete quiz: "${title}"?`)) {
      if (onDeleteQuiz) {
        onDeleteQuiz(id);
      }
      showToast(`Quiz "${title}" removed.`);
    }
  };

  // Format Time Remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // ACTIVE QUIZ INTERACTION SCREEN
  // -------------------------------------------------------------
  if (activeQuizForTaking) {
    const totalQ = activeQuizForTaking.questions.length;
    const currentQ = activeQuizForTaking.questions[currentQuestionIdx];
    const results = isQuizSubmitted ? calculateResults() : null;
    const relatedCourse = courses.find((c) => c.id === activeQuizForTaking.courseId);

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
        
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {relatedCourse?.code || 'CSDS'}
              </span>
              <h2 className="text-lg font-bold text-slate-900 truncate max-w-md">
                {activeQuizForTaking.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Total Marks: {activeQuizForTaking.totalMarks} pts • Questions: {totalQ}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isQuizSubmitted && (
              <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-2xs ${
                timeLeftSeconds < 120 ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{formatTime(timeLeftSeconds)} Remaining</span>
              </div>
            )}

            <button
              onClick={() => setActiveQuizForTaking(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            >
              Exit Assessment
            </button>
          </div>
        </div>

        {/* QUIZ IN PROGRESS */}
        {!isQuizSubmitted ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Question Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  Question {currentQuestionIdx + 1} of {totalQ}
                </span>
                <span className="text-[11px] font-mono">
                  {Math.round(((currentQuestionIdx + 1) / totalQ) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / totalQ) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {currentQ.topicTag || 'Concept'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {currentQ.difficulty || 'Beginner'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIdx] === optIdx;
                const optionLabel = String.fromCharCode(65 + optIdx); // A, B, C, D
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 text-xs sm:text-sm font-medium ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-400 text-sky-950 shadow-xs ring-1 ring-sky-300'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                      isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className="flex-1 mt-0.5">{optionText}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIdx < totalQ - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-200 transition"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinalizeQuiz}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-200 transition transform active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit &amp; View Score</span>
                </button>
              )}
            </div>

          </div>
        ) : (
          /* RESULTS & DETAILED REVIEW SCREEN */
          <div className="space-y-6">
            
            {/* Score Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Assessment Completed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500">
                  You scored <strong className="text-emerald-700">{results?.score} / {results?.total} points</strong> ({results?.percentage}%)
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleStartQuiz(activeQuizForTaking)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>
                <button
                  onClick={() => setActiveQuizForTaking(null)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition shadow-sm"
                >
                  <span>Return to Hub</span>
                </button>
              </div>
            </div>

            {/* Question by Question Review */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Detailed Academic Explanations &amp; Solutions</span>
              </h4>

              <div className="space-y-4">
                {activeQuizForTaking.questions.map((q, qIdx) => {
                  const studentAns = selectedAnswers[qIdx];
                  const isCorrect = studentAns === q.correctAnswerIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs space-y-3 ${
                        isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            Question {qIdx + 1}
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                            {q.question}
                          </h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {isCorrect ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{isCorrect ? 'Correct' : 'Incorrect'}</span>
                        </span>
                      </div>

                      {/* Options breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => {
                          const isKey = oIdx === q.correctAnswerIndex;
                          const wasChosen = oIdx === studentAns;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border text-[11px] flex items-center gap-2 ${
                                isKey
                                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold'
                                  : wasChosen
                                  ? 'bg-rose-100/70 border-rose-300 text-rose-950 font-bold'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              <span className="font-bold font-mono">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span>{opt}</span>
                              {isKey && <span className="ml-auto text-[10px] text-emerald-700 font-bold">(Key)</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 bg-white/80 rounded-lg border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                          <strong className="text-slate-900 block mb-0.5">Academic Solution &amp; Rationale:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN QUIZ HUB REPOSITORY LIST SCREEN
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <HelpCircle className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Quizzes &amp; Academic Assessments
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Faculty can create structured multiple-choice assessments or generate quizzes from course syllabus units. Students can take timed tests with instant grading and academic explanations.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {role === 'faculty' && onOpenSyllabusAI && (
              <button
                onClick={onOpenSyllabusAI}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Syllabus AI Quiz +</span>
              </button>
            )}

            {role === 'faculty' && (
              <button
                id="btn-open-create-quiz"
                onClick={() => {
                  setShowCreateModal(true);
                  if (courses.length > 0) {
                    setNewCourseId(courses[0].id);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-sky-200 transition transform active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Quiz +</span>
              </button>
            )}

            {role === 'student' && (
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Take Quiz &amp; Instant Grading</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Subject Filter:</label>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="bg-slate-50 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="all">All Subjects ({quizzes.length} Quizzes)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Semester 1 Cohort (32 Students)
        </span>
      </div>

      {/* Quizzes Grid or Empty State */}
      {quizzes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900">No Quizzes Created Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {role === 'faculty'
                ? 'Create your first course quiz with custom multiple-choice questions, or generate comprehensive assessments directly using Syllabus AI.'
                : 'No active quizzes are currently scheduled for your courses. Check back soon for course assessments.'}
            </p>
          </div>

          {role === 'faculty' && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-sky-200 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Quiz</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>or quick load:</span>
                <button
                  onClick={() => {
                    loadPresetQuestions('ds');
                    setShowCreateModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Python DS Quiz
                </button>
                <button
                  onClick={() => {
                    loadPresetQuestions('green');
                    setShowCreateModal(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
                >
                  Green IT Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const course = courses.find((c) => c.id === quiz.courseId);
            return (
              <div
                key={quiz.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative"
              >
                <div className="space-y-2.5">
                  
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {course?.code || 'CSDS'}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{quiz.durationMinutes} mins</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Questions</span>
                      <strong className="text-slate-800">{quiz.questions.length} Items</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Total Marks</span>
                      <strong className="text-sky-700">{quiz.totalMarks} Points</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-sky-200 transition transform active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Assessment</span>
                  </button>

                  {role === 'faculty' && onDeleteQuiz && (
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200"
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE QUIZ MODAL (FACULTY) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-200">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Create New Course Quiz &amp; Assessment
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Preset quick loader */}
            <div className="flex items-center gap-2 flex-wrap p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Quick Starter Presets:</span>
              </span>
              <button
                type="button"
                onClick={() => loadPresetQuestions('ds')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Python DS Quiz
              </button>
              <button
                type="button"
                onClick={() => loadPresetQuestions('green')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Green Computing Quiz
              </button>
              <button
                type="button"
                onClick={() => loadPresetQuestions('dt')}
                className="px-2 py-1 bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded-md border border-slate-200 text-[11px] font-medium transition"
              >
                Design Thinking Quiz
              </button>
            </div>

            <form onSubmit={handleSaveCreatedQuiz} className="space-y-5 text-xs">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Quiz 01: Python Linear Data Structures & Big-O"
                    className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject / Course</label>
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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quiz Description / Instructions</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Outline syllabus modules assessed, negative marking policies (if any), and guidelines..."
                  className="w-full bg-slate-50 text-slate-800 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 p-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 p-2 rounded-xl border border-slate-200 text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due / Expiry Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 p-2 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Questions Builder */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <ListOrdered className="w-4 h-4 text-sky-600" />
                    <span>Questions ({draftQuestions.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionDraft}
                    className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {draftQuestions.map((q, qIndex) => (
                    <div
                      key={qIndex}
                      className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Question #{qIndex + 1}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={q.difficulty}
                            onChange={(e) => handleUpdateQuestionField(qIndex, 'difficulty', e.target.value)}
                            className="bg-white text-slate-700 text-[11px] font-medium px-2 py-1 rounded border border-slate-200"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>

                          {draftQuestions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveQuestionDraft(qIndex)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                              title="Delete Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => handleUpdateQuestionField(qIndex, 'question', e.target.value)}
                          placeholder="Enter question statement..."
                          className="w-full bg-white text-slate-800 p-2 rounded-lg border border-slate-200 text-xs font-semibold"
                          required
                        />
                      </div>

                      {/* 4 Options Grid */}
                      <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-600">
                          Options &amp; Correct Answer Selection:
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctAnswerIndex === optIdx;
                            const optionChar = String.fromCharCode(65 + optIdx);
                            return (
                              <div
                                key={optIdx}
                                className={`flex items-center gap-2 p-2 rounded-lg border bg-white ${
                                  isCorrect ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-slate-200'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`correct-${qIndex}`}
                                  checked={isCorrect}
                                  onChange={() => handleUpdateQuestionField(qIndex, 'correctAnswerIndex', optIdx)}
                                  className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                  title="Mark as correct answer"
                                />
                                <span className="font-mono text-xs font-bold text-slate-500">{optionChar}.</span>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => handleUpdateOption(qIndex, optIdx, e.target.value)}
                                  placeholder={`Option ${optionChar}...`}
                                  className="w-full bg-transparent text-slate-800 text-xs focus:outline-none"
                                  required
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Topic Tag & Explanation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Topic Tag</label>
                          <input
                            type="text"
                            value={q.topicTag}
                            onChange={(e) => handleUpdateQuestionField(qIndex, 'topicTag', e.target.value)}
                            placeholder="e.g. Linked Lists, Big-O"
                            className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Academic Solution &amp; Rationale</label>
                          <input
                            type="text"
                            value={q.explanation}
                            onChange={(e) => handleUpdateQuestionField(qIndex, 'explanation', e.target.value)}
                            placeholder="Explain why the selected option is correct..."
                            className="w-full bg-white text-slate-800 p-1.5 rounded border border-slate-200 text-xs"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

              {/* Submit Buttons */}
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
                  Save &amp; Publish Assessment
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
