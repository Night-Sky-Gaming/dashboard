import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for settings (replace with database in production)
const settingsStore = new Map<string, any>();

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

    // Get settings from store or return defaults
    // NOTE: These settings are stored in-memory only for demonstration
    // To actually affect the bot, you need to:
    // 1. Save to a database table (e.g., server_settings)
    // 2. Have your Discord bot read from that table
    // 3. Implement bot configuration reload mechanism
    const defaultSettings = {
      serverId,
      levelUpMessages: true,
      levelUpChannel: '',
      xpRate: 1.0,
      voiceXpRate: 1.0,
      enabledChannels: [],
      disabledChannels: [],
      moderatorRoles: [],
      autoRoleEnabled: false,
      autoRoleThreshold: 10,
      autoRoleId: '',
    };

    const settings = settingsStore.get(serverId) || defaultSettings;
    
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Settings GET API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serverId, settings } = body;
    
    if (!serverId) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings are required' },
        { status: 400 }
      );
    }

    // Validate settings
    // NOTE: Settings are currently stored in-memory only (lost on restart)
    // For production: implement database storage and bot configuration sync
    const validatedSettings = {
      serverId,
      levelUpMessages: Boolean(settings.levelUpMessages),
      levelUpChannel: settings.levelUpChannel || '',
      xpRate: Math.max(0.1, Math.min(10, Number(settings.xpRate) || 1)),
      voiceXpRate: Math.max(0.1, Math.min(10, Number(settings.voiceXpRate) || 1)),
      enabledChannels: Array.isArray(settings.enabledChannels) ? settings.enabledChannels : [],
      disabledChannels: Array.isArray(settings.disabledChannels) ? settings.disabledChannels : [],
      moderatorRoles: Array.isArray(settings.moderatorRoles) ? settings.moderatorRoles : [],
      autoRoleEnabled: Boolean(settings.autoRoleEnabled),
      autoRoleThreshold: Math.max(1, Math.min(100, Number(settings.autoRoleThreshold) || 10)),
      autoRoleId: settings.autoRoleId || '',
    };

    // Store settings (in production, save to database)
    settingsStore.set(serverId, validatedSettings);
    
    return NextResponse.json({
      success: true,
      data: validatedSettings,
      message: 'Settings saved successfully',
    });
  } catch (error) {
    console.error('Settings POST API error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
