import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface DeviceInfo {
  isNative: boolean;
  platform: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  model: string;
  isVirtual: boolean;
}

export interface NetworkInfo {
  connected: boolean;
  connectionType: string;
}

export function useMobile() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({ connected: true, connectionType: 'unknown' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Get device information
    const getDeviceInfo = async () => {
      if (Capacitor.isNativePlatform()) {
        const info = await Device.getInfo();
        setDeviceInfo({
          isNative: true,
          platform: info.platform,
          operatingSystem: info.operatingSystem,
          osVersion: info.osVersion,
          manufacturer: info.manufacturer,
          model: info.model,
          isVirtual: info.isVirtual,
        });
      } else {
        setDeviceInfo({
          isNative: false,
          platform: 'web',
          operatingSystem: navigator.platform,
          osVersion: 'unknown',
          manufacturer: 'unknown',
          model: 'web',
          isVirtual: false,
        });
      }
    };

    // Get network status
    const getNetworkStatus = async () => {
      if (Capacitor.isNativePlatform()) {
        const status = await Network.getStatus();
        setNetworkInfo({
          connected: status.connected,
          connectionType: status.connectionType,
        });
      }
    };

    // Set up network listeners
    const setupNetworkListeners = () => {
      if (Capacitor.isNativePlatform()) {
        Network.addListener('networkStatusChange', (status) => {
          setNetworkInfo({
            connected: status.connected,
            connectionType: status.connectionType,
          });
          setIsOnline(status.connected);
        });
      } else {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    getDeviceInfo();
    getNetworkStatus();
    const cleanup = setupNetworkListeners();

    return cleanup;
  }, []);

  // Haptic feedback functions
  const hapticFeedback = {
    light: () => {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Light });
      } else {
        // Web fallback - vibrate if supported
        if ('vibrate' in navigator) {
          navigator.vibrate(10);
        }
      }
    },
    medium: () => {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Medium });
      } else {
        if ('vibrate' in navigator) {
          navigator.vibrate(20);
        }
      }
    },
    heavy: () => {
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Heavy });
      } else {
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    },
    success: () => {
      if (Capacitor.isNativePlatform()) {
        Haptics.notification({ type: 'SUCCESS' as any });
      } else {
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    },
    error: () => {
      if (Capacitor.isNativePlatform()) {
        Haptics.notification({ type: 'ERROR' as any });
      } else {
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
      }
    }
  };

  // Check if device is mobile
  const isMobile = () => {
    if (deviceInfo?.isNative) return true;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Check if device supports touch
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // Check if device has small screen
  const isSmallScreen = () => {
    return window.innerWidth < 768;
  };

  // Check if device is in landscape mode
  const isLandscape = () => {
    return window.innerWidth > window.innerHeight;
  };

  return {
    deviceInfo,
    networkInfo,
    isOnline,
    isMobile: isMobile(),
    isTouchDevice: isTouchDevice(),
    isSmallScreen: isSmallScreen(),
    isLandscape: isLandscape(),
    hapticFeedback,
  };
}