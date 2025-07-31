import { LogOut, User, Settings, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LanguageToggle } from './LanguageToggle';
import { LocationSelector } from './LocationSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  full_name: string;
  role: string;
  avatar_url: string;
}

interface MobileHeaderProps {
  title: string;
  showLogout?: boolean;
  onNavigate?: (page: string) => void;
}

export function MobileHeader({ title, showLogout = false, onNavigate }: MobileHeaderProps) {
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .rpc('get_user_profile', { _user_id: user.id });

      if (error) throw error;

      if (data && data.length > 0) {
        setProfile(data[0]);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user && showLogout) {
      fetchUserProfile();
    }
  }, [user, showLogout, fetchUserProfile]);

  const handleLogout = () => {
    logout();
  };

  const handleProfileSettings = () => {
    if (onNavigate) {
      onNavigate('profile-settings');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-primary">{title}</h1>
          {onNavigate && <LocationSelector compact className="hidden sm:flex" />}
        </div>
        
        <div className="flex items-center gap-2">
          {onNavigate && <LocationSelector compact className="sm:hidden" />}
          <LanguageToggle />
          {onNavigate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Building className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onNavigate('location-management')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Manage Locations
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showLogout && profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-gradient-ocean text-white text-xs">
                      {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground">{profile.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileSettings}>
                  <Settings className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('common.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showLogout && !profile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 w-8 p-0"
              aria-label={t('common.logout')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;