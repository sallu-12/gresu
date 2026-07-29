import React, { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, Code } from 'lucide-react';
import { ResumeData } from '../types';

interface PortfolioGeneratorViewProps {
  resume: ResumeData;
}

export const PortfolioGeneratorView: React.FC<PortfolioGeneratorViewProps> = ({ resume }) => {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'slate' | 'dark' | 'minimal'>('slate');

  const portfolioUrl = `https://${(resume.personalInfo.fullName || 'alex-mercer').toLowerCase().replace(/\s+/g, '-')}.resumix.site`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <span>Personal Portfolio Builder</span>
          </h2>
          <p className="text-xs text-slate-400">
            Automatically compile your resume structure into an interactive web portfolio with custom domain publishing.
          </p>
        </div>
      </div>

      {/* Domain & Deployment Controls */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Live Public Portfolio URL</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono font-bold text-indigo-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                {portfolioUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                title="Copy Portfolio Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(portfolioUrl, '_blank')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Live Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Web Portfolio Live Preview Card */}
      <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-8 shadow-2xl">
        {/* Hero Section */}
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 text-indigo-400 border border-slate-800">
            {resume.personalInfo.jobTitle || 'Senior Technology Professional'}
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {resume.personalInfo.fullName}
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {resume.personalInfo.summary}
          </p>
        </div>

        {/* Skills Pills */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Core Tech Stack</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {resume.skillCategories.flatMap((c) => c.skills).map((sk, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-xs font-medium">
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-4 max-w-3xl mx-auto pt-4 border-t border-slate-900">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Featured Experience</h3>
          <div className="space-y-3">
            {resume.experiences.map((exp) => (
              <div key={exp.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-sm text-white">{exp.role}</h4>
                  <span className="text-[10px] text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                <p className="text-xs text-slate-300 pt-1">{exp.bullets[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
