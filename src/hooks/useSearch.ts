import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchResult {
  id: string;
  type: 'customer' | 'package' | 'mailbox';
  title: string;
  subtitle: string;
  metadata?: Record<string, any>;
}

interface SearchFilters {
  dateRange?: { start: Date; end: Date };
  carrier?: string;
  status?: string;
  size?: string;
  customerType?: 'regular' | 'act60';
}

interface UseSearchOptions {
  enableVoice?: boolean;
  saveHistory?: boolean;
  fuzzyMatch?: boolean;
}

export function useSearch(options: UseSearchOptions = {}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<Array<{ query: string; timestamp: Date; results: number }>>([]);
  
  const debouncedQuery = useDebounce(query, 300);

  // Fuzzy matching using Levenshtein distance
  const fuzzyMatch = useCallback((str1: string, str2: string, threshold = 0.6) => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
    return (longer.length - editDistance) / longer.length >= threshold;
  }, []);

  // Soundex for Spanish names
  const soundex = useCallback((name: string) => {
    // Spanish Soundex implementation
    const cleaned = name.toLowerCase()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z]/g, '');

    let soundexCode = cleaned.charAt(0).toUpperCase();
    
    const consonantMap: Record<string, string> = {
      'b': '1', 'f': '1', 'p': '1', 'v': '1',
      'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
      'd': '3', 't': '3',
      'l': '4',
      'm': '5', 'n': '5',
      'r': '6'
    };

    for (let i = 1; i < cleaned.length && soundexCode.length < 4; i++) {
      const char = cleaned[i];
      const code = consonantMap[char];
      
      if (code && code !== soundexCode[soundexCode.length - 1]) {
        soundexCode += code;
      }
    }

    return soundexCode.padEnd(4, '0');
  }, []);

  // Global search query
  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];

      const results: SearchResult[] = [];

      // Search customers
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .or(`business_name.ilike.%${debouncedQuery}%,email.ilike.%${debouncedQuery}%,phone.ilike.%${debouncedQuery}%`);

      if (customers) {
        customers.forEach(customer => {
          let isMatch = false;
          
          // Direct match
          if (customer.business_name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              customer.email?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              customer.phone?.includes(debouncedQuery)) {
            isMatch = true;
          }
          
          // Fuzzy match for names if enabled
          if (!isMatch && options.fuzzyMatch && customer.business_name) {
            const fuzzyResult = fuzzyMatch(customer.business_name, debouncedQuery);
            isMatch = typeof fuzzyResult === 'boolean' ? fuzzyResult : fuzzyResult >= 0.6;
          }
          
          // Soundex match for Spanish names
          if (!isMatch && customer.business_name) {
            isMatch = soundex(customer.business_name) === soundex(debouncedQuery);
          }

          if (isMatch) {
            results.push({
              id: customer.id,
              type: 'customer',
              title: customer.business_name || 'Cliente sin nombre',
              subtitle: `${customer.email || ''} • ${customer.phone || ''}`,
              metadata: customer
            });
          }
        });
      }

      // Search packages
      let packageQuery = supabase
        .from('packages')
        .select(`
          *,
          customers!inner(business_name, email)
        `)
        .or(`tracking_number.ilike.%${debouncedQuery}%,notes.ilike.%${debouncedQuery}%`);

      // Apply filters
      if (filters.dateRange) {
        packageQuery = packageQuery
          .gte('created_at', filters.dateRange.start.toISOString())
          .lte('created_at', filters.dateRange.end.toISOString());
      }
      if (filters.carrier) {
        packageQuery = packageQuery.eq('carrier', filters.carrier);
      }
      if (filters.status) {
        packageQuery = packageQuery.eq('status', filters.status);
      }

      const { data: packages } = await packageQuery;

      if (packages) {
        packages.forEach(pkg => {
          let isMatch = false;
          
          // Direct match
          if (pkg.tracking_number?.includes(debouncedQuery) ||
              pkg.notes?.toLowerCase().includes(debouncedQuery.toLowerCase())) {
            isMatch = true;
          }
          
          // Partial barcode matching
          if (!isMatch && pkg.tracking_number && debouncedQuery.length >= 3) {
            isMatch = pkg.tracking_number.includes(debouncedQuery);
          }

          if (isMatch) {
            results.push({
              id: pkg.id,
              type: 'package',
              title: `Paquete ${pkg.tracking_number}`,
              subtitle: `${pkg.customers?.business_name || 'Cliente desconocido'} • ${pkg.carrier || ''}`,
              metadata: pkg
            });
          }
        });
      }

      // Search mailboxes
      const { data: mailboxes } = await supabase
        .from('mailboxes')
        .select(`
          *,
          customers(business_name, email)
        `)
        .or(`number.eq.${debouncedQuery},size.ilike.%${debouncedQuery}%`);

      if (mailboxes) {
        mailboxes.forEach(mailbox => {
          results.push({
            id: mailbox.id,
            type: 'mailbox',
            title: `Buzón #${mailbox.number}`,
            subtitle: `${mailbox.customers?.business_name || 'Sin asignar'} • ${mailbox.size}`,
            metadata: mailbox
          });
        });
      }

      // Track search analytics
      if (options.saveHistory) {
        setSearchHistory(prev => [
          { query: debouncedQuery, timestamp: new Date(), results: results.length },
          ...prev.slice(0, 99) // Keep last 100 searches
        ]);
      }

      return results;
    },
    enabled: debouncedQuery.length >= 2
  });

  const saveSearch = useCallback((searchQuery: string) => {
    if (options.saveHistory && searchQuery.trim()) {
      setRecentSearches(prev => {
        const filtered = prev.filter(q => q !== searchQuery);
        return [searchQuery, ...filtered.slice(0, 9)]; // Keep last 10 searches
      });
    }
  }, [options.saveHistory]);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    setSearchHistory([]);
  }, []);

  const popularSearches = useMemo(() => {
    const counts = searchHistory.reduce((acc, { query }) => {
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([query]) => query);
  }, [searchHistory]);

  const noResultsQueries = useMemo(() => {
    return searchHistory
      .filter(({ results }) => results === 0)
      .map(({ query }) => query)
      .slice(0, 10);
  }, [searchHistory]);

  const exportToCSV = useCallback((data: SearchResult[], filename: string) => {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, filename, 'text/csv');
  }, []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    searchResults: searchResults || [],
    isLoading,
    error,
    recentSearches,
    searchHistory,
    popularSearches,
    noResultsQueries,
    saveSearch,
    clearHistory,
    fuzzyMatch,
    soundex,
    exportToCSV
  };
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost
      );
    }
  }

  return matrix[str2.length][str1.length];
}

function convertToCSV(data: SearchResult[]): string {
  if (data.length === 0) return '';
  
  const headers = ['Type', 'Title', 'Subtitle', 'ID'];
  const rows = data.map(item => [
    item.type,
    item.title,
    item.subtitle,
    item.id
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  return csvContent;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}