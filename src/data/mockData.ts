import { NotificationPreferences } from '@/types/notifications';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  mailboxNumber: string;
  activePackages: number;
  address: string;
  createdAt: string;
  notificationPreferences: NotificationPreferences;
}

export interface Package {
  id: string;
  trackingNumber: string;
  carrier: 'UPS' | 'FedEx' | 'USPS' | 'DHL' | 'Other';
  customerId: string;
  customerName: string;
  size: 'Small' | 'Medium' | 'Large';
  status: 'Received' | 'Ready' | 'Delivered' | 'Pending';
  specialHandling: boolean;
  receivedAt: string;
  deliveredAt?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
  location: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'María González Rodríguez',
    email: 'maria.gonzalez@email.com',
    phone: '(787) 555-0123',
    mailboxNumber: 'MB001',
    activePackages: 3,
    address: 'Calle Luna 123, San Juan, PR 00901',
    createdAt: '2024-01-15',
    notificationPreferences: {
      sms: true,
      email: true,
      whatsapp: false,
      language: 'es'
    }
  },
  {
    id: '2',
    name: 'Carlos Rivera Santos',
    email: 'carlos.rivera@email.com',
    phone: '(787) 555-0234',
    mailboxNumber: 'MB002',
    activePackages: 1,
    address: 'Ave. Ponce de León 456, Santurce, PR 00907',
    createdAt: '2024-01-20',
    notificationPreferences: {
      sms: false,
      email: true,
      whatsapp: true,
      language: 'en'
    }
  },
  {
    id: '3',
    name: 'Ana Lucia Vega Morales',
    email: 'ana.vega@email.com',
    phone: '(787) 555-0345',
    mailboxNumber: 'MB003',
    activePackages: 2,
    address: 'Calle Fortaleza 789, Old San Juan, PR 00901',
    createdAt: '2024-02-01',
    notificationPreferences: {
      sms: true,
      email: false,
      whatsapp: true,
      language: 'es'
    }
  },
  {
    id: '4',
    name: 'José Manuel Díaz Cruz',
    email: 'jose.diaz@email.com',
    phone: '(787) 555-0456',
    mailboxNumber: 'MB004',
    activePackages: 0,
    address: 'Ave. Ashford 321, Condado, PR 00907',
    createdAt: '2024-02-10',
    notificationPreferences: {
      sms: true,
      email: true,
      whatsapp: false,
      language: 'en'
    }
  },
  {
    id: '5',
    name: 'Carmen Elena Ruiz Ortega',
    email: 'carmen.ruiz@email.com',
    phone: '(787) 555-0567',
    mailboxNumber: 'MB005',
    activePackages: 4,
    address: 'Calle Loíza 654, Santurce, PR 00911',
    createdAt: '2024-02-15',
    notificationPreferences: {
      sms: false,
      email: true,
      whatsapp: true,
      language: 'es'
    }
  },
  {
    id: '6',
    name: 'Roberto Pérez Jiménez',
    email: 'roberto.perez@email.com',
    phone: '(787) 555-0678',
    mailboxNumber: 'MB006',
    activePackages: 1,
    address: 'Ave. José de Diego 147, Río Piedras, PR 00925',
    createdAt: '2024-02-20',
    notificationPreferences: {
      sms: true,
      email: false,
      whatsapp: false,
      language: 'en'
    }
  },
  {
    id: '7',
    name: 'Isabel Martínez Torres',
    email: 'isabel.martinez@email.com',
    phone: '(787) 555-0789',
    mailboxNumber: 'MB007',
    activePackages: 2,
    address: 'Calle César González 258, Hato Rey, PR 00917',
    createdAt: '2024-03-01',
    notificationPreferences: {
      sms: true,
      email: true,
      whatsapp: true,
      language: 'es'
    }
  },
  {
    id: '8',
    name: 'Fernando López Hernández',
    email: 'fernando.lopez@email.com',
    phone: '(787) 555-0890',
    mailboxNumber: 'MB008',
    activePackages: 0,
    address: 'Ave. Muñoz Rivera 369, Puerta de Tierra, PR 00901',
    createdAt: '2024-03-05',
    notificationPreferences: {
      sms: false,
      email: true,
      whatsapp: false,
      language: 'en'
    }
  },
  {
    id: '9',
    name: 'Sofía Ramírez Medina',
    email: 'sofia.ramirez@email.com',
    phone: '(787) 555-0901',
    mailboxNumber: 'MB009',
    activePackages: 3,
    address: 'Calle San Francisco 741, Old San Juan, PR 00901',
    createdAt: '2024-03-10',
    notificationPreferences: {
      sms: true,
      email: false,
      whatsapp: true,
      language: 'es'
    }
  },
  {
    id: '10',
    name: 'David Santiago Vargas',
    email: 'david.santiago@email.com',
    phone: '(787) 555-1012',
    mailboxNumber: 'MB010',
    activePackages: 1,
    address: 'Ave. Roosevelt 852, Hato Rey, PR 00918',
    createdAt: '2024-03-15',
    notificationPreferences: {
      sms: false,
      email: true,
      whatsapp: true,
      language: 'en'
    }
  }
];

