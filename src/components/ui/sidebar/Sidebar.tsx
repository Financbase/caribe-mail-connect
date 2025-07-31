import * as React from "react"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { sidebarVariants } from "./sidebar-constants"
import { useSidebar } from "./useSidebar"
import { SidebarProps } from "./types"

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const { isOpen } = useSidebar()
  
  return (
    <div
      className={cn(
        "flex flex-col h-full border-r bg-background transition-all duration-300",
        isOpen ? sidebarVariants[variant] : "w-16",
        className
      )}
      {...props}
    />
  )
}

const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex h-16 items-center px-4 border-b", className)}
    {...props}
  />
)

const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex-1 overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
)

const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn("p-4 border-t", className)} {...props} />

const SidebarTrigger: React.FC<React.ComponentProps<typeof Button>> = ({
  className,
  onClick,
  ...props
}) => {
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

const SidebarSeparator: React.FC<React.ComponentProps<typeof Separator>> = ({
  className,
  ...props
}) => <Separator className={cn("my-1", className)} {...props} />

export {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
}
