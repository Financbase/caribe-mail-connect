/**
 * AI/ML Types and Interfaces
 * Story 2.1: AI-Powered Automation & Intelligence
 * 
 * Comprehensive type definitions for machine learning models,
 * predictive analytics, intelligent automation, and AI-powered insights
 */

// =====================================================
// MACHINE LEARNING MODEL TYPES
// =====================================================

export type MLModelType = 
  | 'predictive_analytics'
  | 'classification'
  | 'regression'
  | 'clustering'
  | 'anomaly_detection'
  | 'recommendation'
  | 'natural_language_processing'
  | 'computer_vision'
  | 'time_series_forecasting'
  | 'reinforcement_learning';

export type ModelStatus = 'training' | 'trained' | 'deployed' | 'deprecated' | 'failed';

export type PredictionConfidence = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';

export interface MLModel {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  type: MLModelType;
  version: string;
  
  // Model configuration
  algorithm: string;
  hyperparameters: Record<string, any>;
  features: ModelFeature[];
  target_variable: string;
  
  // Training data
  training_data_source: string;
  training_data_size: number;
  training_start_date: string;
  training_end_date: string;
  
  // Performance metrics
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  mae?: number; // Mean Absolute Error for regression
  rmse?: number; // Root Mean Square Error for regression
  
  // Model lifecycle
  status: ModelStatus;
  training_duration_minutes: number;
  last_trained_at: string;
  deployed_at?: string;
  
  // Usage analytics
  prediction_count: number;
  average_prediction_time_ms: number;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface ModelFeature {
  name: string;
  type: 'numerical' | 'categorical' | 'text' | 'datetime' | 'boolean';
  importance_score: number;
  description?: string;
  preprocessing?: string[];
}

// =====================================================
// PREDICTIVE ANALYTICS TYPES
// =====================================================

export interface PredictionRequest {
  model_id: string;
  input_data: Record<string, any>;
  prediction_type: 'single' | 'batch';
  confidence_threshold?: number;
  explain_prediction?: boolean;
}

export interface PredictionResult {
  id: string;
  model_id: string;
  prediction_value: any;
  confidence_score: number;
  confidence_level: PredictionConfidence;
  probability_distribution?: Record<string, number>;
  feature_importance?: Record<string, number>;
  explanation?: PredictionExplanation;
  prediction_time_ms: number;
  created_at: string;
}

export interface PredictionExplanation {
  top_factors: Array<{
    feature: string;
    impact: number;
    direction: 'positive' | 'negative';
    description: string;
  }>;
  confidence_factors: string[];
  risk_factors: string[];
  recommendations: string[];
}

// =====================================================
// INTELLIGENT AUTOMATION TYPES
// =====================================================

export type AutomationTrigger = 
  | 'package_received'
  | 'customer_created'
  | 'payment_processed'
  | 'communication_received'
  | 'threshold_exceeded'
  | 'pattern_detected'
  | 'schedule_based'
  | 'ml_prediction';

export type AutomationAction = 
  | 'send_notification'
  | 'update_status'
  | 'assign_priority'
  | 'route_package'
  | 'schedule_delivery'
  | 'apply_discount'
  | 'escalate_issue'
  | 'generate_report'
  | 'trigger_workflow'
  | 'ml_inference';

export interface IntelligentAutomationRule {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  
  // AI-powered configuration
  trigger: {
    type: AutomationTrigger;
    conditions: AutomationCondition[];
    ml_model_id?: string;
    confidence_threshold?: number;
  };
  
  actions: Array<{
    type: AutomationAction;
    parameters: Record<string, any>;
    delay_minutes?: number;
    conditions?: AutomationCondition[];
  }>;
  
  // Intelligence features
  learning_enabled: boolean;
  adaptive_thresholds: boolean;
  performance_optimization: boolean;
  
  // Rule analytics
  execution_count: number;
  success_rate: number;
  average_execution_time_ms: number;
  cost_savings_estimate: number;
  
