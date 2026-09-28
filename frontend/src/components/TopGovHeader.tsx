'use client';

import React, { useState } from 'react';
import { Globe, Eye, Volume2, ShieldCheck, Award } from 'lucide-react';

interface Props {
  onOpenLogin: () => void;
  onOpenRoleSwitcher: () => void;
  currentRole: string;
}

export default function TopGovHeader({ onOpenLogin, onOpenRoleSwitcher, currentRole }: Props) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  return (
    <header className="w-full bg-slate-900 text-slate-200 text-xs border-b border-slate-800 select-none">
      {/* Tricolor Bar */}
      <div className="tricolor-stripe w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: National Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-100 tracking-wide uppercase text-[11px]">
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 hidden md:inline">
              Capacity Building Commission (CBC) & DoPT
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Award className="w-3 h-3 mr-1" />
            SIH 2024-26 Official Prototype
          </span>
        </div>

        {/* Right Side: Accessibility & Portal Utilities */}
        <div className="flex items-center space-x-4 text-[11px]">
          {/* Accessibility controls */}
          <div className="hidden lg:flex items-center space-x-2 border-r border-slate-700 pr-3 text-slate-300">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1 hover:text-white ${fontSize === 'normal' ? 'font-bold text-amber-400' : ''}`}
              title="Standard Text Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1 hover:text-white ${fontSize === 'large' ? 'font-bold text-amber-400' : ''}`}
              title="Medium Text Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('larger')}
              className={`px-1 hover:text-white ${fontSize === 'larger' ? 'font-bold text-amber-400' : ''}`}
              title="Large Text Size"
            >
              A+
            </button>
            <span className="mx-1 text-slate-600">|</span>
            <button className="flex items-center space-x-1 hover:text-white">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>Standard Contrast</span>
            </button>
          </div>

          {/* Language selector */}
          <div className="flex items-center space-x-1 text-slate-300">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">English</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">हिन्दी</span>
          </div>

          {/* Quick SSO status */}
          <div className="flex items-center space-x-2 border-l border-slate-700 pl-3">
            <button
              onClick={onOpenRoleSwitcher}
              className="flex items-center space-x-1 px-2 py-0.5 bg-blue-900/60 hover:bg-blue-800 text-blue-200 border border-blue-700 rounded transition"
            >
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span className="font-semibold uppercase tracking-wider">{currentRole}</span>
              <span className="text-[10px] text-blue-300 underline ml-1">Switch</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
