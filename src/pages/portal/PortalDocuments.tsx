import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Search, 
  Calendar,
  Receipt,
  FileCheck,
  ArrowLeft,
  Eye,
  Printer,
  Mail,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PortalDocumentsProps {
  customerData: unknown;
  onNavigate: (page: string) => void;
}

interface Document {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  size?: string;
  status: string;
  url?: string;
}

export default function PortalDocuments({ customerData, onNavigate }: PortalDocumentsProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Mock documents data - in production, fetch from database
      const mockDocuments: Document[] = [
        {
          id: '1',
          type: 'ps_form_1583',
          title: 'PS Form 1583',
          description: 'Formulario de autorización de buzón privado',
          date: new Date().toISOString(),
          size: '2.1 MB',
          status: 'available',
          url: '#'
        },
        {
          id: '2',
          type: 'receipt',
          title: 'Recibo de Pago - Enero 2024',
          description: 'Recibo de pago mensual de buzón',
          date: new Date(Date.now() - 30*24*60*60*1000).toISOString(),
          size: '1.2 MB',
          status: 'available',
          url: '#'
        },
        {
          id: '3',
          type: 'invoice',
          title: 'Factura #INV-2024-0001',
          description: 'Factura de servicios adicionales',
          date: new Date(Date.now() - 15*24*60*60*1000).toISOString(),
          size: '1.8 MB',
          status: 'available',
          url: '#'
        },
        {
          id: '4',
          type: 'compliance',
          title: 'Certificado de Cumplimiento Act 60',
          description: 'Documentación de compliance para decreto',
          date: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
          size: '3.4 MB',
          status: 'available',
          url: '#'
        },
        {
          id: '5',
          type: 'agreement',
          title: 'Acuerdo de Servicios',
          description: 'Contrato de servicios de buzón privado',
          date: new Date(Date.now() - 90*24*60*60*1000).toISOString(),
          size: '2.7 MB',
          status: 'available',
          url: '#'
        }
      ];

      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los documentos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'ps_form_1583': return <Shield className="w-5 h-5 text-blue-600" />;
      case 'receipt': return <Receipt className="w-5 h-5 text-green-600" />;
      case 'invoice': return <FileText className="w-5 h-5 text-orange-600" />;
      case 'compliance': return <FileCheck className="w-5 h-5 text-purple-600" />;
      case 'agreement': return <Mail className="w-5 h-5 text-indigo-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'ps_form_1583': return 'PS Form 1583';
      case 'receipt': return 'Recibo';
      case 'invoice': return 'Factura';
      case 'compliance': return 'Compliance';
      case 'agreement': return 'Acuerdo';
      default: return type;
    }
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'ps_form_1583': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'receipt': return 'bg-green-100 text-green-800 border-green-200';
      case 'invoice': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'compliance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'agreement': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const downloadDocument = (doc: Document) => {
    toast({
      title: 'Descargando documento',
      description: `Iniciando descarga de ${doc.title}`,
    });
    // In production, implement actual download logic
  };

  const viewDocument = (doc: Document) => {
    toast({
      title: 'Abriendo documento',
      description: `Visualizando ${doc.title}`,
    });
    // In production, implement document viewer
  };

  const printDocument = (doc: Document) => {
    toast({
      title: 'Preparando impresión',
      description: `Preparando ${doc.title} para imprimir`,
    });
    // In production, implement print functionality
  };

  const requestPS1583 = () => {
    toast({
      title: 'Solicitud enviada',
      description: 'Su solicitud de PS Form 1583 ha sido enviada. Recibirá el documento en 24-48 horas.',
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Documentos</h1>
          <p className="text-sm text-muted-foreground">
            Acceda y descargue sus documentos importantes
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col bg-white/50"
              onClick={requestPS1583}
            >
              <Shield className="w-5 h-5 mb-1 text-blue-600" />
              <span className="text-xs">Solicitar PS 1583</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-3 flex-col bg-white/50"
            >
              <Receipt className="w-5 h-5 mb-1 text-green-600" />
              <span className="text-xs">Historial Facturas</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('all')}
          >
            Todos
          </Button>
          <Button
            variant={selectedType === 'ps_form_1583' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('ps_form_1583')}
          >
            PS Form 1583
          </Button>
          <Button
            variant={selectedType === 'receipt' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('receipt')}
          >
            Recibos
          </Button>
          <Button
            variant={selectedType === 'invoice' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('invoice')}
          >
            Facturas
          </Button>
          <Button
            variant={selectedType === 'compliance' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedType('compliance')}
          >
            Compliance
          </Button>
        </div>
      </div>

      {/* Documents List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mis Documentos</h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {filteredDocuments.length}
          </Badge>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron documentos</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ajuste los filtros de búsqueda
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border-l-4 border-l-primary/30">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getDocumentIcon(doc.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-foreground">
                            {doc.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {doc.description}
                          </p>
                        </div>
                        <Badge className={getDocumentTypeColor(doc.type)}>
                          {getDocumentTypeLabel(doc.type)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {format(new Date(doc.date), 'dd MMM yyyy', { locale: es })}
                            </span>
                          </div>
                          {doc.size && (
                            <div className="flex items-center space-x-1">
                              <FileText className="w-3 h-3" />
                              <span>{doc.size}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewDocument(doc)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadDocument(doc)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => printDocument(doc)}
                            className="h-8 w-8 p-0"
                          >
                            <Printer className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-semibold text-sm mb-2">¿No encuentra un documento?</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Contacte a su centro de correo para solicitar documentos específicos
            </p>
            <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
              <span>📧 info@prmcms.com</span>
              <span>📞 (787) 555-0123</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}