/**
 * Mobile Types
 * Story 2.5: Mobile & Multi-Platform Experience
 * 
 * TypeScript types for mobile and multi-platform features,
 * PWA capabilities, offline functionality, and cross-platform sync
 */

// =====================================================
// PWA (PROGRESSIVE WEB APP) TYPES
// =====================================================

export interface PWAMetrics {
  installed: boolean;
  cache_size: number; // MB
  offline_ready: boolean;
  update_available: boolean;
  last_updated: string;
  performance_score: number;
  installation_prompt_shown?: boolean;
  user_engagement?: PWAEngagement;
}

export interface PWAEngagement {
  sessions_count: number;
  average_session_duration: number; // minutes
  bounce_rate: number; // percentage
  retention_rate: number; // percentage
  feature_usage: FeatureUsage[];
}

export interface FeatureUsage {
  feature_name: string;
  usage_count: number;
  last_used: string;
  user_satisfaction: number; // 1-5 scale
}

export interface PWAInstallation {
  id: string;
  user_id: string;
  platform: 'web' | 'android' | 'ios';
  installed_at: string;
  uninstalled_at?: string;
  installation_source: 'browser_prompt' | 'manual' | 'app_store';
  device_info: DeviceInfo;
}

// =====================================================
// OFFLINE CAPABILITIES TYPES
// =====================================================

export interface OfflineCapabilities {
  enabled: boolean;
  cached_pages: number;
  cached_data: number; // number of items
  storage_used: number; // MB
  pending_sync: number;
  last_sync: string | null;
  sync_conflicts: number;
  offline_features?: OfflineFeature[];
}

export interface OfflineFeature {
  name: string;
  enabled: boolean;
  data_size: number; // MB
  last_updated: string;
  sync_priority: 'high' | 'medium' | 'low';
}

export interface OfflineData {
  id: string;
  type: 'package' | 'customer' | 'communication' | 'setting';
  data: any;
  created_at: string;
  updated_at: string;
  sync_status: 'pending' | 'synced' | 'conflict';
  version: number;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table_name: string;
  record_id: string;
  data: any;
  created_at: string;
  attempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
}

export interface SyncConflict {
  id: string;
  table_name: string;
  record_id: string;
  local_data: any;
  server_data: any;
  conflict_type: 'update_conflict' | 'delete_conflict' | 'create_conflict';
  created_at: string;
  resolution_strategy?: 'local_wins' | 'server_wins' | 'merge' | 'manual';
  resolved_at?: string;
}

// =====================================================
// PUSH NOTIFICATION TYPES
// =====================================================

export interface PushNotificationConfig {
  enabled: boolean;
  permission: 'default' | 'granted' | 'denied';
  token: string | null;
  delivered_today: number;
  open_rate: number; // percentage
  preferences: NotificationPreferences;
  last_sent: string | null;
}

export interface NotificationPreferences {
  package_updates: boolean;
  delivery_notifications: boolean;
  system_alerts: boolean;
  marketing_messages: boolean;
  quiet_hours?: QuietHours;
  sound_enabled: boolean;
  vibration_enabled: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  timezone: string;
}

export interface PushNotification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  status: 'scheduled' | 'sent' | 'delivered' | 'opened' | 'failed';
  platform: 'web' | 'android' | 'ios';
  notification_type: 'package_update' | 'delivery' | 'system_alert' | 'marketing';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'package_update' | 'delivery' | 'system_alert' | 'marketing';
  title_template: string;
  body_template: string;
  action_buttons?: NotificationAction[];
  icon?: string;
  badge?: string;
  sound?: string;
  vibration_pattern?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
  url?: string;
}

// =====================================================
// CROSS-PLATFORM SYNC TYPES
// =====================================================

export interface CrossPlatformSync {
  status: 'synced' | 'pending' | 'conflict' | 'error';
  last_sync: string | null;
  pending_operations: number;
  sync_conflicts: number;
  devices_connected: number;
  data_consistency: number; // percentage
}

export interface DeviceRegistration {
  id: string;
  user_id: string;
  device_id: string;
  device_name: string;
  platform: 'web' | 'android' | 'ios' | 'desktop';
  device_info: DeviceInfo;
  registered_at: string;
  last_active: string;
  sync_enabled: boolean;
  push_token?: string;
}

export interface DeviceInfo {
  platform: string;
  os_version: string;
  app_version: string;
  device_model: string;
  screen_resolution: string;
  user_agent?: string;
  timezone: string;
  language: string;
}

export interface SyncSession {
  id: string;
  device_id: string;
  started_at: string;
  completed_at?: string;
  status: 'active' | 'completed' | 'failed';
  operations_count: number;
  conflicts_resolved: number;
  data_transferred: number; // bytes
  error_message?: string;
}

// =====================================================
// MOBILE OPTIMIZATION TYPES
// =====================================================

