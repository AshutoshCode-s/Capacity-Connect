'use client';

import React, { useState } from 'react';
import { TargetRoleDef, QuestionItem } from '../types';
import { 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  X
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRoleDef: TargetRoleDef;
  questionsByCompetency: Record<string, QuestionItem[]>;
  onSubmitTest: (answers: Record<string, number>) => Promise<any>;
}

export default function VerificationTestModal({
  isOpen,
  onClose,
  targetRoleDef,
  questionsByCompetency,
  onSubmitTest,
}: Props) {
  const competencies = targetRoleDef?.competencies?.map(c => c.name) || ['Excel', 'SQL', 'Python', 'Data Visualization', 'Communication'];
  const [selectedCompIdx, setSelectedCompIdx] = useState(0);
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);

  if (!isOpen) return null;

  const currentComp = competencies[selectedCompIdx] || competencies[0];
  const currentQuestions = questionsByCompetency[currentComp] || [];
  const currentQ = currentQuestions[selectedQuestionIdx] || currentQuestions[0];

  const totalQuestions = competencies.reduce((sum, c) => sum + (questionsByCompetency[c]?.length || 0), 0);
  const answeredCount = Object.keys(answers).length;
  const progressPct = totalQuestions ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  const handleNext = () => {
    if (selectedQuestionIdx < currentQuestions.length - 1) {
      setSelectedQuestionIdx(selectedQuestionIdx + 1);
    } else if (selectedCompIdx < competencies.length - 1) {
      setSelectedCompIdx(selectedCompIdx + 1);
      setSelectedQuestionIdx(0);
    }
  };

  const handlePrev = () => {
    if (selectedQuestionIdx > 0) {
      setSelectedQuestionIdx(selectedQuestionIdx - 1);
    } else if (selectedCompIdx > 0) {
      const prevComp = competencies[selectedCompIdx - 1];
      setSelectedCompIdx(selectedCompIdx - 1);
      setSelectedQuestionIdx((questionsByCompetency[prevComp]?.length || 1) - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await onSubmitTest(answers);
      setEvaluationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full border border-slate-200 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              ✓
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Skills Test
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                  {targetRoleDef?.title || 'Data Analyst'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Answer the questions to verify your skill level
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block text-xs">
              <div className="font-bold text-slate-700">{answeredCount} of {totalQuestions} Answered</div>
              <div className="w-24 bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-blue-700 h-1.5 rounded-full" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RESULTS REPORT VIEW (AFTER SUBMISSION) */}
        {evaluationResult ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div className="p-5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-700 text-white uppercase">
                  Test Complete
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">Your Results</h3>
                <p className="text-xs text-slate-600">
                  Target Role: <strong>{evaluationResult.targetRole}</strong> • Role Fit: <strong>{evaluationResult.overallRoleFit}%</strong>
                </p>
              </div>

              <div className="text-center bg-white p-3 rounded-lg border border-blue-200 min-w-[120px]">
                <div className="text-[10px] uppercase font-bold text-slate-400">Role Fit</div>
                <div className="text-2xl font-black text-blue-700">{evaluationResult.overallRoleFit}%</div>
              </div>
            </div>

            {/* Gap Breakdown Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                <span>Skill</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-slate-100">
                {evaluationResult.competencyResults?.map((res: any) => (
                  <div key={res.competency} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{res.competency}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Score: <strong>{res.scorePercentage}%</strong> ({res.correctCount}/{res.totalQuestions} correct)
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-right">
                      <div className="text-xs">
                        <span className="text-slate-500">Required: </span>
                        <strong className="text-blue-900 font-mono">{res.requiredLevel}</strong>
                        <span className="text-slate-400 mx-1.5">|</span>
                        <span className="text-slate-500">Verified: </span>
                        <strong className="text-slate-800 font-mono">{res.verifiedLevel}</strong>
                      </div>

                      {res.hasGap ? (
                        <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                          {res.gapStatus}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE TEST QUESTIONS */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Competencies Selector Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center space-x-2 overflow-x-auto text-xs font-bold">
              {competencies.map((comp, idx) => {
                const isActive = idx === selectedCompIdx;
                const compQs = questionsByCompetency[comp] || [];
                const answered = compQs.filter(q => answers[q.id] !== undefined).length;

                return (
                  <button
                    key={comp}
                    onClick={() => {
                      setSelectedCompIdx(idx);
                      setSelectedQuestionIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <span>{comp}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {answered}/{compQs.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Body */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-5">
              {currentQ ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 uppercase font-mono">
                      {currentQ.competency}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase border border-slate-300 font-mono">
                      Level {currentQ.difficultyLevel}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400">
                      Question {selectedQuestionIdx + 1} of {currentQuestions.length} ({currentComp})
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-relaxed">
                      {currentQ.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = answers[currentQ.id] === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer flex items-start space-x-3 transition ${
                            isSelected
                              ? 'border-blue-700 bg-blue-50/60 text-blue-950 font-bold shadow-xs ring-1 ring-blue-700'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-blue-700 text-white border-blue-700' : 'bg-slate-100 text-slate-500 border-slate-300'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-500">
                  Loading questions for {currentComp}...
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={selectedCompIdx === 0 && selectedQuestionIdx === 0}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                {answeredCount >= totalQuestions - 2 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Test'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
