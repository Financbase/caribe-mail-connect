import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    css: false,
    testMatch: [
      '<rootDir>/src/__tests__/simple.test.tsx'
    ],
    // No setup files to avoid memory issues
    setupFiles: [],
    // Minimal configuration
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
    timeout: 3000,
    hookTimeout: 3000,
    reporters: ['verbose']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
}); 