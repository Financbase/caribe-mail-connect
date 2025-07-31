import { useState, useEffect } from 'react';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  rate_limit: number; // requests per minute
  authentication: 'api_key' | 'bearer' | 'none';
  parameters: ApiParameter[];
  responses: ApiResponse[];
  examples: ApiExample[];
  deprecated_since?: string;
  replacement?: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

type CodeLanguage = 'javascript' | 'python' | 'curl' | 'php' | 'java' | 'csharp' | 'go' | 'ruby' | 'bash' | 'text' | string;

interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default_value?: JsonValue;
  example?: JsonValue;
  schema?: SchemaType;
}

interface ApiResponse {
  status_code: number;
  description: string;
  schema?: SchemaType;
  example?: JsonValue;
}

interface ApiExample {
  title?: string;
  description?: string;
  code: string;
  language: CodeLanguage;
}

// Base schema type
type BaseSchema = {
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'integer';
  format?: string;
  description?: string;
  nullable?: boolean;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
  example?: unknown;
  default?: unknown;
  [key: `x-${string}`]: unknown; // Allow OpenAPI extensions
};

// Schema with reference
type RefSchema = BaseSchema & {
  $ref: string;
};

// Object schema
type ObjectSchema = BaseSchema & {
  type: 'object';
  properties: Record<string, SchemaType>;
  required?: string[];
  additionalProperties?: boolean | SchemaType;
};

// Array schema
type ArraySchema = BaseSchema & {
  type: 'array';
  items: SchemaType;
};

// Combined schema types
type SchemaType = BaseSchema | RefSchema | ObjectSchema | ArraySchema;

// Helper type for OpenAPI components
type Components = {
  schemas: Record<string, SchemaType>;
  responses: Record<string, SchemaType>;
  parameters: Record<string, SchemaType>;
  examples: Record<string, unknown>;
};

// Type guard for reference schemas
const isRefSchema = (schema: SchemaType): schema is RefSchema => {
  return schema !== null && 
         typeof schema === 'object' && 
         '$ref' in schema && 
         typeof schema.$ref === 'string';
};

// Type guard for object schemas
const isObjectSchema = (schema: SchemaType): schema is ObjectSchema => {
  return schema !== null &&
         typeof schema === 'object' &&
         'type' in schema &&
         schema.type === 'object' &&
         'properties' in schema &&
         typeof schema.properties === 'object' &&
         schema.properties !== null;
};

// Type guard for array schemas
const isArraySchema = (schema: SchemaType): schema is ArraySchema => {
  return schema !== null &&
         typeof schema === 'object' &&
         'type' in schema &&
         schema.type === 'array' &&
         'items' in schema;
};

// Removed duplicate interface declarations since they're already defined above

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string;
  permissions: string[];
  rate_limit: number;
  status: 'active' | 'inactive' | 'suspended';
  usage_count: number;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  created_at: string;
  last_triggered: string;
  success_rate: number;
  retry_count: number;
  secret: string;
}

interface Sdk {
  id: string;
  name: string;
  language: 'javascript' | 'python' | 'php' | 'java' | 'csharp' | 'go' | 'ruby';
  version: string;
  download_url: string;
  documentation_url: string;
  github_url: string;
  npm_package?: string;
  pip_package?: string;
  composer_package?: string;
  maven_package?: string;
  nuget_package?: string;
  go_module?: string;
  gem_package?: string;
  release_notes: string;
  features: string[];
  installation_guide: string;
  quick_start: string;
}

interface RateLimit {
  endpoint: string;
  current_usage: number;
  limit: number;
  reset_time: string;
  window: 'minute' | 'hour' | 'day';
  remaining: number;
}

interface IntegrationGuide {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_time: string;
  prerequisites: string[];
  steps: IntegrationStep[];
  code_examples: CodeExample[];
  testing_instructions: string;
  troubleshooting: string[];
}

interface IntegrationStep {
  step_number: number;
  title: string;
  description: string;
  code_example?: string;
  language?: string;
}

interface CodeExample {
  language: string;
  title: string;
  code: string;
  description: string;
}

