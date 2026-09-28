'use client';

import React, { useState, useEffect } from 'react';
import { User, Trainer, TargetRoleDef, QuestionItem, RoleCompetency } from '../types';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  HelpCircle, 
  Layers, 
  FileText, 
  Search, 
  X, 
  Check, 
  Edit3,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  user: User;
  trainers: Trainer[];
  targetRoles: Record<string, TargetRoleDef>;
  onRefreshData?: () => void;
}

export default function AdminDashboard({
  user,
  trainers: initialTrainers,
  targetRoles: initialTargetRoles,
  onRefreshData
}: Props) {
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers);
  const [targetRoles, setTargetRoles] = useState<Record<string, TargetRoleDef>>(initialTargetRoles);
  
  // Assessment Questions State
  const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionItem[]>>({});
  
  // Realtime Analytics State
  const [analytics, setAnalytics] = useState<any>({
    userRise: {
      totalUsers: 338,
      activeTrainees: 320,
      newTraineesThisMonth: 84,
      monthlyGrowthRate: "+24.8%",
      verifiedLearners: 218,
      readinessRate: 68
    },
    submissionsByCourse: [
      { course: "Excel", submissions: 142, passed: 125, passRate: "88%", avgScore: "81%", trend: "+12%" },
      { course: "SQL", submissions: 118, passed: 93, passRate: "79%", avgScore: "76%", trend: "+8%" },
      { course: "Python", submissions: 95, passed: 68, passRate: "72%", avgScore: "69%", trend: "+15%" },
      { course: "Data Visualization", submissions: 64, passed: 58, passRate: "91%", avgScore: "86%", trend: "+6%" },
      { course: "Communication", submissions: 84, passed: 79, passRate: "94%", avgScore: "90%", trend: "+10%" }
    ],
    monthlyActivityTrends: [
      { month: "May", tests: 45, verifications: 38, readiness: 52 },
      { month: "Jun", tests: 68, verifications: 54, readiness: 56 },
      { month: "Jul", tests: 92, verifications: 78, readiness: 61 },
      { month: "Aug", tests: 114, verifications: 96, readiness: 64 },
      { month: "Sep", tests: 142, verifications: 125, readiness: 68 }
    ],
    topSkillGaps: [
      { skill: "Python", gapScore: 82, targetLevel: "L3" },
      { skill: "SQL", gapScore: 74, targetLevel: "L3" },
      { skill: "Excel", gapScore: 65, targetLevel: "L3" },
      { skill: "Data Visualization", gapScore: 58, targetLevel: "L3" },
      { skill: "Communication", gapScore: 42, targetLevel: "L2" }
    ]
  });

  // Modals state
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<{ roleKey: string; roleDef: TargetRoleDef } | null>(null);
  const [roleForAssessment, setRoleForAssessment] = useState<{ roleKey: string; roleDef: TargetRoleDef } | null>(null);
  const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);

  // Form states - Create Role
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleInitialSkill, setNewRoleInitialSkill] = useState('');
  const [newRoleInitialLevel, setNewRoleInitialLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L3');

  // Form states - Edit Role
  const [editRoleComps, setEditRoleComps] = useState<RoleCompetency[]>([]);
  const [newSkillInEditName, setNewSkillInEditName] = useState('');
  const [newSkillInEditLevel, setNewSkillInEditLevel] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L3');

  // Form states - Assessment Question
  const [newQCompetency, setNewQCompetency] = useState('Excel');
  const [newQDifficulty, setNewQDifficulty] = useState<'L1' | 'L2' | 'L3' | 'L4'>('L2');
  const [newQText, setNewQText] = useState('');
  const [newQOpt0, setNewQOpt0] = useState('');
  const [newQOpt1, setNewQOpt1] = useState('');
  const [newQOpt2, setNewQOpt2] = useState('');
  const [newQOpt3, setNewQOpt3] = useState('');
  const [newQCorrect, setNewQCorrect] = useState<number>(0);
  const [newQExplanation, setNewQExplanation] = useState('');
  const [questionSuccessNotice, setQuestionSuccessNotice] = useState(false);

  // Form states - Trainer
  const [newTrnName, setNewTrnName] = useState('');
  const [newTrnSubject, setNewTrnSubject] = useState('Excel');
  const [newTrnExp, setNewTrnExp] = useState(6);
  const [newTrnLevel, setNewTrnLevel] = useState<'L3' | 'L4'>('L4');

  // Search filter for trainers
  const [trainerSearch, setTrainerSearch] = useState('');

  // Load initial data
  useEffect(() => {
    api.getAllAdminQuestions().then(res => {
      if (res && typeof res === 'object') setQuestionsMap(res);
    }).catch(console.error);

    api.getAdminAnalytics().then(res => {
      if (res && res.userRise) setAnalytics(res);
    }).catch(console.error);
  }, []);

  // 1. Submit Create Role
  const handleCreateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;

    const roleName = newRoleTitle.trim();
    const initialComps: RoleCompetency[] = newRoleInitialSkill.trim() ? [{
      name: newRoleInitialSkill.trim(),
      requiredLevel: newRoleInitialLevel,
      description: `${newRoleInitialSkill.trim()} required level ${newRoleInitialLevel}`
    }] : [
      { name: "Domain Execution", requiredLevel: "L3", description: "Core domain execution" }
    ];

    try {
      const res = await api.createAdminRole(roleName, newRoleDesc.trim(), initialComps);
      if (res.targetRoles) {
        setTargetRoles(res.targetRoles);
      } else {
        setTargetRoles(prev => ({
          ...prev,
          [roleName]: {
            id: `role_${Date.now()}`,
            title: roleName,
            description: newRoleDesc.trim(),
            competencies: initialComps
          }
        }));
      }

      setIsCreateRoleModalOpen(false);
      setNewRoleTitle('');
      setNewRoleDesc('');
      setNewRoleInitialSkill('');
      setNewRoleInitialLevel('L3');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Open Edit Role Modal
  const handleOpenEditRole = (roleKey: string, roleDef: TargetRoleDef) => {
    setRoleToEdit({ roleKey, roleDef });
    setEditRoleComps([...roleDef.competencies]);
    setNewSkillInEditName('');
    setNewSkillInEditLevel('L3');
  };

  // Save Edit Role changes
  const handleSaveEditRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleToEdit) return;

    try {
      const updatedComps: RoleCompetency[] = editRoleComps.map(c => ({
        name: c.name,
        requiredLevel: c.requiredLevel,
        description: c.description || `${c.name} required level ${c.requiredLevel}`
      }));

      // Save all updated competencies to backend
      for (const comp of updatedComps) {
        await api.addAdminCompetency(roleToEdit.roleKey, comp.name, comp.requiredLevel, comp.description);
      }

      setTargetRoles(prev => {
        const existingRole = prev[roleToEdit.roleKey];
        if (!existingRole) return prev;
        return {
          ...prev,
          [roleToEdit.roleKey]: {
            ...existingRole,
            competencies: updatedComps
          }
        };
      });

      setRoleToEdit(null);
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkillInEdit = () => {
    if (!newSkillInEditName.trim()) return;
    setEditRoleComps(prev => [
      ...prev,
      {
        name: newSkillInEditName.trim(),
        requiredLevel: newSkillInEditLevel,
        description: `${newSkillInEditName.trim()} proficiency`
      }
    ]);
    setNewSkillInEditName('');
  };

  const handleRemoveSkillInEdit = (skillName: string) => {
    setEditRoleComps(prev => prev.filter(c => c.name !== skillName));
  };

  // 3. Open Add Assessment Modal for Role
  const handleOpenAssessmentForRole = (roleKey: string, roleDef: TargetRoleDef) => {
    setRoleForAssessment({ roleKey, roleDef });
    if (roleDef.competencies && roleDef.competencies.length > 0) {
      setNewQCompetency(roleDef.competencies[0].name);
    } else {
      setNewQCompetency('Excel');
    }
    setQuestionSuccessNotice(false);
  };

  // Submit Assessment Question
  const handleAddAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newQOpt0.trim() || !newQOpt1.trim()) return;

    const options = [newQOpt0, newQOpt1, newQOpt2 || 'Option C', newQOpt3 || 'Option D'];

    try {
      const res = await api.addAdminAssessmentQuestion({
        competency: newQCompetency,
        difficultyLevel: newQDifficulty,
        question: newQText.trim(),
        options,
        correctAnswer: newQCorrect,
        explanation: newQExplanation.trim() || `Verification standard for ${newQCompetency} (${newQDifficulty})`
      });

      if (res.question) {
        setQuestionsMap(prev => {
          const list = prev[newQCompetency] ? [...prev[newQCompetency]] : [];
          list.push(res.question);
          return { ...prev, [newQCompetency]: list };
        });
      }

      setQuestionSuccessNotice(true);
      setTimeout(() => setQuestionSuccessNotice(false), 3000);

      setNewQText('');
      setNewQOpt0('');
      setNewQOpt1('');
      setNewQOpt2('');
      setNewQOpt3('');
      setNewQExplanation('');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Submit Add Trainer
  const handleAddTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrnName.trim()) return;

    try {
      const res = await api.addAdminTrainer({
        name: newTrnName.trim(),
        subject: newTrnSubject,
        experienceYears: Number(newTrnExp),
        verifiedLevel: newTrnLevel
      });

      if (res.trainer) {
        setTrainers(prev => [res.trainer, ...prev]);
      }

      setIsAddTrainerModalOpen(false);
      setNewTrnName('');
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Delete Trainer
  const handleDeleteTrainer = async (trainerId: string) => {
    try {
      await api.deleteAdminTrainer(trainerId);
      setTrainers(prev => prev.filter(t => t.id !== trainerId));
      if (onRefreshData) onRefreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrainers = trainers.filter(t => 
    !trainerSearch.trim() || 
    t.name.toLowerCase().includes(trainerSearch.toLowerCase()) ||
    t.subjects?.some(s => s.toLowerCase().includes(trainerSearch.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      
      {/* 1. TOP PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name || 'Admin Officer'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-mono font-bold text-xs border border-purple-200">
                {user.employeeId || 'ADM-001'}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-600 mt-2">
              <p className="font-semibold text-slate-700">
                <span className="text-slate-400 font-normal">Role:</span> {user.currentRole || 'Central Capacity Administrator'}
              </p>
              <p className="text-slate-600">
                <span className="text-slate-400 font-normal">Organization:</span> {user.department || 'National Capacity Directorate'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreateRoleModalOpen(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Role</span>
            </button>
            <button
              onClick={() => setIsAddTrainerModalOpen(true)}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trainer</span>
            </button>
          </div>
        </div>

        {/* Plain Text Stats beside/under admin profile */}
        <div className="pt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Overview: <strong className="text-slate-900">{Object.keys(targetRoles).length} Target Roles</strong></span>
          <span>• <strong className="text-blue-700">{trainers.length} Faculty Trainers</strong></span>
          <span>• <strong className="text-purple-700">{analytics.userRise?.activeTrainees || 320} Trainees Enrolled</strong></span>
          <span>• <strong className="text-emerald-700">{analytics.userRise?.readinessRate || 68}% Org Readiness</strong></span>
        </div>
      </div>

      {/* 2. SECTION: ROLES & REQUIRED SKILLS (Card for Every Role with Edit and Add Assessment Options) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Layers className="w-5 h-5 text-purple-700" />
              <span>Roles & Required Skills</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Defined institutional roles, competency blueprints, and assessment authoring</p>
          </div>

          <button
            onClick={() => setIsCreateRoleModalOpen(true)}
            className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Role</span>
          </button>
        </div>

        {/* CARDS FOR EVERY ROLE */}
        <div className="space-y-4">
          {Object.entries(targetRoles).map(([roleKey, roleDef]) => (
            <div
              key={roleKey}
              className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4 shadow-2xs hover:border-slate-300 transition"
            >
              {/* Role Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="font-extrabold text-slate-900 text-base">{roleDef.title || roleKey}</h3>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200">
                      {roleDef.competencies?.length || 0} Skills Required
                    </span>
                  </div>
                  {roleDef.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{roleDef.description}</p>
                  )}
                </div>

                {/* Role Actions: Edit Role & Add Assessment */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => handleOpenEditRole(roleKey, roleDef)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-lg transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-700" />
                    <span>Edit Role</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssessmentForRole(roleKey, roleDef)}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Add Assessment</span>
                  </button>
                </div>
              </div>

              {/* Skills List: Minimalist display (Name and Required Level ONLY) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {roleDef.competencies?.map((comp, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs"
                  >
                    <span className="font-bold text-slate-900 text-xs truncate mr-2">{comp.name}</span>
                    <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 flex-shrink-0">
                      {comp.requiredLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SECTION: MANAGE TRAINERS (Horizontal Cards) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-700" />
              <span>Manage Trainers</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Faculty directory, credentials verification, and assigned competency domains</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search trainer, subject..."
                value={trainerSearch}
                onChange={(e) => setTrainerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => setIsAddTrainerModalOpen(true)}
              className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg transition flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Trainer</span>
            </button>
          </div>
        </div>

        {/* Horizontal Trainer Cards List */}
        <div className="space-y-3">
          {filteredTrainers.map((trn) => (
            <div
              key={trn.id}
              className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
            >
              {/* Left Side: Avatar, Name, Expertise, Experience */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <img
                  src={trn.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={trn.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs flex-shrink-0"
                />

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm truncate">{trn.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-purple-100 text-purple-900 border border-purple-200 font-mono">
                      Level {trn.verifiedLevel || 'L4'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      ID: {trn.id}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-slate-600">
                    <p><span className="text-slate-400 font-semibold">Expertise:</span> <strong>{trn.subjects?.join(', ') || 'General'}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Experience:</span> <strong>{trn.experienceYears} Years</strong></p>
                    <p className="text-amber-600 font-bold">★ {trn.rating || 4.95} ({trn.teachingHours || 450} hrs)</p>
                  </div>
                </div>
              </div>

              {/* Right Side: Delete Button */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => handleDeleteTrainer(trn.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove Trainer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION: MONITOR SECTION & ANALYTIC GRAPH */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Monitor Progress & Real-Time Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Trainee growth metrics, course submissions pass rates, and competency gap analytics</p>
        </div>

        {/* Top 4 Metrics Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px]">User Rise (Total)</span>
            <p className="text-2xl font-extrabold text-purple-900">{analytics.userRise?.totalUsers || 338}</p>
            <p className="text-[10px] text-purple-700 font-bold">{analytics.userRise?.monthlyGrowthRate || '+24.8%'} this month</p>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px]">Active Learners</span>
            <p className="text-2xl font-extrabold text-blue-900">{analytics.userRise?.activeTrainees || 320}</p>
            <p className="text-[10px] text-blue-700 font-bold">{analytics.userRise?.newTraineesThisMonth || 84} new registrations</p>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px]">Verifications Passed</span>
            <p className="text-2xl font-extrabold text-emerald-900">{analytics.userRise?.verifiedLearners || 218}</p>
            <p className="text-[10px] text-emerald-700 font-bold">84% Verification Rate</p>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
            <span className="text-slate-500 font-semibold text-[11px]">Org Readiness Rate</span>
            <p className="text-2xl font-extrabold text-amber-900">{analytics.userRise?.readinessRate || 68}%</p>
            <p className="text-[10px] text-amber-700 font-bold">Target Benchmark: 80%</p>
          </div>
        </div>

        {/* Course Submissions & Pass Rate Table */}
        <div className="space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Submissions in Each Course</h3>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Course / Skill</th>
                  <th className="p-3">Total Submissions</th>
                  <th className="p-3">Passed</th>
                  <th className="p-3">Pass Rate</th>
                  <th className="p-3">Average Score</th>
                  <th className="p-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.submissionsByCourse?.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 font-bold text-slate-900">{item.course}</td>
                    <td className="p-3 font-mono font-semibold">{item.submissions}</td>
                    <td className="p-3 font-mono text-emerald-700 font-bold">{item.passed}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                        {item.passRate}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-semibold">{item.avgScore}</td>
                    <td className="p-3 text-emerald-600 font-bold">{item.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Analytic Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Monthly Verification Growth Chart */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Monthly Assessment Submissions Trend</h4>
            
            <div className="flex items-end justify-between h-36 px-2 gap-3 pt-6">
              {analytics.monthlyActivityTrends?.map((m: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div 
                    className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-t-md relative group cursor-pointer"
                    style={{ height: `${(m.tests / 160) * 100}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded font-mono pointer-events-none whitespace-nowrap z-10 transition">
                      {m.tests} tests
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Competency Gaps */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Priority Skill Gap Index (Top 5)</h4>

            <div className="space-y-2.5">
              {analytics.topSkillGaps?.map((gap: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 truncate mr-2">{gap.skill}</span>
                    <span className="font-bold font-mono text-purple-900">{gap.gapScore}% Gap</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                      style={{ width: `${gap.gapScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL 1: CREATE ROLE (Role Title, Role Description, Initial Skill & Level) */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-purple-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Create New Role</h3>
              <button onClick={() => setIsCreateRoleModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={newRoleTitle}
                  onChange={(e) => setNewRoleTitle(e.target.value)}
                  placeholder="e.g. Data Engineer, Cybersecurity Analyst"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role Description</label>
                <textarea
                  rows={2}
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  placeholder="Role mandate and responsibilities"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Skill *</label>
                  <input
                    type="text"
                    required
                    value={newRoleInitialSkill}
                    onChange={(e) => setNewRoleInitialSkill(e.target.value)}
                    placeholder="e.g. Apache Spark"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Required Level *</label>
                  <select
                    value={newRoleInitialLevel}
                    onChange={(e: any) => setNewRoleInitialLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  >
                    <option value="L1">Level 1 (L1)</option>
                    <option value="L2">Level 2 (L2)</option>
                    <option value="L3">Level 3 (L3)</option>
                    <option value="L4">Level 4 (L4)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT ROLE (Edit Required Levels & Skills for a Role) */}
      {roleToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="p-5 border-b border-slate-200 bg-purple-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Edit Role: {roleToEdit.roleDef.title || roleToEdit.roleKey}</h3>
                <p className="text-xs text-slate-500">Update required proficiency levels or add/remove skills</p>
              </div>
              <button onClick={() => setRoleToEdit(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRole} className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Current Required Skills & Levels</label>
                
                <div className="space-y-2 max-h-60 overflow-y-auto p-1">
                  {editRoleComps.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <span className="font-bold text-slate-900 text-xs">{comp.name}</span>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={comp.requiredLevel}
                          onChange={(e) => {
                            const newLvl = e.target.value;
                            setEditRoleComps(prev => prev.map((c, i) => i === idx ? { ...c, requiredLevel: newLvl } : c));
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-300 font-mono font-bold text-slate-900 text-xs rounded-lg"
                        >
                          <option value="L1">Level L1</option>
                          <option value="L2">Level L2</option>
                          <option value="L3">Level L3</option>
                          <option value="L4">Level L4</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleRemoveSkillInEdit(comp.name)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Remove skill"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Skill into Role */}
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200/70 space-y-2">
                <span className="font-bold text-purple-900 text-[11px] block">Add Skill to this Role</span>
                
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillInEditName}
                    onChange={(e) => setNewSkillInEditName(e.target.value)}
                    placeholder="e.g. Statistical Inference"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                  />
                  <select
                    value={newSkillInEditLevel}
                    onChange={(e: any) => setNewSkillInEditLevel(e.target.value)}
                    className="px-2 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-bold"
                  >
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="L4">L4</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkillInEdit}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleToEdit(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD ASSESSMENT FOR ROLE (Quiz & Verification Questions) */}
      {roleForAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
            <div className="p-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Setup Assessment for {roleForAssessment.roleDef.title || roleForAssessment.roleKey}</h3>
                <p className="text-xs text-slate-500">Create quiz and diagnostic verification questions for this role</p>
              </div>
              <button onClick={() => setRoleForAssessment(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAssessmentSubmit} className="p-6 space-y-4 text-xs">
              {questionSuccessNotice && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Question added successfully to the assessment test bank!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Skill / Competency *</label>
                  <select
                    value={newQCompetency}
                    onChange={(e) => setNewQCompetency(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                  >
                    {roleForAssessment.roleDef.competencies?.map(c => (
                      <option key={c.name} value={c.name}>{c.name} (Req: {c.requiredLevel})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty Level *</label>
                  <select
                    value={newQDifficulty}
                    onChange={(e: any) => setNewQDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                  >
                    <option value="L1">L1 - Basic</option>
                    <option value="L2">L2 - Intermediate</option>
                    <option value="L3">L3 - Proficient</option>
                    <option value="L4">L4 - Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Enter the quiz / verification test question"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Answer Options *</label>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    value={newQOpt0}
                    onChange={(e) => setNewQOpt0(e.target.value)}
                    placeholder="Option A (e.g. Correct Answer or Choice 1)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                  <input
                    type="text"
                    required
                    value={newQOpt1}
                    onChange={(e) => setNewQOpt1(e.target.value)}
                    placeholder="Option B"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                  <input
                    type="text"
                    value={newQOpt2}
                    onChange={(e) => setNewQOpt2(e.target.value)}
                    placeholder="Option C"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                  <input
                    type="text"
                    value={newQOpt3}
                    onChange={(e) => setNewQOpt3(e.target.value)}
                    placeholder="Option D"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Correct Option Index *</label>
                <select
                  value={newQCorrect}
                  onChange={(e) => setNewQCorrect(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                >
                  <option value={0}>Option A is Correct</option>
                  <option value={1}>Option B is Correct</option>
                  <option value={2}>Option C is Correct</option>
                  <option value={3}>Option D is Correct</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation / Scoring Logic</label>
                <textarea
                  rows={2}
                  value={newQExplanation}
                  onChange={(e) => setNewQExplanation(e.target.value)}
                  placeholder="Rationale explaining why the selected option is correct"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleForAssessment(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Done
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  Add Question to Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TRAINER */}
      {isAddTrainerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-purple-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Add Faculty Trainer</h3>
              <button onClick={() => setIsAddTrainerModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTrainerSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Trainer Name *</label>
                <input
                  type="text"
                  required
                  value={newTrnName}
                  onChange={(e) => setNewTrnName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Khanna"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Expertise *</label>
                  <select
                    value={newTrnSubject}
                    onChange={(e) => setNewTrnSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  >
                    <option value="Excel">Excel</option>
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="Data Visualization">Data Visualization</option>
                    <option value="Communication">Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={newTrnExp}
                    onChange={(e) => setNewTrnExp(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Verified Trainer Level</label>
                <select
                  value={newTrnLevel}
                  onChange={(e: any) => setNewTrnLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                >
                  <option value="L3">Level 3 - Senior Trainer</option>
                  <option value="L4">Level 4 - Master Faculty</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTrainerModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Add Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
