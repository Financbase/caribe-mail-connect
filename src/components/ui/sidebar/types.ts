export interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

export interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof import('./sidebar-constants').sidebarVariants
}
