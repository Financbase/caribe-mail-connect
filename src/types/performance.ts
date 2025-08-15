/**
 * Performance Types
 * Story 2.3: Performance Optimization & Scalability
 * 
 * TypeScript types for performance optimization, database optimization,
 * caching strategies, CDN integration, and horizontal scaling
 */

// =====================================================
// PERFORMANCE METRICS TYPES
// =====================================================

export interface PerformanceMetrics {
  overall_score: number;
  score_trend: number;
  avg_response_time: number;
  response_time_trend: number;
  core_web_vitals: CoreWebVitals;
  resource_usage: ResourceUsage;
  time_range: string;
  last_updated: string;
}

export interface CoreWebVitals {
  lcp: WebVitalMetric; // Largest Contentful Paint
  fid: WebVitalMetric; // First Input Delay
  cls: WebVitalMetric; // Cumulative Layout Shift
  fcp: WebVitalMetric; // First Contentful Paint
  ttfb?: WebVitalMetric; // Time to First Byte
  tti?: WebVitalMetric; // Time to Interactive
}

export interface WebVitalMetric {
  value: number;
  unit: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  percentile: number;
  threshold?: {
    good: number;
    poor: number;
  };
}

export interface ResourceUsage {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_usage: number;
  heap_size?: number;
  dom_nodes?: number;
}

// =====================================================
// CACHE METRICS TYPES
// =====================================================

export interface CacheMetrics {
  hit_rate: number;
  hit_rate_trend: number;
  miss_rate: number;
  total_requests: number;
  cache_size: number; // MB
  eviction_rate: number;
  memory_usage: number;
  layers: CacheLayers;
  last_updated: string;
}

export interface CacheLayers {
  browser: CacheLayer;
  cdn: CacheLayer;
  redis: CacheLayer;
  database: CacheLayer;
}

export interface CacheLayer {
  hit_rate: number;
  size: number; // MB
  ttl?: number; // seconds
  evictions?: number;
}

export interface CacheConfiguration {
  strategy: 'lru' | 'lfu' | 'fifo' | 'ttl';
  max_size: number; // MB
  default_ttl: number; // seconds
  compression_enabled: boolean;
  encryption_enabled: boolean;
  layers: CacheLayerConfig[];
}

export interface CacheLayerConfig {
  name: string;
  type: 'memory' | 'redis' | 'cdn' | 'browser';
  enabled: boolean;
  priority: number;
  config: Record<string, any>;
}

// =====================================================
// DATABASE METRICS TYPES
// =====================================================

export interface DatabaseMetrics {
  avg_query_time: number;
  query_time_trend: number;
  slow_queries: number;
  active_connections: number;
  max_connections: number;
  connection_trend: number;
  index_efficiency: number;
  index_trend: number;
  cache_hit_rate: number;
  cache_trend: number;
  table_sizes: Record<string, number>;
  last_updated: string;
}

export interface QueryPerformance {
  query_id: string;
  query_text: string;
  avg_execution_time: number;
  execution_count: number;
  total_time: number;
  rows_examined: number;
  rows_sent: number;
  index_usage: IndexUsage[];
  optimization_suggestions: string[];
}

export interface IndexUsage {
  table_name: string;
  index_name: string;
  usage_count: number;
  selectivity: number;
  efficiency_score: number;
}

export interface DatabaseOptimization {
  query_optimization: QueryOptimization[];
  index_recommendations: IndexRecommendation[];
  schema_suggestions: SchemaSuggestion[];
  connection_pool_config: ConnectionPoolConfig;
}

export interface QueryOptimization {
  query_id: string;
  original_time: number;
  optimized_time: number;
  improvement_percentage: number;
  optimization_type: string;
  changes_made: string[];
}

export interface IndexRecommendation {
  table_name: string;
  columns: string[];
  index_type: 'btree' | 'hash' | 'gin' | 'gist';
  estimated_improvement: number;
  impact_score: number;
  creation_cost: number;
}

export interface SchemaSuggestion {
  table_name: string;
  suggestion_type: 'normalization' | 'denormalization' | 'partitioning' | 'archiving';
  description: string;
  estimated_benefit: string;
  implementation_effort: 'low' | 'medium' | 'high';
}

export interface ConnectionPoolConfig {
  min_connections: number;
  max_connections: number;
  idle_timeout: number;
  connection_timeout: number;
  statement_timeout: number;
}

// =====================================================
// SCALABILITY METRICS TYPES
// =====================================================

export interface ScalabilityMetrics {
  active_instances: number;
  max_instances: number;
  avg_cpu_usage: number;
  avg_memory_usage: number;
  avg_disk_usage: number;
  avg_network_usage: number;
  auto_scaling_enabled: boolean;
  scaling_events: number;
  load_balancer_health: string;
  last_updated: string;
}

