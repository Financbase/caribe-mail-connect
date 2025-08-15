/**
 * Subscription Card Component
 * Story 1.0: Hybrid Tenant Architecture
 * 
 * Displays subscription information and management options
 * Integrates with existing shadcn/ui design system
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Calendar, 
  Users, 
  MapPin, 
  Mail, 
  Smartphone,
  Settings,
  CreditCard,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PLANS } from '@/types/subscription';
import type { Subscription, FeatureEntitlement } from '@/types/subscription';

// =====================================================
// SUBSCRIPTION STATUS BADGE
// =====================================================

interface SubscriptionStatusBadgeProps {
  status: Subscription['status'];
}

function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const statusConfig = {
    active: { label: 'Active', variant: 'default' as const, icon: CheckCircle },
    trialing: { label: 'Trial', variant: 'secondary' as const, icon: Calendar },
    past_due: { label: 'Past Due', variant: 'destructive' as const, icon: AlertTriangle },
    canceled: { label: 'Canceled', variant: 'outline' as const, icon: AlertTriangle },
    unpaid: { label: 'Unpaid', variant: 'destructive' as const, icon: AlertTriangle }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// =====================================================
// PLAN TIER BADGE
// =====================================================

interface PlanTierBadgeProps {
  tier: Subscription['plan_tier'];
}

function PlanTierBadge({ tier }: PlanTierBadgeProps) {
  const tierConfig = {
    starter: { label: 'Starter', variant: 'secondary' as const, icon: Users },
    professional: { label: 'Professional', variant: 'default' as const, icon: Crown },
    enterprise: { label: 'Enterprise', variant: 'default' as const, icon: Crown },
    custom: { label: 'Custom', variant: 'outline' as const, icon: Settings }
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// =====================================================
// FEATURE USAGE INDICATOR
// =====================================================

interface FeatureUsageProps {
  entitlement: FeatureEntitlement;
}

function FeatureUsage({ entitlement }: FeatureUsageProps) {
  const { feature_key, usage_limit, current_usage, is_enabled } = entitlement;
  
  if (!is_enabled) {
    return (
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="capitalize">{feature_key.replace(/_/g, ' ')}</span>
        <Badge variant="outline">Disabled</Badge>
      </div>
    );
  }

  if (usage_limit === null) {
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize">{feature_key.replace(/_/g, ' ')}</span>
        <Badge variant="secondary">Unlimited</Badge>
      </div>
    );
  }

  const usagePercentage = (current_usage / usage_limit) * 100;
  const isNearLimit = usagePercentage > 80;
  const isOverLimit = usagePercentage > 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize">{feature_key.replace(/_/g, ' ')}</span>
        <span className={`font-medium ${isOverLimit ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-muted-foreground'}`}>
          {current_usage.toLocaleString()} / {usage_limit.toLocaleString()}
        </span>
      </div>
      <Progress 
        value={Math.min(usagePercentage, 100)} 
        className={`h-2 ${isOverLimit ? 'bg-destructive/20' : isNearLimit ? 'bg-warning/20' : ''}`}
      />
    </div>
  );
}

// =====================================================
// MAIN SUBSCRIPTION CARD
// =====================================================

interface SubscriptionCardProps {
  className?: string;
  showManagement?: boolean;
}

export function SubscriptionCard({ className, showManagement = true }: SubscriptionCardProps) {
  const { subscription, entitlements, isLoading, error } = useSubscription();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-3 bg-muted rounded"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-destructive">Subscription Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>
            You don't have an active subscription. Contact your administrator to get access.
          </CardDescription>
        </CardHeader>
        {showManagement && (
          <CardContent>
            <Button variant="outline" className="w-full">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </CardContent>
        )}
      </Card>
    );
  }

  const plan = SUBSCRIPTION_PLANS[subscription.plan_tier];
  const currentPeriodEnd = subscription.current_period_end 
    ? new Date(subscription.current_period_end)
    : null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              {subscription.organization_name}
              <PlanTierBadge tier={subscription.plan_tier} />
            </CardTitle>
            <CardDescription>
              {plan?.description || 'Custom subscription plan'}
            </CardDescription>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Billing Information */}
        {currentPeriodEnd && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {subscription.status === 'trialing' ? 'Trial ends' : 'Renews'} on{' '}
              {currentPeriodEnd.toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Feature Usage */}
        {entitlements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">Feature Usage</span>
            </div>
            <div className="space-y-3">
              {entitlements
                .filter(e => e.usage_limit !== null || !e.is_enabled)
                .slice(0, 3) // Show top 3 limited features
                .map(entitlement => (
                  <FeatureUsage 
                    key={entitlement.feature_key} 
                    entitlement={entitlement} 
                  />
                ))}
            </div>
          </div>
        )}

        {/* Management Actions */}
        {showManagement && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing & Payments
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Team
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Subscription Settings
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// =====================================================
// COMPACT SUBSCRIPTION INDICATOR
// =====================================================

export function SubscriptionIndicator() {
  const { subscription, isLoading } = useSubscription();

  if (isLoading || !subscription) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <PlanTierBadge tier={subscription.plan_tier} />
      <span className="text-muted-foreground">•</span>
      <span className="text-muted-foreground">{subscription.organization_name}</span>
    </div>
  );
}
