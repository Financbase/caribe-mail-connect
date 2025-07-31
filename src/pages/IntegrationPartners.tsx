import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Code, 
  DollarSign, 
  Star,
  FileText,
  Activity,
  Settings,
  BarChart3,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Copy,
  Eye,
  Edit,
  Zap,
  Database,
  Globe,
  Wifi,
  Server,
  Monitor,
  AlertCircle,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { mockIntegrationPartners } from '@/data/partnerData';
import { IntegrationPartner } from '@/types/partners';

export default function IntegrationPartners() {
  const [integrationPartners, setIntegrationPartners] = useState<IntegrationPartner[]>(mockIntegrationPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPartners = integrationPartners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApiStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey;
    return apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Partners</h1>
          <p className="text-gray-600 mt-2">Manage API integrations, technical support, and SLA compliance</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration Partners</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationPartners.length}</div>
            <p className="text-xs text-muted-foreground">
              {integrationPartners.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(integrationPartners.reduce((sum, p) => sum + p.usageMetrics.totalRequests, 0))}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">
              -15ms from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              2 SLA violations this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Partners</CardTitle>
              <CardDescription>Manage integration partnerships and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search partners..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Partner Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={partner.logo} alt={partner.name} />
                        <AvatarFallback>
                          <Code className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <CardDescription>{partner.contactPerson.title}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API Status</span>
                    <Badge className={getApiStatusColor(partner.apiAccess.status)}>
                      {partner.apiAccess.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium">{partner.slaAgreement.uptime}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium">{partner.slaAgreement.responseTime}ms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="text-sm font-medium">{formatNumber(partner.usageMetrics.totalRequests)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Support Tickets</span>
                    <span className="text-sm font-medium">{partner.supportTickets.length}</span>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Access Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Access Management</CardTitle>
              <CardDescription>Manage API keys, permissions, and rate limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrationPartners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={partner.logo} alt={partner.name} />
                          <AvatarFallback>
                            <Code className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-gray-600">API Access Configuration</p>
                        </div>
                      </div>
                      <Badge className={getApiStatusColor(partner.apiAccess.status)}>
                        {partner.apiAccess.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">API Key</h4>
                        <div className="flex items-center space-x-2 p-3 border rounded bg-gray-50">
                          <code className="text-sm font-mono flex-1">
                            {maskApiKey(partner.apiAccess.apiKey)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(partner.apiAccess.apiKey)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Rate Limit</span>
                            <span className="text-sm font-medium">{formatNumber(partner.apiAccess.rateLimit)}/hour</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Usage Count</span>
                            <span className="text-sm font-medium">{formatNumber(partner.apiAccess.usageCount)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Used</span>
                            <span className="text-sm font-medium">
                              {new Date(partner.apiAccess.lastUsed).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">Permissions</h4>
                        <div className="space-y-2">
                          {partner.apiAccess.permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2 p-2 border rounded">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{permission}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="h-4 w-4 mr-1" />
                            Manage Permissions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Documentation</CardTitle>
              <CardDescription>Manage API documentation and technical resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Documentation Library</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Document
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {integrationPartners.flatMap(partner => partner.technicalDocs).map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{doc.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Version {doc.version}</span>
                          <span>{formatNumber(doc.downloads)} downloads</span>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                        </p>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Ticketing</CardTitle>
              <CardDescription>Manage support tickets and technical issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Support Tickets</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Ticket
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrationPartners.flatMap(partner => 
                      partner.supportTickets.map(ticket => ({
                        ...ticket,
                        partnerName: partner.name
                      }))
                    ).map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.partnerName}</TableCell>
                        <TableCell className="max-w-xs truncate">{ticket.title}</TableCell>
                        <TableCell>
                          <Badge className={getTicketPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTicketStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Monitoring & SLA Tracking</CardTitle>
              <CardDescription>Monitor API usage and SLA compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {integrationPartners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={partner.logo} alt={partner.name} />
                          <AvatarFallback>
                            <Code className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-gray-600">Usage & SLA Metrics</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Usage Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Requests</span>
                            <span className="text-sm font-medium">{formatNumber(partner.usageMetrics.totalRequests)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Successful Requests</span>
                            <span className="text-sm font-medium">{formatNumber(partner.usageMetrics.successfulRequests)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Failed Requests</span>
                            <span className="text-sm font-medium">{formatNumber(partner.usageMetrics.failedRequests)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Avg Response Time</span>
                            <span className="text-sm font-medium">{partner.usageMetrics.averageResponseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Peak Usage</span>
                            <span className="text-sm font-medium">{formatNumber(partner.usageMetrics.peakUsage)}/hour</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-3">SLA Compliance</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Uptime</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={partner.slaAgreement.uptime} className="w-20" />
                              <span className="text-sm font-medium">{partner.slaAgreement.uptime}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Response Time</span>
                            <span className="text-sm font-medium">{partner.slaAgreement.responseTime}ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Support Response</span>
                            <span className="text-sm font-medium">{partner.slaAgreement.supportResponseTime}h</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Review</span>
                            <span className="text-sm font-medium">
                              {new Date(partner.slaAgreement.lastReview).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Next Review</span>
                            <span className="text-sm font-medium">
                              {new Date(partner.slaAgreement.nextReview).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-3">Monthly Usage Trend</h4>
                      <div className="space-y-2">
                        {partner.usageMetrics.monthlyUsage.map((usage) => (
                          <div key={usage.month} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="font-medium text-sm">{usage.month}</p>
                              <p className="text-xs text-gray-600">{formatNumber(usage.requests)} requests</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{usage.responseTime}ms</p>
                              <p className="text-xs text-gray-600">{usage.errors} errors</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 