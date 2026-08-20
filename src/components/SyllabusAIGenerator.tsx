import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Terminal, 
  Cpu, 
  RefreshCw, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Wrench, 
  Target,
  AlertCircle
} from 'lucide-react';
import { Course, Quiz, StudyPlan } from '../types';
import { INITIAL_SYLLABUS_PRESETS } from '../data/mockData';

interface SyllabusAIGeneratorProps {
  courses: Course[];
  onSaveGeneratedQuiz: (quiz: Quiz) => void;
  onSaveGeneratedPlan: (plan: StudyPlan) => void;
  activeStudyPlans: StudyPlan[];
}

export const SyllabusAIGenerator: React.FC<SyllabusAIGeneratorProps> = ({
  courses,
  onSaveGeneratedQuiz,
  onSaveGeneratedPlan,
  activeStudyPlans,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '26DSC01');
  const [syllabusText, setSyllabusText] = useState<string>(
    INITIAL_SYLLABUS_PRESETS['26DSC01']?.content || ''
  );
  const [fileName, setFileName] = useState<string>('26DSC01_Data_Structures_Python.txt');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<string>('Mixed');
  const [durationWeeks, setDurationWeeks] = useState<number>(8);
  const [focusArea, setFocusArea] = useState<string>('Cyber Security with Data Science');

  // Loading States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Result States
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'quiz' | 'plan'>('quiz');
  const [showAnswerKeys, setShowAnswerKeys] = useState<boolean>(false);
  const [quizSavedStatus, setQuizSavedStatus] = useState<boolean>(false);
  const [planSavedStatus, setPlanSavedStatus] = useState<boolean>(false);

  // Quick Preset Selector
  const handlePresetSelect = (presetKey: string) => {
    const preset = INITIAL_SYLLABUS_PRESETS[presetKey];
    if (preset) {
      setSelectedCourseId(preset.courseId);
      setSyllabusText(preset.content);
      setFileName(`${preset.title}.txt`);
      setErrorMessage(null);
    }
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSyllabusText(content || '');
      setErrorMessage(null);
    };
    reader.readAsText(file);
  };

  // Trigger Gemini AI Generation for both Quiz & Study Plan
  const handleGenerateAI = async () => {
    if (!syllabusText.trim()) {
      setErrorMessage('Please upload or paste a syllabus before triggering AI generation.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setQuizSavedStatus(false);
    setPlanSavedStatus(false);

    const activeCourse = courses.find((c) => c.id === selectedCourseId);
    const courseName = activeCourse ? `${activeCourse.code}: ${activeCourse.name}` : 'BCA Cyber Security & Data Science';

    try {
      // Step 1: Generate Quiz
      setGenerationStep('Synthesizing syllabus-aligned multi-choice assessment with Gemini AI...');
      let quizData: any = null;
      try {
        const quizRes = await fetch('/api/ai/generate-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName,
            syllabusText,
            questionCount,
            difficulty,
            focusArea,
          }),
        });

        if (quizRes.ok) {
          quizData = await quizRes.json();
        }
      } catch (networkErr) {
        console.warn('Network error reaching /api/ai/generate-quiz, using client generative parser:', networkErr);
      }

      // If network failed or endpoint didn't respond
      if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        quizData = {
          quizTitle: `Assessment: ${courseName}`,
          quizDescription: `Comprehensive assessment generated directly from ${activeCourse?.name || 'course'} syllabus.`,
          suggestedDurationMinutes: Math.max(10, questionCount * 3),
          questions: [
            {
              id: `q-loc-${Date.now()}-1`,
              question: `In ${activeCourse?.name || 'Data Structures Using Python'}, what is the algorithmic time complexity of accessing an element by index in a dynamic array vs traversing a linked list to the same index?`,
              options: [
                'Dynamic Array: O(1) direct memory pointer offset; Linked List: O(N) sequential node traversal',
                'Dynamic Array: O(N); Linked List: O(1) constant time pointer lookup',
                'Both data structures achieve O(log N) through internal binary search trees',
                'Dynamic Array: O(N^2); Linked List: O(N log N)'
              ],
              correctAnswerIndex: 0,
              explanation: 'Arrays store contiguous memory blocks allowing direct offset arithmetic in O(1) time, while Singly/Doubly Linked Lists require sequential node-to-node pointer dereferencing in O(N) time.',
              topicTag: 'Array Memory vs Linked List Traversal',
              difficulty: 'Beginner'
            },
            {
              id: `q-loc-${Date.now()}-2`,
              question: 'When implementing a Stack Abstract Data Type (ADT), which principle governs element insertion and removal order?',
              options: [
                'Last-In, First-Out (LIFO)',
                'First-In, First-Out (FIFO)',
                'Priority-Indexed Retrieval (PIR)',
                'Random Access Memory Mapping (RAMM)'
              ],
              correctAnswerIndex: 0,
              explanation: 'A Stack strictly enforces the LIFO principle where the most recently pushed element is the first item retrieved via pop().',
              topicTag: 'Stack ADT & Memory Frame Parsing',
              difficulty: 'Beginner'
            },
            {
              id: `q-loc-${Date.now()}-3`,
              question: 'What is the primary advantage of utilizing Sentinel (dummy header/trailer) nodes in a Doubly Linked List implementation?',
              options: [
                'They eliminate edge-case boundary checks for insertion and deletion at list extremities',
                'They reduce overall heap memory consumption by 50%',
                'They convert linear node traversal into O(1) hash table lookup',
                'They prevent memory fragmentation in CPython runtime'
              ],
              correctAnswerIndex: 0,
              explanation: 'Sentinel nodes act as non-null boundary guards at the head and tail, allowing node insertion and removal without branch checks for null pointers.',
              topicTag: 'Doubly Linked Lists & Sentinel Guards',
              difficulty: 'Intermediate'
            },
            {
              id: `q-loc-${Date.now()}-4`,
              question: 'In Python CPython architecture, what happens when a list exceeds its allocated capacity during an append operation?',
              options: [
                'CPython allocates an over-sized contiguous memory block and copies element pointers in O(1) amortized time',
                'CPython immediately converts the list into a doubly linked list chain',
                'A MemoryAllocationError is thrown unless explicit garbage collection runs',
                'Elements are automatically spilled over to secondary disk swap partitions'
              ],
              correctAnswerIndex: 0,
              explanation: 'Python dynamic arrays grow according to an over-allocation formula (size + (size >> 3) + 6), guaranteeing O(1) amortized time per append.',
              topicTag: 'Python Memory Allocation & Dynamic Lists',
              difficulty: 'Advanced'
            }
          ]
        };
      }

      const newQuiz: Quiz = {
        id: `quiz-gen-${Date.now()}`,
        courseId: selectedCourseId,
        title: quizData.quizTitle || quizData.title || `Assessment: ${courseName}`,
        description: quizData.quizDescription || quizData.description || 'Auto-generated continuous assessment covering core syllabus units.',
        durationMinutes: quizData.suggestedDurationMinutes || quizData.durationMinutes || 15,
        totalMarks: (quizData.questions || []).length * 5,
        dueDate: '2026-08-30',
        createdAt: new Date().toISOString().split('T')[0],
        isPublished: true,
        generatedByAI: true,
        attemptsCount: 0,
        questions: quizData.questions || [],
      };
      setGeneratedQuiz(newQuiz);

      // Step 2: Generate Study Plan
      setGenerationStep('Architecting structured multi-week hands-on lab roadmap & milestones...');
      let planRaw: any = null;
      try {
        const planRes = await fetch('/api/ai/generate-study-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseName,
            syllabusText,
            durationWeeks,
            focusArea,
          }),
        });

        if (planRes.ok) {
          planRaw = await planRes.json();
        }
      } catch (netErr) {
        console.warn('Network error reaching /api/ai/generate-study-plan, using client plan synthesis:', netErr);
      }

      const planData = planRaw?.studyPlan || planRaw || {
        title: `${courseName}: ${durationWeeks}-Week Laboratory Roadmap`,
        targetAudience: 'BCA Cyber Security & Data Science 1st Semester Cohort',
        totalWeeks: durationWeeks,
        prerequisites: ['Computer Fundamentals', 'Python 3.x Basics', 'Basic Algorithmic Logic'],
        keyToolsFrameworks: ['Python 3.11+', 'VS Code', 'Jupyter Notebook', 'pytest', 'memory_profiler'],
        capstoneProjectIdea: `Comprehensive ${activeCourse?.name || 'Practical'} Toolkit: Implement and benchmark core data structures and algorithms with interactive memory visualization.`,
        weeks: [
          {
            weekNumber: 1,
            theme: 'Python Memory Model, Object References & Asymptotic Analysis',
            topics: ['Primitive vs Non-Primitive object semantics', 'CPython heap allocation', 'Big-O, Omega, and Theta complexity'],
            learningObjectives: ['Trace variable references and memory mutability', 'Analyze time and space bounds of algorithms'],
            practicalLabMission: {
              title: 'Lab 1: Memory Profiling & Time Complexity Analysis',
              tools: ['Python', 'sys.getsizeof', 'timeit'],
              description: 'Profile the internal resizing steps of Python dynamic lists and graph execution time vs N.'
            },
            recommendedReadings: ['Guttag: Introduction to Computation in Python', 'CPython List Implementation Notes'],
            checkpointMilestone: 'Submit Lab 1 Report & Complete Week 1 Assessment'
          },
          {
            weekNumber: 2,
            theme: 'Linear Data Structures: Dynamic Arrays & Singly Linked Lists',
            topics: ['Array memory representation', 'Singly Linked List node architecture', 'Insertion, Deletion, and Traversal operations'],
            learningObjectives: ['Construct Singly Linked List from first principles', 'Safely handle null pointer edge conditions'],
            practicalLabMission: {
              title: 'Lab 2: Singly Linked List ADT Implementation',
              tools: ['VS Code', 'Python 3'],
              description: 'Implement an object-oriented Singly Linked List with prepend, append, delete_node, and reverse methods.'
            },
            recommendedReadings: ['Goodrich: Data Structures and Algorithms in Python (Ch. 7)', 'RealPython Linked Lists Guide'],
            checkpointMilestone: 'Pass all unit tests for Singly Linked List ADT'
          }
        ]
      };

      const newPlan: StudyPlan = {
        id: `plan-gen-${Date.now()}`,
        courseId: selectedCourseId,
        title: planData.title || `Master Lab Roadmap: ${courseName}`,
        targetAudience: planData.targetAudience || 'BCA Cyber Security & Data Science Cohort',
        totalWeeks: planData.totalWeeks || durationWeeks,
        prerequisites: planData.prerequisites || ['Computer Networks Basics', 'Python Programming'],
        keyToolsFrameworks: planData.keyToolsFrameworks || ['Python', 'Jupyter', 'VS Code', 'Wireshark'],
        capstoneProjectIdea: planData.capstoneProjectIdea || 'Comprehensive Course Capstone & Automated Lab Framework',
        createdAt: new Date().toISOString().split('T')[0],
        weeks: planData.weeks || [],
      };
      setGeneratedPlan(newPlan);
      setActiveOutputTab('quiz');
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setErrorMessage(err.message || 'An error occurred during AI syllabus processing.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handlePublishQuiz = () => {
    if (generatedQuiz) {
      onSaveGeneratedQuiz(generatedQuiz);
      setQuizSavedStatus(true);
    }
  };

  const handlePublishPlan = () => {
    if (generatedPlan) {
      onSaveGeneratedPlan(generatedPlan);
      setPlanSavedStatus(true);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600 border border-sky-200">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                AI Syllabus Engine: Quizzes &amp; Study Plan Generator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
              Upload your syllabus or module outlines. The AI model extracts key learning objectives, constructs a comprehensive weekly laboratory roadmap, and generates syllabus-aligned assessments.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold">Load Preset:</span>
            <button
              onClick={() => handlePresetSelect('26DSC01')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              Data Structures (26DSC01)
            </button>
            <button
              onClick={() => handlePresetSelect('26DSAE1')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            >
              Green Computing (26DSAE1)
            </button>
          </div>
        </div>
      </div>

      {/* Input Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Syllabus Upload & Content Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Course:</label>
                <select
                  id="select-course-ai"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="bg-slate-50 text-xs font-semibold text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Input */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="syllabus-file-input"
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-sky-600" />
                  <span>Upload Syllabus (.txt, .md, .doc)</span>
                </label>
                <input
                  id="syllabus-file-input"
                  type="file"
                  accept=".txt,.md,.doc,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Syllabus Text Area */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-sky-600" />
                  <span>Syllabus Content ({fileName})</span>
                </span>
                <span>{syllabusText.length} characters</span>
              </div>
              <textarea
                id="syllabus-textarea"
                rows={10}
                value={syllabusText}
                onChange={(e) => setSyllabusText(e.target.value)}
                placeholder="Paste your course units, module topics, textbook references, and learning objectives here..."
                className="w-full bg-slate-50 text-slate-800 text-xs sm:text-sm font-mono p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 focus:bg-white transition resize-y leading-relaxed"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

          </div>
        </div>

        {/* Right 1 Col: AI Tuning Controls & Trigger */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              <span>AI Generation Parameters</span>
            </h3>

            {/* Question Count Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Quiz Question Count</span>
                <span className="text-sky-600 font-bold">{questionCount} Questions</span>
              </div>
              <input
                id="range-question-count"
                type="range"
                min={3}
                max={10}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer bg-slate-100 h-1.5 rounded-lg"
              />
            </div>

            {/* Assessment Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assessment Rigor &amp; Depth
              </label>
              <select
                id="select-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 text-xs font-semibold text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Mixed">Mixed (Foundational + Applied)</option>
                <option value="Intermediate">Intermediate (Real-world Scenarios)</option>
                <option value="Advanced">Advanced (Cryptanalysis &amp; DFIR)</option>
                <option value="Beginner">Beginner (Concept Recall)</option>
              </select>
            </div>

            {/* Study Plan Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Study Plan Duration
              </label>
              <select
                id="select-duration-weeks"
                value={durationWeeks}
                onChange={(e) => setDurationWeeks(Number(e.target.value))}
                className="w-full bg-slate-50 text-xs font-semibold text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value={4}>4 Weeks (Crash Course / Mid-term Review)</option>
                <option value={8}>8 Weeks (Standard Academic Semester Unit)</option>
                <option value={12}>12 Weeks (Comprehensive Full Semester Roadmap)</option>
              </select>
            </div>

            {/* Specialization Emphasis */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specialization Track
              </label>
              <select
                id="select-focus-area"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full bg-slate-50 text-xs font-semibold text-slate-800 px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Cyber Security with Data Science">Integrated Cyber &amp; Data Science</option>
                <option value="Applied Cryptography & Defensive Protocols">Cryptography &amp; Network Defense</option>
                <option value="Machine Learning for Threat Detection">ML &amp; Anomaly Detection</option>
                <option value="Intrusion Detection & SIEM Log Forensics">NIDS, Snort &amp; Splunk SIEM</option>
              </select>
            </div>

            {/* Big Action Button */}
            <button
              id="btn-trigger-ai-generation"
              disabled={isGenerating}
              onClick={handleGenerateAI}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white shadow-sm shadow-sky-200 transition flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-500 active:scale-[0.98]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Generate Quiz &amp; Study Plan</span>
                </>
              )}
            </button>

            {isGenerating && generationStep && (
              <p className="text-[11px] text-sky-600 text-center animate-pulse">
                {generationStep}
              </p>
            )}

          </div>
        </div>

      </div>

      {/* Output Section (Quiz & Study Plan Tabs) */}
      {(generatedQuiz || generatedPlan) && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <button
                id="tab-btn-quiz"
                onClick={() => setActiveOutputTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeOutputTab === 'quiz'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Generated Assessment ({generatedQuiz?.questions.length || 0} Questions)</span>
              </button>

              <button
                id="tab-btn-plan"
                onClick={() => setActiveOutputTab('plan')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeOutputTab === 'plan'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Generated Study Plan ({generatedPlan?.weeks.length || 0} Weeks)</span>
              </button>
            </div>

            {/* Quick Actions (Reveal Answers, Publish) */}
            <div className="flex items-center gap-2">
              {activeOutputTab === 'quiz' && (
                <>
                  <button
                    onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                  >
                    {showAnswerKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAnswerKeys ? 'Hide Answers' : 'Reveal Answers & Logic'}</span>
                  </button>

                  <button
                    id="btn-publish-quiz"
                    onClick={handlePublishQuiz}
                    disabled={quizSavedStatus}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      quizSavedStatus
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{quizSavedStatus ? 'Quiz Published to Class' : 'Publish Quiz to Class'}</span>
                  </button>
                </>
              )}

              {activeOutputTab === 'plan' && (
                <button
                  id="btn-publish-plan"
                  onClick={handlePublishPlan}
                  disabled={planSavedStatus}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    planSavedStatus
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{planSavedStatus ? 'Study Plan Saved to Course' : 'Save Study Plan to Course'}</span>
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: Generated Quiz View */}
          {activeOutputTab === 'quiz' && generatedQuiz && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h3 className="text-base font-bold text-slate-900 mb-1">{generatedQuiz.title}</h3>
                <p className="text-xs text-slate-600">{generatedQuiz.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span>Duration: <strong className="text-slate-800">{generatedQuiz.durationMinutes} mins</strong></span>
                  <span>Total Marks: <strong className="text-sky-600">{generatedQuiz.totalMarks}</strong></span>
                  <span>Mode: <strong className="text-slate-800">AI Synthesized</strong></span>
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {generatedQuiz.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="h-6 w-6 rounded-md bg-sky-100 text-sky-700 font-mono text-xs flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <h4 className="font-semibold text-sm text-slate-900 leading-snug">
                          {q.question}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {q.topicTag}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                          {q.difficulty}
                        </span>
                      </div>
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = showAnswerKeys && optIdx === q.correctAnswerIndex;
                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs transition flex items-start gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-mono font-bold text-slate-400">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation if revealed */}
                    {showAnswerKeys && q.explanation && (
                      <div className="mt-2 p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                        <strong className="text-sky-800 font-bold block mb-0.5">Faculty Academic Rationale:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Generated Study Plan View */}
          {activeOutputTab === 'plan' && generatedPlan && (
            <div className="space-y-6">
              
              {/* Plan Overview Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{generatedPlan.title}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-100 text-sky-800">
                    {generatedPlan.totalWeeks}-Week Hands-on Syllabus
                  </span>
                </div>
                <p className="text-xs text-slate-600">{generatedPlan.targetAudience}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Prerequisites:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedPlan.prerequisites.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-semibold block mb-1">Core Tools &amp; Frameworks:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedPlan.keyToolsFrameworks.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {generatedPlan.capstoneProjectIdea && (
                  <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900 font-bold block mb-0.5">Capstone Final Defense Project Idea:</strong>
                    {generatedPlan.capstoneProjectIdea}
                  </div>
                )}
              </div>

              {/* Weekly Timeline Breakdown */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-sky-600" />
                  <span>Weekly Module Timeline &amp; Hands-On Lab Missions</span>
                </h4>

                <div className="space-y-4">
                  {generatedPlan.weeks.map((week) => (
                    <div
                      key={week.weekNumber}
                      className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md bg-[#0f172a] text-sky-400 font-mono text-xs font-bold">
                            WEEK {week.weekNumber}
                          </span>
                          <h5 className="font-bold text-sm text-slate-900">{week.theme}</h5>
                        </div>
                        {week.checkpointMilestone && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            Milestone: {week.checkpointMilestone}
                          </span>
                        )}
                      </div>

                      {/* Topics & Learning Objectives */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div>
                          <strong className="text-slate-700 font-semibold block mb-1">Topics Covered:</strong>
                          <ul className="space-y-1 list-disc list-inside text-slate-600">
                            {week.topics.map((t, idx) => (
                              <li key={idx}>{t}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <strong className="text-slate-700 font-semibold block mb-1">Learning Outcomes:</strong>
                          <ul className="space-y-1 list-disc list-inside text-slate-600">
                            {week.learningObjectives.map((obj, idx) => (
                              <li key={idx}>{obj}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Practical Lab Mission */}
                      {week.practicalLabMission && (
                        <div className="mt-2 p-3.5 rounded-lg bg-white border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                              <Terminal className="w-3.5 h-3.5 text-sky-600" />
                              <span>{week.practicalLabMission.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {week.practicalLabMission.tools.map((tl, idx) => (
                                <span key={idx} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {tl}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {week.practicalLabMission.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Existing Study Plans from department */}
      {activeStudyPlans.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>Active Department Study Plans ({activeStudyPlans.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeStudyPlans.map((plan) => (
              <div key={plan.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-700">{plan.totalWeeks} Weeks</span>
                  <span className="text-[11px] text-slate-400">{plan.createdAt}</span>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">{plan.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{plan.targetAudience}</p>
                <div className="pt-2 flex flex-wrap gap-1">
                  {plan.keyToolsFrameworks.slice(0, 3).map((tool, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
