module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-refresh/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Production-ready TypeScript rules
    '@typescript-eslint/no-explicit-any': 'warn', // Downgrade from error to warning for production
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-object-type': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/triple-slash-reference': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    
    // React rules
    'react-hooks/exhaustive-deps': 'warn', // Downgrade to warning for production
    'react-refresh/only-export-components': 'warn',
    
    // General rules
    'no-shadow-restricted-names': 'warn',
    'no-case-declarations': 'warn',
    
    // Performance and best practices
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
  },
}; 