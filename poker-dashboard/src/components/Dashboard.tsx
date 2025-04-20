'use client';

import React, { useEffect, useState } from 'react';

interface Player {
  name: string;
  chips: number;
  position: number;
  table: number;
}

interface TournamentInfo {
  totalPlayers: number;
  averageStack: number;
  smallestStack: number;
  largestStack: number;
  currentLevel: number;
  smallBlind: number;
  bigBlind: number;
}

const Dashboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournamentInfo, setTournamentInfo] = useState<TournamentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/sheets');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      
      // Process players data
      const processedPlayers = data.players.map((player: any) => ({
        name: player.name,
        chips: parseInt(player.chips),
        position: parseInt(player.position),
        table: parseInt(player.table)
      }));

      // Calculate tournament info
      const chips: number[] = processedPlayers.map((p: Player) => p.chips);
      const tournamentData: TournamentInfo = {
        totalPlayers: processedPlayers.length,
        averageStack: Math.round(chips.reduce((a: number, b: number) => a + b, 0) / processedPlayers.length),
        smallestStack: Math.min(...chips),
        largestStack: Math.max(...chips),
        currentLevel: data.tournamentInfo.currentLevel,
        smallBlind: data.tournamentInfo.smallBlind,
        bigBlind: data.tournamentInfo.bigBlind
      };

      setPlayers(processedPlayers);
      setTournamentInfo(tournamentData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tournament Info Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Tournament Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600">Total Players</p>
            <p className="text-xl font-semibold">{tournamentInfo?.totalPlayers}</p>
          </div>
          <div>
            <p className="text-gray-600">Average Stack</p>
            <p className="text-xl font-semibold">{tournamentInfo?.averageStack}</p>
          </div>
          <div>
            <p className="text-gray-600">Current Level</p>
            <p className="text-xl font-semibold">{tournamentInfo?.currentLevel}</p>
          </div>
          <div>
            <p className="text-gray-600">Blinds</p>
            <p className="text-xl font-semibold">{tournamentInfo?.smallBlind}/{tournamentInfo?.bigBlind}</p>
          </div>
        </div>
      </div>

      {/* Players Tables Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from(new Set(players.map(p => p.table))).map(tableNumber => (
          <div key={tableNumber} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Table {tableNumber}</h3>
            <div className="space-y-4">
              {players
                .filter(p => p.table === tableNumber)
                .sort((a, b) => b.chips - a.chips)
                .map(player => (
                  <div key={player.name} className="flex justify-between items-center">
                    <span className="font-medium">{player.name}</span>
                    <span className="text-gray-600">{player.chips.toLocaleString()} chips</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Manual Refresh Button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={fetchData}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 