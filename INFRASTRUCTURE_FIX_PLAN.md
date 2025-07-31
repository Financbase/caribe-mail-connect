# PRMCMS Test Infrastructure Fix Plan

## 🚨 CRITICAL ISSUES IDENTIFIED

### 1. Memory Management - BROKEN
- **Problem**: Tests crash with heap out of memory (8GB+ usage)
- **Root Cause**: Complex test setup, too many mocks, CSS processing
- **Solution**: Simplify test environment, disable CSS, reduce mocks

### 2. Import Path Resolution - BROKEN
- **Problem**: `@/components/ui/card` imports fail
- **Root Cause**: Path aliases not properly configured in test environment
- **Solution**: Fix vitest configuration aliases

### 3. Test Environment Conflicts - BROKEN
- **Problem**: Mixed node/jsdom environments, Playwright/Vitest conflicts
- **Root Cause**: Inconsistent test framework configuration
- **Solution**: Separate test frameworks, consistent environments

### 4. Missing Dependencies - BROKEN
- **Problem**: Supabase client, UI components not properly connected
- **Root Cause**: Infrastructure not fully implemented
- **Solution**: Implement real dependencies, not just mocks

## 🔧 FIX IMPLEMENTATION

### Phase 1: Fix Memory Issues (IMMEDIATE)

#### 1.1 Disable CSS Processing
```typescript
// vitest.config.ts
test: {
  css: false, // Disable CSS to reduce memory usage
}
```

#### 1.2 Simplify Test Setup
```typescript
// src/test/setup.minimal.ts
// Remove complex mocks, keep only essential ones
```

#### 1.3 Reduce Memory Allocation
```json
// package.json
"test:minimal": "NODE_OPTIONS='--max-old-space-size=1024' vitest run"
```

### Phase 2: Fix Import Paths (HIGH PRIORITY)

#### 2.1 Fix Vitest Aliases
```typescript
// vitest.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

#### 2.2 Verify UI Components Exist
- ✅ `src/components/ui/card.tsx` - EXISTS
- ✅ `src/components/ui/button.tsx` - EXISTS
- ✅ `src/components/ui/dialog.tsx` - EXISTS
- ✅ `src/integrations/supabase/client.ts` - EXISTS

#### 2.3 Fix Import Statements
```typescript
// Use correct import paths
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
```

### Phase 3: Separate Test Frameworks (MEDIUM PRIORITY)

#### 3.1 Vitest for Unit Tests
```typescript
// vitest.config.ts - Unit tests only
testMatch: [
  '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
  '<rootDir>/src/**/*.{test,spec}.{ts,tsx}'
]
```

#### 3.2 Playwright for E2E Tests
```typescript
// playwright.config.ts - E2E tests only
testMatch: [
  '<rootDir>/tests/e2e/**/*.spec.ts'
]
```

#### 3.3 No Framework Mixing
- Remove Playwright tests from Vitest runs
- Remove Vitest tests from Playwright runs

### Phase 4: Implement Real Dependencies (HIGH PRIORITY)

#### 4.1 Real Supabase Integration
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

#### 4.2 Real Authentication
```typescript
// src/contexts/AuthContext.tsx
// Replace mocks with real Supabase auth
```

#### 4.3 Real Form Validation
```typescript
// src/components/forms/
// Implement real validation, not just mocks
```

## 📊 SUCCESS METRICS

### Memory Management
- **Target**: <2GB memory usage
- **Current**: 8GB+ (crashes)
- **Status**: ❌ BROKEN

### Test Success Rate
- **Target**: >80% pass rate
- **Current**: 0% (all fail)
- **Status**: ❌ BROKEN

### Import Resolution
- **Target**: 100% working imports
- **Current**: 0% (all fail)
- **Status**: ❌ BROKEN

### Test Execution Time
- **Target**: <60 seconds
- **Current**: Never completes (crashes)
- **Status**: ❌ BROKEN

## 🚀 IMMEDIATE ACTIONS

### 1. Test Minimal Configuration
```bash
npm run test:fixed
# Should run minimal.test.ts without memory issues
```

### 2. Fix Import Paths
```bash
# Verify all UI components can be imported
npm run test:imports
```

### 3. Implement Real Auth
```bash
# Connect to Supabase
npm run supabase:start
```

### 4. Separate Test Frameworks
```bash
# Run only unit tests
npm run test:unit

# Run only E2E tests
npm run test:e2e
```

## ⚠️ HONEST ASSESSMENT

The test suite is **fundamentally broken** and needs complete rework:

1. **Memory Issues**: Cannot run any tests due to memory crashes
2. **Import Issues**: Cannot import components due to path resolution
3. **Environment Issues**: Mixed test frameworks causing conflicts
4. **Dependency Issues**: No real functionality, only mocks

**Priority**: Fix infrastructure first, then implement real functionality, then improve test quality.

**Timeline**: 2-3 days to get basic tests working, 1-2 weeks for full functionality. 