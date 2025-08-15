/**
 * Public API Manager
 * API Discipline - Public API Endpoints
 * 
 * Create versioned, documented public API with rate limiting
 */

import { supabase } from '@/integrations/supabase/client';

// =====================================================
// API TYPES
// =====================================================

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  version: string;
  description: string;
  parameters: APIParameter[];
  responses: APIResponse[];
  rate_limit: RateLimit;
  authentication_required: boolean;
  scopes: string[];
  deprecated: boolean;
  deprecation_date?: string;
  replacement_endpoint?: string;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };
}

export interface APIResponse {
  status_code: number;
  description: string;
  schema: any;
  example?: any;
}

export interface RateLimit {
  requests_per_minute: number;
  requests_per_hour: number;
  requests_per_day: number;
  burst_limit: number;
}

export interface APIKey {
  id: string;
  key: string;
  name: string;
  subscription_id: string;
  scopes: string[];
  rate_limit: RateLimit;
  enabled: boolean;
  last_used?: string;
  created_at: string;
  expires_at?: string;
}

export interface APIUsage {
  api_key_id: string;
  endpoint: string;
  method: string;
  timestamp: string;
  response_status: number;
  response_time_ms: number;
  request_size_bytes: number;
  response_size_bytes: number;
  ip_address: string;
  user_agent: string;
}

// =====================================================
// PUBLIC API MANAGER
// =====================================================

