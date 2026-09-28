'use client';

import React, { useState } from 'react';
import { TargetRoleDef, User } from '../types';
import { 
  Phone, 
  KeyRound, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowRight, 
  Sparkles,
  Award,
  BookOpen,
  Info
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  targetRoles: Record<string, TargetRoleDef>;
  onLoginSuccess: (user: User) => void;
  onRegisterTrainerSuccess?: (trainer: any) => void;
  onSendOtp: (phone: string) => Promise<any>;
  onVerifyOtp: (phone: string, otp: string) => Promise<any>;
  onRegisterTrainee: (data: any) => Promise<any>;
  onRegisterTrainer: (data: any) => Promise<any>;
}

export default function OtpAuthModal({
  isOpen,
  onClose,
  targetRoles,
  onLoginSuccess,
  onRegisterTrainerSuccess,
  onSendOtp,
  onVerifyOtp,
  onRegisterTrainee,
  onRegisterTrainer,
}: Props) {
  const [step, setStep] = useState<'PHONE' | 'OTP' | 'CHOOSE_TYPE' | 'REGISTER_TRAINEE' | 'REGISTER_TRAINER'>('PHONE');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [receivedOtpNotice, setReceivedOtpNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Trainee Form Fields
  const [traineeName, setTraineeName] = useState('Rajesh Kumar');
  const [currentRole, setCurrentRole] = useState('Junior Systems Assistant');
  const [selectedTargetRole, setSelectedTargetRole] = useState('Data Analyst');
  const [qualifications, setQualifications] = useState('B.Tech in Information Technology');
  const [experienceYears, setExperienceYears] = useState(2);
  const [existingSkills, setExistingSkills] = useState('Basic Excel, SQL Queries, Python Basics');
  const [certifications, setCertifications] = useState('Coursera Data Foundations');
  const [previousTraining, setPreviousTraining] = useState('State IT Foundation Induction (2023)');
  const [areasOfInterest, setAreasOfInterest] = useState('Government Analytics, Public Health Dashboards');
  const [selfAssessedLevels, setSelfAssessedLevels] = useState<Record<string, string>>({
    "Excel": "L3",
    "SQL": "L3",
    "Python": "L3",
    "Data Visualization": "L2",
    "Communication": "L2"
  });

  // Trainer Form Fields
  const [trainerName, setTrainerName] = useState('Dr. Suresh Varma');
  const [trainerTitle, setTrainerTitle] = useState('Chief Data Architect & Senior Analytics Mentor');
  const [trainerOrg, setTrainerOrg] = useState('National Analytics Center & Ex-TCS');
  const [trainerCv, setTrainerCv] = useState('Ph.D. in Computer Science (IIT Bombay). 14 years industry experience in SQL, Python, and BI pipelines.');
  const [trainerExp, setTrainerExp] = useState(14);
  const [trainerTeachingHours, setTrainerTeachingHours] = useState(1200);
  const [trainerSubjects, setTrainerSubjects] = useState('SQL, Python, Excel, Data Visualization');
  const [trainerLevel, setTrainerLevel] = useState('L4 Expert');

  if (!isOpen) return null;

  const currentRoleDef = targetRoles[selectedTargetRole] || targetRoles['Data Analyst'];

  // Handlers
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await onSendOtp(phone);
      setReceivedOtpNotice(`Demo OTP: ${res.otpCode} (Generated for ${phone})`);
      setOtp(res.otpCode || '123456');
      setStep('OTP');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await onVerifyOtp(phone, otp);
      if (res.isNewUser) {
        setStep('CHOOSE_TYPE');
      } else if (res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTraineeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: traineeName,
        phone,
        currentRole,
        targetRole: selectedTargetRole,
        qualifications,
        workExperienceYears: experienceYears,
        existingSkills: existingSkills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: certifications.split(',').map(s => s.trim()).filter(Boolean),
        previousTraining,
        selfAssessedLevels,
        areasOfInterest: areasOfInterest.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await onRegisterTrainee(payload);
      onLoginSuccess(res.user);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: trainerName,
        phone,
        title: trainerTitle,
        organization: trainerOrg,
        cvSummary: trainerCv,
        experienceYears: trainerExp,
        teachingHours: trainerTeachingHours,
        subjects: trainerSubjects.split(',').map(s => s.trim()).filter(Boolean),
        verifiedLevel: trainerLevel,
        availability: "Mon, Wed, Sat (Evening Batches)",
        hourlyRate: "Govt Grant Sponsored"
      };
      const res = await onRegisterTrainer(payload);
      if (onRegisterTrainerSuccess) onRegisterTrainerSuccess(res.trainer);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Trainer registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper when changing target role in trainee form
  const handleRoleChange = (newRole: string) => {
    setSelectedTargetRole(newRole);
    const def = targetRoles[newRole];
    if (def) {
      const newSelf: Record<string, string> = {};
      def.competencies.forEach(c => {
        newSelf[c.name] = "L2";
      });
      setSelfAssessedLevels(newSelf);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-300 overflow-hidden my-6">
        
        {/* National Emblem Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-base shadow-sm">
              CC
            </div>
            <div>
              <h2 className="text-base font-bold">CAPACITY CONNECT – National Onboarding Portal</h2>
              <p className="text-xs text-slate-300">Competency-Driven Digital Capacity Building • Phone OTP Authentication</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 text-xs text-rose-800 font-medium">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: PHONE ENTRY */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Sign In or Register with Mobile OTP</h3>
              <p className="text-xs text-slate-500">
                Enter your 10-digit mobile number to access your verified competency profile.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (India +91)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-4 py-2 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-mono text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Fast 1-Click Demo Profiles */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">
                  Quick Demo Numbers:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setPhone('9876543210'); }}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-800 hover:border-blue-600"
                  >
                    👤 Trainee (Rajesh Kumar)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhone('9812345678'); }}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-800 hover:border-blue-600"
                  >
                    👔 Supervisor (Dr. Anjali Verma)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhone('9988776655'); }}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-800 hover:border-blue-600"
                  >
                    ✨ New Trainee Registration
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center justify-center space-x-2"
              >
                <span>{isLoading ? 'Sending SMS OTP...' : 'Send Verification OTP'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Enter Verification Code</h3>
              <p className="text-xs text-slate-500">
                A 6-digit OTP has been sent to <strong>+91 {phone}</strong>.
              </p>
            </div>

            {receivedOtpNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 font-bold text-center">
                ✓ {receivedOtpNotice}
              </div>
            )}

            <div className="max-w-md mx-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-center">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-2.5 text-center text-lg font-mono font-black tracking-widest border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 text-slate-900"
                  placeholder="123456"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoading ? 'Verifying...' : 'Verify OTP & Continue'}</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: CHOOSE ACCOUNT TYPE (FOR NEW USERS) */}
        {step === 'CHOOSE_TYPE' && (
          <div className="p-6 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Select Your Onboarding Profile</h3>
              <p className="text-xs text-slate-500">
                Choose whether you are enrolling as a Trainee/Civil Servant or registering as an Accredited Mentor/Trainer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => setStep('REGISTER_TRAINEE')}
                className="p-5 rounded-xl border-2 border-blue-600 bg-blue-50/40 hover:bg-blue-50 transition cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Trainee / Public Servant</h4>
                  <p className="text-xs text-slate-600">
                    Prepare for target roles (Data Analyst, Software Developer, Project Manager), verify competency levels, and bridge skill gaps.
                  </p>
                </div>
                <button className="w-full py-1.5 bg-blue-800 text-white text-xs font-bold rounded-md flex items-center justify-center space-x-1">
                  <span>Register as Trainee</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>

              <div
                onClick={() => setStep('REGISTER_TRAINER')}
                className="p-5 rounded-xl border-2 border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 transition cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Trainer / Subject Matter Mentor</h4>
                  <p className="text-xs text-slate-600">
                    Register your verified credentials, CV, subjects of interest, and conduct mentoring cohorts for civil service trainees.
                  </p>
                </div>
                <button className="w-full py-1.5 bg-slate-800 hover:bg-amber-600 text-white text-xs font-bold rounded-md flex items-center justify-center space-x-1">
                  <span>Register as Trainer</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: TRAINEE REGISTRATION FORM */}
        {step === 'REGISTER_TRAINEE' && (
          <form onSubmit={handleTraineeSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Trainee Profile & Target Role Configuration</h3>
              <p className="text-xs text-slate-500">Provide your background and self-assessed competency baselines</p>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={traineeName}
                  onChange={(e) => setTraineeName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Role / Designation *</label>
                <input
                  type="text"
                  required
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* TARGET ROLE SELECTOR */}
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-blue-950 uppercase tracking-wide">
                    🎯 Select Target Role You Are Preparing For *
                  </label>
                  <p className="text-[11px] text-blue-800">
                    Determines the benchmark competency standard and required levels (L1–L4).
                  </p>
                </div>
              </div>

              <select
                value={selectedTargetRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-white border-2 border-blue-400 rounded-md text-blue-900 focus:outline-hidden"
              >
                {Object.keys(targetRoles).map((rKey) => (
                  <option key={rKey} value={rKey}>
                    {rKey} ({targetRoles[rKey].competencies.length} Required Competencies)
                  </option>
                ))}
              </select>

              {/* Target Role Competencies Preview Table */}
              <div className="bg-white rounded-lg border border-blue-200 overflow-hidden text-xs">
                <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-700 text-[11px] flex justify-between">
                  <span>Required Competency</span>
                  <span>Mandatory Level</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {currentRoleDef.competencies.map((comp) => (
                    <div key={comp.name} className="px-3 py-2 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{comp.name}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{comp.description}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold text-xs">
                        {comp.requiredLevel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Qualifications & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Educational Qualifications *</label>
                <input
                  type="text"
                  required
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.Tech, BCA, MCA, MBA"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Experience (Years)</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            {/* Skills & Certifications */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Existing Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={existingSkills}
                  onChange={(e) => setExistingSkills(e.target.value)}
                  placeholder="e.g. Basic Excel, SQL Queries, Python Basics"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Existing Certifications</label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="e.g. Coursera, NPTEL, iGOT"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Previous Training Programs</label>
                  <input
                    type="text"
                    value={previousTraining}
                    onChange={(e) => setPreviousTraining(e.target.value)}
                    placeholder="e.g. State IT Induction 2023"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Areas of Interest</label>
                <input
                  type="text"
                  value={areasOfInterest}
                  onChange={(e) => setAreasOfInterest(e.target.value)}
                  placeholder="e.g. Government Analytics, Public Dashboards, Logistics"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            {/* SELF-ASSESSED COMPETENCY LEVELS SECTION (WITH UNVERIFIED NOTICE) */}
            <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-300 space-y-3">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Self-Assessed Competency Level (Unverified Baseline)
                  </h4>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    Rate your current proficiency: <strong>L1 Foundation</strong> (basic concepts), <strong>L2 Working</strong> (routine tasks with limited guidance), <strong>L3 Proficient</strong> (independent problem solving), or <strong>L4 Expert</strong> (complex cases & guidance).
                  </p>
                  <div className="mt-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded inline-block border border-rose-200">
                    ⚠️ Self-Assessment is strictly marked as UNVERIFIED until evaluated by the Diagnostic Assessment Engine.
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                {currentRoleDef.competencies.map((comp) => (
                  <div key={comp.name} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-200 text-xs">
                    <span className="font-semibold text-slate-900">{comp.name}</span>
                    <select
                      value={selfAssessedLevels[comp.name] || 'L2'}
                      onChange={(e) => setSelfAssessedLevels({
                        ...selfAssessedLevels,
                        [comp.name]: e.target.value
                      })}
                      className="text-xs font-bold px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800"
                    >
                      <option value="L1">L1: Foundation (Concepts)</option>
                      <option value="L2">L2: Working (Routine Tasks)</option>
                      <option value="L3">L3: Proficient (Independent)</option>
                      <option value="L4">L4: Expert (Advanced)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setStep('CHOOSE_TYPE')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLoading ? 'Creating Trainee Profile...' : 'Complete Profile & Launch Diagnostic'}</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: TRAINER REGISTRATION FORM */}
        {step === 'REGISTER_TRAINER' && (
          <form onSubmit={handleTrainerSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Trainer & Subject Matter Expert Registration</h3>
              <p className="text-xs text-slate-500">Register your credentials, teaching portfolio, and competency areas</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trainer Full Name *</label>
                <input
                  type="text"
                  required
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Title *</label>
                <input
                  type="text"
                  required
                  value={trainerTitle}
                  onChange={(e) => setTrainerTitle(e.target.value)}
                  placeholder="e.g. Chief Data Architect & Mentor"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Affiliation</label>
                <input
                  type="text"
                  value={trainerOrg}
                  onChange={(e) => setTrainerOrg(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teaching & Mentoring Experience (Hours)</label>
                <input
                  type="number"
                  value={trainerTeachingHours}
                  onChange={(e) => setTrainerTeachingHours(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Competencies & Subjects of Expertise</label>
              <input
                type="text"
                required
                value={trainerSubjects}
                onChange={(e) => setTrainerSubjects(e.target.value)}
                placeholder="e.g. SQL, Python, Excel, Data Visualization"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Professional CV & Background Summary *</label>
              <textarea
                required
                rows={3}
                value={trainerCv}
                onChange={(e) => setTrainerCv(e.target.value)}
                placeholder="Ph.D. / Industry experience, corporate coaching history, project certifications..."
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setStep('CHOOSE_TYPE')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-2"
              >
                <Award className="w-4 h-4" />
                <span>{isLoading ? 'Registering Trainer...' : 'Register Trainer Profile'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
