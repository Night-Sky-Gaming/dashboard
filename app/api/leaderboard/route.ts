import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database/queries";

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

		return NextResponse.json({
			success: true,
			data: leaderboard,
			count: leaderboard.length,
		});
	} catch (error) {
		console.error("Leaderboard API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch leaderboard data" },
			{ status: 500 }
		);
	}
}
