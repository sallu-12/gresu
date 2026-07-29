import React from 'react';
import { Achievement } from '../types';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-950/80 flex flex-col gap-5 max-h-[85vh]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-black text-white font-mono tracking-wide">ACHIEVEMENTS</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
          {achievements.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                item.unlocked
                  ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  item.unlocked ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                }`}
              >
                {item.unlocked ? <CheckCircle2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold font-mono text-sm">{item.title}</h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {item.progress} / {item.maxProgress}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{item.description}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div
                    className="bg-cyan-400 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (item.progress / item.maxProgress) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
