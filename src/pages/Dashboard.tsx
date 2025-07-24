import { Package, Search, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionCard } from '@/components/ActionCard';
import { MobileHeader } from '@/components/MobileHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTodayStats, mockPackages } from '@/data/mockData';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const stats = getTodayStats();
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };

  const recentActivity = mockPackages
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, 5);

  const actionCards = [
    {
      title: t('actions.receivePackages'),
      icon: Package,
      onClick: () => onNavigate('intake'),
    },
    {
      title: t('actions.search'),
      icon: Search,
      onClick: () => onNavigate('search'),
    },
    {
      title: t('actions.deliver'),
      icon: CheckCircle,
      onClick: () => onNavigate('deliver'),
    },
    {
      title: t('actions.customers'),
      icon: Users,
      onClick: () => onNavigate('customers'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title="PRMCMS" showLogout />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground">
            {user?.location}
          </p>
        </div>

        {/* Today's Stats */}
        <Card className="shadow-elegant animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.todayStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.packagesReceived}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.packagesReceived')}</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{stats.pendingDeliveries}</div>
                <div className="text-sm text-muted-foreground">{t('dashboard.pendingDeliveries')}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          {actionCards.map((card, index) => (
            <ActionCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              onClick={card.onClick}
              className={`animation-delay-${index * 100}`}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="shadow-elegant animate-slide-up">
          <CardHeader>
            <CardTitle className="text-lg">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pkg.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pkg.trackingNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`
                      inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${pkg.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        pkg.status === 'Ready' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'}
                    `}>
                      {pkg.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}