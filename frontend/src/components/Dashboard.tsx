'use client';

import React, { useState } from 'react';
import { User, TargetRoleDef, Trainer, TargetedModule, Certificate, QuestionItem } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Calendar,
  ExternalLink,
  Search,
  Sparkles,
  X,
  Play,
  Clock,
  Video,
  Check,
  Lock,
  BookOpen
} from 'lucide-react';

export interface BookedSessionCourse {
  id: string;
  trainerId: string;
  trainerName: string;
  subject: string;
  date: string;
  time: string;
  trainingMode: string;
  bookedAt: string;
  classes: Array<{
    id: number;
    title: string;
    duration: string;
    completed: boolean;
  }>;
  status: 'IN_PROGRESS' | 'COMPLETED';
}

const DEFAULT_ROLE_DEFS: Record<string, TargetRoleDef> = {
  "Data Analyst": {
    id: "role_da",
    title: "Data Analyst",
    description: "Data analysis and reporting",
    competencies: [
      { name: "Excel", requiredLevel: "L3", description: "Formulas & Pivot Tables" },
      { name: "SQL", requiredLevel: "L3", description: "Queries & Joins" },
      { name: "Python", requiredLevel: "L3", description: "Pandas & Scripting" },
      { name: "Data Visualization", requiredLevel: "L3", description: "Dashboards & Visuals" },
      { name: "Communication", requiredLevel: "L2", description: "Reporting & Presentation" }
    ]
  },
  "Software Developer": {
    id: "role_sd",
    title: "Software Developer",
    description: "Builds applications and scalable software systems",
    competencies: [
      { name: "Programming", requiredLevel: "L3", description: "OOP, Logic, and Architecture" },
      { name: "Data Structures & Algorithms", requiredLevel: "L3", description: "Arrays, Trees, Graphs, and Complexity" },
      { name: "Database", requiredLevel: "L2", description: "Relational Modeling and SQL" },
      { name: "Git & Version Control", requiredLevel: "L2", description: "Branching, PRs, and Collaboration" },
      { name: "Software Testing", requiredLevel: "L2", description: "Unit Tests and Quality Assurance" }
    ]
  },
  "Project Manager": {
    id: "role_pm",
    title: "Project Manager",
    description: "Manages timelines, delivery, and risks",
    competencies: [
      { name: "Project Planning", requiredLevel: "L3", description: "WBS, Timelines, and Gantt Charts" },
      { name: "Communication", requiredLevel: "L4", description: "Executive Updates and Alignment" },
      { name: "Team Management", requiredLevel: "L3", description: "Task Delegation and Agile Delivery" },
      { name: "Risk Management", requiredLevel: "L3", description: "Risk Registers and Mitigation Plans" },
      { name: "Problem Solving", requiredLevel: "L3", description: "Root Cause Analysis and Solutions" }
    ]
  }
};

interface Props {
  user: User;
  targetRoleDef: TargetRoleDef;
  trainers: Trainer[];
  learningModules: TargetedModule[];
  certificates: Certificate[];
  questionsByCompetency: Record<string, QuestionItem[]>;
  onOpenTest: () => void;
  onBookTrainer: (trainerId: string, competency: string) => Promise<any>;
  onSubmitPostTraining: (competency: string, answers: Record<string, number>) => Promise<any>;
  onOpenCertificate: (certId: string) => void;
}

