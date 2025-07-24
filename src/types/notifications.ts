export interface NotificationPreferences {
  sms: boolean;
  email: boolean;
  whatsapp: boolean;
  language: 'en' | 'es';
}

export interface Notification {
  id: string;
  customerId: string;
  customerName: string;
  packageId: string;
  trackingNumber: string;
  type: 'arrival' | 'ready' | 'delivery_confirmation';
  channels: ('sms' | 'email' | 'whatsapp')[];
  status: 'pending' | 'sent' | 'failed';
  template: string;
  message: string;
  createdAt: string;
  sentAt?: string;
  error?: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'arrival' | 'ready' | 'delivery_confirmation';
  language: 'en' | 'es';
  subject: string;
  smsTemplate: string;
  emailTemplate: string;
  whatsappTemplate: string;
}

export interface NotificationBatch {
  id: string;
  packageIds: string[];
  notifications: Notification[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}