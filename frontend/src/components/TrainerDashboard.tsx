'use client';

import React, { useState, useEffect } from 'react';
import { User, Trainer } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Video, 
  Search, 
  FileText, 
  Upload, 
  Check, 
  X, 
  Film,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  user: User;
  trainers: Trainer[];
  onRefreshData?: () => void;
}

export interface BookedSessionItem {
  id: string;
  trainerId: string;
  trainerName: string;
  userId: string;
  userName: string;
  competency: string;
  date: string;
  time: string;
  status: 'UPCOMING' | 'PENDING' | 'COMPLETED';
  uploadedLecture?: {
    title: string;
    fileName: string;
    resourceType?: string;
    scheduledDate: string;
    scheduledTime: string;
  } | null;
}

export default function TrainerDashboard({
  user,
}: Props) {
  // Booked Sessions State
  const [sessions, setSessions] = useState<BookedSessionItem[]>([
    {
      id: "bs_101",
      trainerId: "TRN-001",
      trainerName: user.name,
      userId: "USR-001",
      userName: "Ashutosh Sharma",
      competency: "Excel",
      date: "2026-09-29",
      time: "10:00 AM - 11:00 AM",
      status: "UPCOMING",
      uploadedLecture: null
    },
    {
      id: "bs_102",
      trainerId: "TRN-001",
      trainerName: user.name,
      userId: "USR-002",
      userName: "Priya Nair",
      competency: "Data Analysis",
      date: "2026-09-30",
      time: "02:00 PM - 03:00 PM",
      status: "PENDING",
      uploadedLecture: null
    },
    {
      id: "bs_103",
      trainerId: "TRN-001",
      trainerName: user.name,
      userId: "USR-003",
      userName: "Rahul Verma",
      competency: "Excel",
      date: "2026-09-27",
      time: "10:00 AM - 11:00 AM",
      status: "COMPLETED",
      uploadedLecture: {
        title: "Excel Formulas & Pivot Foundations",
        fileName: "excel_lecture_01.mp4",
        resourceType: "Lecture Video",
        scheduledDate: "2026-09-27",
        scheduledTime: "10:00 AM"
      }
    }
  ]);
  const [sessionFilter, setSessionFilter] = useState<'ALL' | 'UPCOMING' | 'PENDING' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live Class Room Modal
  const [activeLiveSession, setActiveLiveSession] = useState<BookedSessionItem | null>(null);

  // Upload Resource to Session Modal
  const [sessionToUploadResource, setSessionToUploadResource] = useState<BookedSessionItem | null>(null);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'Lecture Video' | 'Notes & Slides' | 'Practice Dataset'>('Lecture Video');
  const [resourceFileName, setResourceFileName] = useState('');
  const [resourceDate, setResourceDate] = useState('2026-09-29');
  const [resourceTime, setResourceTime] = useState('10:00 AM - 11:00 AM');

  // Load Sessions from API
  useEffect(() => {
    api.getTrainerSessions().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data);
      }
    }).catch(console.error);
  }, []);

  const handleUpdateStatus = async (sessionId: string, newStatus: 'UPCOMING' | 'PENDING' | 'COMPLETED') => {
    try {
      await api.updateSessionStatus(sessionId, newStatus);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAttachResourceToSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToUploadResource) return;

    setSessions(prev => prev.map(s => {
      if (s.id !== sessionToUploadResource.id) return s;
      return {
        ...s,
        uploadedLecture: {
          title: resourceTitle || `${s.competency} Learning Material`,
          fileName: resourceFileName || (resourceType === 'Lecture Video' ? 'recorded_lesson.mp4' : 'resource_material.pdf'),
          resourceType: resourceType,
          scheduledDate: resourceDate,
          scheduledTime: resourceTime
        }
      };
    }));

    setSessionToUploadResource(null);
    setResourceTitle('');
    setResourceFileName('');
  };

  // Metrics
  const upcomingCount = sessions.filter(s => s.status === 'UPCOMING').length;
  const pendingCount = sessions.filter(s => s.status === 'PENDING').length;
  const completedCount = sessions.filter(s => s.status === 'COMPLETED').length;

  // Filtered Sessions
  const filteredSessions = sessions.filter(s => {
    const matchesFilter = sessionFilter === 'ALL' || s.status === sessionFilter;
    const matchesSearch = !searchQuery.trim() || 
      s.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.competency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.date.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Profile Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-8 space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
        
        <div className="space-y-1 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">
            <span className="text-slate-400 font-normal">Title:</span> {user.currentRole || 'Technical Trainer'}
          </p>
          <p className="text-slate-600">
            <span className="text-slate-400 font-normal">Organization:</span> {user.department || 'Capacity Development Institute'}
          </p>
          <p className="text-slate-600">
            <span className="text-slate-400 font-normal">Experience:</span> {user.workExperienceYears || 8} Years
          </p>
        </div>

        {/* Plain Text Stats beside/below trainer profile */}
        <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>Sessions: <strong className="text-slate-900">{sessions.length} Total Booked</strong></span>
          <span>• <strong className="text-blue-700">{upcomingCount} Upcoming</strong></span>
          <span>• <strong className="text-amber-700">{pendingCount} Pending</strong></span>
          <span>• <strong className="text-emerald-700">{completedCount} Completed</strong></span>
        </div>
      </div>

      {/* Main Booked Session Card Container */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 sm:p-7 space-y-6">
        
        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-700" />
              <span>Booked Session</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage learner appointments, live streams, and resource uploads</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search trainee, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
              {(['ALL', 'UPCOMING', 'PENDING', 'COMPLETED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setSessionFilter(f)}
                  className={`px-2.5 py-1 rounded-md font-bold transition text-[11px] ${
                    sessionFilter === f 
                      ? 'bg-blue-700 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Horizontal Session Cards List */}
        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center space-y-2 text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="font-bold text-slate-700">No booked sessions found.</p>
            <p>Learner bookings will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 sm:p-5 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
              >
                {/* Left Side: Trainee Details, Subject, Date & Time */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">{session.userName}</h3>
                    
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                      {session.competency}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      session.status === 'UPCOMING' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                      session.status === 'PENDING' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {session.status === 'UPCOMING' ? '● Upcoming' :
                       session.status === 'PENDING' ? '⏳ Pending' : '✓ Completed'}
                    </span>
                  </div>

                  {/* Date & Time display */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-700">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">Date:</span>
                      <strong className="font-mono text-slate-900">{session.date}</strong>
                    </div>

                    <div className="flex items-center space-x-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-400">Time:</span>
                      <strong className="font-mono text-slate-900">{session.time}</strong>
                    </div>
                  </div>

                  {/* Uploaded Resource badge if attached */}
                  {session.uploadedLecture && (
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs text-blue-900">
                      <FileText className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" />
                      <div className="text-[11px]">
                        <span className="font-bold">{session.uploadedLecture.title}</span>
                        <span className="text-slate-400 ml-1.5 font-mono">({session.uploadedLecture.fileName})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Horizontal Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Option 1: Start Live Session */}
                  {session.status !== 'COMPLETED' && (
                    <button
                      onClick={() => setActiveLiveSession(session)}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition flex items-center space-x-1.5 shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Start Live Session</span>
                    </button>
                  )}

                  {/* Option 2: Upload Resource */}
                  <button
                    onClick={() => {
                      setSessionToUploadResource(session);
                      setResourceTitle(`${session.competency} Learning Material`);
                      setResourceDate(session.date);
                      setResourceTime(session.time);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold rounded-lg transition flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-700" />
                    <span>Upload Resource</span>
                  </button>

                  {/* Option 3: Mark Complete */}
                  {session.status !== 'COMPLETED' ? (
                    <button
                      onClick={() => handleUpdateStatus(session.id, 'COMPLETED')}
                      className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-lg transition flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mark Complete</span>
                    </button>
                  ) : (
                    <span className="px-3 py-2 bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-lg text-xs flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Completed</span>
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* UPLOAD RESOURCE MODAL */}
      {sessionToUploadResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden my-6 flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Upload Resource for {sessionToUploadResource.userName}</h3>
                <p className="text-xs text-slate-500">Subject: {sessionToUploadResource.competency}</p>
              </div>
              <button onClick={() => setSessionToUploadResource(null)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAttachResourceToSession} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="e.g. Masterclass Lecture & Practice Dataset"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resource Type *</label>
                  <select
                    value={resourceType}
                    onChange={(e: any) => setResourceType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 bg-white"
                  >
                    <option value="Lecture Video">Lecture Video (MP4)</option>
                    <option value="Notes & Slides">Notes & Slides (PDF)</option>
                    <option value="Practice Dataset">Practice Dataset (CSV/XLSX)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={resourceDate}
                    onChange={(e) => setResourceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheduled Time *</label>
                <input
                  type="text"
                  required
                  value={resourceTime}
                  onChange={(e) => setResourceTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-semibold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Attach Resource File *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center space-y-2 bg-slate-50/50">
                  <Upload className="w-5 h-5 text-blue-700 mx-auto" />
                  <p className="text-slate-600 font-semibold text-xs">
                    {resourceFileName ? `Attached: ${resourceFileName}` : 'Select Video, PDF, or Dataset file'}
                  </p>
                  <label className="inline-block px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 text-[11px] cursor-pointer shadow-xs">
                    Browse File
                    <input 
                      type="file" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setResourceFileName(e.target.files[0].name);
                        }
                      }} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSessionToUploadResource(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-xs"
                >
                  Upload & Attach Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE LIVE CLASS ROOM MODAL PREVIEW */}
      {activeLiveSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-800 overflow-hidden my-6 flex flex-col">
            
            {/* Live Room Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
                <div>
                  <h3 className="font-bold text-sm text-white">Live Session: {activeLiveSession.competency}</h3>
                  <p className="text-[11px] text-slate-400">Learner: {activeLiveSession.userName} • Date: {activeLiveSession.date} ({activeLiveSession.time})</p>
                </div>
              </div>

              <button onClick={() => setActiveLiveSession(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Stream Simulation */}
            <div className="p-6 space-y-4">
              <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
                  <Video className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-white">Live Online Session Active</p>
                  <p className="text-xs text-slate-400">Interactive live whiteboard and audio/video streaming enabled</p>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-900/80 px-3 py-1 rounded-md text-[11px] font-mono border border-slate-800">
                  {user.name} (Trainer)
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-900/80 px-3 py-1 rounded-md text-[11px] font-mono border border-slate-800">
                  {activeLiveSession.userName} (Trainee)
                </div>
              </div>

              {/* Quick Live Controls */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                    Elapsed: 12:40
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Connected (Online)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      handleUpdateStatus(activeLiveSession.id, 'COMPLETED');
                      setActiveLiveSession(null);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition"
                  >
                    End & Mark Complete
                  </button>
                  <button
                    onClick={() => setActiveLiveSession(null)}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition"
                  >
                    Leave Room
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
