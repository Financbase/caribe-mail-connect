import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useBackupManagement, DisasterRecoveryPlan as PlanType } from '@/hooks/useBackupManagement';
import { 
  Shield, 
  Plus, 
  Play, 
  Clock, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Settings,
  TestTube
} from 'lucide-react';

interface DisasterRecoveryPlanProps {
  plans: PlanType[];
}

export const DisasterRecoveryPlan: React.FC<DisasterRecoveryPlanProps> = ({
  plans
}) => {
  const { createRecoveryPlan, updateRecoveryPlan, scheduleRecoveryDrill } = useBackupManagement();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  
  const [formData, setFormData] = useState({
    plan_name: '',
    plan_type: 'full_restore' as const,
    priority_level: 'medium' as const,
    recovery_time_objective: 60,
    recovery_point_objective: 15,
    automated_execution: false,
    plan_steps: [] as string[],
    emergency_contacts: [] as { name: string; email: string; phone: string; role: string }[]
  });

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const planData = {
        ...formData,
        plan_steps: formData.plan_steps.map((step, index) => ({
          step_number: index + 1,
          description: step,
          estimated_duration: 5 // minutes
        }))
      };

      await createRecoveryPlan(planData);
      setShowCreateDialog(false);
      resetForm();
    } catch (error) {
      console.error('Error creating recovery plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      plan_type: 'full_restore',
      priority_level: 'medium',
      recovery_time_objective: 60,
      recovery_point_objective: 15,
      automated_execution: false,
      plan_steps: [],
      emergency_contacts: []
    });
  };

  const addPlanStep = () => {
    setFormData(prev => ({
      ...prev,
      plan_steps: [...prev.plan_steps, '']
    }));
  };

  const updatePlanStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      plan_steps: prev.plan_steps.map((step, i) => i === index ? value : step)
    }));
  };

  const removePlanStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      plan_steps: prev.plan_steps.filter((_, i) => i !== index)
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: [...prev.emergency_contacts, { name: '', email: '', phone: '', role: '' }]
    }));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.map((contact, i) => 
        i === index ? { ...contact, [field]: value } : contact
      )
    }));
  };

  const removeEmergencyContact = (index: number) => {
    setFormData(prev => ({
      ...prev,
      emergency_contacts: prev.emergency_contacts.filter((_, i) => i !== index)
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleDrill = async (planId: string) => {
    try {
      await scheduleRecoveryDrill(planId);
    } catch (error) {
      console.error('Error scheduling drill:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Disaster Recovery Plans
              </CardTitle>
              <CardDescription>
                Manage disaster recovery procedures and business continuity plans
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => { setSelectedPlan(plan); setShowDetailsDialog(true); }}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{plan.plan_name}</h3>
                      <p className="text-sm text-muted-foreground capitalize mb-2">
                        {plan.plan_type.replace('_', ' ')}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          RTO: {plan.recovery_time_objective || 'N/A'} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          RPO: {plan.recovery_point_objective || 'N/A'} min
                        </span>
                      </div>

                      {plan.last_tested_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last tested: {new Date(plan.last_tested_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`${getPriorityColor(plan.priority_level)} text-white`}
                      >
                        {plan.priority_level}
                      </Badge>
                      
                      {plan.automated_execution && (
                        <Badge variant="outline">Automated</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDrill(plan.id);
                      }}
                    >
                      <TestTube className="h-3 w-3 mr-1" />
                      Drill
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {plans.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No disaster recovery plans configured</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowCreateDialog(true)}
                >
                  Create Your First Plan
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create Plan Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Disaster Recovery Plan</DialogTitle>
            <DialogDescription>
              Define procedures for system recovery and business continuity
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePlan} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan_name">Plan Name</Label>
                <Input
                  id="plan_name"
                  value={formData.plan_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, plan_name: e.target.value }))}
                  placeholder="e.g., Database Failure Recovery"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan_type">Plan Type</Label>
                <Select 
                  value={formData.plan_type} 
                  onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, plan_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_restore">Full System Restore</SelectItem>
                    <SelectItem value="partial_restore">Partial Restore</SelectItem>
                    <SelectItem value="failover">Failover</SelectItem>
                    <SelectItem value="data_sync">Data Synchronization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority_level">Priority Level</Label>
                <Select 
                  value={formData.priority_level} 
                  onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, priority_level: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rto">RTO (Minutes)</Label>
                <Input
                  id="rto"
                  type="number"
                  value={formData.recovery_time_objective}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recovery_time_objective: parseInt(e.target.value) || 60 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rpo">RPO (Minutes)</Label>
                <Input
                  id="rpo"
                  type="number"
                  value={formData.recovery_point_objective}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    recovery_point_objective: parseInt(e.target.value) || 15 
                  }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automated Execution</Label>
                <p className="text-sm text-muted-foreground">
                  Allow system to execute this plan automatically
                </p>
              </div>
              <Switch
                checked={formData.automated_execution}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  automated_execution: checked 
                }))}
              />
            </div>

            {/* Recovery Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Recovery Steps</Label>
                <Button type="button" onClick={addPlanStep} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>
              
              {formData.plan_steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <Input
                    value={step}
                    onChange={(e) => updatePlanStep(index, e.target.value)}
                    placeholder="Describe the recovery step"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={() => removePlanStep(index)} 
                    size="sm" 
                    variant="outline"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Emergency Contacts</Label>
                <Button type="button" onClick={addEmergencyContact} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </div>
              
              {formData.emergency_contacts.map((contact, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Input
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                    placeholder="Full Name"
                  />
                  <Input
                    value={contact.email}
                    onChange={(e) => updateEmergencyContact(index, 'email', e.target.value)}
                    placeholder="Email Address"
                    type="email"
                  />
                  <Input
                    value={contact.phone}
                    onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                    placeholder="Phone Number"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={contact.role}
                      onChange={(e) => updateEmergencyContact(index, 'role', e.target.value)}
                      placeholder="Role"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={() => removeEmergencyContact(index)} 
                      size="sm" 
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Plan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Plan Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.plan_name}</DialogTitle>
            <DialogDescription>
              Recovery plan details and execution history
            </DialogDescription>
          </DialogHeader>

          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Plan Type</Label>
                  <p className="capitalize">{selectedPlan.plan_type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={`${getPriorityColor(selectedPlan.priority_level)} text-white`}>
                    {selectedPlan.priority_level}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Recovery Time Objective</Label>
                  <p>{selectedPlan.recovery_time_objective || 'Not set'} minutes</p>
                </div>
                <div>
                  <Label>Recovery Point Objective</Label>
                  <p>{selectedPlan.recovery_point_objective || 'Not set'} minutes</p>
                </div>
              </div>

              {selectedPlan.plan_steps && selectedPlan.plan_steps.length > 0 && (
                <div>
                  <Label>Recovery Steps</Label>
                  <div className="space-y-2 mt-2">
                    {selectedPlan.plan_steps.map((step: unknown, index: number) => (
                      <div key={index} className="flex gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                          {index + 1}
                        </span>
                        <span>{typeof step === 'string' ? step : step.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlan.emergency_contacts && selectedPlan.emergency_contacts.length > 0 && (
                <div>
                  <Label>Emergency Contacts</Label>
                  <div className="space-y-2 mt-2">
                    {selectedPlan.emergency_contacts.map((contact: unknown, index: number) => (
                      <div key={index} className="text-sm border rounded p-2">
                        <p className="font-medium">{contact.name} - {contact.role}</p>
                        <p className="text-muted-foreground">{contact.email} | {contact.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};