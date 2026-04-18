/**
 * Feature Flags
 *
 * Feature flags for enabling/disabling functionality.
 */

import { isDevelopment, isProduction } from "./env";

/**
 * Feature flag configuration
 */
interface FeatureFlag {
  /** Whether the feature is enabled */
  readonly enabled: boolean;
  /** Description of the feature */
  readonly description: string;
}

/**
 * All feature flags for the application
 */
export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  /** Enable group ledger functionality */
  groupLedger: {
    enabled: true,
    description: "Enable group ledger and shared expenses",
  },

  /** Enable goals tracking */
  goals: {
    enabled: true,
    description: "Enable savings goals tracking",
  },

  /** Enable obligation tracking */
  obligations: {
    enabled: true,
    description: "Enable obligation/debt tracking",
  },

  /** Enable audit log viewer */
  auditViewer: {
    enabled: true,
    description: "Enable audit log viewer for financial changes",
  },

  /** Enable dark mode */
  darkMode: {
    enabled: true,
    description: "Enable dark mode theme",
  },

  /** Enable notifications */
  notifications: {
    enabled: isProduction,
    description: "Enable in-app notifications",
  },

  /** Enable analytics */
  analytics: {
    enabled: isDevelopment === false,
    description: "Enable usage analytics",
  },
};

/**
 * Check if a feature is enabled
 * @param featureName - The name of the feature flag
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(featureName: string): boolean {
  const flag = FEATURE_FLAGS[featureName];
  return flag?.enabled ?? false;
}
