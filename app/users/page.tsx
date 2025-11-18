"use client";

import { useState, useEffect } from "react";
import {
	Users as UsersIcon,
	Search,
	ChevronLeft,
	ChevronRight,
	TrendingUp,
	Award,
	Clock,
} from "lucide-react";
import { formatNumber, formatDuration } from "@/lib/utils";
import type { LeaderboardEntry } from "@/lib/types/database";

export default function UsersPage() {
	const [users, setUsers] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedServer, setSelectedServer] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalUsers, setTotalUsers] = useState(0);
	const usersPerPage = 50;

	useEffect(() => {
		// Hardcoded for Andromeda Gaming server
		// Uncomment for multi-server support:
		/*
		if (typeof window === "undefined") return;

		const serverId = localStorage.getItem("selectedServer");
		if (serverId) {
			setSelectedServer(serverId);
			fetchUsers(serverId, 1);
		} else {
			setLoading(false);
		}

		const handleServerChange = (event: any) => {
			const newServerId = event.detail;
			setSelectedServer(newServerId);
			setCurrentPage(1);
			fetchUsers(newServerId, 1);
		};

		window.addEventListener("serverChanged", handleServerChange);
		return () =>
			window.removeEventListener("serverChanged", handleServerChange);
		*/
		
		// For now, use hardcoded server ID (Andromeda Gaming)
		const hardcodedServerId = "1430038605518077964";
		setSelectedServer(hardcodedServerId);
		fetchUsers(hardcodedServerId, 1);
	}, []);

	const fetchUsers = async (serverId: string, page: number) => {
		setLoading(true);
		try {
			const response = await fetch(
				`/api/users?serverId=${serverId}&page=${page}&limit=${usersPerPage}`
			);
			const data = await response.json();

			if (data.success) {
				setUsers(data.data);
				if (data.pagination) {
					setTotalPages(data.pagination.totalPages);
					setTotalUsers(data.pagination.total);
				}
			}
		} catch (error) {
			console.error("Failed to fetch users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages && selectedServer) {
			setCurrentPage(newPage);
			fetchUsers(selectedServer, newPage);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.user_id.includes(searchTerm)
	);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-blurple mx-auto"></div>
					<p className="mt-4 text-gray-400">Loading users...</p>
				</div>
			</div>
		);
	}

	if (!selectedServer) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-white mb-2">
						Users Directory
					</h2>
					<p className="text-gray-400">
						Please select a server from the dropdown above to view users.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold text-white">Users Directory</h1>
					<p className="text-gray-400 mt-1">
						{formatNumber(totalUsers)} total users
					</p>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search users..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 pr-4 py-2 bg-discord-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-discord-blurple transition-colors"
					/>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-discord-dark border border-gray-700 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Total Users</p>
							<p className="text-2xl font-bold text-white">
								{formatNumber(totalUsers)}
							</p>
						</div>
						<UsersIcon className="w-10 h-10 text-discord-blurple" />
					</div>
				</div>

				<div className="bg-discord-dark border border-gray-700 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Current Page</p>
							<p className="text-2xl font-bold text-white">
								{currentPage} / {totalPages}
							</p>
						</div>
						<TrendingUp className="w-10 h-10 text-green-500" />
					</div>
				</div>

				<div className="bg-discord-dark border border-gray-700 rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-400 text-sm">Showing</p>
							<p className="text-2xl font-bold text-white">
								{filteredUsers.length} users
							</p>
						</div>
						<Award className="w-10 h-10 text-yellow-500" />
					</div>
				</div>
			</div>

			{/* Users Table */}
			<div className="bg-discord-dark border border-gray-700 rounded-lg overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-discord-darker border-b border-gray-700">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
									Rank
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
									User
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
									Level
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
									Experience
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
									Voice Time
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-700">
							{filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan={5}
										className="px-6 py-8 text-center text-gray-400"
									>
										No users found
									</td>
								</tr>
							) : (
								filteredUsers.map((user) => (
									<tr
										key={user.user_id}
										className="hover:bg-discord-darker/50 transition-colors"
									>
										<td className="px-6 py-4 whitespace-nowrap">
											<span className="text-gray-400 font-medium">
												#{user.rank}
											</span>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center space-x-3">
												{user.avatar ? (
													<img
														src={user.avatar}
														alt={user.username}
														className="w-10 h-10 rounded-full"
													/>
												) : (
													<div className="w-10 h-10 rounded-full bg-discord-blurple flex items-center justify-center">
														<span className="text-white font-semibold">
															{user.username.charAt(0).toUpperCase()}
														</span>
													</div>
												)}
												<div>
													<p className="text-white font-medium">
														{user.username}
													</p>
													<p className="text-gray-500 text-sm">
														{user.user_id}
													</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center space-x-2">
												<Award className="w-4 h-4 text-yellow-500" />
												<span className="text-white font-semibold">
													{user.level}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center space-x-2">
												<TrendingUp className="w-4 h-4 text-green-500" />
												<span className="text-white">
													{formatNumber(user.exp)}
												</span>
											</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="flex items-center space-x-2">
												<Clock className="w-4 h-4 text-blue-500" />
												<span className="text-white">
													{formatDuration((user as any).voice_time || 0)}
												</span>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between bg-discord-dark border border-gray-700 rounded-lg px-6 py-4">
					<div className="text-gray-400">
						Showing page {currentPage} of {totalPages}
					</div>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="px-4 py-2 bg-discord-darker border border-gray-700 rounded-lg text-white hover:bg-discord-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
						>
							<ChevronLeft className="w-4 h-4" />
							<span>Previous</span>
						</button>

						<div className="flex items-center space-x-1">
							{[...Array(Math.min(5, totalPages))].map((_, i) => {
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (currentPage <= 3) {
									pageNum = i + 1;
								} else if (currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = currentPage - 2 + i;
								}

								return (
									<button
										key={pageNum}
										onClick={() => handlePageChange(pageNum)}
										className={`px-3 py-2 rounded-lg transition-colors ${
											currentPage === pageNum
												? "bg-discord-blurple text-white"
												: "bg-discord-darker border border-gray-700 text-gray-400 hover:bg-discord-dark"
										}`}
									>
										{pageNum}
									</button>
								);
							})}
						</div>

						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="px-4 py-2 bg-discord-darker border border-gray-700 rounded-lg text-white hover:bg-discord-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
						>
							<span>Next</span>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
