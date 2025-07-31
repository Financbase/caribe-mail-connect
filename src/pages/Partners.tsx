import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Star,
  Calendar,
  FileText,
  Activity,
  Settings,
  BarChart3,
  Handshake,
  Building2,
  Globe,
  Code,
  Award,
  Eye,
  Edit,
  Trash2,
  Share2,
  Download,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  Shield,
  Users2,
  Briefcase,
  Lightbulb,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockPartners, mockPartnerStats, mockPartnerActivity, mockCollaborationWorkflows } from '@/data/partnerData';
import { Partner, PartnerStats, PartnerActivity, CollaborationWorkflow } from '@/types/partners';
import CollaborationWorkflowComponent from '@/components/partners/CollaborationWorkflow';

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [stats, setStats] = useState<PartnerStats>(mockPartnerStats);
  const [activities, setActivities] = useState<PartnerActivity[]>(mockPartnerActivity);
  const [workflows, setWorkflows] = useState<CollaborationWorkflow[]>(mockCollaborationWorkflows);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || partner.type === filterType;
    const matchesStatus = filterStatus === 'all' || partner.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return <Building2 className="h-4 w-4" />;
      case 'vendor': return <Handshake className="h-4 w-4" />;
      case 'affiliate': return <Award className="h-4 w-4" />;
      case 'integration': return <Code className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'stable': return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handlePartnerSelect = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const handleWorkflowSelect = (workflow: CollaborationWorkflow) => {
    console.log('Selected workflow:', workflow);
  };

  const handleTaskUpdate = (workflowId: string, taskId: string, updates: any) => {
    console.log('Task update:', { workflowId, taskId, updates });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Management</h1>
          <p className="text-gray-600 mt-2">Manage partnerships, vendors, affiliates, and integrations</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button
            variant={viewMode === 'analytics' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('analytics')}
          >
            Analytics
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartners}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon('up')}
              {stats.activePartners} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon('up')}
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon('stable')}
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {getTrendIcon('up')}
              8 expiring this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="directory">Partner Directory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Partner Directory Tab */}
        <TabsContent value="directory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Partner Directory</CardTitle>
              <CardDescription>Search and filter partners</CardDescription>
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
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="integration">Integration</SelectItem>
                  </SelectContent>
                </Select>
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

          {/* Partner Grid/List */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <Card 
                  key={partner.id} 
                  className={`hover:shadow-lg transition-shadow cursor-pointer ${
                    selectedPartner?.id === partner.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handlePartnerSelect(partner)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={partner.logo} alt={partner.name} />
                          <AvatarFallback>
                            {getPartnerTypeIcon(partner.type)}
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
                      <span className="text-sm text-gray-600">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{partner.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={partner.performanceScore} className="w-16" />
                        <span className="text-sm font-medium">{partner.performanceScore}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-sm font-medium">{formatCurrency(partner.revenue)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Commission</span>
                      <span className="text-sm font-medium">{formatCurrency(partner.commission)}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {partner.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {viewMode === 'list' && (
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredPartners.map((partner) => (
                    <div 
                      key={partner.id} 
                      className={`flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                        selectedPartner?.id === partner.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handlePartnerSelect(partner)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={partner.logo} alt={partner.name} />
                          <AvatarFallback>
                            {getPartnerTypeIcon(partner.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{partner.name}</h3>
                          <p className="text-sm text-gray-600">{partner.contactPerson.name} • {partner.contactPerson.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-lg font-bold">{partner.rating}</div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{partner.performanceScore}%</div>
                          <div className="text-xs text-gray-600">Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatCurrency(partner.revenue)}</div>
                          <div className="text-xs text-gray-600">Revenue</div>
                        </div>
                        <Badge className={getStatusColor(partner.status)}>
                          {partner.status}
                        </Badge>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {viewMode === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partner Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Partner Performance Overview</CardTitle>
                  <CardDescription>Performance metrics by partner type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['business', 'vendor', 'affiliate', 'integration'].map((type) => {
                      const typePartners = partners.filter(p => p.type === type);
                      const avgPerformance = typePartners.length > 0 
                        ? typePartners.reduce((sum, p) => sum + p.performanceScore, 0) / typePartners.length
                        : 0;
                      const avgRevenue = typePartners.length > 0
                        ? typePartners.reduce((sum, p) => sum + p.revenue, 0) / typePartners.length
                        : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getPartnerTypeIcon(type)}
                            <div>
                              <h4 className="font-medium capitalize">{type}</h4>
                              <p className="text-sm text-gray-600">{typePartners.length} partners</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{formatPercentage(avgPerformance)}</div>
                            <div className="text-sm text-gray-600">{formatCurrency(avgRevenue)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>Partners with highest performance scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {partners
                      .sort((a, b) => b.performanceScore - a.performanceScore)
                      .slice(0, 5)
                      .map((partner, index) => (
                        <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                              {index + 1}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={partner.logo} alt={partner.name} />
                              <AvatarFallback>
                                {getPartnerTypeIcon(partner.type)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{partner.name}</h4>
                              <p className="text-sm text-gray-600 capitalize">{partner.type}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{partner.performanceScore}%</div>
                            <div className="text-sm text-gray-600">{formatCurrency(partner.revenue)}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Ratings</CardTitle>
              <CardDescription>Track partner performance metrics and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={partner.logo} alt={partner.name} />
                        <AvatarFallback>
                          {getPartnerTypeIcon(partner.type)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{partner.name}</h3>
                        <p className="text-sm text-gray-600">{partner.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{partner.rating}</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{partner.performanceScore}%</div>
                        <div className="text-xs text-gray-600">Performance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{formatCurrency(partner.revenue)}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Management</CardTitle>
              <CardDescription>Manage partner contracts and agreements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Management</h3>
                <p className="text-gray-600 mb-4">View and manage all partner contracts</p>
                <Button>View Contracts</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracking</CardTitle>
              <CardDescription>Track and manage partner commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Commission Tracking</h3>
                <p className="text-gray-600 mb-4">Monitor commission payments and calculations</p>
                <Button>View Commissions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Collaboration Tab */}
        <TabsContent value="collaboration" className="space-y-6">
          <CollaborationWorkflowComponent
            workflows={workflows}
            onWorkflowSelect={handleWorkflowSelect}
            onTaskUpdate={handleTaskUpdate}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Partner */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Partner</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 8)
                    .map((partner) => (
                      <div key={partner.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={partner.logo} alt={partner.name} />
                            <AvatarFallback>
                              {getPartnerTypeIcon(partner.type)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{partner.name}</h4>
                            <p className="text-xs text-gray-600 capitalize">{partner.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(partner.revenue)}</div>
                          <div className="text-xs text-gray-600">{formatPercentage(partner.performanceScore)} performance</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>Partners with potential for expansion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners
                    .filter(p => p.performanceScore > 80 && p.revenue < 100000)
                    .slice(0, 5)
                    .map((partner) => (
                      <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          <div>
                            <h4 className="font-medium">{partner.name}</h4>
                            <p className="text-sm text-gray-600">High performance, low revenue</p>
                          </div>
                        </div>
                        <Button size="sm">
                          <Target className="h-4 w-4 mr-1" />
                          Expand
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Partner Details */}
      {selectedPartner && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedPartner.logo} alt={selectedPartner.name} />
                  <AvatarFallback>
                    {getPartnerTypeIcon(selectedPartner.type)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{selectedPartner.name}</CardTitle>
                  <CardDescription>{selectedPartner.contactPerson.name} • {selectedPartner.contactPerson.title}</CardDescription>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Website
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{selectedPartner.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{selectedPartner.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedPartner.address.city}, {selectedPartner.address.state}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Rating:</span>
                    <span className="font-medium">{selectedPartner.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Performance:</span>
                    <span className="font-medium">{selectedPartner.performanceScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue:</span>
                    <span className="font-medium">{formatCurrency(selectedPartner.revenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission:</span>
                    <span className="font-medium">{formatCurrency(selectedPartner.commission)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View Contracts
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Commissions
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest partner activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.description}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">
                  {activity.type.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 