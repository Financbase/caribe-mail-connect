/**
 * Billing Dashboard Component
 * Story 1.1: Unified Payment Integration
 * 
 * Comprehensive billing dashboard showcasing Stripe + ATH Móvil integration
 * Demonstrates hybrid payment strategy for SaaS + local market
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Smartphone, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  MapPin,
  Globe,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings
} from 'lucide-react';
import { PaymentMethodsList, PaymentMethodSummary } from './PaymentMethodCard';
import { usePayment } from '@/hooks/usePayment';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';

// =====================================================
// BILLING OVERVIEW CARDS
// =====================================================

function BillingOverviewCards() {
  const { subscription } = useSubscription();
  const { subscriptionBilling } = usePayment();

  const currentPlan = subscription ? SUBSCRIPTION_PLANS[subscription.plan_tier] : null;
  const monthlyAmount = currentPlan?.pricing.monthly || 0;
  const yearlyAmount = currentPlan?.pricing.yearly || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscription?.plan_tier || 'None'}</div>
          <p className="text-xs text-muted-foreground">
            {currentPlan?.name || 'No active plan'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyAmount}</div>
          <p className="text-xs text-muted-foreground">
            Billed {subscriptionBilling?.billing_interval || 'monthly'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Current</div>
          <p className="text-xs text-muted-foreground">
            Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Coverage</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Hybrid</div>
          <p className="text-xs text-muted-foreground">
            Global + Puerto Rico
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// =====================================================
// PAYMENT METHODS SECTION
// =====================================================

function PaymentMethodsSection() {
  const { paymentMethods, isLoading, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = usePayment();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddPaymentMethod = () => {
    setShowAddForm(true);
  };

  const handleEditPaymentMethod = (paymentMethod: any) => {
    console.log('Edit payment method:', paymentMethod);
  };

  const handleDeletePaymentMethod = async (paymentMethod: any) => {
    await removePaymentMethod(paymentMethod.id);
  };

  const handleSetDefaultPaymentMethod = async (paymentMethod: any) => {
    await setDefaultPaymentMethod(paymentMethod.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods for subscription billing
          </p>
        </div>
        <Button onClick={handleAddPaymentMethod}>
          <CreditCard className="mr-2 h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PaymentMethodsList
            paymentMethods={paymentMethods}
            onEdit={handleEditPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
            onAddNew={handleAddPaymentMethod}
            isLoading={isLoading}
          />
        </div>
        
        <div>
          <PaymentMethodSummary paymentMethods={paymentMethods} />
        </div>
      </div>
    </div>
  );
}

// =====================================================
// PAYMENT ROUTING CONFIGURATION
// =====================================================

function PaymentRoutingSection() {
  const { routingConfig, updatePaymentRoutingConfig } = usePayment();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Payment Routing Configuration
        </CardTitle>
        <CardDescription>
          Configure how payments are routed based on customer location and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Puerto Rico Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Primary Method</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Smartphone className="h-3 w-3" />
                  ATH Móvil
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fallback</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Stripe
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Optimized for local market preferences and lower fees
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                International Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Primary Method</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Stripe
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fallback</span>
                <Badge variant="outline">PayPal</Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                Global coverage with comprehensive payment options
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Hybrid Strategy:</strong> This configuration maximizes payment success rates by using 
            ATH Móvil for Puerto Rico customers (lower fees, local preference) and Stripe for international 
            customers (global coverage, multiple currencies).
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

// =====================================================
// BILLING HISTORY SECTION
// =====================================================

function BillingHistorySection() {
  // Mock billing history data
  const billingHistory = [
    {
      id: '1',
      date: '2024-08-01',
      amount: 99.00,
      status: 'paid',
      method: 'stripe',
      invoice: 'INV-001'
    },
    {
      id: '2',
      date: '2024-07-01',
      amount: 99.00,
      status: 'paid',
      method: 'ath_movil',
      invoice: 'INV-002'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View and download your billing history and invoices
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billingHistory.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {item.method === 'stripe' ? (
                    <CreditCard className="h-4 w-4" />
                  ) : (
                    <Smartphone className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">{item.invoice}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">${item.amount}</span>
                <Badge variant={item.status === 'paid' ? 'default' : 'secondary'}>
                  {item.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =====================================================
// MAIN BILLING DASHBOARD
// =====================================================

export function BillingDashboard() {
  const { subscription } = useSubscription();
  const { isLoading, error } = usePayment();

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
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">
            Manage your subscription, payment methods, and billing preferences
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Story 1.1: Unified Payment Integration
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <BillingOverviewCards />

      <Tabs defaultValue="payment-methods" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="routing">Payment Routing</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods" className="space-y-6">
          <PaymentMethodsSection />
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <PaymentRoutingSection />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <BillingHistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
