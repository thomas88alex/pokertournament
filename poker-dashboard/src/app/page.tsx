'use client';

import React from 'react';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Poker Tournament Dashboard</h1>
      <Dashboard />
    </main>
  );
} 