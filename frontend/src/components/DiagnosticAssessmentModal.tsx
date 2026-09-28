'use client';

import React, { useState } from 'react';
import { QuestionItem, User, TargetRoleDef } from '../types';
import { 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle,
  Award,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  targetRoleDef: TargetRoleDef;
  questionsByCompetency: Record<string, QuestionItem[]>;
  onSubmitDiagnostic: (answers: Record<string, number>) => Promise<any>;
  onProceedToWorkflow: (report: any) => void;
}

export default function DiagnosticAssessmentModal({
  isOpen,
  onClose,
  user,
  targetRoleDef,
  questionsByCompetency,
  onSubmitDiagnostic,
  onProceedToWorkflow,
}: Props) {
  const competencies = targetRoleDef?.competencies?.map(c => c.name) || Object.keys(questionsByCompetency);
  const [selectedCompIndex, setSelectedCompIndex] = useState<number>(0);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [diagnosticReport, setDiagnosticReport] = useState<any>(null);

  if (!isOpen) return null;

  const currentCompName = competencies[selectedCompIndex] || competencies[0];
  const currentCompQuestions = questionsByCompetency[currentCompName] || [];
  const currentQuestion = currentCompQuestions[selectedQuestionIndex] || currentCompQuestions[0];

  const totalQuestionsAll = competencies.reduce((acc, comp) => {
    return acc + (questionsByCompetency[comp]?.length || 0);
  }, 0);

  const answeredCount = Object.keys(answers).length;
  const progressPct = totalQuestionsAll ? Math.round((answeredCount / totalQuestionsAll) * 100) : 0;

  const handleSelectOption = (qId: string, optIdx: number) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: optIdx
    }));
  };

  const handleNext = () => {
    if (selectedQuestionIndex < currentCompQuestions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    } else if (selectedCompIndex < competencies.length - 1) {
      setSelectedCompIndex(selectedCompIndex + 1);
      setSelectedQuestionIndex(0);
    }
  };

  const handlePrev = () => {
    if (selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    } else if (selectedCompIndex > 0) {
      const prevComp = competencies[selectedCompIndex - 1];
      setSelectedCompIndex(selectedCompIndex - 1);
      setSelectedQuestionIndex((questionsByCompetency[prevComp]?.length || 1) - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const report = await onSubmitDiagnostic(answers);
      setDiagnosticReport(report);
    } catch (err) {
      console.error('Error evaluating diagnostic:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-300 overflow-hidden my-4 max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold">National Competency Diagnostic Engine</h2>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                  Target: {targetRoleDef.title}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Evaluating candidate <strong>{user.name}</strong> • Fixed rule-based verification
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-amber-400">{answeredCount} of {totalQuestionsAll} Answered</div>
            <div className="w-28 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden border border-slate-700">
              <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${progressPct}%` }}></div>
            </div>
          </div>
        </div>

        {/* RESULTS REPORT SCREEN (IF SUBMITTED) */}
        {diagnosticReport ? (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  Diagnostic Evaluation Verified
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Verified Competency Diagnostic Report</h3>
                <p className="text-xs text-slate-300">
                  Target Role: <strong>{diagnosticReport.targetRole}</strong> • Verified Role-Fit: <strong>{diagnosticReport.overallRoleFit}%</strong>
                </p>
              </div>

              <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
                <div className="text-[10px] uppercase font-bold text-slate-400">Target Role-Fit Index</div>
                <div className="text-2xl font-extrabold text-amber-400">{diagnosticReport.overallRoleFit}%</div>
                <div className="text-[10px] text-slate-400">Benchmark: 85%</div>
              </div>
            </div>

            {/* Comparison Table: Required Level vs Verified Level with Gap Calculation */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Competency Gap Analysis: Required vs Verified Level
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Formula: Gap = Required Level − Verified Level (Verified Level derived from diagnostic test score)
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Rule: 0-39% = L1 | 40-59% = L2 | 60-79% = L3 | 80-100% = L4
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="px-4 py-3 text-left">Competency</th>
                      <th className="px-3 py-3 text-center">Self-Assessed (Unverified)</th>
                      <th className="px-3 py-3 text-center">Diagnostic Score</th>
                      <th className="px-3 py-3 text-center">Verified Level</th>
                      <th className="px-3 py-3 text-center">Required Target</th>
                      <th className="px-4 py-3 text-right">Identified Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {diagnosticReport.competencyResults?.map((res: any) => (
                      <tr key={res.competency} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{res.competency}</div>
                          <div className="text-[10px] text-slate-500">{res.description}</div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px]">
                            {res.selfAssessedLevel}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-slate-800">
                          {res.scorePercentage}% ({res.correctCount}/{res.totalQuestions})
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded font-bold font-mono text-xs ${
                            res.verifiedLevel === 'L4' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                            res.verifiedLevel === 'L3' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            res.verifiedLevel === 'L2' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {res.verifiedLevel}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-blue-900 font-mono">
                          {res.requiredLevel}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {res.hasGap ? (
                            <span className="px-2.5 py-1 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                              ⚠️ {res.gapStatus}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                              ✓ No Gap (Achieved)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions: Launch Closed Loop Workflow */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-blue-900 space-y-0.5">
                <div className="font-bold flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-blue-700" />
                  Next Step: Bridge Identified Gaps with Matched Trainers & Modules
                </div>
                <div className="text-slate-600 text-[11px]">
                  Take targeted training, schedule 1-on-1 mentor sessions, and complete Post-Training Assessment to verify your upgrade.
                </div>
              </div>

              <button
                onClick={() => {
                  onProceedToWorkflow(diagnosticReport);
                  onClose();
                }}
                className="px-5 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 whitespace-nowrap"
              >
                <span>Launch Skill-Gap Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE DIAGNOSTIC TEST RUNNER */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Competency Navigation Tabs */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center space-x-2 overflow-x-auto text-xs font-bold">
              {competencies.map((comp, idx) => {
                const isActive = idx === selectedCompIndex;
                const compQs = questionsByCompetency[comp] || [];
                const compAnswered = compQs.filter(q => answers[q.id] !== undefined).length;

                return (
                  <button
                    key={comp}
                    onClick={() => {
                      setSelectedCompIndex(idx);
                      setSelectedQuestionIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-md transition whitespace-nowrap flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-blue-800 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                    }`}
                  >
                    <span>{comp}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-blue-950 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {compAnswered}/{compQs.length}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Question Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              {currentQuestion ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px] uppercase">
                      {currentQuestion.competency}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase border border-amber-300">
                      Difficulty: {currentQuestion.difficultyLevel}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                      {currentQuestion.questionType}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-400">
                      Question {selectedQuestionIndex + 1} of {currentCompQuestions.length} ({currentCompName})
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5 pt-2">
                    {currentQuestion.options.map((opt, optIdx) => {
                      const isSelected = answers[currentQuestion.id] === optIdx;

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                          className={`p-3.5 rounded-lg border text-xs cursor-pointer flex items-start space-x-3 transition ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-bold shadow-xs ring-1 ring-blue-600'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-blue-800 text-white border-blue-800' : 'bg-slate-100 text-slate-500 border-slate-300'
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
                  Loading diagnostic questions for {currentCompName}...
                </div>
              )}
            </div>

            {/* Bottom Footer Navigation */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={selectedCompIndex === 0 && selectedQuestionIndex === 0}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-medium rounded-md flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-3">
                {answeredCount >= totalQuestionsAll - 2 && (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSubmitting ? 'Evaluating Diagnostics...' : 'Submit Diagnostic Evaluation'}</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs flex items-center space-x-1"
                >
                  <span>Next Question</span>
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
