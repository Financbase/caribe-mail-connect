import React, { useState } from 'react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Github,
  Package,
  Code,
  BookOpen,
  Star,
  Activity,
  Globe,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

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

// Utility functions moved outside component
const getLanguageIcon = (language: string) => {
  const icons: Record<string, string> = {
    javascript: '⚡',
    python: '🐍',
    php: '🐘',
    java: '☕',
    csharp: '🔷',
    go: '🐹',
    ruby: '💎'
  };
  return icons[language] || '📦';
};

const getLanguageColor = (language: string) => {
  const colors: Record<string, string> = {
    javascript: 'bg-yellow-100 text-yellow-800',
    python: 'bg-blue-100 text-blue-800',
    php: 'bg-purple-100 text-purple-800',
    java: 'bg-red-100 text-red-800',
    csharp: 'bg-indigo-100 text-indigo-800',
    go: 'bg-cyan-100 text-cyan-800',
    ruby: 'bg-red-100 text-red-800'
  };
  return colors[language] || 'bg-gray-100 text-gray-800';
};

const formatCode = (code: string, language: string) => {
  let formattedCode = code;
  
  if (language === 'javascript') {
    formattedCode = code
      .replace(/\b(import|export|const|let|var|function|await|async|return|try|catch|if|else)\b/g, '<span class="text-blue-600">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-600">$1</span>')
      .replace(/\b(console|fetch|JSON)\b/g, '<span class="text-purple-600">$1</span>')
      .replace(/(['"`])(.*?)\1/g, '<span class="text-green-600">$1$2$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-red-600">$1</span>');
  } else if (language === 'python') {
    formattedCode = code
      .replace(/\b(import|from|as|def|class|return|try|except|if|else|elif|True|False|None)\b/g, '<span class="text-blue-600">$1</span>')
      .replace(/\b(print|len|str|int|float|list|dict|set)\b/g, '<span class="text-purple-600">$1</span>')
      .replace(/(['"`])(.*?)\1/g, '<span class="text-green-600">$1$2$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-red-600">$1</span>');
  }
  
  return formattedCode;
};

const getPackageManager = (sdk: Sdk) => {
  if (sdk.npm_package) return 'npm';
  if (sdk.pip_package) return 'pip';
  if (sdk.composer_package) return 'composer';
  if (sdk.maven_package) return 'maven';
  if (sdk.nuget_package) return 'nuget';
  if (sdk.go_module) return 'go';
  if (sdk.gem_package) return 'gem';
  return 'download';
};

export function SdksDownloadCenter() {
  const {
    sdks,
    loading
  } = useDevelopers();

  const [selectedSdk, setSelectedSdk] = useState<Sdk | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando SDKs...</p>
        </div>
      </div>
    );
  }

  const filteredSdks = sdks.filter(sdk => {
    const matchesSearch = sdk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sdk.language.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || sdk.language === selectedLanguage;
    
    return matchesSearch && matchesLanguage;
  });

  const languages = ['all', ...Array.from(new Set(sdks.map(s => s.language)))];

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(identifier);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SDKs Download Center</h1>
          <p className="text-muted-foreground">
            Official SDKs and libraries for integrating with PRMCMS API
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Github className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search SDKs</label>
              <Input
                placeholder="Search by name or language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Programming Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(language => (
                  <option key={language} value={language}>
                    {language === 'all' ? 'All Languages' : language.charAt(0).toUpperCase() + language.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SDKs List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Available SDKs ({filteredSdks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSdks.map((sdk) => (
                  <div
                    key={sdk.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSdk?.id === sdk.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSdk(sdk)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getLanguageIcon(sdk.language)}</span>
                        <Badge className={getLanguageColor(sdk.language)}>
                          {sdk.language}
                        </Badge>
                      </div>
                      <Badge variant="outline">v{sdk.version}</Badge>
                    </div>
                    <div className="font-semibold mb-1">{sdk.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {sdk.features.slice(0, 2).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SDK Details */}
        <div className="lg:col-span-2">
          {selectedSdk ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <span className="text-2xl mr-3">{getLanguageIcon(selectedSdk.language)}</span>
                      <div>
                        <div>{selectedSdk.name}</div>
                        <div className="text-sm font-normal text-muted-foreground">
                          Version {selectedSdk.version}
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="installation">Installation</TabsTrigger>
                    <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="docs">Documentation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Language</div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLanguageColor(selectedSdk.language)}>
                            {selectedSdk.language}
                          </Badge>
                          <span className="text-lg">{getLanguageIcon(selectedSdk.language)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Version</div>
                        <div className="font-medium">{selectedSdk.version}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Package Manager</div>
                        <div className="font-medium">
                          {getPackageManager(selectedSdk) === 'download' ? 'Direct Download' : getPackageManager(selectedSdk).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Documentation</div>
                        <Button variant="link" className="p-0 h-auto">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Docs
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Release Notes</h4>
                      <div className="text-sm text-muted-foreground">
                        {selectedSdk.release_notes}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="installation" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Installation Guide</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Installation Command</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(selectedSdk.installation_guide, 'installation')}
                            >
                              {copiedCode === 'installation' ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                            <Terminal className="h-4 w-4 inline mr-2" />
                            {selectedSdk.installation_guide}
                          </div>
                        </div>
                      </div>

                      {getPackageManager(selectedSdk) !== 'download' && (
                        <div>
                          <h4 className="font-semibold mb-3">Package Manager</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{getPackageManager(selectedSdk).toUpperCase()} Command</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(selectedSdk.npm_package || selectedSdk.pip_package || selectedSdk.composer_package || selectedSdk.maven_package || selectedSdk.nuget_package || selectedSdk.go_module || selectedSdk.gem_package || '', 'package-manager')}
                              >
                                {copiedCode === 'package-manager' ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                              <Terminal className="h-4 w-4 inline mr-2" />
                              {selectedSdk.npm_package || selectedSdk.pip_package || selectedSdk.composer_package || selectedSdk.maven_package || selectedSdk.nuget_package || selectedSdk.go_module || selectedSdk.gem_package || ''}
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-3">Manual Installation</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Download Source Code
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Github className="h-4 w-4 mr-2" />
                            Clone from GitHub
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quickstart" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Quick Start Guide</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Quick Start Code</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedSdk.quick_start, 'quickstart')}
                          >
                            {copiedCode === 'quickstart' ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-3 rounded">
                          <CodeBlock 
                            code={selectedSdk.quick_start}
                            language={selectedSdk.language}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Next Steps</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Read the full documentation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Code className="h-4 w-4 text-green-600" />
                          <span className="text-sm">Explore code examples</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-purple-600" />
                          <span className="text-sm">Test with the API Explorer</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedSdk.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Supported Operations</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <Badge variant="outline">Mailboxes</Badge>
                        <Badge variant="outline">Packages</Badge>
                        <Badge variant="outline">Customers</Badge>
                        <Badge variant="outline">Reports</Badge>
                        <Badge variant="outline">Webhooks</Badge>
                        <Badge variant="outline">Authentication</Badge>
                        <Badge variant="outline">Rate Limiting</Badge>
                        <Badge variant="outline">Error Handling</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="docs" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Documentation Links</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <BookOpen className="h-4 w-4 mr-2" />
                            API Reference
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Code className="h-4 w-4 mr-2" />
                            Code Examples
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Activity className="h-4 w-4 mr-2" />
                            Integration Guide
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Troubleshooting
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Community Resources</h4>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub Repository
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Globe className="h-4 w-4 mr-2" />
                            Community Forum
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Star className="h-4 w-4 mr-2" />
                            Sample Projects
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select an SDK to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 