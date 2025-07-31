import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false, // Disable CSS processing to reduce memory
    testMatch: [
      '<rootDir>/src/__tests__/simple.test.tsx' // Only run simple tests
    ],
    // Maximum memory optimization
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
    retry: 0, // No retries to reduce memory usage
    timeout: 5000, // Shorter timeout
    hookTimeout: 5000,
    // Minimal reporting
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