interface DeveloperForum {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'general' | 'api' | 'sdk' | 'integration' | 'bug' | 'feature';
  created_at: string;
  replies: number;
  views: number;
  status: 'open' | 'closed' | 'answered';
  tags: string[];
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  requester: string;
  requester_avatar?: string;
  created_at: string;
  votes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  comments: number;
  estimated_effort?: string;
  target_release?: string;
}

interface DeveloperSpotlight {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  contribution: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  featured_at: string;
  achievements: string[];
}

interface PostmanCollection {
  id: string;
  name: string;
  description: string;
  version: string;
  endpoints_count: number;
  download_url: string;
  last_updated: string;
  tags: string[];
  // Optional properties that might be present in some instances
  url?: string;
  updated_at?: string;
  endpoints?: string[];
}

interface OpenAPISpec {
  id: string;
  name: string;
  version: string;
  format: 'json' | 'yaml';
  download_url: string;
  last_updated: string;
  endpoints_count: number;
  // Optional properties that might be present in some instances
  url?: string;
  updated_at?: string;
}

interface UsageMetric {
  timestamp: string;
  endpoint: string;
  requests: number;
  errors: number;
  avg_response_time: number;
  unique_users: number;
}

interface ApiStats {
  activeKeys: number;
  callsToday: number;
  activeWebhooks: number;
  avgResponseTime: number;
}

// Mock data for demonstration
const mockApiEndpoints: ApiEndpoint[] = [
  {
    id: '1',
    method: 'GET',
    path: '/api/v1/mailboxes',
    description: 'Retrieve all mailboxes for the authenticated user',
    version: 'v1',
    status: 'active',
    rate_limit: 100,
    authentication: 'api_key',
    parameters: [
      {
        name: 'page',
        type: 'number',
        required: false,
        description: 'Page number for pagination',
        default_value: 1,
        example: 1
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of items per page',
        default_value: 20,
        example: 20
      }
    ],
    responses: [
      {
        status_code: 200,
        description: 'Success',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Mailbox'
              } as RefSchema
            },
            pagination: {
              $ref: '#/components/schemas/Pagination'
            } as RefSchema
          },
          required: ['data', 'pagination']
        } as ObjectSchema,
        example: {
          data: [
            {
              id: 'mb_123',
              name: 'My Mailbox',
              address: '123 Main St, San Juan, PR 00901',
              status: 'active'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 1,
            pages: 1
          }
        }
      }
    ],
    examples: [
      {
        language: 'javascript',
        code: `const response = await fetch('/api/v1/mailboxes', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
const mailboxes = await response.json();`,
        description: 'JavaScript example using fetch'
      },
      {
        language: 'curl',
        code: `curl -X GET "https://api.prmcms.com/api/v1/mailboxes" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
        description: 'cURL example'
      }
    ]
  },
  {
    id: '2',
    method: 'POST',
    path: '/api/v1/packages',
    description: 'Create a new package entry',
    version: 'v1',
    status: 'active',
    rate_limit: 50,
    authentication: 'api_key',
    parameters: [
      {
        name: 'tracking_number',
        type: 'string',
        required: true,
        description: 'Package tracking number',
        example: '1Z999AA1234567890'
      },
      {
        name: 'carrier',
        type: 'string',
        required: true,
        description: 'Shipping carrier',
        example: 'fedex'
      }
    ],
    responses: [
      {
        status_code: 201,
        description: 'Package created successfully',
        schema: { $ref: '#/components/schemas/Package' },
        example: {
          id: 'pkg_456',
          tracking_number: '1Z999AA1234567890',
          carrier: 'fedex',
          status: 'pending',
          created_at: '2024-03-15T10:30:00Z'
        }
      }
    ],
    examples: [
      {
        language: 'javascript',
        code: `// Replace with your actual API key from environment variables
const API_KEY = process.env.REACT_APP_API_KEY || 'YOUR_API_KEY_HERE';

const response = await fetch('/api/v1/packages', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${API_KEY}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tracking_number: '1Z999AA1234567890',
    carrier: 'fedex'
  })
});

