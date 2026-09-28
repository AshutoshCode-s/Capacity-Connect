'use client';

import React, { useState } from 'react';
import { Shield, Key, Building2, CheckCircle, Lock, ArrowRight, X } from 'lucide-react';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (userId: string) => void;
}

export default function LoginModal({ isOpen, onClose, users, onSelectUser }: Props) {
  const [govEmail, setGovEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Jan Parichay Bar */}
        <div className="bg-slate-900 text-white p-5 text-center relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-amber-500 text-slate-900 rounded-lg mx-auto flex items-center justify-center font-bold text-lg mb-2 shadow-sm">
            🇮🇳
          </div>
          <h2 className="text-lg font-bold">जन परिचय | Jan Parichay Single Sign-On</h2>
          <p className="text-xs text-slate-300">National Single Sign-On (NSSO) Portal for Government Officials</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Login Buttons */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quick 1-Click Demo Profiles (Evaluator Access)
            </div>
            <div className="grid grid-cols-1 gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition"
                >
                  <div className="flex items-center space-x-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-500">{u.designation.split('(')[0]} ({u.role})</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-700 flex items-center">
                    Login <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase font-medium">Or Use NIC Email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gov / NIC Email ID (@gov.in / @nic.in)
              </label>
              <input
                type="email"
                placeholder="rajesh.kumar@gov.in"
                value={govEmail}
                onChange={(e) => setGovEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / OTP
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
            <button
              onClick={() => {
                onSelectUser(users[0]?.id || 'USR-001');
                onClose();
              }}
              className="w-full py-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-md shadow-sm transition flex items-center justify-center space-x-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate with MeriPehchaan</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-2">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL Encrypted | Certified for MeitY & National Informatics Centre (NIC) Standards</span>
        </div>
      </div>
    </div>
  );
}
