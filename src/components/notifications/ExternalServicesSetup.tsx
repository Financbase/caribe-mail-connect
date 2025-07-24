import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, MessageCircle, Phone, CheckCircle, AlertCircle } from 'lucide-react';

export function ExternalServicesSetup() {
  const { language } = useLanguage();

  const services = [
    {
      name: 'Resend (Email)',
      icon: <Mail className="h-5 w-5" />,
      description: language === 'en' ? 'Email delivery service' : 'Servicio de entrega de emails',
      status: 'not_configured',
      secretName: 'RESEND_API_KEY',
      setupUrl: 'https://resend.com/api-keys'
    },
    {
      name: 'Twilio (SMS)',
      icon: <Phone className="h-5 w-5" />,
      description: language === 'en' ? 'SMS messaging service' : 'Servicio de mensajes SMS',
      status: 'not_configured',
      secretName: 'TWILIO_AUTH_TOKEN',
      setupUrl: 'https://console.twilio.com/'
    },
    {
      name: 'WhatsApp Business',
      icon: <MessageCircle className="h-5 w-5" />,
      description: language === 'en' ? 'WhatsApp messaging API' : 'API de mensajería WhatsApp',
      status: 'not_configured',
      secretName: 'WHATSAPP_ACCESS_TOKEN',
      setupUrl: 'https://developers.facebook.com/apps'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return (
          <Badge variant="default" className="bg-primary-palm text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Configured' : 'Configurado'}
          </Badge>
        );
      case 'not_configured':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            {language === 'en' ? 'Not Configured' : 'No Configurado'}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {language === 'en' ? 'External Services Configuration' : 'Configuración de Servicios Externos'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'en' 
            ? 'Configure API keys for external notification services to enable automated messaging.'
            : 'Configura las claves API para servicios externos de notificación para habilitar mensajería automatizada.'
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.name}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                {service.icon}
                {service.name}
              </CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {language === 'en' ? 'Status:' : 'Estado:'}
                </span>
                {getStatusBadge(service.status)}
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(service.setupUrl, '_blank')}
                >
                  {language === 'en' ? 'Get API Key' : 'Obtener Clave API'}
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    // This will be handled by the platform's secret management
                    console.log(`Configure ${service.secretName}`);
                  }}
                >
                  {language === 'en' ? 'Configure' : 'Configurar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'Setup Instructions' : 'Instrucciones de Configuración'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Resend (Email)</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• {language === 'en' ? 'Sign up at resend.com' : 'Registrarse en resend.com'}</li>
              <li>• {language === 'en' ? 'Verify your domain' : 'Verificar tu dominio'}</li>
              <li>• {language === 'en' ? 'Create an API key' : 'Crear una clave API'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Twilio (SMS)</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• {language === 'en' ? 'Create account at twilio.com' : 'Crear cuenta en twilio.com'}</li>
              <li>• {language === 'en' ? 'Get phone number' : 'Obtener número de teléfono'}</li>
              <li>• {language === 'en' ? 'Copy Account SID and Auth Token' : 'Copiar Account SID y Auth Token'}</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">WhatsApp Business</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• {language === 'en' ? 'Apply for WhatsApp Business API' : 'Solicitar WhatsApp Business API'}</li>
              <li>• {language === 'en' ? 'Get approved message templates' : 'Obtener plantillas de mensajes aprobadas'}</li>
              <li>• {language === 'en' ? 'Configure webhook endpoints' : 'Configurar endpoints de webhook'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}