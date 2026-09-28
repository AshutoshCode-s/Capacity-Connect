'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, ArrowRight, X, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { User as UserType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: Props) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both Admin ID and Password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await api.adminLogin(username, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'Invalid Admin credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Admin Portal Login</h3>
              <p className="text-[11px] text-purple-900 font-medium">Access Governance & Institutional Controls</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-white/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin ID Input */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Admin ID / Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-700">Admin Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-600 bg-white"
              />
            </div>
          </div>

          {/* Demo Helper Note */}
          <div className="p-3 bg-purple-50/70 border border-purple-200/70 rounded-xl text-[11px] text-purple-900 space-y-1">
            <p className="font-bold flex items-center space-x-1">
              <span>Demo Credentials:</span>
            </p>
            <p>Admin ID: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">admin</code></p>
            <p>Password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-purple-200">admin123</code></p>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying...' : 'Sign In to Admin Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
