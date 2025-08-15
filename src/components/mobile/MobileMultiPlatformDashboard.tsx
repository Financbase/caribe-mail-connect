/**
 * Mobile & Multi-Platform Dashboard
 * Story 2.5: Mobile & Multi-Platform Experience
 * 
 * Progressive Web App, mobile optimization, offline capabilities,
 * push notifications, and cross-platform synchronization
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Bell,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Battery,
  Signal,
  Globe,
  Cloud,
  CloudOff,
  Sync,
  SyncOff,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Vibrate,
  Camera,
  Mic,
  MapPin,
  Fingerprint,
  Shield,
  Zap,
  Activity,
  BarChart3,
  Clock,
  Users,
  Package,
  MessageSquare,
  Star,
  TrendingUp,
  Database,
  HardDrive,
  Cpu,
  MemoryStick
} from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useMobileMultiPlatform } from '@/hooks/useMobileMultiPlatform';
import { useMobile } from '@/hooks/useMobile';
import type { 
  PWAMetrics,
  OfflineCapabilities,
  PushNotificationConfig,
  CrossPlatformSync,
  MobileOptimization
} from '@/types/mobile';

// =====================================================
// MAIN COMPONENT
// =====================================================

export function MobileMultiPlatformDashboard() {
  const { subscription } = useSubscription();
  const {
    pwaMetrics,
    offlineCapabilities,
    pushNotificationConfig,
    crossPlatformSync,
    mobileOptimization,
    isLoading,
    error,
    refreshMobileData,
    installPWA,
    enableOfflineMode,
    configurePushNotifications,
    syncAcrossPlatforms,
    optimizeForMobile
  } = useMobileMultiPlatform();

  const {
    deviceInfo,
    networkInfo,
    isOnline,
    isMobile,
    isTouchDevice,
    isSmallScreen,
    hapticFeedback
  } = useMobile();

  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    if (subscription) {
      refreshMobileData();
    }
  }, [subscription]);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!subscription) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No active subscription found. Please contact support or set up a subscription.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        hapticFeedback?.();
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mobile & Multi-Platform Experience</h1>
          <p className="text-muted-foreground">
            Progressive Web App, mobile optimization, offline capabilities, and cross-platform sync
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Story 2.5: Mobile & Multi-Platform Experience
          </Badge>
          <Button variant="outline" onClick={refreshMobileData}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {installPrompt && (
            <Button onClick={handleInstallPWA}>
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Device & Network Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Device Type</p>
                <p className="text-lg font-bold">
                  {isMobile ? 'Mobile' : isSmallScreen ? 'Tablet' : 'Desktop'}
                </p>
                <p className="text-xs text-blue-600">{deviceInfo?.platform}</p>
              </div>
              {isMobile ? <Smartphone className="h-8 w-8 text-blue-500" /> :
               isSmallScreen ? <Tablet className="h-8 w-8 text-green-500" /> :
               <Monitor className="h-8 w-8 text-purple-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-lg font-bold">{isOnline ? 'Online' : 'Offline'}</p>
                <p className="text-xs text-green-600">{networkInfo.connectionType}</p>
              </div>
              {isOnline ? <Wifi className="h-8 w-8 text-green-500" /> : <WifiOff className="h-8 w-8 text-red-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PWA Status</p>
                <p className="text-lg font-bold">{pwaMetrics?.installed ? 'Installed' : 'Web'}</p>
                <p className="text-xs text-purple-600">
                  {pwaMetrics?.cache_size || 0}MB cached
                </p>
              </div>
              <Globe className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Offline Mode</p>
                <p className="text-lg font-bold">
                  {offlineCapabilities?.enabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-orange-600">
                  {offlineCapabilities?.cached_data || 0} items
                </p>
              </div>
              {offlineCapabilities?.enabled ? 
                <Cloud className="h-8 w-8 text-orange-500" /> : 
                <CloudOff className="h-8 w-8 text-gray-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Push Notifications</p>
                <p className="text-lg font-bold">
                  {pushNotificationConfig?.enabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-xs text-red-600">
                  {pushNotificationConfig?.delivered_today || 0} today
                </p>
              </div>
              <Bell className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sync Status</p>
                <p className="text-lg font-bold">
                  {crossPlatformSync?.status === 'synced' ? 'Synced' : 'Pending'}
                </p>
                <p className="text-xs text-indigo-600">
                  {crossPlatformSync?.last_sync ? 'Just now' : 'Never'}
                </p>
              </div>
              {crossPlatformSync?.status === 'synced' ? 
                <Sync className="h-8 w-8 text-indigo-500" /> : 
                <SyncOff className="h-8 w-8 text-gray-500" />}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pwa" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pwa">Progressive Web App</TabsTrigger>
          <TabsTrigger value="offline">Offline Capabilities</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
          <TabsTrigger value="sync">Cross-Platform Sync</TabsTrigger>
          <TabsTrigger value="optimization">Mobile Optimization</TabsTrigger>
          <TabsTrigger value="analytics">Mobile Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pwa" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PWA Installation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  PWA Installation
                </CardTitle>
                <CardDescription>
                  Progressive Web App installation and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Installation Status</span>
                    <Badge variant={pwaMetrics?.installed ? 'default' : 'secondary'}>
                      {pwaMetrics?.installed ? 'Installed' : 'Not Installed'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cache Size</span>
                    <span>{pwaMetrics?.cache_size || 0} MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Offline Ready</span>
                    <Badge variant={pwaMetrics?.offline_ready ? 'default' : 'secondary'}>
                      {pwaMetrics?.offline_ready ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Update Available</span>
                    <Badge variant={pwaMetrics?.update_available ? 'destructive' : 'default'}>
                      {pwaMetrics?.update_available ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  {installPrompt && (
                    <Button onClick={handleInstallPWA} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Install Progressive Web App
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* PWA Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  PWA Features
                </CardTitle>
                <CardDescription>
                  Available Progressive Web App capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Offline Support', enabled: true, icon: <CloudOff className="h-4 w-4" /> },
                    { name: 'Push Notifications', enabled: true, icon: <Bell className="h-4 w-4" /> },
                    { name: 'Background Sync', enabled: true, icon: <Sync className="h-4 w-4" /> },
                    { name: 'Camera Access', enabled: true, icon: <Camera className="h-4 w-4" /> },
                    { name: 'Geolocation', enabled: true, icon: <MapPin className="h-4 w-4" /> },
                    { name: 'Biometric Auth', enabled: false, icon: <Fingerprint className="h-4 w-4" /> }
                  ].map((feature) => (
                    <div key={feature.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {feature.icon}
                        <span className="text-sm">{feature.name}</span>
                      </div>
                      <Badge variant={feature.enabled ? 'default' : 'secondary'}>
                        {feature.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CloudOff className="h-5 w-5" />
                  Offline Capabilities
                </span>
                <Button onClick={enableOfflineMode}>
                  <Zap className="h-4 w-4 mr-2" />
                  Enable Offline Mode
                </Button>
              </CardTitle>
              <CardDescription>
                Offline functionality and data synchronization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Cached Pages',
                    value: offlineCapabilities?.cached_pages || 0,
                    icon: <Globe className="h-5 w-5" />,
                    color: 'bg-blue-100 text-blue-700'
                  },
                  {
                    name: 'Offline Data',
                    value: `${offlineCapabilities?.cached_data || 0} items`,
                    icon: <Database className="h-5 w-5" />,
                    color: 'bg-green-100 text-green-700'
                  },
                  {
                    name: 'Pending Sync',
                    value: offlineCapabilities?.pending_sync || 0,
                    icon: <Upload className="h-5 w-5" />,
                    color: 'bg-orange-100 text-orange-700'
                  },
                  {
                    name: 'Storage Used',
                    value: `${offlineCapabilities?.storage_used || 0} MB`,
                    icon: <HardDrive className="h-5 w-5" />,
                    color: 'bg-purple-100 text-purple-700'
                  }
                ].map((metric) => (
                  <div key={metric.name} className={`p-4 rounded-lg ${metric.color}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {metric.icon}
                      <span className="font-medium text-sm">{metric.name}</span>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </span>
                <Button onClick={configurePushNotifications}>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </CardTitle>
              <CardDescription>
                Push notification configuration and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Push Notification System</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time notifications for package updates and system alerts
                </p>
                <Button variant="outline">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sync className="h-5 w-5" />
                  Cross-Platform Synchronization
                </span>
                <Button onClick={syncAcrossPlatforms}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
              </CardTitle>
              <CardDescription>
                Data synchronization across all devices and platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Sync className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Cross-Platform Sync</h3>
                <p className="text-muted-foreground mb-4">
                  Seamless data synchronization across web, mobile, and desktop
                </p>
                <Button variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  View Sync Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Mobile Optimization
                </span>
                <Button onClick={optimizeForMobile}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Optimize
                </Button>
              </CardTitle>
              <CardDescription>
                Performance optimization for mobile devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Mobile Performance</h3>
                <p className="text-muted-foreground mb-4">
                  Optimized for mobile devices with adaptive performance
                </p>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Performance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Mobile Analytics
              </CardTitle>
              <CardDescription>
                Mobile usage analytics and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Mobile Analytics</h3>
                <p className="text-muted-foreground mb-4">
                  Comprehensive analytics for mobile and multi-platform usage
                </p>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
