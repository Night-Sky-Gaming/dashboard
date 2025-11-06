import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database/queries';

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
    
    return NextResponse.json({
      success: true,
      data: {
        serverStats,
        ...detailedStats,
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