  // Rule lifecycle
  is_active: boolean;
  priority: number;
  last_executed_at?: string;
  next_execution_at?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'ml_predicts';
  value: any;
  logical_operator?: 'AND' | 'OR';
  ml_model_id?: string;
  confidence_threshold?: number;
}

// =====================================================
// AI INSIGHTS TYPES
// =====================================================

export type InsightType = 
  | 'trend_analysis'
  | 'anomaly_detection'
  | 'optimization_opportunity'
  | 'risk_assessment'
  | 'customer_behavior'
  | 'operational_efficiency'
  | 'revenue_optimization'
  | 'predictive_maintenance';

export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

export type InsightStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed';

export interface AIInsight {
  id: string;
  subscription_id: string;
  type: InsightType;
  title: string;
  description: string;
  
  // Insight data
  confidence_score: number;
  impact_score: number;
  priority: InsightPriority;
  category: string;
  
  // Supporting data
  data_points: Array<{
    metric: string;
    current_value: number;
    expected_value?: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  
  // Recommendations
  recommendations: Array<{
    action: string;
    expected_impact: string;
    effort_level: 'low' | 'medium' | 'high';
    timeline: string;
  }>;
  
  // ML model information
  generated_by_model?: string;
  model_version?: string;
  
  // Lifecycle
  status: InsightStatus;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  
  // Audit fields
  created_at: string;
  updated_at: string;
}

// =====================================================
// SMART ROUTING TYPES
// =====================================================

export interface SmartRoutingConfig {
  id: string;
  subscription_id: string;
  name: string;
  description: string;
  
  // Routing parameters
  optimization_goals: Array<'minimize_cost' | 'minimize_time' | 'maximize_satisfaction' | 'balance_load'>;
  constraints: RoutingConstraint[];
  
  // AI configuration
  ml_model_id?: string;
  real_time_optimization: boolean;
  learning_enabled: boolean;
  
  // Performance metrics
  average_delivery_time: number;
  cost_per_delivery: number;
  customer_satisfaction_score: number;
  route_efficiency_score: number;
  
  // Audit fields
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface RoutingConstraint {
  type: 'time_window' | 'vehicle_capacity' | 'driver_skills' | 'package_requirements' | 'customer_preferences';
  parameters: Record<string, any>;
  weight: number;
}

export interface RouteOptimizationResult {
  id: string;
  config_id: string;
  
  // Route details
  routes: OptimizedRoute[];
  total_distance: number;
  total_time_minutes: number;
  total_cost: number;
  
  // Optimization metrics
  efficiency_score: number;
  improvement_percentage: number;
  cost_savings: number;
  time_savings_minutes: number;
  
  // AI insights
  optimization_factors: string[];
  recommendations: string[];
  
  created_at: string;
}

export interface OptimizedRoute {
  driver_id: string;
  vehicle_id: string;
  stops: RouteStop[];
  total_distance: number;
  estimated_duration_minutes: number;
  estimated_cost: number;
  load_factor: number;
}

export interface RouteStop {
  package_id: string;
  customer_id: string;
  address: string;
  estimated_arrival: string;
  service_time_minutes: number;
  priority: number;
  special_requirements?: string[];
}

// =====================================================
// CUSTOMER INTELLIGENCE TYPES
// =====================================================

export interface CustomerIntelligenceProfile {
  customer_id: string;
  subscription_id: string;
  
  // Behavioral patterns
  package_frequency: number;
  preferred_carriers: string[];
  peak_activity_hours: number[];
  seasonal_patterns: Record<string, number>;
  
  // Preferences and predictions
  predicted_churn_probability: number;
  predicted_lifetime_value: number;
  satisfaction_score: number;
  engagement_level: 'low' | 'medium' | 'high';
  
  // Segmentation
  customer_segment: string;
  tier_recommendation: string;
  upsell_opportunities: string[];
  
  // Risk factors
  risk_factors: string[];
  fraud_risk_score: number;
  payment_risk_score: number;
  
  // Recommendations
  personalized_offers: string[];
  communication_preferences: Record<string, any>;
  service_recommendations: string[];
  
