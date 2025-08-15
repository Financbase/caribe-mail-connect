/**
 * SaaS Lifecycle Automation Service
 * Story 1.3: Unified Communication System
 * 
 * Automated communication workflows for SaaS customer lifecycle management
 * including onboarding, trial management, renewal campaigns, and churn prevention
 */

import { supabase } from '@/integrations/supabase/client';
import { CommunicationService } from './communication';
import type { 
  CommunicationWorkflow,
  WorkflowTriggerType,
  CommunicationChannel,
  CommunicationType
} from '@/types/communication';
import type { 
  Subscription,
  SubscriptionStatus 
} from '@/types/subscription';
import type { 
  CustomerLifecycleStage 
} from '@/types/customer';

// =====================================================
// SAAS LIFECYCLE AUTOMATION SERVICE
// =====================================================

export class SaaSLifecycleAutomationService {

  /**
   * Initialize default SaaS lifecycle workflows for a subscription
   */
  static async initializeDefaultWorkflows(subscriptionId: string): Promise<boolean> {
    try {
      const workflows = [
        this.createOnboardingWorkflow(subscriptionId),
        this.createTrialExpirationWorkflow(subscriptionId),
        this.createRenewalReminderWorkflow(subscriptionId),
        this.createChurnPreventionWorkflow(subscriptionId),
        this.createEngagementWorkflow(subscriptionId),
        this.createPaymentFailureWorkflow(subscriptionId)
      ];

      const results = await Promise.allSettled(workflows);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      console.log(`Initialized ${successCount}/${workflows.length} SaaS lifecycle workflows`);
      return successCount > 0;
    } catch (error) {
      console.error('Error initializing SaaS lifecycle workflows:', error);
      return false;
    }
  }

