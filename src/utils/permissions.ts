export type Permission = 
  | 'admin'
  | 'staff'
  | 'customer'
  | 'package.create'
  | 'package.read'
  | 'package.update'
  | 'package.delete'
  | 'customer.create'
  | 'customer.read'
  | 'customer.update'
  | 'customer.delete'
  | 'reports.view'
  | 'analytics.view'
  | 'settings.manage';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  permissions?: Permission[];
}

// Basic permission checker
export function checkPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check specific role permissions
  switch (permission) {
    case 'admin':
      return user.role === 'admin';
    case 'staff':
      return user.role === 'admin' || user.role === 'staff';
    case 'customer':
      return true; // All authenticated users can access customer features
    case 'package.create':
    case 'package.update':
    case 'package.delete':
      return user.role === 'admin' || user.role === 'staff';
    case 'package.read':
      return true; // All authenticated users can view their packages
    case 'customer.create':
    case 'customer.update':
    case 'customer.delete':
      return user.role === 'admin' || user.role === 'staff';
    case 'customer.read':
      return true; // All authenticated users can view customer info
    case 'reports.view':
    case 'analytics.view':
      return user.role === 'admin' || user.role === 'staff';
    case 'settings.manage':
      return user.role === 'admin';
    default:
      return false;
  }
}

// Check if user has any of the given permissions
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  return permissions.some(permission => checkPermission(user, permission));
}

// Check if user has all of the given permissions
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  return permissions.every(permission => checkPermission(user, permission));
}
