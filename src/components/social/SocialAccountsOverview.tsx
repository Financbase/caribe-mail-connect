// Social Accounts Overview Component
// Displays connected social media accounts with statistics

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Users, 
  TrendingUp,
  Settings,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { SocialAccount } from '@/types/social';

interface SocialAccountsOverviewProps {
  accounts: SocialAccount[];
  onConnectAccount: (platform: string) => void;
  onManageAccount: (accountId: string) => void;
  onDisconnectAccount: (accountId: string) => void;
}

const SocialAccountsOverview: React.FC<SocialAccountsOverviewProps> = ({
  accounts,
  onConnectAccount,
  onManageAccount,
  onDisconnectAccount
}) => {
  const connectedAccounts = accounts.filter(account => account.isConnected);
  const disconnectedAccounts = accounts.filter(account => !account.isConnected);
  const activeAccounts = accounts.filter(account => account.isActive);

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: <Instagram className="h-6 w-6 text-pink-600" />,
      facebook: <Facebook className="h-6 w-6 text-blue-600" />,
      twitter: <Twitter className="h-6 w-6 text-blue-400" />,
      tiktok: <span className="text-2xl">🎵</span>,
      whatsapp: <MessageCircle className="h-6 w-6 text-green-600" />,
      linkedin: <span className="text-2xl">💼</span>,
      youtube: <span className="text-2xl">📺</span>
    };
    return icons[platform] || <span className="text-2xl">📱</span>;
  };

  const getPlatformName = (platform: string) => {
    const names: Record<string, string> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter',
      tiktok: 'TikTok',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      youtube: 'YouTube'
    };
    return names[platform] || platform;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getConnectionStatus = (account: SocialAccount) => {
    if (!account.isConnected) {
      return { status: 'disconnected', label: 'Desconectado', color: 'secondary' as const };
    }
    if (!account.isActive) {
      return { status: 'inactive', label: 'Inactivo', color: 'destructive' as const };
    }
    return { status: 'active', label: 'Activo', color: 'default' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cuentas</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conectadas</p>
                <p className="text-2xl font-bold">{connectedAccounts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Activas</p>
                <p className="text-2xl font-bold">{activeAccounts.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{disconnectedAccounts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cuentas Conectadas</span>
            <Button size="sm" onClick={() => onConnectAccount('new')}>
              <Plus className="h-4 w-4 mr-2" />
              Conectar Nueva
            </Button>
          </CardTitle>
          <CardDescription>
            Gestiona tus cuentas de redes sociales conectadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectedAccounts.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay cuentas conectadas</h3>
              <p className="text-muted-foreground mb-4">
                Conecta tus redes sociales para comenzar a gestionar tu presencia digital
              </p>
              <Button onClick={() => onConnectAccount('new')}>
                <Plus className="h-4 w-4 mr-2" />
                Conectar Primera Cuenta
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedAccounts.map((account) => {
                const status = getConnectionStatus(account);
                return (
                  <Card key={account.id} className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      {getPlatformIcon(account.platform)}
                      <div className="flex-1">
                        <h3 className="font-medium">{getPlatformName(account.platform)}</h3>
                        <p className="text-sm text-muted-foreground">@{account.username}</p>
                      </div>
                      <Badge variant={status.color}>
                        {status.label}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Seguidores:</span>
                        <span className="font-medium">{formatNumber(account.followers)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Seguidos:</span>
                        <span className="font-medium">{formatNumber(account.following)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Publicaciones:</span>
                        <span className="font-medium">{formatNumber(account.posts)}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Engagement Rate:</span>
                          <span className="font-medium">{account.engagementRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={account.engagementRate} className="h-2" />
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onManageAccount(account.id)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Gestionar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDisconnectAccount(account.id)}
                      >
                        Desconectar
                      </Button>
                    </div>

                    {account.lastSync && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Última sincronización: {account.lastSync.toLocaleDateString()}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disconnected Accounts */}
      {disconnectedAccounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cuentas Disponibles</CardTitle>
            <CardDescription>
              Conecta estas plataformas para expandir tu presencia social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disconnectedAccounts.map((account) => (
                <Card key={account.id} className="p-4 border-dashed">
                  <div className="flex items-center space-x-3 mb-4">
                    {getPlatformIcon(account.platform)}
                    <div className="flex-1">
                      <h3 className="font-medium">{getPlatformName(account.platform)}</h3>
                      <p className="text-sm text-muted-foreground">No conectado</p>
                    </div>
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="text-sm text-muted-foreground">
                      Conecta tu cuenta de {getPlatformName(account.platform)} para:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Programar publicaciones</li>
                      <li>• Monitorear menciones</li>
                      <li>• Ver analíticas</li>
                      <li>• Gestionar respuestas</li>
                    </ul>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onConnectAccount(account.platform)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Conectar {getPlatformName(account.platform)}
                  </Button>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Gestiona todas tus cuentas desde un solo lugar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Plus className="h-6 w-6 mb-2" />
              <span>Conectar Nueva Cuenta</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-6 w-6 mb-2" />
              <span>Configuración General</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span>Ver Analíticas</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialAccountsOverview; 