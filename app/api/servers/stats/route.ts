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

    const stats = DatabaseService.getServerStats(serverId);
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Server stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server statistics' },
      { status: 500 }
    );
  }
}
