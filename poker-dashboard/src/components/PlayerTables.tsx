'use client';

import React, { useState, useEffect } from 'react';

interface Player {
  name: string;
  table: number;
  seat: number;
  chips: number;
}

interface PlayerTablesProps {
  data: string[][];
}

export function PlayerTables({ data }: PlayerTablesProps) {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Assuming the data is in the format:
      // [['Player Name', 'Table', 'Seat', 'Chips'], ['John Doe', '1', '2', '50000'], ...]
      const playersData = data.slice(1).map(row => ({
        name: row[0],
        table: parseInt(row[1], 10),
        seat: parseInt(row[2], 10),
        chips: parseInt(row[3], 10)
      }));
      setPlayers(playersData);
    }
  }, [data]);

  const tables = Array.from(new Set(players.map(p => p.table))).sort((a, b) => a - b);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Player Tables</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map(table => (
          <div key={table} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Table {table}</h3>
            <div className="space-y-2">
              {players
                .filter(p => p.table === table)
                .sort((a, b) => a.seat - b.seat)
                .map(player => (
                  <div key={`${player.table}-${player.seat}`} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-sm text-gray-500 ml-2">(Seat {player.seat})</span>
                    </div>
                    <span className="text-green-600">{player.chips.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 