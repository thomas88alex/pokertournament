import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { promises as fs } from 'fs';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

export async function getGoogleSheetData(sheetUrl: string) {
  try {
    // Load credentials from the JSON file
    const credentialsPath = path.join(process.cwd(), 'poker-tournament-457415-fcea0de4948e.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));

    // Create a JWT client
    const auth = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    // Extract spreadsheet ID from URL
    const spreadsheetId = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (!spreadsheetId) {
      throw new Error('Invalid Google Sheet URL');
    }

    // Create Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    // Get tournament info
    const tournamentInfo = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'TournamentInfo!A2:B6', // Adjust range based on your sheet structure
    });

    // Get player data
    const playerData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Players!A2:D', // Adjust range based on your sheet structure
    });

    return {
      tournamentInfo: tournamentInfo.data.values || [],
      players: playerData.data.values || [],
    };
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error);
    throw error;
  }
} 