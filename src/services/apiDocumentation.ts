/**
 * API Documentation Service
 * Story 5: API Documentation - Comprehensive API Documentation
 * 
 * Interactive API documentation with OpenAPI/Swagger integration,
 * code examples, authentication guides, and testing tools
 */

// =====================================================
// API DOCUMENTATION TYPES
// =====================================================

export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: APIParameter[];
  requestBody?: APIRequestBody;
  responses: APIResponse[];
  security: SecurityRequirement[];
  examples: APIExample[];
  deprecated?: boolean;
}

export interface APIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  description: string;
  required: boolean;
  schema: APISchema;
  example?: any;
}

export interface APIRequestBody {
  description: string;
  required: boolean;
  content: {
    [mediaType: string]: {
      schema: APISchema;
      examples?: { [key: string]: APIExample };
    };
  };
}

export interface APIResponse {
  statusCode: string;
  description: string;
  headers?: { [key: string]: APIParameter };
  content?: {
    [mediaType: string]: {
      schema: APISchema;
      examples?: { [key: string]: APIExample };
    };
  };
}

export interface APISchema {
  type: string;
  format?: string;
  properties?: { [key: string]: APISchema };
  items?: APISchema;
  required?: string[];
  enum?: any[];
  example?: any;
  description?: string;
}

export interface APIExample {
  summary: string;
  description?: string;
  value: any;
}

export interface SecurityRequirement {
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
  name: string;
  in?: 'query' | 'header' | 'cookie';
  scheme?: string;
  bearerFormat?: string;
  flows?: any;
  openIdConnectUrl?: string;
}

export interface APIDocumentation {
  info: {
    title: string;
    version: string;
    description: string;
    contact?: {
      name: string;
      email: string;
      url: string;
    };
    license?: {
      name: string;
      url: string;
    };
  };
  servers: APIServer[];
  tags: APITag[];
  endpoints: APIEndpoint[];
  components: {
    schemas: { [key: string]: APISchema };
    securitySchemes: { [key: string]: SecurityRequirement };
  };
}

export interface APIServer {
  url: string;
  description: string;
  variables?: { [key: string]: any };
}

export interface APITag {
  name: string;
  description: string;
  externalDocs?: {
    description: string;
    url: string;
  };
}

// =====================================================
// API DOCUMENTATION DATA
// =====================================================

