/**
 * Enhanced Customer Dashboard Component
 * Story 1.2: Enhanced Customer Management
 * 
 * Comprehensive customer management dashboard with lifecycle tracking,
 * segmentation, analytics, and subscription context
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertTriangle,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Target,
  MessageSquare,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomerCard } from './CustomerCard';
import { useCustomer } from '@/hooks/useCustomer';
import { useSubscription } from '@/contexts/SubscriptionContext';
import type { CustomerSearchFilters, CustomerLifecycleStage, CustomerTier } from '@/types/customer';

// =====================================================
// CUSTOMER STATS CARDS
// =====================================================

function CustomerStatsCards() {
  const { customerStats, isLoading } = useCustomer();

  if (isLoading || !customerStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStats.total_customers}</div>
          <p className="text-xs text-muted-foreground">
            {customerStats.active_customers} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStats.new_customers_this_month}</div>
          <p className="text-xs text-muted-foreground">
            +12% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStats.avg_engagement_score}%</div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            +5% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customerStats.avg_satisfaction_score}/5</div>
          <p className="text-xs text-muted-foreground">
            Based on recent feedback
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================
// CUSTOMER FILTERS
// =====================================================

interface CustomerFiltersProps {
  onFiltersChange: (filters: CustomerSearchFilters) => void;
  isLoading: boolean;
}

function CustomerFilters({ onFiltersChange, isLoading }: CustomerFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  const handleFiltersChange = () => {
    const filters: CustomerSearchFilters = {};
    
    if (searchQuery.trim()) {
      filters.query = searchQuery.trim();
    }
    
    if (selectedTier !== 'all') {
      filters.customer_tiers = [selectedTier as CustomerTier];
    }
    
    if (selectedStage !== 'all') {
      filters.lifecycle_stages = [selectedStage as CustomerLifecycleStage];
    }
    
    onFiltersChange(filters);
  };

  useEffect(() => {
    const timeoutId = setTimeout(handleFiltersChange, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTier, selectedStage]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          disabled={isLoading}
        />
      </div>
      
      <Select value={selectedTier} onValueChange={setSelectedTier} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Customer Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tiers</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
          <SelectItem value="vip">VIP</SelectItem>
          <SelectItem value="enterprise">Enterprise</SelectItem>
        </SelectContent>
      </Select>

      <Select value={selectedStage} onValueChange={setSelectedStage} disabled={isLoading}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Lifecycle Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          <SelectItem value="prospect">Prospect</SelectItem>
          <SelectItem value="new_customer">New Customer</SelectItem>
          <SelectItem value="onboarding">Onboarding</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="engaged">Engaged</SelectItem>
          <SelectItem value="at_risk">At Risk</SelectItem>
          <SelectItem value="dormant">Dormant</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" disabled={isLoading}>
        <Filter className="h-4 w-4" />
      </Button>
    </div>
  );
}

// =====================================================
// CUSTOMER LIST
// =====================================================

function CustomerList() {
  const { 
    customers, 
    isLoading, 
    searchCustomers, 
    loadNextPage, 
    hasMore,
    totalCount 
  } = useCustomer();

  const handleFiltersChange = (filters: CustomerSearchFilters) => {
    searchCustomers(filters, 1);
  };

  const handleViewCustomer = (customer: any) => {
    console.log('View customer:', customer);
  };

  const handleEditCustomer = (customer: any) => {
    console.log('Edit customer:', customer);
  };

  const handleMessageCustomer = (customer: any) => {
    console.log('Message customer:', customer);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Customer List</h3>
          <p className="text-sm text-muted-foreground">
            {totalCount} customers found
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      <CustomerFilters onFiltersChange={handleFiltersChange} isLoading={isLoading} />

      {isLoading && customers.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-muted rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32"></div>
                      <div className="h-3 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No customers found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search filters or add your first customer.
            </p>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onView={handleViewCustomer}
                onEdit={handleEditCustomer}
                onMessage={handleMessageCustomer}
              />
            ))}
          </div>

          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={loadNextPage}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =====================================================
// CUSTOMER ANALYTICS
// =====================================================

function CustomerAnalytics() {
  const { customerStats } = useCustomer();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Customer Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerStats && Object.entries(customerStats.customers_by_tier).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className="capitalize">{tier}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Lifecycle Stages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customerStats && Object.entries(customerStats.customers_by_stage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="capitalize">{stage.replace('_', ' ')}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// =====================================================
// MAIN CUSTOMER DASHBOARD
// =====================================================

export function CustomerDashboard() {
  const { subscription } = useSubscription();
  const { error } = useCustomer();

  if (!subscription) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. Please contact support or set up a subscription.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-muted-foreground">
            Manage customer relationships with lifecycle tracking and analytics
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Story 1.2: Enhanced Customer Management
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CustomerStatsCards />

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          <CustomerList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <CustomerAnalytics />
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Customer Segments
              </CardTitle>
              <CardDescription>
                Create and manage customer segments for targeted communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Customer segmentation features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Communications
              </CardTitle>
              <CardDescription>
                Manage customer communications and automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Communication management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
