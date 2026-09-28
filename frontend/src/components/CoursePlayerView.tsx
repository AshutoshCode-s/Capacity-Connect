'use client';

import React, { useState } from 'react';
import { Course, CourseModule, QuizQuestion } from '../types';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  HelpCircle, 
  Award, 
  Clock, 
  ShieldCheck,
  Sparkles,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface Props {
  course: Course;
  onBack: () => void;
  onCompleteModule: (courseId: string, moduleId: string) => Promise<any>;
  onSubmitQuiz: (courseId: string, answers: Record<string, number>) => Promise<any>;
  onOpenCertificate: (certId: string) => void;
}

export default function CoursePlayerView({
  course,
  onBack,
  onCompleteModule,
  onSubmitQuiz,
  onOpenCertificate,
}: Props) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    course.currentModuleId || course.curriculum[0]?.id || ''
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentModule = course.curriculum.find((m) => m.id === selectedModuleId) || course.curriculum[0];
  const isAssessment = currentModule?.type === 'assessment' || currentModule?.id.includes('assessment') || currentModule === course.curriculum[course.curriculum.length - 1];

  const handleModuleClick = (modId: string) => {
    setSelectedModuleId(modId);
    setQuizSubmitted(false);
  };

  const handleNextModule = () => {
    const currentIndex = course.curriculum.findIndex((m) => m.id === selectedModuleId);
    if (currentIndex < course.curriculum.length - 1) {
      setSelectedModuleId(course.curriculum[currentIndex + 1].id);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentModule) return;
    setIsSubmitting(true);
    try {
      await onCompleteModule(course.id, currentModule.id);
      handleNextModule();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await onSubmitQuiz(course.id, quizAnswers);
      setQuizResult(res);
      setQuizSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white rounded-xl shadow-gov border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Back to Catalog"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 uppercase">
                {course.code}
              </span>
              <span className="text-xs text-slate-400">| {course.department}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">{course.title}</h1>
          </div>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs font-bold text-amber-400">
              {course.userProgress || 0}% Completed
            </div>
            <div className="w-36 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${course.userProgress || 0}%` }}
              ></div>
            </div>
          </div>

          {course.certificateId && (
            <button
              onClick={() => onOpenCertificate(course.certificateId!)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Learning Interface: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar: Modules Navigation List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-gov border border-slate-200 p-4 space-y-3 h-fit">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Course Modules ({course.curriculum.length})
            </h3>
            <p className="text-[11px] text-slate-500">Structured Competency Path</p>
          </div>

          <div className="space-y-1.5">
            {course.curriculum.map((mod, index) => {
              const isSelected = mod.id === selectedModuleId;
              const isCompleted = course.completedModuleIds?.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => handleModuleClick(mod.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition text-xs flex items-start space-x-2.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="line-clamp-2 leading-tight">{mod.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {mod.duration}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">Accredited Outcome:</div>
            <div className="text-blue-800 font-medium">{course.primaryCompetency}</div>
          </div>
        </div>

        {/* Right Main Panel: Module Content / Capstone Quiz */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-gov border border-slate-200 p-6 space-y-6">
          
          {/* Module Banner */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-2 text-xs text-blue-800 font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>{currentModule?.duration} • Official Guidance & Doctrine</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{currentModule?.title}</h2>
            <p className="text-xs text-slate-500 mt-1">{currentModule?.summary}</p>
          </div>

          {/* Render Assessment OR Lesson Content */}
          {isAssessment ? (
            /* CAPSTONE ASSESSMENT COMPONENT */
            <div className="space-y-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <h4 className="font-bold">National Competency Assessment Certification</h4>
                    <p className="mt-0.5">
                      Achieve <strong>70% or higher</strong> to earn your verifiable <strong>Government Certificate of Competency Accreditation</strong> for {course.primaryCompetency}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quiz Submission Result Banner */}
              {quizSubmitted && quizResult && (
                <div className={`p-5 rounded-xl border ${
                  quizResult.passed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {quizResult.passed ? (
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                          ✓
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-lg">
                          ✕
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold">
                          {quizResult.passed ? 'Assessment Passed with Distinction!' : 'Assessment Incomplete'}
                        </h3>
                        <p className="text-xs">
                          Score: <strong>{quizResult.score}%</strong> ({quizResult.correctCount} of {quizResult.totalQuestions} correct)
                        </p>
                      </div>
                    </div>

                    {quizResult.passed && quizResult.certificate && (
                      <button
                        onClick={() => onOpenCertificate(quizResult.certificate.id)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5"
                      >
                        <Award className="w-4 h-4" />
                        <span>View Official Certificate</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Quiz Questions */}
              <div className="space-y-6">
                {(course.quiz || []).map((q, qIndex) => (
                  <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        Q{qIndex + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        {q.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2 pl-8">
                      {q.options.map((opt, optIndex) => {
                        const isSelected = quizAnswers[q.id] === optIndex || quizAnswers[qIndex] === optIndex;
                        const isCorrect = optIndex === q.correctAnswer;
                        const showFeedback = quizSubmitted;

                        let optClass = 'border-slate-200 hover:border-slate-300 bg-white text-slate-700';
                        if (showFeedback) {
                          if (isCorrect) optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                          else if (isSelected && !isCorrect) optClass = 'border-rose-500 bg-rose-50 text-rose-900';
                        } else if (isSelected) {
                          optClass = 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-1 ring-blue-600';
                        }

                        return (
                          <label
                            key={optIndex}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center space-x-2.5 transition ${optClass}`}
                          >
                            <input
                              type="radio"
                              name={`quiz-${q.id}`}
                              checked={isSelected}
                              disabled={quizSubmitted}
                              onChange={() => {
                                setQuizAnswers(prev => ({ ...prev, [q.id]: optIndex, [qIndex]: optIndex }));
                              }}
                              className="text-blue-800 focus:ring-blue-500"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="pl-8 pt-2 text-[11px] text-slate-600 bg-slate-100 p-2.5 rounded border border-slate-200">
                        <strong>Statutory Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Assessment Submit Button */}
              {!quizSubmitted ? (
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <button
                    onClick={handleQuizSubmit}
                    disabled={isSubmitting || Object.keys(quizAnswers).length < (course.quiz?.length || 1)}
                    className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Evaluating Submissions...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Capstone Assessment & Generate Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg"
                  >
                    Retake Assessment
                  </button>
                  {quizResult?.passed && quizResult?.certificate && (
                    <button
                      onClick={() => onOpenCertificate(quizResult.certificate.id)}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2"
                    >
                      <Award className="w-4 h-4" />
                      <span>View Accredited Certificate</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* LESSON READING CONTENT */
            <div className="space-y-6">
              {/* Simulated Interactive Content */}
              <div className="prose prose-slate max-w-none text-xs leading-relaxed text-slate-700 space-y-4">
                {currentModule?.content ? (
                  <div className="whitespace-pre-line font-sans bg-slate-50/60 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs">
                    {currentModule.content}
                  </div>
                ) : (
                  <div className="bg-slate-50/60 p-5 rounded-xl border border-slate-200 text-slate-800 text-xs space-y-3">
                    <p>
                      This module provides essential regulatory background, practical case illustrations, and decision-tree templates.
                    </p>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-950 font-medium">
                      📌 <strong>Core Learning Objective:</strong> Understand the institutional responsibilities, delegation rules, and audit verification procedures required for compliant execution.
                    </div>
                    <p>
                      Review the recommended statutory manuals in the Knowledge Repository before proceeding to the Capstone Assessment.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Mark Complete & Next */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <button
                  onClick={onBack}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Return to Dashboard
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleMarkComplete}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{isSubmitting ? 'Saving Progress...' : 'Mark Module Complete & Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
