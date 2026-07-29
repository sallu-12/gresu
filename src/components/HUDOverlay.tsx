import React, { useState } from 'react';
import { GameStats, ControlState, GameMode } from '../types';
import { soundEngine } from '../utils/audio';
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX, Shield, Heart, Zap, Crosshair, Gem } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HUDOverlayProps {
  stats: GameStats;
  gameMode: GameMode;
  onControlChange: (controls: ControlState) => void;
  onPauseToggle: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({
  stats,
  gameMode,
  onControlChange,
  onPauseToggle,
  onRestart,
  onHome,
}) => {
  const [activeTouchKeys, setActiveTouchKeys] = useState<{ [key: string]: boolean }>({});

  const triggerTouch = (key: keyof ControlState, value: boolean) => {
    setActiveTouchKeys(prev => ({ ...prev, [key]: value }));
    const updatedState: ControlState = {
      moveLeft: key === 'moveLeft' ? value : false,
      moveRight: key === 'moveRight' ? value : false,
      moveUp: key === 'moveUp' ? value : false,
      moveDown: key === 'moveDown' ? value : false,
      shoot: key === 'shoot' ? value : false,
      boost: key === 'boost' ? value : false,
      tiltX: 0,
      tiltY: 0,
    };
    onControlChange(updatedState);
  };

  React.useEffect(() => {
    if (stats.isGameOver && stats.score > 1000) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, [stats.isGameOver, stats.score]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 select-none z-10">
      {/* Top Header Stats Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        {/* Left: Health & Shield */}
        <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-2 min-w-[200px] shadow-lg shadow-cyan-950/40">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              HEALTH
            </span>
            <span className="font-bold text-white">{stats.health}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-rose-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${Math.max(0, stats.health)}%` }}
            />
          </div>

          {gameMode !== 'sphere' && (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-1">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Shield className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                  SHIELD
                </span>
                <span className="font-bold text-white">{stats.shield}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300 shadow-sm shadow-cyan-400"
                  style={{ width: `${Math.max(0, stats.shield)}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Center: Main Score Counter */}
        <div className="flex flex-col items-center bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-6 py-2 shadow-xl shadow-cyan-950/50">
          <span className="text-[10px] tracking-widest text-cyan-400 font-mono font-bold uppercase">
            {gameMode === 'runner' ? 'Cyber Runner' : gameMode === 'combat' ? 'Orbital Combat' : 'Gravity Sphere'}
          </span>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-pink-500 font-mono">
            {stats.score.toLocaleString()}
          </div>
          {stats.multiplier > 1 && (
            <span className="text-xs font-black text-amber-300 animate-pulse bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/50">
              {stats.multiplier}X MULTIPLIER!
            </span>
          )}
        </div>

        {/* Right: Mode Stats & Audio/Pause Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-3 flex flex-col gap-1 font-mono text-xs text-slate-300">
            {gameMode === 'runner' && (
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>SPEED: {stats.speed} U/S</span>
              </div>
            )}
            {gameMode === 'combat' && (
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-rose-400" />
                <span>KILLS: {stats.kills}</span>
              </div>
            )}
            {gameMode === 'sphere' && (
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-emerald-400" />
                <span>GEMS: {stats.gemsCollected}</span>
              </div>
            )}
          </div>

          <button
            onClick={onPauseToggle}
            className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 rounded-xl text-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-950/50"
          >
            {stats.isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Bottom Virtual Touch Controls (Mobile / On-Screen) */}
      <div className="pointer-events-auto flex justify-between items-end pb-2">
        {/* Left D-Pad */}
        <div className="grid grid-cols-3 gap-1 bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-800">
          <div />
          <button
            onMouseDown={() => triggerTouch('moveUp', true)}
            onMouseUp={() => triggerTouch('moveUp', false)}
            onTouchStart={() => triggerTouch('moveUp', true)}
            onTouchEnd={() => triggerTouch('moveUp', false)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
              activeTouchKeys.moveUp ? 'bg-cyan-500 scale-95' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ▲
          </button>
          <div />
          <button
            onMouseDown={() => triggerTouch('moveLeft', true)}
            onMouseUp={() => triggerTouch('moveLeft', false)}
            onTouchStart={() => triggerTouch('moveLeft', true)}
            onTouchEnd={() => triggerTouch('moveLeft', false)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
              activeTouchKeys.moveLeft ? 'bg-cyan-500 scale-95' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ◄
          </button>
          <div />
          <button
            onMouseDown={() => triggerTouch('moveRight', true)}
            onMouseUp={() => triggerTouch('moveRight', false)}
            onTouchStart={() => triggerTouch('moveRight', true)}
            onTouchEnd={() => triggerTouch('moveRight', false)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
              activeTouchKeys.moveRight ? 'bg-cyan-500 scale-95' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ►
          </button>
          <div />
          <button
            onMouseDown={() => triggerTouch('moveDown', true)}
            onMouseUp={() => triggerTouch('moveDown', false)}
            onTouchStart={() => triggerTouch('moveDown', true)}
            onTouchEnd={() => triggerTouch('moveDown', false)}
            className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white transition-all ${
              activeTouchKeys.moveDown ? 'bg-cyan-500 scale-95' : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            ▼
          </button>
          <div />
        </div>

        {/* Right Action Buttons */}
        <div className="flex gap-3 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
          <button
            onMouseDown={() => triggerTouch('boost', true)}
            onMouseUp={() => triggerTouch('boost', false)}
            onTouchStart={() => triggerTouch('boost', true)}
            onTouchEnd={() => triggerTouch('boost', false)}
            className={`w-14 h-14 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center shadow-lg transition-all ${
              activeTouchKeys.boost ? 'bg-amber-400 text-slate-950 scale-95' : 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
            }`}
          >
            BOOST
          </button>

          {gameMode === 'combat' && (
            <button
              onMouseDown={() => triggerTouch('shoot', true)}
              onMouseUp={() => triggerTouch('shoot', false)}
              onTouchStart={() => triggerTouch('shoot', true)}
              onTouchEnd={() => triggerTouch('shoot', false)}
              className={`w-14 h-14 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center shadow-lg transition-all ${
                activeTouchKeys.shoot ? 'bg-rose-500 text-white scale-95' : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
              }`}
            >
              FIRE
            </button>
          )}
        </div>
      </div>

      {/* Pause Menu Modal */}
      {stats.isPaused && !stats.isGameOver && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center pointer-events-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center text-center shadow-2xl shadow-cyan-950/80">
            <h2 className="text-3xl font-black text-cyan-400 mb-2 tracking-wide font-mono">GAME PAUSED</h2>
            <p className="text-sm text-slate-400 mb-6">Take a breather or customize controls</p>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={onPauseToggle}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-slate-950" /> RESUME
              </button>
              <button
                onClick={onRestart}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> RESTART
              </button>
              <button
                onClick={onHome}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {stats.isGameOver && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center pointer-events-auto">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center shadow-2xl shadow-rose-950/80 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-4xl font-black text-rose-500 mb-1 tracking-wider font-mono">GAME OVER</h2>
            <p className="text-xs text-slate-400 mb-6 font-mono">SYSTEM SHUTDOWN DETECTED</p>

            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-col gap-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">FINAL SCORE:</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{stats.score.toLocaleString()}</span>
              </div>

              {gameMode === 'runner' && (
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>DISTANCE TRAVELED:</span>
                  <span className="text-white font-mono">{stats.distance} meters</span>
                </div>
              )}

              {gameMode === 'combat' && (
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>DRONES DESTROYED:</span>
                  <span className="text-white font-mono">{stats.kills}</span>
                </div>
              )}

              {gameMode === 'sphere' && (
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>GEMS COLLECTED:</span>
                  <span className="text-white font-mono">{stats.gemsCollected}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={onRestart}
                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> PLAY AGAIN
              </button>
              <button
                onClick={onHome}
                className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all flex items-center justify-center"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
