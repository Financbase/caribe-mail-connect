import React from 'react'
import { VirtualizedList } from '@/components/lists/VirtualizedList'

export interface VirtualizedTableColumn<T> {
  id: string
  header: React.ReactNode
  width?: string | number
  cell: (row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
}

interface VirtualizedTableProps<T> {
  columns: VirtualizedTableColumn<T>[]
  rows: T[]
  rowHeight: number
  ariaLabel?: string
  empty?: React.ReactNode
}

export function VirtualizedTable<T>({ columns, rows, rowHeight, ariaLabel, empty }: VirtualizedTableProps<T>) {
  if (rows.length === 0) return <>{empty}</>

  return (
    <div
      className="border rounded-lg overflow-hidden"
      role="table"
      aria-label={ariaLabel}
      style={{
        // expose grid template as CSS var consumed by children to avoid inline on multiple nodes
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ['--vt-columns' as any]: columns.map(c => c.width ?? '1fr').join(' '),
      }}
    >
      <div className="grid w-full px-4 py-2 bg-muted/40 text-xs font-medium" role="row" data-vt-header>
        {columns.map(col => (
          <div key={col.id} role="columnheader" className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}>
            {col.header}
          </div>
        ))}
      </div>
      <VirtualizedList
        items={rows}
        itemHeight={rowHeight}
        ariaLabel={ariaLabel}
        renderItem={(row) => (
          <div
            className="grid w-full px-4 py-3 border-t"
            role="row"
            data-vt-row
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' && e.key !== ' ') return
              const clickable = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('[data-focusable="true"],a,button')
              clickable?.click()
              e.preventDefault()
            }}
          >
            {columns.map(col => (
              <div key={col.id} role="cell" className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}>
                {col.cell(row)}
              </div>
            ))}
          </div>
        )}
      />
    </div>
  )
}

export default VirtualizedTable


