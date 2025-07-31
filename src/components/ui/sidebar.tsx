import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  SIDEBAR_COOKIE_NAME, 
  SIDEBAR_KEYBOARD_SHORTCUT,
  SidebarVariant,
  sidebarVariants
} from "./sidebar-constants"
import { SidebarContext, useSidebar } from "./sidebar-context"

export function SidebarProvider({
  children,
  defaultOpen = true,
  ...props
}: {
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])
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

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }} {...props}>
      {children}
    </SidebarContext.Provider>
  )
}


export function Sidebar({
  className,
  variant = "default",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: SidebarVariant }) {
  const { isOpen } = useSidebar()
  
  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300",
        isOpen ? sidebarVariants[variant] : "w-16",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-16 items-center px-4 border-b", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border-t", className)} {...props}>
      {children}
    </div>
  )
}

export function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggle } = useSidebar()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 p-0", className)}
      onClick={(e) => {
        onClick?.(e)
        toggle()
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}

export function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return <Separator className={cn("my-1", className)} {...props} />
}
