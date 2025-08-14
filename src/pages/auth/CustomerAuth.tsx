import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Mail, 
  Lock, 
  User, 
  Building2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  MapPin,
  Truck
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerAuthProps {
  onNavigate: (page: string) => void;
}

export default function CustomerAuth({ onNavigate }: CustomerAuthProps) {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'customer' | 'driver'>('customer');
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    mailboxNumber: '',
    licenseNumber: ''
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
          ? 'Credenciales inválidas. Verifique su email y contraseña.'
          : error.message);
        return;
      }

      // Check if user has customer/driver role
      const { data: profile } = await supabase.rpc('get_user_profile');
      
      if (!profile || !Array.isArray(profile) || profile.length === 0) {
        await supabase.auth.signOut();
        setError('Este usuario no tiene acceso al portal de clientes.');
        return;
      }

      const userProfile = profile[0];
      if (!['customer', 'driver'].includes(userProfile.role)) {
        await supabase.auth.signOut();
        setError('Este usuario no tiene permisos de cliente. Use el portal de personal.');
        return;
      }

      toast({
        title: 'Acceso exitoso',
        description: `Bienvenido, ${userProfile.first_name}`,
      });

      // Navigate based on user role
      if (userProfile.role === 'driver') {
        onNavigate('driver-route');
      } else {
        onNavigate('dashboard'); // Customer dashboard
      }
    } catch (error: unknown) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: signupForm.firstName,
            last_name: signupForm.lastName,
            phone: signupForm.phone,
            address: signupForm.address,
            mailbox_number: signupForm.mailboxNumber,
            license_number: signupForm.licenseNumber,
            user_type: userType
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

      setActiveTab('login');
      setSignupForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        mailboxNumber: '',
        licenseNumber: ''
      });
    } catch (error: unknown) {
      setError('Error de conexión. Intente nuevamente.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('auth-selection')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-primary">PRMCMS</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            {userType === 'driver' ? <Truck className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            <span>Portal de {userType === 'driver' ? 'Conductores' : 'Clientes'}</span>
          </div>
        </div>

        {/* User Type Selection */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">Tipo de Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={userType === 'customer' ? 'default' : 'outline'}
                onClick={() => setUserType('customer')}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Cliente
              </Button>
              <Button
                variant={userType === 'driver' ? 'default' : 'outline'}
                onClick={() => setUserType('driver')}
                className="w-full"
              >
                <Truck className="h-4 w-4 mr-2" />
                Conductor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Auth Form */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">
              Acceso de {userType === 'driver' ? 'Conductores' : 'Clientes'}
            </CardTitle>
            <CardDescription className="text-center">
              {userType === 'driver' 
                ? 'Portal para conductores de entrega'
                : 'Portal de autoservicio para clientes'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="cliente@email.com"
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
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        placeholder="Pérez"
                        value={signupForm.lastName}
                        onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="cliente@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
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
                        value={signupForm.phone}
                        onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        placeholder="123 Calle Principal, San Juan, PR"
                        value={signupForm.address}
                        onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {userType === 'customer' && (
                    <div>
                      <Label htmlFor="mailboxNumber">Número de Buzón (opcional)</Label>
                      <Input
                        id="mailboxNumber"
                        placeholder="MB-001"
                        value={signupForm.mailboxNumber}
                        onChange={(e) => setSignupForm({...signupForm, mailboxNumber: e.target.value})}
                      />
                    </div>
                  )}

                  {userType === 'driver' && (
                    <div>
                      <Label htmlFor="licenseNumber">Número de Licencia</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="12345678"
                        value={signupForm.licenseNumber}
                        onChange={(e) => setSignupForm({...signupForm, licenseNumber: e.target.value})}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="signupPassword">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
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
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>¿Necesita ayuda? Contacte a su centro de correo</p>
          <p className="mt-1">info@prmcms.com • (787) 555-0123</p>
        </div>
      </div>
    </div>
  );
}