'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  KeyRound, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { User } from '../types';
import { defaultLearnerUser, defaultTrainerUser, defaultAdminUser } from '../services/mockData';

interface Props {
  onSendOtp: (phone: string) => Promise<{ message: string; otpCode: string; isExistingUser: boolean; user: User | null }>;
  onVerifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser: boolean; user?: User; error?: string }>;
  onLoginSuccess: (user: User) => void;
  onStartOnboarding: (phone: string, accountType: 'TRAINEE' | 'TRAINER') => void;
  onOpenAdminLogin?: () => void;
}

export default function LoginPage({
  onSendOtp,
  onVerifyOtp,
  onLoginSuccess,
  onStartOnboarding,
  onOpenAdminLogin,
}: Props) {
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [accountType, setAccountType] = useState<'TRAINEE' | 'TRAINER'>('TRAINEE');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectLearner = () => {
    setAccountType('TRAINEE');
    setPhone('9876543210');
    setErrorMessage('');
    setOtpNotice(null);
  };

  const handleSelectTrainer = () => {
    setAccountType('TRAINER');
    setPhone('9812345678');
    setErrorMessage('');
    setOtpNotice(null);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await onSendOtp(cleanPhone);
      setOtpNotice(`Demo OTP sent to +91 ${cleanPhone}: ${res.otpCode || '123456'}`);
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
    if (!otp.trim()) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const res = await onVerifyOtp(cleanPhone, otp.trim());
      if (res.isNewUser) {
        onStartOnboarding(cleanPhone, accountType);
      } else if (res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid OTP code. Enter 123456.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Header Branding */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Capacity Building Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In or Register
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Access skill gap diagnostics, verifiable certifications, trainer mentorship, and institutional governance.
          </p>
        </div>

        {/* Persona Selectors */}
        <div className="bg-slate-100/90 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={handleSelectLearner}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer ${
              accountType === 'TRAINEE'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/60 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Learner Portal</span>
          </button>
          
          <button
            type="button"
            onClick={handleSelectTrainer}
            className={`py-2.5 rounded-xl transition flex items-center justify-center space-x-2 cursor-pointer ${
              accountType === 'TRAINER'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-slate-200/60 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Trainer Portal</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold flex items-center space-x-2 animate-in fade-in">
            <Info className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PHONE NUMBER INPUT */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Mobile Number
              </label>
              
              <div className="relative">
                <div className="absolute left-3.5 top-3 flex items-center space-x-1.5 text-xs text-slate-500 font-bold pointer-events-none">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-16 pr-4 py-3 text-sm font-semibold border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 transition bg-white"
                />
              </div>

              {/* Demo Mobile Number Suggestion / Helper */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                  <span>💡 Quick Demo Mobile Numbers:</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('TRAINEE');
                      setPhone('9876543210');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition flex flex-col cursor-pointer ${
                      phone === '9876543210' && accountType === 'TRAINEE'
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-bold ring-1 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium">Learner (Rajesh Kumar)</span>
                    <span className="font-mono text-xs font-bold text-slate-900">9876543210</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('TRAINER');
                      setPhone('9812345678');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg border text-left transition flex flex-col cursor-pointer ${
                      phone === '9812345678' && accountType === 'TRAINER'
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-bold ring-1 ring-blue-200'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-medium">Trainer (Dr. Suresh Varma)</span>
                    <span className="font-mono text-xs font-bold text-slate-900">9812345678</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 pt-0.5">
                  Or enter <strong>your own 10-digit number</strong> to register a new account. Demo OTP is <strong>123456</strong>.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Sending Demo OTP...' : 'Send OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {otpNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl font-bold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{otpNotice}</span>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                  <span>Enter 6-Digit OTP</span>
                </label>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Change Number
                </button>
              </div>

              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123456"
                className="w-full py-3 text-center text-2xl font-mono font-bold tracking-widest border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900 bg-white"
              />

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
                <p className="text-[11px] text-slate-500">
                  Universal Demo OTP is pre-filled as <strong className="text-slate-900 font-mono">123456</strong>
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ⚡ ONE-CLICK DEMO ACCESS FOR REVIEWERS & EVALUATORS */}
        <div className="pt-4 border-t border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant One-Click Demo Access</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">No typing needed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onLoginSuccess(defaultLearnerUser)}
              className="p-2.5 bg-blue-50/60 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-blue-700 font-bold text-xs mb-0.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Learner</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium">Rajesh Kumar</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess(defaultTrainerUser)}
              className="p-2.5 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-xs mb-0.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Trainer</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium">Dr. Suresh Varma</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess(defaultAdminUser)}
              className="p-2.5 bg-purple-50/60 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition flex flex-col justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5 text-purple-700 font-bold text-xs mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium">Admin Officer</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
