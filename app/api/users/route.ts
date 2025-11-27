import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database/queries";
import { getDiscordUsers, getDiscordUser } from "@/lib/discord";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const userId = searchParams.get("userId");
		const serverId = searchParams.get("serverId");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "50");

		// If no userId, return all users for the server (paginated)
		if (!userId && serverId) {
			const { users, total } = DatabaseService.getAllUsers(
				serverId,
				page,
				limit
			);

			// Fetch Discord usernames and avatars for all users
			const userIds = users.map((user) => user.user_id);
			const discordUsers = await getDiscordUsers(userIds, serverId);

			// Merge Discord data with user data
			const enrichedUsers = users.map((user) => {
				const discordData = discordUsers.get(user.user_id);
				return {
					...user,
					username: discordData?.name || user.username,
					avatar: discordData?.avatar || null,
				};
			});

			return NextResponse.json({
				success: true,
				data: enrichedUsers,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			}, {
				headers: {
					'Cache-Control': 'no-store, no-cache, must-revalidate',
					'Pragma': 'no-cache',
					'Expires': '0',
				},
			});
		}

		// Original functionality for specific user stats
		if (!userId || !serverId) {
			return NextResponse.json(
				{ error: "User ID and Server ID are required" },
				{ status: 400 }
			);
		}

		const stats = DatabaseService.getUserStats(userId, serverId);

		if (!stats) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Fetch Discord data for the specific user
		const discordData = await getDiscordUser(userId, serverId);
		if (discordData) {
			stats.username = discordData.name;
			stats.avatar = discordData.avatar;
		}

		return NextResponse.json({
			success: true,
			data: stats,
		});
	} catch (error) {
		console.error("User stats API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch user statistics" },
			{ status: 500 }
		);
	}
}
