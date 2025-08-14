/**
 * Enhanced Customer Card Component
 * Story 1.2: Enhanced Customer Management
 * 
 * Displays customer information with lifecycle stage, engagement metrics,
 * and subscription context in a beautiful card format
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Star,
  Crown,
  Activity,
  Calendar,
  MoreVertical,
  Edit,
  MessageSquare,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import type { EnhancedCustomer, CustomerLifecycleStage, CustomerTier } from '@/types/customer';

// =====================================================
// CUSTOMER TIER BADGE
// =====================================================

interface CustomerTierBadgeProps {
  tier: CustomerTier;
  className?: string;
}

function CustomerTierBadge({ tier, className }: CustomerTierBadgeProps) {
  const tierConfig = {
    standard: { label: 'Standard', variant: 'secondary' as const, icon: User },
    premium: { label: 'Premium', variant: 'default' as const, icon: Star },
    vip: { label: 'VIP', variant: 'destructive' as const, icon: Crown },
    enterprise: { label: 'Enterprise', variant: 'outline' as const, icon: Building2 }
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1 ${className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// =====================================================
// LIFECYCLE STAGE BADGE
// =====================================================

interface LifecycleStageBadgeProps {
  stage: CustomerLifecycleStage;
  className?: string;
}

function LifecycleStageBadge({ stage, className }: LifecycleStageBadgeProps) {
  const stageConfig = {
    prospect: { label: 'Prospect', color: 'bg-gray-100 text-gray-800' },
    new_customer: { label: 'New', color: 'bg-blue-100 text-blue-800' },
    onboarding: { label: 'Onboarding', color: 'bg-yellow-100 text-yellow-800' },
    active: { label: 'Active', color: 'bg-green-100 text-green-800' },
    engaged: { label: 'Engaged', color: 'bg-emerald-100 text-emerald-800' },
    at_risk: { label: 'At Risk', color: 'bg-orange-100 text-orange-800' },
    dormant: { label: 'Dormant', color: 'bg-red-100 text-red-800' },
    churned: { label: 'Churned', color: 'bg-gray-100 text-gray-800' },
    reactivated: { label: 'Reactivated', color: 'bg-purple-100 text-purple-800' }
  };

  const config = stageConfig[stage];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
}

// =====================================================
// ENGAGEMENT SCORE DISPLAY
// =====================================================

interface EngagementScoreProps {
  score: number;
  className?: string;
}

function EngagementScore({ score, className }: EngagementScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 60) return TrendingUp;
    if (score >= 40) return Activity;
    return TrendingDown;
  };

  const Icon = getScoreIcon(score);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className={`h-4 w-4 ${getScoreColor(score)}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Engagement</span>
          <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
        </div>
        <Progress value={score} className="h-2 mt-1" />
      </div>
    </div>
  );
}

// =====================================================
// MAIN CUSTOMER CARD
// =====================================================

interface CustomerCardProps {
  customer: EnhancedCustomer;
  onView?: (customer: EnhancedCustomer) => void;
  onEdit?: (customer: EnhancedCustomer) => void;
  onMessage?: (customer: EnhancedCustomer) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function CustomerCard({
  customer,
  onView,
  onEdit,
  onMessage,
  showActions = true,
  compact = false,
  className
}: CustomerCardProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const customerName = customer.business_name || `${customer.first_name} ${customer.last_name}`;
  const initials = customer.business_name 
    ? customer.business_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : `${customer.first_name[0]}${customer.last_name[0]}`.toUpperCase();

  const handleAction = async (action: () => void) => {
    setIsLoading(true);
    try {
      action();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while performing this action.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <AvatarInitials>{initials}</AvatarInitials>
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{customerName}</h4>
                <p className="text-sm text-muted-foreground">#{customer.mailbox_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LifecycleStageBadge stage={customer.lifecycle_stage} />
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => handleAction(() => onView(customer))}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => handleAction(() => onEdit(customer))}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </DropdownMenuItem>
                    )}
                    {onMessage && (
                      <DropdownMenuItem onClick={() => handleAction(() => onMessage(customer))}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                <AvatarInitials>{initials}</AvatarInitials>
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{customerName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>#{customer.mailbox_number}</span>
                {customer.customer_type === 'business' && <Building2 className="h-3 w-3" />}
                {customer.act_60_status && <Badge variant="outline" className="text-xs">Act 60</Badge>}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CustomerTierBadge tier={customer.customer_tier} />
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={isLoading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => handleAction(() => onView(customer))}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => handleAction(() => onEdit(customer))}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Customer
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  {onMessage && (
                    <DropdownMenuItem onClick={() => handleAction(() => onMessage(customer))}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Lifecycle Stage */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Lifecycle Stage</span>
          <LifecycleStageBadge stage={customer.lifecycle_stage} />
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          {customer.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{customer.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{customer.city}, {customer.state}</span>
          </div>
        </div>

        {/* Engagement Score */}
        {customer.engagement_score !== undefined && (
          <EngagementScore score={customer.engagement_score} />
        )}

        {/* Package Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">{customer.total_packages || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Packages</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">${customer.monthly_spend?.toFixed(0) || '0'}</span>
            </div>
            <p className="text-xs text-muted-foreground">Monthly Spend</p>
          </div>
        </div>

        {/* Risk Indicators */}
        {customer.risk_score > 50 && (
          <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">High risk customer - needs attention</span>
          </div>
        )}

        {/* Last Activity */}
        {customer.last_activity_at && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last active: {new Date(customer.last_activity_at).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