if (!response.ok) {
  throw new Error(\`HTTP error! status: \${response.status}\`);
}

const packageData = await response.json();`,
        description: 'JavaScript example creating a package'
      }
    ]
  }
];

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'pk_live_1234567890abcdef',
    created_at: '2024-01-15T10:30:00Z',
    last_used: '2024-03-15T14:20:00Z',
    permissions: ['read:mailboxes', 'write:packages', 'read:reports'],
    rate_limit: 1000,
    status: 'active',
    usage_count: 15420
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'pk_test_abcdef1234567890',
    created_at: '2024-02-01T09:15:00Z',
    last_used: '2024-03-14T16:45:00Z',
    permissions: ['read:mailboxes', 'read:packages'],
    rate_limit: 100,
    status: 'active',
    usage_count: 2340
  }
];

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    name: 'Package Updates',
    url: 'https://myapp.com/webhooks/package-updates',
    events: ['package.created', 'package.delivered', 'package.failed'],
    status: 'active',
    created_at: '2024-01-20T11:00:00Z',
    last_triggered: '2024-03-15T13:30:00Z',
    success_rate: 98.5,
    retry_count: 2,
    secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET_1 || (process.env.NODE_ENV === 'development' ? 'mock_webhook_secret_1' : '')
  },
  {
    id: '2',
    name: 'Mailbox Alerts',
    url: 'https://myapp.com/webhooks/mailbox-alerts',
    events: ['mailbox.full', 'mailbox.expired'],
    status: 'active',
    created_at: '2024-02-10T14:20:00Z',
    last_triggered: '2024-03-14T09:15:00Z',
    success_rate: 99.2,
    retry_count: 0,
    secret: process.env.NEXT_PUBLIC_WEBHOOK_SECRET_2 || (process.env.NODE_ENV === 'development' ? 'mock_webhook_secret_2' : '')
  }
];

const mockSdks: Sdk[] = [
  {
    id: '1',
    name: 'PRMCMS JavaScript SDK',
    language: 'javascript',
    version: '2.1.0',
    download_url: 'https://github.com/prmcms/javascript-sdk/releases/latest',
    documentation_url: 'https://docs.prmcms.com/javascript',
    github_url: 'https://github.com/prmcms/javascript-sdk',
    npm_package: '@prmcms/sdk',
    release_notes: 'Added support for webhooks, improved error handling, and TypeScript definitions',
    features: ['Full API coverage', 'TypeScript support', 'Webhook handling', 'Rate limiting', 'Error retry'],
    installation_guide: 'npm install @prmcms/sdk',
    quick_start: `import { PRMCMS } from '@prmcms/sdk';

// Initialize with environment variable in production
const client = new PRMCMS(process.env.REACT_APP_API_KEY || '');

// Get all mailboxes
const mailboxes = await client.mailboxes.list();`
  },
  {
    id: '2',
    name: 'PRMCMS Python SDK',
    language: 'python',
    version: '1.8.0',
    download_url: 'https://github.com/prmcms/python-sdk/releases/latest',
    documentation_url: 'https://docs.prmcms.com/python',
    github_url: 'https://github.com/prmcms/python-sdk',
    pip_package: 'prmcms',
    release_notes: 'Added async support, improved webhook handling, and better error messages',
    features: ['Async/await support', 'Webhook handling', 'Rate limiting', 'Comprehensive docs'],
    installation_guide: 'pip install prmcms',
    quick_start: `import prmcms

client = prmcms.Client('YOUR_API_KEY')

# Get all mailboxes
mailboxes = client.mailboxes.list()`
  }
];

const mockRateLimits: RateLimit[] = [
  {
    endpoint: '/api/v1/mailboxes',
    current_usage: 45,
    limit: 100,
    reset_time: '2024-03-15T15:00:00Z',
    window: 'minute',
    remaining: 55
  },
  {
    endpoint: '/api/v1/packages',
    current_usage: 12,
    limit: 50,
    reset_time: '2024-03-15T15:00:00Z',
    window: 'minute',
    remaining: 38
  }
];

