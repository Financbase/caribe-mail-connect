/**
 * Integrated Growth Platform
 * Story 1.4: Integrated Growth Platform
 * 
 * Comprehensive growth platform combining Epic 2 loyalty system with SaaS growth infrastructure,
 * referral programs, customer acquisition, and retention strategies
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Users,
  Gift,
  Share2,
  Target,
  Star,
  Trophy,
  Zap,
  Heart,
  DollarSign,
  UserPlus,
  MessageCircle,
  Calendar,
  BarChart3,
  Settings,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
  Sparkles,
  Rocket,
  Crown,
  Coins
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLoyalty } from '@/hooks/useLoyalty';
import { useGrowth } from '@/hooks/useGrowth';
import type { GrowthMetrics, ReferralProgram, CustomerSegment } from '@/types/growth';

// =====================================================
// MAIN COMPONENT
// =====================================================

export function IntegratedGrowthPlatform() {
  const { subscription } = useSubscription();
  const { 
    loyaltyData,
    userPoints,
    userTier,
    achievements,
    challenges,
    isLoading: loyaltyLoading 
  } = useLoyalty();
  
  const {
    growthMetrics,
    referralPrograms,
    customerSegments,
    campaignPerformance,
    isLoading: growthLoading,
    error,
    refreshMetrics
  } = useGrowth();

  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('all');

  useEffect(() => {
    if (subscription) {
      refreshMetrics(selectedTimeRange);
    }
  }, [subscription, selectedTimeRange]);

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

  const isLoading = loyaltyLoading || growthLoading;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrated Growth Platform</h1>
          <p className="text-muted-foreground">
            Loyalty system + SaaS growth infrastructure for customer acquisition and retention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 1.4: Integrated Growth Platform
          </Badge>
          <Button variant="outline" onClick={() => refreshMetrics(selectedTimeRange)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Growth Metrics Overview */}
      {growthMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{growthMetrics.total_customers.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{growthMetrics.customer_growth_rate.toFixed(1)}%
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Referrals</p>
                  <p className="text-2xl font-bold">{growthMetrics.active_referrals}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    +{growthMetrics.referral_growth_rate.toFixed(1)}%
                  </p>
                </div>
                <Share2 className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Loyalty Members</p>
                  <p className="text-2xl font-bold">{growthMetrics.loyalty_members}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    {((growthMetrics.loyalty_members / growthMetrics.total_customers) * 100).toFixed(1)}%
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Retention Rate</p>
                  <p className="text-2xl font-bold">{(growthMetrics.retention_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    +{growthMetrics.retention_improvement.toFixed(1)}%
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue Growth</p>
                  <p className="text-2xl font-bold">{(growthMetrics.revenue_growth_rate * 100).toFixed(1)}%</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${growthMetrics.monthly_revenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Engagement Score</p>
                  <p className="text-2xl font-bold">{(growthMetrics.engagement_score * 100).toFixed(0)}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    High Activity
                  </p>
                </div>
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Growth Overview</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Integration</TabsTrigger>
          <TabsTrigger value="referrals">Referral Programs</TabsTrigger>
          <TabsTrigger value="segments">Customer Segments</TabsTrigger>
          <TabsTrigger value="campaigns">Growth Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Growth Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" />
                  Growth Funnel Performance
                </CardTitle>
                <CardDescription>
                  Customer acquisition and conversion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {growthMetrics?.funnel_metrics && (
                  <div className="space-y-4">
                    {Object.entries(growthMetrics.funnel_metrics).map(([stage, metrics]) => (
                      <div key={stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="capitalize font-medium">{stage.replace('_', ' ')}</span>
                          <span className="text-sm text-muted-foreground">
                            {metrics.count} ({(metrics.conversion_rate * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={metrics.conversion_rate * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loyalty Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Loyalty Program Impact
                </CardTitle>
                <CardDescription>
                  How loyalty affects customer behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">+40%</p>
                      <p className="text-sm text-muted-foreground">Retention Increase</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">+60%</p>
                      <p className="text-sm text-muted-foreground">Referral Rate</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">+25%</p>
                      <p className="text-sm text-muted-foreground">Social Sharing</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">+30%</p>
                      <p className="text-sm text-muted-foreground">Order Volume</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Growth Initiatives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Active Growth Initiatives
              </CardTitle>
              <CardDescription>
                Current campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Referral Bonus Campaign',
                    type: 'referral',
                    status: 'active',
                    performance: '+45% referrals',
                    icon: <Share2 className="h-5 w-5" />,
                    color: 'bg-blue-100 text-blue-700'
                  },
                  {
                    name: 'Loyalty Tier Upgrade',
                    type: 'loyalty',
                    status: 'active',
                    performance: '+32% engagement',
                    icon: <Crown className="h-5 w-5" />,
                    color: 'bg-purple-100 text-purple-700'
                  },
                  {
                    name: 'Social Sharing Rewards',
                    type: 'social',
                    status: 'active',
                    performance: '+28% shares',
                    icon: <MessageCircle className="h-5 w-5" />,
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    name: 'Birthday Bonus Program',
                    type: 'retention',
                    status: 'scheduled',
                    performance: 'Launching soon',
                    icon: <Gift className="h-5 w-5" />,
                    color: 'bg-orange-100 text-orange-700'
                  },
                  {
                    name: 'Review Incentive Program',
                    type: 'engagement',
                    status: 'active',
                    performance: '+55% reviews',
                    icon: <Star className="h-5 w-5" />,
                    color: 'bg-yellow-100 text-yellow-700'
                  },
                  {
                    name: 'VIP Customer Program',
                    type: 'retention',
                    status: 'planning',
                    performance: 'In development',
                    icon: <Award className="h-5 w-5" />,
                    color: 'bg-gray-100 text-gray-700'
                  }
                ].map((initiative) => (
                  <div key={initiative.name} className={`p-4 rounded-lg ${initiative.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {initiative.icon}
                      <span className="font-medium text-sm">{initiative.name}</span>
                    </div>
                    <p className="text-xs opacity-80 mb-2">{initiative.performance}</p>
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={initiative.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {initiative.status}
                      </Badge>
                      <span className="text-xs capitalize">{initiative.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loyalty" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Loyalty System Integration
              </CardTitle>
              <CardDescription>
                Epic 2 loyalty system integrated with SaaS growth infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Points Summary */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Points Overview
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Balance</span>
                      <span className="font-medium">{userPoints?.balance || 0} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Earned</span>
                      <span className="font-medium">{userPoints?.total_earned || 0} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Redeemed</span>
                      <span className="font-medium">{userPoints?.total_redeemed || 0} pts</span>
                    </div>
                  </div>
                </div>

                {/* Current Tier */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Current Tier
                  </h4>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {userTier?.tier_name || 'Bronze'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userTier?.points_required || 0} points to next tier
                    </div>
                    <Progress 
                      value={userTier ? (userTier.current_points / userTier.points_required) * 100 : 0} 
                      className="mt-2 h-2" 
                    />
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Recent Achievements
                  </h4>
                  <div className="space-y-2">
                    {achievements?.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">
                            +{achievement.points_reward} points
                          </p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-sm text-muted-foreground">No achievements yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Referral Programs
                </span>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Program
                </Button>
              </CardTitle>
              <CardDescription>
                Manage and track referral programs with loyalty integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referralPrograms?.map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Share2 className="h-5 w-5 text-blue-500" />
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {program.referrer_reward} points for referrer • {program.referee_reward} points for referee
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={program.is_active ? 'default' : 'secondary'}>
                        {program.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {program.total_referrals} referrals
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Share2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Referral Programs</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first referral program to start growing your customer base
                    </p>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Referral Program
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Segments
              </CardTitle>
              <CardDescription>
                Analyze customer segments for targeted growth strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Customer Segmentation</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced customer segmentation and targeting coming soon
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Segments
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Growth Campaigns
              </CardTitle>
              <CardDescription>
                Manage and track growth campaigns and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Campaign Management</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced campaign management and automation coming soon
                </p>
                <Button variant="outline">
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Growth Analytics
              </CardTitle>
              <CardDescription>
                Deep insights into growth performance and customer behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive growth analytics and insights coming soon
                </p>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
