"use client";

import { useState, useEffect } from "react";
import {
	Settings as SettingsIcon,
	Save,
	Bell,
	Shield,
	Zap,
	MessageSquare,
	Volume2,
	Award,
	Lock,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface ServerSettings {
	serverId: string;
	levelUpMessages: boolean;
	levelUpChannel: string;
	xpRate: number;
	voiceXpRate: number;
	enabledChannels: string[];
	disabledChannels: string[];
	moderatorRoles: string[];
	autoRoleEnabled: boolean;
	autoRoleThreshold: number;
	autoRoleId: string;
}

export default function SettingsPage() {
	const [settings, setSettings] = useState<ServerSettings>({
		serverId: "",
		levelUpMessages: true,
		levelUpChannel: "",
		xpRate: 1,
		voiceXpRate: 1,
		enabledChannels: [],
		disabledChannels: [],
		moderatorRoles: [],
		autoRoleEnabled: false,
		autoRoleThreshold: 10,
		autoRoleId: "",
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [selectedServer, setSelectedServer] = useState<string | null>(null);
	const [saveMessage, setSaveMessage] = useState<string>("");

	useEffect(() => {
		// Hardcoded for Andromeda Gaming server
		// Uncomment for multi-server support:
		/*
		if (typeof window === "undefined") return;

		const serverId = localStorage.getItem("selectedServer");
		if (serverId) {
			setSelectedServer(serverId);
			fetchSettings(serverId);
		} else {
			setLoading(false);
		}

		const handleServerChange = (event: any) => {
			const newServerId = event.detail;
			setSelectedServer(newServerId);
			fetchSettings(newServerId);
		};

		window.addEventListener("serverChanged", handleServerChange);
		return () =>
			window.removeEventListener("serverChanged", handleServerChange);
		*/
		
		// For now, use hardcoded server ID (Andromeda Gaming)
		const hardcodedServerId = "1425595783952203829";
		setSelectedServer(hardcodedServerId);
		fetchSettings(hardcodedServerId);
	}, []);

	const fetchSettings = async (serverId: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/settings?serverId=${serverId}`);
			const data = await response.json();

			if (data.success) {
				setSettings(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch settings:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveSettings = async () => {
		if (!selectedServer) return;

		setSaving(true);
		setSaveMessage("");

		try {
			const response = await fetch("/api/settings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					serverId: selectedServer,
					settings,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSaveMessage("Settings saved successfully!");
				setTimeout(() => setSaveMessage(""), 3000);
			} else {
				setSaveMessage("Failed to save settings");
			}
		} catch (error) {
			console.error("Failed to save settings:", error);
			setSaveMessage("Error saving settings");
		} finally {
			setSaving(false);
		}
	};

	const updateSetting = <K extends keyof ServerSettings>(
		key: K,
		value: ServerSettings[K]
	) => {
		setSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
					<p className="mt-4 text-gray-400">Loading settings...</p>
				</div>
			</div>
		);
	}

	if (!selectedServer) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="text-6xl mb-4">⚙️</div>
					<h2 className="text-2xl font-bold text-white mb-2">Server Settings</h2>
					<p className="text-gray-400">
						Please select a server from the dropdown above to manage settings.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 max-w-5xl">
			{/* Warning Notice */}
			<div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
				<div className="flex items-start space-x-3">
					<div className="text-yellow-500 text-xl">⚠️</div>
					<div>
						<h3 className="text-yellow-500 font-semibold mb-1">
							Notice: Non-Functional Settings
						</h3>
						<p className="text-sm text-gray-300">
							This settings page is currently for demonstration purposes only and
							does not affect your Discord bot's actual configuration. Changes
							made here are stored temporarily and will not persist or modify bot
							behavior. See{" "}
							<code className="text-xs bg-discord-dark px-1 py-0.5 rounded">
								SETTINGS_INTEGRATION.md
							</code>{" "}
							for implementation details.
						</p>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-white mb-2">
						Server Settings
					</h1>
					<p className="text-gray-400">
						Configure your bot settings and preferences
					</p>
				</div>
				<Button
					onClick={handleSaveSettings}
					disabled={saving}
					className="bg-discord-blurple hover:bg-discord-blurple-dark flex items-center"
				>
					<Save className="w-4 h-4 mr-2" />
					{saving ? "Saving..." : "Save Changes"}
				</Button>
			</div>

			{saveMessage && (
				<div
					className={`p-4 rounded-lg ${
						saveMessage.includes("successfully")
							? "bg-green-500/20 text-green-400"
							: "bg-red-500/20 text-red-400"
					}`}
				>
					{saveMessage}
				</div>
			)}

			{/* General Settings */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-2">
						<SettingsIcon className="w-5 h-5 text-discord-blurple" />
						<CardTitle>General Settings</CardTitle>
					</div>
					<CardDescription>Basic bot configuration</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Level Up Channel
						</label>
						<input
							type="text"
							value={settings.levelUpChannel}
							onChange={(e) => updateSetting("levelUpChannel", e.target.value)}
							className="w-full bg-discord-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-discord-blurple"
							placeholder="Channel ID (optional)"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Leave empty to send level up messages in the same channel
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Experience Settings */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-2">
						<Zap className="w-5 h-5 text-yellow-500" />
						<CardTitle>Experience Settings</CardTitle>
					</div>
					<CardDescription>Configure XP gain rates</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-300">
								Level Up Messages
							</p>
							<p className="text-xs text-gray-400">
								Notify users when they level up
							</p>
						</div>
						<button
							onClick={() =>
								updateSetting("levelUpMessages", !settings.levelUpMessages)
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.levelUpMessages
									? "bg-discord-blurple"
									: "bg-gray-600"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.levelUpMessages ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Text XP Rate Multiplier
						</label>
						<input
							type="number"
							value={settings.xpRate}
							onChange={(e) =>
								updateSetting("xpRate", parseFloat(e.target.value))
							}
							min="0.1"
							max="10"
							step="0.1"
							className="w-full bg-discord-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-discord-blurple"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Multiplier for XP gained from text messages (0.1x - 10x)
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-300 mb-2">
							Voice XP Rate Multiplier
						</label>
						<input
							type="number"
							value={settings.voiceXpRate}
							onChange={(e) =>
								updateSetting("voiceXpRate", parseFloat(e.target.value))
							}
							min="0.1"
							max="10"
							step="0.1"
							className="w-full bg-discord-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-discord-blurple"
						/>
						<p className="text-xs text-gray-400 mt-1">
							Multiplier for XP gained from voice chat (0.1x - 10x)
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Auto Role Settings */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-2">
						<Award className="w-5 h-5 text-purple-500" />
						<CardTitle>Auto Role Rewards</CardTitle>
					</div>
					<CardDescription>
						Automatically assign roles when users reach certain levels
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-300">
								Enable Auto Roles
							</p>
							<p className="text-xs text-gray-400">
								Assign roles based on level milestones
							</p>
						</div>
						<button
							onClick={() =>
								updateSetting("autoRoleEnabled", !settings.autoRoleEnabled)
							}
							className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
								settings.autoRoleEnabled ? "bg-discord-blurple" : "bg-gray-600"
							}`}
						>
							<span
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									settings.autoRoleEnabled ? "translate-x-6" : "translate-x-1"
								}`}
							/>
						</button>
					</div>

					{settings.autoRoleEnabled && (
						<>
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Level Threshold
								</label>
								<input
									type="number"
									value={settings.autoRoleThreshold}
									onChange={(e) =>
										updateSetting("autoRoleThreshold", parseInt(e.target.value))
									}
									min="1"
									max="100"
									className="w-full bg-discord-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-discord-blurple"
								/>
								<p className="text-xs text-gray-400 mt-1">
									Level required to receive the auto role
								</p>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">
									Role ID
								</label>
								<input
									type="text"
									value={settings.autoRoleId}
									onChange={(e) => updateSetting("autoRoleId", e.target.value)}
									className="w-full bg-discord-dark border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-discord-blurple"
									placeholder="Role ID"
								/>
								<p className="text-xs text-gray-400 mt-1">
									The Discord role ID to assign
								</p>
							</div>
						</>
					)}
				</CardContent>
			</Card>

			{/* Notifications */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-2">
						<Bell className="w-5 h-5 text-blue-500" />
						<CardTitle>Notifications</CardTitle>
					</div>
					<CardDescription>
						Manage bot notification preferences
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-4 bg-discord-dark rounded-lg border border-gray-600">
						<div className="flex items-center space-x-3">
							<MessageSquare className="w-5 h-5 text-gray-400" />
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-300">
									Level Up Notifications
								</p>
								<p className="text-xs text-gray-400">
									Currently {settings.levelUpMessages ? "enabled" : "disabled"}
								</p>
							</div>
						</div>
					</div>

					<div className="p-4 bg-discord-dark rounded-lg border border-gray-600">
						<div className="flex items-center space-x-3">
							<Shield className="w-5 h-5 text-gray-400" />
							<div className="flex-1">
								<p className="text-sm font-medium text-gray-300">
									Moderation Alerts
								</p>
								<p className="text-xs text-gray-400">
									Receive alerts for moderation events
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Save Button */}
			<div className="flex justify-end">
				<Button
					onClick={handleSaveSettings}
					disabled={saving}
					className="bg-discord-blurple hover:bg-discord-blurple-dark flex items-center"
				>
					<Save className="w-4 h-4 mr-2" />
					{saving ? "Saving..." : "Save All Changes"}
				</Button>
			</div>
		</div>
	);
}
