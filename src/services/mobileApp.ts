/**
 * Mobile App Service
 * Story 7: Mobile App Foundation - Cross-Platform Mobile App
 * 
 * Mobile app foundation with PWA capabilities, offline functionality,
 * push notifications, and native-like experience
 */

// =====================================================
// MOBILE APP TYPES
// =====================================================

export interface MobileAppConfig {
  app_name: string;
  app_version: string;
  bundle_id: string;
  theme: MobileTheme;
  features: MobileFeature[];
  offline_capabilities: OfflineConfig;
  push_notifications: PushNotificationConfig;
  security: MobileSecurityConfig;
}

export interface MobileTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  dark_mode_enabled: boolean;
  custom_fonts: string[];
  icon_style: 'filled' | 'outlined' | 'rounded';
}

export interface MobileFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  platform_specific: {
    ios: boolean;
    android: boolean;
    web: boolean;
  };
  permissions_required: string[];
}

export interface OfflineConfig {
  enabled: boolean;
  cache_strategy: 'cache_first' | 'network_first' | 'stale_while_revalidate';
  cache_duration: number; // hours
  offline_pages: string[];
  sync_strategy: 'background' | 'manual' | 'automatic';
  storage_quota: number; // MB
}

export interface PushNotificationConfig {
  enabled: boolean;
  vapid_public_key: string;
  notification_types: NotificationType[];
  scheduling: NotificationScheduling;
  targeting: NotificationTargeting;
}

export interface NotificationType {
  id: string;
  name: string;
  description: string;
  default_enabled: boolean;
  priority: 'low' | 'normal' | 'high';
  sound: string;
  vibration_pattern: number[];
  led_color?: string;
}

export interface NotificationScheduling {
  quiet_hours: {
    enabled: boolean;
    start_time: string;
    end_time: string;
  };
  frequency_limits: {
    max_per_hour: number;
    max_per_day: number;
  };
  batching: {
    enabled: boolean;
    batch_window: number; // minutes
  };
}

export interface NotificationTargeting {
  user_segments: string[];
  location_based: boolean;
  behavior_based: boolean;
  time_zone_aware: boolean;
}

export interface MobileSecurityConfig {
  biometric_auth: boolean;
  pin_lock: boolean;
  session_timeout: number; // minutes
  certificate_pinning: boolean;
  root_detection: boolean;
  screen_recording_protection: boolean;
  app_integrity_check: boolean;
}

export interface DeviceInfo {
  device_id: string;
  platform: 'ios' | 'android' | 'web';
  os_version: string;
  app_version: string;
  device_model: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  push_token?: string;
  last_seen: string;
}

export interface AppAnalytics {
  session_id: string;
  user_id: string;
  device_info: DeviceInfo;
  events: AnalyticsEvent[];
  performance_metrics: PerformanceMetrics;
  crash_reports: CrashReport[];
}

export interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_data: Record<string, any>;
  timestamp: string;
  screen_name?: string;
  user_properties?: Record<string, any>;
}

export interface PerformanceMetrics {
  app_launch_time: number;
  screen_load_times: Record<string, number>;
  api_response_times: Record<string, number>;
  memory_usage: number;
  battery_usage: number;
  network_usage: number;
}

export interface CrashReport {
  crash_id: string;
  error_message: string;
  stack_trace: string;
  device_info: DeviceInfo;
  app_state: Record<string, any>;
  timestamp: string;
  user_actions: string[];
}

// =====================================================
// MOBILE APP CONFIGURATION
// =====================================================