export default function Dashboard({
  user,
  targetRoleDef,
  trainers,
  learningModules,
  certificates,
  questionsByCompetency,
  onOpenTest,
  onBookTrainer,
  onSubmitPostTraining,
  onOpenCertificate,
}: Props) {
  const safeTargetRoleDef = (targetRoleDef && targetRoleDef.title === user.targetRole)
    ? targetRoleDef
    : (DEFAULT_ROLE_DEFS[user.targetRole] || DEFAULT_ROLE_DEFS['Data Analyst']);

  const competencies = safeTargetRoleDef.competencies || DEFAULT_ROLE_DEFS['Data Analyst'].competencies;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRAINERS' | 'BRIDGE_MODULES' | 'RETEST'>('OVERVIEW');
  const [trainerSearchQuery, setTrainerSearchQuery] = useState<string>('');
  const [bookedCourses, setBookedCourses] = useState<BookedSessionCourse[]>([]);
  const [retestComp, setRetestComp] = useState<string>(competencies[0]?.name || 'SQL');
  const [retestAnswers, setRetestAnswers] = useState<Record<string, number>>({});
  const [retestResult, setRetestResult] = useState<any>(null);
  const [isSubmittingRetest, setIsSubmittingRetest] = useState(false);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  // Booking Modal State
  const [selectedTrainerForBooking, setSelectedTrainerForBooking] = useState<Trainer | null>(null);
  const [bookingSubject, setBookingSubject] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-29');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM - 11:00 AM');
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [isConfirmingBooking, setIsConfirmingBooking] = useState(false);

  // Smart Matching Modal State
  const [isSmartMatchingOpen, setIsSmartMatchingOpen] = useState(false);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);

  const levelToNum = (lvl: string) => {
    const match = String(lvl).match(/\d/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const gapSummary = competencies.map((comp) => {
    const req = comp.requiredLevel;
    const self = user.selfAssessedLevels?.[comp.name] || 'L2';
    const ver = user.verifiedLevels?.[comp.name] || 'Unverified';

    const isVerified = ver !== 'Unverified';
    const reqNum = levelToNum(req);
    const verNum = isVerified ? levelToNum(ver) : 0;
    const gap = isVerified ? reqNum - verNum : reqNum;

    return {
      name: comp.name,
      description: comp.description,
      required: req,
      selfAssessed: self,
      verified: ver,
      isVerified,
      gap,
      hasGap: isVerified ? gap > 0 : true,
      gapText: !isVerified ? 'Unverified' : gap <= 0 ? 'Target Met' : `Gap: ${gap} Level${gap > 1 ? 's' : ''}`
    };
  });

  const missingComps = gapSummary.filter(g => g.hasGap).map(g => g.name);

  // Filter matched trainers and search query
  const matchedTrainers = trainers.filter(t => {
    const matchesSearch = !trainerSearchQuery.trim() || 
      t.name.toLowerCase().includes(trainerSearchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(trainerSearchQuery.toLowerCase())) ||
      (t.availableResources && t.availableResources.toLowerCase().includes(trainerSearchQuery.toLowerCase()));
    return matchesSearch;
  });

  const matchedModules = learningModules.filter(m => 
    missingComps.includes(m.competency)
  );

  // Find best trainer for each skill
  const getBestTrainerForSkill = (skillName: string) => {
    const sLower = skillName.toLowerCase();
    const found = trainers.find(t => 
      t.subjects.some(s => {
        const subLower = s.toLowerCase();
        return subLower.includes(sLower) || sLower.includes(subLower) ||
          (sLower.includes('git') && subLower.includes('git')) ||
          (sLower.includes('dsa') && subLower.includes('dsa')) ||
          (sLower.includes('structure') && (subLower.includes('dsa') || subLower.includes('programming'))) ||
          (sLower.includes('test') && (subLower.includes('test') || subLower.includes('qa'))) ||
          (sLower.includes('risk') && (subLower.includes('management') || subLower.includes('planning'))) ||
          (sLower.includes('team') && subLower.includes('team')) ||
          (sLower.includes('problem') && (subLower.includes('analysis') || subLower.includes('problem')));
      })
    );
    return found || trainers[0];
  };

  const handleSearchTrainerForSkill = (skillName: string) => {
    setTrainerSearchQuery(skillName);
    setActiveTab('TRAINERS');
  };

  const handleOpenBooking = (trainer: Trainer, subject?: string) => {
    setSelectedTrainerForBooking(trainer);
    const matchedSubject = subject || 
      (trainerSearchQuery && trainer.subjects.find(s => s.toLowerCase().includes(trainerSearchQuery.toLowerCase()))) ||
      trainer.subjects[0] || 
      'Excel';
    setBookingSubject(matchedSubject);
    setIsPlayingDemo(false);
  };

  const handleConfirmBooking = async () => {
    if (!selectedTrainerForBooking) return;
    setIsConfirmingBooking(true);
    try {
      await onBookTrainer(selectedTrainerForBooking.id, bookingSubject);
      
      const newCourse: BookedSessionCourse = {
        id: `course_${Date.now()}`,
        trainerId: selectedTrainerForBooking.id,
        trainerName: selectedTrainerForBooking.name,
        subject: bookingSubject,
        date: bookingDate,
        time: bookingTime,
        trainingMode: selectedTrainerForBooking.trainingMode || 'Online',
        bookedAt: new Date().toLocaleDateString('en-GB'),
        classes: [
          { id: 1, title: `Class 1: ${bookingSubject} Core Fundamentals & Framework`, duration: "45 mins", completed: false },
          { id: 2, title: `Class 2: ${bookingSubject} Hands-on Implementation & Practical Lab`, duration: "60 mins", completed: false },
          { id: 3, title: `Class 3: ${bookingSubject} Advanced Mastery & Assessment Prep`, duration: "45 mins", completed: false }
        ],
        status: 'IN_PROGRESS'
      };

      setBookedCourses(prev => [newCourse, ...prev.filter(c => c.subject !== bookingSubject)]);
      setBookingNotice(`Session booked with ${selectedTrainerForBooking.name} on ${bookingDate} at ${bookingTime} for ${bookingSubject}. It has been added to your Courses tab.`);
      setSelectedTrainerForBooking(null);
      setIsSmartMatchingOpen(false);
      setTimeout(() => setBookingNotice(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsConfirmingBooking(false);
    }
  };

  const handleToggleClassComplete = (courseId: string, classId: number) => {
    setBookedCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;
      const updatedClasses = course.classes.map(c => 
        c.id === classId ? { ...c, completed: !c.completed } : c
      );
      const allDone = updatedClasses.every(c => c.completed);
      return {
        ...course,
        classes: updatedClasses,
        status: allDone ? 'COMPLETED' : 'IN_PROGRESS'
      };
    }));
  };

  const handleMarkCourseCompleted = (courseId: string) => {
    setBookedCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;
      return {
        ...course,
        classes: course.classes.map(c => ({ ...c, completed: true })),
        status: 'COMPLETED'
      };
    }));
  };

  const handleTriggerSmartMatching = () => {
    setIsMatchingLoading(true);
    setIsSmartMatchingOpen(true);
    setTimeout(() => {
      setIsMatchingLoading(false);
    }, 800);
  };

  const handleRetestSubmit = async () => {
    setIsSubmittingRetest(true);
    try {
      const res = await onSubmitPostTraining(retestComp, retestAnswers);
      setRetestResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingRetest(false);
    }
  };

  const retestQuestions = questionsByCompetency[retestComp] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* User Welcome Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
          <div className="space-y-1 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">
              <span className="text-slate-400 font-normal">Current Role:</span> {user.currentRole}
            </p>
            <p className="font-bold text-blue-700">
              <span className="text-slate-400 font-normal">Target Role:</span> {user.targetRole}
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 font-normal">Education:</span> {user.qualifications}
            </p>
            <p className="text-slate-600">
              <span className="text-slate-400 font-normal">Experience:</span> {user.workExperienceYears} {user.workExperienceYears === 1 ? 'Year' : 'Years'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-[120px]">
            <div className="text-[10px] uppercase font-bold text-slate-400">Role Fit</div>
            <div className="text-2xl font-black text-blue-700">{user.roleFitScore || 0}%</div>
            <div className="text-[10px] text-slate-500">Target: 80%+</div>
          </div>

          <div className="flex flex-col items-stretch gap-2 min-w-[150px]">
            <button
              onClick={onOpenTest}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition text-center"
            >
              {user.diagnosticCompleted ? 'Re-verify' : 'Verify'}
            </button>

            {user.diagnosticCompleted && (
              <button
                onClick={handleTriggerSmartMatching}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition text-center flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Smart Matching</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {bookingNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{bookingNotice}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Skills & Gaps
        </button>

        <button
          onClick={() => setActiveTab('TRAINERS')}
          className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeTab === 'TRAINERS'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Trainers</span>
          <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-bold">
            {matchedTrainers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('BRIDGE_MODULES')}
          className={`px-4 py-2 rounded-lg transition flex items-center space-x-1.5 ${
            activeTab === 'BRIDGE_MODULES'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Courses</span>
          <span className="text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded-full font-bold">
            {bookedCourses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('RETEST')}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === 'RETEST'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Retake Test
        </button>
      </div>

      {/* TAB 1: SKILLS & GAPS */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          
          {/* Main Skills Table */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Required Skills for {user.targetRole}
              </h3>
              
              <button
                onClick={onOpenTest}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                {user.diagnosticCompleted ? 'Retake Test' : 'Take Test'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold">
                  <tr>
                    <th className="px-5 py-3 text-left">Skill</th>
                    <th className="px-4 py-3 text-center">Required Level</th>
                    <th className="px-4 py-3 text-center">Self-Rated</th>
                    <th className="px-4 py-3 text-center">Verified Level</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {gapSummary.map((comp) => (
                    <tr key={comp.name} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{comp.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{comp.description}</div>
                      </td>

                      <td className="px-4 py-4 text-center font-bold text-blue-900 font-mono text-xs">
                        {comp.required}
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                          {comp.selfAssessed}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {comp.isVerified ? (
                          <span className={`px-2.5 py-1 rounded font-bold font-mono text-xs ${
                            comp.verified === 'L4' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                            comp.verified === 'L3' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            'bg-blue-100 text-blue-900 border border-blue-200'
                          }`}>
                            {comp.verified}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-400">
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {comp.isVerified ? (
                          comp.hasGap ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                                {comp.gapText}
                              </span>
                              <button
                                onClick={() => handleSearchTrainerForSkill(comp.name)}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs transition"
                              >
                                Search Trainer
                              </button>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                              ✓ Target Met
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-500 font-medium">
                            Unverified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Certificates (if earned) */}
          {certificates.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900">Certificates ({certificates.length})</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => onOpenCertificate(cert.id)}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:bg-amber-50/80 transition cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900">{cert.courseTitle}</h4>
                      <div className="text-slate-500 mt-1">
                        Skill: <strong className="text-slate-800">{cert.competencyAccredited}</strong> • Grade: {cert.grade}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 ml-3 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: AVAILABLE TRAINERS (SIMPLE & CLEAN) */}
      {activeTab === 'TRAINERS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-base text-slate-900">Available Trainers</h3>

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={trainerSearchQuery}
                onChange={(e) => setTrainerSearchQuery(e.target.value)}
                placeholder="Search trainer or skill..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
              {trainerSearchQuery && (
                <button 
                  onClick={() => setTrainerSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchedTrainers.length > 0 ? (
              matchedTrainers.map((t) => (
                <div key={t.id} className="p-5 bg-white rounded-xl border border-slate-200 space-y-3.5 flex flex-col justify-between hover:border-slate-300 transition">
                  <div className="space-y-2.5">
                    {/* Top Row: Name & Level */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                        Level {t.verifiedLevel}
                      </span>
                    </div>

                    {/* Simple details list */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-500">Expertise: </span>
                        <strong className="text-slate-800">{t.subjects.join(', ')}</strong>
                      </p>
                      <p>
                        <span className="font-semibold text-slate-500">Experience: </span>
                        <strong className="text-slate-800">{t.experienceYears} yrs</strong>
                      </p>
                      {t.availableResources && (
                        <p>
                          <span className="font-semibold text-slate-500">Available Resources: </span>
                          <span className="text-slate-800 font-medium">{t.availableResources}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => handleOpenBooking(t)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Session</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
                <p>No trainers matching "{trainerSearchQuery}".</p>
                <button
                  onClick={() => setTrainerSearchQuery('')}
                  className="font-bold text-blue-700 hover:underline"
                >
                  Clear search filter
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COURSES (SHOWS ONLY BOOKED SESSIONS) */}
      {activeTab === 'BRIDGE_MODULES' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Your Enrolled Courses</h3>
              <p className="text-xs text-slate-500">
                Courses added automatically when you book a training session. Complete the classes to unlock retesting.
              </p>
            </div>
            {bookedCourses.length > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {bookedCourses.filter(c => c.status === 'COMPLETED').length} of {bookedCourses.length} Courses Completed
              </span>
            )}
          </div>

          {bookedCourses.length === 0 ? (
            /* EMPTY STATE */
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h4 className="font-bold text-slate-900 text-base">No Booked Courses Yet</h4>
                <p className="text-xs text-slate-500">
                  The courses section is currently empty. Once you book a mentorship or training session with a trainer, it will appear here with scheduled classes and lecture modules.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveTab('TRAINERS')}
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Browse Trainers
                </button>
                <button
                  onClick={handleTriggerSmartMatching}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Smart Matching</span>
                </button>
              </div>
            </div>
          ) : (
            /* BOOKED COURSES CARDS */
            <div className="space-y-5">
              {bookedCourses.map((course) => {
                const completedCount = course.classes.filter(c => c.completed).length;
                const totalCount = course.classes.length;
                const isAllCompleted = course.status === 'COMPLETED';

                return (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
                    {/* Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900">
                            {course.subject}
                          </span>
                          {isAllCompleted ? (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Session Completed</span>
                            </span>
                          ) : (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>In Progress ({completedCount}/{totalCount} Classes)</span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-base">
                          Live Training Course: {course.subject}
                        </h4>
                      </div>

                      {/* Quick Complete / Mark Complete Button */}
                      {!isAllCompleted && (
                        <button
                          onClick={() => handleMarkCourseCompleted(course.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                        >
                          Mark All Classes Complete
                        </button>
                      )}
                    </div>

                    {/* Booking Details Card */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1.5">
                      <p className="font-semibold text-slate-900">
                        You have booked a training session with <strong className="text-blue-700">{course.trainerName}</strong>.
                      </p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-600 text-[11px]">
                        <p><span className="text-slate-400 font-semibold">Date:</span> <strong>{course.date}</strong></p>
                        <p><span className="text-slate-400 font-semibold">Timing:</span> <strong>{course.time}</strong></p>
                      </div>
                    </div>

                    {/* Classes / Lectures in Session */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                          Course Classes & Lessons ({totalCount} Classes)
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Click a class to mark as completed
                        </span>
                      </div>

                      <div className="space-y-2">
                        {course.classes.map((cls) => (
                          <div
                            key={cls.id}
                            onClick={() => handleToggleClassComplete(course.id, cls.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition text-xs ${
                              cls.completed 
                                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                                cls.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {cls.completed && <Check className="w-3.5 h-3.5" />}
                              </div>
                              <span className={`font-semibold ${cls.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                                {cls.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">{cls.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Action: Retake Test Button (Active only when completed) */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <p className="text-[11px] text-slate-500">
                        {isAllCompleted
                          ? '✓ Course session completed. You are now eligible to retake the test!'
                          : 'Complete all classes in this session to unlock the retake test.'}
                      </p>

                      {isAllCompleted ? (
                        <button
                          onClick={() => {
                            setRetestComp(course.subject);
                            setActiveTab('RETEST');
                          }}
                          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5"
                        >
                          <span>Retake Test ({course.subject})</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-5 py-2.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-slate-200 cursor-not-allowed flex items-center justify-center space-x-1.5"
                          title="Complete all classes to unlock Retest"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Retake Test (Locked)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: RETAKE TEST */}
      {activeTab === 'RETEST' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Skill Retest</h3>
              <p className="text-xs text-slate-500">Score 60% or higher to upgrade your verified level.</p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-700">Skill:</span>
              <select
                value={retestComp}
                onChange={(e) => {
                  setRetestComp(e.target.value);
                  setRetestAnswers({});
                  setRetestResult(null);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900"
              >
                {competencies.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} (Current: {user.verifiedLevels?.[c.name] || 'Unverified'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {retestResult && (
            <div className="p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-emerald-950 text-base">
                    {retestResult.improved ? '🎉 Skill Level Upgraded Successfully!' : 'Retest Submitted'}
                  </h4>
                </div>
                <p className="text-xs text-emerald-900">
                  <strong>{retestResult.competency}</strong>: Verified level updated from <span className="font-mono bg-emerald-200/70 px-1.5 py-0.5 rounded font-bold">{retestResult.previousLevel}</span> to <span className="font-mono bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold">{retestResult.newVerifiedLevel}</span> ({retestResult.percentage}% score)
                </p>
                <p className="text-xs text-emerald-800">
                  New Overall Role Fit Score: <strong>{retestResult.newOverallFitScore}%</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('OVERVIEW')}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition"
                >
                  <span>View Skills & Gaps</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {retestResult.certificate && (
                  <button
                    onClick={() => onOpenCertificate(retestResult.certificate.id)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              5 Questions ({retestComp})
            </h4>

            <div className="space-y-4">
              {retestQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-900">
                    Q{qIdx + 1}. {q.question}
                  </div>
                  <div className="grid grid-cols-1 gap-2 pl-4">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = retestAnswers[q.id] === optIdx;
                      return (
                        <label
                          key={optIdx}
                          onClick={() => setRetestAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`p-2.5 rounded-lg border cursor-pointer flex items-center space-x-2 transition ${
                            isSelected
                              ? 'bg-blue-50 border-blue-700 text-blue-950 font-bold ring-1 ring-blue-700'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <input type="radio" name={`ret_${q.id}`} checked={isSelected} onChange={() => {}} className="text-blue-700" />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={handleRetestSubmit}
                disabled={isSubmittingRetest || Object.keys(retestAnswers).length < retestQuestions.length}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmittingRetest ? 'Submitting...' : 'Submit Test'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMART MATCHING MODAL */}
      {isSmartMatchingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Smart Trainer Matching</h3>
                  <p className="text-xs text-slate-500">Matching the best trainers according to your skill gaps</p>
                </div>
              </div>
              <button onClick={() => setIsSmartMatchingOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              {isMatchingLoading ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-semibold text-slate-600">Analyzing your verified skill levels and matching top trainers...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium">
                    ✓ Matched expert professors and trainers for all {competencies.length} skills required for {user.targetRole}.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {competencies.map((comp) => {
                      const skillName = comp.name;
                      const matchedT = getBestTrainerForSkill(skillName);
                      return (
                        <div key={skillName} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-slate-300 transition">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                                Skill: {skillName} (Req: {comp.requiredLevel})
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-mono">
                                Level {matchedT.verifiedLevel}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{matchedT.name}</h4>
                              <div className="space-y-1 text-[11px] text-slate-600 mt-1.5">
                                <p><span className="text-slate-400 font-semibold">Expertise:</span> {matchedT.subjects.join(', ')}</p>
                                <p><span className="text-slate-400 font-semibold">Experience:</span> {matchedT.experienceYears} yrs</p>
                                {matchedT.availableResources && (
                                  <p><span className="text-slate-400 font-semibold">Resources:</span> {matchedT.availableResources}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleOpenBooking(matchedT, skillName)}
                            className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition flex items-center justify-center space-x-1.5 shadow-xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book Session</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsSmartMatchingOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING SESSION MODAL */}
      {selectedTrainerForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 flex flex-col">
            
            {/* Top Header: Book Session, and below it Trainer Name */}
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight">Book Session</h3>
                <p className="text-sm font-bold text-slate-700 mt-1">{selectedTrainerForBooking.name}</p>
              </div>
              <button onClick={() => setSelectedTrainerForBooking(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Demo Lecture */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-700 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-blue-700" />
                  <span>Demo Lecture</span>
                </h4>

                <div 
                  onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                  className="h-44 bg-slate-950 rounded-xl flex flex-col items-center justify-center space-y-2 border border-slate-800 cursor-pointer hover:bg-slate-900 transition relative overflow-hidden group shadow-inner"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-lg ${
                    isPlayingDemo ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white group-hover:scale-105'
                  }`}>
                    {isPlayingDemo ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </div>
                  <div className="text-center px-4">
                    <p className="text-xs font-bold text-white">
                      {isPlayingDemo ? `Playing Demo: ${bookingSubject} Lecture` : `Watch Demo Lecture`}
                    </p>
                    <p className="text-[11px] text-slate-400">15 mins • Core concepts & practical overview</p>
                  </div>
                </div>
              </div>

              {/* Subject Name (e.g. Excel, SQL, Python) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-600 font-bold">Subject:</span>
                <span className="text-sm font-extrabold text-blue-700 font-mono">{bookingSubject}</span>
              </div>

              {/* Select Live Session Date and Time */}
              <div className="space-y-3 pt-1">
                <h4 className="font-bold text-xs uppercase tracking-wide text-slate-900">
                  Select Live Session Date and Time
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM (Morning)</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM (Afternoon)</option>
                      <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedTrainerForBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isConfirmingBooking}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isConfirmingBooking ? 'Booking...' : 'Book Session'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
