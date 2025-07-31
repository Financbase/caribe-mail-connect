import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from '@/components/LanguageToggle';
import { 
  Shield, 
  Users, 
  Truck,
  Building2,
  ArrowRight
} from 'lucide-react';

interface AuthSelectionProps {
  onNavigate?: (page: string) => void;
}

export default function AuthSelection({ onNavigate }: AuthSelectionProps = {}) {
  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Default navigation behavior
      if (page === 'staff-auth') {
        window.location.hash = '#/auth/staff';
      } else if (page === 'customer-auth') {
        window.location.hash = '#/auth/customer';
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary" data-testid="app-title">PRMCMS</h1>
          </div>
          <h2 className="text-2xl font-semibold">Puerto Rico Mail Carrier Management</h2>
          <p className="text-muted-foreground">Seleccione su tipo de acceso</p>
          
          {/* Language Toggle */}
          <div className="flex justify-center mt-4">
            <LanguageToggle />
          </div>
        </div>

        {/* Login Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Staff/Admin Login */}
          <Card className="shadow-elegant hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleNavigate('staff-auth')} data-testid="staff-auth-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Personal & Administración</CardTitle>
              <CardDescription>
                Acceso para propietarios, administradores y personal del centro de correo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Gestión completa del sistema</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Administración de clientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Reportes y facturación</span>
                </div>
              </div>
              <Button className="w-full group-hover:bg-primary/90 transition-colors" data-testid="staff-login-button">
                Acceder como Personal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Customer/Driver Login */}
          <Card className="shadow-elegant hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleNavigate('customer-auth')} data-testid="customer-auth-card">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <div className="flex space-x-1">
                  <Users className="h-6 w-6 text-accent" />
                  <Truck className="h-6 w-6 text-accent" />
                </div>
              </div>
              <CardTitle className="text-xl">Clientes & Conductores</CardTitle>
              <CardDescription>
                Portal de autoservicio para clientes y conductores de entrega
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Seguimiento de paquetes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Historial de entregas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span>Gestión de rutas (conductores)</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full group-hover:bg-accent/90 transition-colors">
                Acceder como Cliente/Conductor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Card className="shadow-elegant">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">¿Necesita ayuda?</h3>
              <p className="text-sm text-muted-foreground">
                Si no está seguro de qué tipo de acceso necesita o tiene problemas para iniciar sesión, 
                contacte a su administrador del sistema.
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="text-muted-foreground">Email: soporte@prmcms.com</span>
                <span className="text-muted-foreground">Tel: (787) 555-0123</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}