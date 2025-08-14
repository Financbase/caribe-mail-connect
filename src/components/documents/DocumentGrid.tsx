import { FileText, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Document } from '@/hooks/useDocuments';
import { FixedSizeGrid as Grid } from 'react-window';

interface DocumentGridProps {
  documents: Document[];
  loading: boolean;
  onDocumentSelect: (documentId: string) => void;
}

export function DocumentGrid({ documents, loading, onDocumentSelect }: DocumentGridProps) {
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

  // Virtualized grid for large document sets
  const columnCount = 4;
  const rowCount = Math.ceil(documents.length / columnCount);
  const columnWidth = 280;
  const rowHeight = 190;
  const width = Math.min(columnCount * columnWidth, window.innerWidth - 32);
  const height = Math.min(600, Math.ceil(documents.length / columnCount) * rowHeight);

  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= documents.length) return null;
    const document = documents[index];
    return (
      <div style={style} className="p-2">
        <Card 
          key={document.id} 
          className="group hover:shadow-md transition-shadow cursor-pointer h-full"
          onClick={() => onDocumentSelect(document.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getFileIcon(document.content_type)}
                </span>
                {document.is_sensitive && (
                  <Badge variant="destructive" className="text-xs">
                    {isSpanish ? 'Sensible' : 'Sensitive'}
                  </Badge>
                )}
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <h3 className="font-medium text-sm mb-2 line-clamp-2">
              {document.title}
            </h3>

            <div className="space-y-2 text-xs text-muted-foreground">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getCategoryColor(document.category)}`}
              >
                {document.category}
              </Badge>
              
              <div className="flex justify-between">
                <span>{formatBytes(document.file_size_bytes)}</span>
                <span>{formatDate(document.created_at)}</span>
              </div>

              {document.expiration_date && (
                <div className="text-amber-600">
                  {isSpanish ? 'Vence:' : 'Expires:'} {formatDate(document.expiration_date)}
                </div>
              )}

              {document.tags && document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{document.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Grid
        columnCount={columnCount}
        columnWidth={columnWidth}
        height={height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={width}
      >
        {Cell}
      </Grid>
    </div>
  );
}