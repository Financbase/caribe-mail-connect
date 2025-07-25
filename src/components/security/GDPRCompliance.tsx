import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Trash2 } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';

export function GDPRCompliance() {
  const { createGDPRRequest } = useSecurity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumplimiento GDPR</CardTitle>
        <CardDescription>Gestión de solicitudes de privacidad de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => createGDPRRequest('export')}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Exportar Datos</span>
            </Button>
            <Button 
              onClick={() => createGDPRRequest('deletion')}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Solicitar Eliminación</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}