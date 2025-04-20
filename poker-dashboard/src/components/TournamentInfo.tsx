'use client';

import React, { useState, useEffect } from 'react';

interface TournamentInfoProps {
  data: string[][];
}

export function TournamentInfo({ data }: TournamentInfoProps) {
  const [tournamentData, setTournamentData] = useState({
    name: 'Loading...',
    date: 'Loading...',
    totalPlayers: 0,
    currentPlayers: 0,
    blinds: 'Loading...',
    nextBreak: 'Loading...'
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Assuming the data is in the format:
      // [['Name', 'Weekly Tournament'], ['Date', '2024-04-20'], ...]
      const infoMap = new Map(data);
      setTournamentData({
        name: infoMap.get('Name') || 'N/A',
        date: infoMap.get('Date') || 'N/A',
        totalPlayers: parseInt(infoMap.get('Total Players') || '0', 10),
        currentPlayers: parseInt(infoMap.get('Current Players') || '0', 10),
        blinds: infoMap.get('Current Blinds') || 'N/A',
        nextBreak: infoMap.get('Next Break') || 'N/A'
      });
    }
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Tournament Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Tournament Name</p>
          <p className="font-medium">{tournamentData.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-medium">{tournamentData.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Players</p>
          <p className="font-medium">{tournamentData.totalPlayers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Players</p>
          <p className="font-medium">{tournamentData.currentPlayers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Blinds</p>
          <p className="font-medium">{tournamentData.blinds}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Next Break</p>
          <p className="font-medium">{tournamentData.nextBreak}</p>
        </div>
      </div>
    </div>
  );
} 