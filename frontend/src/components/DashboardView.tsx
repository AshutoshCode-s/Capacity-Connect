'use client';

import React from 'react';
import { User, TargetRoleDef, Certificate, NominationRequest, TargetedModule } from '../types';
import { 
  Award, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Play, 
  Sparkles,
  ChevronRight,
  ExternalLink,
  Zap,
  GraduationCap
} from 'lucide-react';

interface Props {
  user: User;
  targetRoleDef: TargetRoleDef;
  certificates: Certificate[];
  nominations: NominationRequest[];
  learningModules: TargetedModule[];
  onNavigateTab: (tab: string) => void;
  onOpenCertificate: (certId: string) => void;
  onLaunchDiagnostic: () => void;
}

export default function DashboardView({
  user,
  targetRoleDef,
  certificates,
  nominations,
  learningModules,
  onNavigateTab,
  onOpenCertificate,
  onLaunchDiagnostic,
}: Props) {
  const competencies = targetRoleDef?.competencies || [];

  const levelToNum = (lvl: string) => {
    const match = String(lvl).match(/\d/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const gapSummary = competencies.map((comp) => {
    const req = comp.requiredLevel;
    const ver = user.verifiedLevels?.[comp.name] || 'L1';
    const self = user.selfAssessedLevels?.[comp.name] || 'L2';
    const gap = levelToNum(req) - levelToNum(ver);
    return {
      name: comp.name,
      required: req,
      selfAssessed: self,
      verified: ver,
      gap,
      hasGap: gap > 0
    };
  });

  const criticalGaps = gapSummary.filter(g => g.hasGap);
  const hoursPct = Math.min(100, Math.round((user.completedHours / user.annualTargetHours) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Officer Welcome & Quick Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 shadow-gov border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400/80 shadow-md flex-shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {user.accountType || 'TRAINEE'}
                </span>
              </div>
              <p className="text-sm text-slate-300 font-medium mt-0.5">
                Current: {user.currentRole} • <strong className="text-amber-300">Target Role: {user.targetRole}</strong>
              </p>
              <p className="text-xs text-slate-400">{user.department} | Qualification: {user.qualifications}</p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-lg p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Role-Fit Index</div>
              <div className="text-2xl font-extrabold text-amber-400">{user.roleFitScore}%</div>
              <div className="text-[10px] text-slate-400 font-medium">Benchmark: 85%</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-lg p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Gaps Identified</div>
              <div className="text-2xl font-extrabold text-rose-400">{criticalGaps.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">Of {competencies.length} Required</div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/80 rounded-lg p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Target Hours</div>
              <div className="text-2xl font-extrabold text-emerald-400">{user.completedHours} / {user.annualTargetHours}h</div>
              <div className="text-[10px] text-slate-400 font-medium">{hoursPct}% Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Banner: Launch Diagnostic */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-amber-700 flex-shrink-0" />
          <div className="text-xs text-amber-950">
            <span className="font-bold uppercase tracking-wider text-[11px] mr-2">Diagnostic Verification:</span>
            {criticalGaps.length > 0
              ? `You have ${criticalGaps.length} verified competency gap(s) for ${user.targetRole}. Access the closed-loop workflow to bridge them.`
              : `All required competencies for ${user.targetRole} are verified at benchmark level!`
            }
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onNavigateTab('skillgap')}
            className="px-4 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1"
          >
            <span>Open Skill-Gap Workflow</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Required vs Verified Competencies */}
        <div className="lg:col-span-2 space-y-6">

          {/* Competency Gap Analysis Widget */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Competency Verification Scorecard ({user.targetRole})</h2>
                  <p className="text-xs text-slate-500">Comparing Required Benchmark vs Verified Diagnostic Level</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('skillgap')}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center"
              >
                View Workflow <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {gapSummary.map((comp) => (
                  <div
                    key={comp.name}
                    className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                      comp.hasGap ? 'bg-amber-50/40 border-amber-300' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{comp.name}</span>
                        {comp.hasGap ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            Gap: {comp.gap} Level
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Achieved
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[11px] text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Required Target:</span>
                          <strong className="text-blue-900 font-mono">{comp.required}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified Assessment:</span>
                          <strong className="text-slate-800 font-mono">{comp.verified}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Self-Assessed:</span>
                          <span>{comp.selfAssessed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {comp.name}: Req {comp.required} | Ver {comp.verified}
                      </span>
                      {comp.hasGap && (
                        <button
                          onClick={() => onNavigateTab('skillgap')}
                          className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center"
                        >
                          Bridge Gap <ArrowRight className="w-3 h-3 ml-0.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-200 flex items-center justify-between text-xs text-blue-950">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0" />
                  <span>
                    <strong>Rule-Based Verification:</strong> Scores: 0–39% = L1, 40–59% = L2, 60–79% = L3, 80–100% = L4. Minimum 60% required for L3 accreditation.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Bridge Modules */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-md">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Recommended Gap-Bridging Modules</h2>
                  <p className="text-xs text-slate-500">Directly mapped to missing competencies</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {learningModules.slice(0, 3).map((mod) => (
                <div key={mod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                        {mod.competency} ({mod.fromLevel} → {mod.toLevel})
                      </span>
                      <span className="text-slate-400 font-medium">{mod.duration}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mt-1">{mod.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5 line-clamp-1">{mod.curriculumSummary}</p>
                  </div>

                  <button
                    onClick={() => onNavigateTab('skillgap')}
                    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs flex items-center space-x-1 whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>Start Module</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Karmayogi Hours & Verified Certificates */}
        <div className="space-y-6">
          
          {/* Target Hours */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Annual Learning Target
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-700">{hoursPct}%</span>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-700 to-emerald-600 h-2.5 rounded-full"
                  style={{ width: `${hoursPct}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>{user.completedHours} hrs achieved</span>
                <span>{user.annualTargetHours} hrs target</span>
              </div>
            </div>
          </div>

          {/* Accredited Certificates */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Verified Certificates ({certificates.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => onOpenCertificate(cert.id)}
                  className="p-3 rounded-lg border border-amber-200 bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-800 line-clamp-1">{cert.courseTitle}</h5>
                    <div className="text-[10px] text-slate-500">{cert.competencyAccredited} • {cert.grade}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-2 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
