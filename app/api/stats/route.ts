import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database/queries';
import { getDiscordUsers } from '@/lib/discord';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serverId = searchParams.get('serverId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '5');
    
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
    
    // Paginate top performers
    const totalPerformers = detailedStats.topPerformers.length;
    const totalPages = Math.ceil(totalPerformers / pageSize);
    const offset = (page - 1) * pageSize;
    const paginatedPerformers = detailedStats.topPerformers.slice(offset, offset + pageSize);
    
    // Fetch Discord usernames for paginated top performers only (5 at a time)
    const userIds = paginatedPerformers.map(p => p.user_id);
    const discordUsers = await getDiscordUsers(userIds, serverId);
    
    // Enrich top performers with Discord usernames
    const enrichedTopPerformers = paginatedPerformers.map(performer => {
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
      pagination: {
        page,
        pageSize,
        totalCount: totalPerformers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
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
