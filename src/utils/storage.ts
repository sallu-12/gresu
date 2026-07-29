import { HighScoreRecord, CustomizationSettings, Achievement, GameMode, AudioSettings } from '../types';

const HIGH_SCORES_KEY = 'cyber_3d_high_scores';
const CUSTOMIZATION_KEY = 'cyber_3d_customization';
const ACHIEVEMENTS_KEY = 'cyber_3d_achievements';
const AUDIO_SETTINGS_KEY = 'cyber_3d_audio';

export const INITIAL_CUSTOMIZATION: CustomizationSettings = {
  shipColor: '#00f0ff',
  glowColor: '#ff0077',
  trailType: 'plasma',
  unlockedSkins: ['default', '#00f0ff', '#ff0077', '#39ff14'],
};

export const DEFAULT_AUDIO: AudioSettings = {
  soundEnabled: true,
  musicEnabled: true,
  volume: 0.6,
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_run',
    title: 'Rookie Pilot',
    description: 'Complete your first game in any mode',
    icon: 'Rocket',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'score_1k',
    title: 'High Scorer',
    description: 'Reach a score of 1,000 points',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
  },
  {
    id: 'score_5k',
    title: 'Cyber Legend',
    description: 'Reach a score of 5,000 points',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
    maxProgress: 5000,
  },
  {
    id: 'kills_50',
    title: 'Star Fighter',
    description: 'Destroy 50 enemy drones in Orbital Combat',
    icon: 'Crosshair',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'gems_30',
    title: 'Gem Hoarder',
    description: 'Collect 30 energy gems in Gravity Sphere',
    icon: 'Gem',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
];

export function loadHighScores(): HighScoreRecord[] {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    return data ? JSON.parse(data) : [
      { id: '1', date: new Date().toLocaleDateString(), gameMode: 'runner', score: 2450, stats: { distance: 1200 } },
      { id: '2', date: new Date().toLocaleDateString(), gameMode: 'combat', score: 3100, stats: { kills: 18 } },
      { id: '3', date: new Date().toLocaleDateString(), gameMode: 'sphere', score: 1850, stats: { gems: 14 } },
    ];
  } catch {
    return [];
  }
}

export function saveHighScore(record: Omit<HighScoreRecord, 'id' | 'date'>): HighScoreRecord[] {
  const scores = loadHighScores();
  const newRecord: HighScoreRecord = {
    ...record,
    id: Math.random().toString(36).substring(2, 9),
    date: new Date().toLocaleDateString(),
  };
  scores.push(newRecord);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, 20); // Top 20
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function loadCustomization(): CustomizationSettings {
  try {
    const data = localStorage.getItem(CUSTOMIZATION_KEY);
    return data ? JSON.parse(data) : INITIAL_CUSTOMIZATION;
  } catch {
    return INITIAL_CUSTOMIZATION;
  }
}

export function saveCustomization(settings: CustomizationSettings) {
  localStorage.setItem(CUSTOMIZATION_KEY, JSON.stringify(settings));
}

export function loadAudioSettings(): AudioSettings {
  try {
    const data = localStorage.getItem(AUDIO_SETTINGS_KEY);
    return data ? JSON.parse(data) : DEFAULT_AUDIO;
  } catch {
    return DEFAULT_AUDIO;
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
}

export function loadAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function updateAchievements(score: number, mode: GameMode, kills = 0, gems = 0): Achievement[] {
  const list = loadAchievements();
  let updated = false;

  list.forEach(a => {
    if (a.unlocked) return;

    if (a.id === 'first_run') {
      a.progress = 1;
      a.unlocked = true;
      updated = true;
    } else if (a.id === 'score_1k') {
      a.progress = Math.max(a.progress, score);
      if (a.progress >= a.maxProgress) {
        a.unlocked = true;
        updated = true;
      }
    } else if (a.id === 'score_5k') {
      a.progress = Math.max(a.progress, score);
      if (a.progress >= a.maxProgress) {
        a.unlocked = true;
        updated = true;
      }
    } else if (a.id === 'kills_50' && mode === 'combat') {
      a.progress = Math.min(a.maxProgress, a.progress + kills);
      if (a.progress >= a.maxProgress) {
        a.unlocked = true;
        updated = true;
      }
    } else if (a.id === 'gems_30' && mode === 'sphere') {
      a.progress = Math.min(a.maxProgress, a.progress + gems);
      if (a.progress >= a.maxProgress) {
        a.unlocked = true;
        updated = true;
      }
    }
  });

  if (updated) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list));
  }
  return list;
}
