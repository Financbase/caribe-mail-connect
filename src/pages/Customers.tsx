import { useState } from 'react';
import { ArrowLeft, Search, Plus, Phone, Package, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MobileHeader } from '@/components/MobileHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { mockCustomers } from '@/data/mockData';
import { NotificationPreferences } from '@/types/notifications';
import NotificationPreferencesComponent from '@/components/NotificationPreferences';

interface CustomersProps {
  onNavigate: (page: string) => void;
}

export default function Customers({ onNavigate }: CustomersProps) {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mailboxNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleUpdateNotificationPreferences = (customerId: string) => (preferences: NotificationPreferences) => {
    // In a real app, this would update the customer in the database
    toast({
      title: language === 'en' ? 'Preferences updated' : 'Preferencias actualizadas',
      description: language === 'en' 
        ? 'Customer notification preferences have been saved'
        : 'Las preferencias de notificación del cliente han sido guardadas'
    });
    setSelectedCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title={t('customers.title')} showLogout />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('customers.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Add New Customer Button */}
          <Button
            variant="secondary"
            size="mobile"
            className="w-full"
            onClick={() => {
              // In real app, this would open a modal or navigate to add customer page
              alert('Add Customer feature coming soon!');
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('customers.addNew')}
          </Button>

          {/* Customer List */}
          <div className="space-y-3">
            {filteredCustomers.map((customer, index) => (
              <Card
                key={customer.id}
                className={`
                  shadow-elegant hover:shadow-ocean transition-all duration-300 
                  cursor-pointer hover:scale-[1.02] animate-slide-up
                `}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  // In real app, this would show customer details
                  alert(`Customer details for ${customer.name}`);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-ocean rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {customer.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {customer.mailboxNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{customer.phone}</span>
                        </div>
                        
                        {customer.activePackages > 0 && (
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            <span>{customer.activePackages} packages</span>
                          </div>
                        )}
                      </div>
                    </div>

                     {/* Active Packages Badge and Settings */}
                    <div className="flex items-center gap-2">
                      <Badge variant={customer.activePackages > 0 ? 'default' : 'secondary'}>
                        {customer.mailboxNumber}
                      </Badge>
                      <Dialog open={selectedCustomer === customer.id} onOpenChange={(open) => setSelectedCustomer(open ? customer.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>
                              {language === 'en' ? 'Notification Settings' : 'Configuración de Notificaciones'} - {customer.name}
                            </DialogTitle>
                          </DialogHeader>
                          <NotificationPreferencesComponent
                            preferences={customer.notificationPreferences}
                            onSave={handleUpdateNotificationPreferences(customer.id)}
                          />
                        </DialogContent>
                      </Dialog>
                      {customer.activePackages > 0 && (
                        <span className="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-white bg-gradient-sunrise rounded-full">
                          {customer.activePackages}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No customers found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}