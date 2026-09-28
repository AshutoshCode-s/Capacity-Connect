'use client';

import React from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  FileText, 
  Users, 
  SlidersHorizontal,
  Bell,
  ChevronDown,
  Phone,
  Sparkles,
  Zap,
  PlayCircle
} from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenRoleSwitcher: () => void;
  onOpenOtpModal: () => void;
  onLaunchDiagnostic: () => void;
}

export default function MainNavbar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenRoleSwitcher,
  onOpenOtpModal,
  onLaunchDiagnostic
}: Props) {
  const role = currentUser?.role || 'EMPLOYEE';

  return (
    <nav className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="flex items-center justify-center w-11 h-11 bg-slate-900 text-amber-400 rounded-lg border-2 border-amber-500 shadow-sm font-serif font-black text-xl tracking-tighter">
              CC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight">
                  CAPACITY <span className="text-blue-800">CONNECT</span>
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-amber-300 hidden sm:inline-block">
                  Verified Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                Competency-Driven Digital Capacity Building & Skill-Gap Verification Platform
              </p>
            </div>
          </div>

          {/* Quick Actions & Officer Badge */}
          <div className="flex items-center space-x-2.5">
            {/* Launch Diagnostic Button */}
            <button
              onClick={onLaunchDiagnostic}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-lg transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Diagnostic Assessment</span>
            </button>

            {/* OTP Login / Register Button */}
            <button
              onClick={onOpenOtpModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-lg transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-700" />
              <span>OTP Auth / Register</span>
            </button>

            {/* Officer Badge */}
            {currentUser && (
              <div 
                onClick={onOpenRoleSwitcher}
                className="flex items-center space-x-2.5 p-1.5 pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition shadow-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>{currentUser.name.split(',')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-blue-800 font-bold truncate max-w-[130px]">
                    Target: {currentUser.targetRole}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 pt-1 pb-1 overflow-x-auto no-scrollbar text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Learner Cockpit</span>
          </button>

          {/* DEDICATED SKILL GAP & VERIFICATION WORKFLOW TAB */}
          <button
            onClick={() => setActiveTab('skillgap')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition whitespace-nowrap ${
              activeTab === 'skillgap'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'hover:bg-amber-50 hover:text-amber-900 text-amber-900 font-bold bg-amber-50/50 border border-amber-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Skill-Gap & Verification Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition whitespace-nowrap ${
              activeTab === 'resources'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Knowledge Repository</span>
          </button>

          <button
            onClick={() => setActiveTab('supervisor')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition whitespace-nowrap ${
              activeTab === 'supervisor'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Supervisor / Reviewer Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-md transition whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>L&D Admin Portal</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
