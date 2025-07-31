import React, { useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Code,
  Copy,
  Check,
  Play,
  BookOpen,
  Search,
  Filter,
  Download,
  ExternalLink,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  rate_limit: number;
  authentication: 'api_key' | 'bearer' | 'none';
  parameters: ApiParameter[];
  responses: ApiResponse[];
  examples: ApiExample[];
  deprecated_since?: string;
  replacement?: string;
}

interface ApiParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default_value?: string | number | boolean | Record<string, unknown>;
  example?: string | number | boolean | Record<string, unknown>;
}

interface ApiResponse {
  status_code: number;
  description: string;
  schema: Record<string, unknown>;
  example: Record<string, unknown>;
}

interface ApiExample {
  language: 'javascript' | 'python' | 'curl' | 'php' | 'java';
  code: string;
  description: string;
}

export function ApiDocumentation() {
  const {
    apiEndpoints,
    loading,
    getEndpointsByVersion,
    getDeprecatedEndpoints
  } = useDevelopers();

  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('YOUR_API_KEY');
  const [testResponse, setTestResponse] = useState<Record<string, unknown> | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando documentación de la API...</p>
        </div>
      </div>
    );
  }

  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesSearch = endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVersion = selectedVersion === 'all' || endpoint.version === selectedVersion;
    const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;
    
    return matchesSearch && matchesVersion && matchesMethod;
  });

  const versions = ['all', ...Array.from(new Set(apiEndpoints.map(e => e.version)))];
  const methods = ['all', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'PATCH':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      case 'beta':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = async (text: string, language: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(language);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const testEndpoint = async (endpoint: ApiEndpoint) => {
    setIsTesting(true);
    setTestResponse(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response based on endpoint
      const mockResponse = {
        status: 200,
        data: endpoint.responses[0]?.example || { message: 'Success' },
        headers: {
          'content-type': 'application/json',
          'x-rate-limit-remaining': '95'
        }
      };
      
      setTestResponse(mockResponse);
    } catch (error) {
      setTestResponse({
        status: 500,
        error: 'Failed to test endpoint',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const formatCode = (code: string, language: string) => {
    // Basic syntax highlighting for common patterns
    let formattedCode = code;
    
    if (language === 'javascript') {
      formattedCode = code
        .replace(/\b(const|let|var|function|await|async|import|export|return|try|catch|if|else)\b/g, '<span class="text-blue-600">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-600">$1</span>')
        .replace(/\b(console|fetch|JSON)\b/g, '<span class="text-purple-600">$1</span>')
        .replace(/(['"`])(.*?)\1/g, '<span class="text-green-600">$1$2$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="text-red-600">$1</span>');
    } else if (language === 'curl') {
      formattedCode = code
        .replace(/\b(curl|GET|POST|PUT|DELETE|PATCH)\b/g, '<span class="text-blue-600">$1</span>')
        .replace(/\b(-X|-H|-d)\b/g, '<span class="text-purple-600">$1</span>')
        .replace(/(['"`])(.*?)\1/g, '<span class="text-green-600">$1$2$1</span>');
    }
    
    return formattedCode;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground">
            Complete API reference with interactive examples and testing tools
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download OpenAPI Spec
          </Button>
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            API Explorer
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Endpoints</label>
              <Input
                placeholder="Search by path or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">API Version</label>
              <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {versions.map(version => (
                    <SelectItem key={version} value={version}>
                      {version === 'all' ? 'All Versions' : version.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">HTTP Method</label>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {methods.map(method => (
                    <SelectItem key={method} value={method}>
                      {method === 'all' ? 'All Methods' : method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">API Key</label>
              <Input
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deprecated Endpoints Warning */}
      {getDeprecatedEndpoints().length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Deprecated Endpoints:</strong> {getDeprecatedEndpoints().length} endpoints are deprecated and will be removed in future versions. 
            Please update your integrations to use the recommended replacements.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Endpoints ({filteredEndpoints.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredEndpoints.map((endpoint) => (
                  <div
                    key={endpoint.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedEndpoint?.id === endpoint.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedEndpoint(endpoint)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                      <Badge className={getStatusColor(endpoint.status)}>
                        {endpoint.status}
                      </Badge>
                    </div>
                    <div className="font-mono text-sm mb-1">{endpoint.path}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {endpoint.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Badge className={`mr-2 ${getMethodColor(selectedEndpoint.method)}`}>
                        {selectedEndpoint.method}
                      </Badge>
                      <span className="font-mono">{selectedEndpoint.path}</span>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {selectedEndpoint.description}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => testEndpoint(selectedEndpoint)}
                    disabled={isTesting}
                    size="sm"
                  >
                    {isTesting ? (
                      <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Test
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                    <TabsTrigger value="responses">Responses</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                    <TabsTrigger value="test">Test</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Version</div>
                        <div className="font-medium">{selectedEndpoint.version}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Rate Limit</div>
                        <div className="font-medium">{selectedEndpoint.rate_limit} requests/minute</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Authentication</div>
                        <div className="font-medium capitalize">{selectedEndpoint.authentication}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Status</div>
                        <Badge className={getStatusColor(selectedEndpoint.status)}>
                          {selectedEndpoint.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedEndpoint.deprecated_since && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Deprecated since {selectedEndpoint.deprecated_since}</strong>
                          {selectedEndpoint.replacement && (
                            <span> - Use <code className="bg-gray-100 px-1 rounded">{selectedEndpoint.replacement}</code> instead</span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="parameters" className="space-y-4">
                    {selectedEndpoint.parameters.length > 0 ? (
                      <div className="space-y-3">
                        {selectedEndpoint.parameters.map((param, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono font-medium">{param.name}</span>
                                <Badge variant={param.required ? 'destructive' : 'secondary'}>
                                  {param.required ? 'Required' : 'Optional'}
                                </Badge>
                                <Badge variant="outline">{param.type}</Badge>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {param.description}
                            </div>
                            {param.default_value && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Default:</span>
                                <code className="bg-gray-100 px-1 rounded ml-1">{JSON.stringify(param.default_value)}</code>
                              </div>
                            )}
                            {param.example && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Example:</span>
                                <code className="bg-gray-100 px-1 rounded ml-1">{JSON.stringify(param.example)}</code>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No parameters required for this endpoint
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="responses" className="space-y-4">
                    <div className="space-y-3">
                      {selectedEndpoint.responses.map((response, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={
                              response.status_code >= 200 && response.status_code < 300
                                ? 'bg-green-100 text-green-800'
                                : response.status_code >= 400 && response.status_code < 500
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }>
                              {response.status_code}
                            </Badge>
                            <span className="text-sm font-medium">{response.description}</span>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Response Example</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2), `response-${index}`)}
                              >
                                {copiedCode === `response-${index}` ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <CodeBlock 
                              code={JSON.stringify(response.example, null, 2)}
                              language="json"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="examples" className="space-y-4">
                    <div className="space-y-4">
                      {selectedEndpoint.examples.map((example, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{example.language}</Badge>
                              <span className="text-sm font-medium">{example.description}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(example.code, `example-${index}`)}
                            >
                              {copiedCode === `example-${index}` ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-gray-50 rounded p-3">
                            <CodeBlock 
                              code={example.code}
                              language={example.language}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="test" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Request URL</label>
                        <Input
                          value={`https://api.prmcms.com${selectedEndpoint.path}`}
                          readOnly
                          className="font-mono"
                        />
                      </div>
                      
                      {selectedEndpoint.method !== 'GET' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Request Body</label>
                          <Textarea
                            placeholder="Enter request body (JSON)"
                            className="font-mono"
                            rows={6}
                          />
                        </div>
                      )}

                      {testResponse && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Response</label>
                          <div className="bg-gray-50 rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={
                                testResponse.status >= 200 && testResponse.status < 300
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }>
                                {testResponse.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(testResponse, null, 2), 'test-response')}
                              >
                                {copiedCode === 'test-response' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <pre className="text-sm overflow-x-auto">
                              <code dangerouslySetInnerHTML={{
                                __html: formatCode(JSON.stringify(testResponse, null, 2), 'json')
                              }} />
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an endpoint to view documentation</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 