export interface MobileOptimization {
  performance_score: number;
  battery_optimization: number;
  network_optimization: number;
  adaptive_loading: boolean;
  image_optimization: boolean;
  touch_optimization: boolean;
  device_specific_features: string[];
}

export interface PerformanceMetrics {
  load_time: number; // milliseconds
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
  time_to_interactive: number;
  memory_usage: number; // MB
  cpu_usage: number; // percentage
}

export interface BatteryOptimization {
  enabled: boolean;
  background_sync_limited: boolean;
  animation_reduced: boolean;
  location_tracking_optimized: boolean;
  screen_brightness_adaptive: boolean;
  estimated_battery_savings: number; // percentage
}

export interface NetworkOptimization {
  enabled: boolean;
  data_compression: boolean;
  image_quality_adaptive: boolean;
  prefetching_enabled: boolean;
  offline_first_strategy: boolean;
  estimated_data_savings: number; // percentage
}

export interface TouchOptimization {
  enabled: boolean;
  touch_targets_enlarged: boolean;
  gesture_recognition: boolean;
  haptic_feedback: boolean;
  swipe_navigation: boolean;
  accessibility_enhanced: boolean;
}

// =====================================================
// MOBILE ANALYTICS TYPES
// =====================================================

export interface MobileAnalytics {
  user_id: string;
  session_id: string;
  platform: 'web' | 'android' | 'ios';
  device_info: DeviceInfo;
  usage_metrics: UsageMetrics;
  performance_metrics: PerformanceMetrics;
  engagement_metrics: EngagementMetrics;
  recorded_at: string;
}

export interface UsageMetrics {
  session_duration: number; // minutes
  pages_visited: number;
  actions_performed: number;
  features_used: string[];
  offline_usage_time: number; // minutes
  sync_operations: number;
}

export interface EngagementMetrics {
  bounce_rate: number; // percentage
  time_on_page: Record<string, number>; // page -> minutes
  interaction_rate: number; // percentage
  feature_adoption: Record<string, number>; // feature -> usage count
  user_satisfaction: number; // 1-5 scale
}

// =====================================================
// MOBILE APP CONFIGURATION TYPES
// =====================================================

export interface MobileAppConfig {
  app_name: string;
  app_version: string;
  bundle_id: string;
  theme_config: ThemeConfig;
  feature_flags: FeatureFlags;
  api_endpoints: APIEndpoints;
  security_config: SecurityConfig;
  performance_config: PerformanceConfig;
}

export interface ThemeConfig {
  primary_color: string;
  secondary_color: string;
  background_color: string;
  text_color: string;
  dark_mode_enabled: boolean;
  adaptive_theme: boolean;
}

export interface FeatureFlags {
  offline_mode: boolean;
  push_notifications: boolean;
  biometric_auth: boolean;
  camera_integration: boolean;
  geolocation: boolean;
  background_sync: boolean;
  analytics_tracking: boolean;
}

export interface APIEndpoints {
  base_url: string;
  auth_endpoint: string;
  sync_endpoint: string;
  notification_endpoint: string;
  analytics_endpoint: string;
  timeout: number; // milliseconds
  retry_attempts: number;
}

export interface SecurityConfig {
  certificate_pinning: boolean;
  request_encryption: boolean;
  biometric_auth_required: boolean;
  session_timeout: number; // minutes
  max_failed_attempts: number;
  data_encryption_at_rest: boolean;
}

export interface PerformanceConfig {
  cache_size_limit: number; // MB
  image_quality: 'low' | 'medium' | 'high' | 'adaptive';
  animation_duration: number; // milliseconds
  lazy_loading_enabled: boolean;
  prefetch_enabled: boolean;
  background_sync_interval: number; // minutes
}

// =====================================================
// MOBILE DEPLOYMENT TYPES
// =====================================================

export interface MobileDeployment {
  id: string;
  version: string;
  platform: 'web' | 'android' | 'ios';
  build_number: number;
  release_notes: string;
  deployment_status: 'building' | 'testing' | 'deployed' | 'failed';
  deployed_at?: string;
  rollout_percentage: number;
  crash_rate: number;
  user_feedback: UserFeedback[];
}

export interface UserFeedback {
  id: string;
  user_id: string;
  rating: number; // 1-5 scale
  comment: string;
  category: 'bug' | 'feature_request' | 'performance' | 'ui_ux' | 'general';
  platform: string;
  app_version: string;
  submitted_at: string;
  status: 'new' | 'reviewed' | 'resolved' | 'dismissed';
}

export interface AppStoreMetrics {
  platform: 'android' | 'ios';
  downloads: number;
  ratings: AppRating[];
  reviews: AppReview[];
  conversion_rate: number; // percentage
  retention_rate: number; // percentage
  crash_free_sessions: number; // percentage
}

export interface AppRating {
  rating: number; // 1-5 scale
  count: number;
  percentage: number;
}

export interface AppReview {
  id: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  submitted_at: string;
  helpful_count: number;
  response?: string;
  responded_at?: string;
}
