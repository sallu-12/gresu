import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Briefcase,
  Calendar,
  Bookmark,
  Download,
  Sparkles,
  Clock,
  History,
  HardDrive,
  Plus,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { ResumeData } from '../types';

interface DashboardViewProps {
  resume: ResumeData;
  resumesList: ResumeData[];
  onSelectResume: (res: ResumeData) => void;
  onCreateNewResume: () => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  resume,
  resumesList,
  onSelectResume,
  onCreateNewResume,
  onNavigateTab,
}) => {
  // Widget 1 & 2: Completion calculation
  const calcCompletion = (res: ResumeData) => {
    let score = 0;
    if (res.personalInfo.fullName) score += 15;
    if (res.personalInfo.summary) score += 20;
    if (res.experiences.length > 0) score += 25;
    if (res.educations.length > 0) score += 15;
    if (res.skillCategories.length > 0) score += 15;
    if (res.projects.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const currentCompletion = calcCompletion(resume);

  // Widget 3: Applications Submitted
  const [applications, setApplications] = useState([
    { id: 'app-1', company: 'Acme Corp', position: 'Senior Engineer', date: '2026-07-28', stage: 'Interviewing' },
    { id: 'app-2', company: 'Linear Labs', position: 'Distributed Systems Lead', date: '2026-07-26', stage: 'Applied' },
    { id: 'app-3', company: 'Stripe', position: 'Staff Software Architect', date: '2026-07-20', stage: 'Screening' },
  ]);

  // Widget 4: Upcoming Interviews
  const interviews = [
    { id: 'int-1', company: 'Acme Corp', role: 'Technical Architecture Round', date: 'Tomorrow at 10:00 AM PST' },
    { id: 'int-2', company: 'Stripe', role: 'Recruiter Screening', date: 'Friday at 2:30 PM PST' },
  ];

  // Widget 5: Saved Job Descriptions
  const [savedJobs, setSavedJobs] = useState([
    { id: 'job-1', title: 'Senior Software Engineer', company: 'Vanguard Systems', date: 'Saved 2 days ago' },
    { id: 'job-2', title: 'Lead Platform Architect', company: 'Horizon Cloud', date: 'Saved yesterday' },
  ]);

  // Widget 6: Recent Exports
  const recentExports = [
    { id: 'exp-1', name: 'Alexander_Mercer_Resume_v2.4.pdf', format: 'PDF', date: '2 hours ago' },
    { id: 'exp-2', name: 'Alexander_Mercer_Plain_Text.txt', format: 'TXT', date: 'Yesterday' },
  ];

  // Widget 7: Recent AI Suggestions
  const aiSuggestions = [
    { id: 'sug-1', section: 'Work Experience', tip: 'Add quantifiable performance metrics (% latency, $ savings) to your top bullet point.' },
    { id: 'sug-2', section: 'Skills Inventory', tip: 'Include 3 missing job description keywords: Kubernetes, Terraform, gRPC.' },
  ];

  // Widget 8: Activity Timeline
  const activityLogs = [
    { id: 'act-1', text: 'Updated work experience for CloudScale Technologies', time: '10 mins ago' },
    { id: 'act-2', text: 'Ran Job Match analysis against Senior Engineer role', time: '1 hour ago' },
    { id: 'act-3', text: 'Exported high-resolution PDF document', time: '2 hours ago' },
  ];

  // Widget 9: Resume Versions
  const versions = resumesList;

  // Widget 10: Storage Usage
  const storageUsedMB = 2.4;
  const storageTotalMB = 100;
  const storagePercent = Math.round((storageUsedMB / storageTotalMB) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Workspace Dashboard</h2>
          <p className="text-xs text-slate-400">Overview of resume drafts, application pipelines, and AI optimizations</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateNewResume}
            className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>

      {/* Top 3 Core Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Widget 2: Resume Completion */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Resume Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{currentCompletion}%</span>
            <span className="text-xs text-slate-400">({resume.title})</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${currentCompletion}%` }} />
          </div>
        </div>

        {/* Widget 3: Applications Submitted */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Applications Tracked</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{applications.length}</span>
            <span className="text-xs text-emerald-400">1 Active Interview</span>
          </div>
          <p className="text-[11px] text-slate-400">Tracked in Applications pipeline</p>
        </div>

        {/* Widget 10: Storage Usage */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Workspace Storage</span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{storageUsedMB} MB</span>
            <span className="text-xs text-slate-400">/ {storageTotalMB} MB ({storagePercent}%)</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: `${storagePercent}%` }} />
          </div>
        </div>
      </div>

      {/* Grid Layout of Productivity Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Widget 1: Recent Resumes */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Recent Resumes</span>
              </h3>
              <button
                onClick={() => onNavigateTab('resumes')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {resumesList.map((res) => (
                <div
                  key={res.id}
                  onClick={() => onSelectResume(res)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    res.id === resume.id
                      ? 'bg-slate-800/80 border-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-white">{res.title}</span>
                      {res.version && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {res.version}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{res.personalInfo.jobTitle || 'No role set'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">Score: {calcCompletion(res)}%</span>
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: Applications Pipeline Overview */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Applications Submitted</span>
              </h3>
              <button
                onClick={() => onNavigateTab('applications')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Open Application Tracker</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {applications.map((app) => (
                <div key={app.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{app.company}</span>
                    <span className="text-slate-400 ml-2">— {app.position}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{app.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {app.stage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 7: Recent AI Suggestions */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Recent AI Suggestions</span>
            </h3>

            <div className="space-y-2">
              {aiSuggestions.map((sug) => (
                <div key={sug.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-indigo-300">{sug.section}</span>
                    <button
                      onClick={() => onNavigateTab('resumes')}
                      className="text-[10px] text-slate-400 hover:text-white underline"
                    >
                      Apply Fix
                    </button>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{sug.tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 4: Upcoming Interviews */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Interviews</span>
            </h3>

            <div className="space-y-2">
              {interviews.map((item) => (
                <div key={item.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                  <p className="font-semibold text-white">{item.company}</p>
                  <p className="text-slate-400">{item.role}</p>
                  <p className="text-[10px] text-indigo-300">{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 5: Saved Job Descriptions */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-indigo-400" />
                <span>Saved Job Descriptions</span>
              </h3>
            </div>

            <div className="space-y-2">
              {savedJobs.map((job) => (
                <div key={job.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{job.title}</p>
                    <p className="text-[10px] text-slate-400">{job.company}</p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('job-match')}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700"
                  >
                    Match
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 6: Recent Exports */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Recent Exports</span>
            </h3>

            <div className="space-y-2">
              {recentExports.map((exp) => (
                <div key={exp.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
                  <div className="truncate mr-2">
                    <p className="font-medium text-slate-200 truncate">{exp.name}</p>
                    <p className="text-[10px] text-slate-500">{exp.date}</p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    {exp.format}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 8: Activity Timeline */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Activity Timeline</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-slate-300">{log.text}</p>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