export const API_DOCUMENTATION: APIDocumentation = {
  info: {
    title: 'PRMCMS API',
    version: '1.0.0',
    description: 'Comprehensive API for package and customer management system',
    contact: {
      name: 'PRMCMS Support',
      email: 'support@prmcms.com',
      url: 'https://prmcms.com/support'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'https://api.prmcms.com/v1',
      description: 'Production server'
    },
    {
      url: 'https://staging-api.prmcms.com/v1',
      description: 'Staging server'
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication and authorization endpoints'
    },
    {
      name: 'Customers',
      description: 'Customer management operations'
    },
    {
      name: 'Packages',
      description: 'Package tracking and management'
    },
    {
      name: 'Communications',
      description: 'Notification and communication endpoints'
    },
    {
      name: 'Analytics',
      description: 'Analytics and reporting endpoints'
    },
    {
      name: 'Billing',
      description: 'Subscription and billing management'
    }
  ],
  endpoints: [
    // Authentication Endpoints
    {
      id: 'auth_login',
      method: 'POST',
      path: '/auth/login',
      summary: 'User login',
      description: 'Authenticate user and return access token',
      tags: ['Authentication'],
      parameters: [],
      requestBody: {
        description: 'Login credentials',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  description: 'User email address'
                },
                password: {
                  type: 'string',
                  description: 'User password'
                }
              }
            }
          }
        }
      },
      responses: [
        {
          statusCode: '200',
          description: 'Successful authentication',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  access_token: { type: 'string' },
                  refresh_token: { type: 'string' },
                  expires_in: { type: 'number' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        },
        {
          statusCode: '401',
          description: 'Invalid credentials'
        }
      ],
      security: [],
      examples: [
        {
          summary: 'Login example',
          value: {
            email: 'user@example.com',
            password: 'securepassword123'
          }
        }
      ]
    },
    // Customer Endpoints
    {
      id: 'customers_list',
      method: 'GET',
      path: '/customers',
      summary: 'List customers',
      description: 'Retrieve a paginated list of customers',
      tags: ['Customers'],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number',
          required: false,
          schema: { type: 'integer', example: 1 }
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: { type: 'integer', example: 20 }
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search term',
          required: false,
          schema: { type: 'string' }
        }
      ],
      responses: [
        {
          statusCode: '200',
          description: 'List of customers',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        phone: { type: 'string' },
                        created_at: { type: 'string', format: 'date-time' }
                      }
                    }
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      page: { type: 'integer' },
                      limit: { type: 'integer' },
                      total: { type: 'integer' },
                      pages: { type: 'integer' }
                    }
                  }
                }
              }
            }
          }
        }
      ],
      security: [{ type: 'http', name: 'bearerAuth', scheme: 'bearer' }],
      examples: []
    },
    // Package Endpoints
    {
      id: 'packages_create',
      method: 'POST',
      path: '/packages',
      summary: 'Create package',
      description: 'Create a new package record',
      tags: ['Packages'],
      parameters: [],
      requestBody: {
        description: 'Package data',
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['customer_id', 'description'],
              properties: {
                customer_id: { type: 'string', description: 'Customer ID' },
                description: { type: 'string', description: 'Package description' },
                weight: { type: 'number', description: 'Package weight in pounds' },
                value: { type: 'number', description: 'Package value in USD' },
                tracking_number: { type: 'string', description: 'Tracking number' }
              }
            }
          }
        }
      },
      responses: [
        {
          statusCode: '201',
          description: 'Package created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  customer_id: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string' },
                  created_at: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      ],
      security: [{ type: 'http', name: 'bearerAuth', scheme: 'bearer' }],
      examples: [
        {
          summary: 'Create package example',
          value: {
            customer_id: 'cust_123',
            description: 'Electronics package',
            weight: 2.5,
            value: 299.99,
            tracking_number: 'TRK123456789'
          }
        }
      ]
    }
  ],
  components: {
    schemas: {
      Customer: {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          id: { type: 'string', description: 'Unique customer identifier' },
          name: { type: 'string', description: 'Customer full name' },
          email: { type: 'string', format: 'email', description: 'Customer email address' },
          phone: { type: 'string', description: 'Customer phone number' },
          address: { type: 'string', description: 'Customer address' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Package: {
        type: 'object',
        required: ['customer_id', 'description'],
        properties: {
          id: { type: 'string', description: 'Unique package identifier' },
          customer_id: { type: 'string', description: 'Associated customer ID' },
          description: { type: 'string', description: 'Package description' },
          weight: { type: 'number', description: 'Package weight in pounds' },
          value: { type: 'number', description: 'Package value in USD' },
          status: { 
            type: 'string', 
            enum: ['pending', 'in_transit', 'delivered', 'returned'],
            description: 'Package status'
          },
          tracking_number: { type: 'string', description: 'Tracking number' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Error message' },
          code: { type: 'string', description: 'Error code' },
          details: { type: 'object', description: 'Additional error details' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        name: 'bearerAuth',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      apiKey: {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header'
      }
    }
  }
};

// =====================================================
// API DOCUMENTATION SERVICE
// =====================================================

export class APIDocumentationService {

  /**
   * Get complete API documentation
   */
  static getAPIDocumentation(): APIDocumentation {
    return API_DOCUMENTATION;
  }

  /**
   * Get endpoints by tag
   */
  static getEndpointsByTag(tag: string): APIEndpoint[] {
    return API_DOCUMENTATION.endpoints.filter(endpoint => 
      endpoint.tags.includes(tag)
    );
  }

  /**
   * Get specific endpoint
   */
  static getEndpoint(id: string): APIEndpoint | null {
    return API_DOCUMENTATION.endpoints.find(endpoint => endpoint.id === id) || null;
  }

  /**
   * Generate OpenAPI specification
   */
  static generateOpenAPISpec(): any {
    const spec = {
      openapi: '3.0.3',
      info: API_DOCUMENTATION.info,
      servers: API_DOCUMENTATION.servers,
      tags: API_DOCUMENTATION.tags,
      paths: {},
      components: API_DOCUMENTATION.components
    };

    // Convert endpoints to OpenAPI paths
    API_DOCUMENTATION.endpoints.forEach(endpoint => {
      const path = endpoint.path;
      const method = endpoint.method.toLowerCase();

      if (!spec.paths[path]) {
        spec.paths[path] = {};
      }

      spec.paths[path][method] = {
        summary: endpoint.summary,
        description: endpoint.description,
        tags: endpoint.tags,
        parameters: endpoint.parameters,
        requestBody: endpoint.requestBody,
        responses: this.formatResponses(endpoint.responses),
        security: endpoint.security.length > 0 ? endpoint.security.map(s => ({ [s.name]: [] })) : [],
        deprecated: endpoint.deprecated || false
      };
    });

    return spec;
  }

  /**
   * Generate code examples for endpoint
   */
  static generateCodeExamples(endpoint: APIEndpoint): { [language: string]: string } {
    const examples: { [language: string]: string } = {};

    // JavaScript/Fetch example
    examples.javascript = this.generateJavaScriptExample(endpoint);
    
    // cURL example
    examples.curl = this.generateCurlExample(endpoint);
    
    // Python example
    examples.python = this.generatePythonExample(endpoint);

    return examples;
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  private static formatResponses(responses: APIResponse[]): any {
    const formatted: any = {};
    
    responses.forEach(response => {
      formatted[response.statusCode] = {
        description: response.description,
        headers: response.headers,
        content: response.content
      };
    });

    return formatted;
  }

  private static generateJavaScriptExample(endpoint: APIEndpoint): string {
    const hasBody = endpoint.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
    
    let example = `// ${endpoint.summary}\n`;
    example += `const response = await fetch('${API_DOCUMENTATION.servers[0].url}${endpoint.path}', {\n`;
    example += `  method: '${endpoint.method}',\n`;
    example += `  headers: {\n`;
    example += `    'Content-Type': 'application/json',\n`;
    example += `    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'\n`;
    example += `  }`;
    
    if (hasBody) {
      example += `,\n  body: JSON.stringify({\n`;
      example += `    // Request body data\n`;
      example += `  })`;
    }
    
    example += `\n});\n\n`;
    example += `const data = await response.json();\n`;
    example += `console.log(data);`;

    return example;
  }

  private static generateCurlExample(endpoint: APIEndpoint): string {
    const hasBody = endpoint.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
    
    let example = `# ${endpoint.summary}\n`;
    example += `curl -X ${endpoint.method} \\\n`;
    example += `  "${API_DOCUMENTATION.servers[0].url}${endpoint.path}" \\\n`;
    example += `  -H "Content-Type: application/json" \\\n`;
    example += `  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`;
    
    if (hasBody) {
      example += ` \\\n  -d '{\n    "key": "value"\n  }'`;
    }

    return example;
  }

  private static generatePythonExample(endpoint: APIEndpoint): string {
    const hasBody = endpoint.requestBody && ['POST', 'PUT', 'PATCH'].includes(endpoint.method);
    
    let example = `# ${endpoint.summary}\n`;
    example += `import requests\n\n`;
    example += `url = "${API_DOCUMENTATION.servers[0].url}${endpoint.path}"\n`;
    example += `headers = {\n`;
    example += `    "Content-Type": "application/json",\n`;
    example += `    "Authorization": "Bearer YOUR_ACCESS_TOKEN"\n`;
    example += `}\n`;
    
    if (hasBody) {
      example += `\ndata = {\n    # Request body data\n}\n\n`;
      example += `response = requests.${endpoint.method.toLowerCase()}(url, headers=headers, json=data)\n`;
    } else {
      example += `\nresponse = requests.${endpoint.method.toLowerCase()}(url, headers=headers)\n`;
    }
    
    example += `print(response.json())`;

    return example;
  }
}
