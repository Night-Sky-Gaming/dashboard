"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, Award, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getDiscordAvatarUrl, formatNumber } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types/database";

interface PaginationData {
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export default function LeaderboardPage() {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedServer, setSelectedServer] = useState<string | null>(null);
	const [pagination, setPagination] = useState<PaginationData>({
		page: 1,
		pageSize: 25,
		totalCount: 0,
		totalPages: 0,
		hasNext: false,
		hasPrev: false,
	});
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		// Hardcoded for Andromeda Gaming server
		// Uncomment for multi-server support:
		/*
		// Check if we're in the browser
		if (typeof window === "undefined") return;

		// Get selected server from context/storage
		const serverId = localStorage.getItem("selectedServer");
		if (serverId) {
			setSelectedServer(serverId);
			fetchLeaderboard(serverId);
		} else {
			setLoading(false);
		}

		// Listen for server changes
		const handleServerChange = (event: any) => {
			const newServerId = event.detail;
			setSelectedServer(newServerId);
			fetchLeaderboard(newServerId);
		};

		window.addEventListener("serverChanged", handleServerChange);
		return () =>
			window.removeEventListener("serverChanged", handleServerChange);
		*/
		
		// For now, use hardcoded server ID (Andromeda Gaming)
		const hardcodedServerId = "1430038605518077964";
		setSelectedServer(hardcodedServerId);
		fetchLeaderboard(hardcodedServerId);
	}, []);

	const fetchLeaderboard = async (serverId: string, page: number = 1) => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/leaderboard?serverId=${serverId}&page=${page}&pageSize=25`
			);
			const data = await response.json();

			if (data.success) {
				setLeaderboard(data.data);
				setPagination(data.pagination);
			}
		} catch (error) {
			console.error("Failed to fetch leaderboard:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (selectedServer && newPage >= 1 && newPage <= pagination.totalPages) {
			setCurrentPage(newPage);
			fetchLeaderboard(selectedServer, newPage);
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	const filteredLeaderboard = leaderboard.filter(
		(entry) =>
			entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.user_id.includes(searchTerm)
	);

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Trophy className="w-6 h-6 text-yellow-400" />;
			case 2:
				return <Medal className="w-6 h-6 text-gray-400" />;
			case 3:
				return <Award className="w-6 h-6 text-orange-600" />;
			default:
				return <span className="text-gray-400 font-bold">{rank}</span>;
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
					<p className="mt-4 text-gray-400">Loading leaderboard...</p>
				</div>
			</div>
		);
	}

	if (!selectedServer) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="text-6xl mb-4">🏆</div>
					<h2 className="text-2xl font-bold text-white mb-2">Leaderboard</h2>
					<p className="text-gray-400">
						Please select a server from the dropdown above to view the
						leaderboard.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold text-white">Leaderboard</h1>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 pr-4 py-2 bg-discord-dark-tertiary border border-gray-700 rounded-lg text-white focus:outline-none focus:border-discord-blurple"
					/>
				</div>
			</div>

			<div className="bg-discord-dark-tertiary rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-discord-dark">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Rank
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Level
								</th>
								<th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Experience
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{filteredLeaderboard.map((entry) => (
								<tr
									key={entry.user_id}
									className="hover:bg-discord-dark transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center justify-center w-8">
											{getRankIcon(entry.rank)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center space-x-3">
											{entry.avatar ? (
												<img
													src={entry.avatar}
													alt={entry.username}
													className="w-10 h-10 rounded-full"
												/>
											) : (
												<div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center">
													<span className="text-white font-semibold">
														{entry.username.charAt(0).toUpperCase()}
													</span>
												</div>
											)}
											<div>
												<p className="font-medium text-white">
													{entry.username}
												</p>
												<p className="text-gray-500 text-xs">{entry.user_id}</p>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-3 py-1 bg-discord-blurple rounded-full text-sm font-medium">
											{entry.level}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-gray-300">
										{formatNumber(entry.exp)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination Controls */}
			{pagination.totalPages > 1 && (
				<div className="flex items-center justify-between bg-discord-dark-tertiary rounded-lg px-6 py-4">
					<div className="text-sm text-gray-400">
						Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
						{Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of{" "}
						{pagination.totalCount} users
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={!pagination.hasPrev}
							className="px-3 py-2 bg-discord-dark rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-discord-dark-secondary transition-colors flex items-center space-x-1"
						>
							<ChevronLeft className="w-4 h-4" />
							<span>Previous</span>
						</button>

						<div className="flex items-center space-x-1">
							{/* First page */}
							{currentPage > 3 && (
								<>
									<button
										onClick={() => handlePageChange(1)}
										className="px-3 py-2 bg-discord-dark rounded-lg text-white hover:bg-discord-dark-secondary transition-colors"
									>
										1
									</button>
									{currentPage > 4 && <span className="text-gray-400">...</span>}
								</>
							)}

							{/* Pages around current */}
							{Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
								.filter(
									(page) =>
										page === currentPage ||
										page === currentPage - 1 ||
										page === currentPage + 1 ||
										page === currentPage - 2 ||
										page === currentPage + 2
								)
								.map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`px-3 py-2 rounded-lg transition-colors ${
											page === currentPage
												? "bg-discord-blurple text-white"
												: "bg-discord-dark text-white hover:bg-discord-dark-secondary"
										}`}
									>
										{page}
									</button>
								))}

							{/* Last page */}
							{currentPage < pagination.totalPages - 2 && (
								<>
									{currentPage < pagination.totalPages - 3 && (
										<span className="text-gray-400">...</span>
									)}
									<button
										onClick={() => handlePageChange(pagination.totalPages)}
										className="px-3 py-2 bg-discord-dark rounded-lg text-white hover:bg-discord-dark-secondary transition-colors"
									>
										{pagination.totalPages}
									</button>
								</>
							)}
						</div>

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={!pagination.hasNext}
							className="px-3 py-2 bg-discord-dark rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-discord-dark-secondary transition-colors flex items-center space-x-1"
						>
							<span>Next</span>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}

			{filteredLeaderboard.length === 0 && (
				<div className="text-center py-12 text-gray-400">No users found.</div>
			)}
		</div>
	);
}
