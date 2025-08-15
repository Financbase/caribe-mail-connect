import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Mail, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Building2,
  Phone
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortalLoginProps {
  onNavigate: (page: string) => void;
}

export default function PortalLogin({ onNavigate }: PortalLoginProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signUpForm, setSignUpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    mailboxNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'Email o contraseña incorrectos.'
          : error.message);
        return;
      }

      toast({
        title: 'Acceso exitoso',
        description: 'Bienvenido a su portal de cliente',
      });
    } catch (error: unknown) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (signUpForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/portal`;
      
      const { error } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: signUpForm.firstName,
            last_name: signUpForm.lastName,
            phone: signUpForm.phone,
            mailbox_number: signUpForm.mailboxNumber,
            user_type: 'customer'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('Este email ya está registrado. Use la opción de iniciar sesión.');
        } else {
          setError(error.message);
        }
        return;
      }

      toast({
        title: 'Registro exitoso',
        description: 'Revise su email para confirmar su cuenta',
      });

      setIsSignUp(false);
      setSignUpForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        mailboxNumber: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: unknown) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('auth-selection')}
            className="mb-4 text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">PRMCMS</h1>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <Package className="h-5 w-5 text-accent" />
              <span className="text-xl font-semibold text-foreground">Portal de Cliente</span>
            </div>
            <p className="text-muted-foreground">
              Acceda a su información de paquetes y buzón
            </p>
          </div>
        </div>

        {/* Auth Form */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader className="text-center pb-4">
            <CardTitle>{isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}</CardTitle>
            <CardDescription>
              {isSignUp 
                ? 'Regístrese para acceder a su portal'
                : 'Ingrese a su portal de cliente'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isSignUp ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="su-email@ejemplo.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      placeholder="Juan"
                      value={signUpForm.firstName}
                      onChange={(e) => setSignUpForm({...signUpForm, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      placeholder="Pérez"
                      value={signUpForm.lastName}
                      onChange={(e) => setSignUpForm({...signUpForm, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signUpEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signUpEmail"
                      type="email"
                      placeholder="su-email@ejemplo.com"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      placeholder="(787) 555-0123"
                      value={signUpForm.phone}
                      onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="mailboxNumber">Número de Buzón (opcional)</Label>
                  <Input
                    id="mailboxNumber"
                    placeholder="MB-001"
                    value={signUpForm.mailboxNumber}
                    onChange={(e) => setSignUpForm({...signUpForm, mailboxNumber: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="signUpPassword">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="signUpPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme su contraseña"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({...signUpForm, confirmPassword: e.target.value})}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary"
              >
                {isSignUp 
                  ? '¿Ya tiene cuenta? Iniciar Sesión'
                  : '¿No tiene cuenta? Registrarse'
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="border-primary/10">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold mb-2">¿Necesita ayuda?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Contacte a su centro de correo para asistencia con su cuenta
            </p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>📧 info@prmcms.com</p>
              <p>📞 (787) 555-0123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}