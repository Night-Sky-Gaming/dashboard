"use client";

import { useState, useEffect } from "react";
import {
	BarChart3,
	Users,
	TrendingUp,
	Award,
	MessageSquare,
	Clock,
	Target,
	Activity,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";

interface StatisticsData {
	serverStats: {
		total_users: number;
		total_messages: number;
		total_exp: number;
		active_users_today: number;
	};
	levelDistribution: Array<{
		level: number;
		count: number;
	}>;
	topPerformers: Array<{
		user_id: string;
		username: string;
		exp: number;
		level: number;
	}>;
	recentActivity: Array<{
		date: string;
		users_active: number;
		exp_gained: number;
	}>;
	averageLevel: number;
	totalVoiceTime: number;
}

export default function StatisticsPage() {
	const [stats, setStats] = useState<StatisticsData | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedServer, setSelectedServer] = useState<string | null>(null);

	useEffect(() => {
		// Hardcoded for Andromeda Gaming server
		// Uncomment for multi-server support:
		/*
		if (typeof window === "undefined") return;

		const serverId = localStorage.getItem("selectedServer");
		if (serverId) {
			setSelectedServer(serverId);
			fetchStatistics(serverId);
		} else {
			setLoading(false);
		}

		const handleServerChange = (event: any) => {
			const newServerId = event.detail;
			setSelectedServer(newServerId);
			fetchStatistics(newServerId);
		};

		window.addEventListener("serverChanged", handleServerChange);
		return () =>
			window.removeEventListener("serverChanged", handleServerChange);
		*/
		
		// For now, use hardcoded server ID (Andromeda Gaming)
		const hardcodedServerId = "1430038605518077964";
		setSelectedServer(hardcodedServerId);
		fetchStatistics(hardcodedServerId);
	}, []);

	const fetchStatistics = async (serverId: string) => {
		setLoading(true);
		try {
			const response = await fetch(`/api/stats?serverId=${serverId}`);
			const data = await response.json();

			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch statistics:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
					<p className="mt-4 text-gray-400">Loading statistics...</p>
				</div>
			</div>
		);
	}

	if (!selectedServer) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="text-6xl mb-4">📊</div>
					<h2 className="text-2xl font-bold text-white mb-2">
						Server Statistics
					</h2>
					<p className="text-gray-400">
						Please select a server from the dropdown above to view statistics.
					</p>
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<p className="text-gray-400">No statistics available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-white mb-2">
					Server Statistics
				</h1>
				<p className="text-gray-400">
					Comprehensive analytics and insights for your server
				</p>
			</div>

			{/* Overview Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-400">Total Users</p>
								<p className="text-2xl font-bold text-white">
									{formatNumber(stats.serverStats.total_users)}
								</p>
							</div>
							<Users className="w-8 h-8 text-discord-blurple" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-400">Total Experience</p>
								<p className="text-2xl font-bold text-white">
									{formatNumber(stats.serverStats.total_exp)}
								</p>
							</div>
							<TrendingUp className="w-8 h-8 text-green-500" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-400">Average Level</p>
								<p className="text-2xl font-bold text-white">
									{stats.averageLevel.toFixed(1)}
								</p>
							</div>
							<Target className="w-8 h-8 text-yellow-500" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-400">Voice Time</p>
								<p className="text-2xl font-bold text-white">
									{(stats.totalVoiceTime / 3600000).toFixed(0)}h
								</p>
							</div>
							<Clock className="w-8 h-8 text-purple-500" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Level Distribution */}
			<Card>
				<CardHeader>
					<CardTitle>Level Distribution</CardTitle>
					<CardDescription>
						User distribution across different levels
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.levelDistribution.slice(0, 10).map((item) => {
							const maxCount = Math.max(
								...stats.levelDistribution.map((d) => d.count)
							);
							const percentage = (item.count / maxCount) * 100;

							return (
								<div key={item.level} className="space-y-2">
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-400">Level {item.level}</span>
										<span className="text-white font-semibold">
											{item.count} users
										</span>
									</div>
									<div className="w-full bg-discord-dark h-2 rounded-full overflow-hidden">
										<div
											className="bg-discord-blurple h-full rounded-full transition-all duration-500"
											style={{ width: `${percentage}%` }}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Top Performers */}
			<Card>
				<CardHeader>
					<CardTitle>Top Performers</CardTitle>
					<CardDescription>Most active users by experience</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.topPerformers.map((user, index) => (
							<div
								key={user.user_id}
								className="flex items-center justify-between p-3 bg-discord-dark rounded-lg"
							>
								<div className="flex items-center space-x-4">
									<div className="flex items-center justify-center w-8 h-8 bg-discord-blurple rounded-full">
										<span className="text-sm font-bold text-white">
											{index + 1}
										</span>
									</div>
									<div>
										<p className="text-white font-medium">{user.username}</p>
										<p className="text-xs text-gray-400">
											Level {user.level}
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-white font-semibold">
										{formatNumber(user.exp)} XP
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>User engagement over time</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.recentActivity.length > 0 ? (
							stats.recentActivity.map((activity, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-discord-dark rounded-lg"
								>
									<div className="flex items-center space-x-4">
										<Activity className="w-5 h-5 text-green-500" />
										<div>
											<p className="text-white font-medium">{activity.date}</p>
											<p className="text-xs text-gray-400">
												{activity.users_active} active users
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-white font-semibold">
											{formatNumber(activity.exp_gained)} XP
										</p>
									</div>
								</div>
							))
						) : (
							<div className="text-center py-8 text-gray-400">
								No recent activity data available
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
