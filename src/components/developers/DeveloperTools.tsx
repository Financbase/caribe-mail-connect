import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Terminal,
  Code,
  Copy,
  Check,
  Play,
  Download,
  ExternalLink,
  Globe,
  Zap,
  Database,
  FileText,
  Settings,
  TestTube,
  Activity,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

interface PostmanCollection {
  id: string;
  name: string;
  description: string;
  version: string;
  endpoints_count: number;
  download_url: string;
  last_updated: string;
  tags: string[];
}

interface OpenAPISpec {
  id: string;
  name: string;
  version: string;
  format: 'json' | 'yaml';
  download_url: string;
  last_updated: string;
  endpoints_count: number;
}

export function DeveloperTools() {
  const { postmanCollections, openAPISpecs, loading } = useDevelopers();
  
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [selectedEndpoint, setSelectedEndpoint] = useState('/packages');
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Authorization": "Bearer YOUR_API_KEY",\n  "Content-Type": "application/json"\n}');
  const [requestBody, setRequestBody] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<PostmanCollection | null>(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const endpoints = [
    '/packages',
    '/packages/{id}',
    '/customers',
    '/customers/{id}',
    '/mailboxes',
    '/mailboxes/{id}',
    '/webhooks',
    '/webhooks/{id}',
    '/analytics/usage',
    '/analytics/performance'
  ];

  const handleTestRequest = async () => {
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setResponseData({
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-rate-limit-remaining': '999',
          'x-rate-limit-reset': new Date(Date.now() + 60000).toISOString()
        },
        data: {
          id: 'pkg_123456789',
          tracking_number: '1Z999AA1234567890',
          status: 'in_transit',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          customer: {
            id: 'cust_123',
            name: 'John Doe',
            email: 'john@example.com'
          },
          destination: {
            address: '123 Main St',
            city: 'San Juan',
            state: 'PR',
            zip_code: '00901'
          }
        }
      });
      setIsLoading(false);
    }, 2000);
  };

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(identifier);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const generateCurlCommand = () => {
    const baseUrl = 'https://api.prmcms.com/v1';
    const headers = JSON.parse(requestHeaders);
    const headerString = Object.entries(headers)
      .map(([key, value]) => `-H "${key}: ${value}"`)
      .join(' ');
    
    let curlCommand = `curl -X ${selectedMethod} "${baseUrl}${selectedEndpoint}" ${headerString}`;
    
    if (requestBody && ['POST', 'PUT', 'PATCH'].includes(selectedMethod)) {
      curlCommand += ` -d '${requestBody}'`;
    }
    
    return curlCommand;
  };

  const generateCodeSnippet = (language: string) => {
    const baseUrl = 'https://api.prmcms.com/v1';
    const headers = JSON.parse(requestHeaders);
    
    switch (language) {
      case 'javascript':
        return `const response = await fetch('${baseUrl}${selectedEndpoint}', {
  method: '${selectedMethod}',
  headers: ${JSON.stringify(headers, null, 2)},
  ${requestBody && ['POST', 'PUT', 'PATCH'].includes(selectedMethod) ? `body: JSON.stringify(${requestBody}),` : ''}
});

const data = await response.json();`;
      
      case 'python':
        return `import requests

response = requests.${selectedMethod.toLowerCase()}('${baseUrl}${selectedEndpoint}', 
  headers=${JSON.stringify(headers, null, 2)},
  ${requestBody && ['POST', 'PUT', 'PATCH'].includes(selectedMethod) ? `json=${requestBody},` : ''}
)

data = response.json()`;
      
      case 'curl':
        return generateCurlCommand();
      
      default:
        return `// Code snippet for ${language}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Terminal className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando herramientas de desarrollador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Developer Tools</h3>
          <p className="text-sm text-muted-foreground">
            Testing tools, Postman collections, and development utilities
          </p>
        </div>
      </div>

      {/* API Testing Tool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>API Testing Tool</span>
          </CardTitle>
          <CardDescription>
            Test API endpoints directly from the browser
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Configuration */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="method">HTTP Method</Label>
                  <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {methods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((endpoint) => (
                        <SelectItem key={endpoint} value={endpoint}>
                          {endpoint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="headers">Request Headers</Label>
                <Textarea
                  id="headers"
                  value={requestHeaders}
                  onChange={(e) => setRequestHeaders(e.target.value)}
                  rows={6}
                  placeholder="Enter JSON headers"
                />
              </div>

              {['POST', 'PUT', 'PATCH'].includes(selectedMethod) && (
                <div>
                  <Label htmlFor="body">Request Body</Label>
                  <Textarea
                    id="body"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={6}
                    placeholder="Enter JSON request body"
                  />
                </div>
              )}

              <Button onClick={handleTestRequest} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>

            {/* Response Display */}
            <div className="space-y-4">
              <Label>Response</Label>
              {responseData ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={responseData.status >= 200 && responseData.status < 300 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {responseData.status} {responseData.statusText}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {responseData.headers['x-rate-limit-remaining']} requests remaining
                    </span>
                  </div>
                  
                  <Tabs defaultValue="body" className="w-full">
                    <TabsList>
                      <TabsTrigger value="body">Response Body</TabsTrigger>
                      <TabsTrigger value="headers">Response Headers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="body">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto max-h-64">
                          <code>{JSON.stringify(responseData.data, null, 2)}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(JSON.stringify(responseData.data, null, 2), 'response')}
                        >
                          {copiedCode === 'response' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="headers">
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                          <code>{JSON.stringify(responseData.headers, null, 2)}</code>
                        </pre>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(JSON.stringify(responseData.headers, null, 2), 'headers')}
                        >
                          {copiedCode === 'headers' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded text-sm text-muted-foreground text-center">
                  Click "Send Request" to test the API endpoint
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Snippets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Code Snippets</span>
          </CardTitle>
          <CardDescription>
            Generate code snippets for the current request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="w-full">
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{generateCodeSnippet('javascript')}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateCodeSnippet('javascript'), 'js')}
                >
                  {copiedCode === 'js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="python" className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{generateCodeSnippet('python')}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateCodeSnippet('python'), 'py')}
                >
                  {copiedCode === 'py' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="curl" className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                  <code>{generateCodeSnippet('curl')}</code>
                </pre>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(generateCodeSnippet('curl'), 'curl')}
                >
                  {copiedCode === 'curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Postman Collections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Postman Collections</span>
          </CardTitle>
          <CardDescription>
            Download ready-to-use Postman collections for testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {postmanCollections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{collection.name}</h4>
                      <p className="text-sm text-muted-foreground">{collection.description}</p>
                    </div>
                    <Badge variant="outline">{collection.version}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Endpoints:</span>
                      <span className="font-medium">{collection.endpoints_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Updated:</span>
                      <span className="text-muted-foreground">
                        {new Date(collection.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {collection.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Collection
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OpenAPI Specifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>OpenAPI Specifications</span>
          </CardTitle>
          <CardDescription>
            Download OpenAPI/Swagger specifications for code generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {openAPISpecs.map((spec) => (
              <Card key={spec.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{spec.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        OpenAPI {spec.version} specification
                      </p>
                    </div>
                    <Badge variant="outline">{spec.format.toUpperCase()}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Endpoints:</span>
                      <span className="font-medium">{spec.endpoints_count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Updated:</span>
                      <span className="text-muted-foreground">
                        {new Date(spec.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Download {spec.format.toUpperCase()}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Development Resources</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Documentation</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="#" className="text-primary hover:underline">API Reference</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Authentication Guide</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Rate Limiting</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Error Codes</a></li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">SDKs & Libraries</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="#" className="text-primary hover:underline">JavaScript SDK</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Python SDK</a></li>
                <li>• <a href="#" className="text-primary hover:underline">PHP SDK</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Java SDK</a></li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Tools & Utilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="#" className="text-primary hover:underline">Webhook Tester</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Rate Limit Calculator</a></li>
                <li>• <a href="#" className="text-primary hover:underline">API Key Generator</a></li>
                <li>• <a href="#" className="text-primary hover:underline">Status Page</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 