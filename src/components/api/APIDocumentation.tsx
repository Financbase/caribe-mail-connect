/**
 * API Documentation Component
 * Story 5: API Documentation - Interactive API Documentation
 * 
 * Interactive API documentation with endpoint explorer,
 * code examples, and testing capabilities
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Code,
  ChevronDown,
  ChevronRight,
  Copy,
  Play,
  Book,
  Zap,
  Shield,
  Globe,
  Terminal,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { APIDocumentationService } from '@/services/apiDocumentation';
import type { APIEndpoint, APIDocumentation } from '@/services/apiDocumentation';

// =====================================================
// API DOCUMENTATION COMPONENT
// =====================================================

export function APIDocumentation() {
  const [selectedTag, setSelectedTag] = useState<string>('Authentication');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  const apiDoc = APIDocumentationService.getAPIDocumentation();
  const endpoints = APIDocumentationService.getEndpointsByTag(selectedTag);

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      PATCH: 'bg-orange-100 text-orange-800',
      DELETE: 'bg-red-100 text-red-800'
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    if (status.startsWith('2')) return 'text-green-600';
    if (status.startsWith('4')) return 'text-red-600';
    if (status.startsWith('5')) return 'text-red-600';
    return 'text-gray-600';
  };

  const toggleEndpoint = (endpointId: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpointId)) {
      newExpanded.delete(endpointId);
    } else {
      newExpanded.add(endpointId);
    }
    setExpandedEndpoints(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderEndpoint = (endpoint: APIEndpoint) => {
    const isExpanded = expandedEndpoints.has(endpoint.id);
    const codeExamples = APIDocumentationService.generateCodeExamples(endpoint);

    return (
      <Card key={endpoint.id} className="mb-4">
        <Collapsible open={isExpanded} onOpenChange={() => toggleEndpoint(endpoint.id)}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getMethodColor(endpoint.method)}>
                    {endpoint.method}
                  </Badge>
                  <div>
                    <CardTitle className="text-lg">{endpoint.path}</CardTitle>
                    <CardDescription>{endpoint.summary}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {endpoint.deprecated && (
                    <Badge variant="destructive">Deprecated</Badge>
                  )}
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground">{endpoint.description}</p>
                </div>

                {/* Parameters */}
                {endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Parameters</h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {param.name}
                            </code>
                            <Badge variant="outline">{param.in}</Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{param.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Type: {param.schema.type}
                            {param.example && ` • Example: ${param.example}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Request Body */}
                {endpoint.requestBody && (
                  <div>
                    <h4 className="font-semibold mb-3">Request Body</h4>
                    <div className="border rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-2">
                        {endpoint.requestBody.description}
                      </p>
                      {endpoint.requestBody.required && (
                        <Badge variant="destructive" className="text-xs mb-2">Required</Badge>
                      )}
                      <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                        <code>{JSON.stringify(endpoint.requestBody.content, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Responses */}
                <div>
                  <h4 className="font-semibold mb-3">Responses</h4>
                  <div className="space-y-2">
                    {endpoint.responses.map((response, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(response.statusCode)}>
                            {response.statusCode}
                          </Badge>
                          <span className="text-sm">{response.description}</span>
                        </div>
                        {response.content && (
                          <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                            <code>{JSON.stringify(response.content, null, 2)}</code>
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Examples */}
                <div>
                  <h4 className="font-semibold mb-3">Code Examples</h4>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(codeExamples).map(([language, code]) => (
                      <TabsContent key={language} value={language}>
                        <div className="relative">
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{code}</code>
                          </pre>
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={() => copyToClipboard(code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>

                {/* Try It Out */}
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedEndpoint(endpoint)}>
                    <Play className="h-4 w-4 mr-2" />
                    Try It Out
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy as cURL
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">{apiDoc.info.title}</h1>
              <p className="text-xl text-muted-foreground">Version {apiDoc.info.version}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {apiDoc.info.description}
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Base URL</h3>
                  <p className="text-sm text-muted-foreground">{apiDoc.servers[0].url}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-green-500" />
                <div>
                  <h3 className="font-semibold">Authentication</h3>
                  <p className="text-sm text-muted-foreground">Bearer Token</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="font-semibold">Rate Limit</h3>
                  <p className="text-sm text-muted-foreground">1000 req/hour</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {apiDoc.tags.map((tag) => (
                    <Button
                      key={tag.name}
                      variant={selectedTag === tag.name ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedTag(tag.name)}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedTag}</h2>
              <p className="text-muted-foreground">
                {apiDoc.tags.find(tag => tag.name === selectedTag)?.description}
              </p>
            </div>

            <div className="space-y-4">
              {endpoints.map(renderEndpoint)}
            </div>

            {endpoints.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No endpoints found</h3>
                  <p className="text-muted-foreground">
                    No endpoints are available for the selected category.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{' '}
                <a href={`mailto:${apiDoc.info.contact?.email}`} className="text-primary hover:underline">
                  {apiDoc.info.contact?.email}
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Terminal className="h-4 w-4 mr-2" />
                Download OpenAPI Spec
              </Button>
              <Button variant="outline" size="sm">
                <Code className="h-4 w-4 mr-2" />
                View SDKs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