export interface AutoScalingConfig {
  enabled: boolean;
  min_instances: number;
  max_instances: number;
  target_cpu_utilization: number;
  target_memory_utilization: number;
  scale_up_threshold: number;
  scale_down_threshold: number;
  cooldown_period: number; // seconds
  scaling_policies: ScalingPolicy[];
}

export interface ScalingPolicy {
  id: string;
  name: string;
  metric: 'cpu' | 'memory' | 'network' | 'requests_per_second' | 'response_time';
  threshold: number;
  action: 'scale_up' | 'scale_down';
  adjustment: number;
  cooldown: number;
}

export interface LoadBalancerConfig {
  algorithm: 'round_robin' | 'least_connections' | 'ip_hash' | 'weighted_round_robin';
  health_check_enabled: boolean;
  health_check_interval: number;
  health_check_timeout: number;
  sticky_sessions: boolean;
  ssl_termination: boolean;
}

// =====================================================
// CDN METRICS TYPES
// =====================================================

export interface CDNMetrics {
  hit_rate: number;
  bandwidth_saved: number; // GB
  edge_locations: number;
  avg_edge_response_time: number;
  cache_purge_time: number;
  ssl_performance: string;
  compression_ratio: number;
  last_updated: string;
}

export interface CDNConfiguration {
  provider: 'cloudflare' | 'aws_cloudfront' | 'azure_cdn' | 'google_cdn';
  edge_locations: string[];
  cache_rules: CDNCacheRule[];
  compression_settings: CompressionSettings;
  ssl_settings: SSLSettings;
  security_settings: CDNSecuritySettings;
}

export interface CDNCacheRule {
  path_pattern: string;
  ttl: number; // seconds
  cache_key_fields: string[];
  bypass_conditions: string[];
  edge_cache_ttl: number;
  browser_cache_ttl: number;
}

export interface CompressionSettings {
  enabled: boolean;
  algorithms: ('gzip' | 'brotli' | 'deflate')[];
  compression_level: number;
  file_types: string[];
  min_file_size: number;
}

export interface SSLSettings {
  enabled: boolean;
  certificate_type: 'shared' | 'dedicated' | 'custom';
  tls_version: string;
  cipher_suites: string[];
  hsts_enabled: boolean;
  hsts_max_age: number;
}

export interface CDNSecuritySettings {
  ddos_protection: boolean;
  waf_enabled: boolean;
  rate_limiting: RateLimitConfig[];
  geo_blocking: GeoBlockConfig;
  bot_management: BotManagementConfig;
}

export interface RateLimitConfig {
  path_pattern: string;
  requests_per_minute: number;
  burst_size: number;
  action: 'block' | 'challenge' | 'log';
}

export interface GeoBlockConfig {
  enabled: boolean;
  blocked_countries: string[];
  allowed_countries: string[];
  action: 'block' | 'challenge';
}

export interface BotManagementConfig {
  enabled: boolean;
  challenge_bad_bots: boolean;
  allow_good_bots: boolean;
  custom_rules: BotRule[];
}

export interface BotRule {
  name: string;
  condition: string;
  action: 'allow' | 'block' | 'challenge';
  score_threshold: number;
}

// =====================================================
// OPTIMIZATION TYPES
// =====================================================

export interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'database' | 'caching' | 'cdn' | 'scaling' | 'frontend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  expected_improvement: string;
  implementation_effort: 'low' | 'medium' | 'high';
  estimated_impact: number; // 0-1 scale
}

export interface PerformanceOptimizationPlan {
  id: string;
  name: string;
  description: string;
  recommendations: OptimizationRecommendation[];
  estimated_duration: number; // hours
  estimated_cost: number;
  expected_improvements: ExpectedImprovement[];
  implementation_phases: OptimizationPhase[];
}

export interface ExpectedImprovement {
  metric: string;
  current_value: number;
  target_value: number;
  improvement_percentage: number;
  confidence_level: number;
}

export interface OptimizationPhase {
  phase_number: number;
  name: string;
  description: string;
  recommendations: string[];
  estimated_duration: number;
  dependencies: string[];
  success_criteria: string[];
}

// =====================================================
// MONITORING TYPES
// =====================================================

export interface PerformanceMonitoring {
  real_time_enabled: boolean;
  monitoring_interval: number; // seconds
  alert_thresholds: AlertThreshold[];
  dashboards: MonitoringDashboard[];
  reports: PerformanceReport[];
}

export interface AlertThreshold {
  metric: string;
  warning_threshold: number;
  critical_threshold: number;
  notification_channels: string[];
  cooldown_period: number;
}

export interface MonitoringDashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  refresh_interval: number;
  access_permissions: string[];
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'gauge' | 'table' | 'alert' | 'metric';
  title: string;
  data_source: string;
  configuration: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export interface PerformanceReport {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  metrics_included: string[];
  recipients: string[];
  format: 'pdf' | 'html' | 'json';
  schedule: ReportSchedule;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:MM format
  timezone: string;
  enabled: boolean;
}
