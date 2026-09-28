'use client';

import React, { useState } from 'react';
import { Course } from '../types';
import { Send, X, Building, CheckCircle, Award } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSubmitNomination: (data: { courseId: string; justification: string; institute?: string }) => Promise<void>;
}

export default function NominationModal({
  isOpen,
  onClose,
  course,
  onSubmitNomination,
}: Props) {
  const [justification, setJustification] = useState('');
  const [institute, setInstitute] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitNomination({
        courseId: course.id,
        justification: justification || 'Nomination submitted to bridge operational competency deficiency.',
        institute: institute || course.department
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Nomination Request for Executive Program</h3>
            <p className="text-xs text-slate-300">Submit for Joint Secretary / Reviewing Officer approval</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full mx-auto flex items-center justify-center font-bold">
              ✓
            </div>
            <h3 className="text-base font-bold text-slate-900">Nomination Forwarded Successfully!</h3>
            <p className="text-xs text-slate-500">
              Your application has been routed to your Reporting Supervisor's approval queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-blue-900">{course.title}</div>
              <div className="text-slate-600">Offered by: {course.department}</div>
              <div className="text-slate-600 font-medium">Mapped Competency: <strong>{course.primaryCompetency}</strong></div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Institute / Academy (Optional)
              </label>
              <input
                type="text"
                placeholder={course.department}
                value={institute}
                onChange={(e) => setInstitute(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Justification & Operational Relevance <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Explain why this training is required for your current / upcoming ministerial responsibilities..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-800"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Routing...' : 'Submit Nomination'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
