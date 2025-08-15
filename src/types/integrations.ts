/**
 * Integration Types
 * Story 2.4: Advanced Integration Platform
 * 
 * TypeScript types for advanced integration platform, API marketplace,
 * webhook systems, custom connectors, and enterprise integration patterns
 */

// =====================================================
// INTEGRATION MARKETPLACE TYPES
// =====================================================

export interface IntegrationMarketplace {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: 'payment' | 'shipping' | 'communication' | 'analytics' | 'crm' | 'accounting' | 'inventory' | 'marketing';
  version: string;
  rating: number;
  reviews: number;
  featured: boolean;
  installed: boolean;
  pricing: IntegrationPricing;
  capabilities: string[];
  requirements: string[];
  documentation_url: string;
  support_url: string;
  screenshots?: string[];
  video_url?: string;
  changelog?: IntegrationChangelog[];
}

export interface IntegrationPricing {
  type: 'free' | 'subscription' | 'usage' | 'one_time';
  amount: number;
  period?: 'month' | 'year' | 'request' | 'transaction';
  free_tier?: {
    requests_per_month: number;
    features: string[];
  };
  enterprise_pricing?: boolean;
}

export interface IntegrationChangelog {
  version: string;
  date: string;
  changes: string[];
  breaking_changes?: string[];
}

// =====================================================
// WEBHOOK SYSTEM TYPES
// =====================================================

export interface WebhookSystem {
  id: string;
  name: string;
  url: string;
  events: string[];
  secret: string;
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  last_delivery?: string;
  delivery_attempts: number;
  success_rate: number;
  retry_policy?: WebhookRetryPolicy;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface WebhookRetryPolicy {
  max_attempts: number;
  backoff_strategy: 'linear' | 'exponential';
  initial_delay: number; // seconds
  max_delay: number; // seconds
  retry_on_status_codes: number[];
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  payload: any;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  attempts: number;
  response_status?: number;
  response_body?: string;
  delivered_at?: string;
  next_retry_at?: string;
  created_at: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: string;
  webhook_deliveries: WebhookDelivery[];
}

// =====================================================
// CUSTOM CONNECTOR TYPES
// =====================================================

export interface CustomConnector {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  source_type: string;
  target_type: string;
  mapping_rules: MappingRule[];
  transformation_logic: TransformationLogic;
  status: 'draft' | 'testing' | 'deployed' | 'error';
  version: string;
  created_at: string;
  updated_at: string;
  deployment_status: 'pending' | 'deploying' | 'deployed' | 'failed';
  test_results?: ConnectorTestResult;
}

export interface MappingRule {
  id: string;
  source_field: string;
  target_field: string;
  transformation?: string;
  required: boolean;
  default_value?: any;
  validation_rules?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'type' | 'format' | 'range' | 'custom';
  parameters: Record<string, any>;
  error_message: string;
}

export interface TransformationLogic {
  language: 'javascript' | 'python' | 'sql';
  code: string;
  dependencies?: string[];
  environment_variables?: Record<string, string>;
}

export interface ConnectorTestResult {
  success: boolean;
  tested_at: string;
  message: string;
  performance_metrics?: {
    execution_time: number;
    memory_usage: number;
    throughput: number;
  };
  errors?: ConnectorError[];
}

export interface ConnectorError {
  type: 'validation' | 'transformation' | 'connection' | 'runtime';
  message: string;
  field?: string;
  line_number?: number;
  stack_trace?: string;
}

// =====================================================
// CONNECTOR DEPLOYMENT TYPES
// =====================================================

export interface ConnectorDeployment {
  id: string;
  connector_id: string;
  subscription_id: string;
  status: 'deploying' | 'deployed' | 'failed' | 'stopped';
  environment: 'development' | 'staging' | 'production';
  version: string;
  deployed_at: string;
  health_status: 'healthy' | 'degraded' | 'unhealthy';
  performance_metrics: DeploymentMetrics;
  configuration?: DeploymentConfiguration;
}

export interface DeploymentMetrics {
  requests_per_minute: number;
  average_response_time: number;
  error_rate: number;
  uptime_percentage: number;
  last_updated?: string;
}

export interface DeploymentConfiguration {
  scaling: {
    min_instances: number;
    max_instances: number;
    target_cpu_utilization: number;
  };
  resources: {
    cpu_limit: string;
    memory_limit: string;
    storage_limit: string;
  };
  environment_variables: Record<string, string>;
  secrets: string[];
}

// =====================================================
// API MANAGEMENT TYPES
// =====================================================

export interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  authentication: 'none' | 'api_key' | 'oauth2' | 'jwt';
  rate_limit: number;
  status: 'active' | 'deprecated' | 'maintenance';
  version: string;
  documentation_url: string;
  parameters?: APIParameter[];
  responses?: APIResponse[];
  examples?: APIExample[];
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  location: 'query' | 'path' | 'header' | 'body';
  required: boolean;
  description: string;
  default_value?: any;
  validation?: ValidationRule[];
}

