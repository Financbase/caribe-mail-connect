import { useState, useEffect } from 'react';

interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'image' | 'document' | 'video' | 'template';
  category: 'primary' | 'secondary' | 'marketing' | 'operational' | 'compliance';
  file_url: string;
  file_size: number;
  file_type: string;
  description: string;
  usage_guidelines: string;
  approved_for: string[];
  version: string;
  created_at: string;
  updated_at: string;
  downloads: number;
  is_required: boolean;
}

interface MarketingTemplate {
  id: string;
  name: string;
  category: 'social_media' | 'print' | 'digital' | 'email' | 'presentation';
  description: string;
  preview_url: string;
  file_url: string;
  file_size: number;
  customization_guide: string;
  brand_guidelines: string[];
  usage_restrictions: string[];
  created_at: string;
  downloads: number;
  rating: number;
  is_featured: boolean;
}

interface ApprovedVendor {
  id: string;
  name: string;
  category: 'printing' | 'signage' | 'promotional' | 'technology' | 'services';
  contact_person: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  approved_services: string[];
  pricing_tier: 'premium' | 'standard' | 'budget';
  quality_rating: number;
  response_time: string;
  payment_terms: string;
  contract_expiry: string;
  status: 'active' | 'pending' | 'suspended';
  notes: string;
}

interface PricingGuideline {
  id: string;
  service_name: string;
  category: 'mail_services' | 'package_handling' | 'storage' | 'additional_services';
  base_price: number;
  price_unit: 'per_item' | 'per_day' | 'per_month' | 'flat_rate';
  min_price: number;
  max_price: number;
  discount_tiers: {
    quantity: number;
    discount_percentage: number;
  }[];
  regional_variations: {
    region: string;
    multiplier: number;
  }[];
  seasonal_adjustments: {
    period: string;
    adjustment_percentage: number;
  }[];
  effective_date: string;
  expiry_date?: string;
  notes: string;
}

interface QualityStandard {
  id: string;
  name: string;
  category: 'operational' | 'customer_service' | 'compliance' | 'brand' | 'safety';
  description: string;
  requirements: string[];
  measurement_criteria: string[];
  target_score: number;
  current_score: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  responsible_party: string;
  last_assessment: string;
  next_assessment: string;
  status: 'compliant' | 'needs_improvement' | 'non_compliant';
  corrective_actions: string[];
}

// Mock brand assets
const mockBrandAssets: BrandAsset[] = [
  {
    id: '1',
    name: 'Logo PRMCMS Principal',
    type: 'logo',
    category: 'primary',
    file_url: '/assets/logo-primary.svg',
    file_size: 24576,
    file_type: 'SVG',
    description: 'Logo principal de PRMCMS en formato vectorial para uso en todos los medios.',
    usage_guidelines: 'Usar en fondos claros. Mantener proporciones originales. Mínimo 50px de altura.',
    approved_for: ['web', 'print', 'digital', 'signage'],
    version: '2.1',
    created_at: '2023-01-15',
    updated_at: '2024-01-10',
    downloads: 156,
    is_required: true
  },
  {
    id: '2',
    name: 'Logo PRMCMS Blanco',
    type: 'logo',
    category: 'primary',
    file_url: '/assets/logo-white.svg',
    file_size: 18944,
    file_type: 'SVG',
    description: 'Versión en blanco del logo para fondos oscuros.',
    usage_guidelines: 'Usar solo en fondos oscuros. Mantener contraste mínimo 4.5:1.',
    approved_for: ['web', 'print', 'digital', 'signage'],
    version: '2.1',
    created_at: '2023-01-15',
    updated_at: '2024-01-10',
    downloads: 89,
    is_required: true
  },
  {
    id: '3',
    name: 'Manual de Marca PRMCMS',
    type: 'document',
    category: 'compliance',
    file_url: '/assets/brand-manual.pdf',
    file_size: 5242880,
    file_type: 'PDF',
    description: 'Manual completo de marca con todas las directrices y estándares.',
    usage_guidelines: 'Documento de referencia obligatorio para todos los franquiciados.',
    approved_for: ['internal', 'franchise'],
    version: '3.0',
    created_at: '2023-03-20',
    updated_at: '2024-01-15',
    downloads: 234,
    is_required: true
  },
  {
    id: '4',
    name: 'Imágenes de Stock - Servicios Postales',
    type: 'image',
    category: 'marketing',
    file_url: '/assets/postal-services.zip',
    file_size: 15728640,
    file_type: 'ZIP',
    description: 'Colección de imágenes profesionales para marketing de servicios postales.',
    usage_guidelines: 'Usar solo para campañas aprobadas. No modificar sin autorización.',
    approved_for: ['marketing', 'web', 'print'],
    version: '1.5',
    created_at: '2023-06-10',
    updated_at: '2024-01-08',
    downloads: 67,
    is_required: false
  },
  {
    id: '5',
    name: 'Video Corporativo PRMCMS',
    type: 'video',
    category: 'marketing',
    file_url: '/assets/corporate-video.mp4',
    file_size: 52428800,
    file_type: 'MP4',
    description: 'Video corporativo oficial de PRMCMS para presentaciones y eventos.',
    usage_guidelines: 'Usar en eventos corporativos y presentaciones a clientes.',
    approved_for: ['events', 'presentations', 'web'],
    version: '2.0',
    created_at: '2023-08-15',
    updated_at: '2024-01-12',
    downloads: 45,
    is_required: false
  }
];

