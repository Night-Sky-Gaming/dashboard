import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database/queries";
import { getDiscordUsers } from "@/lib/discord";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const serverId = searchParams.get("serverId");
		const limit = parseInt(searchParams.get("limit") || "100");

		if (!serverId) {
			return NextResponse.json(
				{ error: "Server ID is required" },
				{ status: 400 }
			);
		}

		const leaderboard = DatabaseService.getLeaderboard(serverId, limit);

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
			count: enrichedLeaderboard.length,
		});
	} catch (error) {
		console.error("Leaderboard API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch leaderboard data" },
			{ status: 500 }
		);
	}
}