  // Model information
  last_analyzed_at: string;
  model_version: string;
  confidence_score: number;
  
  created_at: string;
  updated_at: string;
}

// =====================================================
// AI TRAINING AND DEPLOYMENT TYPES
// =====================================================

export interface TrainingJob {
  id: string;
  model_id: string;
  subscription_id: string;
  
  // Job configuration
  training_config: Record<string, any>;
  data_source_query: string;
  validation_split: number;
  
  // Job status
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress_percentage: number;
  
  // Results
  training_metrics: Record<string, number>;
  validation_metrics: Record<string, number>;
  feature_importance: Record<string, number>;
  
  // Resource usage
  compute_time_minutes: number;
  memory_usage_mb: number;
  cost_estimate: number;
  
  // Lifecycle
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  
  created_at: string;
  created_by: string;
}

export interface ModelDeployment {
  id: string;
  model_id: string;
  subscription_id: string;
  
  // Deployment configuration
  environment: 'development' | 'staging' | 'production';
  version: string;
  endpoint_url: string;
  
  // Performance requirements
  max_latency_ms: number;
  max_throughput_rps: number;
  auto_scaling_enabled: boolean;
  
  // Monitoring
  health_status: 'healthy' | 'degraded' | 'unhealthy';
  average_latency_ms: number;
  current_throughput_rps: number;
  error_rate: number;
  
  // Lifecycle
  deployed_at: string;
  last_health_check: string;
  
