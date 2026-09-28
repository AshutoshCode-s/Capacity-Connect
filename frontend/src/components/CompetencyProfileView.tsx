'use client';

import React, { useState } from 'react';
import { Competency, Certificate, User, Course } from '../types';
import { 
  Target, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp,
  FileCheck,
  ExternalLink,
  Sliders
} from 'lucide-react';

interface Props {
  user: User;
  competencies: Competency[];
  certificates: Certificate[];
  courses: Course[];
  onAssessCompetency: (id: string, newLevel: number) => void;
  onOpenCertificate: (certId: string) => void;
  onOpenCourse: (courseId: string) => void;
}

export default function CompetencyProfileView({
  user,
  competencies,
  certificates,
  courses,
  onAssessCompetency,
  onOpenCertificate,
  onOpenCourse,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DOMAIN' | 'FUNCTIONAL' | 'BEHAVIORAL'>('ALL');
  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [tempLevel, setTempLevel] = useState<number>(3);

  const filteredCompetencies = selectedCategory === 'ALL'
    ? competencies
    : competencies.filter(c => c.category === selectedCategory);

  const domainCount = competencies.filter(c => c.category === 'DOMAIN').length;
  const funcCount = competencies.filter(c => c.category === 'FUNCTIONAL').length;
  const behCount = competencies.filter(c => c.category === 'BEHAVIORAL').length;

  const levelLabels = [
    'Level 1: Basic Awareness',
    'Level 2: Working Knowledge',
    'Level 3: Functional Proficiency',
    'Level 4: Advanced Mastery',
    'Level 5: Expert & Policy Formulator'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-800 text-white rounded-xl shadow-sm">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">National FRAC Competency Architecture</h1>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                CBC Aligned
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Framework for Roles, Activities & Competencies mapped to Designation: <strong>{user.designation}</strong>
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-2 bg-slate-50 border rounded-lg text-center">
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Mapped</div>
            <div className="text-base font-extrabold text-slate-900">{competencies.length}</div>
          </div>
          <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-center">
            <div className="text-[10px] text-rose-700 uppercase font-bold">Deficiency Gaps</div>
            <div className="text-base font-extrabold text-rose-700">{competencies.filter(c => c.gap > 0).length}</div>
          </div>
          <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <div className="text-[10px] text-emerald-700 uppercase font-bold">Benchmarked</div>
            <div className="text-base font-extrabold text-emerald-700">{competencies.filter(c => c.gap === 0).length}</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition ${
            selectedCategory === 'ALL'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Competencies ({competencies.length})
        </button>
        <button
          onClick={() => setSelectedCategory('DOMAIN')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition ${
            selectedCategory === 'DOMAIN'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Domain Competencies ({domainCount})
        </button>
        <button
          onClick={() => setSelectedCategory('FUNCTIONAL')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition ${
            selectedCategory === 'FUNCTIONAL'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Functional Competencies ({funcCount})
        </button>
        <button
          onClick={() => setSelectedCategory('BEHAVIORAL')}
          className={`px-4 py-2 text-xs font-bold rounded-md transition ${
            selectedCategory === 'BEHAVIORAL'
              ? 'bg-blue-800 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Behavioral Competencies ({behCount})
        </button>
      </div>

      {/* Competencies Matrix Table / Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCompetencies.map((comp) => {
          const isGap = comp.gap > 0;
          const targetCourse = courses.find(c => c.primaryCompetency === comp.name || comp.recommendedCourses.includes(c.id));
          const isEditing = editingCompId === comp.id;

          return (
            <div
              key={comp.id}
              className={`bg-white rounded-xl shadow-gov border transition-all p-5 flex flex-col justify-between ${
                isGap ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Top header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      comp.category === 'DOMAIN' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      comp.category === 'FUNCTIONAL' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      'bg-purple-50 text-purple-800 border-purple-200'
                    }`}>
                      {comp.category}
                    </span>
                    <span className="text-xs font-mono font-semibold text-slate-400">{comp.code}</span>
                  </div>

                  {isGap ? (
                    <span className="flex items-center text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Gap: {comp.gap} Level{comp.gap > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Target Achieved
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 mt-2.5">{comp.name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{comp.description}</p>

                {/* Level indicators 1-5 */}
                <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">
                      Current: <strong>Level {comp.currentLevel}</strong> / 5
                    </span>
                    <span className="text-slate-500 font-medium">
                      Benchmark: <strong>Level {comp.benchmarkLevel}</strong>
                    </span>
                  </div>

                  {/* 5-step Segmented Level Bar */}
                  <div className="grid grid-cols-5 gap-1.5 h-2.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isCurrent = lvl <= comp.currentLevel;
                      const isBenchmark = lvl === comp.benchmarkLevel;
                      return (
                        <div
                          key={lvl}
                          className={`rounded-sm relative ${
                            isCurrent
                              ? isGap ? 'bg-amber-500' : 'bg-emerald-600'
                              : lvl <= comp.benchmarkLevel
                              ? 'bg-slate-300'
                              : 'bg-slate-200'
                          }`}
                          title={`Level ${lvl}`}
                        >
                          {isBenchmark && (
                            <div className="absolute -top-1 -right-0.5 w-1.5 h-4 bg-slate-900 rounded-xs ring-1 ring-white" title="Benchmark Target"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>L1: Awareness</span>
                    <span>L3: Proficiency</span>
                    <span>L5: Expert</span>
                  </div>
                </div>

                {/* Sub-skills chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {comp.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action area: Self-Assessment or Bridge Course */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                {isEditing ? (
                  <div className="w-full flex items-center space-x-2 bg-blue-50 p-2 rounded-lg border border-blue-200">
                    <select
                      value={tempLevel}
                      onChange={(e) => setTempLevel(Number(e.target.value))}
                      className="text-xs px-2 py-1 bg-white border border-slate-300 rounded font-medium text-slate-800"
                    >
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          {levelLabels[lvl - 1]}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        onAssessCompetency(comp.id, tempLevel);
                        setEditingCompId(null);
                      }}
                      className="px-2.5 py-1 bg-blue-800 text-white text-xs font-bold rounded hover:bg-blue-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCompId(null)}
                      className="px-2 py-1 text-slate-600 text-xs font-medium hover:bg-slate-200 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingCompId(comp.id);
                        setTempLevel(comp.currentLevel);
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center"
                    >
                      <Sliders className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      Self-Assess Level
                    </button>

                    {targetCourse && (
                      <button
                        onClick={() => onOpenCourse(targetCourse.id)}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center"
                      >
                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                        Target Course: {targetCourse.code}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Certificates & Accreditation Section */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">National Competency Accreditations & Certificates</h2>
              <p className="text-xs text-slate-500">Official digitally verifiable credentials with QR authentication</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {certificates.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => onOpenCertificate(cert.id)}
              className="p-4 rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-slate-50 hover:shadow-md hover:border-amber-400 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                    {cert.grade}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{cert.id}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">{cert.courseTitle}</h4>
                <p className="text-[11px] text-slate-600 mt-1">
                  Accredited: <span className="font-semibold text-slate-800">{cert.competencyAccredited}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Issued: {cert.issueDate}</span>
                <span className="font-bold text-blue-700 flex items-center">
                  View Certificate <ExternalLink className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
