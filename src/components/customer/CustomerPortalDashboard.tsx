/**
 * Customer Portal Dashboard Component
 * Story 3: Customer Portal - Self-Service Customer Portal
 * 
 * Customer-facing dashboard with package tracking, notifications,
 * account management, and self-service capabilities
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  Bell,
  MessageSquare,
  User,
  Search,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Home,
  Phone,
  Mail,
  Settings,
  HelpCircle,
  Download,
  Camera,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { CustomerPortalService } from '@/services/customerPortal';
import type { 
  CustomerProfile, 
  PackageTrackingInfo, 
  CustomerNotification,
  CustomerTicket 
} from '@/services/customerPortal';

// =====================================================
// CUSTOMER PORTAL DASHBOARD COMPONENT
// =====================================================

interface CustomerPortalDashboardProps {
  customerId: string;
}

export function CustomerPortalDashboard({ customerId }: CustomerPortalDashboardProps) {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [packages, setPackages] = useState<PackageTrackingInfo[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [tickets, setTickets] = useState<CustomerTicket[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // DATA LOADING
  // =====================================================

  const loadCustomerData = async () => {
    if (!customerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [profileData, packagesData, notificationsData, ticketsData, dashboard] = await Promise.all([
        CustomerPortalService.getCustomerProfile(customerId),
        CustomerPortalService.getCustomerPackages(customerId),
        CustomerPortalService.getCustomerNotifications(customerId, true),
        CustomerPortalService.getCustomerTickets(customerId),
        CustomerPortalService.getCustomerDashboard(customerId)
      ]);

      setProfile(profileData);
      setPackages(packagesData);
      setNotifications(notificationsData);
      setTickets(ticketsData);
      setDashboardData(dashboard);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load customer data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [customerId]);

  // =====================================================
  // RENDER HELPERS
  // =====================================================

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'arrived': return 'bg-blue-100 text-blue-800';
      case 'in_transit': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'returned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'arrived': return <Home className="h-4 w-4" />;
      case 'in_transit': return <Truck className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'returned': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const renderPackageCard = (pkg: PackageTrackingInfo) => (
    <Card key={pkg.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{pkg.description}</CardTitle>
            <CardDescription>Tracking: {pkg.tracking_number}</CardDescription>
          </div>
          <Badge className={getStatusColor(pkg.status)}>
            {getStatusIcon(pkg.status)}
            <span className="ml-1 capitalize">{pkg.status.replace('_', ' ')}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Weight:</span>
              <p className="font-medium">{pkg.weight} lbs</p>
            </div>
            <div>
              <span className="text-muted-foreground">Value:</span>
              <p className="font-medium">${pkg.value.toFixed(2)}</p>
            </div>
          </div>

          <div className="text-sm">
            <span className="text-muted-foreground">From:</span>
            <p className="font-medium">{pkg.sender_name}</p>
            <p className="text-muted-foreground">{pkg.sender_address}</p>
          </div>

          {pkg.estimated_delivery && pkg.status !== 'delivered' && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Estimated delivery: {new Date(pkg.estimated_delivery).toLocaleDateString()}</span>
            </div>
          )}

          {pkg.delivery_photos && pkg.delivery_photos.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Camera className="h-4 w-4 text-green-500" />
              <span>{pkg.delivery_photos.length} delivery photo(s) available</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Track Package
            </Button>
            {pkg.delivery_photos && pkg.delivery_photos.length > 0 && (
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                View Photos
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationCard = (notification: CustomerNotification) => (
    <Card key={notification.id} className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium">{notification.title}</h4>
              {notification.priority === 'high' || notification.priority === 'urgent' && (
                <Badge variant="destructive" className="text-xs">
                  {notification.priority}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(notification.created_at).toLocaleString()}
            </p>
          </div>
          {notification.action_required && (
            <Button size="sm" variant="outline">
              Action Required
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // =====================================================
  // MAIN RENDER
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground">
            Manage your packages, track deliveries, and update your preferences
          </p>
        </div>

        {/* Quick Stats */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Packages</p>
                    <p className="text-2xl font-bold">{dashboardData.package_stats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Arrived</p>
                    <p className="text-2xl font-bold">{dashboardData.package_stats.arrived}</p>
                  </div>
                  <Home className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                    <p className="text-2xl font-bold">{dashboardData.unread_notifications}</p>
                  </div>
                  <Bell className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                    <p className="text-2xl font-bold">{dashboardData.open_tickets}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Package Tracking */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Package Tracking
            </CardTitle>
            <CardDescription>
              Enter a tracking number to get instant updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter tracking number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="packages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="packages">My Packages</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Packages Tab */}
          <TabsContent value="packages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">My Packages</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export History
              </Button>
            </div>

            {packages.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {packages.map(renderPackageCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No packages found</h3>
                  <p className="text-muted-foreground">
                    You don't have any packages yet. When you receive packages, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notifications</h2>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </div>

            {notifications.length > 0 ? (
              <div>
                {notifications.map(renderNotificationCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No new notifications</h3>
                  <p className="text-muted-foreground">
                    You're all caught up! New notifications will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Support</h2>
              <Button>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                  <CardDescription>Common questions and solutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    How to track my package?
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Update delivery address
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Package delivery issues
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Account settings help
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@prmcms.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <Button>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-muted-foreground">{profile.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-muted-foreground">{profile.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Address</label>
                      <p className="text-muted-foreground">{profile.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">City, State ZIP</label>
                      <p className="text-muted-foreground">
                        {profile.city}, {profile.state} {profile.zip_code}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