  created_at: string;
  created_by: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreateMLModelRequest {
  name: string;
  description: string;
  type: MLModelType;
  algorithm: string;
  features: string[];
  target_variable: string;
  training_data_query: string;
  hyperparameters?: Record<string, any>;
}

export interface TrainModelRequest {
  model_id: string;
  training_config?: Record<string, any>;
  validation_split?: number;
  auto_deploy?: boolean;
}

export interface CreateAutomationRuleRequest {
  name: string;
  description: string;
  trigger: IntelligentAutomationRule['trigger'];
  actions: IntelligentAutomationRule['actions'];
  learning_enabled?: boolean;
  adaptive_thresholds?: boolean;
}

export interface GenerateInsightsRequest {
  subscription_id: string;
  insight_types?: InsightType[];
  time_range?: {
    start: string;
    end: string;
  };
  confidence_threshold?: number;
}

export interface OptimizeRouteRequest {
  packages: string[];
  drivers: string[];
  vehicles: string[];
  optimization_goals: SmartRoutingConfig['optimization_goals'];
  constraints?: RoutingConstraint[];
}

// =====================================================
// AI SERVICE RESPONSE TYPES
// =====================================================

export interface AIServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    execution_time_ms: number;
    model_version?: string;
    confidence_score?: number;
    cost_estimate?: number;
  };
}

// =====================================================
// NATURAL LANGUAGE QUERY TYPES
// =====================================================

export interface NLQueryRequest {
  query: string;
  context?: ConversationalContext;
  subscription_id: string;
}

export interface NLQueryResult {
  query_id: string;
  original_query: string;
  intent: QueryIntent;
  entities: any[];
  sentiment: any;
  sql_generated: SQLGenerationResult | null;
  data_results: any[];
  visualization_config: any;
  natural_response: string;
  suggestions: QuerySuggestion[];
  confidence_score: number;
  processing_time_ms: number;
  context_used: ConversationalContext | null;
}

export interface QueryIntent {
  intent_type: 'analytics' | 'search' | 'action' | 'question';
  confidence: number;
  data_entities: string[];
  time_range?: string;
  aggregation_type?: string;
  filters?: string[];
  requires_data_query: boolean;
  business_context: string;
  complexity_score: number;
}

export interface SQLGenerationResult {
  sql: string;
  is_safe: boolean;
  confidence: number;
  explanation: string;
  tables_accessed: string[];
  estimated_rows: number;
  security_warnings: string[];
}

export interface ConversationalContext {
  previous_queries: string[];
  user_preferences: Record<string, any>;
  session_id: string;
  context_data: Record<string, any>;
}

export interface QuerySuggestion {
  text: string;
  type: string;
  confidence: number;
}

export interface NLSearchResult {
  results: any[];
  total_count: number;
  search_time_ms: number;
  suggestions: string[];
}

// =====================================================
// DOCUMENT PROCESSING TYPES
// =====================================================

export interface DocumentProcessingRequest {
  file_name: string;
  file_type: string;
  file_data: ArrayBuffer;
  context?: any;
  extraction_schema?: any;
  auto_execute_actions?: boolean;
}

export interface DocumentProcessingResult {
  processing_id: string;
  subscription_id: string;
  file_name: string;
  file_type: string;
  ocr_result: OCRResult;
  classification: DocumentClassification;
  extracted_content: ExtractedContent;
  insights: DocumentInsights;
  automated_actions: any[];
  confidence_score: number;
  processing_time_ms: number;
  status: string;
}

export interface DocumentClassification {
  document_type: string;
  category: string;
  subcategory?: string;
  confidence: number;
  urgency_level: 'low' | 'medium' | 'high';
  sensitivity_level: 'low' | 'medium' | 'high';
  requires_human_review: boolean;
  processing_priority: number;
  tags: string[];
  metadata: Record<string, any>;
}

export interface ExtractedContent {
  structured_data: Record<string, any>;
  key_entities: any[];
  important_dates: string[];
  monetary_amounts: number[];
  contact_information: any[];
  action_items: string[];
  confidence: number;
  validation_errors: string[];
  extraction_metadata: Record<string, any>;
}

export interface DocumentInsights {
  summary: string;
  key_insights: string[];
  sentiment_analysis: any;
  compliance_flags: string[];
  risk_assessment: any;
  business_impact: any;
  recommended_actions: string[];
  related_documents: any[];
  confidence: number;
}

export interface OCRResult {
  raw_text: string;
  cleaned_text: string;
  confidence: number;
  language: string;
  word_count: number;
  metadata: Record<string, any>;
}

export interface DocumentWorkflow {
  id: string;
  name: string;
  document_types: string[];
  processing_steps: any[];
  automation_rules: any[];
  is_active: boolean;
}

// =====================================================
// INTELLIGENT DECISION ENGINE TYPES
// =====================================================

export interface DecisionRequest {
  request_id: string;
  decision_type: string;
  description: string;
  context: Record<string, any>;
  customer_id?: string;
  decision_threshold?: number;
  auto_execute?: boolean;
}

export interface DecisionResult {
  decision_id: string;
  request_id: string;
  subscription_id: string;
  decision: string;
  confidence_score: number;
  decision_score: number;
  explanation: DecisionExplanation;
  factors_considered: DecisionFactor[];
  risk_assessment: any;
  alternative_options: any[];
  recommended_actions: string[];
  processing_time_ms: number;
  timestamp: string;
}

export interface DecisionRule {
  id: string;
  name: string;
  description: string;
  conditions: any[];
  actions: any[];
  weight: number;
  priority: number;
  is_active: boolean;
}

export interface DecisionContext {
  request: DecisionRequest;
  historical_decisions: any[];
  business_metrics: Record<string, any>;
  customer_context: any;
  external_factors: Record<string, any>;
  system_state: Record<string, any>;
  timestamp: string;
}

export interface DecisionFactor {
  name: string;
  type: 'business_rule' | 'ml_prediction' | 'historical_data' | 'external_factor';
  weight: number;
  impact: number;
  description: string;
}

export interface DecisionExplanation {
  summary: string;
  detailed_explanation: string;
  key_factors: any[];
  confidence_breakdown: Record<string, number>;
  alternative_scenarios: any[];
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  decision_type: string;
  conditions: any[];
  weight: number;
  priority: number;
  is_active: boolean;
}

export interface MLDecisionModel {
  id: string;
  name: string;
  description: string;
  decision_type: string;
  model_type: string;
  accuracy: number;
  status: 'training' | 'deployed' | 'retired';
  features: string[];
  created_at: string;
}
