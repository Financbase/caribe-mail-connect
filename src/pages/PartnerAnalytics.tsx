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
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Star,
  BarChart3,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Users,
  Building2,
  Award,
  Code,
  Handshake,
  Globe,
  Zap,
  Shield,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { mockPartnerAnalytics, mockPartners } from '@/data/partnerData';
import { PartnerAnalytics, Partner } from '@/types/partners';

export default function PartnerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PartnerAnalytics[]>(mockPartnerAnalytics);
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2024-01');
  const [selectedPartner, setSelectedPartner] = useState<string>('all');

  const currentAnalytics = analytics.find(a => a.partnerId === selectedPartner) || analytics[0];
  const currentPartner = partners.find(p => p.id === currentAnalytics?.partnerId);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOpportunityColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return <Building2 className="h-4 w-4" />;
      case 'vendor': return <Handshake className="h-4 w-4" />;
      case 'affiliate': return <Award className="h-4 w-4" />;
      case 'integration': return <Code className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Partner Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics and insights for partner performance</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
              <SelectItem value="2023-11">November 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Partner Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedPartner} onValueChange={setSelectedPartner}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Partners</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(currentAnalytics?.revenue.total || 0)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAnalytics?.performance.score || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 85%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Opportunities</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAnalytics?.growth.opportunities.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Identified opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relationship Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAnalytics?.relationship.score || 0}%</div>
            <p className="text-xs text-muted-foreground">
              Strong partnership
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="risks">Risks</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
        </TabsList>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Partner */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Partner</CardTitle>
                <CardDescription>Revenue breakdown across all partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partners.map((partner) => {
                    const partnerAnalytics = analytics.find(a => a.partnerId === partner.id);
                    return (
                      <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={partner.logo} alt={partner.name} />
                            <AvatarFallback>
                              {getPartnerTypeIcon(partner.type)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{partner.name}</p>
                            <p className="text-xs text-gray-600">{partner.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatCurrency(partnerAnalytics?.revenue.total || 0)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatPercentage((partnerAnalytics?.revenue.total || 0) / (analytics.reduce((sum, a) => sum + a.revenue.total, 0)) || 0)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Service */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics && Object.entries(currentAnalytics.revenue.byService).map(([service, amount]) => (
                    <div key={service} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{service}</p>
                        <p className="text-xs text-gray-600">
                          {formatPercentage(amount / currentAnalytics.revenue.total)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentAnalytics && Object.entries(currentAnalytics.revenue.byMonth).map(([month, amount]) => (
                  <div key={month} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{month}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{formatCurrency(amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics?.performance.metrics.map((metric) => (
                    <div key={metric.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{metric.name}</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <span className="text-sm font-medium">{metric.value} {metric.unit}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Target: {metric.target} {metric.unit}</span>
                        <span>Trend: {metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Performance trends and forecasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics?.performance.trends.map((trend) => (
                    <div key={trend.metric} className="p-4 border rounded-lg">
                      <h4 className="font-medium text-sm mb-3">{trend.metric}</h4>
                      <div className="space-y-2">
                        {trend.values.slice(-3).map((value, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span>{value.date}</span>
                            <span className="font-medium">{value.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Opportunities</CardTitle>
                <CardDescription>Identified growth opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics?.growth.opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        <Badge className={getOpportunityColor(opportunity.effort)}>
                          {opportunity.effort}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{opportunity.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Potential: {formatCurrency(opportunity.potentialRevenue)}</span>
                        <span>Timeline: {opportunity.timeline}</span>
                      </div>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {opportunity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Strategic recommendations for growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentAnalytics?.growth.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                      <p className="text-sm">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
              <CardDescription>Identified risks and mitigation strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentAnalytics?.growth.riskFactors.map((risk, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{risk.description}</h4>
                      <Badge className={getRiskColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-600">Probability</p>
                        <p className="text-sm font-medium">{formatPercentage(risk.probability)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Impact</p>
                        <p className="text-sm font-medium">{formatPercentage(risk.impact)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Mitigation Strategy</p>
                      <p className="text-sm">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relationships Tab */}
        <TabsContent value="relationships" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Relationship Factors */}
            <Card>
              <CardHeader>
                <CardTitle>Relationship Factors</CardTitle>
                <CardDescription>Factors contributing to relationship score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentAnalytics?.relationship.factors.map((factor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{factor.factor}</span>
                        <span className="text-sm font-medium">{factor.score}%</span>
                      </div>
                      <Progress value={factor.score} className="mb-2" />
                      <p className="text-xs text-gray-600">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Relationship History */}
            <Card>
              <CardHeader>
                <CardTitle>Relationship History</CardTitle>
                <CardDescription>Key relationship events and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentAnalytics?.relationship.history.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className={`h-3 w-3 rounded-full mt-2 ${
                        event.impact === 'positive' ? 'bg-green-500' :
                        event.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{event.type.replace('-', ' ')}</p>
                          <span className="text-xs text-gray-600">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 