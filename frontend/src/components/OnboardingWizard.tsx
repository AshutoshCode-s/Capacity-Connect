'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TargetRoleDef, User } from '../types';
import { ArrowRight, CheckCircle2, AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_ROLES: Record<string, TargetRoleDef> = {
  "Data Analyst": {
    id: "role_da",
    title: "Data Analyst",
    description: "",
    competencies: [
      { name: "Excel", requiredLevel: "L3", description: "" },
      { name: "SQL", requiredLevel: "L3", description: "" },
      { name: "Python", requiredLevel: "L3", description: "" },
      { name: "Data Visualization", requiredLevel: "L3", description: "" },
      { name: "Communication", requiredLevel: "L2", description: "" }
    ]
  },
  "Software Developer": {
    id: "role_sd",
    title: "Software Developer",
    description: "",
    competencies: [
      { name: "Programming", requiredLevel: "L3", description: "" },
      { name: "Data Structures & Algorithms", requiredLevel: "L3", description: "" },
      { name: "Database", requiredLevel: "L2", description: "" },
      { name: "Git & Version Control", requiredLevel: "L2", description: "" },
      { name: "Software Testing", requiredLevel: "L2", description: "" }
    ]
  },
  "Project Manager": {
    id: "role_pm",
    title: "Project Manager",
    description: "",
    competencies: [
      { name: "Project Planning", requiredLevel: "L3", description: "" },
      { name: "Communication", requiredLevel: "L4", description: "" },
      { name: "Team Management", requiredLevel: "L3", description: "" },
      { name: "Risk Management", requiredLevel: "L3", description: "" },
      { name: "Problem Solving", requiredLevel: "L3", description: "" }
    ]
  }
};

interface Props {
  phone: string;
  targetRoles: Record<string, TargetRoleDef>;
  onSubmitTrainee: (data: any) => Promise<any>;
  onComplete: (user: User) => void;
}

export default function OnboardingWizard({
  phone,
  targetRoles = {},
  onSubmitTrainee,
  onComplete,
}: Props) {
  // Step 1: Personal Details, Step 2: Choose Target Role, Step 3: Skill Self-Rating
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState('Rajesh Kumar');
  const [currentRole, setCurrentRole] = useState('Junior Systems Assistant');
  const [qualifications, setQualifications] = useState('B.Tech in Information Technology');
  const [workExperienceYears, setWorkExperienceYears] = useState(2);
  const [existingSkills, setExistingSkills] = useState('Excel, SQL, Python');
  const [certifications, setCertifications] = useState('Data Foundations, Python Basics');
  const [previousTraining, setPreviousTraining] = useState('IT Induction (2023)');
  const [areasOfInterest, setAreasOfInterest] = useState('Data Analytics, Dashboards');

  // Target Role & Self Ratings
  const [targetRole, setTargetRole] = useState<'Data Analyst' | 'Software Developer' | 'Project Manager'>('Data Analyst');
  const [selfAssessedLevels, setSelfAssessedLevels] = useState<Record<string, string>>({
    "Excel": "L2",
    "SQL": "L2",
    "Python": "L2",
    "Data Visualization": "L2",
    "Communication": "L2"
  });

  // Track expanded skill previews per role in Step 2 (hidden initially)
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const roleCardsRef = useRef<HTMLDivElement>(null);

  // Click outside to automatically collapse skills preview
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleCardsRef.current && !roleCardsRef.current.contains(event.target as Node)) {
        setExpandedRole(null);
      }
    };

    if (expandedRole) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expandedRole]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const activeRoleDef = targetRoles?.[targetRole] || DEFAULT_ROLES[targetRole] || DEFAULT_ROLES['Data Analyst'];
  const competencies = activeRoleDef?.competencies || DEFAULT_ROLES[targetRole]?.competencies || DEFAULT_ROLES['Data Analyst'].competencies;

  const handleRoleChange = (newRole: 'Data Analyst' | 'Software Developer' | 'Project Manager') => {
    setTargetRole(newRole);
    const def = targetRoles?.[newRole] || DEFAULT_ROLES[newRole];
    if (def?.competencies) {
      const initialSelf: Record<string, string> = {};
      def.competencies.forEach(c => {
        initialSelf[c.name] = "L2";
      });
      setSelfAssessedLevels(initialSelf);
    }
  };

  const toggleSkillsPreview = (roleKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRole(prev => (prev === roleKey ? null : roleKey));
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  const handleStep2Proceed = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCurrentStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        name,
        phone,
        currentRole,
        targetRole,
        qualifications,
        workExperienceYears: Number(workExperienceYears) || 1,
        existingSkills: existingSkills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: certifications.split(',').map(s => s.trim()).filter(Boolean),
        previousTraining,
        selfAssessedLevels,
        areasOfInterest: areasOfInterest.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await onSubmitTrainee(payload);
      if (res.user) {
        onComplete(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Step {currentStep} of 3
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              {currentStep === 1 && 'Personal Details'}
              {currentStep === 2 && 'Choose your target role'}
              {currentStep === 3 && 'Select your current skill level'}
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            Mobile: <strong>+91 {phone}</strong>
          </div>
        </div>

        {errorMessage && (
          <div className="m-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: PERSONAL DETAILS */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Next} className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Role *
                </label>
                <input
                  type="text"
                  required
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Junior Systems Assistant"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Qualifications *
                </label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.Tech, BCA, MCA, MBA, B.Sc"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Experience (Years) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  required
                  value={workExperienceYears}
                  onChange={(e) => setWorkExperienceYears(Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Existing Skills (Comma Separated)
                </label>
                <input
                  type="text"
                  value={existingSkills}
                  onChange={(e) => setExistingSkills(e.target.value)}
                  placeholder="e.g. Excel, SQL, Python, Git"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Certifications
                  </label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="e.g. Coursera Data Basics, NPTEL"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Training
                  </label>
                  <input
                    type="text"
                    value={previousTraining}
                    onChange={(e) => setPreviousTraining(e.target.value)}
                    placeholder="e.g. Induction Training (2023)"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Areas of Interest
                </label>
                <input
                  type="text"
                  value={areasOfInterest}
                  onChange={(e) => setAreasOfInterest(e.target.value)}
                  placeholder="e.g. Data Analytics, Dashboards, Web Development"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: CHOOSE TARGET ROLE (VERTICAL WITH CLICK-OUTSIDE COLLAPSIBLE SKILLS) */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Proceed} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                What role are you preparing for?
              </label>
              
              {/* Vertical Role Options */}
              <div ref={roleCardsRef} className="space-y-3">
                {(['Data Analyst', 'Software Developer', 'Project Manager'] as const).map((roleKey) => {
                  const roleObj = targetRoles?.[roleKey] || DEFAULT_ROLES[roleKey];
                  const isSelected = targetRole === roleKey;
                  const isSkillsExpanded = expandedRole === roleKey;
                  const roleCompetencies = roleObj?.competencies || DEFAULT_ROLES[roleKey].competencies;

                  return (
                    <div
                      key={roleKey}
                      onClick={() => handleRoleChange(roleKey)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col space-y-3 ${
                        isSelected
                          ? 'border-blue-700 bg-blue-50/40 shadow-xs ring-1 ring-blue-700'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Top Row: Radio selector + Role Title */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-blue-700 bg-blue-700' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                          </div>
                          <span className="font-bold text-sm text-slate-900">{roleKey}</span>
                        </div>

                        {/* View Required Skills Toggle Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleSkillsPreview(roleKey, e)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1 px-2.5 py-1 rounded-md hover:bg-blue-100/60 transition"
                        >
                          <span>{isSkillsExpanded ? 'Hide required skills' : 'View required skills'}</span>
                          {isSkillsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Required Skills Preview (Only Name and Level, Collapsible) */}
                      {isSkillsExpanded && (
                        <div 
                          onClick={(e) => e.stopPropagation()} 
                          className="pt-2 border-t border-slate-200/80 animate-in fade-in duration-150"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {roleCompetencies.map((comp) => (
                              <div
                                key={comp.name}
                                className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                              >
                                <span className="font-semibold text-slate-800">{comp.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono">
                                  {comp.requiredLevel}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-2"
              >
                <span>Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: RATE CURRENT SKILL LEVELS */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900">
                  Select your current skill level <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-red-600 font-medium mt-1">
                  * Self-rated levels are marked unverified until you take the test on the dashboard.
                </p>
              </div>

              {/* Skills Self-Rating List */}
              <div className="space-y-2.5">
                {competencies.map((comp) => (
                  <div
                    key={comp.name}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{comp.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 font-mono">
                        Required: {comp.requiredLevel}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs font-semibold text-slate-600">Your Level:</span>
                      <select
                        value={selfAssessedLevels[comp.name] || 'L2'}
                        onChange={(e) => setSelfAssessedLevels({
                          ...selfAssessedLevels,
                          [comp.name]: e.target.value
                        })}
                        className="text-xs font-bold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                      >
                        <option value="L1">L1 - Beginner</option>
                        <option value="L2">L2 - Intermediate</option>
                        <option value="L3">L3 - Advanced</option>
                        <option value="L4">L4 - Expert</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Go to Dashboard'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
