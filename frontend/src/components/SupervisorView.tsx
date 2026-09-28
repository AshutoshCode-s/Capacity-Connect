'use client';

import React, { useState } from 'react';
import { NominationRequest, User } from '../types';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Building2, 
  AlertTriangle,
  Award,
  ShieldAlert,
  Send
} from 'lucide-react';

interface Props {
  user: User;
  nominations: NominationRequest[];
  analytics: any;
  onActionNomination: (id: string, status: 'APPROVED' | 'REJECTED', remarks?: string) => Promise<void>;
}

export default function SupervisorView({
  user,
  nominations,
  analytics,
  onActionNomination,
}: Props) {
  const [activeTab, setActiveTab] = useState<'NOMINATIONS' | 'HEATMAP'>('NOMINATIONS');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [remarksInput, setRemarksInput] = useState<Record<string, string>>({});

  const pendingNominations = nominations.filter((n) => n.status === 'PENDING');
  const reviewedNominations = nominations.filter((n) => n.status !== 'PENDING');

  const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    setActioningId(id);
    try {
      const remarks = remarksInput[id] || '';
      await onActionNomination(id, status, remarks);
    } catch (err) {
      console.error(err);
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Supervisor Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl p-6 shadow-gov border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Departmental Supervisor & Reviewer Cockpit</h1>
              <span className="text-xs bg-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-400/40">
                Supervisor Role (RBAC)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Reviewing Officer: <strong>{user.name}</strong> ({user.designation})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Officers</div>
            <div className="text-lg font-extrabold text-white">248</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Fit</div>
            <div className="text-lg font-extrabold text-amber-400">82.4%</div>
          </div>
          <div className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 text-center min-w-[90px]">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Pending</div>
            <div className="text-lg font-extrabold text-rose-400">{pendingNominations.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('NOMINATIONS')}
          className={`px-4 py-2 rounded-md transition flex items-center space-x-2 ${
            activeTab === 'NOMINATIONS'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Training Nomination Approvals</span>
          {pendingNominations.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingNominations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('HEATMAP')}
          className={`px-4 py-2 rounded-md transition ${
            activeTab === 'HEATMAP'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Departmental Competency Heatmap
        </button>
      </div>

      {activeTab === 'NOMINATIONS' ? (
        /* NOMINATION APPROVALS WORKFLOW */
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pending Training Nomination Requests</h3>
                <p className="text-xs text-slate-500">Executive & Classroom capacity building programs requiring Supervisor authorization</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                {pendingNominations.length} Pending Actions
              </span>
            </div>

            {pendingNominations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                All pending nomination requests have been processed.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingNominations.map((nom) => (
                  <div key={nom.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{nom.applicantName}</span>
                          <span className="text-[11px] text-slate-500">• {nom.designation}</span>
                          <span className="text-[10px] font-mono text-slate-400">[{nom.id}]</span>
                        </div>
                        <h4 className="text-sm font-bold text-blue-900 mt-1">{nom.courseTitle}</h4>
                        <p className="text-xs text-slate-600 font-medium">
                          Institute / Academy: <span className="text-slate-800">{nom.institute}</span>
                        </p>
                      </div>

                      <div className="text-right text-xs">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          {nom.status}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-1">Requested: {nom.requestedOn}</div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="font-semibold text-slate-700">Official Justification by Officer:</div>
                      <p className="text-slate-600 italic">"{nom.justification}"</p>
                      <div className="text-[11px] text-blue-800 font-semibold pt-1">
                        Impact on FRAC Competency: {nom.competencyImpact}
                      </div>
                    </div>

                    {/* Supervisor Remarks Input & Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        placeholder="Add official Supervisor remarks / directions (optional)..."
                        value={remarksInput[nom.id] || ''}
                        onChange={(e) => setRemarksInput({ ...remarksInput, [nom.id]: e.target.value })}
                        className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                      />

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAction(nom.id, 'REJECTED')}
                          disabled={actioningId === nom.id}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-md transition flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject / Defer</span>
                        </button>
                        <button
                          onClick={() => handleAction(nom.id, 'APPROVED')}
                          disabled={actioningId === nom.id}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve Nomination</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Reviewed Nominations */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Recently Reviewed Nominations Log
            </h4>
            <div className="space-y-2">
              {reviewedNominations.map((nom) => (
                <div key={nom.id} className="p-3 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{nom.applicantName} – {nom.courseTitle}</div>
                    <div className="text-[11px] text-slate-500">Remarks: "{nom.supervisorRemarks}"</div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    nom.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {nom.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* DEPARTMENTAL COMPETENCY HEATMAP */
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Departmental Competency Fitment Heatmap</h3>
              <p className="text-xs text-slate-500">Aggregate FRAC proficiency levels across all 248 officers in {user.department}</p>
            </div>

            {/* Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analytics?.competencyDistribution?.map((dist: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-bold text-slate-800">{dist.category}</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-2">{dist.achieved}%</div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-700 h-2 rounded-full" style={{ width: `${dist.achieved}%` }}></div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Target Benchmark: {dist.benchmark}%</div>
                </div>
              ))}
            </div>

            {/* Critical Gaps Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Top Priority Capacity Gaps Identified Across Department
              </h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Competency Title</th>
                      <th className="px-4 py-2.5 text-center">Officers Requiring Training</th>
                      <th className="px-4 py-2.5 text-center">Urgency</th>
                      <th className="px-4 py-2.5 text-right">Recommended CBC Program</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {analytics?.topSkillGaps?.map((gap: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{gap.name}</td>
                        <td className="px-4 py-3 text-center font-bold text-rose-700">{gap.officersWithGap} Officers</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            gap.severity === 'High' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {gap.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-blue-700">Mandatory Refresher</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
