'use client';

import React, { useState } from 'react';
import { User, Trainer, TargetedModule, TargetRoleDef, QuestionItem } from '../types';
import { 
  TrendingUp, 
  UserCheck, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  Star, 
  ShieldCheck, 
  ChevronRight,
  HelpCircle,
  FileCheck,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Props {
  user: User;
  targetRoleDef: TargetRoleDef;
  trainers: Trainer[];
  learningModules: TargetedModule[];
  questionsByCompetency: Record<string, QuestionItem[]>;
  onBookTrainer: (trainerId: string, competency: string) => Promise<any>;
  onSubmitPostTraining: (competency: string, answers: Record<string, number>) => Promise<any>;
  onOpenCertificate: (certId: string) => void;
  onLaunchDiagnosticModal: () => void;
}

export default function SkillGapWorkflowView({
  user,
  targetRoleDef,
  trainers,
  learningModules,
  questionsByCompetency,
  onBookTrainer,
  onSubmitPostTraining,
  onOpenCertificate,
  onLaunchDiagnosticModal,
}: Props) {
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'DASHBOARD' | 'TRAINERS' | 'COURSES' | 'POST_ASSESSMENT'>('DASHBOARD');
  
  // Post-training assessment state
  const [assessmentComp, setAssessmentComp] = useState<string>('SQL');
  const [postAnswers, setPostAnswers] = useState<Record<string, number>>({});
  const [postResult, setPostResult] = useState<any>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Derive competencies and gaps
  const competencies = targetRoleDef?.competencies || [];
  
  const levelToNum = (lvl: string) => {
    const match = String(lvl).match(/\d/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const gapAnalysis = competencies.map((comp) => {
    const reqLevel = comp.requiredLevel;
    const verLevel = user.verifiedLevels?.[comp.name] || 'L1';
    const selfLevel = user.selfAssessedLevels?.[comp.name] || 'L2';
    
    const reqNum = levelToNum(reqLevel);
    const verNum = levelToNum(verLevel);
    const gap = reqNum - verNum;

    return {
      name: comp.name,
      description: comp.description,
      requiredLevel: reqLevel,
      selfAssessedLevel: `${selfLevel} (Unverified)`,
      verifiedLevel: verLevel,
      gap,
      hasGap: gap > 0,
      gapText: gap <= 0 ? 'No Gap (Achieved)' : `Gap: ${gap} Level${gap > 1 ? 's' : ''}`
    };
  });

  const missingCompetencyNames = gapAnalysis.filter(g => g.hasGap).map(g => g.name);

  // Filter matched trainers and modules
  const matchedTrainers = trainers.filter(t => 
    t.subjects.some(sub => missingCompetencyNames.includes(sub))
  );

  const matchedModules = learningModules.filter(m => 
    missingCompetencyNames.includes(m.competency)
  );

  const handleBook = async (trainerId: string, compName: string) => {
    try {
      const res = await onBookTrainer(trainerId, compName);
      setBookingSuccess(`Session confirmed with ${res.booking?.trainerName} for ${compName}! Check notifications.`);
      setTimeout(() => setBookingSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAssessmentSubmit = async () => {
    setIsSubmittingPost(true);
    try {
      const res = await onSubmitPostTraining(assessmentComp, postAnswers);
      setPostResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const postQuestions = questionsByCompetency[assessmentComp] || [];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Workflow Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 shadow-gov border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-amber-500/30 text-amber-300 font-bold px-2.5 py-0.5 rounded border border-amber-400/40 uppercase">
              Closed-Loop Capacity Workflow
            </span>
            <span className="text-xs text-slate-400">Target Role: <strong>{targetRoleDef.title}</strong></span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Competency-Driven Skill-Gap & Verification Engine
          </h1>
          <p className="text-xs text-slate-300">
            Learner: <strong>{user.name}</strong> • Current Designation: <em>{user.currentRole}</em>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLaunchDiagnosticModal}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Diagnostic Test</span>
          </button>
        </div>
      </div>

      {/* Booking Alert Banner */}
      {bookingSuccess && (
        <div className="p-3.5 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg text-xs font-bold text-emerald-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{bookingSuccess}</span>
        </div>
      )}

      {/* 5-Step Workflow Progress Navigation */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveWorkflowTab('DASHBOARD')}
          className={`p-3 rounded-lg text-left transition flex items-center space-x-2.5 ${
            activeWorkflowTab === 'DASHBOARD'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
            1
          </div>
          <div>
            <div className="leading-tight">Skill-Gap Matrix</div>
            <div className={`text-[10px] font-normal ${activeWorkflowTab === 'DASHBOARD' ? 'text-blue-200' : 'text-slate-400'}`}>
              Required vs Verified
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('TRAINERS')}
          className={`p-3 rounded-lg text-left transition flex items-center space-x-2.5 ${
            activeWorkflowTab === 'TRAINERS'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
            2
          </div>
          <div>
            <div className="leading-tight">Matched Trainers</div>
            <div className={`text-[10px] font-normal ${activeWorkflowTab === 'TRAINERS' ? 'text-blue-200' : 'text-slate-400'}`}>
              {matchedTrainers.length} Mentors Available
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('COURSES')}
          className={`p-3 rounded-lg text-left transition flex items-center space-x-2.5 ${
            activeWorkflowTab === 'COURSES'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
            3
          </div>
          <div>
            <div className="leading-tight">Bridge Modules</div>
            <div className={`text-[10px] font-normal ${activeWorkflowTab === 'COURSES' ? 'text-blue-200' : 'text-slate-400'}`}>
              {matchedModules.length} Targeted Courses
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveWorkflowTab('POST_ASSESSMENT')}
          className={`p-3 rounded-lg text-left transition flex items-center space-x-2.5 ${
            activeWorkflowTab === 'POST_ASSESSMENT'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-xs font-bold flex-shrink-0">
            4
          </div>
          <div>
            <div className="leading-tight">Verify Improvement</div>
            <div className={`text-[10px] font-normal ${activeWorkflowTab === 'POST_ASSESSMENT' ? 'text-blue-200' : 'text-slate-400'}`}>
              Post-Training Test
            </div>
          </div>
        </button>
      </div>

      {/* TAB 1: SKILL-GAP DASHBOARD (REQUIRED VS VERIFIED) */}
      {activeWorkflowTab === 'DASHBOARD' && (
        <div className="space-y-6">
          {/* Main Comparison Card */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Target Role Competency Matrix & Gap Diagnostics ({targetRoleDef.title})
                </h3>
                <p className="text-xs text-slate-500">
                  Calculates exact gap: <strong>Required Level − Verified Level</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                  {missingCompetencyNames.length} Gaps Remaining
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Role Fit: {user.roleFitScore}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold">
                  <tr>
                    <th className="px-5 py-3 text-left">Competency Title</th>
                    <th className="px-4 py-3 text-center">Self-Assessed (Unverified)</th>
                    <th className="px-4 py-3 text-center">Required Target</th>
                    <th className="px-4 py-3 text-center">Verified Assessment Level</th>
                    <th className="px-5 py-3 text-right">Calculated Skill Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {gapAnalysis.map((comp) => (
                    <tr key={comp.name} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{comp.name}</div>
                        <div className="text-[10px] text-slate-500">{comp.description}</div>
                      </td>
                      
                      {/* Self Assessed (Unverified) */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[11px] font-medium" title="Unverified self-claim">
                          {comp.selfAssessedLevel}
                        </span>
                      </td>

                      {/* Required Target */}
                      <td className="px-4 py-3.5 text-center font-bold font-mono text-blue-900 text-xs">
                        {comp.requiredLevel}
                      </td>

                      {/* Verified Level */}
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded font-bold font-mono text-xs ${
                          comp.verifiedLevel === 'L4' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                          comp.verifiedLevel === 'L3' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          comp.verifiedLevel === 'L2' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {comp.verifiedLevel} (Verified)
                        </span>
                      </td>

                      {/* Gap */}
                      <td className="px-5 py-3.5 text-right">
                        {comp.hasGap ? (
                          <div className="space-y-1">
                            <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold border border-rose-200">
                              ⚠️ {comp.gapText}
                            </span>
                            <div className="text-[10px] font-mono text-slate-500">
                              {comp.name}: Required {comp.requiredLevel} | Verified {comp.verifiedLevel} | Gap {comp.gap} Level
                            </div>
                          </div>
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

          {/* Supporting Evidence Card */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Supporting Evidence & Background Portfolio
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              In CAPACITY CONNECT, self-assessments, past certifications, and prior trainings serve as supporting context. Only rigorous <strong>Diagnostic & Post-Training Assessments</strong> establish verified operational competency levels.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Education & Degree</span>
                <span className="font-semibold text-slate-800">{user.qualifications}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Work Experience</span>
                <span className="font-semibold text-slate-800">{user.workExperienceYears} Years in Public Service</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Prior Training</span>
                <span className="font-semibold text-slate-800">{user.previousTraining}</span>
              </div>
            </div>
          </div>

          {/* Quick Action to Move to Trainer / Course Step */}
          {missingCompetencyNames.length > 0 && (
            <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs text-amber-950">
                <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0" />
                <span>
                  <strong>Action Recommended:</strong> You have competency gaps in <strong>{missingCompetencyNames.join(', ')}</strong>. Schedule a session with an accredited trainer or complete the targeted bridge modules.
                </span>
              </div>
              <button
                onClick={() => setActiveWorkflowTab('TRAINERS')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1 whitespace-nowrap ml-4"
              >
                <span>View Matched Trainers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MATCHED TRAINERS DIRECTORY */}
      {activeWorkflowTab === 'TRAINERS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Accredited Subject Matter Mentors & Trainers</h3>
              <p className="text-xs text-slate-500">
                Matched specifically to your verified competency gaps in: <strong>{missingCompetencyNames.join(', ') || 'All Competencies'}</strong>
              </p>
            </div>
            <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
              {matchedTrainers.length} Trainers Matched
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {matchedTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={trainer.avatar}
                      alt={trainer.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900">{trainer.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-900 border border-purple-300 font-mono">
                          {trainer.verifiedLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{trainer.title}</p>
                      <p className="text-[11px] text-slate-400">{trainer.organization}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    {trainer.cvSummary}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {trainer.subjects.map((sub, idx) => {
                      const isMissing = missingCompetencyNames.includes(sub);
                      return (
                        <span
                          key={idx}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isMissing
                              ? 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {sub} {isMissing ? '★ Target Gap' : ''}
                        </span>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                    <div>🏆 <strong>{trainer.experienceYears} Years</strong> Exp</div>
                    <div>⏱️ <strong>{trainer.teachingHours}+</strong> Teaching Hrs</div>
                    <div>⭐ <strong>{trainer.rating} / 5.0</strong> Rating</div>
                    <div>📅 <strong>{trainer.availability}</strong></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {trainer.hourlyRate}
                  </span>
                  <button
                    onClick={() => handleBook(trainer.id, missingCompetencyNames[0] || 'Competency Gap')}
                    className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Mentorship Session</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TARGETED LEARNING MODULES */}
      {activeWorkflowTab === 'COURSES' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Level-Bridging Learning Modules</h3>
              <p className="text-xs text-slate-500">Short, high-intensity modules engineered specifically for L2 → L3 and L3 → L4 transitions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
                      {mod.competency} ({mod.fromLevel} → {mod.toLevel})
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{mod.duration}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{mod.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{mod.curriculumSummary}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{mod.enrolledCount} officers enrolled</span>
                  <button
                    onClick={() => {
                      setAssessmentComp(mod.competency);
                      setActiveWorkflowTab('POST_ASSESSMENT');
                    }}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
                  >
                    <span>Complete Module & Verify</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: POST-TRAINING ASSESSMENT & COMPETENCY UPDATE */}
      {activeWorkflowTab === 'POST_ASSESSMENT' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Post-Training Competency Re-Verification</h3>
              <p className="text-xs text-slate-500">
                Score ≥ 60% on the post-training assessment to automatically upgrade your verified level and eliminate the competency gap.
              </p>
            </div>

            {/* Select Competency to Re-test */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Select Subject:</span>
              <select
                value={assessmentComp}
                onChange={(e) => {
                  setAssessmentComp(e.target.value);
                  setPostAnswers({});
                  setPostResult(null);
                }}
                className="text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800"
              >
                {competencies.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (Current: {user.verifiedLevels?.[c.name] || 'L2'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Post Result Banner */}
          {postResult && (
            <div className={`p-6 rounded-xl border ${
              postResult.improved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {postResult.improved ? '🎉 Competency Successfully Upgraded!' : 'Post-Assessment Completed'}
                    </h3>
                    <p className="text-xs mt-0.5">
                      {postResult.competency}: Upgraded from <strong>{postResult.previousLevel}</strong> to <strong>{postResult.newVerifiedLevel} Proficient</strong>!
                    </p>
                    <p className="text-xs mt-0.5">
                      New Role-Fit Index: <strong>{postResult.newOverallFitScore}%</strong> • Score: <strong>{postResult.percentage}%</strong>
                    </p>
                  </div>
                </div>

                {postResult.certificate && (
                  <button
                    onClick={() => onOpenCertificate(postResult.certificate.id)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 whitespace-nowrap"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Accredited Certificate</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                5-Question Verification Evaluation ({assessmentComp})
              </h4>
              <p className="text-[11px] text-slate-500">Test covers routine application, debugging, and scenario problem-solving.</p>
            </div>

            <div className="space-y-6">
              {postQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                      {qIdx + 1}
                    </span>
                    <h5 className="font-bold text-slate-900 leading-relaxed">{q.question}</h5>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pl-7">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = postAnswers[q.id] === optIdx;

                      return (
                        <label
                          key={optIdx}
                          onClick={() => setPostAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`p-3 rounded-lg border cursor-pointer flex items-center space-x-2.5 transition ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold ring-1 ring-blue-600'
                              : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`post_${q.id}`}
                            checked={isSelected}
                            onChange={() => {}}
                            className="text-blue-800 focus:ring-blue-500"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={handlePostAssessmentSubmit}
                disabled={isSubmittingPost || Object.keys(postAnswers).length < postQuestions.length}
                className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmittingPost ? 'Evaluating Verification...' : 'Submit Assessment & Verify Upgrade'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
