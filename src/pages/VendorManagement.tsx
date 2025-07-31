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
  Building2, 
  DollarSign, 
  Star,
  FileText,
  Activity,
  Settings,
  BarChart3,
  Handshake,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { mockVendors } from '@/data/partnerData';
import { Vendor } from '@/types/partners';

export default function VendorManagement() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || vendor.categories.includes(filterCategory);
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
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

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCertificationStatus = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-2">Manage approved vendors, procurement, and compliance</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendors.length}</div>
            <p className="text-xs text-muted-foreground">
              {vendors.filter(v => v.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(284000)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.5</div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              3 vendors need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vendors">Vendor List</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Vendor List Tab */}
        <TabsContent value="vendors" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Approved Vendor List</CardTitle>
              <CardDescription>Search and filter approved vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vendors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="warehousing">Warehousing</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
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

          {/* Vendor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={vendor.logo} alt={vendor.name} />
                        <AvatarFallback>
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription>{vendor.vendorType}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quality Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{vendor.qualityRating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Compliance Score</span>
                    <span className={`text-sm font-medium ${getComplianceColor(vendor.complianceScore)}`}>
                      {vendor.complianceScore}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Spend</span>
                    <span className="text-sm font-medium">{formatCurrency(vendor.revenue)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certifications</span>
                    <span className="text-sm font-medium">{vendor.certifications.length}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {vendor.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
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

        {/* Procurement Tab */}
        <TabsContent value="procurement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Workflows</CardTitle>
              <CardDescription>Manage procurement processes and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Procurement Requests</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Request
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.flatMap(vendor => vendor.procurementHistory).map((procurement) => (
                      <TableRow key={procurement.id}>
                        <TableCell className="font-medium">{procurement.id}</TableCell>
                        <TableCell>{vendors.find(v => v.id === vendor.id)?.name}</TableCell>
                        <TableCell>{procurement.description}</TableCell>
                        <TableCell>{formatCurrency(procurement.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(procurement.status)}>
                            {procurement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(procurement.date).toLocaleDateString()}</TableCell>
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

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Processing</CardTitle>
              <CardDescription>Process and track vendor invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Processing</h3>
                <p className="text-gray-600 mb-4">Manage vendor invoices and payments</p>
                <div className="flex justify-center space-x-4">
                  <Button>View Invoices</Button>
                  <Button variant="outline">Upload Invoice</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Ratings</CardTitle>
              <CardDescription>Track vendor quality metrics and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={vendor.logo} alt={vendor.name} />
                        <AvatarFallback>
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{vendor.name}</h3>
                        <p className="text-sm text-gray-600">{vendor.vendorType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{vendor.qualityRating}</div>
                        <div className="text-xs text-gray-600">Quality Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{vendor.complianceScore}%</div>
                        <div className="text-xs text-gray-600">Compliance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold">{vendor.certifications.length}</div>
                        <div className="text-xs text-gray-600">Certifications</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
              <CardDescription>Monitor vendor compliance and certifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {vendors.map((vendor) => (
                  <div key={vendor.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={vendor.logo} alt={vendor.name} />
                          <AvatarFallback>
                            <Building2 className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{vendor.name}</h3>
                          <p className="text-sm text-gray-600">Compliance Score: {vendor.complianceScore}%</p>
                        </div>
                      </div>
                      <Progress value={vendor.complianceScore} className="w-32" />
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Certifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {vendor.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium text-sm">{cert.name}</p>
                              <p className="text-xs text-gray-600">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getCertificationStatus(cert.status)}
                              <Badge variant="outline" className="text-xs">
                                {cert.status}
                              </Badge>
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