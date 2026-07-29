import React, { useState } from 'react';
import { HighScoreRecord, GameMode } from '../types';
import { X, Trophy, Medal } from 'lucide-react';

interface LeaderboardModalProps {
  scores: HighScoreRecord[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ scores, onClose }) => {
  const [activeTab, setActiveTab] = useState<GameMode>('runner');

  const filteredScores = scores
    .filter(s => s.gameMode === activeTab)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full shadow-2xl shadow-cyan-950/80 flex flex-col gap-5 max-h-[85vh]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-black text-white font-mono tracking-wide">HIGH SCORES</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {(['runner', 'combat', 'sphere'] as GameMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setActiveTab(mode)}
              className={`flex-1 py-2 text-xs font-mono uppercase font-bold rounded-xl transition-all ${
                activeTab === mode
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'runner' ? 'Cyber Runner' : mode === 'combat' ? 'Orbital Combat' : 'Gravity Sphere'}
            </button>
          ))}
        </div>

        {/* Scores List */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
          {filteredScores.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              NO HIGH SCORES YET. PLAY A GAME TO SET A RECORD!
            </div>
          ) : (
            filteredScores.map((record, index) => (
              <div
                key={record.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black font-mono text-sm bg-slate-900 text-slate-300 border border-slate-800">
                    {index === 0 ? (
                      <Medal className="w-5 h-5 text-amber-400" />
                    ) : index === 1 ? (
                      <Medal className="w-5 h-5 text-slate-300" />
                    ) : index === 2 ? (
                      <Medal className="w-5 h-5 text-amber-600" />
                    ) : (
                      `#${index + 1}`
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-slate-400">{record.date}</span>
                    {record.stats.distance && (
                      <span className="text-[10px] text-slate-500 font-mono">{record.stats.distance}m distance</span>
                    )}
                    {record.stats.kills !== undefined && (
                      <span className="text-[10px] text-slate-500 font-mono">{record.stats.kills} drones destroyed</span>
                    )}
                    {record.stats.gems !== undefined && (
                      <span className="text-[10px] text-slate-500 font-mono">{record.stats.gems} gems collected</span>
                    )}
                  </div>
                </div>

                <div className="text-xl font-black font-mono text-cyan-400">
                  {record.score.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
