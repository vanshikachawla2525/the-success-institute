import React, { useState } from 'react';
import { X, LogIn, Sparkles, User, GraduationCap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (studentName: string, stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation') => void;
}

export default function PortalLoginModal({ isOpen, onClose, onLoginSuccess }: PortalLoginModalProps) {
  const [customName, setCustomName] = useState('');
  const [selectedStream, setSelectedStream] = useState<'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation'>('Non-Medical');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      setError('Please enter a student name');
      return;
    }
    setError('');
    onLoginSuccess(customName.trim(), selectedStream);
    onClose();
  };

  const handleQuickLogin = (name: string, stream: 'Medical' | 'Non-Medical' | 'Commerce' | 'Foundation') => {
    onLoginSuccess(name, stream);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl overflow-hidden glass-panel-heavy text-on-surface z-10 shadow-2xl p-8"
          id="login-modal"
        >
          {/* Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary-container via-primary to-primary-container" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-white flex items-center justify-center transition-all cursor-pointer"
            id="close-login-modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 glow-primary">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold font-display text-white tracking-tight">Access Student Portal</h3>
            <p className="text-sm text-on-surface-variant mt-1">Review performance, mock tests, and assignments</p>
          </div>

          {/* Option 1: Quick Access Profiles */}
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-3">Quick Demo Access</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('Shreya Verma', 'Non-Medical')}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-primary-container/10 border border-white/5 hover:border-primary-container/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-primary transition-colors">Shreya Verma</div>
                  <div className="text-[10px] text-on-surface-variant">Non-Med Batch A1</div>
                </div>
              </button>

              <button
                onClick={() => handleQuickLogin('Aarav Sharma', 'Medical')}
                className="flex items-center gap-3 p-3 rounded-xl bg-surface-container hover:bg-primary-container/10 border border-white/5 hover:border-primary-container/40 text-left transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-primary transition-colors">Aarav Sharma</div>
                  <div className="text-[10px] text-on-surface-variant">Medical Batch B1</div>
                </div>
              </button>
            </div>
          </div>

          <div className="relative my-6 flex py-1 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Or login custom</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Option 2: Custom Account Login */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant flex items-center gap-1">
                <User className="w-3 h-3" /> Student Full Name
              </label>
              <input
                type="text"
                placeholder="Enter Student Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-surface-container border border-white/10 focus:border-primary-container focus:ring-1 focus:ring-primary-container rounded-xl px-4 py-3.5 text-sm text-white placeholder-on-surface-variant/50 transition-all outline-none"
                id="login-name-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> Target Stream / Program
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Medical', 'Non-Medical', 'Commerce', 'Foundation'] as const).map((stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => setSelectedStream(stream)}
                    className={`px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                      selectedStream === stream
                        ? 'bg-primary-container border-primary text-white shadow-lg shadow-primary-container/15'
                        : 'bg-surface-container border-white/5 text-on-surface-variant hover:text-white hover:bg-surface-container-high'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-primary-container font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-primary-container text-white py-3.5 rounded-xl font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(193,18,31,0.35)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              id="login-submit"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In to Dashboard
            </button>
          </form>

          {/* Secure indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Simulated Sandbox Environment • Secure Demo Client Session
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
