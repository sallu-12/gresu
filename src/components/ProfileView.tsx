import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import { ResumeData } from '../types';

interface ProfileViewProps {
  resume: ResumeData;
  onUpdateResume: (updated: ResumeData) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ resume, onUpdateResume }) => {
  const info = resume.personalInfo;

  const handleUpdate = (field: string, val: string) => {
    onUpdateResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: val,
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>Candidate Master Profile</span>
        </h2>
        <p className="text-xs text-slate-400">
          Global candidate credentials used across all resume versions, cover letters, and job match evaluations.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={info.fullName}
              onChange={(e) => handleUpdate('fullName', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Job Title / Specialty</label>
            <input
              type="text"
              value={info.jobTitle}
              onChange={(e) => handleUpdate('jobTitle', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="text"
              value={info.email}
              onChange={(e) => handleUpdate('email', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
            <input
              type="text"
              value={info.phone}
              onChange={(e) => handleUpdate('phone', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
            <input
              type="text"
              value={info.location}
              onChange={(e) => handleUpdate('location', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
            <input
              type="text"
              value={info.linkedin}
              onChange={(e) => handleUpdate('linkedin', e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Career Overview & Value Proposition</label>
          <textarea
            rows={4}
            value={info.summary}
            onChange={(e) => handleUpdate('summary', e.target.value)}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
