import * as React from "react"
import { SidebarContextType } from "./types"

export const SidebarContext = React.createContext<SidebarContextType | null>(null)

export function useSidebarContext() {
  const context = React.useContext(SidebarContext)
  if (context === null) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}
