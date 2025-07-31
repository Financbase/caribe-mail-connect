import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  FileText, 
  Lock, 
  Globe, 
  Clock, 
  Plus,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CompliancePolicy {
  id: string;
  policy_name: string;
  policy_type: string;
  policy_rules: Record<string, unknown>;
  retention_period_days?: number;
  geographic_restrictions: string[];
  encryption_requirements: { algorithm?: string; keyLength?: number; enabled?: boolean };
  audit_requirements: { enabled?: boolean; frequency?: string; retentionDays?: number };
  is_mandatory: boolean;
  compliance_framework?: string;
  effective_date: string;
  expiry_date?: string;
  created_at: string;
}

export const ComplianceSettings: React.FC = () => {
  const [policies, setPolicies] = useState<CompliancePolicy[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    policy_name: '',
    policy_type: 'retention',
    compliance_framework: 'GDPR',
    retention_period_days: 2555, // 7 years default
    is_mandatory: true,
    geographic_restrictions: [] as string[],
    encryption_requirements: {
      algorithm: 'AES-256',
      key_rotation_days: 90,
      at_rest: true,
      in_transit: true
    },
    audit_requirements: {
      log_access: true,
      log_modifications: true,
      retention_period: 2555
    },
    policy_rules: {}
  });

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compliance_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolicies(data || []);
    } catch (error) {
      console.error('Error fetching compliance policies:', error);
      toast({
        title: "Error",
        description: "Failed to load compliance policies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const policyData = {
        policy_name: formData.policy_name,
        policy_type: formData.policy_type,
        compliance_framework: formData.compliance_framework,
        retention_period_days: formData.retention_period_days,
        is_mandatory: formData.is_mandatory,
        geographic_restrictions: formData.geographic_restrictions,
        encryption_requirements: formData.encryption_requirements,
        audit_requirements: formData.audit_requirements,
        policy_rules: buildPolicyRules(),
        effective_date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('compliance_policies')
        .insert([policyData])
        .select()
        .single();

      if (error) throw error;

      setPolicies(prev => [data, ...prev]);
      setShowCreateDialog(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Compliance policy created successfully"
      });
    } catch (error) {
      console.error('Error creating compliance policy:', error);
      toast({
        title: "Error",
        description: "Failed to create compliance policy",
        variant: "destructive"
      });
    }
  };

  const buildPolicyRules = () => {
    switch (formData.policy_type) {
      case 'retention':
        return {
          retention_period_days: formData.retention_period_days,
          auto_delete: true,
          grace_period_days: 30
        };
      case 'encryption':
        return formData.encryption_requirements;
      case 'access_control':
        return {
          require_2fa: true,
          session_timeout_minutes: 60,
          ip_restrictions: formData.geographic_restrictions
        };
      case 'data_sovereignty':
        return {
          allowed_regions: formData.geographic_restrictions,
          data_residency_required: true
        };
      case 'audit_trail':
        return formData.audit_requirements;
      default:
        return {};
    }
  };

  const resetForm = () => {
    setFormData({
      policy_name: '',
      policy_type: 'retention',
      compliance_framework: 'GDPR',
      retention_period_days: 2555,
      is_mandatory: true,
      geographic_restrictions: [],
      encryption_requirements: {
        algorithm: 'AES-256',
        key_rotation_days: 90,
        at_rest: true,
        in_transit: true
      },
      audit_requirements: {
        log_access: true,
        log_modifications: true,
        retention_period: 2555
      },
      policy_rules: {}
    });
  };

  const addGeographicRestriction = (region: string) => {
    if (region && !formData.geographic_restrictions.includes(region)) {
      setFormData(prev => ({
        ...prev,
        geographic_restrictions: [...prev.geographic_restrictions, region]
      }));
    }
  };

  const removeGeographicRestriction = (region: string) => {
    setFormData(prev => ({
      ...prev,
      geographic_restrictions: prev.geographic_restrictions.filter(r => r !== region)
    }));
  };

  const getPolicyTypeIcon = (type: string) => {
    switch (type) {
      case 'retention':
        return <Clock className="h-4 w-4" />;
      case 'encryption':
        return <Lock className="h-4 w-4" />;
      case 'access_control':
        return <Shield className="h-4 w-4" />;
      case 'data_sovereignty':
        return <Globe className="h-4 w-4" />;
      case 'audit_trail':
        return <FileText className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getComplianceStatus = (policy: CompliancePolicy) => {
    const today = new Date();
    const effectiveDate = new Date(policy.effective_date);
    const expiryDate = policy.expiry_date ? new Date(policy.expiry_date) : null;

    if (expiryDate && today > expiryDate) {
      return { status: 'expired', color: 'bg-red-500' };
    }
    if (today < effectiveDate) {
      return { status: 'pending', color: 'bg-yellow-500' };
    }
    return { status: 'active', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Settings
              </CardTitle>
              <CardDescription>
                Manage data retention, encryption, and compliance policies
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => {
              const status = getComplianceStatus(policy);
              return (
                <div key={policy.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getPolicyTypeIcon(policy.policy_type)}
                      <div>
                        <h3 className="font-medium">{policy.policy_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {policy.compliance_framework} | 
                          {policy.policy_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${status.color}`} />
                      <Badge variant={status.status === 'active' ? 'default' : 'secondary'}>
                        {status.status}
                      </Badge>
                      {policy.is_mandatory && (
                        <Badge variant="destructive">Mandatory</Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Effective: {new Date(policy.effective_date).toLocaleDateString()}</span>
                      {policy.expiry_date && (
                        <span>Expires: {new Date(policy.expiry_date).toLocaleDateString()}</span>
                      )}
                      {policy.retention_period_days && (
                        <span>Retention: {policy.retention_period_days} days</span>
                      )}
                    </div>
                  </div>

                  {policy.geographic_restrictions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Geographic restrictions:</p>
                      <div className="flex gap-1 mt-1">
                        {policy.geographic_restrictions.map(region => (
                          <Badge key={region} variant="outline" className="text-xs">
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {policies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No compliance policies configured</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create Your First Policy
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Policy Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Compliance Policy</DialogTitle>
            <DialogDescription>
              Define data governance and compliance requirements
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePolicy} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy_name">Policy Name</Label>
                <Input
                  id="policy_name"
                  value={formData.policy_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, policy_name: e.target.value }))}
                  placeholder="e.g., GDPR Data Retention Policy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policy_type">Policy Type</Label>
                <Select 
                  value={formData.policy_type} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, policy_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retention">Data Retention</SelectItem>
                    <SelectItem value="encryption">Encryption Requirements</SelectItem>
                    <SelectItem value="access_control">Access Control</SelectItem>
                    <SelectItem value="data_sovereignty">Data Sovereignty</SelectItem>
                    <SelectItem value="audit_trail">Audit Trail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="compliance_framework">Compliance Framework</Label>
                <Select 
                  value={formData.compliance_framework} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, compliance_framework: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GDPR">GDPR</SelectItem>
                    <SelectItem value="HIPAA">HIPAA</SelectItem>
                    <SelectItem value="SOX">SOX</SelectItem>
                    <SelectItem value="PCI-DSS">PCI-DSS</SelectItem>
                    <SelectItem value="ISO27001">ISO 27001</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.policy_type === 'retention' && (
                <div className="space-y-2">
                  <Label htmlFor="retention_days">Retention Period (Days)</Label>
                  <Input
                    id="retention_days"
                    type="number"
                    value={formData.retention_period_days}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      retention_period_days: parseInt(e.target.value) || 2555 
                    }))}
                    min="1"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mandatory Policy</Label>
                <p className="text-sm text-muted-foreground">
                  Policy enforcement is required across all systems
                </p>
              </div>
              <Switch
                checked={formData.is_mandatory}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  is_mandatory: checked 
                }))}
              />
            </div>

            {/* Policy-specific configurations */}
            {formData.policy_type === 'encryption' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Encryption Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Encryption Algorithm</Label>
                      <Select 
                        value={formData.encryption_requirements.algorithm}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          encryption_requirements: { ...prev.encryption_requirements, algorithm: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AES-256">AES-256</SelectItem>
                          <SelectItem value="AES-128">AES-128</SelectItem>
                          <SelectItem value="ChaCha20">ChaCha20</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Key Rotation (Days)</Label>
                      <Input
                        type="number"
                        value={formData.encryption_requirements.key_rotation_days}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          encryption_requirements: { 
                            ...prev.encryption_requirements, 
                            key_rotation_days: parseInt(e.target.value) || 90 
                          }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.encryption_requirements.at_rest}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          encryption_requirements: { ...prev.encryption_requirements, at_rest: checked }
                        }))}
                      />
                      <Label>Encryption at Rest</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.encryption_requirements.in_transit}
                        onCheckedChange={(checked) => setFormData(prev => ({
                          ...prev,
                          encryption_requirements: { ...prev.encryption_requirements, in_transit: checked }
                        }))}
                      />
                      <Label>Encryption in Transit</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {(formData.policy_type === 'data_sovereignty' || formData.policy_type === 'access_control') && (
              <div className="space-y-4">
                <Label>Geographic Restrictions</Label>
                <div className="flex gap-2">
                  <Select onValueChange={(value) => addGeographicRestriction(value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {formData.geographic_restrictions.map(region => (
                    <Badge 
                      key={region} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => removeGeographicRestriction(region)}
                    >
                      {region} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Policy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};