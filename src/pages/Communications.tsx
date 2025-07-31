import { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Phone, Send, Filter, Search, Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { MobileHeader } from '@/components/MobileHeader';

interface CommunicationsProps {
  onNavigate: (page: string) => void;
}

interface CommunicationItem {
  id: string;
  type: 'sms' | 'email' | 'whatsapp';
  customer: string;
  subject: string;
  preview: string;
  date: Date;
  status: 'sent' | 'pending' | 'failed';
  language: 'en' | 'es';
}

// Mock data for communications
const mockCommunications: CommunicationItem[] = [
  {
    id: '1',
    type: 'email',
    customer: 'Maria Rodriguez',
    subject: 'Package Arrival Notification',
    preview: 'Your package from Amazon has arrived at our facility...',
    date: new Date('2024-01-20T10:30:00'),
    status: 'sent',
    language: 'en'
  },
  {
    id: '2',
    type: 'sms',
    customer: 'Juan Martinez',
    subject: 'Pickup Reminder',
    preview: 'Reminder: You have 3 packages ready for pickup...',
    date: new Date('2024-01-20T09:15:00'),
    status: 'sent',
    language: 'es'
  },
  {
    id: '3',
    type: 'whatsapp',
    customer: 'Ana García',
    subject: 'Welcome Message',
    preview: 'Welcome to Caribbean Mail Connect! Your mailbox is...',
    date: new Date('2024-01-19T14:45:00'),
    status: 'sent',
    language: 'es'
  },
  {
    id: '4',
    type: 'email',
    customer: 'Robert Johnson',
    subject: 'Monthly Statement',
    preview: 'Your monthly statement for December is now available...',
    date: new Date('2024-01-19T11:00:00'),
    status: 'failed',
    language: 'en'
  }
];

export default function Communications({ onNavigate }: CommunicationsProps) {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'sms' | 'email' | 'whatsapp'>('all');
  const [communications] = useState<CommunicationItem[]>(mockCommunications);

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = comm.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comm.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || comm.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleSendCommunication = (type: string) => {
    toast({
      title: t('Communication sent'),
      description: t(`${type} message has been sent successfully`),
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title={t('communications.title')} showLogout />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('communications.backToDashboard')}
          </Button>

          {/* Communication Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-ocean text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{t('communications.totalSent')}</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                  <Send className="h-8 w-8 text-white/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-sunrise text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{t('communications.openRate')}</p>
                    <p className="text-2xl font-bold">78.5%</p>
                  </div>
                  <Mail className="h-8 w-8 text-white/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-tropical">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-dark text-sm">{t('communications.responseRate')}</p>
                    <p className="text-2xl font-bold text-primary-dark">32.4%</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-primary-dark/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('communications.quickActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleSendCommunication('email')}
                >
                  <Mail className="h-6 w-6 text-primary" />
                  <span>{t('communications.sendBulkEmail')}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleSendCommunication('sms')}
                >
                  <Phone className="h-6 w-6 text-secondary" />
                  <span>{t('communications.sendBulkSMS')}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col gap-2"
                  onClick={() => handleSendCommunication('whatsapp')}
                >
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span>{t('communications.broadcastWhatsApp')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <CardTitle>{t('communications.recentCommunications')}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t('communications.filter')}
                  </Button>
                  <Button variant="default" size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    {t('communications.compose')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Type Filter */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('communications.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as any)}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">{t('communications.all')}</TabsTrigger>
                    <TabsTrigger value="email">{t('communications.email')}</TabsTrigger>
                    <TabsTrigger value="sms">{t('communications.sms')}</TabsTrigger>
                    <TabsTrigger value="whatsapp">{t('communications.whatsapp')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Communications List */}
              <div className="space-y-3">
                {filteredCommunications.map((comm, index) => (
                  <div
                    key={comm.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-all duration-300 cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {getTypeIcon(comm.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{comm.customer}</h4>
                            <Badge variant="outline" className="text-xs">
                              <Globe className="h-3 w-3 mr-1" />
                              {comm.language.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{comm.subject}</p>
                          <p className="text-sm text-muted-foreground mt-1">{comm.preview}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {comm.date.toLocaleDateString()} {comm.date.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(comm.status)}>
                        {t(`communications.${comm.status}`)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCommunications.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('communications.noFound')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('communications.adjustSearch')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}