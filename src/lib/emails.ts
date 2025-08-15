// Lifecycle email utilities for Caribe Mail Connect
// Created on 2025-02-14

import { supabase } from '@/integrations/supabase/client';
import { featureFlags } from './featureFlags';

export type LifecycleEmailType = 'welcome' | 'onboarding_complete';

export const sendLifecycleEmail = async (
  type: LifecycleEmailType,
  email: string,
): Promise<void> => {
  if (!featureFlags.lifecycleEmails) return;

  await supabase.functions.invoke('send-email', {
    body: { type, email },
  });
};
