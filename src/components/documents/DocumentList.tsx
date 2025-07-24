import { FileText, Download, Eye, Edit, Trash2, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Document } from '@/hooks/useDocuments';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  onDocumentSelect: (documentId: string) => void;
}

export function DocumentList({ documents, loading, onDocumentSelect }: DocumentListProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          {isSpanish ? 'No hay documentos' : 'No documents found'}
        </h3>
        <p className="text-muted-foreground">
          {isSpanish 
            ? 'Sube tu primer documento para comenzar'
            : 'Upload your first document to get started'
          }
        </p>
      </div>
    );
  }

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

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox />
            </TableHead>
            <TableHead>{isSpanish ? 'Documento' : 'Document'}</TableHead>
            <TableHead>{isSpanish ? 'Categoría' : 'Category'}</TableHead>
            <TableHead>{isSpanish ? 'Tamaño' : 'Size'}</TableHead>
            <TableHead>{isSpanish ? 'Modificado' : 'Modified'}</TableHead>
            <TableHead>{isSpanish ? 'Estado' : 'Status'}</TableHead>
            <TableHead className="w-24">{isSpanish ? 'Acciones' : 'Actions'}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((document) => (
            <TableRow 
              key={document.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onDocumentSelect(document.id)}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Checkbox />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {getFileIcon(document.content_type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{document.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {document.file_name}
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge 
                  variant="secondary" 
                  className={`${getCategoryColor(document.category)}`}
                >
                  {document.category}
                </Badge>
              </TableCell>
              
              <TableCell className="text-muted-foreground">
                {formatBytes(document.file_size_bytes)}
              </TableCell>
              
              <TableCell className="text-muted-foreground">
                {formatDate(document.updated_at)}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  {document.is_sensitive && (
                    <Badge variant="destructive" className="text-xs">
                      {isSpanish ? 'Sensible' : 'Sensitive'}
                    </Badge>
                  )}
                  {document.expiration_date && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {isSpanish ? 'Vence' : 'Expires'}
                    </Badge>
                  )}
                  {document.requires_signature && (
                    <Badge variant="outline" className="text-xs">
                      ✍️ {isSpanish ? 'Firma' : 'Sign'}
                    </Badge>
                  )}
                </div>
              </TableCell>
              
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}