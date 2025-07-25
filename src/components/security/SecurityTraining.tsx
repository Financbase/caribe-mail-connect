import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, BookOpen } from 'lucide-react';

export function SecurityTraining() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrenamiento de Seguridad</CardTitle>
        <CardDescription>Capacitación y simulaciones de seguridad</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button className="w-full">
            <BookOpen className="h-4 w-4 mr-2" />
            Iniciar Entrenamiento
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}