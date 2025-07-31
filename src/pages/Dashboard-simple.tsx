import React from 'react';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function DashboardSimple({ onNavigate, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          PRMCMS Dashboard
        </h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome to Puerto Rico Mail Carrier System</h2>
          <p className="text-gray-600">
            This is a simplified dashboard for testing purposes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Personal Packages</h3>
            <p className="text-gray-600">Manage personal mail and packages</p>
            <button 
              onClick={() => onNavigate('intake')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Package Intake
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Customers</h3>
            <p className="text-gray-600">Manage customer accounts</p>
            <button 
              onClick={() => onNavigate('customers')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Customers
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View system analytics</p>
            <button 
              onClick={() => onNavigate('analytics')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Analytics
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 