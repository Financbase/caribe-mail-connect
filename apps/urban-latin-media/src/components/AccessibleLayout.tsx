import React from 'react';

export const AccessibleLayout: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
    <button
      className="p-4 bg-primary text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
      tabIndex={0}
    >
      Item 1
    </button>
    <button
      className="p-4 bg-primary text-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
      tabIndex={0}
    >
      Item 2
    </button>
  </div>
);

export default AccessibleLayout;
