// Environment-based feature flags for Caribe Mail Connect
// Generated on 2025-02-14

export interface FeatureFlags {
  onboarding: boolean;
  lifecycleEmails: boolean;
}

export const featureFlags: FeatureFlags = {
  onboarding: import.meta.env.VITE_ENABLE_ONBOARDING === 'true',
  lifecycleEmails: import.meta.env.VITE_ENABLE_LIFECYCLE_EMAILS === 'true',
};
