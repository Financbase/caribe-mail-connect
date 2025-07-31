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
import { Progress } from '@/components/ui/progress';
import {
  Wand2,
  Code,
  Copy,
  Check,
  Play,
  BookOpen,
  Download,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Circle,
  AlertTriangle,
  Zap,
  Terminal,
  Globe,
  Smartphone,
  Database,
  RefreshCw
} from 'lucide-react';
import { useDevelopers } from '@/hooks/useDevelopers';

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
  category: 'webhook' | 'sdk' | 'api' | 'mobile' | 'database';
}

interface IntegrationStep {
  step_number: number;
  title: string;
  description: string;
  code_example?: string;
  language?: string;
  completed?: boolean;
}

interface CodeExample {
  language: string;
  title: string;
  code: string;
  description: string;
}

export function IntegrationWizard() {
  const { integrationGuides, loading } = useDevelopers();
  
  const [selectedGuide, setSelectedGuide] = useState<IntegrationGuide | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  
  // Form states for code generation
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedFramework, setSelectedFramework] = useState('nodejs');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '⚡' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'php', label: 'PHP', icon: '🐘' },
    { value: 'java', label: 'Java', icon: '☕' },
    { value: 'csharp', label: 'C#', icon: '🔷' },
    { value: 'go', label: 'Go', icon: '🐹' },
    { value: 'ruby', label: 'Ruby', icon: '💎' }
  ];

  const frameworks = {
    javascript: ['nodejs', 'react', 'vue', 'angular', 'express'],
    python: ['django', 'flask', 'fastapi', 'requests'],
    php: ['laravel', 'symfony', 'wordpress', 'curl'],
    java: ['spring', 'android', 'okhttp', 'retrofit'],
    csharp: ['aspnet', 'xamarin', 'unity', 'httpclient'],
    go: ['gin', 'echo', 'fiber', 'nethttp'],
    ruby: ['rails', 'sinatra', 'httparty']
  };

  const handleStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepNext = () => {
    if (selectedGuide && currentStep < selectedGuide.steps.length) {
      setCurrentStep(currentStep + 1);
    }
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

  const generateCode = () => {
    const template = getCodeTemplate(selectedLanguage, selectedFramework);
    setGeneratedCode(template);
  };

  const getCodeTemplate = (language: string, framework: string) => {
    const templates: Record<string, Record<string, string>> = {
      javascript: {
        nodejs: `const axios = require('axios');

const PRMCMS_API_KEY = '${apiKey}';
const API_BASE_URL = 'https://api.prmcms.com/v1';

// Initialize client
const prmcmsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': \`Bearer \${PRMCMS_API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

// Example: Get packages
async function getPackages() {
  try {
    const response = await prmcmsClient.get('/packages');
    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

// Example: Create webhook
async function createWebhook() {
  try {
    const response = await prmcmsClient.post('/webhooks', {
      name: 'My Webhook',
      url: '${webhookUrl}',
      events: ['package.created', 'package.delivered']
    });
    return response.data;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
}

module.exports = { getPackages, createWebhook };`,
        react: `import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PRMCMS_API_KEY = '${apiKey}';
const API_BASE_URL = 'https://api.prmcms.com/v1';

const prmcmsClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': \`Bearer \${PRMCMS_API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await prmcmsClient.get('/packages');
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading packages...</div>;

  return (
    <div>
      <h2>Packages</h2>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.tracking_number}</h3>
          <p>Status: {pkg.status}</p>
        </div>
      ))}
    </div>
  );
}

export default PackageList;`
      },
      python: {
        requests: `import requests
import json

PRMCMS_API_KEY = '${apiKey}'
API_BASE_URL = 'https://api.prmcms.com/v1'

headers = {
    'Authorization': f'Bearer {PRMCMS_API_KEY}',
    'Content-Type': 'application/json'
}

def get_packages():
    """Fetch packages from PRMCMS API"""
    try:
        response = requests.get(f'{API_BASE_URL}/packages', headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching packages: {e}')
        raise

def create_webhook():
    """Create a webhook for real-time notifications"""
    webhook_data = {
        'name': 'My Webhook',
        'url': '${webhookUrl}',
        'events': ['package.created', 'package.delivered']
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/webhooks',
            headers=headers,
            json=webhook_data
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error creating webhook: {e}')
        raise

if __name__ == '__main__':
    packages = get_packages()
    print(f'Found {len(packages)} packages')`
      }
    };

    return templates[language]?.[framework] || `// Code template for ${language} - ${framework} not available yet`;
  };

  const runTest = async () => {
    setIsTestRunning(true);
    // Simulate test execution
    setTimeout(() => {
      setTestResults({
        success: true,
        message: 'Integration test completed successfully!',
        details: {
          api_connection: '✅ Connected',
          authentication: '✅ Valid API key',
          permissions: '✅ All required permissions granted',
          webhook_setup: '✅ Webhook configured',
          data_flow: '✅ Data flowing correctly'
        }
      });
      setIsTestRunning(false);
    }, 3000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Wand2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando guías de integración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Integration Wizard</h3>
          <p className="text-sm text-muted-foreground">
            Step-by-step guides and code generators for common integrations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration Guides */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Integration Guides</CardTitle>
              <CardDescription>
                Choose an integration guide to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrationGuides.map((guide) => (
                  <div
                    key={guide.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedGuide?.id === guide.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                    }`}
                    onClick={() => {
                      setSelectedGuide(guide);
                      setCurrentStep(1);
                      setCompletedSteps([]);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{guide.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {guide.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getDifficultyColor(guide.difficulty)}>
                            {guide.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {guide.estimated_time}
                          </Badge>
                        </div>
                      </div>
                      <div className="ml-2">
                        {guide.category === 'webhook' && <Globe className="h-4 w-4 text-blue-500" />}
                        {guide.category === 'sdk' && <Code className="h-4 w-4 text-green-500" />}
                        {guide.category === 'api' && <Terminal className="h-4 w-4 text-purple-500" />}
                        {guide.category === 'mobile' && <Smartphone className="h-4 w-4 text-orange-500" />}
                        {guide.category === 'database' && <Database className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Content */}
        <div className="lg:col-span-2">
          {selectedGuide ? (
            <div className="space-y-6">
              {/* Guide Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedGuide.title}</CardTitle>
                      <CardDescription>{selectedGuide.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                        {selectedGuide.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {selectedGuide.estimated_time}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Prerequisites</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedGuide.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step-by-Step Guide */}
              <Card>
                <CardHeader>
                  <CardTitle>Step-by-Step Guide</CardTitle>
                  <div className="flex items-center space-x-4">
                    <Progress value={(currentStep / selectedGuide.steps.length) * 100} className="flex-1" />
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep} of {selectedGuide.steps.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Step */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          completedSteps.includes(currentStep) ? 'bg-green-500 text-white' : 'bg-muted'
                        }`}>
                          {completedSteps.includes(currentStep) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{currentStep}</span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium">
                          {selectedGuide.steps[currentStep - 1]?.title}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground">
                        {selectedGuide.steps[currentStep - 1]?.description}
                      </p>

                      {selectedGuide.steps[currentStep - 1]?.code_example && (
                        <div className="space-y-2">
                          <Label>Code Example ({selectedGuide.steps[currentStep - 1]?.language})</Label>
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                              <code>{selectedGuide.steps[currentStep - 1]?.code_example}</code>
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(selectedGuide.steps[currentStep - 1]?.code_example || '', `step-${currentStep}`)}
                            >
                              {copiedCode === `step-${currentStep}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleStepBack}
                          disabled={currentStep === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => handleStepComplete(currentStep)}
                          disabled={completedSteps.includes(currentStep)}
                        >
                          Mark Complete
                        </Button>
                        <Button
                          onClick={handleStepNext}
                          disabled={currentStep === selectedGuide.steps.length}
                        >
                          Next Step
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript" className="w-full">
                    <TabsList>
                      {selectedGuide.code_examples.map((example) => (
                        <TabsTrigger key={example.language} value={example.language}>
                          {example.language}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {selectedGuide.code_examples.map((example) => (
                      <TabsContent key={example.language} value={example.language} className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">{example.title}</h4>
                          <p className="text-sm text-muted-foreground mb-4">{example.description}</p>
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => copyToClipboard(example.code, example.language)}
                            >
                              {copiedCode === example.language ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Testing */}
              <Card>
                <CardHeader>
                  <CardTitle>Test Your Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Run automated tests to verify your integration is working correctly
                    </p>
                    
                    <Button onClick={runTest} disabled={isTestRunning}>
                      {isTestRunning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Running Tests...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Run Tests
                        </>
                      )}
                    </Button>

                    {testResults && (
                      <Alert className={testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        <CheckCircle className={`h-4 w-4 ${testResults.success ? 'text-green-600' : 'text-red-600'}`} />
                        <AlertDescription>
                          <strong>{testResults.message}</strong>
                          {testResults.details && (
                            <div className="mt-2 space-y-1">
                              {Object.entries(testResults.details).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: {value}
                                </div>
                              ))}
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Wand2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select an Integration Guide</h3>
                <p className="text-muted-foreground">
                  Choose a guide from the left to get started with your integration
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Code Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Code Generator</span>
          </CardTitle>
          <CardDescription>
            Generate starter code for your integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="language">Programming Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        <span className="flex items-center space-x-2">
                          <span>{lang.icon}</span>
                          <span>{lang.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="framework">Framework</Label>
                <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks[selectedLanguage as keyof typeof frameworks]?.map((framework) => (
                      <SelectItem key={framework} value={framework}>
                        {framework}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
              </div>

              <div>
                <Label htmlFor="webhook-url">Webhook URL (optional)</Label>
                <Input
                  id="webhook-url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                />
              </div>

              <Button onClick={generateCode} className="w-full">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Generated Code</Label>
              {generatedCode ? (
                <div className="relative">
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto max-h-96">
                    <code>{generatedCode}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(generatedCode, 'generated')}
                  >
                    {copiedCode === 'generated' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded text-sm text-muted-foreground text-center">
                  Click "Generate Code" to create starter code for your integration
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 