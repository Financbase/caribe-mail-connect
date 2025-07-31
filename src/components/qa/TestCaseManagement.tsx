import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTube, Play, Plus, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQA, type TestCase } from '@/hooks/useQA';
import { format } from 'date-fns';

export const TestCaseManagement = () => {
  const { testCases, testRuns, createTestCase } = useQA();
  const [selectedTest, setSelectedTest] = useState<TestCase | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    test_type: 'manual' as const,
    category: 'functionality' as const,
    priority: 'medium' as const,
    preconditions: '',
    test_steps: [] as any[],
    expected_results: '',
    tags: [] as string[]
  });

  const filteredTestCases = testCases.filter(testCase => {
    if (categoryFilter !== 'all' && testCase.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && testCase.status !== statusFilter) return false;
    return true;
  });

  const getCategoryBadge = (category: string) => {
    const variants = {
      functionality: 'default',
      ui: 'secondary',
      api: 'outline',
      database: 'destructive',
      security: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[category as keyof typeof variants] || 'outline'}>
        {category}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'deprecated':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const handleCreateTestCase = () => {
    createTestCase({
      ...newTestCase,
      status: 'active' as const
    });
    setNewTestCase({
      title: '',
      description: '',
      test_type: 'manual',
      category: 'functionality',
      priority: 'medium',
      preconditions: '',
      test_steps: [],
      expected_results: '',
      tags: []
    });
    setShowCreateDialog(false);
  };

  const addTestStep = () => {
    setNewTestCase({
      ...newTestCase,
      test_steps: [...newTestCase.test_steps, { step: '', expected: '' }]
    });
  };

  const removeTestStep = (index: number) => {
    setNewTestCase({
      ...newTestCase,
      test_steps: newTestCase.test_steps.filter((_, i) => i !== index)
    });
  };

  const updateTestStep = (index: number, field: string, value: string) => {
    const updatedSteps = [...newTestCase.test_steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setNewTestCase({ ...newTestCase, test_steps: updatedSteps });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="test-cases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="test-cases">Test Cases</TabsTrigger>
          <TabsTrigger value="test-runs">Test Runs</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="test-cases">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Case Management
                </CardTitle>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test Case
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Create Test Case</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            value={newTestCase.title}
                            onChange={(e) => setNewTestCase({ ...newTestCase, title: e.target.value })}
                            placeholder="Test case title"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <Select
                            value={newTestCase.test_type}
                            onValueChange={(value: string) => setNewTestCase({ ...newTestCase, test_type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="automated">Automated</SelectItem>
                              <SelectItem value="integration">Integration</SelectItem>
                              <SelectItem value="performance">Performance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Category</label>
                          <Select
                            value={newTestCase.category}
                            onValueChange={(value: string) => setNewTestCase({ ...newTestCase, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="functionality">Functionality</SelectItem>
                              <SelectItem value="ui">UI</SelectItem>
                              <SelectItem value="api">API</SelectItem>
                              <SelectItem value="database">Database</SelectItem>
                              <SelectItem value="security">Security</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <Select
                            value={newTestCase.priority}
                            onValueChange={(value: string) => setNewTestCase({ ...newTestCase, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={newTestCase.description}
                          onChange={(e) => setNewTestCase({ ...newTestCase, description: e.target.value })}
                          placeholder="Detailed description of what this test validates"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Preconditions</label>
                        <Textarea
                          value={newTestCase.preconditions}
                          onChange={(e) => setNewTestCase({ ...newTestCase, preconditions: e.target.value })}
                          placeholder="What needs to be set up before running this test"
                          rows={2}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium">Test Steps</label>
                          <Button type="button" variant="outline" size="sm" onClick={addTestStep}>
                            <Plus className="h-3 w-3 mr-1" />
                            Add Step
                          </Button>
                        </div>
                        {newTestCase.test_steps.map((step, index) => (
                          <div key={index} className="border rounded p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Step {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeTestStep(index)}
                              >
                                Remove
                              </Button>
                            </div>
                            <Input
                              placeholder="Action to perform"
                              value={step.step}
                              onChange={(e) => updateTestStep(index, 'step', e.target.value)}
                            />
                            <Input
                              placeholder="Expected result"
                              value={step.expected}
                              onChange={(e) => updateTestStep(index, 'expected', e.target.value)}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="text-sm font-medium">Expected Results</label>
                        <Textarea
                          value={newTestCase.expected_results}
                          onChange={(e) => setNewTestCase({ ...newTestCase, expected_results: e.target.value })}
                          placeholder="Overall expected outcome of the test"
                          rows={2}
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTestCase} disabled={!newTestCase.title}>
                          Create Test Case
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="functionality">Functionality</SelectItem>
                    <SelectItem value="ui">UI</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Test Cases Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTestCases.map((testCase) => (
                      <TableRow key={testCase.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(testCase.status)}
                            <div>
                              <div className="font-medium">{testCase.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {testCase.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{testCase.test_type}</Badge>
                        </TableCell>
                        <TableCell>{getCategoryBadge(testCase.category)}</TableCell>
                        <TableCell>{getPriorityBadge(testCase.priority)}</TableCell>
                        <TableCell>
                          <Badge variant={testCase.status === 'active' ? 'default' : 'secondary'}>
                            {testCase.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTestCases.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No test cases found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-runs">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Suite</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Results</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testRuns.map((run) => (
                      <TableRow key={run.id}>
                        <TableCell>
                          <div className="font-medium">{run.test_suite_name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{run.test_type.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 text-sm">
                            <span className="text-success">{run.passed_tests} passed</span>
                            <span className="text-destructive">{run.failed_tests} failed</span>
                            <span className="text-muted-foreground">{run.skipped_tests} skipped</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {run.execution_time_ms ? `${(run.execution_time_ms / 1000).toFixed(1)}s` : '-'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(run.started_at), 'MMM d, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={run.status === 'completed' ? 'default' : 
                                        run.status === 'failed' ? 'destructive' : 'secondary'}>
                            {run.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {testRuns.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No test runs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Test Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground">Automated test scheduling and configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};