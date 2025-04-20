'use client';

import React, { useState } from 'react';

interface GoogleSheetConnectProps {
  onDataFetched: (data: any) => void;
}

export function GoogleSheetConnect({ onDataFetched }: GoogleSheetConnectProps) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sheetUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect to Google Sheet');
      }

      const data = await response.json();
      onDataFetched(data);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Google Sheet');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Connect Google Sheet</h2>
      {!isConnected ? (
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="sheetUrl" className="block text-sm font-medium text-gray-700">
              Google Sheet URL
            </label>
            <input
              type="text"
              id="sheetUrl"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
          {error && (
            <div className="text-red-600 text-sm mt-2">
              {error}
            </div>
          )}
        </form>
      ) : (
        <div className="text-green-600">
          <p>Successfully connected to Google Sheet!</p>
        </div>
      )}
    </div>
  );
} 