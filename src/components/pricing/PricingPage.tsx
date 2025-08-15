/**
 * Pricing Page Component
 * Story 1: Clear Product Shape - Pricing Model
 * 
 * Public-facing pricing page with tier comparison,
 * feature matrix, and subscription management
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Check,
  X,
  Star,
  Zap,
  Shield,
  Users,
  Package,
  MessageSquare,
  BarChart3,
  Smartphone,
  Headphones,
  Crown,
  Building,
  ArrowRight
} from 'lucide-react';
import { PricingService } from '@/services/pricing';
import type { PricingTier } from '@/services/pricing';

// =====================================================
// PRICING PAGE COMPONENT
// =====================================================

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const pricingTiers = PricingService.getPricingTiers();
  const featureComparison = PricingService.getFeatureComparison();

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderPricingCard = (tier: PricingTier) => {
    const price = isYearly ? tier.price_yearly : tier.price_monthly;
    const monthlyPrice = isYearly ? tier.price_yearly / 12 : tier.price_monthly;
    const savings = PricingService.calculateYearlySavings(tier.id);
    const savingsPercentage = tier.price_monthly > 0 ? Math.round((savings / (tier.price_monthly * 12)) * 100) : 0;

    return (
      <Card 
        key={tier.id}
        className={`relative ${tier.popular ? 'border-blue-500 shadow-lg scale-105' : ''} ${
          selectedTier === tier.id ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {tier.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-blue-500 text-white px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Most Popular
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">{tier.name}</CardTitle>
          <CardDescription className="text-sm">{tier.description}</CardDescription>
          
          <div className="mt-4">
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold">${monthlyPrice.toFixed(0)}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            
            {isYearly && tier.price_monthly > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Billed yearly (${price}/year)
                </p>
                {savings > 0 && (
                  <Badge variant="secondary" className="mt-1">
                    Save ${savings} ({savingsPercentage}%)
                  </Badge>
                )}
              </div>
            )}

            {tier.trial_days > 0 && (
              <Badge variant="outline" className="mt-2">
                {tier.trial_days}-day free trial
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Key Features */}
          <div className="space-y-3">
            {tier.features.slice(0, 6).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                {feature.included ? (
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-gray-300 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground line-through'}`}>
                    {feature.name}
                    {feature.limit && feature.unit && (
                      <span className="text-muted-foreground ml-1">
                        ({feature.limit.toLocaleString()} {feature.unit})
                      </span>
                    )}
                  </span>
                  {feature.highlight && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      New
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            className={`w-full mt-6 ${tier.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
            variant={tier.popular ? 'default' : 'outline'}
            onClick={() => setSelectedTier(tier.id)}
          >
            {tier.price_monthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          {tier.enterprise_only && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Contact sales for custom pricing
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderFeatureIcon = (featureName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Package Management': <Package className="h-4 w-4" />,
      'Customer Management': <Users className="h-4 w-4" />,
      'Email Notifications': <MessageSquare className="h-4 w-4" />,
      'SMS Notifications': <Smartphone className="h-4 w-4" />,
      'Advanced Analytics': <BarChart3 className="h-4 w-4" />,
      'API Access': <Zap className="h-4 w-4" />,
      'Custom Branding': <Crown className="h-4 w-4" />,
      'Priority Support': <Headphones className="h-4 w-4" />,
      'White Label': <Building className="h-4 w-4" />,
      'Advanced Security': <Shield className="h-4 w-4" />
    };

    return iconMap[featureName] || <Check className="h-4 w-4" />;
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save up to 17%
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="plans" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Pricing Plans */}
          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingTiers.map(renderPricingCard)}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Trusted by thousands of businesses worldwide
              </p>
              <div className="flex items-center justify-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="text-sm">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Feature Comparison */}
          <TabsContent value="features">
            <Card className="max-w-6xl mx-auto">
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
                <CardDescription>
                  Compare features across all plans to find the right fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-4">Feature</th>
                        {pricingTiers.map(tier => (
                          <th key={tier.id} className="text-center py-4 px-4 min-w-32">
                            <div className="font-medium">{tier.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ${isYearly ? Math.round(tier.price_yearly / 12) : tier.price_monthly}/mo
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(featureComparison).map(([featureName, tierData]) => (
                        <tr key={featureName} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {renderFeatureIcon(featureName)}
                              <span className="font-medium">{featureName}</span>
                            </div>
                          </td>
                          {pricingTiers.map(tier => {
                            const feature = (tierData as any)[tier.id];
                            return (
                              <td key={tier.id} className="text-center py-4 px-4">
                                {feature.included ? (
                                  <div className="flex flex-col items-center">
                                    <Check className="h-5 w-5 text-green-500" />
                                    {feature.limit && (
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {feature.limit.toLocaleString()} {feature.unit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <X className="h-5 w-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at the end of your billing cycle for downgrades.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a setup fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  No setup fees for any plan. You only pay the monthly or yearly subscription fee. Enterprise customers may have optional onboarding services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens if I exceed my limits?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We'll notify you when approaching limits. You can upgrade your plan or pay for additional usage. We never cut off service without warning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="mb-6 opacity-90">
                Join thousands of businesses already using PRMCMS to streamline their package management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
