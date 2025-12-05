import { NextRequest, NextResponse } from 'next/server';

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const ARC_RAIDERS_GAME_ID = '464339927'; // ARC Raiders

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getTwitchAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
    throw new Error('Twitch credentials not configured');
  }

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Twitch access token');
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Subtract 1 minute for safety

  if (!cachedToken) {
    throw new Error('No access token received from Twitch');
  }

  return cachedToken;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '8'), 100);

    const accessToken = await getTwitchAccessToken();

    // Fetch ONLY Arc Raiders streams
    const arcRaidersResponse = await fetch(
      `https://api.twitch.tv/helix/streams?game_id=${ARC_RAIDERS_GAME_ID}&first=${limit}&type=live`,
      {
        headers: {
          'Client-ID': TWITCH_CLIENT_ID!,
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!arcRaidersResponse.ok) {
      throw new Error('Failed to fetch streams from Twitch');
    }

    const arcData = await arcRaidersResponse.json();
    const streams = arcData.data || [];

    // Sort by viewer count (descending)
    const sortedStreams = streams.sort(
      (a: any, b: any) => b.viewer_count - a.viewer_count
    );

    return NextResponse.json(
      {
        streams: sortedStreams,
        total: sortedStreams.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Twitch streams:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch streams',
        streams: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
