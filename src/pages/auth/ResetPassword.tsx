import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageToggle } from '@/components/LanguageToggle';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Package, ArrowLeft } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}#/auth/update-password`,
      });

      if (error) {
        toast({
          title: t('common.error'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        setEmailSent(true);
        toast({
          title: t('common.success'),
          description: 'Password reset email sent! Check your inbox.',
        });
      }
    } catch (err) {
      toast({
        title: t('common.error'),
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-tropical flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageToggle />
        </div>

        <div className="w-full max-w-md space-y-6 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-ocean rounded-2xl flex items-center justify-center shadow-ocean">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">Email Sent!</h1>
              <p className="text-muted-foreground">Check your inbox for reset instructions</p>
            </div>
          </div>

          <Card className="shadow-elegant border-2 border-primary/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground">
                  Don't see the email? Check your spam folder or try again.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEmailSent(false)}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="mobile"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.location.hash = '#/auth'}
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-tropical flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-ocean rounded-2xl flex items-center justify-center shadow-ocean">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-primary">Reset Password</h1>
            <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
          </div>
        </div>

        <Card className="shadow-elegant border-2 border-primary/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-center">
              No worries! Enter your email and we'll send you reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <Button
                type="submit"
                variant="mobile"
                size="mobile"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Sending..." />
                ) : (
                  'Send Reset Email'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => window.location.hash = '#/auth'}
                className="inline-flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}