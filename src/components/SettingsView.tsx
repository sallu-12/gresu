import React from 'react';
import { Settings, Shield, HardDrive, Key, UserCheck, Bell } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Workspace Settings</span>
        </h2>
        <p className="text-xs text-slate-400">
          Manage cloud persistence, export defaults, privacy preferences, and API security.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span>Cloud Sync & Data Persistence</span>
          </h3>
          <p className="text-xs text-slate-400">
            Resumix auto-saves all modifications to cloud storage. Local drafts are synchronized in real-time.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-slate-200 font-medium">Cloud Connection Status: Active</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Privacy & Recruiter Visibility</span>
          </h3>
          <p className="text-xs text-slate-400">
            Control whether your exported PDF links and public portfolio are search-engine indexable.
          </p>
          <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer pt-1">
            <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0" />
            <span>Enable private password protection for published portfolios</span>
          </label>
        </div>
      </div>
    </div>
  );
};
