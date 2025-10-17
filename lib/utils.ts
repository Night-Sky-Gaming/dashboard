import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getDiscordAvatarUrl(userId: string, avatar?: string): string {
  if (!avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
}

export function calculateLevelProgress(exp: number): { level: number; progress: number } {
  // Standard Discord bot leveling formula: exp = 5 * level^2 + 50 * level + 100
  const level = Math.floor((-50 + Math.sqrt(2500 + 20 * exp)) / 10);
  const currentLevelExp = 5 * level * level + 50 * level + 100;
  const nextLevelExp = 5 * (level + 1) * (level + 1) + 50 * (level + 1) + 100;
  const progress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  
  return { level, progress };
}
