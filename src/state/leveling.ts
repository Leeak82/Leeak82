export interface LevelInfo {
  level: number;
  title: string;
  intoLevel: number;
  span: number;
  pct: number;
  toNext: number;
}

const TITLES = [
  "Shop Helper",
  "Apprentice",
  "Lube Tech",
  "Technician",
  "Journeyman",
  "A-Tech",
  "Master Tech",
  "Shop Foreman",
  "Bedrock Certified",
];

/** XP required to advance FROM level L to L+1. */
function costForLevel(level: number): number {
  return 150 + (level - 1) * 100;
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(xp));
  while (remaining >= costForLevel(level)) {
    remaining -= costForLevel(level);
    level += 1;
  }
  const span = costForLevel(level);
  const title = TITLES[Math.min(level - 1, TITLES.length - 1)];
  return {
    level,
    title,
    intoLevel: remaining,
    span,
    pct: Math.round((remaining / span) * 100),
    toNext: span - remaining,
  };
}
