import React from 'react';
import { CustomizationSettings } from '../types';
import { X, Sparkles, Check } from 'lucide-react';

interface CustomizerModalProps {
  settings: CustomizationSettings;
  onSave: (newSettings: CustomizationSettings) => void;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#00f0ff', // Cyber Cyan
  '#ff0077', // Neon Pink
  '#39ff14', // Electric Green
  '#ffff00', // Neon Yellow
  '#9d00ff', // Purple Glow
  '#ff6600', // Blaze Orange
  '#ffffff', // Pure White
];

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [current, setCurrent] = React.useState<CustomizationSettings>(settings);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-cyan-950/80 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white font-mono tracking-wide">VEHICLE CUSTOMIZER</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Circle */}
        <div className="flex justify-center my-2">
          <div
            className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center relative shadow-2xl transition-all duration-300"
            style={{
              backgroundColor: current.shipColor,
              boxShadow: `0 0 30px ${current.glowColor}`,
            }}
          >
            <div
              className="w-10 h-10 rounded-full border-2 border-white/50"
              style={{ backgroundColor: current.glowColor }}
            />
          </div>
        </div>

        {/* Primary Ship Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">HULL COLOR</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_PALETTE.map(color => (
              <button
                key={color}
                onClick={() => setCurrent({ ...current, shipColor: color })}
                className="w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: current.shipColor === color ? '#ffffff' : 'transparent',
                }}
              >
                {current.shipColor === color && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Neon Engine Glow Color */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">NEON ENGINE GLOW</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_PALETTE.map(color => (
              <button
                key={color}
                onClick={() => setCurrent({ ...current, glowColor: color })}
                className="w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: current.glowColor === color ? '#ffffff' : 'transparent',
                }}
              >
                {current.glowColor === color && <Check className="w-4 h-4 text-slate-950 stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Engine Trail Style */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">ENGINE TRAIL PARTICLES</label>
          <div className="grid grid-cols-2 gap-2">
            {(['plasma', 'fire', 'neon', 'rainbow'] as const).map(type => (
              <button
                key={type}
                onClick={() => setCurrent({ ...current, trailType: type })}
                className={`py-2 px-3 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all ${
                  current.trailType === type
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onSave(current);
            onClose();
          }}
          className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/30"
        >
          SAVE CUSTOMIZATION
        </button>
      </div>
    </div>
  );
};
