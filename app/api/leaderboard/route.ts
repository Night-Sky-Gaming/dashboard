import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database/queries";
import { getDiscordUsers } from "@/lib/discord";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const serverId = searchParams.get("serverId");
		const page = parseInt(searchParams.get("page") || "1");
		const pageSize = parseInt(searchParams.get("pageSize") || "5");

		if (!serverId) {
			return NextResponse.json(
				{ error: "Server ID is required" },
				{ status: 400 }
			);
		}

		// Get total count for pagination
		const totalLeaderboard = DatabaseService.getLeaderboard(serverId, 10000);
		const totalCount = totalLeaderboard.length;
		const totalPages = Math.ceil(totalCount / pageSize);

		// Get paginated results
		const offset = (page - 1) * pageSize;
		const leaderboard = totalLeaderboard.slice(offset, offset + pageSize);

		// Fetch Discord usernames and avatars
		console.log(`[Leaderboard API] Fetching Discord data for ${leaderboard.length} users`);
		const userIds = leaderboard.map((entry) => entry.user_id);
		const discordUsers = await getDiscordUsers(userIds, serverId);
		console.log(`[Leaderboard API] Received Discord data for ${discordUsers.size} users`);

		// Merge Discord data with leaderboard data
		const enrichedLeaderboard = leaderboard.map((entry) => {
			const discordData = discordUsers.get(entry.user_id);
			return {
				...entry,
				username: discordData?.name || entry.username,
				avatar: discordData?.avatar || null,
			};
		});

		return NextResponse.json({
			success: true,
			data: enrichedLeaderboard,
			pagination: {
				page,
				pageSize,
				totalCount,
				totalPages,
				hasNext: page < totalPages,
				hasPrev: page > 1,
			},
		});
	} catch (error) {
		console.error("Leaderboard API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch leaderboard data" },
			{ status: 500 }
		);
	}
}
