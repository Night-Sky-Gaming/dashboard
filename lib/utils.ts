import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
}

export function getDiscordAvatarUrl(userId: string, avatar?: string): string {
	if (!avatar) {
		return `https://cdn.discordapp.com/embed/avatars/${
			parseInt(userId) % 5
		}.png`;
	}
	return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
}

export function calculateLevelProgress(exp: number): {
	level: number;
	progress: number;
} {
	// Your bot's leveling formula: level = floor(0.1 * sqrt(xp)) + 1
	const level = Math.floor(0.1 * Math.sqrt(exp)) + 1;
	const currentLevelExp = Math.pow((level - 1) * 10, 2);
	const nextLevelExp = Math.pow(level * 10, 2);
	const progress =
		((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;

	return { level, progress };
}

export function formatDuration(seconds: number): string {
	if (seconds === 0) return "0m";

	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);

	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
}
