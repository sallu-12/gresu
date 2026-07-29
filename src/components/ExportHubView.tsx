import React, { useState } from 'react';
import { Download, FileText, Code, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { ResumeData } from '../types';

interface ExportHubViewProps {
  resume: ResumeData;
  onExportPdf: () => void;
}

export const ExportHubView: React.FC<ExportHubViewProps> = ({ resume, onExportPdf }) => {
  const [downloadedTxt, setDownloadedTxt] = useState(false);
  const [downloadedJson, setDownloadedJson] = useState(false);

  const handleDownloadTxt = () => {
    const textContent = `${resume.personalInfo.fullName.toUpperCase()}
${resume.personalInfo.jobTitle}
${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
${resume.personalInfo.linkedin} | ${resume.personalInfo.github}

SUMMARY
${resume.personalInfo.summary}

WORK EXPERIENCE
${resume.experiences
  .map(
    (exp) => `${exp.role} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
${exp.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

SKILLS
${resume.skillCategories.map((c) => `${c.category}: ${c.skills.join(', ')}`).join('\n')}

EDUCATION
${resume.educations.map((e) => `${e.degree} in ${e.field}, ${e.institution}`).join('\n')}
`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();

    setDownloadedTxt(true);
    setTimeout(() => setDownloadedTxt(false), 2000);
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(resume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.fullName.replace(/\s+/g, '_')}_RESUMIX.json`;
    a.click();

    setDownloadedJson(true);
    setTimeout(() => setDownloadedJson(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-400" />
          <span>Export Hub</span>
        </h2>
        <p className="text-xs text-slate-400">
          Generate print-ready ATS high-resolution PDFs, plain text versions, and portable JSON backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PDF Card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">High-Res Vector PDF</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard ATS-compliant printable PDF document format. Perfect for employer portals.
            </p>
          </div>
          <button
            onClick={onExportPdf}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Document</span>
          </button>
        </div>

        {/* TXT Card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Plain Text (.TXT)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unformatted plain text resume for pasting directly into online application text boxes.
            </p>
          </div>
          <button
            onClick={handleDownloadTxt}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {downloadedTxt ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            <span>{downloadedTxt ? 'Downloaded TXT' : 'Download TXT File'}</span>
          </button>
        </div>

        {/* JSON Backup Card */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">RESUMIX JSON Schema</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export full structured JSON backup to import or restore on any device.
            </p>
          </div>
          <button
            onClick={handleDownloadJson}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {downloadedJson ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
            <span>{downloadedJson ? 'Downloaded JSON' : 'Export JSON Backup'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
