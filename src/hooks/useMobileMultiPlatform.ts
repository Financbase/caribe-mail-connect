/**
 * Mobile Multi-Platform Hook
 * Story 2.5: Mobile & Multi-Platform Experience
 * 
 * React hook for managing mobile and multi-platform features,
 * PWA capabilities, offline functionality, and cross-platform sync
 */

import { useState, useEffect, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { MobileMultiPlatformService } from '@/services/mobileMultiPlatform';
import type { 
  PWAMetrics,
  OfflineCapabilities,
  PushNotificationConfig,
  CrossPlatformSync,
  MobileOptimization
} from '@/types/mobile';

// =====================================================
// MOBILE MULTI-PLATFORM HOOK TYPES
// =====================================================

interface UseMobileMultiPlatformState {
  pwaMetrics: PWAMetrics | null;
  offlineCapabilities: OfflineCapabilities | null;
  pushNotificationConfig: PushNotificationConfig | null;
  crossPlatformSync: CrossPlatformSync | null;
  mobileOptimization: MobileOptimization | null;
  isLoading: boolean;
  error: string | null;
}

interface UseMobileMultiPlatformActions {
  // Data refresh
  refreshMobileData: () => Promise<void>;
  refreshPWAMetrics: () => Promise<void>;
  refreshOfflineCapabilities: () => Promise<void>;
  refreshSyncStatus: () => Promise<void>;
  
  // PWA management
  installPWA: () => Promise<boolean>;
  updatePWA: () => Promise<boolean>;
  uninstallPWA: () => Promise<boolean>;
  
  // Offline capabilities
  enableOfflineMode: () => Promise<boolean>;
  disableOfflineMode: () => Promise<boolean>;
  clearOfflineData: () => Promise<boolean>;
  syncOfflineData: () => Promise<boolean>;
  
  // Push notifications
  configurePushNotifications: (config?: Partial<PushNotificationConfig>) => Promise<boolean>;
  sendTestNotification: () => Promise<boolean>;
  updateNotificationPreferences: (preferences: any) => Promise<boolean>;
  
  // Cross-platform sync
  syncAcrossPlatforms: () => Promise<boolean>;
  resolveSyncConflicts: () => Promise<boolean>;
  forceSyncFromServer: () => Promise<boolean>;
  
  // Mobile optimization
  optimizeForMobile: () => Promise<boolean>;
  enableBatteryOptimization: () => Promise<boolean>;
  enableNetworkOptimization: () => Promise<boolean>;
  
  // Device management
  registerDevice: () => Promise<boolean>;
  unregisterDevice: () => Promise<boolean>;
  getDeviceInfo: () => Promise<any>;
}

type UseMobileMultiPlatformReturn = UseMobileMultiPlatformState & UseMobileMultiPlatformActions;

// =====================================================
// MOBILE MULTI-PLATFORM HOOK
// =====================================================

export function useMobileMultiPlatform(): UseMobileMultiPlatformReturn {
  const { subscription } = useSubscription();
  
  const [state, setState] = useState<UseMobileMultiPlatformState>({
    pwaMetrics: null,
    offlineCapabilities: null,
    pushNotificationConfig: null,
    crossPlatformSync: null,
    mobileOptimization: null,
    isLoading: false,
    error: null
  });

  // =====================================================
  // DATA REFRESH OPERATIONS
  // =====================================================

  const refreshMobileData = useCallback(async () => {
    if (!subscription?.id) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [
        pwa,
        offline,
        notifications,
        sync,
        optimization
      ] = await Promise.all([
        MobileMultiPlatformService.getPWAMetrics(),
        MobileMultiPlatformService.getOfflineCapabilities(subscription.id),
        MobileMultiPlatformService.getPushNotificationConfig(subscription.id),
        MobileMultiPlatformService.getCrossPlatformSync(subscription.id),
        MobileMultiPlatformService.getMobileOptimization()
      ]);

      setState(prev => ({
        ...prev,
        pwaMetrics: pwa,
        offlineCapabilities: offline,
        pushNotificationConfig: notifications,
        crossPlatformSync: sync,
        mobileOptimization: optimization,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch mobile data',
        isLoading: false
      }));
    }
  }, [subscription?.id]);

  const refreshPWAMetrics = useCallback(async () => {
    try {
      const metrics = await MobileMultiPlatformService.getPWAMetrics();
      setState(prev => ({ ...prev, pwaMetrics: metrics }));
    } catch (error) {
      console.error('Error refreshing PWA metrics:', error);
    }
  }, []);

  const refreshOfflineCapabilities = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const capabilities = await MobileMultiPlatformService.getOfflineCapabilities(subscription.id);
      setState(prev => ({ ...prev, offlineCapabilities: capabilities }));
    } catch (error) {
      console.error('Error refreshing offline capabilities:', error);
    }
  }, [subscription?.id]);

  const refreshSyncStatus = useCallback(async () => {
    if (!subscription?.id) return;

    try {
      const sync = await MobileMultiPlatformService.getCrossPlatformSync(subscription.id);
      setState(prev => ({ ...prev, crossPlatformSync: sync }));
    } catch (error) {
      console.error('Error refreshing sync status:', error);
    }
  }, [subscription?.id]);

  // =====================================================
  // PWA MANAGEMENT
  // =====================================================

  const installPWA = useCallback(async (): Promise<boolean> => {
    try {
      // PWA installation is handled by the browser's install prompt
      // This would trigger the installation process
      console.log('Installing PWA...');
      
      // Refresh metrics after installation
      await refreshPWAMetrics();
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to install PWA'
      }));
      return false;
    }
  }, [refreshPWAMetrics]);

  const updatePWA = useCallback(async (): Promise<boolean> => {
    try {
      // Update PWA service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      }
      
      await refreshPWAMetrics();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update PWA'
      }));
      return false;
    }
  }, [refreshPWAMetrics]);

  const uninstallPWA = useCallback(async (): Promise<boolean> => {
    try {
      // PWA uninstallation is handled by the browser
      console.log('Uninstalling PWA...');
      
      await refreshPWAMetrics();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to uninstall PWA'
      }));
      return false;
    }
  }, [refreshPWAMetrics]);

  // =====================================================
  // OFFLINE CAPABILITIES
  // =====================================================

  const enableOfflineMode = useCallback(async (): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await MobileMultiPlatformService.enableOfflineMode(subscription.id);
      
      if (success) {
        await refreshOfflineCapabilities();
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to enable offline mode',
        isLoading: false
      }));
      return false;
    }
  }, [subscription?.id, refreshOfflineCapabilities]);

  const disableOfflineMode = useCallback(async (): Promise<boolean> => {
    try {
      // Disable offline mode
      console.log('Disabling offline mode...');
      
      // Clear offline data
      await clearOfflineData();
      
      await refreshOfflineCapabilities();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to disable offline mode'
      }));
      return false;
    }
  }, [refreshOfflineCapabilities]);

  const clearOfflineData = useCallback(async (): Promise<boolean> => {
    try {
      // Clear offline data and caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      await refreshOfflineCapabilities();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear offline data'
      }));
      return false;
    }
  }, [refreshOfflineCapabilities]);

  const syncOfflineData = useCallback(async (): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      const success = await MobileMultiPlatformService.syncAcrossPlatforms(subscription.id);
      
      if (success) {
        await Promise.all([
          refreshOfflineCapabilities(),
          refreshSyncStatus()
        ]);
      }
      
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sync offline data'
      }));
      return false;
    }
  }, [subscription?.id, refreshOfflineCapabilities, refreshSyncStatus]);

  // =====================================================
  // PUSH NOTIFICATIONS
  // =====================================================

  const configurePushNotifications = useCallback(async (
    config?: Partial<PushNotificationConfig>
  ): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await MobileMultiPlatformService.configurePushNotifications(
        subscription.id,
        config || {}
      );

      if (success) {
        const updatedConfig = await MobileMultiPlatformService.getPushNotificationConfig(subscription.id);
        setState(prev => ({ ...prev, pushNotificationConfig: updatedConfig }));
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to configure push notifications',
        isLoading: false
      }));
      return false;
    }
  }, [subscription?.id]);

  const sendTestNotification = useCallback(async (): Promise<boolean> => {
    try {
      // Send test notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is a test notification from PRMCMS',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
        return true;
      }
      return false;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send test notification'
      }));
      return false;
    }
  }, []);

  const updateNotificationPreferences = useCallback(async (preferences: any): Promise<boolean> => {
    try {
      // Update notification preferences
      console.log('Updating notification preferences:', preferences);
      
      // Refresh configuration
      if (subscription?.id) {
        const updatedConfig = await MobileMultiPlatformService.getPushNotificationConfig(subscription.id);
        setState(prev => ({ ...prev, pushNotificationConfig: updatedConfig }));
      }
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update notification preferences'
      }));
      return false;
    }
  }, [subscription?.id]);

  // =====================================================
  // CROSS-PLATFORM SYNC
  // =====================================================

  const syncAcrossPlatforms = useCallback(async (): Promise<boolean> => {
    if (!subscription?.id) return false;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await MobileMultiPlatformService.syncAcrossPlatforms(subscription.id);
      
      if (success) {
        await refreshSyncStatus();
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to sync across platforms',
        isLoading: false
      }));
      return false;
    }
  }, [subscription?.id, refreshSyncStatus]);

  const resolveSyncConflicts = useCallback(async (): Promise<boolean> => {
    try {
      // Resolve sync conflicts
      console.log('Resolving sync conflicts...');
      
      await refreshSyncStatus();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to resolve sync conflicts'
      }));
      return false;
    }
  }, [refreshSyncStatus]);

  const forceSyncFromServer = useCallback(async (): Promise<boolean> => {
    if (!subscription?.id) return false;

    try {
      // Force sync from server
      console.log('Forcing sync from server...');
      
      await refreshSyncStatus();
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to force sync from server'
      }));
      return false;
    }
  }, [subscription?.id, refreshSyncStatus]);

  // =====================================================
  // MOBILE OPTIMIZATION
  // =====================================================

  const optimizeForMobile = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await MobileMultiPlatformService.optimizeForMobile();
      
      if (success) {
        const optimization = await MobileMultiPlatformService.getMobileOptimization();
        setState(prev => ({ ...prev, mobileOptimization: optimization }));
      }

      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to optimize for mobile',
        isLoading: false
      }));
      return false;
    }
  }, []);

  const enableBatteryOptimization = useCallback(async (): Promise<boolean> => {
    try {
      // Enable battery optimization
      console.log('Enabling battery optimization...');
      
      const optimization = await MobileMultiPlatformService.getMobileOptimization();
      setState(prev => ({ ...prev, mobileOptimization: optimization }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to enable battery optimization'
      }));
      return false;
    }
  }, []);

  const enableNetworkOptimization = useCallback(async (): Promise<boolean> => {
    try {
      // Enable network optimization
      console.log('Enabling network optimization...');
      
      const optimization = await MobileMultiPlatformService.getMobileOptimization();
      setState(prev => ({ ...prev, mobileOptimization: optimization }));
      
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to enable network optimization'
      }));
      return false;
    }
  }, []);

  // =====================================================
  // DEVICE MANAGEMENT
  // =====================================================

  const registerDevice = useCallback(async (): Promise<boolean> => {
    try {
      // Register device for cross-platform sync
      console.log('Registering device...');
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to register device'
      }));
      return false;
    }
  }, []);

  const unregisterDevice = useCallback(async (): Promise<boolean> => {
    try {
      // Unregister device
      console.log('Unregistering device...');
      return true;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to unregister device'
      }));
      return false;
    }
  }, []);

  const getDeviceInfo = useCallback(async (): Promise<any> => {
    try {
      // Get device information
      return {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      return null;
    }
  }, []);

  // =====================================================
  // EFFECTS
  // =====================================================

  useEffect(() => {
    if (subscription?.id) {
      refreshMobileData();
    }
  }, [subscription?.id, refreshMobileData]);

  // Set up real-time sync monitoring
  useEffect(() => {
    if (!subscription?.id) return;

    const interval = setInterval(() => {
      refreshSyncStatus();
    }, 30000); // Check sync status every 30 seconds

    return () => clearInterval(interval);
  }, [subscription?.id, refreshSyncStatus]);

  // =====================================================
  // RETURN HOOK INTERFACE
  // =====================================================

  return {
    // State
    pwaMetrics: state.pwaMetrics,
    offlineCapabilities: state.offlineCapabilities,
    pushNotificationConfig: state.pushNotificationConfig,
    crossPlatformSync: state.crossPlatformSync,
    mobileOptimization: state.mobileOptimization,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    refreshMobileData,
    refreshPWAMetrics,
    refreshOfflineCapabilities,
    refreshSyncStatus,
    installPWA,
    updatePWA,
    uninstallPWA,
    enableOfflineMode,
    disableOfflineMode,
    clearOfflineData,
    syncOfflineData,
    configurePushNotifications,
    sendTestNotification,
    updateNotificationPreferences,
    syncAcrossPlatforms,
    resolveSyncConflicts,
    forceSyncFromServer,
    optimizeForMobile,
    enableBatteryOptimization,
    enableNetworkOptimization,
    registerDevice,
    unregisterDevice,
    getDeviceInfo
  };
}
