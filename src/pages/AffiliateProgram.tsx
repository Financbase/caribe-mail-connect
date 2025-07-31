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
  Award, 
  DollarSign, 
  Star,
  FileText,
  Activity,
  Settings,
  BarChart3,
  Users,
  Download,
  Eye,
  Edit,
  Share2,
  Target,
  Calendar,
  Filter,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { mockAffiliatePrograms, mockPartners } from '@/data/partnerData';
import { AffiliateProgram, Partner } from '@/types/partners';

export default function AffiliateProgramPage() {
  const [affiliatePrograms, setAffiliatePrograms] = useState<AffiliateProgram[]>(mockAffiliatePrograms);
  const [partners, setPartners] = useState<Partner[]>(mockPartners.filter(p => p.type === 'affiliate'));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredPartners = partners.filter(partner => {
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
          <p className="text-gray-600 mt-2">Manage affiliate partnerships, referrals, and commissions</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Affiliate
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.length}</div>
            <p className="text-xs text-muted-foreground">
              {partners.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57.2%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(45600)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="affiliates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="commissions">Commissions</TabsTrigger>
          <TabsTrigger value="materials">Marketing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Affiliates Tab */}
        <TabsContent value="affiliates" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Directory</CardTitle>
              <CardDescription>Manage affiliate partners and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search affiliates..."
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

          {/* Affiliate Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => {
              const affiliateProgram = affiliatePrograms.find(ap => ap.partnerId === partner.id);
              return (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={partner.logo} alt={partner.name} />
                          <AvatarFallback>
                            <Award className="h-6 w-6" />
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
                    {affiliateProgram && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Referral Code</span>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {affiliateProgram.referralCode}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(affiliateProgram.referralCode)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Referrals</span>
                          <span className="text-sm font-medium">{affiliateProgram.performance.totalReferrals}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Conversion Rate</span>
                          <span className="text-sm font-medium">{formatPercentage(affiliateProgram.performance.conversionRate)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Revenue</span>
                          <span className="text-sm font-medium">{formatCurrency(affiliateProgram.performance.totalRevenue)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Commission Rate</span>
                          <span className="text-sm font-medium">{formatPercentage(affiliateProgram.commissionStructure.baseRate)}</span>
                        </div>
                      </>
                    )}

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
              );
            })}
          </div>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Referral Tracking</CardTitle>
              <CardDescription>Track affiliate referrals and conversions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Referrals</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral ID</TableHead>
                      <TableHead>Affiliate</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliatePrograms.flatMap(program => 
                      program.performance.monthlyStats.map((stat, index) => ({
                        id: `ref-${program.partnerId}-${index}`,
                        affiliate: partners.find(p => p.id === program.partnerId)?.name || 'Unknown',
                        customer: `Customer ${index + 1}`,
                        status: index % 3 === 0 ? 'converted' : 'pending',
                        value: stat.revenue,
                        commission: stat.commission,
                        date: stat.month
                      }))
                    ).slice(0, 10).map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell className="font-medium">{referral.id}</TableCell>
                        <TableCell>{referral.affiliate}</TableCell>
                        <TableCell>{referral.customer}</TableCell>
                        <TableCell>
                          <Badge className={referral.status === 'converted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {referral.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCurrency(referral.value)}</TableCell>
                        <TableCell>{formatCurrency(referral.commission)}</TableCell>
                        <TableCell>{referral.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Structure & Payments</CardTitle>
              <CardDescription>Manage commission rates and payment processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {affiliatePrograms.map((program) => {
                  const partner = partners.find(p => p.id === program.partnerId);
                  return (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={partner?.logo} alt={partner?.name} />
                            <AvatarFallback>
                              <Award className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{partner?.name}</h3>
                            <p className="text-sm text-gray-600">Base Rate: {formatPercentage(program.commissionStructure.baseRate)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(program.performance.totalCommission)}</div>
                          <div className="text-sm text-gray-600">Total Commission</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-sm mb-3">Commission Tiers</h4>
                          <div className="space-y-2">
                            {program.commissionStructure.tiers.map((tier) => (
                              <div key={tier.level} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">Tier {tier.level}</p>
                                  <p className="text-xs text-gray-600">Min Sales: {formatCurrency(tier.minSales)}</p>
                                </div>
                                <Badge variant="outline">{formatPercentage(tier.rate)}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-3">Recent Payments</h4>
                          <div className="space-y-2">
                            {program.paymentHistory.slice(0, 3).map((payment) => (
                              <div key={payment.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                  <p className="font-medium text-sm">{formatCurrency(payment.amount)}</p>
                                  <p className="text-xs text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                                </div>
                                <Badge className={getPaymentStatusColor(payment.status)}>
                                  {payment.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Materials</CardTitle>
              <CardDescription>Manage affiliate marketing materials and assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Available Materials</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Material
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {affiliatePrograms.flatMap(program => program.marketingMaterials).map((material) => (
                    <Card key={material.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{material.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {material.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-gray-600">{material.description}</p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span>Usage: {material.usageCount}</span>
                          <span>CR: {formatPercentage(material.conversionRate)}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-3 w-3" />
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Comprehensive affiliate performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {affiliatePrograms.map((program) => {
                  const partner = partners.find(p => p.id === program.partnerId);
                  return (
                    <div key={program.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={partner?.logo} alt={partner?.name} />
                            <AvatarFallback>
                              <Award className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{partner?.name}</h3>
                            <p className="text-sm text-gray-600">Performance Analytics</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{program.performance.totalReferrals}</div>
                          <div className="text-sm text-gray-600">Total Referrals</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{program.performance.successfulReferrals}</div>
                          <div className="text-sm text-gray-600">Successful</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatPercentage(program.performance.conversionRate)}</div>
                          <div className="text-sm text-gray-600">Conversion Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatCurrency(program.performance.totalRevenue)}</div>
                          <div className="text-sm text-gray-600">Total Revenue</div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-sm mb-3">Monthly Performance</h4>
                        <div className="space-y-2">
                          {program.performance.monthlyStats.map((stat) => (
                            <div key={stat.month} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <p className="font-medium text-sm">{stat.month}</p>
                                <p className="text-xs text-gray-600">{stat.referrals} referrals</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-sm">{formatCurrency(stat.revenue)}</p>
                                <p className="text-xs text-gray-600">{formatCurrency(stat.commission)} commission</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 