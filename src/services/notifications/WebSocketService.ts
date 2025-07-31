import { Partner } from '../../types/partners';

export interface PartnerNotification {
  id: string;
  type: 'commission_earned' | 'contract_update' | 'performance_alert' | 'system_alert' | 'milestone_reached';
  title: string;
  message: string;
  partnerId: string;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: {
    commission_earned: boolean;
    contract_update: boolean;
    performance_alert: boolean;
    system_alert: boolean;
    milestone_reached: boolean;
  };
}

export class PartnerNotificationService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private notificationCallbacks: ((notification: PartnerNotification) => void)[] = [];
  private connectionCallbacks: ((connected: boolean) => void)[] = [];

  constructor(
    private partnerId: string,
    private token: string,
    private baseUrl: string = 'wss://api.example.com'
  ) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`${this.baseUrl}/partners/${this.partnerId}/notifications?token=${this.token}`);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected for partner notifications');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyConnectionChange(true);
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.stopHeartbeat();
          this.notifyConnectionChange(false);
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.handleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.stopHeartbeat();
  }

  onNotification(callback: (notification: PartnerNotification) => void): void {
    this.notificationCallbacks.push(callback);
  }

  onConnectionChange(callback: (connected: boolean) => void): void {
    this.connectionCallbacks.push(callback);
  }

  removeNotificationCallback(callback: (notification: PartnerNotification) => void): void {
    const index = this.notificationCallbacks.indexOf(callback);
    if (index > -1) {
      this.notificationCallbacks.splice(index, 1);
    }
  }

  removeConnectionCallback(callback: (connected: boolean) => void): void {
    const index = this.connectionCallbacks.indexOf(callback);
    if (index > -1) {
      this.connectionCallbacks.splice(index, 1);
    }
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'notification':
        this.handleNotification(data.notification);
        break;
      case 'heartbeat':
        this.handleHeartbeat();
        break;
      case 'error':
        console.error('WebSocket server error:', data.error);
        break;
      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  private handleNotification(notification: PartnerNotification): void {
    // Notify all registered callbacks
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });

    // Show browser notification if enabled
    this.showBrowserNotification(notification);

    // Store notification in local storage for offline access
    this.storeNotification(notification);
  }

  private handleHeartbeat(): void {
    // Reset heartbeat timer
    if (this.heartbeatInterval) {
      clearTimeout(this.heartbeatInterval);
      this.startHeartbeat();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setTimeout(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearTimeout(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), this.maxReconnectDelay);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  private showBrowserNotification(notification: PartnerNotification): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.priority === 'critical',
      data: notification
    });

    browserNotification.onclick = () => {
      // Focus the window and navigate to the relevant page
      window.focus();
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'commission_earned':
          window.location.href = '/partners/commissions';
          break;
        case 'contract_update':
          window.location.href = '/partners/contracts';
          break;
        case 'performance_alert':
          window.location.href = '/partner-analytics';
          break;
        default:
          window.location.href = '/partners';
      }
      
      browserNotification.close();
    };

    // Auto-close non-critical notifications after 5 seconds
    if (notification.priority !== 'critical') {
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }
  }

  private storeNotification(notification: PartnerNotification): void {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('partnerNotifications') || '[]');
      storedNotifications.unshift(notification);
      
      // Keep only the last 100 notifications
      if (storedNotifications.length > 100) {
        storedNotifications.splice(100);
      }
      
      localStorage.setItem('partnerNotifications', JSON.stringify(storedNotifications));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection callback:', error);
      }
    });
  }

  // Public methods for notification management
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await fetch(`/api/partners/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await fetch('/api/partners/notifications/preferences', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      return response.json();
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      // Return default preferences
      return {
        email: true,
        push: true,
        inApp: true,
        types: {
          commission_earned: true,
          contract_update: true,
          performance_alert: true,
          system_alert: true,
          milestone_reached: true
        }
      };
    }
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      await fetch('/api/partners/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    }
  }

  getStoredNotifications(): PartnerNotification[] {
    try {
      return JSON.parse(localStorage.getItem('partnerNotifications') || '[]');
    } catch (error) {
      console.error('Failed to get stored notifications:', error);
      return [];
    }
  }

  clearStoredNotifications(): void {
    localStorage.removeItem('partnerNotifications');
  }
} 