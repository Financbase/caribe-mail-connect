export const SIDEBAR_COOKIE_NAME = "sidebar:state";
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
export const SIDEBAR_WIDTH_ICON = "3rem";
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";

export const sidebarVariants = {
  default: 'w-64',
  sm: 'w-56',
  md: 'w-72',
  lg: 'w-80',
} as const;

export type SidebarVariant = keyof typeof sidebarVariants;