const mockIntegrationGuides: IntegrationGuide[] = [
  {
    id: '1',
    title: 'Getting Started with PRMCMS API',
    description: 'Learn how to authenticate and make your first API calls',
    difficulty: 'beginner',
    estimated_time: '15 minutes',
    prerequisites: ['Basic programming knowledge', 'API key'],
    steps: [
      {
        step_number: 1,
        title: 'Get your API key',
        description: 'Navigate to the API Keys section and create a new key',
        code_example: 'https://app.prmcms.com/developers/api-keys',
        language: 'text'
      },
      {
        step_number: 2,
        title: 'Install the SDK',
        description: 'Install the SDK for your preferred programming language',
        code_example: 'npm install @prmcms/sdk',
        language: 'bash'
      },
      {
        step_number: 3,
        title: 'Make your first API call',
        description: 'Authenticate and retrieve your mailboxes',
        code_example: `import { PRMCMS } from '@prmcms/sdk';

// Initialize with environment variable in production
const client = new PRMCMS(process.env.REACT_APP_API_KEY || '');
const mailboxes = await client.mailboxes.list();`,
        language: 'javascript'
      }
    ],
    code_examples: [
      {
        language: 'javascript',
        title: 'Basic Authentication',
        code: `import { PRMCMS } from '@prmcms/sdk';

// Initialize with environment variable in production
const client = new PRMCMS(process.env.REACT_APP_API_KEY || '');

// Test the connection
try {
  const mailboxes = await client.mailboxes.list();
  console.log('Connected successfully!');
} catch (error) {
  console.error('Authentication failed:', error.message);
}`,
        description: 'Test your API key and connection'
      }
    ],
    testing_instructions: 'Use the API Explorer to test endpoints before implementing in your code',
    troubleshooting: [
      'Make sure your API key is correct and active',
      'Check that you have the necessary permissions',
      'Verify your rate limits are not exceeded'
    ]
  }
];

const mockDeveloperForum: DeveloperForum[] = [
  {
    id: '1',
    title: 'Best practices for handling webhook failures',
    content: 'I\'m implementing webhooks for package updates and want to ensure reliable delivery. What are the best practices for handling failed webhook deliveries?',
    author: 'developer123',
    category: 'api',
    created_at: '2024-03-14T10:30:00Z',
    replies: 5,
    views: 127,
    status: 'answered',
    tags: ['webhooks', 'reliability', 'best-practices']
  },
  {
    id: '2',
    title: 'SDK not working with TypeScript',
    content: 'I\'m getting TypeScript errors when using the JavaScript SDK. The types don\'t seem to match the actual API responses.',
    author: 'typescript_dev',
    category: 'sdk',
    created_at: '2024-03-13T15:45:00Z',
    replies: 3,
    views: 89,
    status: 'open',
    tags: ['typescript', 'javascript-sdk', 'types']
  }
];

const mockFeatureRequests: FeatureRequest[] = [
  {
    id: '1',
    title: 'GraphQL API support',
    description: 'Add GraphQL API support for more flexible data querying and reduced over-fetching',
    requester: 'graphql_fan',
    created_at: '2024-03-10T09:00:00Z',
    votes: 42,
    status: 'in_progress',
    priority: 'medium',
    category: 'api',
    comments: 12
  },
  {
    id: '2',
    title: 'Real-time package tracking',
    description: 'Implement WebSocket connections for real-time package status updates',
    requester: 'realtime_dev',
    created_at: '2024-03-08T14:20:00Z',
    votes: 67,
    status: 'pending',
    priority: 'high',
    category: 'features',
    comments: 8
  }
];

