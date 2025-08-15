/**
 * Mobile App Dashboard Component
 * Story 7: Mobile App Foundation - Mobile App Management
 * 
 * Dashboard for managing mobile app configuration, push notifications,
 * analytics, and app store deployment
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone,
  Bell,
  Download,
  Settings,
  BarChart3,
  Shield,
  Wifi,
  WifiOff,
  Battery,
  Cpu,
  HardDrive,
  Users,
  Activity,
  Globe,
  PlayCircle,
  Apple,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  QrCode,
  Camera,
  MapPin,
  Fingerprint
} from 'lucide-react';
import { MobileAppService } from '@/services/mobileApp';
import type { MobileAppConfig, DeviceInfo } from '@/services/mobileApp';

// =====================================================
// MOBILE APP DASHBOARD COMPONENT
// =====================================================

export function MobileAppDashboard() {
  const [appConfig, setAppConfig] = useState<MobileAppConfig | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadMobileAppData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const config = MobileAppService.getAppConfig();
      const device = MobileAppService.getDeviceInfo();
      const standalone = MobileAppService.isStandalone();
      const biometric = await MobileAppService.supportsBiometricAuth();

      setAppConfig(config);
      setDeviceInfo(device);
      setIsStandalone(standalone);
      setBiometricSupported(biometric);
      setPushSupported('serviceWorker' in navigator && 'PushManager' in window);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load mobile app data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMobileAppData();
  }, []);

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleInitializeApp = async () => {
    setIsLoading(true);
    try {
      const success = await MobileAppService.initializeMobileApp();
      if (success) {
        await loadMobileAppData();
      } else {
        setError('Failed to initialize mobile app');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initialize mobile app');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPushNotifications = async () => {
    try {
      const token = await MobileAppService.registerForPushNotifications();
      if (token) {
        console.log('Push notifications registered successfully');
      } else {
        setError('Failed to register for push notifications');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to register push notifications');
    }
  };

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const renderFeatureCard = (feature: any) => (
    <Card key={feature.id} className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium">{feature.name}</h4>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
            <div className="flex gap-2 mt-2">
              {feature.platform_specific.ios && <Badge variant="outline">iOS</Badge>}
              {feature.platform_specific.android && <Badge variant="outline">Android</Badge>}
              {feature.platform_specific.web && <Badge variant="outline">Web</Badge>}
            </div>
          </div>
          <Switch checked={feature.enabled} />
        </div>
      </CardContent>
    </Card>
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return <Apple className="h-4 w-4" />;
      case 'android': return <PlayCircle className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading && !appConfig) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile App Management</h1>
          <p className="text-muted-foreground">
            Configure and manage your mobile app experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={loadMobileAppData}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleInitializeApp} disabled={isLoading}>
            <Smartphone className="h-4 w-4 mr-2" />
            Initialize App
          </Button>
        </div>
      </div>

      {/* App Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">App Mode</p>
                <p className="text-2xl font-bold">{isStandalone ? 'PWA' : 'Browser'}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              {isStandalone ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Installed
                </Badge>
              ) : (
                <Badge variant="outline">Web App</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Push Notifications</p>
                <p className="text-2xl font-bold">{pushSupported ? 'Supported' : 'Not Supported'}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2">
              {pushSupported && (
                <Button size="sm" onClick={handleRegisterPushNotifications}>
                  Register
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Offline Mode</p>
                <p className="text-2xl font-bold">{navigator.onLine ? 'Online' : 'Offline'}</p>
              </div>
              {navigator.onLine ? (
                <Wifi className="h-8 w-8 text-green-500" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500" />
              )}
            </div>
            <div className="mt-2">
              <Badge variant={navigator.onLine ? 'default' : 'destructive'}>
                {navigator.onLine ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Biometric Auth</p>
                <p className="text-2xl font-bold">{biometricSupported ? 'Available' : 'Not Available'}</p>
              </div>
              <Fingerprint className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Badge variant={biometricSupported ? 'default' : 'secondary'}>
                {biometricSupported ? 'Supported' : 'Not Supported'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Device Information */}
          {deviceInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Device Information
                </CardTitle>
                <CardDescription>
                  Current device and platform details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Platform</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getPlatformIcon(deviceInfo.platform)}
                        <span className="capitalize">{deviceInfo.platform}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Device Model</label>
                      <p className="text-muted-foreground">{deviceInfo.device_model}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">OS Version</label>
                      <p className="text-muted-foreground">{deviceInfo.os_version}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Screen Resolution</label>
                      <p className="text-muted-foreground">{deviceInfo.screen_resolution}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <p className="text-muted-foreground">{deviceInfo.language}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timezone</label>
                      <p className="text-muted-foreground">{deviceInfo.timezone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* App Configuration */}
          {appConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  App Configuration
                </CardTitle>
                <CardDescription>
                  Current mobile app settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">App Name</label>
                      <p className="text-muted-foreground">{appConfig.app_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Version</label>
                      <p className="text-muted-foreground">{appConfig.app_version}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bundle ID</label>
                      <p className="text-muted-foreground">{appConfig.bundle_id}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Theme</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: appConfig.theme.primary_color }}
                        />
                        <span className="text-muted-foreground">Primary Color</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Dark Mode</label>
                      <p className="text-muted-foreground">
                        {appConfig.theme.dark_mode_enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Icon Style</label>
                      <p className="text-muted-foreground capitalize">{appConfig.theme.icon_style}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Features</CardTitle>
              <CardDescription>
                Configure which features are enabled for the mobile app
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appConfig?.features.map(renderFeatureCard)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Push Notification Settings
              </CardTitle>
              <CardDescription>
                Configure push notification behavior and targeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appConfig?.push_notifications.notification_types.map((type) => (
                <Card key={type.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{type.name}</h4>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                        <Badge variant="outline" className="mt-1">
                          {type.priority} priority
                        </Badge>
                      </div>
                      <Switch checked={type.default_enabled} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Mobile Analytics
              </CardTitle>
              <CardDescription>
                Track mobile app usage and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Active Users</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Sessions</p>
                        <p className="text-2xl font-bold">5,678</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Download className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Installs</p>
                        <p className="text-2xl font-bold">890</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure mobile app security features and policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appConfig && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Biometric Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Enable fingerprint and face recognition
                      </p>
                    </div>
                    <Switch checked={appConfig.security.biometric_auth} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">PIN Lock</h4>
                      <p className="text-sm text-muted-foreground">
                        Require PIN for app access
                      </p>
                    </div>
                    <Switch checked={appConfig.security.pin_lock} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Root Detection</h4>
                      <p className="text-sm text-muted-foreground">
                        Block access on rooted/jailbroken devices
                      </p>
                    </div>
                    <Switch checked={appConfig.security.root_detection} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Screen Recording Protection</h4>
                      <p className="text-sm text-muted-foreground">
                        Prevent screen recording and screenshots
                      </p>
                    </div>
                    <Switch checked={appConfig.security.screen_recording_protection} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