// Mock marketing templates
const mockMarketingTemplates: MarketingTemplate[] = [
  {
    id: '1',
    name: 'Post Redes Sociales - Servicios Premium',
    category: 'social_media',
    description: 'Plantilla para anunciar servicios premium en redes sociales.',
    preview_url: '/templates/social-premium-preview.jpg',
    file_url: '/templates/social-premium.psd',
    file_size: 2097152,
    customization_guide: 'Cambiar texto, colores según paleta de marca, agregar logo.',
    brand_guidelines: ['Usar colores oficiales', 'Incluir logo en esquina inferior derecha', 'Mantener tipografía Inter'],
    usage_restrictions: ['No modificar proporciones', 'No usar fuentes no autorizadas'],
    created_at: '2024-01-10',
    downloads: 89,
    rating: 4.8,
    is_featured: true
  },
  {
    id: '2',
    name: 'Folleto Impreso - Servicios Básicos',
    category: 'print',
    description: 'Folleto para distribución física con servicios básicos.',
    preview_url: '/templates/print-basic-preview.jpg',
    file_url: '/templates/print-basic.indd',
    file_size: 3145728,
    customization_guide: 'Actualizar precios, información de contacto, agregar fotos locales.',
    brand_guidelines: ['Usar papel de 100g', 'Impresión a color', 'Doble cara'],
    usage_restrictions: ['Mínimo 100 copias', 'Solo impresores aprobados'],
    created_at: '2024-01-08',
    downloads: 67,
    rating: 4.6,
    is_featured: false
  },
  {
    id: '3',
    name: 'Email Marketing - Newsletter Mensual',
    category: 'email',
    description: 'Plantilla de newsletter mensual para clientes.',
    preview_url: '/templates/email-newsletter-preview.jpg',
    file_url: '/templates/email-newsletter.html',
    file_size: 1048576,
    customization_guide: 'Actualizar contenido mensual, agregar enlaces, personalizar saludo.',
    brand_guidelines: ['Usar colores oficiales', 'Incluir logo', 'Mantener estructura responsive'],
    usage_restrictions: ['No modificar estructura HTML', 'Testear en múltiples clientes de email'],
    created_at: '2024-01-05',
    downloads: 123,
    rating: 4.9,
    is_featured: true
  }
];

// Mock approved vendors
const mockApprovedVendors: ApprovedVendor[] = [
  {
    id: '1',
    name: 'Impresiones Pro Puerto Rico',
    category: 'printing',
    contact_person: 'Ana Rodríguez',
    email: 'ana@impresionespropr.com',
    phone: '(787) 555-0123',
    website: 'www.impresionespropr.com',
    address: 'Calle Comercio #456, San Juan, PR',
    approved_services: ['Folletería', 'Tarjetas de presentación', 'Banners', 'Señalización'],
    pricing_tier: 'premium',
    quality_rating: 4.8,
    response_time: '24-48 horas',
    payment_terms: 'Net 30',
    contract_expiry: '2024-12-31',
    status: 'active',
    notes: 'Proveedor preferido para materiales de alta calidad.'
  },
  {
    id: '2',
    name: 'Señales Express',
    category: 'signage',
    contact_person: 'Carlos Méndez',
    email: 'carlos@senalesexpress.com',
    phone: '(787) 555-0456',
    website: 'www.senalesexpress.com',
    address: 'Ave. Industrial #789, Bayamón, PR',
    approved_services: ['Letreros exteriores', 'Señales internas', 'Vinilos', 'Lonas'],
    pricing_tier: 'standard',
    quality_rating: 4.5,
    response_time: '3-5 días',
    payment_terms: 'Net 15',
    contract_expiry: '2024-10-31',
    status: 'active',
    notes: 'Buen balance entre calidad y precio.'
  },
  {
    id: '3',
    name: 'Promocionales Caribe',
    category: 'promotional',
    contact_person: 'María Vega',
    email: 'maria@promocaribe.com',
    phone: '(787) 555-0789',
    website: 'www.promocaribe.com',
    address: 'Calle Marina #321, Ponce, PR',
    approved_services: ['Tazas', 'Camisetas', 'Llaveros', 'Material de escritorio'],
    pricing_tier: 'budget',
    quality_rating: 4.2,
    response_time: '5-7 días',
    payment_terms: 'Net 30',
    contract_expiry: '2024-08-31',
    status: 'active',
    notes: 'Ideal para promociones de bajo presupuesto.'
  }
];