export class PublicAPIManager {
  private static instance: PublicAPIManager;
  private endpoints: Map<string, APIEndpoint> = new Map();
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    this.initializeEndpoints();
  }

  static getInstance(): PublicAPIManager {
    if (!PublicAPIManager.instance) {
      PublicAPIManager.instance = new PublicAPIManager();
    }
    return PublicAPIManager.instance;
  }

  /**
   * Initialize API endpoints
   */
  private initializeEndpoints(): void {
    // Customer endpoints
    this.registerEndpoint({
      id: 'get_customers_v1',
      path: '/api/v1/customers',
      method: 'GET',
      version: 'v1',
      description: 'Retrieve customers for the authenticated subscription',
      parameters: [
        {
          name: 'limit',
          type: 'number',
          required: false,
          description: 'Number of customers to return (max 100)',
          example: 20,
          validation: { min: 1, max: 100 }
        },
        {
          name: 'offset',
          type: 'number',
          required: false,
          description: 'Number of customers to skip',
          example: 0,
          validation: { min: 0 }
        },
        {
          name: 'search',
          type: 'string',
          required: false,
          description: 'Search customers by name or email',
          example: 'john@example.com'
        }
      ],
      responses: [
        {
          status_code: 200,
          description: 'Successful response',
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/Customer' } },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        },
        {
          status_code: 401,
          description: 'Unauthorized',
          schema: { $ref: '#/components/schemas/Error' }
        }
      ],
      rate_limit: {
        requests_per_minute: 60,
        requests_per_hour: 1000,
        requests_per_day: 10000,
        burst_limit: 10
      },
      authentication_required: true,
      scopes: ['customers:read'],
      deprecated: false
    });

    this.registerEndpoint({
      id: 'create_customer_v1',
      path: '/api/v1/customers',
      method: 'POST',
      version: 'v1',
      description: 'Create a new customer',
      parameters: [
        {
          name: 'name',
          type: 'string',
          required: true,
          description: 'Customer name',
          example: 'John Doe'
        },
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'Customer email address',
          example: 'john@example.com',
          validation: { pattern: '^[^@]+@[^@]+\\.[^@]+$' }
        },
        {
          name: 'phone',
          type: 'string',
          required: false,
          description: 'Customer phone number',
          example: '+1234567890'
        }
      ],
      responses: [
        {
          status_code: 201,
          description: 'Customer created successfully',
          schema: { $ref: '#/components/schemas/Customer' }
        },
        {
          status_code: 400,
          description: 'Bad request',
          schema: { $ref: '#/components/schemas/Error' }
        }
      ],
      rate_limit: {
        requests_per_minute: 30,
        requests_per_hour: 500,
        requests_per_day: 2000,
        burst_limit: 5
      },
      authentication_required: true,
      scopes: ['customers:write'],
      deprecated: false
    });

    // Package endpoints
    this.registerEndpoint({
      id: 'get_packages_v1',
      path: '/api/v1/packages',
      method: 'GET',
      version: 'v1',
      description: 'Retrieve packages for the authenticated subscription',
      parameters: [
        {
          name: 'customer_id',
          type: 'string',
          required: false,
          description: 'Filter packages by customer ID',
          example: 'cust_123'
        },
        {
          name: 'status',
          type: 'string',
          required: false,
          description: 'Filter packages by status',
          example: 'delivered',
          validation: { enum: ['pending', 'in_transit', 'arrived', 'delivered', 'returned'] }
        }
      ],
      responses: [
        {
          status_code: 200,
          description: 'Successful response',
          schema: {
            type: 'object',
            properties: {
              data: { type: 'array', items: { $ref: '#/components/schemas/Package' } },
              pagination: { $ref: '#/components/schemas/Pagination' }
            }
          }
        }
      ],
      rate_limit: {
        requests_per_minute: 100,
        requests_per_hour: 2000,
        requests_per_day: 20000,
        burst_limit: 20
      },
      authentication_required: true,
      scopes: ['packages:read'],
      deprecated: false
    });

    // Webhook endpoints
    this.registerEndpoint({
      id: 'create_webhook_v1',
      path: '/api/v1/webhooks',
      method: 'POST',
      version: 'v1',
      description: 'Create a webhook subscription',
      parameters: [
        {
          name: 'url',
          type: 'string',
          required: true,
          description: 'Webhook URL',
          example: 'https://example.com/webhook'
        },
        {
          name: 'events',
          type: 'array',
          required: true,
          description: 'Events to subscribe to',
          example: ['package.delivered', 'customer.created']
        }
      ],
      responses: [
        {
          status_code: 201,
          description: 'Webhook created successfully',
          schema: { $ref: '#/components/schemas/Webhook' }
        }
      ],
      rate_limit: {
        requests_per_minute: 10,
        requests_per_hour: 100,
        requests_per_day: 500,
        burst_limit: 2
      },
      authentication_required: true,
      scopes: ['webhooks:write'],
      deprecated: false
    });
  }

  /**
   * Register API endpoint
   */
  registerEndpoint(endpoint: APIEndpoint): void {
    const key = `${endpoint.method}:${endpoint.path}:${endpoint.version}`;
    this.endpoints.set(key, endpoint);
    console.log(`Registered API endpoint: ${key}`);
  }

  /**
   * Validate API request
   */
  async validateRequest(
    method: string,
    path: string,
    version: string,
    apiKey: string,
    parameters: any
  ): Promise<{ valid: boolean; error?: string; endpoint?: APIEndpoint }> {
    const key = `${method}:${path}:${version}`;
    const endpoint = this.endpoints.get(key);

    if (!endpoint) {
      return { valid: false, error: 'Endpoint not found' };
    }

    // Check if endpoint is deprecated
    if (endpoint.deprecated) {
      return { 
        valid: false, 
        error: `Endpoint deprecated. Use ${endpoint.replacement_endpoint || 'newer version'}` 
      };
    }

    // Validate API key
    const keyValidation = await this.validateAPIKey(apiKey, endpoint.scopes);
    if (!keyValidation.valid) {
      return { valid: false, error: keyValidation.error };
    }

    // Check rate limits
    const rateLimitCheck = await this.checkRateLimit(apiKey, endpoint.rate_limit);
    if (!rateLimitCheck.allowed) {
      return { valid: false, error: 'Rate limit exceeded' };
    }

    // Validate parameters
    const paramValidation = this.validateParameters(parameters, endpoint.parameters);
    if (!paramValidation.valid) {
      return { valid: false, error: paramValidation.error };
    }

    return { valid: true, endpoint };
  }

  /**
   * Validate API key
   */
  private async validateAPIKey(
    apiKey: string,
    requiredScopes: string[]
  ): Promise<{ valid: boolean; error?: string; keyData?: APIKey }> {
    try {
      const { data: keyData, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .eq('enabled', true)
        .single();

      if (error || !keyData) {
        return { valid: false, error: 'Invalid API key' };
      }

      // Check expiration
      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        return { valid: false, error: 'API key expired' };
      }

      // Check scopes
      const hasRequiredScopes = requiredScopes.every(scope => 
        keyData.scopes.includes(scope) || keyData.scopes.includes('*')
      );

      if (!hasRequiredScopes) {
        return { valid: false, error: 'Insufficient permissions' };
      }

      return { valid: true, keyData };
    } catch (error) {
      return { valid: false, error: 'API key validation failed' };
    }
  }

  /**
   * Check rate limits
   */
  private async checkRateLimit(
    apiKey: string,
    rateLimit: RateLimit
  ): Promise<{ allowed: boolean; resetTime?: number }> {
    const now = Date.now();
    const minuteKey = `${apiKey}:${Math.floor(now / 60000)}`;
    
    const current = this.rateLimitCache.get(minuteKey) || { count: 0, resetTime: now + 60000 };
    
    if (current.count >= rateLimit.requests_per_minute) {
      return { allowed: false, resetTime: current.resetTime };
    }

    // Update count
    current.count++;
    this.rateLimitCache.set(minuteKey, current);

    // Clean up old entries
    this.cleanupRateLimitCache();

    return { allowed: true };
  }

  /**
   * Validate request parameters
   */
  private validateParameters(
    parameters: any,
    schema: APIParameter[]
  ): { valid: boolean; error?: string } {
    for (const param of schema) {
      const value = parameters[param.name];

      // Check required parameters
      if (param.required && (value === undefined || value === null)) {
        return { valid: false, error: `Missing required parameter: ${param.name}` };
      }

      if (value !== undefined && value !== null) {
        // Type validation
        if (!this.validateParameterType(value, param.type)) {
          return { valid: false, error: `Invalid type for parameter ${param.name}. Expected ${param.type}` };
        }

        // Additional validation
        if (param.validation) {
          const validationResult = this.validateParameterConstraints(value, param.validation);
          if (!validationResult.valid) {
            return { valid: false, error: `Invalid value for parameter ${param.name}: ${validationResult.error}` };
          }
        }
      }
    }

    return { valid: true };
  }

  /**
   * Validate parameter type
   */
  private validateParameterType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }

  /**
   * Validate parameter constraints
   */
  private validateParameterConstraints(
    value: any,
    validation: APIParameter['validation']
  ): { valid: boolean; error?: string } {
    if (!validation) return { valid: true };

    // Min/max validation for numbers
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return { valid: false, error: `Value must be at least ${validation.min}` };
      }
      if (validation.max !== undefined && value > validation.max) {
        return { valid: false, error: `Value must be at most ${validation.max}` };
      }
    }

    // Pattern validation for strings
    if (typeof value === 'string' && validation.pattern) {
      const regex = new RegExp(validation.pattern);
      if (!regex.test(value)) {
        return { valid: false, error: 'Value does not match required pattern' };
      }
    }

    // Enum validation
    if (validation.enum && !validation.enum.includes(value)) {
      return { valid: false, error: `Value must be one of: ${validation.enum.join(', ')}` };
    }

    return { valid: true };
  }

  /**
   * Log API usage
   */
  async logAPIUsage(usage: APIUsage): Promise<void> {
    try {
      await supabase
        .from('api_usage')
        .insert(usage);

      // Update API key last used
      await supabase
        .from('api_keys')
        .update({ last_used: usage.timestamp })
        .eq('id', usage.api_key_id);
    } catch (error) {
      console.error('Error logging API usage:', error);
    }
  }

  /**
   * Generate API documentation
   */
  generateOpenAPISpec(): any {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: 'PRMCMS API',
        version: '1.0.0',
        description: 'Public API for PRMCMS platform'
      },
      servers: [
        { url: 'https://api.prmcms.com', description: 'Production server' },
        { url: 'https://staging-api.prmcms.com', description: 'Staging server' }
      ],
      paths: {},
      components: {
        schemas: {
          Customer: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' }
            }
          },
          Package: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              tracking_number: { type: 'string' },
              status: { type: 'string' },
              customer_id: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' }
            }
          },
          Pagination: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              limit: { type: 'number' },
              offset: { type: 'number' },
              has_more: { type: 'boolean' }
            }
          },
          Error: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
              code: { type: 'string' }
            }
          }
        },
        securitySchemes: {
          ApiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key'
          }
        }
      }
    };

    // Generate paths from endpoints
    for (const [key, endpoint] of this.endpoints) {
      const pathKey = endpoint.path.replace(/\{([^}]+)\}/g, '{$1}');
      
      if (!spec.paths[pathKey]) {
        spec.paths[pathKey] = {};
      }

      spec.paths[pathKey][endpoint.method.toLowerCase()] = {
        summary: endpoint.description,
        parameters: endpoint.parameters.map(param => ({
          name: param.name,
          in: param.name === 'id' ? 'path' : 'query',
          required: param.required,
          description: param.description,
          schema: { type: param.type },
          example: param.example
        })),
        responses: endpoint.responses.reduce((acc, response) => {
          acc[response.status_code] = {
            description: response.description,
            content: {
              'application/json': {
                schema: response.schema,
                example: response.example
              }
            }
          };
          return acc;
        }, {}),
        security: endpoint.authentication_required ? [{ ApiKeyAuth: [] }] : []
      };
    }

    return spec;
  }

  /**
   * Get API analytics
   */
  async getAPIAnalytics(subscriptionId: string, timeRange: string = '7d'): Promise<any> {
    try {
      const { data: usage, error } = await supabase
        .from('api_usage')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .gte('timestamp', this.getTimeRangeStart(timeRange));

      if (error) throw error;

      // Calculate analytics
      const totalRequests = usage?.length || 0;
      const successfulRequests = usage?.filter(u => u.response_status < 400).length || 0;
      const errorRequests = totalRequests - successfulRequests;
      const avgResponseTime = usage?.reduce((sum, u) => sum + u.response_time_ms, 0) / totalRequests || 0;

      const endpointStats = usage?.reduce((acc, u) => {
        const key = `${u.method} ${u.endpoint}`;
        if (!acc[key]) {
          acc[key] = { count: 0, avg_response_time: 0 };
        }
        acc[key].count++;
        acc[key].avg_response_time = (acc[key].avg_response_time + u.response_time_ms) / acc[key].count;
        return acc;
      }, {}) || {};

      return {
        total_requests: totalRequests,
        successful_requests: successfulRequests,
        error_requests: errorRequests,
        success_rate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
        avg_response_time: avgResponseTime,
        endpoint_stats: endpointStats
      };
    } catch (error) {
      console.error('Error getting API analytics:', error);
      return null;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private cleanupRateLimitCache(): void {
    const now = Date.now();
    for (const [key, value] of this.rateLimitCache) {
      if (value.resetTime < now) {
        this.rateLimitCache.delete(key);
      }
    }
  }

  private getTimeRangeStart(timeRange: string): string {
    const now = new Date();
    switch (timeRange) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    }
  }
}
