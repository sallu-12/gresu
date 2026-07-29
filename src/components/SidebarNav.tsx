import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Upload,
  Mail,
  Target,
  Briefcase,
  Globe,
  Settings,
  User,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarNavProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resumes', label: 'Resumes', icon: FileText },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'cover-letters', label: 'Cover Letters', icon: Mail },
    { id: 'job-match', label: 'Job Match', icon: Target },
    { id: 'applications', label: 'Applications', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'export', label: 'Export', icon: Download },
  ];

  return (
    <aside
      className={`sticky top-16 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation List */}
      <div className="p-3 overflow-y-auto space-y-1">
        <div className="flex items-center justify-between px-2 py-1.5 mb-2">
          {!isCollapsed && (
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Workspace
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile Status */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-slate-800/40 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">Cloud Sync Active</p>
              <p className="text-[10px] text-slate-400">All changes saved</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
