// Expose React globally for testing purposes
import React from 'react';
import ReactDOM from 'react-dom/client';

// Make React available globally
(window as any).React = React;
(window as any).ReactDOM = ReactDOM;

console.log('React exposed globally for testing'); 