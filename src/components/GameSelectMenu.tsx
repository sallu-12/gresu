import React from 'react';
import { GameMode, AudioSettings } from '../types';
import { soundEngine } from '../utils/audio';
import { Play, Sparkles, Trophy, Award, Volume2, VolumeX, Music, Flame, Crosshair, CircleDot, Keyboard } from 'lucide-react';

interface GameSelectMenuProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenCustomizer: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  audioSettings: AudioSettings;
  onToggleAudio: (type: 'sound' | 'music') => void;
}

export const GameSelectMenu: React.FC<GameSelectMenuProps> = ({
  onSelectMode,
  onOpenCustomizer,
  onOpenLeaderboard,
  onOpenAchievements,
  audioSettings,
  onToggleAudio,
}) => {
  const [showControls, setShowControls] = React.useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-6 select-none overflow-hidden">
      {/* Background Animated Neon Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navigation */}
      <div className="w-full max-w-6xl flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-mono font-bold text-sm tracking-widest text-cyan-400">CYBER 3D ARCADE</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleAudio('sound')}
            className={`p-2.5 rounded-xl border transition-all ${
              audioSettings.soundEnabled
                ? 'bg-slate-900 border-cyan-500/40 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}
            title="Toggle Sound FX"
          >
            {audioSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => onToggleAudio('music')}
            className={`p-2.5 rounded-xl border transition-all ${
              audioSettings.musicEnabled
                ? 'bg-slate-900 border-pink-500/40 text-pink-400'
                : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}
            title="Toggle Synthwave Music"
          >
            <Music className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCustomizer}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> CUSTOMIZE
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-400" /> SCORES
          </button>

          <button
            onClick={onOpenAchievements}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-cyan-400" /> BADGES
          </button>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="text-center z-10 my-4">
        <h1 className="text-5xl md:text-7xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500">
          CYBER 3D ARCADE
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-mono mt-2">
          SELECT YOUR 3D GAME MODE & CONQUER THE HIGH SCORES
        </p>
      </div>

      {/* 3D Game Mode Cards Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10 my-4">
        {/* Card 1: Cyber Runner */}
        <div
          onClick={() => onSelectMode('runner')}
          className="group relative bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div className="flex flex-col gap-3">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all">
              <Flame className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black font-mono text-white group-hover:text-cyan-400 transition-all">
              CYBER RUNNER
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dodge laser barriers, jump over spikes, collect shield powerups and hit supersonic speeds on a procedural neon highway.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">ENDLESS HIGHWAYS</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold group-hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/40">
              <Play className="w-5 h-5 fill-slate-950" />
            </div>
          </div>
        </div>

        {/* Card 2: Orbital Space Combat */}
        <div
          onClick={() => onSelectMode('combat')}
          className="group relative bg-slate-900/80 border border-rose-500/30 hover:border-rose-400 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/20"
        >
          <div className="flex flex-col gap-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-all">
              <Crosshair className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black font-mono text-white group-hover:text-rose-400 transition-all">
              ORBITAL COMBAT
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engage in 360-degree orbital dogfights. Lock onto rogue enemy drones, shatter asteroids, and protect your space hull.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-rose-400 tracking-wider">360° DOGFIGHTS</span>
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold group-hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/40">
              <Play className="w-5 h-5 fill-white" />
            </div>
          </div>
        </div>

        {/* Card 3: Gravity Sphere */}
        <div
          onClick={() => onSelectMode('sphere')}
          className="group relative bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20"
        >
          <div className="flex flex-col gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
              <CircleDot className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black font-mono text-white group-hover:text-emerald-400 transition-all">
              GRAVITY SPHERE
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Roll a glowing physics sphere across elevated floating platforms, trigger speed pads, and collect energy gems.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider">MARBLE PHYSICS</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold group-hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/40">
              <Play className="w-5 h-5 fill-slate-950" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Controls Guide */}
      <div className="w-full max-w-5xl flex justify-between items-center z-10 text-xs text-slate-500 font-mono">
        <button
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-2 hover:text-slate-300 transition-all"
        >
          <Keyboard className="w-4 h-4 text-cyan-400" />
          {showControls ? 'HIDE CONTROLS' : 'VIEW KEYBOARD & TOUCH CONTROLS'}
        </button>

        <span>POWERED BY THREE.JS & WEB AUDIO API</span>
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="w-full max-w-5xl bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-slate-300 z-10 animate-in fade-in duration-200">
          <div>
            <span className="text-cyan-400 font-bold">STEERING / MOVEMENT:</span>
            <p className="text-slate-400 mt-1">WASD or Arrow Keys / On-screen D-Pad</p>
          </div>
          <div>
            <span className="text-amber-400 font-bold">BOOST / JUMP:</span>
            <p className="text-slate-400 mt-1">SHIFT key or BOOST touch button</p>
          </div>
          <div>
            <span className="text-rose-400 font-bold">FIRE LASERS:</span>
            <p className="text-slate-400 mt-1">SPACEBAR / FIRE touch button</p>
          </div>
        </div>
      )}
    </div>
  );
};
