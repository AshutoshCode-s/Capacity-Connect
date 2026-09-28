'use client';

import React from 'react';
import { User } from '../types';
import { ShieldCheck, UserCheck, CheckCircle2, X, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUserId: string;
  onSelectUser: (userId: string) => void;
}

export default function RoleSwitcherModal({
  isOpen,
  onClose,
  users,
  currentUserId,
  onSelectUser,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-500/40 text-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Role & Persona Switcher (RBAC)</h3>
              <p className="text-xs text-slate-300">
                Experience the portal through various Civil Service & Governance personas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Personas List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {users.map((user) => {
            const isCurrent = user.id === currentUserId;
            const roleBadge = 
              user.role === 'EMPLOYEE' ? { label: 'Learner / Civil Servant', color: 'bg-blue-100 text-blue-800 border-blue-200' } :
              user.role === 'SUPERVISOR' ? { label: 'Manager / Supervisor', color: 'bg-amber-100 text-amber-800 border-amber-200' } :
              { label: 'L&D Training Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' };

            return (
              <div
                key={user.id}
                onClick={() => {
                  onSelectUser(user.id);
                  onClose();
                }}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-300"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900">{user.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{user.designation}</p>
                    <p className="text-[11px] text-slate-400">{user.department}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {isCurrent ? (
                    <span className="flex items-center text-xs font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-blue-600" />
                      Active
                    </span>
                  ) : (
                    <button className="flex items-center text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md border border-slate-300">
                      <span>Switch</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-xs text-slate-500">
          Role-Based Access Control (RBAC) securely filters competencies, catalog actions, approval workflows, and administrative features.
        </div>
      </div>
    </div>
  );
}
