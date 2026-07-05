import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Award, Sparkles, ChevronRight, 
  ChevronLeft, CheckCircle, HelpCircle, Send, Instagram, Phone, Mail 
} from 'lucide-react';

interface QuizData {
  grade: string;
  stream: string;
  primaryGoal: string;
  preferredTiming: string;
  studentName: string;
  phone: string;
}

interface NeedsQuizProps {
  onQuizSubmit: (data: QuizData) => void;
  addNotification: (text: string, type?: 'success' | 'info') => void;
}

export default function NeedsQuiz({ onQuizSubmit, addNotification }: NeedsQuizProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuizData>({
    grade: '',
    stream: '',
    primaryGoal: '',
    preferredTiming: '',
    studentName: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const grades = [
    { id: 'middle', label: 'Grades 7th - 8th', description: 'Strong Foundation Building' },
    { id: 'high', label: 'Grades 9th - 10th', description: 'Board Exams Preparation' },
    { id: 'senior-11', label: 'Grade 11th', description: 'Stream Core Mastery' },
    { id: 'senior-12', label: 'Grade 12th', description: 'Elite Board prep & Revision' }
  ];

  const streams = [
    { id: 'medical', label: 'Medical (PCB)', description: 'Physics, Chemistry, Biology focus' },
    { id: 'non-medical', label: 'Non-Medical (PCM)', description: 'Physics, Chemistry, Mathematics focus' },
    { id: 'commerce', label: 'Commerce', description: 'Accountancy, Business Studies, Economics' },
    { id: 'all-subjects', label: 'All Subjects (Science/Maths/SST)', description: 'Foundation Streams for Grades 7-10' }
  ];

  const goals = [
    { id: 'board-excellence', label: 'Score 95%+ in Board Exams', icon: Award },
    { id: 'concept-clarity', label: 'Build Strong Concept Clarity', icon: BookOpen },
    { id: 'one-on-one', label: '1-on-1 personalized doubt clearing', icon: Sparkles },
    { id: 'regular-testing', label: 'Regular Mock Tests & Feedback', icon: HelpCircle }
  ];

  const timings = [
    { id: 'early-evening', label: '3:00 PM - 5:00 PM', description: 'Perfect for local school students' },
    { id: 'late-evening', label: '5:00 PM - 7:00 PM', description: 'Optimal revision hours' },
    { id: 'flexible', label: 'Flexible Hours', description: 'Discuss with counselor' }
  ];

  const handleSelectGrade = (gradeId: string) => {
    setFormData(prev => ({ ...prev, grade: gradeId }));
    // If selecting grades 7-10, auto-set stream to "all-subjects" and skip step 2 or show stream option
    if (gradeId === 'middle' || gradeId === 'high') {
      setFormData(prev => ({ ...prev, stream: 'all-subjects' }));
      setStep(3); // skip stream step
    } else {
      setStep(2);
    }
  };

  const handleSelectStream = (streamId: string) => {
    setFormData(prev => ({ ...prev, stream: streamId }));
    setStep(3);
  };

  const handleSelectGoal = (goalId: string) => {
    setFormData(prev => ({ ...prev, primaryGoal: goalId }));
    setStep(4);
  };

  const handleSelectTiming = (timingId: string) => {
    setFormData(prev => ({ ...prev, preferredTiming: timingId }));
    setStep(5);
  };

  const handleBack = () => {
    if (step === 3 && (formData.grade === 'middle' || formData.grade === 'high')) {
      setStep(1);
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.phone.trim()) {
      addNotification('Please fill in your name and phone number', 'info');
      return;
    }
    setIsSubmitted(true);
    onQuizSubmit(formData);
    addNotification('Quiz Submitted! We have generated your customized program.', 'success');
  };

  const getRecommendation = () => {
    const isSenior = formData.grade === 'senior-11' || formData.grade === 'senior-12';
    const gradeLabel = grades.find(g => g.id === formData.grade)?.label || 'High School';
    const streamLabel = streams.find(s => s.id === formData.stream)?.label || 'General Subjects';
    
    if (isSenior) {
      return {
        batch: `Senior Elite - ${streamLabel} (${gradeLabel})`,
        frequency: '6 Days a Week (90 mins sessions)',
        features: [
          'High-yield board prep questions',
          'Chapter-wise quick diagnostic materials',
          'Bi-weekly Mock Board test series with CBSE/PSEB evaluation',
          'Direct mentorship by senior subject matter experts'
        ],
        focus: 'Rigorous syllabus completion + exhaustive revisions'
      };
    } else {
      return {
        batch: `Junior Foundation - ${gradeLabel}`,
        frequency: '5 Days a Week (60 mins sessions)',
        features: [
          'Conceptual visualization for Mathematics & Science',
          'Regular progress diagnostics',
          'Interactive doubt resolution circles',
          'Small peer groups of maximum 15 scholars'
        ],
        focus: 'Unshakeable school exam confidence & fundamental clarity'
      };
    }
  };

  const recommendation = getRecommendation();

  const getWhatsAppLink = () => {
    const gradeLabel = grades.find(g => g.id === formData.grade)?.label || formData.grade;
    const streamLabel = streams.find(s => s.id === formData.stream)?.label || formData.stream;
    const text = `Hello Success Institute, I have just completed the Academic Needs Quiz on your portal!
Student Name: ${formData.studentName}
Phone Number: ${formData.phone}
Grade Level: ${gradeLabel}
Stream: ${streamLabel}
Primary Academic Objective: ${formData.primaryGoal}
Preferred Schedule Slot: ${formData.preferredTiming}

Recommended Cohort: ${recommendation.batch}

Please schedule my free counselor assessment session and interactive demo class. Thank you!`;
    return `https://wa.me/919780663487?text=${encodeURIComponent(text)}`;
  };

  const getEmailLink = () => {
    const gradeLabel = grades.find(g => g.id === formData.grade)?.label || formData.grade;
    const streamLabel = streams.find(s => s.id === formData.stream)?.label || formData.stream;
    const subject = `New Quiz Admission Inquiry: ${formData.studentName}`;
    const body = `Hello Success Institute Faculty,

I have just completed the Academic Needs Quiz and generated a customized recommendation plan.

Details:
- Student Name: ${formData.studentName}
- WhatsApp/Phone: ${formData.phone}
- Grade Level: ${gradeLabel}
- Stream: ${streamLabel}
- Primary Academic Objective: ${formData.primaryGoal}
- Preferred Schedule Slot: ${formData.preferredTiming}

Recommended Cohort: ${recommendation.batch}

Please get in touch with me to schedule our interactive demo class.

Regards,
${formData.studentName}`;
    return `mailto:successinstitute05@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel p-6 md:p-10 rounded-[32px] border border-white/10 relative overflow-hidden shadow-2xl" id="needs-quiz">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full filter blur-[80px] -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-[80px] -ml-16 -mb-16 pointer-events-none" />

      {/* Progress Bar */}
      {!isSubmitted && (
        <div className="mb-8 relative z-10">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">
            <span>Student Needs Quiz</span>
            <span>Step {step} of 5</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            {/* STEP 1: GRADE SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Step 1 — Academic Level</span>
                  <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">Which class is the student currently studying in?</h3>
                  <p className="text-xs text-on-surface-variant mt-1">We customize our pedagogical approach according to the student's grade category.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {grades.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGrade(g.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:scale-[1.01] flex items-start gap-4 ${
                        formData.grade === g.id 
                          ? 'bg-primary-container border-primary shadow-lg shadow-primary/10 text-white' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${formData.grade === g.id ? 'bg-white/15' : 'bg-white/5'}`}>
                        <GraduationCap className={`w-5 h-5 ${formData.grade === g.id ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-wide text-white">{g.label}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-1 leading-normal">{g.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: STREAM SELECTION (Seniors only) */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Step 2 — Stream Focus</span>
                  <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">Choose your academic stream</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Our specialized program cohorts are segregated by streams to ensure concentrated focus.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {streams.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSelectStream(s.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:scale-[1.01] flex items-start gap-4 ${
                        formData.stream === s.id 
                          ? 'bg-primary-container border-primary shadow-lg shadow-primary/10 text-white' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 ${formData.stream === s.id ? 'bg-white/15' : 'bg-white/5'}`}>
                        <BookOpen className={`w-5 h-5 ${formData.stream === s.id ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm tracking-wide text-white">{s.label}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-1 leading-normal">{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-white cursor-pointer font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ACADEMIC GOAL */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Step 3 — Core Goal</span>
                  <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">What is the student's primary academic objective?</h3>
                  <p className="text-xs text-on-surface-variant mt-1">We fine-tune our tutoring methodology to match each student's learning target.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {goals.map((g) => {
                    const IconComponent = g.icon;
                    return (
                      <button
                        key={g.id}
                        onClick={() => handleSelectGoal(g.id)}
                        className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:scale-[1.01] flex items-start gap-4 ${
                          formData.primaryGoal === g.id 
                            ? 'bg-primary-container border-primary shadow-lg shadow-primary/10 text-white' 
                            : 'bg-white/5 border-white/5 hover:border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl shrink-0 ${formData.primaryGoal === g.id ? 'bg-white/15' : 'bg-white/5'}`}>
                          <IconComponent className={`w-5 h-5 ${formData.primaryGoal === g.id ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <div className="flex-1 self-center">
                          <h4 className="font-bold text-sm tracking-wide text-white leading-snug">{g.label}</h4>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-white cursor-pointer font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: TIMINGS */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Step 4 — Schedule Preference</span>
                  <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">Select your preferred tutoring slot</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Small batch sessions are offered across multiple daily timing blocks.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {timings.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTiming(t.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between ${
                        formData.preferredTiming === t.id 
                          ? 'bg-primary-container border-primary shadow-lg shadow-primary/10 text-white' 
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-on-surface-variant hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <h4 className="font-bold text-base tracking-wide text-white">{t.label}</h4>
                        <p className="text-[10px] text-on-surface-variant mt-2 leading-relaxed">{t.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    onClick={handleBack}
                    className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-white cursor-pointer font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CONTACT INFORMATION */}
            {step === 5 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center md:text-left">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-1">Step 5 — Final Details</span>
                  <h3 className="text-2xl font-extrabold text-white font-display tracking-tight">Let's generate your customized program!</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Provide your name and contact details to see your recommended tutoring batch and secure your free counseling invite.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Student Full Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Enter Student's Name"
                      value={formData.studentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-xs text-white placeholder-on-surface-variant/40 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">WhatsApp / Phone Number *</label>
                    <input 
                      type="tel"
                      required
                      placeholder="Enter Mobile Number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-xs text-white placeholder-on-surface-variant/40 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button 
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-white cursor-pointer font-bold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Generate Recommendation <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : (
          /* QUIZ SUBMITTED: RESULT PAGE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-8 relative z-10"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/5 animate-pulse">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-[0.2em] block">
                  COACHING PLAN GENERATED SUCCESSFULLY
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1">
                  Welcome, {formData.studentName}!
                </h3>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 text-left max-w-2xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-primary font-bold block">Recommended Coaching Batch</span>
                  <h4 className="text-lg font-bold text-white mt-1">{recommendation.batch}</h4>
                </div>
                <div className="bg-primary/10 border border-primary/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-center">
                  ★ Elite Standard
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-on-surface-variant font-bold block mb-1">Weekly Commitment</span>
                  <p className="text-white font-semibold">{recommendation.frequency}</p>
                </div>
                <div>
                  <span className="text-on-surface-variant font-bold block mb-1">Strategic Pedagogical Focus</span>
                  <p className="text-white font-semibold">{recommendation.focus}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block">Key Cohort Benefits</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {recommendation.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-on-surface-variant">
                      <div className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary mt-0.5">
                        <CheckCircle className="w-2.5 h-2.5" />
                      </div>
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Step Counselor Callout */}
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4 text-left">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <div className="flex-1 space-y-1">
                <h5 className="font-bold text-sm text-white">What happens next?</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Our chief enrollment officer will call you on <strong className="text-white">{formData.phone}</strong> within 2 hours to coordinate your student's free offline baseline diagnostic assessment test at our Ludhiana campus.
                </p>
              </div>
            </div>

            {/* Direct Message Prompt with Phone and Email provided */}
            <div className="max-w-2xl mx-auto space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">Or Connect Instantly to Secure Your Spot</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all hover:scale-[1.01]"
                >
                  <Phone className="w-4 h-4" /> Message via WhatsApp
                </a>
                <a
                  href={getEmailLink()}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all border border-white/5 hover:scale-[1.01]"
                >
                  <Mail className="w-4 h-4" /> Message via Email
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                  setFormData({
                    grade: '',
                    stream: '',
                    primaryGoal: '',
                    preferredTiming: '',
                    studentName: '',
                    phone: ''
                  });
                }}
                className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white cursor-pointer transition-colors"
              >
                Retake Assessment Quiz
              </button>

              <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

              <a 
                href="https://www.instagram.com/the.success.institute"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-primary shrink-0" />
                Follow us @the.success.institute
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
