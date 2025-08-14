import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Clock, TrendingUp, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UsageStats {
  total_actions: number;
  total_amount: number;
  pending_invoices: number;
  overdue_amount: number;
}

interface LateFeeConfig {
  id?: string;
  location_id: string;
  fee_name: string;
  fee_type: string;
  fee_amount: number;
  applies_after_days: number;
  grace_period_days: number;
  max_fee_amount?: number;
  is_active: boolean;
}

export function BillingAutomation() {
  const [config, setConfig] = useState<LateFeeConfig>({
    location_id: '',
    fee_name: 'Late Payment Fee',
    fee_type: 'fixed',
    fee_amount: 25.00,
    applies_after_days: 30,
    grace_period_days: 7,
    is_active: true
  });
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingConfig();
    fetchUsageStats();
  }, [fetchBillingConfig, fetchUsageStats]);

  const fetchBillingConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('late_fee_configurations')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching billing config:', error);
      toast({
        title: "Error",
        description: "Failed to load billing configuration",
        variant: "destructive",
      });
    }
  };

  const fetchUsageStats = async () => {
    try {
      const { data: actions, error: actionsError } = await supabase
        .from('mail_actions')
        .select('cost_amount')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (actionsError) throw actionsError;

      const totalActions = actions?.length || 0;
      const totalAmount = actions?.reduce((sum, action) => sum + (action.cost_amount || 0), 0) || 0;

      const { data: billing, error: billingError } = await supabase
        .from('virtual_mailbox_billing')
        .select('total_amount, status')
        .in('status', ['pending', 'overdue']);

      if (billingError) throw billingError;

      const pendingInvoices = billing?.filter(b => b.status === 'pending').length || 0;
      const overdueAmount = billing?.filter(b => b.status === 'overdue')
        .reduce((sum, b) => sum + b.total_amount, 0) || 0;

      setUsageStats({
        total_actions: totalActions,
        total_amount: totalAmount,
        pending_invoices: pendingInvoices,
        overdue_amount: overdueAmount
      });
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('late_fee_configurations')
        .upsert(config);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Error",
        description: "Failed to save billing configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const runBillingCycle = async () => {
    try {
      const { error } = await supabase.functions.invoke('run-billing-cycle');
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Billing cycle started successfully",
      });
      
      fetchUsageStats();
    } catch (error) {
      console.error('Error running billing cycle:', error);
      toast({
        title: "Error",
        description: "Failed to run billing cycle",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Monthly Actions</p>
                <p className="text-2xl font-bold">{usageStats?.total_actions || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Monthly Revenue</p>
                <p className="text-2xl font-bold">${(usageStats?.total_amount || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending Invoices</p>
                <p className="text-2xl font-bold">{usageStats?.pending_invoices || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Overdue Amount</p>
                <p className="text-2xl font-bold">${(usageStats?.overdue_amount || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Late Fee Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure late fees for overdue virtual mailbox payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={config.is_active}
              onCheckedChange={(checked) => 
                setConfig(prev => ({ ...prev, is_active: checked }))
              }
            />
            <Label htmlFor="is-active">Enable Late Fees</Label>
            <Badge variant={config.is_active ? "default" : "secondary"}>
              {config.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fee-name">Fee Name</Label>
              <Input
                id="fee-name"
                value={config.fee_name}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, fee_name: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="fee-amount">Fee Amount ($)</Label>
              <Input
                id="fee-amount"
                type="number"
                step="0.01"
                value={config.fee_amount}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, fee_amount: parseFloat(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="applies-after">Applies After (Days)</Label>
              <Input
                id="applies-after"
                type="number"
                value={config.applies_after_days}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, applies_after_days: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="grace-period">Grace Period (Days)</Label>
              <Input
                id="grace-period"
                type="number"
                value={config.grace_period_days}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, grace_period_days: parseInt(e.target.value) }))
                }
              />
            </div>

            <div>
              <Label htmlFor="max-fee">Max Fee Amount ($)</Label>
              <Input
                id="max-fee"
                type="number"
                step="0.01"
                value={config.max_fee_amount || ''}
                onChange={(e) => 
                  setConfig(prev => ({ ...prev, max_fee_amount: e.target.value ? parseFloat(e.target.value) : undefined }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button onClick={saveConfig} disabled={saving}>
              {saving ? "Saving..." : "Save Configuration"}
            </Button>
            <Button variant="outline" onClick={runBillingCycle}>
              Run Billing Cycle Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}