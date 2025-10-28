import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database/queries";

export async function GET() {
	try {
		const servers = DatabaseService.getServers();

		return NextResponse.json({
			success: true,
			data: servers,
			count: servers.length,
		});
	} catch (error) {
		console.error("Servers API error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch servers" },
			{ status: 500 }
		);
	}
}
