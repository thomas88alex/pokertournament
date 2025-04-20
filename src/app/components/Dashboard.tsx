'use client';

import React, { useEffect, useState } from 'react';
import { FaUsers, FaClock, FaTable, FaTrophy, FaSync } from 'react-icons/fa';
import { GoogleSheetsService } from '../services/googleSheets';

interface Player {
  name: string;
  chips: number;
  table: number;
  seat: number;
}

interface TournamentInfo {
  currentLevel: number;
  smallBlind: number;
  bigBlind: number;
  timeLeft: number;
  playersRemaining: number;
  averageStack: number;
}

const SPREADSHEET_ID = '1Ynt9mVplh1aKg2us0dqBOSceCW5dfu4c2CX3e4u4svY';

const Dashboard: React.FC = () => {
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo>({
    currentLevel: 1,
    smallBlind: 25,
    bigBlind: 50,
    timeLeft: 1800,
    playersRemaining: 18,
    averageStack: 5000,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sheetsService = new GoogleSheetsService();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch tournament info
      const tournamentData = await sheetsService.getTournamentData(SPREADSHEET_ID, 'Tournament Info!A2:F2');
      if (tournamentData && tournamentData[0]) {
        setTournamentInfo({
          currentLevel: Number(tournamentData[0][0]),
          smallBlind: Number(tournamentData[0][1]),
          bigBlind: Number(tournamentData[0][2]),
          timeLeft: Number(tournamentData[0][3]),
          playersRemaining: Number(tournamentData[0][4]),
          averageStack: Number(tournamentData[0][5]),
        });
      }

      // Fetch players
      const playersData = await sheetsService.getTournamentData(SPREADSHEET_ID, 'Players!A2:D');
      if (playersData) {
        const formattedPlayers = playersData.map((row: any[]) => ({
          name: row[0],
          chips: Number(row[1]),
          table: Number(row[2]),
          seat: Number(row[3]),
        }));
        setPlayers(formattedPlayers);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Poker Tournament Dashboard</h1>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FaSync className="mr-2" />
            Refresh
          </button>
        </div>
        
        {/* Tournament Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <FaClock className="text-2xl mr-2 text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold">Current Level</h3>
                <p className="text-2xl">{tournamentInfo.currentLevel}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <FaTable className="text-2xl mr-2 text-green-500" />
              <div>
                <h3 className="text-lg font-semibold">Blinds</h3>
                <p className="text-2xl">{tournamentInfo.smallBlind}/{tournamentInfo.bigBlind}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <FaUsers className="text-2xl mr-2 text-blue-500" />
              <div>
                <h3 className="text-lg font-semibold">Players Remaining</h3>
                <p className="text-2xl">{tournamentInfo.playersRemaining}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <FaTrophy className="text-2xl mr-2 text-purple-500" />
              <div>
                <h3 className="text-lg font-semibold">Average Stack</h3>
                <p className="text-2xl">{tournamentInfo.averageStack}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Table Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from(new Set(players.map(p => p.table))).map(tableNumber => (
              <div key={tableNumber} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Table {tableNumber}</h3>
                <div className="space-y-2">
                  {players
                    .filter(p => p.table === tableNumber)
                    .sort((a, b) => a.seat - b.seat)
                    .map(player => (
                      <div key={`${player.table}-${player.seat}`} className="bg-gray-600 p-2 rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{player.name}</span>
                          <span className="text-yellow-400">{player.chips} chips</span>
                        </div>
                        <div className="text-sm text-gray-400">Seat {player.seat}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 