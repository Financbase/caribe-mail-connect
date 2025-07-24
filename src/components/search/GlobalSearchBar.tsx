import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VoiceInput } from '@/components/mobile/VoiceInput';
import { useSearch, SearchResult } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

interface GlobalSearchBarProps {
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
  placeholder?: string;
}

export function GlobalSearchBar({ 
  onResultSelect, 
  className,
  placeholder = "Buscar clientes, paquetes, buzones..."
}: GlobalSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    searchResults,
    isLoading,
    recentSearches,
    popularSearches,
    saveSearch
  } = useSearch({ enableVoice: true, saveHistory: true, fuzzyMatch: true });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0 || isFocused);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleResultClick = (result: SearchResult) => {
    saveSearch(query);
    setQuery('');
    setIsOpen(false);
    setIsFocused(false);
    onResultSelect?.(result);
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    saveSearch(searchQuery);
  };

  const handleVoiceTranscription = (text: string) => {
    setQuery(text);
    setIsOpen(true);
  };

  const clearQuery = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'customer':
        return '👤';
      case 'package':
        return '📦';
      case 'mailbox':
        return '🏠';
      default:
        return '🔍';
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'customer':
        return 'Cliente';
      case 'package':
        return 'Paquete';
      case 'mailbox':
        return 'Buzón';
      default:
        return '';
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl", className)} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pl-10 pr-20 h-12"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearQuery}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <VoiceInput onTranscription={handleVoiceTranscription} />
        </div>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
          <div className="p-4">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && query.length >= 2 && (
              <>
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      Resultados ({searchResults.length})
                    </h3>
                    {searchResults.map((result) => (
                      <div
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                      >
                        <span className="text-lg">{getResultIcon(result.type)}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium truncate">{result.title}</p>
                            <Badge variant="secondary" className="text-xs">
                              {getResultTypeLabel(result.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No se encontraron resultados</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Intenta con términos diferentes o usa búsqueda por voz
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Recent and Popular Searches */}
            {!query && (isFocused || isOpen) && (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Búsquedas recientes
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <div
                          key={index}
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {popularSearches.length > 0 && (
                  <>
                    {recentSearches.length > 0 && <Separator />}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Búsquedas populares
                        </h3>
                      </div>
                      <div className="space-y-1">
                        {popularSearches.slice(0, 3).map((search, index) => (
                          <div
                            key={index}
                            onClick={() => handleRecentSearchClick(search)}
                            className="flex items-center space-x-2 p-2 rounded hover:bg-muted cursor-pointer"
                          >
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{search}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {recentSearches.length === 0 && popularSearches.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Comienza a buscar</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Busca clientes, paquetes o buzones
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}