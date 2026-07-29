import React, { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Download, Loader2 } from 'lucide-react';
import { ResumeData } from '../types';

interface CoverLetterViewProps {
  resume: ResumeData;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({ resume }) => {
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultCoverLetter = `Dear Hiring Manager at ${companyName},

I am writing to express my strong enthusiasm for the ${jobTitle} position at ${companyName}. With over 8 years of experience designing high-throughput distributed systems and cloud infrastructure, I have demonstrated a consistent track record of driving technical execution, cutting operational latency, and scaling platform reliability.

In my recent role at CloudScale Technologies, I engineered a multi-region event streaming pipeline that handles 3.8 billion daily requests with 99.999% uptime. Furthermore, my work on automated caching engines directly reduced infrastructure costs by $840,000 annually.

I am particularly impressed by ${companyName}'s commitment to technological excellence. My background in Rust, Go, TypeScript, and microservice architectures aligns seamlessly with the requirements of this role.

Thank you for your time and consideration. I look forward to discussing how my experience can contribute to ${companyName}'s continued growth.

Sincerely,
${resume.personalInfo.fullName || 'Alexander Mercer'}
${resume.personalInfo.email} | ${resume.personalInfo.phone}`;

  const [letterText, setLetterText] = useState(defaultCoverLetter);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setLetterText(`Dear Hiring Manager at ${companyName},

I am thrilled to submit my candidate profile for the ${jobTitle} role at ${companyName}. Based on your job description requirements, my background as a ${resume.personalInfo.jobTitle || 'Technology Professional'} provides the exact technical rigor required for this initiative.

Throughout my career, I have prioritized deliverable quality, cross-functional engineering alignment, and measurable system outcomes. At CloudScale Technologies, I led a cross-functional team of 8 engineers to overhaul core processing pipelines, resulting in zero downtime during peak transaction events.

Key highlights I bring to ${companyName} include:
• Expertise in ${resume.skillCategories[0]?.skills.slice(0, 4).join(', ') || 'System Design, Cloud Systems'}
• Demonstrated ability to reduce operational bottlenecks and cut platform costs
• Strong alignment with ${companyName}'s product development roadmap

I welcome the opportunity to discuss my qualifications in greater detail.

Sincerely,
${resume.personalInfo.fullName}
${resume.personalInfo.email} | ${resume.personalInfo.phone}`);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <span>Cover Letter Generator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Generate customized cover letters tailored to your active resume achievements and target company role.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description Notes / Key Requirements (Optional)</label>
          <textarea
            rows={2}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste key responsibilities or required competencies to emphasize..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Generate Tailored Cover Letter</span>
          </button>
        </div>
      </div>

      {/* Output Letter Area */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Generated Document Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <textarea
          rows={14}
          value={letterText}
          onChange={(e) => setLetterText(e.target.value)}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
};
