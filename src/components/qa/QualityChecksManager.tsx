import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessFlowDiagram } from '@/components/ui/ProcessFlowDiagram';
import { TrendChart } from '@/components/ui/TrendChart';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Camera, 
  Package, 
  Truck,
  Database,
  MessageSquare,
  AlertTriangle,
  Eye,
  FileText,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  BarChart3,
  Star
} from 'lucide-react';
import { useQualityChecks } from '@/hooks/useQualityChecks';

export const QualityChecksManager = () => {
  const [selectedCheckType, setSelectedCheckType] = useState('all');
  const { 
    qualityChecks, 
    auditResults, 
    photoVerifications, 
    deliveryAccuracy,
    dataValidation,
    customerServiceReviews,
    createQualityCheck,
    updateQualityCheck,
    isCreatingCheck,
    isUpdatingCheck
  } = useQualityChecks();

  // Calculate metrics
  const totalChecks = qualityChecks.length;
  const passedChecks = qualityChecks.filter(c => c.status === 'passed').length;
  const failedChecks = qualityChecks.filter(c => c.status === 'failed').length;
  const pendingChecks = qualityChecks.filter(c => c.status === 'pending').length;
  const passRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  const filteredChecks = selectedCheckType === 'all' 
    ? qualityChecks 
    : qualityChecks.filter(c => c.check_type === selectedCheckType);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quality Checks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChecks}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <Progress value={passRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {passedChecks}/{totalChecks} checks passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Checks</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failedChecks}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Checks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingChecks}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quality Check Categories */}
      <Tabs defaultValue="package-audits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="package-audits">Package Audits</TabsTrigger>
          <TabsTrigger value="photo-verification">Photo Verification</TabsTrigger>
          <TabsTrigger value="delivery-accuracy">Delivery Accuracy</TabsTrigger>
          <TabsTrigger value="data-validation">Data Validation</TabsTrigger>
          <TabsTrigger value="service-reviews">Service Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="package-audits" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Handling Process Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Handling Process Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessFlowDiagram
                  definition={`
                    graph TD
                      A[Package Intake] --> B[Barcode Scanning]
                      B --> C{Valid Barcode?}
                      C -->|Yes| D[Photo Documentation]
                      C -->|No| E[Manual Entry]
                      E --> D
                      D --> F[Storage Assignment]
                      F --> G[Customer Notification]
                      G --> H[Quality Check]
                      H --> I{Passed?}
                      I -->|Yes| J[Complete]
                      I -->|No| K[Corrective Action]
                      K --> H
                  `}
                  title="Package Processing Quality Flow"
                />
              </CardContent>
            </Card>

            {/* Recent Package Audits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Recent Package Audits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditResults.slice(0, 5).map((audit, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Package #{audit.package_id}</h4>
                        <Badge variant={audit.status === 'passed' ? 'default' : 'destructive'}>
                          {audit.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Handling Score:</span>
                          <span className="font-medium">{audit.handling_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Documentation:</span>
                          <span className="font-medium">{audit.documentation_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Storage:</span>
                          <span className="font-medium">{audit.storage_score}/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(audit.audit_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photo-verification" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Photo Verification System */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Photo Verification System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {photoVerifications.slice(0, 5).map((verification, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Package #{verification.package_id}</h4>
                        <Badge variant={verification.verification_status === 'verified' ? 'default' : 'secondary'}>
                          {verification.verification_status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Photo Quality:</span>
                          <span className="font-medium">{verification.photo_quality_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Package Visibility:</span>
                          <span className="font-medium">{verification.package_visibility_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Label Readability:</span>
                          <span className="font-medium">{verification.label_readability_score}/100</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Photos
                        </Button>
                        <Button size="sm" variant="outline">
                          <Upload className="h-3 w-3 mr-1" />
                          Re-upload
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Photo Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Photo Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Average Photo Quality', score: 87, trend: 'up' },
                    { metric: 'Package Visibility', score: 92, trend: 'up' },
                    { metric: 'Label Readability', score: 89, trend: 'stable' },
                    { metric: 'Lighting Quality', score: 85, trend: 'down' },
                    { metric: 'Angle Consistency', score: 91, trend: 'up' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metric.score}/100</span>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        ) : (
                          <div className="h-3 w-3 text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="delivery-accuracy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Delivery Accuracy Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Accuracy Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryAccuracy.slice(0, 5).map((delivery, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Delivery #{delivery.delivery_id}</h4>
                        <Badge variant={delivery.accuracy_score >= 95 ? 'default' : 'destructive'}>
                          {delivery.accuracy_score}% accurate
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Route Efficiency:</span>
                          <span className="font-medium">{delivery.route_efficiency_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Time Accuracy:</span>
                          <span className="font-medium">{delivery.time_accuracy_score}/100</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Customer Satisfaction:</span>
                          <span className="font-medium">{delivery.customer_satisfaction_score}/100</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(delivery.delivery_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Delivery Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { week: 'Week 1', accuracy: 96, efficiency: 89, satisfaction: 92 },
                    { week: 'Week 2', accuracy: 94, efficiency: 91, satisfaction: 90 },
                    { week: 'Week 3', accuracy: 97, efficiency: 88, satisfaction: 94 },
                    { week: 'Week 4', accuracy: 95, efficiency: 93, satisfaction: 91 }
                  ].map((week, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{week.week}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                          <div className="text-sm font-medium">{week.accuracy}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                          <div className="text-sm font-medium">{week.efficiency}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">Satisfaction</div>
                          <div className="text-sm font-medium">{week.satisfaction}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-validation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Entry Validation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Entry Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataValidation.slice(0, 5).map((validation, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{validation.field_name}</h4>
                        <Badge variant={validation.validation_status === 'valid' ? 'default' : 'destructive'}>
                          {validation.validation_status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Accuracy Rate:</span>
                          <span className="font-medium">{validation.accuracy_rate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Error Count:</span>
                          <span className="font-medium">{validation.error_count}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Validation Rules:</span>
                          <span className="font-medium">{validation.validation_rules_passed}/{validation.total_rules}</span>
                        </div>
                      </div>
                      {validation.validation_status === 'invalid' && (
                        <p className="text-xs text-red-600 mt-2">
                          {validation.error_message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Validation Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Validation Rules Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rule: 'Email Format', status: 'active', compliance: 98 },
                    { rule: 'Phone Number Format', status: 'active', compliance: 95 },
                    { rule: 'Address Validation', status: 'active', compliance: 92 },
                    { rule: 'Package Weight Range', status: 'active', compliance: 99 },
                    { rule: 'Tracking Number Format', status: 'active', compliance: 97 }
                  ].map((rule, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{rule.rule}</span>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{rule.compliance}%</span>
                        <Progress value={rule.compliance} className="w-16 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="service-reviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Service Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Service Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerServiceReviews.slice(0, 5).map((review, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">Review #{review.review_id}</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{review.comment}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Professionalism:</span>
                          <span className="font-medium">{review.professionalism_score}/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Helpfulness:</span>
                          <span className="font-medium">{review.helpfulness_score}/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Communication:</span>
                          <span className="font-medium">{review.communication_score}/10</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.review_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Service Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'Overall Satisfaction', score: 4.6, trend: 'up' },
                    { metric: 'Response Time', score: 4.4, trend: 'stable' },
                    { metric: 'Problem Resolution', score: 4.7, trend: 'up' },
                    { metric: 'Professionalism', score: 4.8, trend: 'up' },
                    { metric: 'Communication', score: 4.5, trend: 'stable' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{metric.score}/5.0</span>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : metric.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        ) : (
                          <div className="h-3 w-3 text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Quality Check
          </Button>
        </div>
      </div>
    </div>
  );
}; 