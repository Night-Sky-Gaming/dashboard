import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database/queries';
import { getDiscordUsers } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    // Get server stats
    const serverStats = DatabaseService.getServerStats(serverId);
    
    // Get detailed statistics
    const detailedStats = DatabaseService.getDetailedStatistics(serverId);
    
    // Fetch Discord usernames for top performers
    const userIds = detailedStats.topPerformers.map(p => p.user_id);
    const discordUsers = await getDiscordUsers(userIds, serverId);
    
    // Enrich top performers with Discord usernames
    const enrichedTopPerformers = detailedStats.topPerformers.map(performer => {
      const discordData = discordUsers.get(performer.user_id);
      return {
        ...performer,
        username: discordData?.name || performer.username,
      };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        serverStats,
        ...detailedStats,
        topPerformers: enrichedTopPerformers,
      },
    });
  } catch (error) {
    console.error('Statistics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
