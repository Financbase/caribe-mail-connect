/**
 * SaaS Communication Templates Service
 * Story 1.3: Unified Communication System
 * 
 * Pre-built communication templates for SaaS lifecycle automation
 * including onboarding, trial management, renewals, and churn prevention
 */

import { supabase } from '@/integrations/supabase/client';
import type { CommunicationTemplate } from '@/types/communication';

// =====================================================
// SAAS TEMPLATES SERVICE
// =====================================================

export class SaaSTemplatesService {

  /**
   * Initialize default SaaS templates for a subscription
   */
  static async initializeDefaultTemplates(subscriptionId: string): Promise<boolean> {
    try {
      const templates = [
        // Onboarding Templates
        ...this.getOnboardingTemplates(subscriptionId),
        // Trial Management Templates
        ...this.getTrialTemplates(subscriptionId),
        // Renewal Templates
        ...this.getRenewalTemplates(subscriptionId),
        // Churn Prevention Templates
        ...this.getChurnPreventionTemplates(subscriptionId),
        // Engagement Templates
        ...this.getEngagementTemplates(subscriptionId),
        // Payment Templates
        ...this.getPaymentTemplates(subscriptionId)
      ];

      const results = await Promise.allSettled(
        templates.map(template => this.createTemplate(template))
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`Created ${successCount}/${templates.length} SaaS communication templates`);
      
      return successCount > 0;
    } catch (error) {
      console.error('Error initializing SaaS templates:', error);
      return false;
    }
  }

