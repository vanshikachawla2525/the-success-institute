import React from 'react';
import { Student } from '../types';
import { X, Quote, Calendar, Award, Star, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuccessStoriesModalProps {
  student: Student | null;
  onClose: () => void;
}

export default function SuccessStoriesModal({ student, onClose }: SuccessStoriesModalProps) {
  if (!student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden glass-panel-heavy text-on-surface z-10 shadow-2xl"
          id="success-modal"
        >
          {/* Top Gradient light line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-white flex items-center justify-center transition-all cursor-pointer"
            id="close-success-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left Image & Core Info Column */}
            <div className="md:col-span-5 relative bg-gradient-to-b from-surface-container-low to-surface-container-lowest p-6 flex flex-col justify-between border-r border-white/5">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-white/10 group">
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-1 text-primary text-xs font-semibold tracking-wider uppercase mb-1">
                  <Award className="w-3.5 h-3.5" />
                  {student.achievement}
                </div>
                <h3 className="text-2xl font-bold font-display tracking-tight text-white">{student.name}</h3>
                <p className="text-sm text-on-surface-variant mt-2 bg-surface-container-high/40 p-3 rounded-xl border border-white/5">
                  <Star className="w-3.5 h-3.5 inline mr-1 text-primary-container fill-primary-container" />
                  {student.scoreInfo}
                </p>
              </div>
            </div>

            {/* Right Detailed Preparation Story */}
            <div className="md:col-span-7 p-8 flex flex-col justify-between overflow-y-auto max-h-[80vh] md:max-h-none">
              <div>
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Preparation Journey</span>
                <h4 className="text-xl font-bold font-display text-white mt-1 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary-container" />
                  Their path to success
                </h4>

                {/* Quote Section */}
                <div className="relative bg-surface-container-low/55 p-5 rounded-2xl border border-white/5 mb-6">
                  <Quote className="absolute top-3 right-4 w-10 h-10 text-primary-container/10" />
                  <p className="text-sm italic text-on-surface-variant leading-relaxed relative z-10">
                    "{student.quote}"
                  </p>
                </div>

                {/* Journey Timeline */}
                <div className="space-y-4">
                  {student.journey.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-primary-container text-[11px] text-white font-bold flex items-center justify-center border border-white/10 shrink-0">
                          {idx + 1}
                        </div>
                        {idx < student.journey.length - 1 && (
                          <div className="w-[1px] h-full bg-white/10 my-1" />
                        )}
                      </div>
                      <div className="pb-2">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-white">
                          {step.phase}
                        </h5>
                        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-sm font-semibold transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onClose();
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-primary-container hover:bg-primary-container/85 text-white text-sm font-semibold shadow-lg shadow-primary-container/15 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  Follow Their Steps
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
