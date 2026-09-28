'use client';

import React, { useState } from 'react';
import { User, TargetRoleDef } from '../types';
import { 
  SlidersHorizontal, 
  Layers, 
  BarChart3, 
  Download, 
  PlusCircle, 
  CheckCircle, 
  ShieldCheck, 
  Building,
  FileSpreadsheet
} from 'lucide-react';

interface Props {
  user: User;
  competencies?: any[];
  courses?: any[];
  analytics: any;
}

export default function AdminView({ user, competencies, courses, analytics }: Props) {
  const [activeTab, setActiveTab] = useState<'METRICS' | 'MAPPING'>('METRICS');
  const [exporting, setExporting] = useState(false);

  const ministries = [
    { name: "Ministry of Road Transport & Highways", officers: 248, compliance: 88.6, avgHours: 36.5, status: "High Performer" },
    { name: "Ministry of Electronics & IT (MeitY)", officers: 412, compliance: 92.4, avgHours: 42.1, status: "High Performer" },
    { name: "Department of Expenditure (MoF)", officers: 310, compliance: 84.1, avgHours: 34.0, status: "On Track" },
    { name: "Department of Administrative Reforms (DARPG)", officers: 180, compliance: 96.0, avgHours: 45.2, status: "Exemplary" },
    { name: "Ministry of Housing & Urban Affairs", officers: 520, compliance: 76.5, avgHours: 29.8, status: "Needs Intervention" }
  ];

  const handleExportCBP = () => {
    setExporting(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Ministry/Department,Officers Enrolled,CBP Compliance (%),Avg Training Hours,Classification\n"
        + ministries.map(e => `"${e.name}",${e.officers},${e.compliance}%,${e.avgHours} hrs,"${e.status}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "National_Capacity_Building_Report_2024.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-xl p-6 shadow-gov border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Capacity Building Commission (CBC) Admin Portal</h1>
              <span className="text-xs bg-purple-500/30 text-purple-300 font-bold px-2 py-0.5 rounded border border-purple-400/40">
                National L&D Admin
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Director: <strong>{user.name}</strong> ({user.department})
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCBP}
          disabled={exporting}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{exporting ? 'Generating Audit CSV...' : 'Export National CBP Audit Report'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('METRICS')}
          className={`px-4 py-2 rounded-md transition ${
            activeTab === 'METRICS'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          National Adoption & Compliance
        </button>

        <button
          onClick={() => setActiveTab('MAPPING')}
          className={`px-4 py-2 rounded-md transition ${
            activeTab === 'MAPPING'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          FRAC Competency-to-Course Framework Mapping
        </button>
      </div>

      {activeTab === 'METRICS' ? (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5">
              <div className="text-xs font-bold text-slate-500 uppercase">Active Public Servants</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">12,480</div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1">↑ +14% QoQ Adoption</div>
            </div>

            <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5">
              <div className="text-xs font-bold text-slate-500 uppercase">National CBP Compliance</div>
              <div className="text-2xl font-extrabold text-blue-700 mt-1">87.2%</div>
              <div className="text-[11px] text-slate-500 mt-1">Target: 85.0% Benchmark</div>
            </div>

            <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5">
              <div className="text-xs font-bold text-slate-500 uppercase">Accredited Certifications</div>
              <div className="text-2xl font-extrabold text-amber-600 mt-1">4,810</div>
              <div className="text-[11px] text-slate-500 mt-1">DigiLocker Pushed</div>
            </div>

            <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-5">
              <div className="text-xs font-bold text-slate-500 uppercase">Onboarded Ministries</div>
              <div className="text-2xl font-extrabold text-purple-700 mt-1">42</div>
              <div className="text-[11px] text-slate-500 mt-1">Central & State Bodies</div>
            </div>
          </div>

          {/* Ministry League Table */}
          <div className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ministry-Wise Capacity Building Plan (CBP) Index</h3>
                <p className="text-xs text-slate-500">Live progress against Karmayogi annual learning targets</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold">
                  <tr>
                    <th className="px-5 py-3 text-left">Ministry / Department</th>
                    <th className="px-5 py-3 text-center">Officers Enrolled</th>
                    <th className="px-5 py-3 text-center">CBP Compliance Rate</th>
                    <th className="px-5 py-3 text-center">Avg Hours / Officer</th>
                    <th className="px-5 py-3 text-right">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {ministries.map((min, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center space-x-2">
                        <Building className="w-4 h-4 text-slate-400" />
                        <span>{min.name}</span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-semibold text-slate-700">{min.officers}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-blue-800">{min.compliance}%</td>
                      <td className="px-5 py-3.5 text-center font-medium text-slate-600">{min.avgHours} hrs</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          min.status === 'Exemplary' ? 'bg-emerald-100 text-emerald-800' :
                          min.status === 'High Performer' ? 'bg-blue-100 text-blue-800' :
                          min.status === 'On Track' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {min.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* MAPPING TOOL */
        <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">FRAC Competency Framework Alignment</h3>
            <p className="text-xs text-slate-500">View and verify how each national e-Learning course maps into Domain, Functional, and Behavioral rubrics</p>
          </div>

          <div className="divide-y divide-slate-100">
            {courses.map((c) => (
              <div key={c.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{c.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">[{c.code}]</span>
                  </div>
                  <div className="text-slate-500 mt-0.5">Offered by: {c.department}</div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                    Maps to: {c.primaryCompetency}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    FRAC Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
