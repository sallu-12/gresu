import React from 'react';
import {
  Layers,
  Download,
  CheckCircle2,
  FileText,
  User,
  Sliders,
} from 'lucide-react';

interface HeaderNavbarProps {
  onOpenTemplates: () => void;
  onOpenDesignStudio: () => void;
  onExport: () => void;
  activeTemplateName: string;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenTemplates,
  onOpenDesignStudio,
  onExport,
  activeTemplateName,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
      {/* Platform Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-100 font-bold">
          <FileText className="w-4 h-4 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold text-white tracking-tight">
              RESUMIX
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/80">
              Resume Intelligence
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Active Template: <strong className="text-slate-200 font-medium">{activeTemplateName}</strong></span>
          </p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenTemplates}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenDesignStudio}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span>Design Controls</span>
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Resume</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold cursor-pointer hover:border-slate-600 transition-colors">
          <User className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
