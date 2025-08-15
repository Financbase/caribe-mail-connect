import React, { useState, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { CaribbeanButton } from '@/components/ui/caribbean-button';
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card';

export interface SearchFilter {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  highlight?: string[];
  score?: number;
  onClick?: () => void;
}

export interface SearchInterfaceProps {
  placeholder?: string;
  filters?: SearchFilter[];
  results?: SearchResult[];
  loading?: boolean;
  error?: string;
  onSearch: (query: string, filters: Record<string, any>) => void;
  onClear?: () => void;
  showFilters?: boolean;
  showSorting?: boolean;
  sortOptions?: Array<{ key: string; label: string }>;
  debounceMs?: number;
  className?: string;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  maxResults?: number;
  showResultCount?: boolean;
}

/**
 * Caribbean-styled search interface with advanced filtering
 * Optimized for Puerto Rico mail system searches
 */
export function CaribbeanSearch({
  placeholder,
  filters = [],
  results = [],
  loading = false,
  error,
  onSearch,
  onClear,
  showFilters = true,
  showSorting = true,
  sortOptions = [],
  debounceMs = 300,
  className,
  emptyStateIcon,
  emptyStateTitle,
  emptyStateDescription,
  maxResults,
  showResultCount = true
}: SearchInterfaceProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(query, { ...filterValues, sortBy });
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, filterValues, sortBy, onSearch, debounceMs]);

  // Display results (limited if maxResults is set)
  const displayResults = useMemo(() => {
    return maxResults ? results.slice(0, maxResults) : results;
  }, [results, maxResults]);

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClear = () => {
    setQuery('');
    setFilterValues({});
    setSortBy('');
    if (onClear) {
      onClear();
    } else {
      onSearch('', {});
    }
  };

  const renderFilter = (filter: SearchFilter) => {
    const value = filterValues[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <input
            key={filter.key}
            type="text"
            placeholder={filter.placeholder || filter.label}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-primary-ocean focus:ring-1 focus:ring-primary-ocean outline-none transition-colors"
          />
        );

      case 'select':
        return (
          <select
            key={filter.key}
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-primary-ocean focus:ring-1 focus:ring-primary-ocean outline-none transition-colors"
          >
            <option value="">{filter.placeholder || t('select_option', 'Seleccionar')}</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            key={filter.key}
            type="date"
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-primary-ocean focus:ring-1 focus:ring-primary-ocean outline-none transition-colors"
          />
        );

      case 'number':
        return (
          <input
            key={filter.key}
            type="number"
            placeholder={filter.placeholder || filter.label}
            value={value || ''}
            min={filter.min}
            max={filter.max}
            onChange={(e) => handleFilterChange(filter.key, e.target.value ? Number(e.target.value) : '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:border-primary-ocean focus:ring-1 focus:ring-primary-ocean outline-none transition-colors"
          />
        );

      case 'boolean':
        return (
          <label key={filter.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFilterChange(filter.key, e.target.checked)}
              className="w-4 h-4 text-primary-ocean border-gray-300 rounded focus:ring-primary-ocean"
            />
            <span className="text-sm text-gray-700">{filter.label}</span>
          </label>
        );

      default:
        return null;
    }
  };

  const renderSearchResult = (result: SearchResult, index: number) => {
    return (
      <div
        key={result.id}
        className={cn(
          'p-4 border border-gray-200 rounded-lg hover:border-primary-ocean hover:shadow-md transition-all cursor-pointer',
          result.onClick && 'hover:bg-gray-50'
        )}
        onClick={result.onClick}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 caribbean-text mb-1">
              {result.title}
            </h3>
            
            {result.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {result.description}
              </p>
            )}
            
            {result.highlight && result.highlight.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {result.highlight.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-md"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
            
            {result.metadata && (
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {Object.entries(result.metadata).map(([key, value]) => (
                  <span key={key}>
                    <span className="font-medium">{key}:</span> {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {result.score && (
            <div className="flex-shrink-0">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {Math.round(result.score * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">
        {emptyStateIcon || '🔍'}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 caribbean-text">
        {emptyStateTitle || (query 
          ? t('no_results_found', 'No se encontraron resultados')
          : t('start_searching', 'Comienza a buscar')
        )}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {emptyStateDescription || (query
          ? t('try_different_search', 'Intenta con términos diferentes o revisa los filtros')
          : t('enter_search_terms', 'Ingresa términos de búsqueda para encontrar información')
        )}
      </p>
    </div>
  );

  return (
    <div className={cn('caribbean-search space-y-6', className)}>
      {/* Search Header */}
      <EnhancedCard variant="default">
        <CardContent className="p-6">
          {/* Main Search Input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔍</span>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={placeholder || t('search_placeholder', 'Buscar paquetes, clientes, direcciones...')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:border-primary-ocean focus:ring-2 focus:ring-primary-ocean/20 outline-none transition-all"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Toggle and Sort */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {showFilters && filters.length > 0 && (
                <CaribbeanButton
                  variant="ghost"
                  hierarchy="tertiary"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  🎛️ {t('filters', 'Filtros')} {Object.keys(filterValues).filter(key => filterValues[key]).length > 0 && `(${Object.keys(filterValues).filter(key => filterValues[key]).length})`}
                </CaribbeanButton>
              )}
              
              {showSorting && sortOptions.length > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded focus:border-primary-ocean outline-none"
                >
                  <option value="">{t('sort_by', 'Ordenar por')}</option>
                  {sortOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {showResultCount && (
              <span className="text-sm text-gray-600">
                {loading ? (
                  t('searching', 'Buscando...')
                ) : (
                  `${results.length} ${t('results', 'resultados')}`
                )}
              </span>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && filters.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {filter.label}
                    </label>
                    {renderFilter(filter)}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex gap-2">
                <CaribbeanButton
                  variant="ghost"
                  hierarchy="tertiary"
                  size="sm"
                  onClick={handleClear}
                >
                  {t('clear_all', 'Limpiar todo')}
                </CaribbeanButton>
              </div>
            </div>
          )}
        </CardContent>
      </EnhancedCard>

      {/* Error State */}
      {error && (
        <EnhancedCard variant="default">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-medium">{t('search_error', 'Error en la búsqueda')}</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            </div>
          </CardContent>
        </EnhancedCard>
      )}

      {/* Results */}
      <EnhancedCard variant="default">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary-ocean border-t-transparent rounded-full animate-spin" />
                <span className="text-primary-ocean">
                  {t('searching', 'Buscando')}...
                </span>
              </div>
            </div>
          ) : displayResults.length > 0 ? (
            <div className="space-y-4">
              {displayResults.map(renderSearchResult)}
              
              {maxResults && results.length > maxResults && (
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    {t('showing_limited_results', 'Mostrando')} {maxResults} {t('of', 'de')} {results.length} {t('results', 'resultados')}
                  </p>
                  <CaribbeanButton
                    variant="ghost"
                    hierarchy="secondary"
                    size="sm"
                    onClick={() => {
                      // This would typically trigger a "show more" functionality
                      console.log('Show more results');
                    }}
                  >
                    {t('show_more', 'Ver más resultados')}
                  </CaribbeanButton>
                </div>
              )}
            </div>
          ) : (
            renderEmptyState()
          )}
        </CardContent>
      </EnhancedCard>
    </div>
  );
}

export default CaribbeanSearch;
