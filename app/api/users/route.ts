import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const serverId = searchParams.get('serverId');
    
    if (!userId || !serverId) {
      return NextResponse.json(
        { error: 'User ID and Server ID are required' },
        { status: 400 }
      );
    }

    const stats = DatabaseService.getUserStats(userId, serverId);
    
    if (!stats) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('User stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
