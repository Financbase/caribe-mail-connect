import React, { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { CaribbeanButton, ButtonGroup } from '@/components/ui/caribbean-button';
import { EnhancedCard, CardContent } from '@/components/ui/enhanced-card';

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  loading?: boolean;
  selectable?: {
    type: 'checkbox' | 'radio';
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  expandable?: {
    expandedRowRender: (record: T, index: number) => React.ReactNode;
    expandedRowKeys?: React.Key[];
    onExpand?: (expanded: boolean, record: T) => void;
  };
  scroll?: {
    x?: number;
    y?: number;
  };
  rowKey: keyof T | ((record: T) => React.Key);
  onRow?: (record: T, index: number) => {
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
  };
  emptyText?: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  sticky?: boolean;
}

/**
 * Caribbean-styled data table with advanced features
 * Optimized for Puerto Rico bilingual interfaces
 */
export function CaribbeanTable<T extends Record<string, any>>({
  data,
  columns,
  pagination,
  loading = false,
  selectable,
  expandable,
  scroll,
  rowKey,
  onRow,
  emptyText,
  className,
  size = 'medium',
  bordered = true,
  showHeader = true,
  sticky = false
}: TableProps<T>) {
  const { t } = useLanguage();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<React.Key>>(new Set());

  // Get row key
  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] as React.Key;
  };

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'es', { numeric: true });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return sortedData;

    return sortedData.filter(record => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const recordValue = record[key];
        if (recordValue === null || recordValue === undefined) return false;
        return String(recordValue).toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [sortedData, filters]);

  // Handle sorting
  const handleSort = (columnKey: keyof T) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle filtering
  const handleFilter = (columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  // Handle row expansion
  const handleExpand = (record: T) => {
    const key = getRowKey(record, 0);
    const newExpandedRows = new Set(expandedRows);
    
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    
    setExpandedRows(newExpandedRows);
    expandable?.onExpand?.(!expandedRows.has(key), record);
  };

  // Size classes
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-sm',
    large: 'text-base'
  };

  const cellPaddingClasses = {
    small: 'px-2 py-1',
    medium: 'px-4 py-3',
    large: 'px-6 py-4'
  };

  // Table classes
  const tableClasses = cn(
    'w-full caribbean-table',
    sizeClasses[size],
    bordered && 'border border-gray-200',
    className
  );

  const headerClasses = cn(
    'bg-gradient-to-r from-primary-ocean/5 to-primary-sunrise/5',
    'border-b-2 border-primary-ocean/20',
    sticky && 'sticky top-0 z-10'
  );

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <thead className={headerClasses}>
        <tr>
          {/* Selection column */}
          {selectable && (
            <th className={cn('w-12', cellPaddingClasses[size])}>
              {selectable.type === 'checkbox' && (
                <input
                  type="checkbox"
                  checked={selectable.selectedRowKeys.length === data.length && data.length > 0}
                  onChange={(e) => {
                    const allKeys = data.map((record, index) => getRowKey(record, index));
                    selectable.onChange(
                      e.target.checked ? allKeys : [],
                      e.target.checked ? data : []
                    );
                  }}
                  className="w-4 h-4 text-primary-ocean border-gray-300 rounded focus:ring-primary-ocean"
                />
              )}
            </th>
          )}

          {/* Expandable column */}
          {expandable && (
            <th className={cn('w-12', cellPaddingClasses[size])}>
              {/* Expand all button could go here */}
            </th>
          )}

          {/* Data columns */}
          {columns.map((column) => (
            <th
              key={String(column.key)}
              className={cn(
                'font-semibold text-gray-900 caribbean-text',
                cellPaddingClasses[size],
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right',
                column.sortable && 'cursor-pointer hover:bg-primary-ocean/10',
                column.width && `w-[${column.width}]`
              )}
              style={{ width: column.width }}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-2">
                <span>{column.title}</span>
                {column.sortable && (
                  <span className="text-gray-400">
                    {sortConfig.key === column.key ? (
                      sortConfig.direction === 'asc' ? '↑' : '↓'
                    ) : '↕'}
                  </span>
                )}
              </div>
              
              {/* Filter input */}
              {column.filterable && (
                <input
                  type="text"
                  placeholder={t('filter', 'Filtrar')}
                  className="mt-1 w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-ocean focus:outline-none"
                  onChange={(e) => handleFilter(String(column.key), e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  };

  const renderRow = (record: T, index: number) => {
    const key = getRowKey(record, index);
    const isSelected = selectable?.selectedRowKeys.includes(key);
    const isExpanded = expandedRows.has(key);
    const rowProps = onRow?.(record, index);

    return (
      <React.Fragment key={key}>
        <tr
          className={cn(
            'border-b border-gray-100 hover:bg-gray-50 transition-colors',
            isSelected && 'bg-primary-ocean/5',
            rowProps?.className
          )}
          onClick={rowProps?.onClick}
          onDoubleClick={rowProps?.onDoubleClick}
        >
          {/* Selection cell */}
          {selectable && (
            <td className={cellPaddingClasses[size]}>
              <input
                type={selectable.type}
                checked={isSelected}
                onChange={(e) => {
                  const newSelectedKeys = e.target.checked
                    ? [...selectable.selectedRowKeys, key]
                    : selectable.selectedRowKeys.filter(k => k !== key);
                  
                  const newSelectedRows = data.filter((r, i) => 
                    newSelectedKeys.includes(getRowKey(r, i))
                  );
                  
                  selectable.onChange(newSelectedKeys, newSelectedRows);
                }}
                disabled={selectable.getCheckboxProps?.(record)?.disabled}
                className="w-4 h-4 text-primary-ocean border-gray-300 rounded focus:ring-primary-ocean"
              />
            </td>
          )}

          {/* Expand cell */}
          {expandable && (
            <td className={cellPaddingClasses[size]}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExpand(record);
                }}
                className="text-gray-500 hover:text-primary-ocean transition-colors"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            </td>
          )}

          {/* Data cells */}
          {columns.map((column) => {
            const value = record[column.key];
            const cellContent = column.render ? column.render(value, record, index) : value;

            return (
              <td
                key={String(column.key)}
                className={cn(
                  cellPaddingClasses[size],
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right'
                )}
              >
                {cellContent}
              </td>
            );
          })}
        </tr>

        {/* Expanded row */}
        {expandable && isExpanded && (
          <tr>
            <td 
              colSpan={columns.length + (selectable ? 1 : 0) + 1}
              className="p-0 bg-gray-50"
            >
              <div className="p-4">
                {expandable.expandedRowRender(record, index)}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  const renderEmpty = () => (
    <tr>
      <td 
        colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}
        className="text-center py-12 text-gray-500"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">📦</span>
          <p>{emptyText || t('no_data', 'No hay datos disponibles')}</p>
        </div>
      </td>
    </tr>
  );

  const renderPagination = () => {
    if (!pagination) return null;

    const { current, pageSize, total, onChange } = pagination;
    const totalPages = Math.ceil(total / pageSize);
    const startItem = (current - 1) * pageSize + 1;
    const endItem = Math.min(current * pageSize, total);

    return (
      <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-700">
          {t('showing_items', 'Mostrando')} {startItem} - {endItem} {t('of', 'de')} {total} {t('items', 'elementos')}
        </div>
        
        <ButtonGroup>
          <CaribbeanButton
            variant="ghost"
            hierarchy="tertiary"
            size="sm"
            disabled={current === 1}
            onClick={() => onChange(current - 1, pageSize)}
          >
            {t('previous', 'Anterior')}
          </CaribbeanButton>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = current <= 3 ? i + 1 : current - 2 + i;
            if (page > totalPages) return null;
            
            return (
              <CaribbeanButton
                key={page}
                variant={page === current ? 'primary' : 'ghost'}
                hierarchy={page === current ? 'primary' : 'tertiary'}
                size="sm"
                onClick={() => onChange(page, pageSize)}
              >
                {page}
              </CaribbeanButton>
            );
          })}
          
          <CaribbeanButton
            variant="ghost"
            hierarchy="tertiary"
            size="sm"
            disabled={current === totalPages}
            onClick={() => onChange(current + 1, pageSize)}
          >
            {t('next', 'Siguiente')}
          </CaribbeanButton>
        </ButtonGroup>
      </div>
    );
  };

  return (
    <EnhancedCard variant="default" className="overflow-hidden">
      <div className="relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary-ocean border-t-transparent rounded-full animate-spin" />
              <span className="text-primary-ocean font-medium">
                {t('loading', 'Cargando')}...
              </span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto" style={{ maxHeight: scroll?.y }}>
          <table className={tableClasses} style={{ minWidth: scroll?.x }}>
            {renderHeader()}
            <tbody>
              {filteredData.length > 0 ? filteredData.map(renderRow) : renderEmpty()}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </EnhancedCard>
  );
}

export default CaribbeanTable;
