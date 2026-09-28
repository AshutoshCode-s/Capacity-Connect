'use client';

import React, { useState } from 'react';
import { Course, Competency } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  ChevronRight,
  Send,
  Building,
  Info
} from 'lucide-react';

interface Props {
  courses: Course[];
  competencies: Competency[];
  onOpenCourse: (courseId: string) => void;
  onEnrollCourse: (courseId: string) => void;
  onOpenNominationModal: (course: Course) => void;
}

export default function CourseCatalogView({
  courses,
  competencies,
  onOpenCourse,
  onEnrollCourse,
  onOpenNominationModal,
}: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'DOMAIN' | 'FUNCTIONAL' | 'BEHAVIORAL'>('ALL');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState<Course | null>(null);

  const filteredCourses = courses.filter((c) => {
    if (selectedCategory !== 'ALL' && c.category !== selectedCategory) return false;
    if (mandatoryOnly && !c.mandatory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        c.title.toLowerCase().includes(q) ||
        c.primaryCompetency.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-800 text-white rounded-xl shadow-sm">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">National Course & Capacity Hub</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Accredited e-Learning modules aligned with iGOT & CBC National Training Standards
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-600">
          <span className="font-bold text-slate-900">{filteredCourses.length}</span> Courses Available
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by course title, competency (e.g. GeM, GFR, Cyber), department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-800"
            />
          </div>

          {/* Mandatory Checkbox Filter */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 border rounded-lg hover:bg-slate-100 whitespace-nowrap">
            <input
              type="checkbox"
              checked={mandatoryOnly}
              onChange={(e) => setMandatoryOnly(e.target.checked)}
              className="rounded text-blue-800 focus:ring-blue-500"
            />
            <span>Mandatory Annual Modules Only</span>
          </label>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-md font-bold transition whitespace-nowrap ${
              selectedCategory === 'ALL'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Disciplines
          </button>
          <button
            onClick={() => setSelectedCategory('DOMAIN')}
            className={`px-3 py-1.5 rounded-md font-bold transition whitespace-nowrap ${
              selectedCategory === 'DOMAIN'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Domain (Governance & Finance)
          </button>
          <button
            onClick={() => setSelectedCategory('FUNCTIONAL')}
            className={`px-3 py-1.5 rounded-md font-bold transition whitespace-nowrap ${
              selectedCategory === 'FUNCTIONAL'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Functional (Appraisal & Policy)
          </button>
          <button
            onClick={() => setSelectedCategory('BEHAVIORAL')}
            className={`px-3 py-1.5 rounded-md font-bold transition whitespace-nowrap ${
              selectedCategory === 'BEHAVIORAL'
                ? 'bg-blue-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Behavioral (Ethics & Leadership)
          </button>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = course.isEnrolled;
          const isCompleted = course.userStatus === 'COMPLETED';

          return (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-gov border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Course Image & Badges */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {course.mandatory && (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded shadow-xs uppercase">
                        Mandatory
                      </span>
                    )}
                    <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700">
                      {course.code}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="flex items-center text-[11px] text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      {course.rating} ({course.enrolledCount.toLocaleString()} officers)
                    </span>
                    <span className="text-[11px] text-slate-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.duration}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{course.department}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {course.tagline}
                  </p>

                  {/* Primary Competency Mapping Pill */}
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-md p-2 text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-blue-800 font-bold block">
                      Target Competency:
                    </span>
                    <span className="font-semibold text-slate-800 text-[11px] line-clamp-1">
                      {course.primaryCompetency} ({course.level})
                    </span>
                  </div>

                  {/* Enrolled Progress Bar */}
                  {isEnrolled && (
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-600">Progress</span>
                        <span className="text-blue-700">{course.userProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-blue-700'}`}
                          style={{ width: `${course.userProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCourseForSyllabus(course)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition flex items-center"
                >
                  <Info className="w-3.5 h-3.5 mr-1" />
                  Syllabus
                </button>

                {isCompleted ? (
                  <button
                    onClick={() => onOpenCourse(course.id)}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Review & Cert
                  </button>
                ) : isEnrolled ? (
                  <button
                    onClick={() => onOpenCourse(course.id)}
                    className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center"
                  >
                    <Play className="w-3 h-3 fill-current mr-1" />
                    Continue
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onOpenNominationModal(course)}
                      className="px-2.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition"
                      title="Nominate for Classroom Training"
                    >
                      Nominate
                    </button>
                    <button
                      onClick={() => onEnrollCourse(course.id)}
                      className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition"
                    >
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus Modal / Drawer */}
      {selectedCourseForSyllabus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600/40 text-blue-200 border border-blue-500/50 uppercase">
                  {selectedCourseForSyllabus.code}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedCourseForSyllabus.title}</h3>
                <p className="text-xs text-slate-300">Offered by {selectedCourseForSyllabus.department}</p>
              </div>
              <button
                onClick={() => setSelectedCourseForSyllabus(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Course Overview
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCourseForSyllabus.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Curriculum & Modules ({selectedCourseForSyllabus.curriculum.length} Modules)
                </h4>
                <div className="space-y-2">
                  {selectedCourseForSyllabus.curriculum.map((mod, idx) => (
                    <div key={mod.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{mod.title}</span>
                        <span className="text-slate-500 text-[11px] font-normal">{mod.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">{mod.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Instructor: {selectedCourseForSyllabus.instructor}</span>
              <button
                onClick={() => {
                  onOpenCourse(selectedCourseForSyllabus.id);
                  setSelectedCourseForSyllabus(null);
                }}
                className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Launch Course Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
