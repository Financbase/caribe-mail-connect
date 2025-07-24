import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Tag, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDebounce } from '@/hooks/useDebounce';
import { formatBytes, formatDate } from '@/lib/utils';
import type { Document } from '@/hooks/useDocuments';

interface DocumentSearchProps {
  onSearch: (searchTerm: string) => void;
  searchResults: Document[];
  loading: boolean;
  onDocumentSelect: (documentId: string) => void;
}

export function DocumentSearch({ 
  onSearch, 
  searchResults, 
  loading, 
  onDocumentSelect 
}: DocumentSearchProps) {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [confidentialityFilter, setConfidentialityFilter] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isSpanish = language === 'es';

  useEffect(() => {
    if (debouncedSearchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  const categories = [
    { value: '', label: isSpanish ? 'Todas las categorías' : 'All categories' },
    { value: 'customer_docs', label: isSpanish ? 'Documentos de Cliente' : 'Customer Documents' },
    { value: 'compliance', label: isSpanish ? 'Cumplimiento' : 'Compliance' },
    { value: 'contracts', label: isSpanish ? 'Contratos' : 'Contracts' },
    { value: 'invoices', label: isSpanish ? 'Facturas' : 'Invoices' },
    { value: 'policies', label: isSpanish ? 'Políticas' : 'Policies' },
    { value: 'general', label: isSpanish ? 'General' : 'General' },
  ];

  const confidentialityLevels = [
    { value: '', label: isSpanish ? 'Todos los niveles' : 'All levels' },
    { value: 'public', label: isSpanish ? 'Público' : 'Public' },
    { value: 'internal', label: isSpanish ? 'Interno' : 'Internal' },
    { value: 'confidential', label: isSpanish ? 'Confidencial' : 'Confidential' },
    { value: 'restricted', label: isSpanish ? 'Restringido' : 'Restricted' },
  ];

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

  const filteredResults = searchResults.filter(doc => {
    if (categoryFilter && doc.category !== categoryFilter) return false;
    if (confidentialityFilter && doc.confidentiality_level !== confidentialityFilter) return false;
    
    if (dateRange.from || dateRange.to) {
      const docDate = new Date(doc.created_at);
      if (dateRange.from && docDate < dateRange.from) return false;
      if (dateRange.to && docDate > dateRange.to) return false;
    }
    
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isSpanish 
              ? 'Buscar documentos por título, contenido o etiquetas...'
              : 'Search documents by title, content, or tags...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {isSpanish ? 'Filtros' : 'Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {isSpanish ? 'Filtros Avanzados' : 'Advanced Filters'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">
                  {isSpanish ? 'Categoría' : 'Category'}
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {isSpanish ? 'Nivel de Confidencialidad' : 'Confidentiality Level'}
                </label>
                <Select value={confidentialityFilter} onValueChange={setConfidentialityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {confidentialityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">
                  {isSpanish ? 'Rango de Fechas' : 'Date Range'}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateRange.from ? formatDate(dateRange.from) : (isSpanish ? 'Seleccionar fechas' : 'Select dates')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p className="text-sm">{isSpanish ? 'Filtro de fecha próximamente' : 'Date filter coming soon'}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCategoryFilter('');
                  setConfidentialityFilter('');
                  setDateRange({});
                }}
              >
                {isSpanish ? 'Limpiar' : 'Clear'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : searchTerm && filteredResults.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isSpanish ? 'No se encontraron resultados' : 'No results found'}
            </h3>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'Intenta con diferentes términos de búsqueda o ajusta los filtros'
                : 'Try different search terms or adjust your filters'
              }
            </p>
          </div>
        ) : searchTerm ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isSpanish 
                  ? `${filteredResults.length} resultado(s) encontrado(s)`
                  : `${filteredResults.length} result(s) found`
                }
              </p>
            </div>

            <div className="space-y-3">
              {filteredResults.map((document) => (
                <Card 
                  key={document.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onDocumentSelect(document.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl mt-1">
                        {getFileIcon(document.content_type)}
                      </span>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium truncate">{document.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {document.file_name}
                            </p>
                            
                            {document.extracted_text && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {document.extracted_text.substring(0, 200)}...
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getCategoryColor(document.category)}>
                              {document.category}
                            </Badge>
                            
                            <div className="text-xs text-muted-foreground text-right">
                              <div>{formatBytes(document.file_size_bytes)}</div>
                              <div>{formatDate(document.created_at)}</div>
                            </div>
                          </div>
                        </div>

                        {document.tags && document.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {document.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {document.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{document.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                          {document.is_sensitive && (
                            <Badge variant="destructive" className="text-xs">
                              {isSpanish ? 'Sensible' : 'Sensitive'}
                            </Badge>
                          )}
                          {document.requires_signature && (
                            <Badge variant="outline" className="text-xs">
                              ✍️ {isSpanish ? 'Firma' : 'Signature'}
                            </Badge>
                          )}
                          {document.expiration_date && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {isSpanish ? 'Vence' : 'Expires'} {formatDate(document.expiration_date)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isSpanish ? 'Buscar Documentos' : 'Search Documents'}
            </h3>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'Ingresa términos de búsqueda para encontrar documentos'
                : 'Enter search terms to find documents'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}