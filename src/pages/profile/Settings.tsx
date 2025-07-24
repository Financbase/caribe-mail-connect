import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MobileHeader } from '@/components/MobileHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Phone, Globe, Camera } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  preferred_language: string;
  phone: string;
  avatar_url: string;
  email: string;
}

interface ProfileSettingsProps {
  onNavigate: (page: string) => void;
}

export default function ProfileSettings({ onNavigate }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    preferred_language: 'en'
  });

  const { user } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_profile', { _user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        const profileData = data[0];
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          phone: profileData.phone || '',
          preferred_language: profileData.preferred_language || 'en'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setIsSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          full_name: `${formData.first_name} ${formData.last_name}`,
          phone: formData.phone,
          preferred_language: formData.preferred_language
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update language context if changed
      if (formData.preferred_language !== language) {
        setLanguage(formData.preferred_language as 'en' | 'es');
      }

      toast({
        title: t('common.success'),
        description: 'Profile updated successfully',
      });

      // Refresh profile
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}#/auth/update-password`,
      });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: 'Password reset email sent to your inbox',
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to send password reset email',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <MobileHeader title="Profile Settings" showLogout />
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading profile..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <MobileHeader title="Profile Settings" showLogout />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-elegant">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-ocean text-white text-lg">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{profile?.full_name}</h2>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {profile?.role}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(787) 555-0123"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Preferred Language
              </Label>
              <Select
                value={formData.preferred_language}
                onValueChange={(value) => setFormData(prev => ({ ...prev, preferred_language: value }))}
              >
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              variant="mobile"
              size="mobile"
              className="w-full"
              disabled={isSaving}
            >
              {isSaving ? (
                <LoadingSpinner size="sm" text="Saving..." />
              ) : (
                'Save Changes'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">Last updated recently</p>
              </div>
              <Button variant="outline" onClick={handlePasswordReset}>
                Reset Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => onNavigate('dashboard')}
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}