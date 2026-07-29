import React, { useEffect, useRef } from 'react';
import { GameMode, CustomizationSettings, GameStats, ControlState } from '../types';
import { CyberRunner3D } from '../games/CyberRunner3D';
import { SpaceCombat3D } from '../games/SpaceCombat3D';
import { GravitySphere3D } from '../games/GravitySphere3D';

interface GameCanvasProps {
  gameMode: GameMode;
  customization: CustomizationSettings;
  isPaused: boolean;
  onStatsUpdate: (stats: GameStats) => void;
  onGameOver: (finalStats: GameStats) => void;
  externalControls?: ControlState;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameMode,
  customization,
  isPaused,
  onStatsUpdate,
  onGameOver,
  externalControls,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CyberRunner3D | SpaceCombat3D | GravitySphere3D | null>(null);

  const controlsRef = useRef<ControlState>({
    moveLeft: false,
    moveRight: false,
    moveUp: false,
    moveDown: false,
    shoot: false,
    boost: false,
    tiltX: 0,
    tiltY: 0,
  });

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const c = controlsRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') c.moveLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') c.moveRight = true;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') c.moveUp = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') c.moveDown = true;
      if (e.key === ' ' || e.key === 'k' || e.key === 'K') c.shoot = true;
      if (e.key === 'Shift' || e.key === 'j' || e.key === 'J') c.boost = true;

      if (engineRef.current) {
        engineRef.current.updateControls(c);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const c = controlsRef.current;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') c.moveLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') c.moveRight = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') c.moveUp = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') c.moveDown = false;
      if (e.key === ' ' || e.key === 'k' || e.key === 'K') c.shoot = false;
      if (e.key === 'Shift' || e.key === 'j' || e.key === 'J') c.boost = false;

      if (engineRef.current) {
        engineRef.current.updateControls(c);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle External Touch / On-screen Joystick Controls
  useEffect(() => {
    if (externalControls) {
      controlsRef.current = { ...controlsRef.current, ...externalControls };
      if (engineRef.current) {
        engineRef.current.updateControls(controlsRef.current);
      }
    }
  }, [externalControls]);

  // Handle Pause/Resume
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.pause(isPaused);
    }
  }, [isPaused]);

  // Initialize Game Engine on mount or mode change
  useEffect(() => {
    if (!containerRef.current) return;

    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }

    if (gameMode === 'runner') {
      engineRef.current = new CyberRunner3D(
        containerRef.current,
        customization,
        onStatsUpdate,
        onGameOver
      );
    } else if (gameMode === 'combat') {
      engineRef.current = new SpaceCombat3D(
        containerRef.current,
        customization,
        onStatsUpdate,
        onGameOver
      );
    } else if (gameMode === 'sphere') {
      engineRef.current = new GravitySphere3D(
        containerRef.current,
        customization,
        onStatsUpdate,
        onGameOver
      );
    }

    if (engineRef.current) {
      engineRef.current.start();
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [gameMode, customization, onStatsUpdate, onGameOver]);

  return <div ref={containerRef} className="w-full h-full bg-slate-950 overflow-hidden" />;
};
