import { Notification, NotificationTemplate, NotificationBatch } from '@/types/notifications';

export const notificationTemplates: NotificationTemplate[] = [
  // Package Arrival Templates
  {
    id: 'arrival_en',
    type: 'arrival',
    language: 'en',
    subject: 'Package Arrived - {{trackingNumber}}',
    smsTemplate: 'Hi {{customerName}}! Your package {{trackingNumber}} has arrived at our facility. You can pick it up during business hours.',
    emailTemplate: `Dear {{customerName}},

Your package with tracking number {{trackingNumber}} has arrived at our mail center and is ready for processing.

Package Details:
- Tracking Number: {{trackingNumber}}
- Carrier: {{carrier}}
- Received: {{receivedDate}}

You will receive another notification when your package is ready for pickup.

Best regards,
PRMCMS Team`,
    whatsappTemplate: '📦 Hi {{customerName}}! Your package {{trackingNumber}} has arrived. We\'ll let you know when it\'s ready for pickup!'
  },
  {
    id: 'arrival_es',
    type: 'arrival',
    language: 'es',
    subject: 'Paquete Recibido - {{trackingNumber}}',
    smsTemplate: '¡Hola {{customerName}}! Tu paquete {{trackingNumber}} ha llegado a nuestras instalaciones. Puedes recogerlo en horario de oficina.',
    emailTemplate: `Estimado/a {{customerName}},

Su paquete con número de seguimiento {{trackingNumber}} ha llegado a nuestro centro de correspondencia y está siendo procesado.

Detalles del Paquete:
- Número de Seguimiento: {{trackingNumber}}
- Transportista: {{carrier}}
- Recibido: {{receivedDate}}

Recibirá otra notificación cuando su paquete esté listo para recoger.

Saludos cordiales,
Equipo PRMCMS`,
    whatsappTemplate: '📦 ¡Hola {{customerName}}! Tu paquete {{trackingNumber}} ha llegado. ¡Te avisaremos cuando esté listo para recoger!'
  },
  // Package Ready Templates
  {
    id: 'ready_en',
    type: 'ready',
    language: 'en',
    subject: 'Package Ready for Pickup - {{trackingNumber}}',
    smsTemplate: 'Hi {{customerName}}! Your package {{trackingNumber}} is ready for pickup. Visit us during business hours with a valid ID.',
    emailTemplate: `Dear {{customerName}},

Great news! Your package with tracking number {{trackingNumber}} is now ready for pickup.

Pickup Information:
- Location: {{location}}
- Hours: Monday-Friday 9AM-6PM, Saturday 9AM-2PM
- Required: Valid government-issued ID
- Mailbox: {{mailboxNumber}}

Please bring a valid ID for package collection.

Best regards,
PRMCMS Team`,
    whatsappTemplate: '✅ {{customerName}}, your package {{trackingNumber}} is ready! Come pick it up with your ID during business hours. 🕘'
  },
  {
    id: 'ready_es',
    type: 'ready',
    language: 'es',
    subject: 'Paquete Listo para Recoger - {{trackingNumber}}',
    smsTemplate: '¡Hola {{customerName}}! Tu paquete {{trackingNumber}} está listo para recoger. Visítanos en horario de oficina con una identificación válida.',
    emailTemplate: `Estimado/a {{customerName}},

¡Excelentes noticias! Su paquete con número de seguimiento {{trackingNumber}} está listo para recoger.

Información de Recogida:
- Ubicación: {{location}}
- Horario: Lunes-Viernes 9AM-6PM, Sábados 9AM-2PM
- Requerido: Identificación válida emitida por el gobierno
- Casillero: {{mailboxNumber}}

Por favor traiga una identificación válida para recoger el paquete.

Saludos cordiales,
Equipo PRMCMS`,
    whatsappTemplate: '✅ {{customerName}}, ¡tu paquete {{trackingNumber}} está listo! Ven a recogerlo con tu ID en horario de oficina. 🕘'
  },
  // Delivery Confirmation Templates
  {
    id: 'delivery_en',
    type: 'delivery_confirmation',
    language: 'en',
    subject: 'Package Delivered - {{trackingNumber}}',
    smsTemplate: 'Hi {{customerName}}! Your package {{trackingNumber}} has been successfully delivered. Thank you for using our services!',
    emailTemplate: `Dear {{customerName}},

This confirms that your package with tracking number {{trackingNumber}} has been successfully delivered.

Delivery Details:
- Delivered to: {{customerName}}
- Date & Time: {{deliveredDate}}
- Received by: Customer

Thank you for choosing PRMCMS for your mail services. We appreciate your business!

Best regards,
PRMCMS Team`,
    whatsappTemplate: '📬 Hi {{customerName}}! Your package {{trackingNumber}} has been delivered successfully. Thanks for choosing us! 🙏'
  },
  {
    id: 'delivery_es',
    type: 'delivery_confirmation',
    language: 'es',
    subject: 'Paquete Entregado - {{trackingNumber}}',
    smsTemplate: '¡Hola {{customerName}}! Tu paquete {{trackingNumber}} ha sido entregado exitosamente. ¡Gracias por usar nuestros servicios!',
    emailTemplate: `Estimado/a {{customerName}},

Esto confirma que su paquete con número de seguimiento {{trackingNumber}} ha sido entregado exitosamente.

Detalles de Entrega:
- Entregado a: {{customerName}}
- Fecha y Hora: {{deliveredDate}}
- Recibido por: Cliente

Gracias por elegir PRMCMS para sus servicios de correspondencia. ¡Apreciamos su confianza!

Saludos cordiales,
Equipo PRMCMS`,
    whatsappTemplate: '📬 ¡Hola {{customerName}}! Tu paquete {{trackingNumber}} ha sido entregado exitosamente. ¡Gracias por elegirnos! 🙏'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'NOT001',
    customerId: '1',
    customerName: 'María González Rodríguez',
    packageId: 'PKG001',
    trackingNumber: '1Z999AA1234567890',
    type: 'arrival',
    channels: ['sms', 'email'],
    status: 'sent',
    template: 'arrival_es',
    message: '¡Hola María González Rodríguez! Tu paquete 1Z999AA1234567890 ha llegado a nuestras instalaciones.',
    createdAt: '2024-07-24T09:30:00Z',
    sentAt: '2024-07-24T09:31:00Z'
  },
  {
    id: 'NOT002',
    customerId: '1',
    customerName: 'María González Rodríguez',
    packageId: 'PKG002',
    trackingNumber: '7749912345678901',
    type: 'ready',
    channels: ['sms', 'email'],
    status: 'sent',
    template: 'ready_es',
    message: '¡Hola María González Rodríguez! Tu paquete 7749912345678901 está listo para recoger.',
    createdAt: '2024-07-23T16:00:00Z',
    sentAt: '2024-07-23T16:01:00Z'
  },
  {
    id: 'NOT003',
    customerId: '2',
    customerName: 'Carlos Rivera Santos',
    packageId: 'PKG003',
    trackingNumber: '9400111202555555551',
    type: 'delivery_confirmation',
    channels: ['email', 'whatsapp'],
    status: 'sent',
    template: 'delivery_en',
    message: 'Hi Carlos Rivera Santos! Your package 9400111202555555551 has been successfully delivered.',
    createdAt: '2024-07-23T16:30:00Z',
    sentAt: '2024-07-23T16:31:00Z'
  },
  {
    id: 'NOT004',
    customerId: '3',
    customerName: 'Ana Lucia Vega Morales',
    packageId: 'PKG004',
    trackingNumber: '1234567890123456',
    type: 'arrival',
    channels: ['sms', 'whatsapp'],
    status: 'pending',
    template: 'arrival_es',
    message: '¡Hola Ana Lucia Vega Morales! Tu paquete 1234567890123456 ha llegado a nuestras instalaciones.',
    createdAt: '2024-07-24T08:45:00Z'
  },
  {
    id: 'NOT005',
    customerId: '5',
    customerName: 'Carmen Elena Ruiz Ortega',
    packageId: 'PKG005',
    trackingNumber: '1Z999BB7654321098',
    type: 'ready',
    channels: ['email', 'whatsapp'],
    status: 'failed',
    template: 'ready_es',
    message: '¡Hola Carmen Elena Ruiz Ortega! Tu paquete 1Z999BB7654321098 está listo para recoger.',
    createdAt: '2024-07-23T15:20:00Z',
    error: 'WhatsApp service temporarily unavailable'
  }
];

export const mockNotificationBatches: NotificationBatch[] = [
  {
    id: 'BATCH001',
    packageIds: ['PKG001', 'PKG004'],
    notifications: [mockNotifications[0], mockNotifications[3]],
    status: 'completed',
    createdAt: '2024-07-24T09:00:00Z',
    completedAt: '2024-07-24T09:35:00Z'
  },
  {
    id: 'BATCH002',
    packageIds: ['PKG002', 'PKG005'],
    notifications: [mockNotifications[1], mockNotifications[4]],
    status: 'completed',
    createdAt: '2024-07-23T15:00:00Z',
    completedAt: '2024-07-23T16:05:00Z'
  }
];