  /**
   * Customer Onboarding Workflow
   */
  private static async createOnboardingWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Customer Onboarding Sequence',
      description: 'Automated onboarding sequence for new customers',
      subscription_id: subscriptionId,
      trigger_type: 'customer_created',
      trigger_conditions: [
        {
          field: 'lifecycle_stage',
          operator: 'equals',
          value: 'new_customer'
        }
      ],
      steps: [
        {
          id: 'welcome_email',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            wait_duration_hours: 0
          }
        },
        {
          id: 'wait_24h',
          step_number: 2,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 24
          }
        },
        {
          id: 'setup_guide',
          step_number: 3,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            wait_duration_hours: 0
          }
        },
        {
          id: 'wait_72h',
          step_number: 4,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 72
          }
        },
        {
          id: 'check_engagement',
          step_number: 5,
          step_type: 'condition',
          configuration: {
            conditions: [
              {
                field: 'last_login_at',
                operator: 'greater_than',
                value: '72_hours_ago'
              }
            ]
          },
          condition_true_step: 6,
          condition_false_step: 7
        },
        {
          id: 'engagement_tips',
          step_number: 6,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'activation_help',
          step_number: 7,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        }
      ],
      is_active: true,
      max_executions_per_customer: 1,
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Trial Expiration Workflow
   */
  private static async createTrialExpirationWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Trial Expiration Sequence',
      description: 'Automated reminders for trial expiration and conversion',
      subscription_id: subscriptionId,
      trigger_type: 'scheduled',
      trigger_conditions: [
        {
          field: 'subscription_status',
          operator: 'equals',
          value: 'trialing'
        },
        {
          field: 'trial_ends_at',
          operator: 'less_than',
          value: '7_days_from_now'
        }
      ],
      steps: [
        {
          id: 'trial_7_days',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'trial_ends_at',
                operator: 'equals',
                value: '7_days_from_now'
              }
            ]
          }
        },
        {
          id: 'trial_3_days',
          step_number: 2,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'trial_ends_at',
                operator: 'equals',
                value: '3_days_from_now'
              }
            ]
          }
        },
        {
          id: 'trial_1_day',
          step_number: 3,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'trial_ends_at',
                operator: 'equals',
                value: '1_day_from_now'
              }
            ]
          }
        },
        {
          id: 'trial_expired',
          step_number: 4,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'trial_ends_at',
                operator: 'less_than',
                value: 'now'
              }
            ]
          }
        }
      ],
      is_active: true,
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Subscription Renewal Workflow
   */
  private static async createRenewalReminderWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Subscription Renewal Reminders',
      description: 'Automated reminders for subscription renewals',
      subscription_id: subscriptionId,
      trigger_type: 'scheduled',
      trigger_conditions: [
        {
          field: 'subscription_status',
          operator: 'equals',
          value: 'active'
        },
        {
          field: 'current_period_end',
          operator: 'less_than',
          value: '30_days_from_now'
        }
      ],
      steps: [
        {
          id: 'renewal_30_days',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'current_period_end',
                operator: 'equals',
                value: '30_days_from_now'
              }
            ]
          }
        },
        {
          id: 'renewal_7_days',
          step_number: 2,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'current_period_end',
                operator: 'equals',
                value: '7_days_from_now'
              }
            ]
          }
        },
        {
          id: 'renewal_1_day',
          step_number: 3,
          step_type: 'send_communication',
          configuration: {
            channel: 'email',
            conditions: [
              {
                field: 'current_period_end',
                operator: 'equals',
                value: '1_day_from_now'
              }
            ]
          }
        }
      ],
      is_active: true,
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Churn Prevention Workflow
   */
  private static async createChurnPreventionWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Churn Prevention Sequence',
      description: 'Automated workflow to prevent customer churn',
      subscription_id: subscriptionId,
      trigger_type: 'inactivity_detected',
      trigger_conditions: [
        {
          field: 'last_login_at',
          operator: 'less_than',
          value: '14_days_ago'
        },
        {
          field: 'subscription_status',
          operator: 'equals',
          value: 'active'
        }
      ],
      steps: [
        {
          id: 'check_in_email',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'wait_3_days',
          step_number: 2,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 72
          }
        },
        {
          id: 'check_response',
          step_number: 3,
          step_type: 'condition',
          configuration: {
            conditions: [
              {
                field: 'last_login_at',
                operator: 'greater_than',
                value: '3_days_ago'
              }
            ]
          },
          condition_true_step: 8, // End workflow
          condition_false_step: 4
        },
        {
          id: 'offer_help',
          step_number: 4,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'wait_7_days',
          step_number: 5,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 168
          }
        },
        {
          id: 'special_offer',
          step_number: 6,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'create_retention_task',
          step_number: 7,
          step_type: 'create_task',
          configuration: {
            task_details: {
              title: 'High Churn Risk Customer',
              description: 'Customer showing signs of churn - requires personal outreach',
              assigned_to: 'customer_success_team'
            }
          }
        }
      ],
      is_active: true,
      max_executions_per_customer: 1,
      cooldown_period_hours: 720, // 30 days
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Customer Engagement Workflow
   */
  private static async createEngagementWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Customer Engagement Sequence',
      description: 'Regular engagement and feature education emails',
      subscription_id: subscriptionId,
      trigger_type: 'scheduled',
      trigger_conditions: [
        {
          field: 'subscription_status',
          operator: 'equals',
          value: 'active'
        },
        {
          field: 'lifecycle_stage',
          operator: 'in',
          value: ['active_customer', 'power_user']
        }
      ],
      steps: [
        {
          id: 'monthly_newsletter',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'feature_spotlight',
          step_number: 2,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'success_story',
          step_number: 3,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        }
      ],
      is_active: true,
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Payment Failure Recovery Workflow
   */
  private static async createPaymentFailureWorkflow(subscriptionId: string): Promise<CommunicationWorkflow> {
    const workflow: Partial<CommunicationWorkflow> = {
      name: 'Payment Failure Recovery',
      description: 'Automated sequence for failed payment recovery',
      subscription_id: subscriptionId,
      trigger_type: 'payment_failed',
      trigger_conditions: [
        {
          field: 'subscription_status',
          operator: 'equals',
          value: 'past_due'
        }
      ],
      steps: [
        {
          id: 'payment_failed_immediate',
          step_number: 1,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'wait_3_days',
          step_number: 2,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 72
          }
        },
        {
          id: 'payment_retry_reminder',
          step_number: 3,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'wait_4_days',
          step_number: 4,
          step_type: 'wait',
          configuration: {
            wait_duration_hours: 96
          }
        },
        {
          id: 'final_notice',
          step_number: 5,
          step_type: 'send_communication',
          configuration: {
            channel: 'email'
          }
        },
        {
          id: 'update_customer_status',
          step_number: 6,
          step_type: 'update_customer',
          configuration: {
            customer_updates: {
              lifecycle_stage: 'at_risk'
            }
          }
        }
      ],
      is_active: true,
      execution_count: 0,
      success_rate: 0
    };

    return await this.createWorkflow(workflow);
  }

  /**
   * Create workflow in database
   */
  private static async createWorkflow(workflowData: Partial<CommunicationWorkflow>): Promise<CommunicationWorkflow> {
    const { data, error } = await supabase
      .from('communication_workflows')
      .insert({
        ...workflowData,
        created_at: new Date().toISOString(),
        created_by: 'system',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as CommunicationWorkflow;
  }

  /**
   * Execute SaaS lifecycle automation based on trigger
   */
  static async executeTrigger(
    subscriptionId: string,
    triggerType: WorkflowTriggerType,
    customerId: string,
    triggerData: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      // Get active workflows for this trigger
      const { data: workflows, error } = await supabase
        .from('communication_workflows')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('trigger_type', triggerType)
        .eq('is_active', true);

      if (error) throw error;

      if (!workflows || workflows.length === 0) {
        return true; // No workflows to execute
      }

      // Execute each workflow
      const results = await Promise.allSettled(
        workflows.map(workflow => 
          this.executeWorkflow(workflow as CommunicationWorkflow, customerId, triggerData)
        )
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`Executed ${successCount}/${workflows.length} SaaS lifecycle workflows`);

      return successCount > 0;
    } catch (error) {
      console.error('Error executing SaaS lifecycle trigger:', error);
      return false;
    }
  }

  /**
   * Execute individual workflow
   */
  private static async executeWorkflow(
    workflow: CommunicationWorkflow,
    customerId: string,
    triggerData: Record<string, any>
  ): Promise<boolean> {
    try {
      // Check cooldown period
      if (workflow.cooldown_period_hours && workflow.last_executed_at) {
        const lastExecuted = new Date(workflow.last_executed_at);
        const cooldownEnd = new Date(lastExecuted.getTime() + (workflow.cooldown_period_hours * 60 * 60 * 1000));
        if (new Date() < cooldownEnd) {
          return false; // Still in cooldown
        }
      }

      // Check max executions per customer
      if (workflow.max_executions_per_customer) {
        const { count } = await supabase
          .from('communication_workflow_executions')
          .select('*', { count: 'exact', head: true })
          .eq('workflow_id', workflow.id)
          .eq('customer_id', customerId);

        if (count && count >= workflow.max_executions_per_customer) {
          return false; // Max executions reached
        }
      }

      // Create workflow execution record
      const { data: execution, error: executionError } = await supabase
        .from('communication_workflow_executions')
        .insert({
          workflow_id: workflow.id,
          customer_id: customerId,
          subscription_id: workflow.subscription_id,
          trigger_data: triggerData,
          status: 'running',
          current_step: 1,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (executionError) throw executionError;

      // Execute first step
      await this.executeWorkflowStep(workflow, execution.id, 1, customerId);

      // Update workflow last executed
      await supabase
        .from('communication_workflows')
        .update({
          last_executed_at: new Date().toISOString(),
          execution_count: workflow.execution_count + 1
        })
        .eq('id', workflow.id);

      return true;
    } catch (error) {
      console.error('Error executing workflow:', error);
      return false;
    }
  }

  /**
   * Execute workflow step
   */
  private static async executeWorkflowStep(
    workflow: CommunicationWorkflow,
    executionId: string,
    stepNumber: number,
    customerId: string
  ): Promise<void> {
    const step = workflow.steps.find(s => s.step_number === stepNumber);
    if (!step) return;

    try {
      switch (step.step_type) {
        case 'send_communication':
          await this.executeCommunicationStep(step, customerId, workflow.subscription_id);
          break;
        case 'wait':
          await this.scheduleNextStep(executionId, step.configuration.wait_duration_hours || 0);
          return; // Don't proceed to next step immediately
        case 'condition':
          const nextStep = await this.evaluateCondition(step, customerId);
          if (nextStep) {
            await this.executeWorkflowStep(workflow, executionId, nextStep, customerId);
          }
          return;
        case 'update_customer':
          await this.executeCustomerUpdate(step, customerId);
          break;
        case 'create_task':
          await this.executeCreateTask(step, customerId, workflow.subscription_id);
          break;
      }

      // Proceed to next step if exists
      const nextStepNumber = step.success_next_step || stepNumber + 1;
      const nextStep = workflow.steps.find(s => s.step_number === nextStepNumber);
      if (nextStep) {
        await this.executeWorkflowStep(workflow, executionId, nextStepNumber, customerId);
      } else {
        // Workflow completed
        await supabase
          .from('communication_workflow_executions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', executionId);
      }
    } catch (error) {
      console.error('Error executing workflow step:', error);
      await supabase
        .from('communication_workflow_executions')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
          completed_at: new Date().toISOString()
        })
        .eq('id', executionId);
    }
  }

  /**
   * Execute communication step
   */
  private static async executeCommunicationStep(
    step: any,
    customerId: string,
    subscriptionId: string
  ): Promise<void> {
    const channel = step.configuration.channel || 'email';
    const templateType = this.getTemplateTypeForStep(step.id);

    await CommunicationService.sendCommunication({
      customer_id: customerId,
      channel: channel as CommunicationChannel,
      type: templateType as CommunicationType,
      metadata: {
        workflow_step_id: step.id,
        automated: true
      }
    });
  }

  /**
   * Get template type for step
   */
  private static getTemplateTypeForStep(stepId: string): string {
    const templateMap: Record<string, string> = {
      'welcome_email': 'welcome',
      'setup_guide': 'onboarding',
      'engagement_tips': 'engagement',
      'activation_help': 'activation',
      'trial_7_days': 'trial_reminder',
      'trial_3_days': 'trial_reminder',
      'trial_1_day': 'trial_urgent',
      'trial_expired': 'trial_expired',
      'renewal_30_days': 'renewal_reminder',
      'renewal_7_days': 'renewal_reminder',
      'renewal_1_day': 'renewal_urgent',
      'check_in_email': 'check_in',
      'offer_help': 'support_offer',
      'special_offer': 'retention_offer',
      'monthly_newsletter': 'newsletter',
      'feature_spotlight': 'feature_education',
      'success_story': 'success_story',
      'payment_failed_immediate': 'payment_failed',
      'payment_retry_reminder': 'payment_retry',
      'final_notice': 'payment_final_notice'
    };

    return templateMap[stepId] || 'system_notification';
  }

  /**
   * Schedule next step execution
   */
  private static async scheduleNextStep(executionId: string, delayHours: number): Promise<void> {
    const scheduledAt = new Date(Date.now() + (delayHours * 60 * 60 * 1000));
    
    // In a real implementation, this would schedule a job
    // For now, we'll just update the execution record
    await supabase
      .from('communication_workflow_executions')
      .update({
        status: 'waiting',
        next_step_at: scheduledAt.toISOString()
      })
      .eq('id', executionId);
  }

  /**
   * Evaluate condition step
   */
  private static async evaluateCondition(step: any, customerId: string): Promise<number | null> {
    // This would implement condition evaluation logic
    // For now, return the true path
    return step.condition_true_step || null;
  }

  /**
   * Execute customer update step
   */
  private static async executeCustomerUpdate(step: any, customerId: string): Promise<void> {
    const updates = step.configuration.customer_updates;
    if (updates) {
      await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId);
    }
  }

  /**
   * Execute create task step
   */
  private static async executeCreateTask(step: any, customerId: string, subscriptionId: string): Promise<void> {
    const taskDetails = step.configuration.task_details;
    if (taskDetails) {
      await supabase
        .from('tasks')
        .insert({
          title: taskDetails.title,
          description: taskDetails.description,
          customer_id: customerId,
          subscription_id: subscriptionId,
          assigned_to: taskDetails.assigned_to,
          due_date: taskDetails.due_date,
          status: 'open',
          priority: 'high'
        });
    }
  }
}
