import { useState, useEffect } from 'react';
import { Download, Edit, Trash2, Share, History, FileText, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDocuments } from '@/hooks/useDocuments';
import { supabase } from '@/integrations/supabase/client';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Document } from '@/hooks/useDocuments';

interface DocumentViewerProps {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentViewer({ documentId, open, onOpenChange }: DocumentViewerProps) {
  const { language } = useLanguage();
  const { getDocumentUrl, logDocumentAccess } = useDocuments();
  const { toast } = useToast();
  
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const isSpanish = language === 'es';

  useEffect(() => {
    if (open && documentId) {
      fetchDocument();
      logDocumentAccess(documentId, 'view');
    }
  }, [open, documentId]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      
      // Fetch document details
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;
      setDocument(data);

      // Get file URL for viewing
      if (data) {
        const url = await getDocumentUrl(data.file_path, false);
        setFileUrl(url);
      }
    } catch (error: unknown) {
      console.error('Error fetching document:', error);
      toast({
        title: isSpanish ? 'Error' : 'Error',
        description: isSpanish ? 'Error al cargar el documento' : 'Failed to load document',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    try {
      const downloadUrl = await getDocumentUrl(document.file_path, true);
      if (downloadUrl) {
        const linkElement = window.document.createElement('a');
        linkElement.href = downloadUrl;
        linkElement.download = document.file_name;
        window.document.body.appendChild(linkElement);
        linkElement.click();
        window.document.body.removeChild(linkElement);
        
        await logDocumentAccess(document.id, 'download');
        
        toast({
          title: isSpanish ? 'Descarga iniciada' : 'Download started',
          description: isSpanish ? 'El archivo se está descargando' : 'File is downloading',
        });
      }
    } catch (error: unknown) {
      console.error('Error downloading document:', error);
      toast({
        title: isSpanish ? 'Error' : 'Error',
        description: isSpanish ? 'Error al descargar el documento' : 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('image')) return '🖼️';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    return '📁';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      customer_docs: 'bg-blue-100 text-blue-800',
      compliance: 'bg-red-100 text-red-800',
      contracts: 'bg-green-100 text-green-800',
      invoices: 'bg-yellow-100 text-yellow-800',
      policies: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const canDisplayInline = (contentType: string) => {
    return contentType.includes('pdf') || contentType.includes('image');
  };

  if (loading || !document) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-2xl">
                {getFileIcon(document.content_type)}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold truncate">{document.title}</h2>
                <p className="text-sm text-muted-foreground truncate">
                  {document.file_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                {isSpanish ? 'Descargar' : 'Download'}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                {isSpanish ? 'Compartir' : 'Share'}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Document viewer */}
            <div className="flex-1 min-w-0">
              {fileUrl && canDisplayInline(document.content_type) ? (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title={document.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {isSpanish ? 'Vista previa no disponible' : 'Preview not available'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isSpanish 
                        ? 'Este tipo de archivo no se puede mostrar en el navegador'
                        : 'This file type cannot be displayed in the browser'
                      }
                    </p>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      {isSpanish ? 'Descargar para ver' : 'Download to view'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Document info */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isSpanish ? 'Información del Documento' : 'Document Information'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isSpanish ? 'Tamaño:' : 'Size:'}</span>
                      <span>{formatBytes(document.file_size_bytes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isSpanish ? 'Tipo:' : 'Type:'}</span>
                      <span>{document.content_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isSpanish ? 'Creado:' : 'Created:'}</span>
                      <span>{formatDate(document.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{isSpanish ? 'Modificado:' : 'Modified:'}</span>
                      <span>{formatDate(document.updated_at)}</span>
                    </div>
                    {document.expiration_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{isSpanish ? 'Vence:' : 'Expires:'}</span>
                        <span className="text-amber-600">{formatDate(document.expiration_date)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Metadata */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isSpanish ? 'Metadatos' : 'Metadata'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground block">
                        {isSpanish ? 'Categoría:' : 'Category:'}
                      </span>
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </div>

                    {document.tags && document.tags.length > 0 && (
                      <div>
                        <span className="text-sm text-muted-foreground block mb-2">
                          {isSpanish ? 'Etiquetas:' : 'Tags:'}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {document.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-sm text-muted-foreground block">
                        {isSpanish ? 'Nivel de Confidencialidad:' : 'Confidentiality Level:'}
                      </span>
                      <Badge variant="outline">{document.confidentiality_level}</Badge>
                    </div>

                    {document.is_sensitive && (
                      <div>
                        <Badge variant="destructive">
                          {isSpanish ? 'Información Sensible' : 'Sensitive Information'}
                        </Badge>
                      </div>
                    )}

                    {document.requires_signature && (
                      <div>
                        <Badge variant="outline">
                          ✍️ {isSpanish ? 'Requiere Firma' : 'Requires Signature'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div>
                  <h3 className="font-semibold mb-3">
                    {isSpanish ? 'Acciones' : 'Actions'}
                  </h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      {isSpanish ? 'Editar Propiedades' : 'Edit Properties'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <History className="h-4 w-4 mr-2" />
                      {isSpanish ? 'Ver Historial' : 'View History'}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isSpanish ? 'Eliminar' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}