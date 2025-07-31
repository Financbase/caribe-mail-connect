import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProcessFlowDiagram } from '@/components/ui/ProcessFlowDiagram';
import { TrendChart } from '@/components/ui/TrendChart';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download, 
  Upload,
  Search,
  Filter,
  Calendar,
  Shield,
  Award,
  FileCheck,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useComplianceMonitoring } from '@/hooks/useComplianceMonitoring';

export const ComplianceMonitoring = () => {
  const {
    complianceChecklist,
    selfAudits,
    correctiveActions,
    documentationLibrary,
    certifications,
    complianceScores,
    regulatoryUpdates,
    createSelfAudit,
    updateCorrectiveAction,
    uploadDocument,
    updateCertification,
    isCreatingAudit,
    isUpdatingAction,
    isUploadingDocument
  } = useComplianceMonitoring();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate compliance metrics
  const totalItems = complianceChecklist.length;
  const completedItems = complianceChecklist.filter(item => item.status === 'completed').length;
  const complianceRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const overdueItems = complianceChecklist.filter(item => 
    item.status !== 'completed' && new Date(item.dueDate) < new Date()
  ).length;
  const upcomingItems = complianceChecklist.filter(item => 
    item.status !== 'completed' && 
    new Date(item.dueDate) > new Date() && 
    new Date(item.dueDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  // Chart data
  const complianceTrendData = complianceScores.map(score => ({
    name: score.month,
    score: score.score,
    target: 95
  }));

  const categoryBreakdownData = [
    { name: 'Completed', value: completedItems },
    { name: 'In Progress', value: complianceChecklist.filter(item => item.status === 'in_progress').length },
    { name: 'Overdue', value: overdueItems },
    { name: 'Not Started', value: complianceChecklist.filter(item => item.status === 'not_started').length }
  ];

  const processFlowDefinition = `
    graph TD
      A[Package Intake] --> B[Documentation Check]
      B --> C{Compliance Valid?}
      C -->|Yes| D[Process Package]
      C -->|No| E[Flag for Review]
      E --> F[Corrective Action]
      F --> G[Re-audit]
      G --> C
      D --> H[Storage & Notification]
      H --> I[Customer Access]
  `;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
            <Progress value={complianceRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {completedItems} of {totalItems} items completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueItems}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{upcomingItems}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Due within 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {certifications.filter(cert => cert.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Valid certifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Monitoring Sections */}
      <Tabs defaultValue="checklist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="checklist">Regulatory Checklist</TabsTrigger>
          <TabsTrigger value="audit">Self-Audit Tools</TabsTrigger>
          <TabsTrigger value="actions">Corrective Actions</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="process">Process Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-6">
          {/* Regulatory Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Checklist</CardTitle>
              <CardDescription>
                Track compliance with USPS CMRA requirements and Puerto Rico regulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="usps">USPS CMRA</SelectItem>
                    <SelectItem value="pr">Puerto Rico</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="privacy">Privacy</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <div className="space-y-3">
                {complianceChecklist
                  .filter(item => selectedCategory === 'all' || item.category === selectedCategory)
                  .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={item.status === 'completed'}
                          disabled
                        />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={item.category === 'usps' ? 'default' : 'secondary'}>
                              {item.category.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Due: {new Date(item.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            item.status === 'completed' ? 'default' :
                            item.status === 'in_progress' ? 'secondary' :
                            new Date(item.dueDate) < new Date() ? 'destructive' : 'outline'
                          }
                        >
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Self-Audit Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Self-Audits</CardTitle>
                <CardDescription>
                  Track internal audit results and findings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selfAudits.slice(0, 5).map((audit) => (
                    <div key={audit.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{audit.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(audit.auditDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={audit.score >= 90 ? 'default' : audit.score >= 70 ? 'secondary' : 'destructive'}>
                        {audit.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Self-Audit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart
                  data={complianceTrendData}
                  type="line"
                  dataKeys={['score', 'target']}
                  colors={['#0B5394', '#FF6B35']}
                  height={200}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          {/* Corrective Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Corrective Action Plans</CardTitle>
              <CardDescription>
                Track and manage corrective actions for compliance issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correctiveActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(action.dueDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Assigned: {action.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          action.status === 'completed' ? 'default' :
                          action.status === 'in_progress' ? 'secondary' :
                          'destructive'
                        }
                      >
                        {action.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          {/* Documentation Library */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documentation Library</CardTitle>
              <CardDescription>
                Store and manage compliance-related documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Input placeholder="Search documents..." className="max-w-sm" />
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentationLibrary.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{doc.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">{doc.category}</p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          {/* Certification Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Certification Management</CardTitle>
              <CardDescription>
                Track certification status and renewal dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Award className={`h-8 w-8 ${
                        cert.status === 'active' ? 'text-green-500' : 
                        cert.status === 'expired' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      <div>
                        <h4 className="font-medium">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuingAuthority}</p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          cert.status === 'active' ? 'default' :
                          cert.status === 'expired' ? 'destructive' : 'secondary'
                        }
                      >
                        {cert.status}
                      </Badge>
                      {cert.status === 'expired' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          {/* Process Flow Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Process Flow</CardTitle>
              <CardDescription>
                Visual representation of the compliance verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProcessFlowDiagram
                definition={processFlowDefinition}
                title="Package Processing Compliance Flow"
              />
            </CardContent>
          </Card>

          {/* Compliance Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={categoryBreakdownData}
                type="pie"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Compliance Item
        </Button>
      </div>
    </div>
  );
}; 