/**
 * Feature flag helpers using environment variables.
 * Last updated: 2025-08-13
 */

/**
 * Determines whether a feature is enabled based on the process environment.
 * @param name - The feature flag name (without prefix).
 * @param defaultValue - Optional default when the flag is undefined.
 */
export function isFeatureEnabled(name: string, defaultValue = false): boolean {
  const value = process.env[`FEATURE_${name.toUpperCase()}`];
  if (value === 'true') return true;
  if (value === 'false') return false;
  return defaultValue;
}

/**
 * Lists all feature flags found in the environment.
 */
export function listFeatureFlags(): Record<string, boolean> {
  const flags: Record<string, boolean> = {};
  for (const key of Object.keys(process.env).filter(k => k.startsWith('FEATURE_'))) {
    const flag = key.replace('FEATURE_', '').toLowerCase();
    flags[flag] = process.env[key] === 'true';
  }
  return flags;
}
