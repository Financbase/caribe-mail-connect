import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: false, // Disable CSS to reduce memory
    testMatch: [
      '<rootDir>/src/__tests__/minimal.test.ts'
    ],
    setupFiles: [], // No setup files to avoid memory issues
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        maxForks: 1,
        minForks: 1
      }
    },
    maxConcurrency: 1,
    sequence: {
      concurrent: false
    },
    retry: 0,
    timeout: 10000,
    hookTimeout: 10000,
    reporters: ['verbose']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Minimal optimization
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
}); 