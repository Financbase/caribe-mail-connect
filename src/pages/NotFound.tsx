import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.hash
    );
  }, []);

  const handleGoHome = () => {
    window.location.hash = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent/20 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            404 - Página No Encontrada
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            La ruta <code className="bg-muted px-1 py-0.5 rounded text-xs">
              {window.location.hash || '/'}
            </code> no fue encontrada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleGoHome}
              className="flex-1"
              variant="default"
            >
              <Home className="h-4 w-4 mr-2" />
              Ir al Inicio
            </Button>
            
            <Button 
              onClick={handleGoBack}
              className="flex-1"
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <p>Si crees que esto es un error, contacta al administrador.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
