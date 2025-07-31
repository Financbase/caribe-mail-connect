import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Code,
  BookOpen,
  Download,
  Webhook,
  BarChart3,
  Settings,
  Users,
  MessageSquare,
  Zap,
  Globe,
  Terminal,
  Github,
  ExternalLink,
  Activity,
  Shield,
  Clock
} from 'lucide-react';
import { ApiDocumentation } from '@/components/developers/ApiDocumentation';
import { SdksDownloadCenter } from '@/components/developers/SdksDownloadCenter';
import { ApiKeyManager } from '@/components/developers/ApiKeyManager';
import { WebhookDebugger } from '@/components/developers/WebhookDebugger';
import { RateLimitDashboard } from '@/components/developers/RateLimitDashboard';
import { IntegrationWizard } from '@/components/developers/IntegrationWizard';
import { DeveloperTools } from '@/components/developers/DeveloperTools';
import { CommunityHub } from '@/components/developers/CommunityHub';
import { useDevelopers } from '@/hooks/useDevelopers';

export function Developers() {
  const { apiStats, loading } = useDevelopers();
  const [activeTab, setActiveTab] = useState('documentation');

  const tabs = [
    {
      id: 'documentation',
      label: 'API Documentation',
      icon: BookOpen,
      description: 'Interactive API reference and examples'
    },
    {
      id: 'sdks',
      label: 'SDKs & Libraries',
      icon: Download,
      description: 'Download SDKs and client libraries'
    },
    {
      id: 'keys',
      label: 'API Keys',
      icon: Shield,
      description: 'Manage API keys and permissions'
    },
    {
      id: 'webhooks',
      label: 'Webhooks',
      icon: Webhook,
      description: 'Webhook configuration and debugging'
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      icon: BarChart3,
      description: 'API usage and rate limit monitoring'
    },
    {
      id: 'integration',
      label: 'Integration Wizard',
      icon: Zap,
      description: 'Step-by-step integration guides'
    },
    {
      id: 'tools',
      label: 'Developer Tools',
      icon: Terminal,
      description: 'Testing tools and utilities'
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      description: 'Developer forum and resources'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Code className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando herramientas de desarrollador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Developer Hub</h1>
          <Badge variant="secondary" className="ml-2">v2.1.0</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Comprehensive API documentation, SDKs, and developer tools for integrating with PRMCMS
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active API Keys</span>
            </div>
            <p className="text-2xl font-bold">{apiStats?.activeKeys || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">API Calls Today</span>
            </div>
            <p className="text-2xl font-bold">{apiStats?.callsToday?.toLocaleString() || '0'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Webhook className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Active Webhooks</span>
            </div>
            <p className="text-2xl font-bold">{apiStats?.activeWebhooks || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Avg Response Time</span>
            </div>
            <p className="text-2xl font-bold">{apiStats?.avgResponseTime || 0}ms</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started quickly with these common developer tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setActiveTab('keys')}
            >
              <Shield className="h-6 w-6" />
              <span>Generate API Key</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setActiveTab('integration')}
            >
              <Zap className="h-6 w-6" />
              <span>Integration Guide</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setActiveTab('tools')}
            >
              <Terminal className="h-6 w-6" />
              <span>API Testing</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => setActiveTab('community')}
            >
              <Users className="h-6 w-6" />
              <span>Join Community</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center space-y-1 p-4 data-[state=active]:bg-accent"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-xs">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="documentation" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">API Documentation</h2>
                  <p className="text-muted-foreground mb-4">
                    Interactive API reference with live examples and testing capabilities
                  </p>
                </div>
                <ApiDocumentation />
              </TabsContent>

              <TabsContent value="sdks" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">SDKs & Libraries</h2>
                  <p className="text-muted-foreground mb-4">
                    Download official SDKs and client libraries for your preferred programming language
                  </p>
                </div>
                <SdksDownloadCenter />
              </TabsContent>

              <TabsContent value="keys" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">API Key Management</h2>
                  <p className="text-muted-foreground mb-4">
                    Generate, manage, and monitor your API keys and permissions
                  </p>
                </div>
                <ApiKeyManager />
              </TabsContent>

              <TabsContent value="webhooks" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Webhook Configuration</h2>
                  <p className="text-muted-foreground mb-4">
                    Set up webhooks and debug delivery issues
                  </p>
                </div>
                <WebhookDebugger />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Usage Analytics</h2>
                  <p className="text-muted-foreground mb-4">
                    Monitor API usage, rate limits, and performance metrics
                  </p>
                </div>
                <RateLimitDashboard />
              </TabsContent>

              <TabsContent value="integration" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Integration Wizard</h2>
                  <p className="text-muted-foreground mb-4">
                    Step-by-step guides and code generators for common integrations
                  </p>
                </div>
                <IntegrationWizard />
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Developer Tools</h2>
                  <p className="text-muted-foreground mb-4">
                    Testing tools, Postman collections, and development utilities
                  </p>
                </div>
                <DeveloperTools />
              </TabsContent>

              <TabsContent value="community" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Developer Community</h2>
                  <p className="text-muted-foreground mb-4">
                    Connect with other developers, share knowledge, and get support
                  </p>
                </div>
                <CommunityHub />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Check our documentation, join the community, or contact support
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Support
              </Button>
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 