'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Upload, 
  FileText, 
  Award, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Check
} from 'lucide-react';
import { Trainer, User } from '../types';

interface Props {
  isOpen: boolean;
  phone: string;
  onClose: () => void;
  onSubmitTrainer: (data: any) => Promise<any>;
  onSuccess: (trainer: Trainer, user?: User) => void;
}

const AVAILABLE_SKILLS = [
  "Excel",
  "SQL",
  "Python",
  "Data Visualization",
  "Communication",
  "Programming",
  "Data Structures & Algorithms",
  "Database",
  "Git & Version Control",
  "Software Testing",
  "Project Planning",
  "Team Management",
  "Risk Management",
  "Problem Solving"
];

export default function TrainerRegisterModal({
  isOpen,
  phone,
  onClose,
  onSubmitTrainer,
  onSuccess,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Personal & Professional Info
  const [name, setName] = useState('Dr. Suresh Varma');
  const [title, setTrainerTitle] = useState('Senior Technical Professor & Coach');
  const [organization, setOrganization] = useState('National Analytics Center');
  const [experienceYears, setExperienceYears] = useState(8);
  const [teachingHours, setTeachingHours] = useState(450);
  const [trainingMode, setTrainingMode] = useState<'Online' | 'In-person' | 'Online / In-person'>('Online / In-person');
  const [availableResources, setAvailableResources] = useState('Lecture Slides, Hands-on Datasets, Practice Codebooks');
  const [cvSummary, setCvSummary] = useState('8+ years experience coaching civil servants and enterprise engineers in Data Systems and Analytics.');

  // Step 2: Verification Documentation & Resume
  const [resumeFileName, setResumeFileName] = useState('resume_dr_suresh_varma.pdf');
  const [isResumeUploaded, setIsResumeUploaded] = useState(true);
  const [portfolioUrl, setPortfolioUrl] = useState('https://linkedin.com/in/drsureshvarma');

  // Step 3: Skills & Courses Offered
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Excel', 'SQL', 'Python', 'Data Visualization']);
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>({
    'Excel': 'L4',
    'SQL': 'L4',
    'Python': 'L4',
    'Data Visualization': 'L4'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
      if (!skillLevels[skill]) {
        setSkillLevels(prev => ({ ...prev, [skill]: 'L4' }));
      }
    }
  };

  const handleSkillLevelChange = (skill: string, level: string) => {
    setSkillLevels(prev => ({ ...prev, [skill]: level }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFileName(e.target.files[0].name);
      setIsResumeUploaded(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSkills.length === 0) {
      setErrorMessage('Please select at least one skill / course you offer to train.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        name,
        phone,
        title,
        organization,
        experienceYears: Number(experienceYears) || 5,
        teachingHours: Number(teachingHours) || 200,
        trainingMode,
        availableResources,
        resumeFileName,
        cvSummary,
        portfolioUrl,
        subjects: selectedSkills,
        verifiedLevel: 'L4'
      };

      const res = await onSubmitTrainer(payload);
      if (res.trainer) {
        onSuccess(res.trainer, res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Trainer registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Trainer Registration</h3>
            <p className="text-xs text-slate-500">Step {step} of 3 • Create your verified trainer & faculty profile</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold">
          <div className={`flex items-center space-x-1.5 ${step === 1 ? 'text-blue-700 font-extrabold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-blue-700 text-white' : 'bg-slate-300 text-slate-700'}`}>1</span>
            <span>Profile & Info</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center space-x-1.5 ${step === 2 ? 'text-blue-700 font-extrabold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-blue-700 text-white' : 'bg-slate-300 text-slate-700'}`}>2</span>
            <span>Resume & Verification</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-blue-700 font-extrabold' : 'text-slate-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-blue-700 text-white' : 'bg-slate-300 text-slate-700'}`}>3</span>
            <span>Skills & Courses</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto text-xs flex-1">
          
          {/* STEP 1: PERSONAL & PROFESSIONAL INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    disabled
                    value={phone}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Professional Title / Designation *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTrainerTitle(e.target.value)}
                    placeholder="e.g. Senior Professor / Data Architect"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Institution *</label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. National Capacity Institute"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teaching & Industry Experience (Years) *</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Resources & Materials</label>
                  <input
                    type="text"
                    value={availableResources}
                    onChange={(e) => setAvailableResources(e.target.value)}
                    placeholder="e.g. Excel Dashboards, Power BI Templates, Practice Codebooks"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Bio / Summary</label>
                <textarea
                  rows={2}
                  value={cvSummary}
                  onChange={(e) => setCvSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 2: RESUME & VERIFICATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Trainer Documentation Verification</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Submit your Curriculum Vitae / Resume and credentials to receive the Accredited Trainer badge.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Upload Resume / Credentials (PDF / DOCX)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Maximum file size: 10MB</p>
                </div>
                <label className="inline-block px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shadow-xs">
                  <span>Choose File</span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Uploaded File Status */}
              {isResumeUploaded && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="w-5 h-5 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{resumeFileName}</div>
                      <div className="text-[10px] text-emerald-800 font-semibold">✓ Verified & Ready for Submission</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-200/70 text-emerald-900 font-bold text-[10px]">
                    Attached
                  </span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn or Portfolio URL</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 bg-white"
                />
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS & COURSES OFFERED WITH LEVEL */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-slate-900 text-xs">Select Courses and Skill Levels to Train</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Check all skills you are qualified to mentor, and select your teaching proficiency level.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {AVAILABLE_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  const currentLvl = skillLevels[skill] || 'L4';

                  return (
                    <div
                      key={skill}
                      className={`p-3 rounded-xl border transition flex flex-col justify-between space-y-2 ${
                        isSelected 
                          ? 'border-blue-700 bg-blue-50/40 ring-1 ring-blue-700' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label 
                          onClick={() => handleToggleSkill(skill)}
                          className="flex items-center space-x-2.5 cursor-pointer flex-1"
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isSelected ? 'bg-blue-700 border-blue-700 text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                          <span className={`font-bold ${isSelected ? 'text-blue-950' : 'text-slate-800'}`}>
                            {skill}
                          </span>
                        </label>

                        {isSelected && (
                          <select
                            value={currentLvl}
                            onChange={(e) => handleSkillLevelChange(skill, e.target.value)}
                            className="text-[11px] font-bold px-2 py-1 bg-white border border-blue-300 rounded-md text-blue-900 focus:outline-hidden"
                          >
                            <option value="L4">L4 Master</option>
                            <option value="L3">L3 Advanced</option>
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </form>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || selectedSkills.length === 0}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLoading ? 'Creating Profile...' : 'Complete & Open Trainer Dashboard'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
