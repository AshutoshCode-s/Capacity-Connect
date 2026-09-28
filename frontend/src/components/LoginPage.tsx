'use client';

import React, { useState } from 'react';
import { ArrowRight, UserCheck, GraduationCap, Sparkles } from 'lucide-react';
import { User } from '../types';

interface Props {
  onSendOtp: (phone: string) => Promise<{ message: string; otpCode: string; isExistingUser: boolean; user: User | null }>;
  onVerifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; isNewUser: boolean; user?: User; error?: string }>;
  onLoginSuccess: (user: User) => void;
  onStartOnboarding: (phone: string, accountType: 'TRAINEE' | 'TRAINER') => void;
}

export default function LoginPage({
  onSendOtp,
  onVerifyOtp,
  onLoginSuccess,
  onStartOnboarding,
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
  };

  const handleSelectTrainer = () => {
    setAccountType('TRAINER');
    setPhone('9812345678');
    setErrorMessage('');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await onSendOtp(phone);
      setOtpNotice(`OTP: ${res.otpCode}`);
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
        onStartOnboarding(phone, accountType);
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
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login or Sign Up</h1>
          <p className="text-xs text-slate-500">
            Enter your mobile number to continue
          </p>
        </div>

        {/* Account Type Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={handleSelectLearner}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              accountType === 'TRAINEE'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Learner</span>
          </button>
          <button
            type="button"
            onClick={handleSelectTrainer}
            className={`py-2 rounded-lg transition flex items-center justify-center space-x-1.5 ${
              accountType === 'TRAINER'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Trainer</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: PHONE NUMBER */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-semibold">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2.5 text-sm font-semibold border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {otpNotice && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-bold text-center">
                ✓ {otpNotice}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Enter OTP</label>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Change Number
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full py-3 text-center text-xl font-mono font-bold tracking-widest border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-900"
              />
              <p className="text-[11px] text-slate-400 text-center">
                Default demo OTP is <strong>123456</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying...' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