export const MOBILE_APP_CONFIG: MobileAppConfig = {
  app_name: 'PRMCMS Mobile',
  app_version: '1.0.0',
  bundle_id: 'com.prmcms.mobile',
  theme: {
    primary_color: '#3b82f6',
    secondary_color: '#64748b',
    accent_color: '#10b981',
    background_color: '#ffffff',
    text_color: '#1f2937',
    dark_mode_enabled: true,
    custom_fonts: ['Inter', 'JetBrains Mono'],
    icon_style: 'rounded'
  },
  features: [
    {
      id: 'package_tracking',
      name: 'Package Tracking',
      description: 'Real-time package tracking and notifications',
      enabled: true,
      platform_specific: { ios: true, android: true, web: true },
      permissions_required: ['notifications']
    },
    {
      id: 'barcode_scanner',
      name: 'Barcode Scanner',
      description: 'Scan package barcodes for quick lookup',
      enabled: true,
      platform_specific: { ios: true, android: true, web: false },
      permissions_required: ['camera']
    },
    {
      id: 'location_services',
      name: 'Location Services',
      description: 'Location-based features and delivery tracking',
      enabled: true,
      platform_specific: { ios: true, android: true, web: true },
      permissions_required: ['location']
    },
    {
      id: 'biometric_auth',
      name: 'Biometric Authentication',
      description: 'Fingerprint and face recognition login',
      enabled: true,
      platform_specific: { ios: true, android: true, web: false },
      permissions_required: ['biometric']
    },
    {
      id: 'offline_mode',
      name: 'Offline Mode',
      description: 'Access app features without internet connection',
      enabled: true,
      platform_specific: { ios: true, android: true, web: true },
      permissions_required: []
    }
  ],
  offline_capabilities: {
    enabled: true,
    cache_strategy: 'stale_while_revalidate',
    cache_duration: 24,
    offline_pages: ['/dashboard', '/packages', '/profile'],
    sync_strategy: 'background',
    storage_quota: 50
  },
  push_notifications: {
    enabled: true,
    vapid_public_key: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    notification_types: [
      {
        id: 'package_arrival',
        name: 'Package Arrival',
        description: 'Notify when packages arrive',
        default_enabled: true,
        priority: 'high',
        sound: 'default',
        vibration_pattern: [0, 250, 250, 250]
      },
      {
        id: 'package_delivered',
        name: 'Package Delivered',
        description: 'Notify when packages are delivered',
        default_enabled: true,
        priority: 'high',
        sound: 'default',
        vibration_pattern: [0, 250, 250, 250]
      },
      {
        id: 'system_updates',
        name: 'System Updates',
        description: 'Important system notifications',
        default_enabled: true,
        priority: 'normal',
        sound: 'default',
        vibration_pattern: [0, 250]
      }
    ],
    scheduling: {
      quiet_hours: {
        enabled: true,
        start_time: '22:00',
        end_time: '08:00'
      },
      frequency_limits: {
        max_per_hour: 5,
        max_per_day: 20
      },
      batching: {
        enabled: true,
        batch_window: 15
      }
    },
    targeting: {
      user_segments: ['customers', 'staff', 'drivers'],
      location_based: true,
      behavior_based: true,
      time_zone_aware: true
    }
  },
  security: {
    biometric_auth: true,
    pin_lock: true,
    session_timeout: 30,
    certificate_pinning: true,
    root_detection: true,
    screen_recording_protection: true,
    app_integrity_check: true
  }
};

// =====================================================
// MOBILE APP SERVICE
// =====================================================

export class MobileAppService {

