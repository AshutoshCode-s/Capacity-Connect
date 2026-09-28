'use client';

import React from 'react';
import { User } from '../types';
import { LogOut, ShieldCheck } from 'lucide-react';

interface Props {
  user: User | null;
  onLogout: () => void;
  onOpenAdminLogin?: () => void;
}

export default function SimpleNavbar({ user, onLogout, onOpenAdminLogin }: Props) {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Top-Left Admin Login Button */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
            CC
          </div>
          <span className="font-extrabold text-xl text-slate-900 tracking-tight">
            CAPACITY <span className="text-blue-700">CONNECT</span>
          </span>

          {/* Top Left Admin Login Button (Available when not logged in or to switch) */}
          {!user && onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="ml-3 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-850 border border-purple-300 font-bold text-xs rounded-lg transition flex items-center space-x-1.5 shadow-2xs cursor-pointer"
              title="Access Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Admin Login</span>
            </button>
          )}
        </div>

        {/* User Status / Logout */}
        {user ? (
          <div className="flex items-center space-x-4 text-xs">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-slate-900 text-sm flex items-center justify-end space-x-1">
                {user.accountType === 'ADMIN' && (
                  <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded font-mono text-[10px] mr-1 border border-purple-200">
                    ADMIN
                  </span>
                )}
                <span>{user.name}</span>
              </span>
              <span className="text-slate-500 font-medium">
                {user.accountType === 'ADMIN' ? 'Central Capacity Administrator' : user.targetRole}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        ) : null}

      </div>
    </header>
  );
}
