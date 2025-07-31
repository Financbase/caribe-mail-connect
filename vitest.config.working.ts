import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use jsdom for React components
    globals: true,
    testMatch: [
      '<rootDir>/src/__tests__/working.test.ts'
    ],
    // No setup files
    setupFiles: [],
    // No plugins
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
    timeout: 5000,
    hookTimeout: 5000,
    reporters: ['verbose']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
}); 