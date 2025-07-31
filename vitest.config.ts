import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false, // Disable CSS to reduce memory usage
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
      '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'coverage/',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.stories.{ts,tsx}',
        'src/**/index.ts',
        'tests/e2e/**',
        'tests/**/*.spec.ts',
        'scripts/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
    // Improve test isolation and performance
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        maxForks: 1,
        minForks: 1
      }
    },
    // Reduce memory usage
    maxConcurrency: 1,
    sequence: {
      concurrent: false
    },
    // Improve test reliability
    retry: 1,
    timeout: 10000,
    hookTimeout: 10000,
    // Better error reporting
    reporters: ['verbose', 'json'],
    outputFile: 'test-results/vitest-results.json'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Optimize for test environment
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    target: 'esnext',
    minify: false
  }
}); 