// Mock pricing guidelines
const mockPricingGuidelines: PricingGuideline[] = [
  {
    id: '1',
    service_name: 'Apartado Postal Básico',
    category: 'mail_services',
    base_price: 25.00,
    price_unit: 'per_month',
    min_price: 20.00,
    max_price: 35.00,
    discount_tiers: [
      { quantity: 6, discount_percentage: 10 },
      { quantity: 12, discount_percentage: 20 }
    ],
    regional_variations: [
      { region: 'San Juan', multiplier: 1.2 },
      { region: 'Bayamón', multiplier: 1.1 },
      { region: 'Ponce', multiplier: 0.9 }
    ],
    seasonal_adjustments: [
      { period: 'Diciembre-Enero', adjustment_percentage: 5 }
    ],
    effective_date: '2024-01-01',
    notes: 'Precio base para apartado postal estándar.'
  },
  {
    id: '2',
    service_name: 'Manejo de Paquetes',
    category: 'package_handling',
    base_price: 5.00,
    price_unit: 'per_item',
    min_price: 3.00,
    max_price: 15.00,
    discount_tiers: [
      { quantity: 10, discount_percentage: 15 },
      { quantity: 25, discount_percentage: 25 }
    ],
    regional_variations: [
      { region: 'San Juan', multiplier: 1.1 },
      { region: 'Areas Rurales', multiplier: 0.8 }
    ],
    seasonal_adjustments: [],
    effective_date: '2024-01-01',
    notes: 'Tarifa por manejo y almacenamiento de paquetes.'
  },
  {
    id: '3',
    service_name: 'Almacenamiento Extendido',
    category: 'storage',
    base_price: 2.50,
    price_unit: 'per_day',
    min_price: 2.00,
    max_price: 5.00,
    discount_tiers: [
      { quantity: 30, discount_percentage: 20 },
      { quantity: 90, discount_percentage: 40 }
    ],
    regional_variations: [
      { region: 'San Juan', multiplier: 1.3 },
      { region: 'Ponce', multiplier: 1.0 },
      { region: 'Mayagüez', multiplier: 0.9 }
    ],
    seasonal_adjustments: [
      { period: 'Temporada Alta', adjustment_percentage: 10 }
    ],
    effective_date: '2024-01-01',
    notes: 'Tarifa diaria para almacenamiento de paquetes por más de 30 días.'
  }
];

// Mock quality standards
const mockQualityStandards: QualityStandard[] = [
  {
    id: '1',
    name: 'Estándar de Atención al Cliente',
    category: 'customer_service',
    description: 'Estándares mínimos de atención y servicio al cliente en todas las locaciones.',
    requirements: [
      'Saludo cordial al cliente',
      'Tiempo de respuesta máximo 2 minutos',
      'Resolución de consultas en primera instancia',
      'Seguimiento de casos complejos'
    ],
    measurement_criteria: [
      'Encuestas de satisfacción',
      'Tiempo de espera promedio',
      'Tasa de resolución en primera visita',
      'Reclamos por mal servicio'
    ],
    target_score: 90,
    current_score: 87,
    frequency: 'monthly',
    responsible_party: 'Gerente de Locación',
    last_assessment: '2024-01-15',
    next_assessment: '2024-02-15',
    status: 'needs_improvement',
    corrective_actions: [
      'Capacitación adicional en servicio al cliente',
      'Implementación de sistema de feedback en tiempo real',
      'Revisión de procesos de atención'
    ]
  },
  {
    id: '2',
    name: 'Estándar de Cumplimiento CMRA',
    category: 'compliance',
    description: 'Cumplimiento con regulaciones CMRA y documentación requerida.',
    requirements: [
      'Documentación completa de clientes',
      'Verificación de identidad',
      'Registro de entregas',
      'Mantenimiento de archivos por 2 años'
    ],
    measurement_criteria: [
      'Auditorías internas',
      'Inspecciones regulatorias',
      'Completitud de documentación',
      'Sanciones o multas'
    ],
    target_score: 100,
    current_score: 96,
    frequency: 'quarterly',
    responsible_party: 'Oficial de Cumplimiento',
    last_assessment: '2024-01-01',
    next_assessment: '2024-04-01',
    status: 'compliant',
    corrective_actions: []
  },
  {
    id: '3',
    name: 'Estándar de Seguridad Operacional',
    category: 'safety',
    description: 'Estándares de seguridad para operaciones diarias y manejo de paquetes.',
    requirements: [
      'Equipo de protección personal',
      'Procedimientos de manejo seguro',
      'Inspecciones de seguridad diarias',
      'Capacitación en seguridad'
    ],
    measurement_criteria: [
      'Incidentes de seguridad',
      'Cumplimiento de PPE',
      'Inspecciones completadas',
      'Capacitación del personal'
    ],
    target_score: 95,
    current_score: 92,
    frequency: 'weekly',
    responsible_party: 'Supervisor de Seguridad',
    last_assessment: '2024-01-20',
    next_assessment: '2024-01-27',
    status: 'needs_improvement',
    corrective_actions: [
      'Refuerzo de capacitación en seguridad',
      'Actualización de equipos de protección',
      'Revisión de procedimientos de manejo'
    ]
  }
];

