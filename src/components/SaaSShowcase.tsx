import React from 'react';
import {
  FileText,
  Upload,
  ShieldCheck,
  Target,
  Mail,
  Briefcase,
  Globe,
  History,
  ArrowRight,
} from 'lucide-react';

interface SaaSShowcaseProps {
  onCreateResume: () => void;
  onImportResume: () => void;
  onNavigateTab: (tab: any) => void;
}

export const SaaSShowcase: React.FC<SaaSShowcaseProps> = ({
  onCreateResume,
  onImportResume,
  onNavigateTab,
}) => {
  const features = [
    {
      id: 'resumes',
      title: 'Resume Builder',
      description: 'Create and customize professional resumes using modern templates designed for recruiters and ATS systems.',
      icon: FileText,
    },
    {
      id: 'import',
      title: 'Resume Import',
      description: 'Import PDF or DOCX resumes and automatically extract structured information.',
      icon: Upload,
    },
    {
      id: 'job-match',
      title: 'ATS Analysis',
      description: 'Analyze formatting, keyword coverage, readability, and recruiter compatibility.',
      icon: ShieldCheck,
    },
    {
      id: 'job-match',
      title: 'Job Match',
      description: 'Compare your resume against any job description and identify missing skills and keywords.',
      icon: Target,
    },
    {
      id: 'cover-letters',
      title: 'Cover Letter Generator',
      description: 'Generate tailored cover letters using your resume and target job description.',
      icon: Mail,
    },
    {
      id: 'applications',
      title: 'Application Tracker',
      description: 'Track every application, interview, and offer from one dashboard.',
      icon: Briefcase,
    },
    {
      id: 'portfolio',
      title: 'Portfolio Builder',
      description: 'Generate a personal portfolio website directly from your resume.',
      icon: Globe,
    },
    {
      id: 'dashboard',
      title: 'Version History',
      description: 'Maintain multiple resume versions for different industries and job roles.',
      icon: History,
    },
  ];

  return (
    <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto border-b border-slate-800/80">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
          Build Professional Resumes That Get Interviews
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Create ATS-friendly resumes, tailor them for every job description, generate cover letters with AI, and manage every application from one professional workspace.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreateResume}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm flex items-center gap-2 transition-colors"
          >
            <span>Create Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onImportResume}
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors"
          >
            <span>Import Existing Resume</span>
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(feat.id)}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-white group-hover:text-indigo-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 group-hover:text-indigo-400 transition-colors pt-1">
                <span>Access Feature</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