  /**
   * Initialize mobile app
   */
  static async initializeMobileApp(): Promise<boolean> {
    try {
      console.log('Initializing mobile app...');

      // Register service worker for PWA
      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service worker registered');
      }

      // Initialize push notifications
      if (MOBILE_APP_CONFIG.push_notifications.enabled) {
        await this.initializePushNotifications();
      }

      // Initialize offline capabilities
      if (MOBILE_APP_CONFIG.offline_capabilities.enabled) {
        await this.initializeOfflineCapabilities();
      }

      // Initialize analytics
      await this.initializeAnalytics();

      console.log('Mobile app initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing mobile app:', error);
      return false;
    }
  }

  /**
   * Register device for push notifications
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported');
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(MOBILE_APP_CONFIG.push_notifications.vapid_public_key)
      });

      const pushToken = JSON.stringify(subscription);
      console.log('Push notification subscription:', pushToken);

      return pushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  /**
   * Send push notification
   */
  static async sendPushNotification(
    userId: string,
    notification: {
      title: string;
      body: string;
      icon?: string;
      badge?: string;
      data?: any;
    }
  ): Promise<boolean> {
    try {
      // In a real implementation, this would call the backend API
      console.log('Sending push notification:', { userId, notification });

      // Simulate API call
      const response = await fetch('/api/push-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, notification })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Get device information
   */
  static getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const platform = this.detectPlatform(userAgent);

    return {
      device_id: this.generateDeviceId(),
      platform,
      os_version: this.getOSVersion(userAgent),
      app_version: MOBILE_APP_CONFIG.app_version,
      device_model: this.getDeviceModel(userAgent),
      screen_resolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      last_seen: new Date().toISOString()
    };
  }

  /**
   * Track analytics event
   */
  static async trackEvent(
    eventName: string,
    eventCategory: string,
    eventData: Record<string, any> = {}
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        event_category: eventCategory,
        event_data: eventData,
        timestamp: new Date().toISOString(),
        screen_name: window.location.pathname
      };

      // Store locally for offline support
      const events = this.getStoredEvents();
      events.push(event);
      localStorage.setItem('mobile_analytics_events', JSON.stringify(events));

      // Send to server if online
      if (navigator.onLine) {
        await this.syncAnalyticsEvents();
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  /**
   * Check if app is running in standalone mode (PWA)
   */
  static isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  /**
   * Check if device supports biometric authentication
   */
  static async supportsBiometricAuth(): Promise<boolean> {
    try {
      if ('credentials' in navigator && 'create' in navigator.credentials) {
        // Check for WebAuthn support
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get app configuration
   */
  static getAppConfig(): MobileAppConfig {
    return MOBILE_APP_CONFIG;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static async initializePushNotifications(): Promise<void> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Push notifications permission granted');
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }

  private static async initializeOfflineCapabilities(): Promise<void> {
    try {
      // Set up offline event listeners
      window.addEventListener('online', () => {
        console.log('App is online');
        this.syncOfflineData();
      });

      window.addEventListener('offline', () => {
        console.log('App is offline');
      });

      console.log('Offline capabilities initialized');
    } catch (error) {
      console.error('Error initializing offline capabilities:', error);
    }
  }

  private static async initializeAnalytics(): Promise<void> {
    try {
      // Track app launch
      await this.trackEvent('app_launch', 'lifecycle', {
        device_info: this.getDeviceInfo(),
        is_standalone: this.isStandalone()
      });

      console.log('Analytics initialized');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private static detectPlatform(userAgent: string): 'ios' | 'android' | 'web' {
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
    if (/Android/.test(userAgent)) return 'android';
    return 'web';
  }

  private static getOSVersion(userAgent: string): string {
    const match = userAgent.match(/(?:Android|iPhone OS|Mac OS X|Windows NT) ([\d._]+)/);
    return match ? match[1] : 'Unknown';
  }

  private static getDeviceModel(userAgent: string): string {
    // Simplified device model detection
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/iPhone/.test(userAgent)) return 'iPhone';
    if (/Android/.test(userAgent)) return 'Android Device';
    return 'Web Browser';
  }

  private static generateDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private static getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('mobile_analytics_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  private static async syncAnalyticsEvents(): Promise<void> {
    try {
      const events = this.getStoredEvents();
      if (events.length === 0) return;

      // Send events to server
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });

      if (response.ok) {
        // Clear stored events after successful sync
        localStorage.removeItem('mobile_analytics_events');
      }
    } catch (error) {
      console.error('Error syncing analytics events:', error);
    }
  }

  private static async syncOfflineData(): Promise<void> {
    try {
      // Sync any offline data when connection is restored
      await this.syncAnalyticsEvents();
      console.log('Offline data synced');
    } catch (error) {
      console.error('Error syncing offline data:', error);
    }
  }
}
