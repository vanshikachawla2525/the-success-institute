import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckSquare, Clock, GraduationCap, Award, Calendar, FileText, 
  ChevronRight, LogOut, FileUp, ClipboardList, CheckCircle2, Play, ChevronLeft, 
  BookMarked, Users, Sparkles, TrendingUp, RefreshCw, AlertCircle, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Assignment, MockTest, Question } from '../types';
import { INITIAL_ASSIGNMENTS, INITIAL_TESTS, TEST_QUESTIONS } from '../data';

interface StudentPortalProps {
  studentName: string;
  stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation';
  onLogout: () => void;
  onAddNotification: (msg: string, type: 'success' | 'info') => void;
}

export default function StudentPortal({ studentName, stream, onLogout, onAddNotification }: StudentPortalProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'tests' | 'schedule'>('dashboard');
  
  // States
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const local = localStorage.getItem(`asg_${studentName}`);
    return local ? JSON.parse(local) : INITIAL_ASSIGNMENTS;
  });
  
  const [tests, setTests] = useState<MockTest[]>(() => {
    const local = localStorage.getItem(`tests_${studentName}`);
    return local ? JSON.parse(local) : INITIAL_TESTS;
  });

  const [testHistory, setTestHistory] = useState<{name: string, score: number, date: string}[]>(() => {
    return [
      { name: 'Weekly Test 1', score: 75, date: 'June 12' },
      { name: 'Weekly Test 2', score: 85, date: 'June 19' },
      { name: 'Monthly Diagnostic', score: 80, date: 'June 26' },
    ];
  });

  // Test session state
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    testId: string;
    score: number;
    correctCount: number;
    total: number;
    questions: Question[];
    userAnswers: Record<string, number>;
  } | null>(null);

  // File upload simulation state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [uploadingAsgId, setUploadingAsgId] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`asg_${studentName}`, JSON.stringify(assignments));
  }, [assignments, studentName]);

  useEffect(() => {
    localStorage.setItem(`tests_${studentName}`, JSON.stringify(tests));
  }, [tests, studentName]);

  // Timer for active test
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTestRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTestRunning && timeLeft === 0) {
      handleAutoSubmit();
    }
    return () => clearTimeout(timer);
  }, [isTestRunning, timeLeft]);

  // Calculate stats
  const completedAssignmentsCount = assignments.filter((a) => a.status === 'completed').length;
  const assignmentProgress = assignments.length > 0 ? Math.round((completedAssignmentsCount / assignments.length) * 100) : 0;
  
  const completedTestsCount = tests.filter((t) => t.status === 'completed').length;
  const overallPerformanceScore = Math.round(
    [...testHistory.map((h) => h.score), ...tests.filter((t) => t.status === 'completed' && t.score !== undefined).map((t) => t.score as number)]
    .reduce((sum, val) => sum + val, 0) / 
    (testHistory.length + tests.filter((t) => t.status === 'completed' && t.score !== undefined).length)
  );

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle single assignment checkbox
  const handleToggleAssignment = (id: string) => {
    const updated = assignments.map((asg) => {
      if (asg.id === id) {
        const nextStatus = asg.status === 'completed' ? 'pending' : 'completed';
        onAddNotification(
          `Assignment marked as ${nextStatus}!`,
          nextStatus === 'completed' ? 'success' : 'info'
        );
        return { ...asg, status: nextStatus };
      }
      return asg;
    });
    setAssignments(updated);
  };

  // Drag over handler for simulation
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Simulate file upload
  const handleDrop = (e: React.DragEvent, asgId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateUpload(asgId, e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, asgId: string) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(asgId, e.target.files[0].name);
    }
  };

  const simulateUpload = (asgId: string, filename: string) => {
    setUploadingAsgId(asgId);
    setTimeout(() => {
      setAssignments((prev) =>
        prev.map((asg) => {
          if (asg.id === asgId) {
            return { ...asg, status: 'completed' };
          }
          return asg;
        })
      );
      setUploadingAsgId(null);
      onAddNotification(`Successfully uploaded "${filename}" and submitted assignment!`, 'success');
    }, 1500);
  };

  // Mock Test Functions
  const handleStartTest = (test: MockTest) => {
    const questions = TEST_QUESTIONS[test.id];
    if (!questions) {
      onAddNotification('This test content is not available in demo.', 'info');
      return;
    }
    setActiveTestId(test.id);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(test.durationMinutes * 60);
    setIsTestRunning(true);
    setTestResult(null);
    onAddNotification(`Started test: ${test.title}`, 'info');
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleAutoSubmit = () => {
    if (isTestRunning) {
      onAddNotification('Time expired! Auto-submitting your test...', 'info');
      handleSubmitTest();
    }
  };

  const handleSubmitTest = () => {
    if (!activeTestId) return;

    setIsTestRunning(false);
    const questions = TEST_QUESTIONS[activeTestId] || [];
    let correctCount = 0;

    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePercent = Math.round((correctCount / questions.length) * 100);

    // Update tests state
    setTests((prev) =>
      prev.map((t) => {
        if (t.id === activeTestId) {
          return { ...t, status: 'completed', score: scorePercent };
        }
        return t;
      })
    );

    // Save in history for the graph
    const currentTestObj = tests.find((t) => t.id === activeTestId);
    const label = currentTestObj ? currentTestObj.title.split(': ')[1] || 'Mock Test' : 'Mock Test';
    setTestHistory((prev) => [
      ...prev,
      { name: label.substring(0, 15), score: scorePercent, date: 'Today' }
    ]);

    setTestResult({
      testId: activeTestId,
      score: scorePercent,
      correctCount,
      total: questions.length,
      questions,
      userAnswers: selectedAnswers
    });

    onAddNotification(`Mock test submitted! Score: ${scorePercent}%`, 'success');
  };

  const handleExitTestMode = () => {
    setActiveTestId(null);
    setTestResult(null);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setActiveTab('tests');
  };

  // Schedule mock classes
  const classes = [
    { time: '04:00 PM - 05:30 PM', subject: 'Physics', topic: 'Rotational Dynamics & Torque', teacher: 'Dr. V. K. Sharma', room: 'Smart Class A' },
    { time: '05:45 PM - 07:15 PM', subject: 'Chemistry', topic: 'Thermodynamics State Functions', teacher: 'Prof. Alka Gupta', room: 'Smart Class B' },
    { time: '07:30 PM - 08:30 PM', subject: 'Doubt Cell', topic: '1-on-1 Personal Query Solving', teacher: 'S. Rawat (Senior Physics Faculty)', room: 'Cubicle 4' },
  ];

  // Notes resources
  const studyMaterials = [
    { title: 'Mechanics Formulas & Derivations Compendium', size: '4.2 MB', downloads: '120+', date: 'July 01, 2026' },
    { title: 'Aldehydes, Ketones Complete Organic Mapping', size: '6.8 MB', downloads: '95+', date: 'June 28, 2026' },
    { title: 'Calculus Limits, Continuity & Discontinuity Notes', size: '3.1 MB', downloads: '142+', date: 'June 25, 2026' },
    { title: 'NCERT Biology High-Yield Diagram Handbook', size: '12.4 MB', downloads: '210+', date: 'June 20, 2026' }
  ];

  // If in test simulation view
  if (activeTestId && isTestRunning) {
    const questions = TEST_QUESTIONS[activeTestId] || [];
    const currentQuestion = questions[currentQuestionIdx];

    return (
      <div className="min-h-screen bg-background text-on-surface py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl glass-panel-heavy rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
          
          {/* Test Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-white/5 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">AITS MOCK EXAM IN PROGRESS</span>
              <h3 className="text-xl font-bold font-display text-white mt-1">
                {tests.find((t) => t.id === activeTestId)?.title}
              </h3>
            </div>
            {/* Timer */}
            <div className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-mono font-bold tracking-wider text-sm ${
              timeLeft < 60 ? 'bg-primary-container/15 border-primary text-primary animate-pulse' : 'bg-surface-container border-white/10 text-white'
            }`}>
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Test Main Area */}
          <div className="min-h-[250px]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
              <span className="text-xs px-2.5 py-1 bg-surface-container-high rounded-full border border-white/5 text-primary text-[10px] uppercase tracking-wide">
                {currentQuestionIdx === questions.length - 1 ? 'Final Question' : 'Next up: Multi-choice'}
              </span>
            </div>

            <p className="text-lg font-medium text-white mb-6">
              {currentQuestion.text}
            </p>

            {/* Answer Choices */}
            <div className="grid grid-cols-1 gap-3.5 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(currentQuestion.id, idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-primary-container/10 border-primary text-white shadow-md'
                        : 'bg-surface-container/60 border-white/5 text-on-surface-variant hover:text-white hover:bg-surface-container-high hover:border-white/10'
                    }`}
                  >
                    <span className="text-sm font-medium">{option}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-primary bg-primary' : 'border-white/20 group-hover:border-white/45'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Footer Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-white/5">
            <button
              onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
              disabled={currentQuestionIdx === 0}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentQuestionIdx === 0
                  ? 'text-on-surface-variant/30 bg-white/2 cursor-not-allowed'
                  : 'text-on-surface-variant hover:text-white bg-surface-container hover:bg-surface-container-high cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-white text-sm font-semibold rounded-xl transition-all cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-6 py-2.5 bg-primary-container hover:bg-primary-container/85 text-white text-sm font-bold rounded-xl transition-all glow-primary hover:scale-[1.02] cursor-pointer"
                id="submit-test-button"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If in Test results review view
  if (testResult) {
    return (
      <div className="min-h-screen bg-background text-on-surface py-8 px-4 flex items-center justify-center">
        <div className="w-full max-w-3xl glass-panel-heavy rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary" />
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white tracking-tight">Test Submission Report</h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Result for: {tests.find((t) => t.id === testResult.testId)?.title}
            </p>
          </div>

          {/* Scores Overview Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl font-bold text-white font-display">
                {testResult.correctCount} / {testResult.total}
              </div>
              <div className="text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold mt-1">Correct Answers</div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl font-bold text-primary font-display">
                {testResult.score}%
              </div>
              <div className="text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold mt-1">Accuracy Rate</div>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl border border-white/5 text-center">
              <div className="text-2xl font-bold text-emerald-500 font-display">
                +{testResult.correctCount * 10}
              </div>
              <div className="text-[10px] uppercase text-on-surface-variant tracking-wider font-semibold mt-1">Score Points</div>
            </div>
          </div>

          {/* Question Review Accordion */}
          <div className="space-y-4 mb-8">
            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">Answer Explanations & Keys</h4>
            {testResult.questions.map((q, idx) => {
              const userAnswer = testResult.userAnswers[q.id];
              const isCorrect = userAnswer === q.correctIndex;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-surface-container/40 border border-white/5 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4">
                    <h5 className="text-sm font-bold text-white">
                      Q{idx + 1}. {q.text}
                    </h5>
                    <div className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider shrink-0 ${
                      isCorrect ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-primary-container/10 text-primary border border-primary/20'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isUserSelected = userAnswer === oIdx;
                      const isKeyAnswer = q.correctIndex === oIdx;

                      let optStyle = 'border-white/5 bg-surface-container-low text-on-surface-variant';
                      if (isKeyAnswer) {
                        optStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-400';
                      } else if (isUserSelected && !isCorrect) {
                        optStyle = 'bg-primary-container/15 border-primary text-primary';
                      }

                      return (
                        <div key={oIdx} className={`p-3 rounded-lg border flex justify-between items-center ${optStyle}`}>
                          <span>{opt}</span>
                          {isKeyAnswer && <span className="text-[10px] font-bold text-emerald-400 uppercase">Key</span>}
                          {isUserSelected && !isCorrect && <span className="text-[10px] font-bold text-primary uppercase">Your Ans</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation text */}
                  <div className="bg-surface-container-low p-4 rounded-xl border-l-2 border-primary/30 mt-2 text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-white block mb-1">Pedagogical Analysis:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Results Action */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleExitTestMode}
              className="px-6 py-3 bg-primary-container text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:bg-primary-container/85 transition-all shadow-lg shadow-primary-container/20 cursor-pointer"
            >
              Back to Portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface py-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
      {/* Portal Top banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary-container/5 filter blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center shrink-0 shadow-lg glow-primary">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-bold font-display text-white">{studentName}</h2>
              <span className="bg-primary-container/20 border border-primary/20 text-primary text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                {stream}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Registration Ref: <span className="font-mono text-white">#TSI-2026-{studentName.substring(0, 3).toUpperCase()}</span> • Active Scholar
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              onAddNotification('Refreshed diagnostic portal parameters!', 'info');
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-white/5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
          </button>
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-container hover:bg-primary-container/85 rounded-xl text-xs font-bold text-white shadow-lg shadow-primary-container/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout Portal
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Portal Menu Column */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 p-4 rounded-2xl text-left font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-primary-container text-white font-bold shadow-lg shadow-primary-container/15 border-l-4 border-white'
                : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-white border border-white/5'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" /> Portal Dashboard
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center justify-between p-4 rounded-2xl text-left font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'assignments'
                ? 'bg-primary-container text-white font-bold shadow-lg shadow-primary-container/15 border-l-4 border-white'
                : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-white border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-4 h-4 shrink-0" /> My Assignments
            </div>
            {assignments.filter(a => a.status === 'pending').length > 0 && (
              <span className="bg-white/20 text-white font-bold text-[10px] px-2 py-0.5 rounded-full">
                {assignments.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center justify-between p-4 rounded-2xl text-left font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-primary-container text-white font-bold shadow-lg shadow-primary-container/15 border-l-4 border-white'
                : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-white border border-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4 shrink-0" /> Mock Exams (AITS)
            </div>
            {tests.filter(t => t.status === 'available').length > 0 && (
              <span className="bg-primary-container/40 text-primary border border-primary/20 font-bold text-[10px] px-2 py-0.5 rounded-full">
                {tests.filter(t => t.status === 'available').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-3 p-4 rounded-2xl text-left font-semibold text-sm transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-primary-container text-white font-bold shadow-lg shadow-primary-container/15 border-l-4 border-white'
                : 'bg-surface-container/60 hover:bg-surface-container text-on-surface-variant hover:text-white border border-white/5'
            }`}
          >
            <Calendar className="w-4 h-4 shrink-0" /> Today's Classes
          </button>

          {/* Quick Notice Card */}
          <div className="glass-panel rounded-2xl p-5 mt-4 relative overflow-hidden border border-primary/10">
            <div className="w-2 h-2 rounded-full bg-primary absolute top-4 right-4 animate-ping" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary block mb-1">Academic Notice</span>
            <p className="text-xs font-bold text-white mb-2">Syllabus Revision Series</p>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              New board revision practice tests launch on Tuesday. Please ensure your science and mathematics modules are fully prepared.
            </p>
          </div>
        </div>

        {/* Content Column */}
        <div className="md:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
              >
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter">
                  <div className="bg-surface-container-low p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary-container/30 transition-all">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Continuous Accuracy</span>
                      <div className="text-3xl font-bold text-white font-display mt-1">{overallPerformanceScore}%</div>
                      <p className="text-[10px] text-emerald-500 mt-0.5">Top 15% Percentile</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary-container/20">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary-container/30 transition-all">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Classroom Attendance</span>
                      <div className="text-3xl font-bold text-white font-display mt-1">94.8%</div>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Perfect Track (Min. 90%)</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary-container/20">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary-container/30 transition-all">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">Assignments Clear</span>
                      <div className="text-3xl font-bold text-white font-display mt-1">{assignmentProgress}%</div>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{completedAssignmentsCount} of {assignments.length} Completed</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center border border-primary-container/20">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>

                {/* Performance Graph & Class Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                  {/* Custom SVG Line Chart */}
                  <div className="lg:col-span-8 bg-surface-container-low p-6 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mock Series Evaluation</h4>
                        <p className="text-[10px] text-on-surface-variant">Scores over the last 4 mock iterations</p>
                      </div>
                      <span className="text-[10px] uppercase bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                        Class Percentile: Top 5%
                      </span>
                    </div>

                    {/* Highly responsive custom vector SVG chart tracking scores */}
                    <div className="w-full h-[220px] relative">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                        {/* Grids */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3" />
                        <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3" />
                        <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3" />
                        <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255, 255, 255, 0.08)" />

                        {/* Y-Axis scale tags */}
                        <text x="-15" y="25" fill="#e5bdb9" fontSize="9" opacity="0.4">100%</text>
                        <text x="-15" y="105" fill="#e5bdb9" fontSize="9" opacity="0.4">50%</text>
                        <text x="-15" y="185" fill="#e5bdb9" fontSize="9" opacity="0.4">0%</text>

                        {/* Gradient Area under line */}
                        <defs>
                          <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#c1121f" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#c1121f" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d={`M 25 180 L 25 ${180 - (testHistory[0]?.score || 70) * 1.5} L 150 ${180 - (testHistory[1]?.score || 85) * 1.5} L 300 ${180 - (testHistory[2]?.score || 80) * 1.5} L 450 ${180 - (testHistory[3]?.score || overallPerformanceScore) * 1.5} L 450 180 Z`}
                          fill="url(#chart-glow)"
                        />

                        {/* Trend Line */}
                        <path
                          d={`M 25 ${180 - (testHistory[0]?.score || 70) * 1.5} L 150 ${180 - (testHistory[1]?.score || 85) * 1.5} L 300 ${180 - (testHistory[2]?.score || 80) * 1.5} L 450 ${180 - (testHistory[3]?.score || overallPerformanceScore) * 1.5}`}
                          fill="none"
                          stroke="#c1121f"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />

                        {/* Data Points */}
                        <circle cx="25" cy={180 - (testHistory[0]?.score || 70) * 1.5} r="5" fill="#ffb3ad" stroke="#c1121f" strokeWidth="2" />
                        <circle cx="150" cy={180 - (testHistory[1]?.score || 85) * 1.5} r="5" fill="#ffb3ad" stroke="#c1121f" strokeWidth="2" />
                        <circle cx="300" cy={180 - (testHistory[2]?.score || 80) * 1.5} r="5" fill="#ffb3ad" stroke="#c1121f" strokeWidth="2" />
                        <circle cx="450" cy={180 - (testHistory[3]?.score || overallPerformanceScore) * 1.5} r="6" fill="#white" stroke="#c1121f" strokeWidth="2" />

                        {/* Score Text labels */}
                        <text x="20" y={160 - (testHistory[0]?.score || 70) * 1.5} fill="white" fontSize="9" fontWeight="bold">{testHistory[0]?.score}%</text>
                        <text x="145" y={160 - (testHistory[1]?.score || 85) * 1.5} fill="white" fontSize="9" fontWeight="bold">{testHistory[1]?.score}%</text>
                        <text x="295" y={160 - (testHistory[2]?.score || 80) * 1.5} fill="white" fontSize="9" fontWeight="bold">{testHistory[2]?.score}%</text>
                        <text x="445" y={160 - (testHistory[3]?.score || overallPerformanceScore) * 1.5} fill="#ffb3ad" fontSize="10" fontWeight="bold">{testHistory[3]?.score || overallPerformanceScore}%</text>

                        {/* X-axis indicators */}
                        <text x="20" y="195" fill="#e5bdb9" fontSize="8" opacity="0.6">Weekly 1</text>
                        <text x="145" y="195" fill="#e5bdb9" fontSize="8" opacity="0.6">Weekly 2</text>
                        <text x="295" y="195" fill="#e5bdb9" fontSize="8" opacity="0.6">Monthly</text>
                        <text x="440" y="195" fill="#ffb3ad" fontSize="8" fontWeight="bold">Current</text>
                      </svg>
                    </div>
                  </div>

                  {/* Today's Schedule panel summary */}
                  <div className="lg:col-span-4 bg-surface-container-low p-6 rounded-3xl border border-white/5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary" /> Today's Routine
                      </h4>
                      <div className="space-y-4">
                        {classes.slice(0, 2).map((cls, idx) => (
                          <div key={idx} className="border-l-2 border-primary-container pl-3 text-xs">
                            <span className="text-[10px] font-bold text-primary block">{cls.time}</span>
                            <span className="font-bold text-white block mt-0.5">{cls.subject}: {cls.topic}</span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">Faculty: {cls.teacher}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTab('schedule')}
                      className="w-full mt-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-white/5 hover:border-white/10 rounded-xl text-center text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      View Complete Schedule
                    </button>
                  </div>
                </div>

                {/* Pending Tasks Quick Action list */}
                <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-primary" /> Active Action Items
                    </h4>
                    <span onClick={() => setActiveTab('assignments')} className="text-xs text-primary font-bold hover:underline cursor-pointer">
                      View All
                    </span>
                  </div>

                  <div className="space-y-3">
                    {assignments.slice(0, 2).map((asg) => (
                      <div key={asg.id} className="p-4 rounded-xl bg-surface-container/40 border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={asg.status === 'completed'}
                            onChange={() => handleToggleAssignment(asg.id)}
                            className="w-4.5 h-4.5 bg-surface rounded-md border-white/10 text-primary-container focus:ring-primary-container focus:ring-1 focus:ring-offset-0 cursor-pointer"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">{asg.title}</span>
                            <span className="text-[10px] text-on-surface-variant">Subject: {asg.subject} • Due by: {asg.dueDate}</span>
                          </div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider shrink-0 ${
                          asg.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {asg.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'assignments' && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold font-display text-white">Daily Practice & Core Assignments</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Submit files to mark as completed and verify with faculty</p>
                  </div>
                  {/* Progress bar info */}
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-white">Clearance Rate: {assignmentProgress}%</div>
                    <div className="w-28 bg-surface-container h-1.5 rounded-full mt-1.5 overflow-hidden border border-white/5">
                      <div className="bg-primary h-full transition-all duration-500" style={{ width: `${assignmentProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {assignments.map((asg) => (
                    <div
                      key={asg.id}
                      className="bg-surface-container-low p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            checked={asg.status === 'completed'}
                            onChange={() => handleToggleAssignment(asg.id)}
                            className="w-5 h-5 bg-surface rounded-md border-white/10 text-primary-container focus:ring-primary-container focus:ring-1 focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {asg.title}
                            <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded border border-white/5 text-on-surface-variant">
                              {asg.subject}
                            </span>
                          </h4>
                          <p className="text-[11px] text-on-surface-variant mt-1">
                            Required: Comprehensive answers with steps. Due by <span className="text-white font-medium">{asg.dueDate}</span>
                          </p>
                        </div>
                      </div>

                      {/* File Upload simulator panel */}
                      <div className="flex items-center gap-3 self-end md:self-center">
                        {asg.status === 'completed' ? (
                          <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-bold px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <CheckSquare className="w-4 h-4" /> Submitted & Verified
                          </div>
                        ) : (
                          <div className="relative">
                            <input
                              type="file"
                              id={`file-${asg.id}`}
                              className="hidden"
                              accept=".pdf,.png,.jpg"
                              onChange={(e) => handleFileSelect(e, asg.id)}
                              disabled={uploadingAsgId !== null}
                            />
                            <label
                              htmlFor={`file-${asg.id}`}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-surface-container-high hover:bg-primary-container transition-all border border-white/5 hover:border-primary-container/20 cursor-pointer ${
                                uploadingAsgId === asg.id ? 'opacity-50 cursor-wait' : ''
                              }`}
                            >
                              {uploadingAsgId === asg.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                                </>
                              ) : (
                                <>
                                  <FileUp className="w-3.5 h-3.5" /> Submit PDF
                                </>
                              )}
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'tests' && (
              <motion.div
                key="tests"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Mock Examinations</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Real-time examination environments with comprehensive pedagogical evaluation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[180px] transition-all relative overflow-hidden ${
                        test.status === 'completed'
                          ? 'bg-surface-container-low/40 border-white/5 opacity-80'
                          : 'bg-surface-container-low border-primary-container/10 hover:border-primary-container/30 glow-soft-white hover:scale-[1.01]'
                      }`}
                    >
                      {/* Badge */}
                      <span className="absolute top-4 right-4 bg-surface-container px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider text-on-surface-variant border border-white/5">
                        {test.subject}
                      </span>

                      <div>
                        <h4 className="text-sm font-bold text-white max-w-[80%]">
                          {test.title}
                        </h4>
                        <div className="flex gap-4 text-[11px] text-on-surface-variant mt-3">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="w-3.5 h-3.5" /> {test.totalQuestions} Questions
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} Minutes
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-6">
                        {test.status === 'completed' ? (
                          <div className="flex justify-between items-center w-full">
                            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Result Available
                            </span>
                            <div className="text-xs font-bold text-white">
                              Score: <span className="text-primary">{test.score}%</span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartTest(test)}
                            className="w-full py-2.5 bg-primary-container hover:bg-primary-container/85 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 glow-primary cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-white" /> Take Exam Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Today's Class Schedule & Study Materials</h3>
                  <p className="text-xs text-on-surface-variant mt-1">View class times, topics, and access core academic resources</p>
                </div>

                {/* Today's Lectures Table */}
                <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
                  <div className="p-5 border-b border-white/5 bg-surface-container/20">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest">July 05, 2026 Lectures Timeline</h4>
                  </div>
                  <div className="divide-y divide-white/5">
                    {classes.map((cls, idx) => (
                      <div key={idx} className="p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-white/1">
                        <div>
                          <div className="text-xs font-mono font-bold text-primary flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {cls.time}
                          </div>
                          <div className="text-sm font-bold text-white mt-1">
                            {cls.subject}: <span className="text-on-surface-variant font-medium">{cls.topic}</span>
                          </div>
                          <div className="text-xs text-on-surface-variant mt-0.5">
                            Faculty Head: <span className="text-white font-medium">{cls.teacher}</span>
                          </div>
                        </div>

                        <span className="px-3 py-1 bg-surface-container text-[10px] font-bold text-white uppercase tracking-wider rounded-full border border-white/5 self-start sm:self-center">
                          {cls.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Resources List */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-primary font-bold">Academic Downloadable Sheets</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {studyMaterials.map((material, idx) => (
                      <div
                        key={idx}
                        className="bg-surface-container-low p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-primary-container/30 hover:scale-[1.01] transition-all"
                      >
                        <div>
                          <h5 className="text-xs font-bold text-white group-hover:text-primary transition-colors pr-4 leading-normal">
                            {material.title}
                          </h5>
                          <div className="flex gap-3 text-[10px] text-on-surface-variant mt-2 font-mono">
                            <span>Size: {material.size}</span>
                            <span>Date: {material.date}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onAddNotification(`Simulating PDF Download: ${material.title.substring(0, 20)}...`, 'success')}
                          className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-primary-container flex items-center justify-center shrink-0 border border-white/5 transition-colors cursor-pointer text-white"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
