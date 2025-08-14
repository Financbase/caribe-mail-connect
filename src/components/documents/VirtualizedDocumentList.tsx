import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Document } from '@/hooks/useDocuments'
import { formatBytes, formatDate } from '@/lib/utils'
import { VirtualizedList } from '@/components/lists/VirtualizedList'
import { Clock } from 'lucide-react'

interface VirtualizedDocumentListProps {
  documents: Document[]
  loading: boolean
  onDocumentSelect: (documentId: string) => void
}

export function VirtualizedDocumentList({ documents, loading, onDocumentSelect }: VirtualizedDocumentListProps) {
  const { language } = useLanguage()
  const isSpanish = language === 'es'

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">📄</div>
        <h3 className="text-lg font-semibold mb-2">
          {isSpanish ? 'No hay documentos' : 'No documents found'}
        </h3>
        <p className="text-muted-foreground">
          {isSpanish ? 'Sube tu primer documento para comenzar' : 'Upload your first document to get started'}
        </p>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      customer_docs: 'bg-blue-100 text-blue-800',
      compliance: 'bg-red-100 text-red-800',
      contracts: 'bg-green-100 text-green-800',
      invoices: 'bg-yellow-100 text-yellow-800',
      policies: 'bg-purple-100 text-purple-800',
      general: 'bg-gray-100 text-gray-800',
    }
    return (colors as Record<string, string>)[category] || colors.general
  }

  return (
    <div role="region" aria-label={isSpanish ? 'Lista de documentos' : 'Documents list'} className="border rounded-lg divide-y">
      <div className="grid grid-cols-12 px-4 py-2 bg-muted/40 text-xs font-medium">
        <div className="col-span-5">{isSpanish ? 'Documento' : 'Document'}</div>
        <div className="col-span-2">{isSpanish ? 'Categoría' : 'Category'}</div>
        <div className="col-span-2">{isSpanish ? 'Tamaño' : 'Size'}</div>
        <div className="col-span-3">{isSpanish ? 'Modificado' : 'Modified'}</div>
      </div>
      <VirtualizedList
        items={documents}
        itemHeight={64}
        ariaLabel={isSpanish ? 'Documentos' : 'Documents'}
        renderItem={(document) => (
          <button
            type="button"
            onClick={() => onDocumentSelect(document.id)}
            className="w-full grid grid-cols-12 px-4 py-3 text-left hover:bg-muted/40 focus:bg-muted/50 focus:outline-none"
          >
            <div className="col-span-5 min-w-0">
              <div className="font-medium truncate">{document.title}</div>
              <div className="text-xs text-muted-foreground truncate">{document.file_name}</div>
            </div>
            <div className="col-span-2">
              <Badge variant="secondary" className={`text-xs ${getCategoryColor(document.category)}`}>
                {document.category}
              </Badge>
            </div>
            <div className="col-span-2 text-muted-foreground text-sm">
              {formatBytes(document.file_size_bytes)}
            </div>
            <div className="col-span-3 text-muted-foreground text-sm flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(document.updated_at)}
            </div>
          </button>
        )}
      />
    </div>
  )
}

export default VirtualizedDocumentList


