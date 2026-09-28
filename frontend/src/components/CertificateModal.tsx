'use client';

import React from 'react';
import { Certificate } from '../types';
import { Award, Printer, X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

export default function CertificateModal({ isOpen, onClose, certificate }: Props) {
  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-300 overflow-hidden my-6">
        
        {/* Modal Action Header */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Certificate of Completion</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold rounded flex items-center space-x-1 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-white relative text-center border-4 border-slate-200 m-4 rounded-lg">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="text-xl font-bold text-slate-900 tracking-wider">
              CAPACITY CONNECT
            </div>
            <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              Skill Verification Certificate
            </div>
          </div>

          <div className="w-20 h-1 bg-blue-700 mx-auto my-4 rounded-full"></div>

          {/* Certificate Title */}
          <div className="my-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-wide">
              Certificate of Completion
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">
              This is to certify that
            </p>
          </div>

          {/* Recipient Name */}
          <div className="my-4">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 border-b-2 border-slate-300 inline-block px-8 pb-1">
              {certificate.userName}
            </div>
            <p className="text-xs text-slate-600 font-medium mt-2">
              has successfully completed the evaluation for
            </p>
          </div>

          {/* Course & Accredited Competency */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 my-6 max-w-xl mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {certificate.courseTitle}
            </h3>
            <div className="mt-2 flex items-center justify-center space-x-2 text-xs">
              <span className="text-slate-600">Verified Skill:</span>
              <span className="font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-200">
                {certificate.competencyAccredited}
              </span>
            </div>
            <div className="text-xs text-emerald-800 font-bold mt-1.5">
              Grade: {certificate.grade}
            </div>
          </div>

          {/* Signatures & ID Footer */}
          <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-2 items-end gap-4 text-xs">
            <div className="text-left space-y-1">
              <div className="text-[10px] font-mono text-slate-500">
                Certificate ID: {certificate.id}
              </div>
              <div className="text-[10px] text-slate-400">
                Date: {certificate.issueDate}
              </div>
            </div>

            <div className="text-right space-y-0.5">
              <div className="font-bold text-slate-800 text-sm">
                {certificate.signatoryName}
              </div>
              <div className="text-[10px] text-slate-500">
                {certificate.signatoryTitle}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            Verified Credential
          </span>
          <span className="font-mono text-[11px]">{certificate.qrCodeString}</span>
        </div>
      </div>
    </div>
  );
}
