import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function CheckDepositCapture() {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {isSpanish ? 'Depósito de Cheques' : 'Check Deposit'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {isSpanish ? 'Captura de depósitos - Próximamente' : 'Check deposit capture - Coming soon'}
        </p>
      </CardContent>
    </Card>
  );
}