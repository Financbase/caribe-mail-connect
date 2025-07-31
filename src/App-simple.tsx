import React from 'react';
import './App.css';

function AppSimple() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          PRMCMS - Puerto Rico Mail Carrier System
        </h1>
        <p className="text-gray-600">
          Welcome to the Puerto Rico Private Mail Carrier Management System
        </p>
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          <p className="text-green-600">✅ React is working correctly!</p>
        </div>
      </div>
    </div>
  );
}

export default AppSimple; 