export const mockPackages: Package[] = [
  {
    id: 'PKG001',
    trackingNumber: '1Z999AA1234567890',
    carrier: 'UPS',
    customerId: '1',
    customerName: 'María González Rodríguez',
    size: 'Medium',
    status: 'Received',
    specialHandling: false,
    receivedAt: '2024-07-24T09:30:00Z'
  },
  {
    id: 'PKG002',
    trackingNumber: '7749912345678901',
    carrier: 'FedEx',
    customerId: '1',
    customerName: 'María González Rodríguez',
    size: 'Small',
    status: 'Ready',
    specialHandling: true,
    receivedAt: '2024-07-23T14:15:00Z'
  },
  {
    id: 'PKG003',
    trackingNumber: '9400111202555555551',
    carrier: 'USPS',
    customerId: '2',
    customerName: 'Carlos Rivera Santos',
    size: 'Large',
    status: 'Delivered',
    specialHandling: false,
    receivedAt: '2024-07-22T11:00:00Z',
    deliveredAt: '2024-07-23T16:30:00Z'
  },
  {
    id: 'PKG004',
    trackingNumber: '1234567890123456',
    carrier: 'DHL',
    customerId: '3',
    customerName: 'Ana Lucia Vega Morales',
    size: 'Small',
    status: 'Received',
    specialHandling: false,
    receivedAt: '2024-07-24T08:45:00Z'
  },
  {
    id: 'PKG005',
    trackingNumber: '1Z999BB7654321098',
    carrier: 'UPS',
    customerId: '5',
    customerName: 'Carmen Elena Ruiz Ortega',
    size: 'Medium',
    status: 'Ready',
    specialHandling: true,
    receivedAt: '2024-07-23T13:20:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: 'USR001',
    name: 'Admin Usuario',
    email: 'admin@prmcms.com',
    role: 'Admin',
    location: 'San Juan Central'
  },
  {
    id: 'USR002',
    name: 'Empleado Uno',
    email: 'empleado1@prmcms.com',
    role: 'Employee',
    location: 'San Juan Central'
  },
  {
    id: 'USR003',
    name: 'Empleado Dos',
    email: 'empleado2@prmcms.com',
    role: 'Employee',
    location: 'Bayamón'
  },
  {
    id: 'USR004',
    name: 'Empleado Tres',
    email: 'empleado3@prmcms.com',
    role: 'Employee',
    location: 'Ponce'
  },
  {
    id: 'USR005',
    name: 'Empleado Cuatro',
    email: 'empleado4@prmcms.com',
    role: 'Employee',
    location: 'Arecibo'
  }
];

// Helper functions
export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(customer => customer.id === id);
};

export const getPackagesByCustomerId = (customerId: string): Package[] => {
  return mockPackages.filter(pkg => pkg.customerId === customerId);
};

export const getTodayStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const todayPackages = mockPackages.filter(pkg => 
    pkg.receivedAt.startsWith(today)
  );
  
  return {
    packagesReceived: todayPackages.length,
    pendingDeliveries: mockPackages.filter(pkg => 
      pkg.status === 'Ready' || pkg.status === 'Received'
    ).length,
    totalCustomers: mockCustomers.length
  };
};