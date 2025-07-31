import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertTriangle,
  Lock,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

export default function Security() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  
  const { user, updatePassword } = useAuth();
  const { t } = useLanguage();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('security.passwordMismatch'),
        description: t('security.passwordsDoNotMatch'),
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: t('security.passwordTooShort'),
        description: t('security.passwordMinLength'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePassword(newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({
        title: t('security.passwordUpdated'),
        description: t('security.passwordUpdateSuccess'),
      });
    } catch (error) {
      toast({
        title: t('security.passwordUpdateError'),
        description: error instanceof Error ? error.message : t('security.unknownError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    if (!twoFactorEnabled) {
      setShowTwoFactorSetup(true);
    } else {
      // Disable 2FA
      setTwoFactorEnabled(false);
      toast({
        title: t('security.twoFactorDisabled'),
        description: t('security.twoFactorDisableSuccess'),
      });
    }
  };

  const handleTwoFactorSetup = async () => {
    if (!twoFactorCode || twoFactorCode.length !== 6) {
      toast({
        title: t('security.invalidCode'),
        description: t('security.enterValidCode'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setTwoFactorCode('');
      toast({
        title: t('security.twoFactorEnabled'),
        description: t('security.twoFactorSetupSuccess'),
      });
    } catch (error) {
      toast({
        title: t('security.twoFactorSetupError'),
        description: error instanceof Error ? error.message : t('security.unknownError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">{t('security.title')}</h1>
            <p className="text-muted-foreground">{t('security.description')}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>{t('security.changePassword')}</span>
              </CardTitle>
              <CardDescription>
                {t('security.changePasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('security.currentPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('security.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? t('security.updating') : t('security.updatePassword')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>{t('security.twoFactorAuth')}</span>
                <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                  {twoFactorEnabled ? t('security.enabled') : t('security.disabled')}
                </Badge>
              </CardTitle>
              <CardDescription>
                {t('security.twoFactorDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t('security.twoFactorStatus')}</p>
                  <p className="text-sm text-muted-foreground">
                    {twoFactorEnabled 
                      ? t('security.twoFactorActive') 
                      : t('security.twoFactorInactive')
                    }
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                  disabled={isLoading}
                />
              </div>

              {showTwoFactorSetup && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm font-medium">{t('security.setupTwoFactor')}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('security.enterVerificationCode')}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorCode">{t('security.verificationCode')}</Label>
                    <Input
                      id="twoFactorCode"
                      type="text"
                      placeholder="000000"
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleTwoFactorSetup}
                      disabled={isLoading || twoFactorCode.length !== 6}
                      className="flex-1"
                    >
                      {isLoading ? t('security.verifying') : t('security.verify')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowTwoFactorSetup(false);
                        setTwoFactorCode('');
                      }}
                      className="flex-1"
                    >
                      {t('security.cancel')}
                    </Button>
                  </div>
                </div>
              )}

              {twoFactorEnabled && !showTwoFactorSetup && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800">{t('security.twoFactorActive')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>{t('security.securityStatus')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{t('security.accountVerified')}</p>
                    <p className="text-sm text-muted-foreground">{t('security.emailVerified')}</p>
                  </div>
                </div>
                <Badge variant="default">{t('security.verified')}</Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t('security.twoFactorAuth')}</p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled 
                        ? t('security.twoFactorEnabled') 
                        : t('security.twoFactorDisabled')
                      }
                    </p>
                  </div>
                </div>
                <Badge variant={twoFactorEnabled ? 'default' : 'secondary'}>
                  {twoFactorEnabled ? t('security.enabled') : t('security.disabled')}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">{t('security.lastLogin')}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.last_sign_in_at 
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : t('security.never')
                      }
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{t('security.active')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}