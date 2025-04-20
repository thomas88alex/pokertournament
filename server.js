const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Google Sheets setup
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'your-spreadsheet-id';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

// Load credentials
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync('credentials.json'));
} catch (err) {
  console.error('Error loading credentials:', err);
  process.exit(1);
}

// Create Google Sheets client
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// API endpoint to fetch player data
app.get('/api/players', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Players!A2:E', // Adjust range based on your sheet
    });

    const players = response.data.values.map(row => ({
      name: row[0],
      stack: parseInt(row[1]),
      table: parseInt(row[2]),
      position: parseInt(row[3]),
      status: row[4],
    }));

    res.json(players);
  } catch (err) {
    console.error('Error fetching player data:', err);
    res.status(500).json({ error: 'Failed to fetch player data' });
  }
});

// API endpoint to fetch tournament info
app.get('/api/tournament', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Tournament!A2:C', // Adjust range based on your sheet
    });

    const [level, smallBlind, bigBlind] = response.data.values[0];
    
    res.json({
      level: parseInt(level),
      smallBlind: parseInt(smallBlind),
      bigBlind: parseInt(bigBlind),
    });
  } catch (err) {
    console.error('Error fetching tournament data:', err);
    res.status(500).json({ error: 'Failed to fetch tournament data' });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 