import { NextResponse } from 'next/server';

// Mock data for development
const mockPlayers = [
  { name: 'Player 1', chips: 50000, position: 1, table: 1 },
  { name: 'Player 2', chips: 45000, position: 2, table: 1 },
  { name: 'Player 3', chips: 60000, position: 3, table: 2 },
  { name: 'Player 4', chips: 55000, position: 4, table: 2 },
];

const mockTournamentInfo = {
  currentLevel: 1,
  smallBlind: 25,
  bigBlind: 50,
};

export async function GET() {
  try {
    // Check if Google Sheets credentials are configured
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      // Return mock data if credentials are not configured
      return NextResponse.json({
        players: mockPlayers,
        tournamentInfo: mockTournamentInfo,
      });
    }

    // If credentials are configured, use Google Sheets API
    const { google } = await import('googleapis');
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.NEXT_PUBLIC_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not configured');
    }

    // Fetch player data from the 'Players' sheet
    const playersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Players!A2:D',
    });

    // Fetch tournament info from the 'Tournament' sheet
    const tournamentResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Tournament!A2:C',
    });

    const players = (playersResponse.data.values || []).map((row: string[]) => ({
      name: row[0] || '',
      chips: row[1] || '0',
      position: row[2] || '0',
      table: row[3] || '1',
    }));

    const tournamentInfo = {
      currentLevel: parseInt(tournamentResponse.data.values?.[0]?.[0] || '1'),
      smallBlind: parseInt(tournamentResponse.data.values?.[0]?.[1] || '25'),
      bigBlind: parseInt(tournamentResponse.data.values?.[0]?.[2] || '50'),
    };

    return NextResponse.json({
      players,
      tournamentInfo,
    });
  } catch (error) {
    console.error('API Error:', error);
    // Return mock data if there's an error
    return NextResponse.json({
      players: mockPlayers,
      tournamentInfo: mockTournamentInfo,
    });
  }
} 