// Mock data for new components
const mockDeveloperSpotlights: DeveloperSpotlight[] = [
  {
    id: '1',
    name: 'María González',
    avatar: '/avatars/maria.jpg',
    role: 'Senior Backend Developer',
    company: 'TechCorp PR',
    contribution: 'Contributed extensive API documentation and helped improve the webhook system',
    github_url: 'https://github.com/mariagonzalez',
    linkedin_url: 'https://linkedin.com/in/mariagonzalez',
    featured_at: '2024-03-15T10:00:00Z',
    achievements: ['Top Contributor', 'API Expert', 'Community Leader']
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    avatar: '/avatars/carlos.jpg',
    role: 'Full Stack Developer',
    company: 'StartupHub',
    contribution: 'Built comprehensive SDK for JavaScript and created integration examples',
    github_url: 'https://github.com/carlosrodriguez',
    twitter_url: 'https://twitter.com/carlosdev',
    featured_at: '2024-03-10T14:30:00Z',
    achievements: ['SDK Developer', 'JavaScript Expert', 'Open Source Contributor']
  },
  {
    id: '3',
    name: 'Ana Martínez',
    avatar: '/avatars/ana.jpg',
    role: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    contribution: 'Implemented CI/CD pipelines and improved deployment processes',
    github_url: 'https://github.com/anamartinez',
    linkedin_url: 'https://linkedin.com/in/anamartinez',
    featured_at: '2024-03-05T09:15:00Z',
    achievements: ['DevOps Expert', 'Infrastructure Guru', 'Performance Optimizer']
  }
];

const mockPostmanCollections: PostmanCollection[] = [
  {
    id: '1',
    name: 'PRMCMS API Collection',
    description: 'Complete API collection with all endpoints and examples',
    version: '2.1.0',
    endpoints_count: 45,
    download_url: '/collections/prmcms-api.json',
    last_updated: '2024-03-15T10:00:00Z',
    tags: ['api', 'complete', 'examples']
  },
  {
    id: '2',
    name: 'Webhook Testing Collection',
    description: 'Collection for testing webhook endpoints and payloads',
    version: '1.0.0',
    endpoints_count: 12,
    download_url: '/collections/webhook-testing.json',
    last_updated: '2024-03-10T14:30:00Z',
    tags: ['webhooks', 'testing', 'debugging']
  },
  {
    id: '3',
    name: 'Authentication Examples',
    description: 'Examples for different authentication methods',
    version: '1.2.0',
    endpoints_count: 8,
    download_url: '/collections/auth-examples.json',
    last_updated: '2024-03-08T16:45:00Z',
    tags: ['authentication', 'security', 'examples']
  }
];

const mockOpenAPISpecs: OpenAPISpec[] = [
  {
    id: '1',
    name: 'PRMCMS API v2.1',
    version: '2.1.0',
    format: 'json',
    download_url: '/specs/prmcms-api-v2.1.json',
    last_updated: '2024-03-15T10:00:00Z',
    endpoints_count: 45
  },
  {
    id: '2',
    name: 'PRMCMS API v2.1',
    version: '2.1.0',
    format: 'yaml',
    download_url: '/specs/prmcms-api-v2.1.yaml',
    last_updated: '2024-03-15T10:00:00Z',
    endpoints_count: 45
  }
];

const mockUsageMetrics: UsageMetric[] = [
  {
    timestamp: '2024-03-15T10:00:00Z',
    endpoint: '/packages',
    requests: 1250,
    errors: 12,
    avg_response_time: 145,
    unique_users: 89
  },
  {
    timestamp: '2024-03-15T09:00:00Z',
    endpoint: '/customers',
    requests: 890,
    errors: 8,
    avg_response_time: 132,
    unique_users: 67
  },
  {
    timestamp: '2024-03-15T08:00:00Z',
    endpoint: '/webhooks',
    requests: 456,
    errors: 3,
    avg_response_time: 98,
    unique_users: 34
  }
];

const mockApiStats: ApiStats = {
  activeKeys: 156,
  callsToday: 45678,
  activeWebhooks: 23,
  avgResponseTime: 142
};

