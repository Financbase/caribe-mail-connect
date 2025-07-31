import { describe, it, expect } from 'vitest';

// Test that we can import UI components
describe('Import Path Resolution', () => {
  it('should be able to import UI components', async () => {
    // Test that the files exist and can be imported
    const cardModule = await import('@/components/ui/card');
    expect(cardModule).toBeDefined();
    expect(cardModule.Card).toBeDefined();
  });

  it('should be able to import button component', async () => {
    const buttonModule = await import('@/components/ui/button');
    expect(buttonModule).toBeDefined();
    expect(buttonModule.Button).toBeDefined();
  });

  it('should be able to import Supabase client', async () => {
    const supabaseModule = await import('@/integrations/supabase/client');
    expect(supabaseModule).toBeDefined();
    expect(supabaseModule.supabase).toBeDefined();
  });

  it('should be able to import utility functions', async () => {
    const utilsModule = await import('@/lib/utils');
    expect(utilsModule).toBeDefined();
    expect(utilsModule.cn).toBeDefined();
  });
}); 