export interface APIResponse {
  status_code: number;
  description: string;
  schema?: any;
  examples?: any[];
}

export interface APIExample {
  name: string;
  description: string;
  request: {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
  };
  response: {
    status: number;
    headers?: Record<string, string>;
    body: any;
  };
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  rate_limit: number;
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
}

// =====================================================
// INTEGRATION METRICS TYPES
// =====================================================

export interface IntegrationMetrics {
  active_integrations: number;
  total_api_calls: number;
  api_call_trend: number;
  active_webhooks: number;
  webhook_success_rate: number;
  custom_connectors: number;
  connector_deployments: number;
  integration_health: number;
  data_sync_rate: number;
  sync_errors: number;
  last_updated: string;
}

export interface IntegrationHealth {
  integration_id: string;
  integration_name: string;
  status: 'healthy' | 'warning' | 'error';
  last_check: string;
  response_time: number;
  error_rate: number;
  uptime_percentage: number;
  issues?: HealthIssue[];
}

export interface HealthIssue {
  type: 'performance' | 'connectivity' | 'authentication' | 'rate_limit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  detected_at: string;
  resolved_at?: string;
}

// =====================================================
// INTEGRATION TEMPLATE TYPES
// =====================================================

export interface IntegrationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  integrations: string[];
  configuration_steps: string[];
  estimated_setup_time: number; // minutes
  prerequisites?: string[];
  benefits?: string[];
  use_cases?: string[];
}

export interface TemplateApplication {
  id: string;
  template_id: string;
  subscription_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress: number; // 0-100
  current_step: number;
  started_at: string;
  completed_at?: string;
  error_message?: string;
  applied_integrations: string[];
}

// =====================================================
// DATA SYNC TYPES
// =====================================================

export interface DataSyncConfiguration {
  id: string;
  integration_id: string;
  sync_type: 'real_time' | 'scheduled' | 'manual';
  direction: 'inbound' | 'outbound' | 'bidirectional';
  schedule?: SyncSchedule;
  field_mappings: FieldMapping[];
  filters?: SyncFilter[];
  transformation_rules?: TransformationRule[];
  conflict_resolution: 'source_wins' | 'target_wins' | 'manual' | 'timestamp';
}

export interface SyncSchedule {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  time?: string; // HH:MM format
  timezone: string;
  enabled: boolean;
}

export interface FieldMapping {
  source_field: string;
  target_field: string;
  transformation?: string;
  required: boolean;
}

export interface SyncFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface TransformationRule {
  field: string;
  rule_type: 'format' | 'calculate' | 'lookup' | 'conditional';
  parameters: Record<string, any>;
}

export interface SyncExecution {
  id: string;
  sync_configuration_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  records_processed: number;
  records_successful: number;
  records_failed: number;
  error_summary?: string;
  execution_log?: SyncLogEntry[];
}

export interface SyncLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  record_id?: string;
  details?: any;
}

// =====================================================
// ENTERPRISE INTEGRATION PATTERNS
// =====================================================

export interface EnterpriseIntegrationPattern {
  id: string;
  name: string;
  pattern_type: 'etl' | 'event_driven' | 'api_gateway' | 'message_queue' | 'microservices';
  description: string;
  components: PatternComponent[];
  configuration: PatternConfiguration;
  benefits: string[];
  use_cases: string[];
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface PatternComponent {
  id: string;
  name: string;
  type: 'source' | 'processor' | 'destination' | 'router' | 'transformer';
  configuration: Record<string, any>;
  dependencies: string[];
}

export interface PatternConfiguration {
  environment_variables: Record<string, string>;
  resource_requirements: {
    cpu: string;
    memory: string;
    storage: string;
  };
  scaling_policy: {
    min_replicas: number;
    max_replicas: number;
    target_utilization: number;
  };
  monitoring: {
    metrics: string[];
    alerts: AlertConfiguration[];
  };
}

export interface AlertConfiguration {
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  notification_channels: string[];
}
