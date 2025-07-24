import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomers } from "@/hooks/useCustomers";
import { useLanguage } from "@/contexts/LanguageContext";
import { Crown, Star, AlertTriangle, TrendingUp, Users, DollarSign, Clock } from "lucide-react";

interface Act60DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Act60Dashboard({ onNavigate }: Act60DashboardProps) {
  const { customers } = useCustomers();
  const { t } = useLanguage();

  const act60Customers = customers.filter(customer => customer.act_60_status);
  const expiringDecrees = act60Customers.filter(customer => {
    if (!customer.act_60_expiration_date) return false;
    const expDate = new Date(customer.act_60_expiration_date);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expDate <= threeMonthsFromNow;
  });

  const totalRevenue = act60Customers.length * 2500; // Estimated premium revenue
  const avgPackagesPerCustomer = act60Customers.length > 0 ? 
    act60Customers.reduce((sum, customer) => sum + 3, 0) / act60Customers.length : 0; // Placeholder average

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Act 60 Dashboard</h1>
            <p className="text-muted-foreground">Premium customer management</p>
          </div>
        </div>
        <Button onClick={() => onNavigate('customers')} variant="outline">
          View All Customers
        </Button>
      </div>

      {/* Alerts */}
      {expiringDecrees.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            {expiringDecrees.length} Act 60 decree(s) expiring within 3 months
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Act 60 Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{act60Customers.length}</div>
            <p className="text-xs text-muted-foreground">Premium status holders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From Act 60 segment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Packages/Customer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgPackagesPerCustomer.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Monthly average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringDecrees.length}</div>
            <p className="text-xs text-muted-foreground">Within 3 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Act 60 Customers</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="virtual-mailbox">Virtual Mailbox</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>Act 60 Customers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {act60Customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-semibold">{customer.first_name} {customer.last_name}</p>
                          <p className="text-sm text-muted-foreground">Mailbox {customer.mailbox_number}</p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          VIP
                        </Badge>
                        {customer.express_handling && (
                          <Badge variant="outline" className="border-green-500 text-green-700">
                            Express
                          </Badge>
                        )}
                        {customer.priority_notification && (
                          <Badge variant="outline" className="border-blue-500 text-blue-700">
                            Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium">Decree: {customer.act_60_decree_number}</p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {customer.act_60_expiration_date ? 
                          new Date(customer.act_60_expiration_date).toLocaleDateString() : 'N/A'}
                      </p>
                      {expiringDecrees.some(c => c.id === customer.id) && (
                        <Badge variant="destructive" className="text-xs">
                          Expiring Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {act60Customers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No Act 60 customers found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Compliance tracking features coming soon</p>
                <p className="text-sm">Government reporting integration in development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual-mailbox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Virtual Mailbox Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Virtual mailbox features coming soon</p>
                <p className="text-sm">Mail scanning and digital preview capabilities</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Act 60 Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Revenue Report</h3>
                  <p className="text-sm text-muted-foreground">Monthly revenue from Act 60 customers</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Service Metrics</h3>
                  <p className="text-sm text-muted-foreground">Average packages per customer</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{avgPackagesPerCustomer.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}