  /**
   * Onboarding Templates
   */
  private static getOnboardingTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Welcome Email - English',
        description: 'Welcome email for new customers',
        subscription_id: subscriptionId,
        category: 'onboarding',
        type: 'welcome',
        channel: 'email',
        language: 'en',
        subject: 'Welcome to Caribe Mail Connect! 🎉',
        content: `
Hi {{customer_name}},

Welcome to Caribe Mail Connect! We're thrilled to have you join our community of satisfied customers.

Your account is now active and ready to use. Here's what you can do next:

✅ Set up your virtual mailbox
✅ Configure your mail forwarding preferences  
✅ Download our mobile app for easy access
✅ Explore our premium features

Need help getting started? Our support team is here to assist you 24/7.

Best regards,
The Caribe Mail Connect Team

P.S. Don't forget to complete your profile to unlock all features!
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'account_url', description: 'Link to customer account', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      },
      {
        name: 'Welcome Email - Spanish',
        description: 'Welcome email for new customers (Spanish)',
        subscription_id: subscriptionId,
        category: 'onboarding',
        type: 'welcome',
        channel: 'email',
        language: 'es',
        subject: '¡Bienvenido a Caribe Mail Connect! 🎉',
        content: `
Hola {{customer_name}},

¡Bienvenido a Caribe Mail Connect! Estamos emocionados de tenerte en nuestra comunidad de clientes satisfechos.

Tu cuenta ya está activa y lista para usar. Esto es lo que puedes hacer a continuación:

✅ Configurar tu buzón virtual
✅ Configurar tus preferencias de reenvío de correo
✅ Descargar nuestra aplicación móvil para fácil acceso
✅ Explorar nuestras funciones premium

¿Necesitas ayuda para comenzar? Nuestro equipo de soporte está aquí para asistirte 24/7.

Saludos cordiales,
El Equipo de Caribe Mail Connect

P.D. ¡No olvides completar tu perfil para desbloquear todas las funciones!
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'account_url', description: 'Link to customer account', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      },
      {
        name: 'Setup Guide Email',
        description: 'Step-by-step setup guide',
        subscription_id: subscriptionId,
        category: 'onboarding',
        type: 'onboarding',
        channel: 'email',
        language: 'en',
        subject: 'Your Quick Setup Guide - Get Started in 5 Minutes',
        content: `
Hi {{customer_name}},

Ready to get the most out of Caribe Mail Connect? Here's your quick 5-minute setup guide:

🔧 **Step 1: Complete Your Profile**
Add your shipping addresses and contact preferences.

📮 **Step 2: Set Up Mail Forwarding**
Choose how often you want your mail forwarded and to which address.

📱 **Step 3: Download Our App**
Get instant notifications and manage your mail on the go.

🔔 **Step 4: Configure Notifications**
Choose how you want to be notified about new mail and packages.

⭐ **Step 5: Explore Premium Features**
Discover package consolidation, storage options, and more.

[Complete Setup Now]({{setup_url}})

Questions? Reply to this email or chat with us in the app.

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'setup_url', description: 'Link to setup wizard', required: true }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Trial Management Templates
   */
  private static getTrialTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Trial Reminder - 7 Days',
        description: 'Trial expiration reminder - 7 days left',
        subscription_id: subscriptionId,
        category: 'billing',
        type: 'trial_reminder',
        channel: 'email',
        language: 'en',
        subject: 'Your trial expires in 7 days - Don\'t lose access!',
        content: `
Hi {{customer_name}},

Your Caribe Mail Connect trial expires in just 7 days ({{trial_end_date}}).

Don't lose access to your virtual mailbox and all your mail! 

**What you'll miss without upgrading:**
• Access to your virtual mailbox
• Mail forwarding services  
• Package consolidation
• 24/7 customer support

**Upgrade now and save 20%** with code TRIAL20

[Upgrade My Account]({{upgrade_url}})

Questions about our plans? We're here to help!

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'trial_end_date', description: 'Trial expiration date', required: true },
          { name: 'upgrade_url', description: 'Link to upgrade page', required: true }
        ],
        is_active: true,
        is_default: true,
        version: 1
      },
      {
        name: 'Trial Reminder - 1 Day',
        description: 'Trial expiration reminder - 1 day left',
        subscription_id: subscriptionId,
        category: 'billing',
        type: 'trial_urgent',
        channel: 'email',
        language: 'en',
        subject: '⚠️ Your trial expires TOMORROW - Act now!',
        content: `
Hi {{customer_name}},

**URGENT:** Your Caribe Mail Connect trial expires TOMORROW!

Your mail forwarding service will be suspended unless you upgrade today.

**Last chance to save 20%** with code TRIAL20

[Upgrade Now - Don't Lose Access]({{upgrade_url}})

Need help choosing a plan? Our team is standing by to assist you.

📞 Call us: {{support_phone}}
💬 Chat: {{support_chat_url}}

Don't let your mail pile up - upgrade today!

The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'upgrade_url', description: 'Link to upgrade page', required: true },
          { name: 'support_phone', description: 'Support phone number', required: false },
          { name: 'support_chat_url', description: 'Support chat URL', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Renewal Templates
   */
  private static getRenewalTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Renewal Reminder - 30 Days',
        description: 'Subscription renewal reminder - 30 days',
        subscription_id: subscriptionId,
        category: 'billing',
        type: 'renewal_reminder',
        channel: 'email',
        language: 'en',
        subject: 'Your subscription renews in 30 days',
        content: `
Hi {{customer_name}},

Just a friendly reminder that your Caribe Mail Connect subscription will automatically renew on {{renewal_date}}.

**Your Current Plan:** {{plan_name}} - ${{plan_price}}/month

**What's included:**
{{plan_features}}

Want to upgrade or make changes? You can update your plan anytime in your account settings.

[Manage My Subscription]({{account_url}})

Thank you for being a valued customer!

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'renewal_date', description: 'Subscription renewal date', required: true },
          { name: 'plan_name', description: 'Current plan name', required: true },
          { name: 'plan_price', description: 'Plan price', required: true },
          { name: 'plan_features', description: 'Plan features list', required: true },
          { name: 'account_url', description: 'Link to account page', required: true }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Churn Prevention Templates
   */
  private static getChurnPreventionTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Check-in Email',
        description: 'Proactive check-in for inactive customers',
        subscription_id: subscriptionId,
        category: 'retention',
        type: 'check_in',
        channel: 'email',
        language: 'en',
        subject: 'We miss you! How can we help?',
        content: `
Hi {{customer_name}},

We noticed you haven't logged into your Caribe Mail Connect account recently, and we wanted to check in.

**Is everything okay?** We're here to help if you're experiencing any issues or have questions about your service.

**Common questions we can help with:**
• How to set up mail forwarding
• Understanding your billing
• Accessing your virtual mailbox
• Using our mobile app

**Need assistance?** Just reply to this email or:
📞 Call us: {{support_phone}}
💬 Live chat: {{support_chat_url}}

We value your business and want to ensure you're getting the most out of your service.

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'support_phone', description: 'Support phone number', required: false },
          { name: 'support_chat_url', description: 'Support chat URL', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      },
      {
        name: 'Retention Offer',
        description: 'Special offer for at-risk customers',
        subscription_id: subscriptionId,
        category: 'retention',
        type: 'retention_offer',
        channel: 'email',
        language: 'en',
        subject: 'Special offer just for you - 50% off next month!',
        content: `
Hi {{customer_name}},

We really value you as a customer and don't want to see you go!

