'use client';

import React, { useState } from 'react';
import { ResourceItem } from '../types';
import { 
  FileText, 
  Search, 
  Download, 
  Building, 
  CheckCircle2, 
  Tag, 
  ExternalLink,
  BookOpen,
  Filter
} from 'lucide-react';

interface Props {
  resources: ResourceItem[];
  onDownloadResource: (id: string) => Promise<void>;
}

export default function ResourceLibraryView({ resources, onDownloadResource }: Props) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const categories = ['ALL', 'Gazette & Guidelines', 'Standard Operating Procedure (SOP)', 'Official Manual & Templates', 'Safety & Compliance Toolkit', 'Vigilance Case Studies'];

  const filtered = resources.filter((res) => {
    if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.summary.toLowerCase().includes(q) ||
        res.competencyTag.toLowerCase().includes(q) ||
        res.department.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleDownload = async (item: ResourceItem) => {
    setDownloadingId(item.id);
    try {
      await onDownloadResource(item.id);
      // Simulate file download
      const element = document.createElement('a');
      const file = new Blob([
        `OFFICIAL GOVERNMENT OF INDIA RESOURCE\n\nTitle: ${item.title}\nDepartment: ${item.department}\nCompetency: ${item.competencyTag}\nPublished: ${item.publishedDate}\n\nSummary:\n${item.summary}\n\n[Verified by Capacity Connect Repository]`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${item.title.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}_Official_Doc.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setDownloadingId(null), 800);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-800 text-white rounded-xl shadow-sm">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">National Knowledge & Resource Repository</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Official circulars, Standard Operating Procedures (SOPs), Cabinet Note templates & statutory compendiums
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border">
          <span>{resources.length} Official Documents</span>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white rounded-xl shadow-gov border border-slate-200 p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search circulars by title, competency tag, GFR rule, or Ministry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-800"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Document Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-gov border border-slate-200 p-5 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {item.category}
                </span>
                <span className="text-[11px] font-medium text-slate-400">{item.format}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px]">
                <span className="flex items-center text-slate-500">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {item.department}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center text-slate-500 font-medium">
                  <Tag className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {item.competencyTag}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {item.downloadCount.toLocaleString()} downloads • {item.publishedDate}
              </span>

              <button
                onClick={() => handleDownload(item)}
                disabled={downloadingId === item.id}
                className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold rounded-md shadow-xs transition flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadingId === item.id ? 'Downloading...' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
