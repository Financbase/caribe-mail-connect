import React, { useRef, useState, useCallback, useLayoutEffect } from 'react'

type VirtualizedListProps<T> = {
  items: T[]
  itemHeight: number
  overscan?: number
  renderItem: (item: T, index: number) => React.ReactNode
  ariaLabel?: string
  ariaDescribedById?: string
  tabIndex?: number
}

export function VirtualizedList<T>({ items, itemHeight, overscan = 6, renderItem, ariaLabel, ariaDescribedById, tabIndex = 0 }: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [height, setHeight] = useState(0)

  const onScroll = useCallback(() => {
    if (containerRef.current) setScrollTop(containerRef.current.scrollTop)
  }, [])

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setHeight(el.clientHeight))
    observer.observe(el)
    setHeight(el.clientHeight)
    return () => observer.disconnect()
  }, [])

  const total = items.length
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2
  const endIndex = Math.min(total - 1, startIndex + visibleCount)

  const offsetY = startIndex * itemHeight
  const visibleItems = items.slice(startIndex, endIndex + 1)

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{ overflow: 'auto', willChange: 'transform' }}
      role="list"
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedById}
      tabIndex={tabIndex}
      onKeyDown={(e) => {
        if (!containerRef.current) return
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End' && e.key !== 'PageDown' && e.key !== 'PageUp') return
        const items = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[role="listitem"]'))
        const active = document.activeElement as HTMLElement | null
        const index = items.findIndex((el) => el.contains(active || ({} as HTMLElement)))
        const delta = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : e.key === 'Home' ? -Infinity : e.key === 'End' ? Infinity : e.key === 'PageDown' ? Math.max(1, Math.floor(height / itemHeight) - 1) : -(Math.max(1, Math.floor(height / itemHeight) - 1))
        let nextIndex = index
        if (delta === -Infinity) nextIndex = 0
        else if (delta === Infinity) nextIndex = items.length - 1
        else nextIndex = Math.min(items.length - 1, Math.max(0, index + delta))
        const next = items[nextIndex]
        next?.querySelector<HTMLElement>('[data-focusable="true"],button,a,input,select,textarea,[tabindex]')?.focus() || next?.focus()
        e.preventDefault()
      }}
    >
      <div style={{ height: total * itemHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} role="listitem" style={{ height: itemHeight }} tabIndex={-1}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VirtualizedList


