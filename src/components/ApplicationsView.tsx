import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, DollarSign, Building2, MapPin } from 'lucide-react';
import { JobApplication } from '../types';

export const ApplicationsView: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: 'app-1',
      company: 'Stripe',
      position: 'Senior Systems Engineer',
      location: 'San Francisco, CA (Remote)',
      stage: 'Interviewing',
      appliedDate: '2026-07-24',
      salary: '$210,000 - $240,000',
      notes: 'Passed initial recruiter screening. Technical architecture call scheduled.',
    },
    {
      id: 'app-2',
      company: 'Linear Labs',
      position: 'Staff Platform Architect',
      location: 'San Francisco, CA',
      stage: 'Applied',
      appliedDate: '2026-07-26',
      salary: '$230,000',
      notes: 'Submitted tailored resume and custom cover letter.',
    },
    {
      id: 'app-3',
      company: 'Acme Software',
      position: 'Distributed Systems Lead',
      location: 'Seattle, WA',
      stage: 'Offer',
      appliedDate: '2026-07-15',
      salary: '$225,000 + equity',
      notes: 'Written offer letter received. Reviewing compensation package.',
    },
  ]);

  const [companyInput, setCompanyInput] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [salaryInput, setSalaryInput] = useState('');

  const handleAddApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyInput || !positionInput) return;

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      company: companyInput,
      position: positionInput,
      location: locationInput || 'Remote / Unspecified',
      stage: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      salary: salaryInput,
      notes: 'Application created.',
    };

    setApplications([newApp, ...applications]);
    setCompanyInput('');
    setPositionInput('');
    setLocationInput('');
    setSalaryInput('');
  };

  const handleRemove = (id: string) => {
    setApplications(applications.filter((a) => a.id !== id));
  };

  const handleStageChange = (id: string, stage: JobApplication['stage']) => {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, stage } : a))
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span>Application Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track every application, interview stage, compensation offer, and preparation note from one workspace.
          </p>
        </div>
      </div>

      {/* Add New Application Form */}
      <form onSubmit={handleAddApp} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Log New Application
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Company Name (e.g. Stripe)"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Position Title (e.g. Senior Engineer)"
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Location (e.g. San Francisco, Remote)"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Target Salary / Range (Optional)"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </form>

      {/* Applications List Table */}
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-white">{app.company}</h3>
                  <span className="text-slate-400 text-xs">— {app.position}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" /> {app.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" /> Applied: {app.appliedDate}
                  </span>
                  {app.salary && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      <DollarSign className="w-3 h-3 text-emerald-500" /> {app.salary}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={app.stage}
                  onChange={(e) => handleStageChange(app.id, e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer Received</option>
                  <option value="Archived">Archived</option>
                </select>

                <button
                  onClick={() => handleRemove(app.id)}
                  className="p-1.5 rounded bg-slate-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                  title="Delete Application"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {app.notes && (
              <p className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-slate-300">Notes:</strong> {app.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
