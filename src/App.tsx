import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, Star, Award, Phone, Mail, BookOpen, Sparkles, Send, 
  Check, Menu, X, Users, Compass, Globe, Share2, ShieldCheck, HeartHandshake, ArrowRight, CheckCircle, Clock, RefreshCw, MapPin,
  Sun, Moon, Instagram, Play, ChevronLeft, ChevronRight, ZoomIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDENTS, PROGRAMS } from './data';
import { Student, RegistrationSubmission } from './types';
import SuccessStoriesModal from './components/SuccessStoriesModal';
import PortalLoginModal from './components/PortalLoginModal';
import StudentPortal from './components/StudentPortal';
import NeedsQuiz from './components/NeedsQuiz';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'portal'>('landing');
  const [loggedInStudent, setLoggedInStudent] = useState<{ name: string; stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation' } | null>(null);
  
  // Modals
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [latestRegistration, setLatestRegistration] = useState<RegistrationSubmission | null>(null);

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = [
    {
      url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGv57DvgVqoY2aPeA1CcLfL7TikxlNABpAuZx0lKSm6ZC2w4Y25Rfk_eP53nxUjf6GC4cqgilE8LHMz9uOCEmTW5zEdIfh4oeyzCrgoH_9SNPFbIARIEylhlfSkX7qT329p1fDPy3XstECx=s800",
      title: "Success Institute Ludhiana — Campus Front",
      description: "Our professional landmark campus located on Manakwal Road, near UVM School, Nitesh Vihar, Ludhiana."
    },
    {
      url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAGW94lv1q4825TYLcdLfozhTwtjkIbzifIKw5QmF10Q0Frg2_wjLOQrSVMIdpu2znId2gZyRlu3htZKBtveHlf8KEf2TzgZxGsJXydhxUTVSo777ExJSV1j-USOE5SC1Bbx1PxhMw=s800",
      title: "Advanced Study Hall & Smart Classroom",
      description: "Modern, fully-equipped conceptual study lounge enabling personalized micro-cohort and individual doubt sessions."
    },
    {
      url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAHbenaEQaPnnY4hVDXC_yElaqMFTTWsI8OP9f0ntjWBMlkreGikEnprG_mpqZNdFxltarSdYxxh_wMX66EEyLFYkbLWGm4bt4bKH8m05dQuu3IQjtgHOPR5ZJnO-lm3HeI-pEao=s800",
      title: "Welcome Reception Desk & Center Entrance",
      description: "The primary entry foyer where parent consultations, student admissions, and curriculum booklets are structured."
    },
    {
      url: "https://lh3.googleusercontent.com/gps-cs-s/APNQkAFzCmnxtODLLuVjI5JbROD0hp3qZwLR2D1Q1x9dLnA-scNlsDzkpM2DX4-MvAlC9PM7yu-YJroVmYvQ0bQcUr9iaVet7Ff_QeBZ7AZ093D0Ov5uppWT-B-fNJTtrQfWamj_AdRIjjX-BiY9=s800",
      title: "Interactive Classroom & Lecture Space",
      description: "Step-by-step subjective board drills and comprehensive stream-specialized lectures conducted by senior faculties.",
      externalLink: "https://maps.app.goo.gl/VGMiTjEi2w9Gyyi5A",
      externalText: "Play Video Tour on Google Maps"
    }
  ];

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Filters for Success Stories
  const [scholarFilter, setScholarFilter] = useState<'All' | 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation'>('All');

  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [targetProgram, setTargetProgram] = useState('');
  const [queries, setQueries] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic notifications state
  const [notifications, setNotifications] = useState<{ id: string; text: string; type: 'success' | 'info' }[]>([]);
  const [isLightMode, setIsLightMode] = useState(false);

  // Apply or remove theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    if (isLightMode) {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
    addNotification(`Switched to ${!isLightMode ? 'High-Contrast Light' : 'Premium Dark'} Theme`, 'info');
  };

  // Add Notification Helper
  const addNotification = (text: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  // Check if session exists in localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('tsi_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setLoggedInStudent(parsed);
        setCurrentView('portal');
      } catch (e) {
        localStorage.removeItem('tsi_session');
      }
    }
  }, []);

  const handleLoginSuccess = (name: string, stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation') => {
    const session = { name, stream };
    setLoggedInStudent(session);
    localStorage.setItem('tsi_session', JSON.stringify(session));
    setCurrentView('portal');
    addNotification(`Welcome back, ${name}! Signed in successfully.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('tsi_session');
    setLoggedInStudent(null);
    setCurrentView('landing');
    addNotification('Successfully logged out of student portal.', 'info');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phoneNumber.trim() || !targetProgram) {
      addNotification('Please fill in all required fields.', 'info');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const submission: RegistrationSubmission = {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        program: targetProgram,
        queries: queries.trim(),
        submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setLatestRegistration(submission);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
      addNotification('Registration submitted successfully!', 'success');
      
      // Reset Form fields
      setFullName('');
      setPhoneNumber('');
      setTargetProgram('');
      setQueries('');
    }, 1500);
  };

  const handleQuizSubmit = (quizData: any) => {
    let targetProg = 'Junior Secondary (7th-10th)';
    if (quizData.grade === 'senior-11' || quizData.grade === 'senior-12') {
      if (quizData.stream === 'medical') targetProg = 'XI & XII Medical Core';
      else if (quizData.stream === 'non-medical') targetProg = 'XI & XII Non-Medical Core';
      else if (quizData.stream === 'commerce') targetProg = 'XI & XII Commerce Standard';
    }

    const generatedQueries = `Generated from Needs Assessment Quiz.
Grade Level: ${quizData.grade}
Stream selected: ${quizData.stream}
Primary goal: ${quizData.primaryGoal}
Preferred timing slot: ${quizData.preferredTiming}`;

    const submission: RegistrationSubmission = {
      fullName: quizData.studentName.trim(),
      phoneNumber: quizData.phone.trim(),
      program: targetProg,
      queries: generatedQueries,
      submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLatestRegistration(submission);
    setIsSuccessModalOpen(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    addNotification(`Subscribed successfully with: ${newsletterEmail}`, 'success');
    setNewsletterEmail('');
  };

  const filteredScholars = scholarFilter === 'All'
    ? STUDENTS
    : STUDENTS.filter(s => s.stream === scholarFilter);

  return (
    <div className="bg-background text-on-surface font-sans selection:bg-primary-container selection:text-white min-h-screen relative overflow-x-hidden">
      
      {/* Background radial atmosphere */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-primary-container/5 filter blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 filter blur-[160px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-primary-container/3 filter blur-[150px] pointer-events-none" />

      {/* Floating Notification Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="p-4 rounded-xl glass-panel-heavy border border-white/10 text-xs shadow-2xl flex items-start gap-3"
            >
              <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${notif.type === 'success' ? 'bg-emerald-500 animate-pulse' : 'bg-primary'}`} />
              <div className="flex-1">
                <p className="font-semibold text-white uppercase tracking-wider text-[10px]">
                  {notif.type === 'success' ? 'Notification Alert' : 'System Notice'}
                </p>
                <p className="text-on-surface-variant mt-0.5 leading-relaxed">{notif.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Standard Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-40 bg-surface/85 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto w-full">
          <div 
            onClick={() => setCurrentView('landing')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center glow-primary group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline text-lg md:text-xl font-bold text-white tracking-tighter transition-colors group-hover:text-primary">
              The Success Institute
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {currentView === 'landing' ? (
              <>
                <a href="#programs" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors">Programs</a>
                <a href="#achievements" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors">Star Results</a>
                <a href="#stats" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors">About Us</a>
                <a href="#contact" className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors">Contact</a>
              </>
            ) : (
              <button 
                onClick={() => setCurrentView('landing')}
                className="font-label text-xs uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Landing
              </button>
            )}

            <div className="flex items-center gap-4 ml-4">
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface hover:text-white transition-all cursor-pointer border border-white/5 shadow-md flex items-center justify-center shrink-0"
                aria-label="Toggle High-Contrast Mode"
                title={isLightMode ? "Switch to Dark Mode" : "Switch to High-Contrast Light Mode"}
              >
                {isLightMode ? <Moon className="w-4 h-4 text-primary animate-pulse" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              {loggedInStudent ? (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentView('portal')}
                    className="text-white hover:text-primary font-label text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                  >
                    Go to Portal
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="bg-surface-container-high hover:bg-primary-container text-white px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-wider font-bold hover:scale-105 transition-all shadow-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="text-on-surface hover:text-white font-label text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
                  >
                    Portal Login
                  </button>
                  <a 
                    href="#contact"
                    className="bg-primary-container text-white px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-wider font-bold hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary-container/20"
                  >
                    Register Now
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface-container-low border-b border-white/5 overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col gap-4">
                {currentView === 'landing' ? (
                  <>
                    <a 
                      href="#programs" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-on-surface-variant hover:text-white"
                    >
                      Programs
                    </a>
                    <a 
                      href="#achievements" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-on-surface-variant hover:text-white"
                    >
                      Star Results
                    </a>
                    <a 
                      href="#stats" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-on-surface-variant hover:text-white"
                    >
                      About Us
                    </a>
                    <a 
                      href="#contact" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm font-semibold text-on-surface-variant hover:text-white"
                    >
                      Contact
                    </a>
                  </>
                ) : (
                  <button 
                    onClick={() => { setCurrentView('landing'); setMobileMenuOpen(false); }}
                    className="text-left text-sm font-semibold text-on-surface-variant hover:text-white cursor-pointer"
                  >
                    ← Back to Landing
                  </button>
                )}

                <div className="h-[1px] bg-white/5 my-2" />

                {loggedInStudent ? (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setCurrentView('portal'); setMobileMenuOpen(false); }}
                      className="text-left text-sm font-bold text-white hover:text-primary cursor-pointer"
                    >
                      Dashboard Portal
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full py-3 bg-primary-container hover:bg-primary-container/85 rounded-xl text-center text-sm font-bold text-white transition-colors cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setIsLoginOpen(true); setMobileMenuOpen(false); }}
                      className="text-left text-sm font-bold text-on-surface-variant hover:text-white cursor-pointer"
                    >
                      Student Portal Login
                    </button>
                    <a 
                      href="#contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 bg-primary-container hover:bg-primary-container/85 rounded-xl text-center text-sm font-bold text-white transition-colors"
                    >
                      Register Admission
                    </a>
                  </div>
                )}

                <div className="h-[1px] bg-white/5 my-2" />
                <button 
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant hover:text-white text-left cursor-pointer py-2.5 w-full"
                >
                  {isLightMode ? <Moon className="w-5 h-5 text-primary animate-pulse" /> : <Sun className="w-5 h-5 text-amber-400" />}
                  <span>{isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Sections */}
      <main>
        {currentView === 'portal' && loggedInStudent ? (
          <StudentPortal 
            studentName={loggedInStudent.name}
            stream={loggedInStudent.stream}
            onLogout={handleLogout}
            onAddNotification={addNotification}
          />
        ) : (
          /* Landing View */
          <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden" id="hero">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full relative z-10">
                
                {/* Left side info */}
                <div className="lg:col-span-6 flex flex-col justify-center text-left">
                  <span className="text-primary font-bold text-xs tracking-[0.3em] uppercase mb-4 block">
                    ACADEMIC EXCELLENCE
                  </span>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-6">
                    Your Career Is <br />
                    <span className="text-primary-container bg-gradient-to-r from-primary-container via-primary to-primary-container bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(193,18,31,0.3)]">
                      Our Responsibility
                    </span>
                  </h1>
                  <p className="font-body text-base md:text-lg text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                    Premium academic coaching for Grades 7-12, Medical, Non-Medical, and Commerce streams. Take our quick assessment survey on the right to find your ideal pathway!
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <a 
                      href="#contact"
                      className="bg-primary-container hover:bg-primary-container/85 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-primary-container/20 flex items-center gap-2 group hover:scale-[1.02]"
                    >
                      Book a Demo Class
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a 
                      href="#programs"
                      className="glass-panel hover:bg-surface-container text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all border border-white/10 hover:border-white/20 hover:scale-[1.02]"
                    >
                      Explore Programs
                    </a>
                  </div>
                </div>

                {/* Right side - Needs Assessment Quiz */}
                <div className="lg:col-span-6 relative flex items-center justify-center min-h-[400px] lg:min-h-none mt-12 lg:mt-0">
                  {/* Glowing core background */}
                  <div className="absolute w-80 h-80 rounded-full bg-primary-container/10 filter blur-[80px] pointer-events-none" />

                  <div className="w-full relative z-10">
                    <NeedsQuiz 
                      onQuizSubmit={handleQuizSubmit} 
                      addNotification={(text, type) => addNotification(text, type || 'info')} 
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Academic Specializations */}
            <section className="py-28 relative border-t border-white/5 bg-surface-container-lowest/30" id="programs">
              <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16 text-center">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] block mb-3">
                  COACHING PATHWAYS
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  Our Core Academic Programs
                </h2>
                <p className="text-sm text-on-surface-variant max-w-lg mx-auto mt-3">
                  Structured academic curricula designed by senior pedagogy subject experts to maximize student performance.
                </p>
              </div>

              {/* Programs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                {PROGRAMS.map((prog) => {
                  const isFeatured = prog.id === 'senior-science';
                  return (
                    <div 
                      key={prog.id}
                      className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                        isFeatured 
                          ? 'bg-gradient-to-b from-surface-container-high to-surface-container border-2 border-primary-container/40 glow-primary scale-[1.02] shadow-2xl z-10' 
                          : 'glass-panel border border-white/5 hover:border-white/15'
                      }`}
                    >
                      {/* Top Choice Badge */}
                      {prog.badge && (
                        <span className="absolute top-4 right-4 bg-primary-container text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
                          {prog.badge}
                        </span>
                      )}

                      <div>
                        {/* Icon Container */}
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-md ${
                          isFeatured ? 'bg-primary-container text-white' : 'bg-surface-container text-primary'
                        }`}>
                          {prog.id === 'foundation' && <GraduationCap className="w-7 h-7" />}
                          {prog.id === 'senior-science' && <Sparkles className="w-7 h-7" />}
                          {prog.id === 'senior-commerce' && <Award className="w-7 h-7" />}
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold font-display text-white mb-2">{prog.title}</h3>
                        <p className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-4">{prog.subtitle}</p>
                        <p className="text-xs text-on-surface-variant mb-8 leading-relaxed">{prog.description}</p>

                        <div className="h-[1px] bg-white/5 my-6" />

                        <ul className="space-y-3 mb-8">
                          {prog.highlights.map((h, i) => (
                            <li key={i} className="flex items-center gap-2.5 text-xs text-on-surface-variant">
                              <Check className="w-4 h-4 text-primary shrink-0" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        onClick={() => {
                          // Scroll to form and prepopulate program
                          const progValue = prog.id === 'foundation' 
                            ? 'Junior Secondary (7th-10th)' 
                            : prog.id === 'senior-science' 
                              ? 'Senior Science (11th-12th)' 
                              : 'Senior Commerce (11th-12th)';
                          setTargetProgram(progValue);
                          
                          const contactSec = document.querySelector('#contact');
                          if (contactSec) {
                            contactSec.scrollIntoView({ behavior: 'smooth' });
                          }
                          addNotification(`Selected ${prog.title} pathway!`, 'info');
                        }}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          isFeatured 
                            ? 'bg-primary-container hover:bg-primary-container/85 text-white glow-primary' 
                            : 'bg-surface-container-high hover:bg-surface-container text-white border border-white/5 hover:border-white/10'
                        }`}
                      >
                        {prog.actionText}
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-28 border-t border-white/5 overflow-hidden" id="achievements">
              <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-12">
                <div>
                  <span className="text-primary font-bold text-xs uppercase tracking-[0.25em] block mb-3">
                    STUDENT TESTIMONIALS
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    Reviews from Our Scholars
                  </h2>
                  <p className="text-sm text-on-surface-variant mt-2 max-w-lg leading-relaxed">
                    Honest feedback and experiences shared by students who studied at our institute.
                  </p>
                </div>
              </div>

              {/* Scholar Scroll List */}
              <div className="relative w-full overflow-hidden px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-none snap-x">
                  {STUDENTS.map((student) => (
                    <div 
                      key={student.id}
                      className="snap-start shrink-0 w-80 group"
                    >
                      <div className="glass-panel overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 flex flex-col h-full bg-surface-container-low p-6">
                        {/* Quote Text */}
                        <p className="text-sm italic text-on-surface-variant leading-relaxed flex-1 mb-6">
                          "{student.quote}"
                        </p>
                        
                        {/* Profile Info Row */}
                        <div className="flex flex-col items-center text-center gap-4 border-t border-white/5 pt-6">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-surface-container border-2 border-primary/30 shrink-0 relative group-hover:scale-110 group-hover:border-primary transition-all duration-500 shadow-lg animate-float">
                            <img 
                              src={student.avatarUrl} 
                              alt={student.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div>
                            <h4 className="text-base font-extrabold text-white font-display tracking-tight">{student.name}</h4>
                            <span className="text-[10px] uppercase tracking-wider text-primary font-bold block mt-1">Verified Scholar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Faculty & Stats Section (About Us) */}
            <section className="py-28 border-t border-white/5 bg-surface-container-lowest/20" id="stats">
              <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full space-y-16">
                
                {/* About Success Institution Block */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] block">
                      ABOUT SUCCESS INSTITUTION
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                      A Legacy of Exceptional Academic Mentorship
                    </h3>
                    <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                      <p>
                        Located on <strong>Manakwal Road, near UVM School, Nitesh Vihar in Ludhiana</strong>, <strong>Success Institute</strong> has stood as a beacon of pedagogical trust for high school scholars. Our tutoring center is entirely focused on providing comprehensive subject mastery for Grades 7 to 10 across all subjects, and comprehensive stream specialized programs for Grades 11 and 12 in <strong>Medical, Non-Medical, and Commerce</strong> streams.
                      </p>
                      <p>
                        We do not believe in mass-manufactured rote learning. Instead, our senior educators craft dynamic, high-yield diagnostic materials, small classroom cohorts, and regular mock exams mapped perfectly to Punjab Board (PSEB) and CBSE requirements to build unshakeable student confidence.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-center">
                        <span className="text-2xl font-extrabold text-white font-display">1-on-1</span>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Doubt Clearance</span>
                      </div>
                      <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-center">
                        <span className="text-2xl font-extrabold text-white font-display">Board Prep</span>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Focused Testing</span>
                      </div>
                      <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex flex-col justify-center">
                        <span className="text-2xl font-extrabold text-white font-display">Manakwal</span>
                        <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Prime Location</span>
                      </div>
                    </div>

                    {/* Directions link block */}
                    <div className="rounded-2xl bg-surface-container-low border border-white/5 p-4 flex items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-primary uppercase tracking-wider block">Verified Location</span>
                          <p className="text-[11px] text-white font-medium leading-tight">Manakwal Road, near UVM School, Ludhiana</p>
                        </div>
                      </div>
                      <a 
                        href="https://maps.app.goo.gl/t3HyBLepfo74hNPs5?g_st=aw" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-white hover:text-primary font-bold transition-colors inline-flex items-center gap-1 shrink-0 bg-white/5 px-3 py-2 rounded-xl border border-white/5"
                      >
                        Navigate <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Verified Media Gallery Grid (Custom Responsive Layout) */}
                  <div className="lg:col-span-6 flex flex-col gap-4">
                    {/* Main Real Photo - Large Featured Hero */}
                    <div 
                      onClick={() => setLightboxIndex(0)}
                      className="rounded-2xl overflow-hidden border border-white/10 shadow-xl relative group h-64 sm:h-80 md:h-96 cursor-pointer"
                    >
                      <img 
                        src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGv57DvgVqoY2aPeA1CcLfL7TikxlNABpAuZx0lKSm6ZC2w4Y25Rfk_eP53nxUjf6GC4cqgilE8LHMz9uOCEmTW5zEdIfh4oeyzCrgoH_9SNPFbIARIEylhlfSkX7qT329p1fDPy3XstECx=s800" 
                        alt="Success Institute Campus Building Front" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-4 flex flex-col justify-end">
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold inline-flex items-center gap-1.5">
                          <ZoomIn className="w-3.5 h-3.5 animate-pulse" /> Click to View Full Image
                        </span>
                        <h4 className="text-base sm:text-lg font-extrabold text-white leading-snug">Success Institute — Campus Front</h4>
                        <p className="text-[10px] sm:text-xs text-on-surface-variant mt-1">Manakwal Road, near UVM School, Ludhiana</p>
                      </div>
                    </div>

                    {/* Secondary items in a 3-column row */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Classroom Photo */}
                      <div 
                        onClick={() => setLightboxIndex(1)}
                        className="rounded-xl overflow-hidden border border-white/10 shadow-md relative group h-24 sm:h-32 md:h-36 cursor-pointer"
                      >
                        <img 
                          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAGW94lv1q4825TYLcdLfozhTwtjkIbzifIKw5QmF10Q0Frg2_wjLOQrSVMIdpu2znId2gZyRlu3htZKBtveHlf8KEf2TzgZxGsJXydhxUTVSo777ExJSV1j-USOE5SC1Bbx1PxhMw=s800" 
                          alt="Success Institute Concept Classroom" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-2 sm:p-3 flex flex-col justify-end">
                          <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-primary font-bold">Classroom</span>
                          <h4 className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">Advanced Study</h4>
                        </div>
                      </div>

                      {/* Banner Entrance Photo */}
                      <div 
                        onClick={() => setLightboxIndex(2)}
                        className="rounded-xl overflow-hidden border border-white/10 shadow-md relative group h-24 sm:h-32 md:h-36 cursor-pointer"
                      >
                        <img 
                          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAHbenaEQaPnnY4hVDXC_yElaqMFTTWsI8OP9f0ntjWBMlkreGikEnprG_mpqZNdFxltarSdYxxh_wMX66EEyLFYkbLWGm4bt4bKH8m05dQuu3IQjtgHOPR5ZJnO-lm3HeI-pEao=s800" 
                          alt="Success Institute Entrance Reception" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-2 sm:p-3 flex flex-col justify-end">
                          <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-primary font-bold">Entrance</span>
                          <h4 className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">Welcome Desk</h4>
                        </div>
                      </div>

                      {/* Video Tour Trigger Thumbnail */}
                      <div 
                        onClick={() => setLightboxIndex(3)}
                        className="rounded-xl overflow-hidden border border-white/10 shadow-md relative group h-24 sm:h-32 md:h-36 cursor-pointer bg-neutral-900"
                      >
                        <img 
                          src="https://lh3.googleusercontent.com/gps-cs-s/APNQkAFzCmnxtODLLuVjI5JbROD0hp3qZwLR2D1Q1x9dLnA-scNlsDzkpM2DX4-MvAlC9PM7yu-YJroVmYvQ0bQcUr9iaVet7Ff_QeBZ7AZ093D0Ov5uppWT-B-fNJTtrQfWamj_AdRIjjX-BiY9=s800" 
                          alt="Success Institute Campus Video Tour" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.6] group-hover:brightness-[0.45]"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Smaller Central Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:bg-primary/50 transition-all duration-300">
                            <Play className="w-3.5 h-3.5 text-white ml-0.5 fill-white animate-pulse" />
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-2 sm:p-3 flex flex-col justify-end pointer-events-none">
                          <span className="text-[7px] sm:text-[8px] uppercase tracking-widest text-primary font-bold">Lecture Hall</span>
                          <h4 className="text-[9px] sm:text-[11px] font-bold text-white leading-tight">Video Tour</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Faculty & Portal Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter pt-8 border-t border-white/5">
                  
                  {/* Left Large Card: Meet Our Faculty */}
                  <div className="lg:col-span-8 glass-panel p-8 md:p-12 rounded-3xl flex flex-col justify-center border border-white/5">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest block mb-2">
                    Distinguished Educators
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-8">
                    Meet Our Expert Mentors
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary-container/20 transition-all">
                      <h4 className="text-base font-bold text-white font-display">Mr. Akash</h4>
                      <p className="text-xs text-primary font-semibold mt-1">Senior Commerce Faculty</p>
                      <p className="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
                        Expert in Business Studies and Financial Accountancy with comprehensive board evaluation insight.
                      </p>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary-container/20 transition-all">
                      <h4 className="text-base font-bold text-white font-display">Mr. Ravi</h4>
                      <p className="text-xs text-primary font-semibold mt-1">Senior Science Faculty</p>
                      <p className="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
                        Specialist in high-yield Physics theories, numerical problem-solving techniques, and Applied Mathematics.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-surface-container-low border border-white/5 hover:border-primary-container/20 transition-all">
                      <h4 className="text-base font-bold text-white font-display">Ms. Neeru</h4>
                      <p className="text-xs text-primary font-semibold mt-1">Senior Science Faculty</p>
                      <p className="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
                        Master educator in Organic & Physical Chemistry and intricate Biology concepts with detailed board prep methodologies.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Portal Card: Invite */}
                <div className="lg:col-span-4 glass-panel p-8 rounded-3xl border border-white/5 hover:border-primary-container/30 transition-all flex flex-col justify-between group relative overflow-hidden">
                  {/* Glowing light overlay */}
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-primary-container/5 filter blur-[40px] group-hover:scale-125 transition-transform duration-500" />
                  
                  <div>
                    <div className="w-12 h-12 bg-primary-container/10 border border-primary-container/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-display text-white mb-2">Student & Faculty Portal</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Access live performance charts, homework feedback sheets, and take diagnostic mock test series anytime.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setIsLoginOpen(true);
                      addNotification('Accessing secure login credentials...', 'info');
                    }}
                    className="w-full mt-8 py-3.5 bg-primary-container hover:bg-primary-container/85 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-container/10 flex items-center justify-center gap-2 cursor-pointer"
                    id="stats-portal-button"
                  >
                    <span>Go to Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          </section>



            {/* Registration Contact Form Section */}
            <section className="py-28 border-t border-white/5" id="contact">
              <div className="px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
                <div className="glass-panel rounded-[40px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/5">
                  
                  {/* Left branding information col */}
                  <div className="lg:col-span-5 bg-primary-container p-8 md:p-10 flex flex-col justify-between relative overflow-hidden">
                    {/* Floating background emblem */}
                    <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
                      <GraduationCap className="w-[300px] h-[300px]" />
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/70 block mb-2">ADMISSIONS OFFICE</span>
                      <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                        Get In Touch
                      </h3>
                      <p className="text-xs text-white/80 leading-relaxed mb-6">
                        Register for a conceptual assessment session and a live interactive demo class to experience our coaching methodologies first-hand.
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 text-white shadow-sm shrink-0">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[8px] text-white/60 uppercase tracking-widest font-bold">Direct Inquiry Line</p>
                          <p className="text-white font-bold text-xs">+91 9780663487, +91 7009847171</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 text-white shadow-sm shrink-0">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[8px] text-white/60 uppercase tracking-widest font-bold">Email</p>
                          <p className="text-white font-bold text-xs">successinstitute05@gmail.com</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/10 text-white shadow-sm shrink-0">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[8px] text-white/60 uppercase tracking-widest font-bold">Address</p>
                          <p className="text-white font-bold text-xs leading-tight">
                            Manakwal Road, near UVM School, Nitesh Vihar, Ludhiana, Punjab
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Google Map Embedded */}
                    <div className="w-full mt-2">
                      <iframe
                        src="https://maps.google.com/maps?q=Success%20Institute,%20Manakwal%20Rd,%20near%20UVM%20School,%20Nitesh%20Vihar,%20Ludhiana&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        width="100%"
                        height="180"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-xl border border-white/10 w-full"
                      />
                    </div>
                  </div>

                  {/* Right Form column */}
                  <div className="lg:col-span-7 p-8 md:p-14 bg-surface-container-lowest">
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="font-semibold text-[10px] uppercase tracking-wider text-on-surface-variant block">Full Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Student Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-surface border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-3.5 text-xs text-white placeholder-on-surface-variant/40 outline-none transition-all"
                            id="reg-name"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-semibold text-[10px] uppercase tracking-wider text-on-surface-variant block">Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="Contact No. (WhatsApp)"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-surface border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-3.5 text-xs text-white placeholder-on-surface-variant/40 outline-none transition-all"
                            id="reg-phone"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-[10px] uppercase tracking-wider text-on-surface-variant block">Target Grade / Exam Stream *</label>
                        <select 
                          required
                          value={targetProgram}
                          onChange={(e) => setTargetProgram(e.target.value)}
                          className="w-full bg-surface border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-3.5 text-xs text-white outline-none transition-all cursor-pointer"
                          id="reg-program"
                        >
                          <option value="" disabled>Select Target Stream</option>
                          <option value="Junior Secondary (7th-10th)">Junior Secondary (7th-10th) - All Subjects</option>
                          <option value="Senior Science (11th-12th)">Senior Science (11th-12th) - Medical / Non-Medical</option>
                          <option value="Senior Commerce (11th-12th)">Senior Commerce (11th-12th)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-[10px] uppercase tracking-wider text-on-surface-variant block">Academic Queries or Requirements (Optional)</label>
                        <textarea 
                          rows={3}
                          placeholder="Tell us about specific goals or doubts..."
                          value={queries}
                          onChange={(e) => setQueries(e.target.value)}
                          className="w-full bg-surface border border-white/5 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-3.5 text-xs text-white placeholder-on-surface-variant/40 outline-none transition-all resize-none"
                          id="reg-queries"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-container hover:bg-primary-container/85 text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all glow-primary flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                        id="reg-submit"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Registering Scholar...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Registration Inquiry
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="border-t border-white/5 bg-surface-container-lowest/80 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full mb-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-base font-bold text-white tracking-tighter">
                The Success Institute
              </span>
            </div>
            <p className="text-xs text-on-surface-variant pr-8 leading-relaxed">
              Empowering future leaders through rigorous academic curriculum standards, regular testing modules, and expert personalized mentorship. Your success is our mission.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/the.success.institute" 
                target="_blank" 
                rel="noreferrer" 
                className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors cursor-pointer text-on-surface-variant text-xs font-bold"
                title="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 text-primary" />
              </a>
              <button onClick={() => addNotification('TSI Main Website simulation loaded!', 'info')} className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors cursor-pointer text-on-surface-variant text-xs font-bold" title="Main Website">
                <Globe className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => addNotification('Social invitation link copied to clipboard!', 'success')} className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors cursor-pointer text-on-surface-variant text-xs font-bold" title="Share Link">
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => { setIsLoginOpen(true); }} className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center hover:bg-primary-container hover:text-white transition-colors cursor-pointer text-on-surface-variant text-xs font-bold" title="Portal Login">
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-6">Core Programs</h4>
            <ul className="space-y-3.5 text-xs text-on-surface-variant">
              <li><a href="#programs" className="hover:text-primary transition-colors">Junior Secondary (7th-10th)</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">Senior Science (11th-12th)</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">Senior Commerce (11th-12th)</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">1-on-1 Dedicated Mentorship</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-3.5 text-xs text-on-surface-variant">
              <li><button onClick={() => { setIsLoginOpen(true); }} className="hover:text-primary transition-colors text-left cursor-pointer">Student Portal Dashboard</button></li>
              <li><a href="#achievements" className="hover:text-primary transition-colors">Scholars Hall of Fame</a></li>
              <li><a href="#stats" className="hover:text-primary transition-colors">About Our Expert Faculty</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Scholarship Admissions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-6">Connect & Subscribe</h4>
            <p className="text-xs text-on-surface-variant mb-3 leading-relaxed font-sans">
              Email: successinstitute05@gmail.com <br />
              Instagram: <a href="https://www.instagram.com/the.success.institute" target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold">@the.success.institute</a> <br />
              Ph: +91 9780663487, +91 7009847171 <br />
              Address: Manakwal Road, near UVM School, Nitesh Vihar, Ludhiana
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative mt-4">
              <input 
                type="email" 
                required
                placeholder="Subscribe for News"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-surface border border-white/5 rounded-full px-4 py-3 text-xs text-white placeholder-on-surface-variant/40 outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-container hover:bg-primary-container/85 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-3 h-3 fill-white" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright label */}
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-on-surface-variant">
          <p>© 2026 The Success Institute. All rights reserved. • Built with elite standards.</p>
          <p>Your Career Is Our Responsibility.</p>
        </div>
      </footer>

      {/* Popups & Dialogs Portal Container */}
      <SuccessStoriesModal 
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <PortalLoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Registration Success Confirmation Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && latestRegistration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccessModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden glass-panel-heavy text-on-surface z-10 p-8 shadow-2xl text-center"
              id="registration-success-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-emerald-500" />
              
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h4 className="text-xl font-bold font-display text-white tracking-tight">Ascent Registration Logged</h4>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                Thank you, <span className="text-white font-semibold">{latestRegistration.fullName}</span>! Your request was received successfully at {latestRegistration.submittedAt}.
              </p>

              {/* simulated confirmation slip details */}
              <div className="my-6 p-4 rounded-xl bg-surface-container-low border border-white/5 text-left text-xs space-y-2 leading-relaxed">
                <p className="text-[10px] uppercase font-bold text-primary tracking-wider border-b border-white/5 pb-1 mb-2">Class Ticket Receipt</p>
                <div className="flex justify-between"><span className="text-on-surface-variant">Ticket ID:</span> <span className="font-mono text-white">#TSI-{Math.floor(Math.random() * 8999 + 1000)}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Inquiry Target:</span> <span className="text-white font-medium">{latestRegistration.program}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Phone Registered:</span> <span className="text-white font-medium">{latestRegistration.phoneNumber}</span></div>
                <div className="flex justify-between"><span className="text-on-surface-variant">Status:</span> <span className="text-emerald-400 font-bold uppercase text-[9px] px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">Awaiting Callback</span></div>
              </div>

              {/* Direct Message Prompt with Phone and Email provided */}
              <div className="space-y-3 mb-6 text-left border-t border-white/5 pt-4">
                <p className="text-[10px] uppercase font-bold text-primary tracking-wider text-center">Instant Faculty Direct Line</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a 
                    href={`https://wa.me/919780663487?text=${encodeURIComponent(
                      `Hello Success Institute, I have just submitted a Coaching Registration Inquiry!\nName: ${latestRegistration.fullName}\nPhone: ${latestRegistration.phoneNumber}\nProgram: ${latestRegistration.program}\n\nPlease confirm my batch registration and demo class slot. Thank you!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" /> WhatsApp Faculty
                  </a>
                  <a 
                    href={`mailto:successinstitute05@gmail.com?subject=${encodeURIComponent(
                      `New Scholar Registration: ${latestRegistration.fullName}`
                    )}&body=${encodeURIComponent(
                      `Hello Success Institute Faculty,\n\nI have registered for the coaching program online.\n\nDetails:\n- Student: ${latestRegistration.fullName}\n- Contact: ${latestRegistration.phoneNumber}\n- Program: ${latestRegistration.program}\n- Queries: ${latestRegistration.queries}\n\nPlease coordinate my schedule.\n\nRegards,\n${latestRegistration.fullName}`
                    )}`}
                    className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-xl transition-all border border-white/5"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email Faculty
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed mb-6">
                An expert academic advisor will connect with you on <span className="text-white font-semibold">{latestRegistration.phoneNumber}</span> within 15 minutes to coordinate your interactive demo slot.
              </p>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/15 cursor-pointer"
                id="close-success-modal-btn"
              >
                Return to Academy
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal for Gallery Images */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-pointer"
            />
            
            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="relative w-full max-w-4xl aspect-auto flex flex-col items-center justify-center z-10"
              id="gallery-lightbox"
            >
              {/* Close Button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-0 md:-top-4 md:-right-12 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all z-20 cursor-pointer"
                aria-label="Close image viewer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
                }}
                className="absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-20 cursor-pointer border border-white/5"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
                }}
                className="absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all z-20 cursor-pointer border border-white/5"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Fully Visible Contain Image Wrapper */}
              <div className="relative w-full max-h-[60vh] md:max-h-[70vh] flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-950/50 border border-white/10 p-2">
                <motion.img 
                  key={lightboxIndex}
                  src={galleryImages[lightboxIndex].url}
                  alt={galleryImages[lightboxIndex].title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="max-h-[58vh] md:max-h-[68vh] max-w-full object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Dynamic Caption Panel */}
              <div className="w-full mt-4 text-center text-white px-4 max-w-2xl bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-primary block mb-1">
                  Verified Campus Media • {lightboxIndex + 1} of {galleryImages.length}
                </span>
                <h4 className="text-base sm:text-lg font-extrabold font-display tracking-tight text-white leading-snug">
                  {galleryImages[lightboxIndex].title}
                </h4>

                {galleryImages[lightboxIndex].externalLink && (
                  <div className="mt-3 flex justify-center">
                    <a 
                      href={galleryImages[lightboxIndex].externalLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white bg-primary hover:bg-primary/95 px-4 py-2 rounded-xl font-bold transition-all border border-white/5 shadow-lg shadow-primary/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> {galleryImages[lightboxIndex].externalText}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
