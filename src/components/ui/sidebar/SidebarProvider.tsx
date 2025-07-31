import * as React from "react"
import { SIDEBAR_KEYBOARD_SHORTCUT } from "./sidebar-constants"
import { SidebarProviderProps } from "./types"
import { SidebarContext } from "./context"

export function SidebarProvider({
  children,
  defaultOpen = true,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const toggle = React.useCallback(() => setIsOpen(prev => !prev), [])
  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggle])

  const value = React.useMemo(
    () => ({
      isOpen,
      toggle,
      open,
      close,
    }),
    [isOpen, toggle, open, close]
  )

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