**Exclusive offer just for you:**
🎉 **50% OFF your next month** - Use code STAY50

This offer is valid for the next 7 days and can be applied to any plan.

**Why customers love Caribe Mail Connect:**
• Reliable mail forwarding
• Secure package handling
• 24/7 customer support
• Easy-to-use mobile app

**Questions or concerns?** Let's talk! Our customer success team is ready to help make your experience better.

[Apply Discount Now]({{discount_url}})

We hope to continue serving you!

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'discount_url', description: 'Link to apply discount', required: true }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Engagement Templates
   */
  private static getEngagementTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Monthly Newsletter',
        description: 'Monthly customer newsletter',
        subscription_id: subscriptionId,
        category: 'engagement',
        type: 'newsletter',
        channel: 'email',
        language: 'en',
        subject: 'Your Monthly Update from Caribe Mail Connect',
        content: `
Hi {{customer_name}},

Here's what's new at Caribe Mail Connect this month:

**🆕 New Features**
{{new_features}}

**📊 Your Account Summary**
• Packages processed: {{packages_count}}
• Mail items forwarded: {{mail_count}}
• Money saved: ${{savings_amount}}

**💡 Pro Tips**
{{pro_tips}}

**📱 Did You Know?**
You can track all your packages in real-time using our mobile app!

[Download the App]({{app_download_url}})

Thank you for being a valued customer!

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'new_features', description: 'New features list', required: false },
          { name: 'packages_count', description: 'Number of packages processed', required: false },
          { name: 'mail_count', description: 'Number of mail items', required: false },
          { name: 'savings_amount', description: 'Amount saved', required: false },
          { name: 'pro_tips', description: 'Pro tips content', required: false },
          { name: 'app_download_url', description: 'App download link', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Payment Templates
   */
  private static getPaymentTemplates(subscriptionId: string): Partial<CommunicationTemplate>[] {
    return [
      {
        name: 'Payment Failed',
        description: 'Payment failure notification',
        subscription_id: subscriptionId,
        category: 'billing',
        type: 'payment_failed',
        channel: 'email',
        language: 'en',
        subject: 'Payment failed - Update your payment method',
        content: `
Hi {{customer_name}},

We were unable to process your payment for your Caribe Mail Connect subscription.

**Payment Details:**
• Amount: ${{payment_amount}}
• Date: {{payment_date}}
• Payment method: {{payment_method}}

**To avoid service interruption:**
1. Update your payment method
2. Or contact your bank to authorize the payment

[Update Payment Method]({{payment_update_url}})

Your service will continue for the next 7 days while we attempt to process payment.

Questions? Contact our billing team at {{billing_email}}

Best regards,
The Caribe Mail Connect Team
        `,
        variables: [
          { name: 'customer_name', description: 'Customer first name', required: true },
          { name: 'payment_amount', description: 'Payment amount', required: true },
          { name: 'payment_date', description: 'Payment date', required: true },
          { name: 'payment_method', description: 'Payment method', required: true },
          { name: 'payment_update_url', description: 'Payment update URL', required: true },
          { name: 'billing_email', description: 'Billing support email', required: false }
        ],
        is_active: true,
        is_default: true,
        version: 1
      }
    ];
  }

  /**
   * Create template in database
   */
  private static async createTemplate(templateData: Partial<CommunicationTemplate>): Promise<CommunicationTemplate> {
    const { data, error } = await supabase
      .from('communication_templates')
      .insert({
        ...templateData,
        usage_count: 0,
        created_at: new Date().toISOString(),
        created_by: 'system',
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as CommunicationTemplate;
  }

  /**
   * Get template by type and language
   */
  static async getTemplate(
    subscriptionId: string,
    type: string,
    channel: string,
    language: 'en' | 'es' = 'en'
  ): Promise<CommunicationTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('subscription_id', subscriptionId)
        .eq('type', type)
        .eq('channel', channel)
        .eq('language', language)
        .eq('is_active', true)
        .eq('is_default', true)
        .single();

      if (error) {
        // Fallback to English if Spanish not found
        if (language === 'es') {
          return this.getTemplate(subscriptionId, type, channel, 'en');
        }
        return null;
      }

      return data as CommunicationTemplate;
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }

  /**
   * Render template with variables
   */
  static renderTemplate(template: CommunicationTemplate, variables: Record<string, any>): string {
    let content = template.content;
    
    // Replace variables in content
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, String(value || ''));
    });

    // Remove any unreplaced variables
    content = content.replace(/{{[^}]+}}/g, '');

    return content;
  }
}
