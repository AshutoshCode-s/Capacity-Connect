'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
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
}: Props) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [accountType, setAccountType] = useState<'TRAINEE' | 'TRAINER'>('TRAINEE');
  const [otpNotice, setOtpNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSelectTrainee = () => {
    setAccountType('TRAINEE');
    setErrorMessage('');
    setOtpNotice(null);
  };

  const handleSelectTrainer = () => {
    setAccountType('TRAINER');
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
      setOtpNotice(`OTP: ${res.otpCode || '123456'}`);
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
      setErrorMessage('Please enter the OTP');
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        
        {/* Minimalist Title */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Login or Sign Up
          </h1>
        </div>

        {/* Trainee / Trainer Selector */}
        <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={handleSelectTrainee}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              accountType === 'TRAINEE'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Trainee</span>
          </button>
          
          <button
            type="button"
            onClick={handleSelectTrainer}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 cursor-pointer ${
              accountType === 'TRAINER'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Trainer</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-semibold flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER INPUT */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mobile Number
              </label>
              
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter your mobile number"
                  className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {otpNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-bold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{otpNotice}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700 flex items-center space-x-1">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Enter OTP</span>
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
                className="w-full py-2.5 text-center text-xl font-mono font-bold tracking-widest border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying...' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Minimalist Demo Access */}
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Demo
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onLoginSuccess(defaultLearnerUser)}
              className="py-2 px-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-center transition text-xs font-semibold text-slate-700 cursor-pointer flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Trainee</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess(defaultTrainerUser)}
              className="py-2 px-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-lg text-center transition text-xs font-semibold text-slate-700 cursor-pointer flex items-center justify-center space-x-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Trainer</span>
            </button>

            <button
              type="button"
              onClick={() => onLoginSuccess(defaultAdminUser)}
              className="py-2 px-2.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 border border-slate-200 rounded-lg text-center transition text-xs font-semibold text-slate-700 cursor-pointer flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