export function useBrandManagement() {
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([]);
  const [marketingTemplates, setMarketingTemplates] = useState<MarketingTemplate[]>([]);
  const [approvedVendors, setApprovedVendors] = useState<ApprovedVendor[]>([]);
  const [pricingGuidelines, setPricingGuidelines] = useState<PricingGuideline[]>([]);
  const [qualityStandards, setQualityStandards] = useState<QualityStandard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBrandAssets(mockBrandAssets);
        setMarketingTemplates(mockMarketingTemplates);
        setApprovedVendors(mockApprovedVendors);
        setPricingGuidelines(mockPricingGuidelines);
        setQualityStandards(mockQualityStandards);
      } catch (error) {
        console.error('Error fetching brand data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, []);

  const addBrandAsset = async (asset: Omit<BrandAsset, 'id' | 'created_at' | 'updated_at' | 'downloads'>) => {
    const newAsset: BrandAsset = {
      ...asset,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      downloads: 0
    };
    setBrandAssets(prev => [...prev, newAsset]);
  };

  const updateBrandAsset = async (id: string, updates: Partial<BrandAsset>) => {
    setBrandAssets(prev => 
      prev.map(asset => 
        asset.id === id 
          ? { ...asset, ...updates, updated_at: new Date().toISOString() }
          : asset
      )
    );
  };

  const addApprovedVendor = async (vendor: Omit<ApprovedVendor, 'id'>) => {
    const newVendor: ApprovedVendor = {
      ...vendor,
      id: Date.now().toString()
    };
    setApprovedVendors(prev => [...prev, newVendor]);
  };

  const updatePricingGuideline = async (id: string, updates: Partial<PricingGuideline>) => {
    setPricingGuidelines(prev => 
      prev.map(guideline => 
        guideline.id === id ? { ...guideline, ...updates } : guideline
      )
    );
  };

  const updateQualityStandard = async (id: string, updates: Partial<QualityStandard>) => {
    setQualityStandards(prev => 
      prev.map(standard => 
        standard.id === id ? { ...standard, ...updates } : standard
      )
    );
  };

  const getAssetsByType = (type: BrandAsset['type']) => {
    return brandAssets.filter(asset => asset.type === type);
  };

  const getAssetsByCategory = (category: BrandAsset['category']) => {
    return brandAssets.filter(asset => asset.category === category);
  };

  const getRequiredAssets = () => {
    return brandAssets.filter(asset => asset.is_required);
  };

  const getTemplatesByCategory = (category: MarketingTemplate['category']) => {
    return marketingTemplates.filter(template => template.category === category);
  };

  const getFeaturedTemplates = () => {
    return marketingTemplates.filter(template => template.is_featured);
  };

  const getVendorsByCategory = (category: ApprovedVendor['category']) => {
    return approvedVendors.filter(vendor => vendor.category === category);
  };

  const getActiveVendors = () => {
    return approvedVendors.filter(vendor => vendor.status === 'active');
  };

  const getPricingByCategory = (category: PricingGuideline['category']) => {
    return pricingGuidelines.filter(guideline => guideline.category === category);
  };

  const getCompliantStandards = () => {
    return qualityStandards.filter(standard => standard.status === 'compliant');
  };

  const getStandardsNeedingImprovement = () => {
    return qualityStandards.filter(standard => standard.status === 'needs_improvement');
  };

  return {
    brandAssets,
    marketingTemplates,
    approvedVendors,
    pricingGuidelines,
    qualityStandards,
    loading,
    addBrandAsset,
    updateBrandAsset,
    addApprovedVendor,
    updatePricingGuideline,
    updateQualityStandard,
    getAssetsByType,
    getAssetsByCategory,
    getRequiredAssets,
    getTemplatesByCategory,
    getFeaturedTemplates,
    getVendorsByCategory,
    getActiveVendors,
    getPricingByCategory,
    getCompliantStandards,
    getStandardsNeedingImprovement
  };
} 