export function useDevelopers() {
  const [apiEndpoints, setApiEndpoints] = useState<ApiEndpoint[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [sdks, setSdks] = useState<Sdk[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [integrationGuides, setIntegrationGuides] = useState<IntegrationGuide[]>([]);
  const [developerForum, setDeveloperForum] = useState<DeveloperForum[]>([]);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [developerSpotlights, setDeveloperSpotlights] = useState<DeveloperSpotlight[]>([]);
  const [postmanCollections, setPostmanCollections] = useState<PostmanCollection[]>([]);
  const [openAPISpecs, setOpenAPISpecs] = useState<OpenAPISpec[]>([]);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloperData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setApiEndpoints(mockApiEndpoints);
        setApiKeys(mockApiKeys);
        setWebhooks(mockWebhooks);
        setSdks(mockSdks);
        setRateLimits(mockRateLimits);
        setIntegrationGuides(mockIntegrationGuides);
        setDeveloperForum(mockDeveloperForum);
        setFeatureRequests(mockFeatureRequests);
        setDeveloperSpotlights(mockDeveloperSpotlights);
        setPostmanCollections(mockPostmanCollections);
        setOpenAPISpecs(mockOpenAPISpecs);
        setUsageMetrics(mockUsageMetrics);
        setApiStats(mockApiStats);
      } catch (error) {
        console.error('Error fetching developer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloperData();
  }, []);

  const createApiKey = async (name: string, permissions: string[]) => {
    const newKey = {
      id: Date.now().toString(),
      name,
      key: `pk_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      last_used: new Date().toISOString(),
      permissions,
      rate_limit: 1000,
      status: 'active' as const,
      usage_count: 0
    };
    setApiKeys(prev => [...prev, newKey]);
    return newKey;
  };

  const revokeApiKey = async (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, status: 'inactive' as const } : key
    ));
  };

  const regenerateApiKey = async (id: string) => {
    const newKey = `pk_${Math.random().toString(36).substr(2, 9)}`;
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, key: newKey, created_at: new Date().toISOString() } : key
    ));
    return newKey;
  };

  const createWebhook = async (name: string, url: string, events: string[]) => {
    const newWebhook = {
      id: Date.now().toString(),
      name,
      url,
      events,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      last_triggered: new Date().toISOString(),
      success_rate: 100,
      retry_count: 0,
      secret: `whsec_${Math.random().toString(36).substr(2, 9)}`
    };
    setWebhooks(prev => [...prev, newWebhook]);
    return newWebhook;
  };

  const testWebhook = async (webhookId: string) => {
    // Simulate webhook test
    return {
      id: Date.now().toString(),
      webhook_id: webhookId,
      event: 'package.created',
      payload: { package_id: 'pkg_123', status: 'created' },
      response_status: 200,
      response_body: 'OK',
      response_headers: { 'content-type': 'application/json' },
      request_headers: { 'content-type': 'application/json', 'x-signature': 'abc123' },
      created_at: new Date().toISOString(),
      duration: 245,
      success: true,
      retry_count: 0
    };
  };

  const getEndpointByPath = (path: string) => {
    return apiEndpoints.find(endpoint => endpoint.path === path);
  };

  const getEndpointsByVersion = (version: string) => {
    return apiEndpoints.filter(endpoint => endpoint.version === version);
  };

  const getDeprecatedEndpoints = () => {
    return apiEndpoints.filter(endpoint => endpoint.status === 'deprecated');
  };

  const getSdkByLanguage = (language: string) => {
    return sdks.find(sdk => sdk.language === language);
  };

  const getRateLimitByEndpoint = (endpoint: string) => {
    return rateLimits.find(limit => limit.endpoint === endpoint);
  };

  const createForumPost = async (post: Omit<DeveloperForum, 'id' | 'created_at' | 'replies' | 'views'>) => {
    const newPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      replies: 0,
      views: 0
    };
    setDeveloperForum(prev => [newPost, ...prev]);
    return newPost;
  };

  const createFeatureRequest = async (request: Omit<FeatureRequest, 'id' | 'created_at' | 'votes' | 'comments'>) => {
    const newRequest = {
      ...request,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      votes: 0,
      comments: 0
    };
    setFeatureRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  return {
    apiEndpoints,
    apiKeys,
    webhooks,
    sdks,
    rateLimits,
    integrationGuides,
    developerForum,
    featureRequests,
    developerSpotlights,
    postmanCollections,
    openAPISpecs,
    usageMetrics,
    apiStats,
    loading,
    createApiKey,
    revokeApiKey,
    regenerateApiKey,
    createWebhook,
    testWebhook,
    getEndpointByPath,
    getEndpointsByVersion,
    getDeprecatedEndpoints,
    getSdkByLanguage,
    getRateLimitByEndpoint,
    createForumPost,
    createFeatureRequest
  };
} 