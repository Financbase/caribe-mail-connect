import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, 
  FileText, 
  Image, 
  Video,
  Download, 
  Upload, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Star,
  Users,
  DollarSign,
  Target,
  Award,
  Shield,
  Globe,
  Building,
  Calendar,
  Tag,
  Settings
} from 'lucide-react';
import { useBrandManagement } from '@/hooks/useBrandManagement';

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

const ASSET_TYPES = [
  { value: 'logo', label: 'Logo', icon: Palette },
  { value: 'image', label: 'Imagen', icon: Image },
  { value: 'document', label: 'Documento', icon: FileText },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'template', label: 'Plantilla', icon: FileText }
];

const TEMPLATE_CATEGORIES = [
  { value: 'social_media', label: 'Redes Sociales', color: 'bg-blue-100 text-blue-800' },
  { value: 'print', label: 'Impresión', color: 'bg-green-100 text-green-800' },
  { value: 'digital', label: 'Digital', color: 'bg-purple-100 text-purple-800' },
  { value: 'email', label: 'Email', color: 'bg-orange-100 text-orange-800' },
  { value: 'presentation', label: 'Presentación', color: 'bg-red-100 text-red-800' }
];

const VENDOR_CATEGORIES = [
  { value: 'printing', label: 'Impresión', color: 'bg-blue-100 text-blue-800' },
  { value: 'signage', label: 'Señalización', color: 'bg-green-100 text-green-800' },
  { value: 'promotional', label: 'Promocional', color: 'bg-purple-100 text-purple-800' },
  { value: 'technology', label: 'Tecnología', color: 'bg-orange-100 text-orange-800' },
  { value: 'services', label: 'Servicios', color: 'bg-red-100 text-red-800' }
];

export function BrandManagement() {
  const { 
    brandAssets, 
    marketingTemplates, 
    approvedVendors, 
    pricingGuidelines, 
    qualityStandards,
    loading 
  } = useBrandManagement();

  const [showUploadAsset, setShowUploadAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<BrandAsset | null>(null);

  const getAssetTypeIcon = (type: string) => {
    const assetType = ASSET_TYPES.find(t => t.value === type);
    return assetType?.icon || FileText;
  };

  const getTemplateCategoryColor = (category: string) => {
    const cat = TEMPLATE_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getVendorCategoryColor = (category: string) => {
    const cat = VENDOR_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'bg-gray-100 text-gray-800';
  };

  const getVendorStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualityStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-100';
      case 'needs_improvement': return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Marca</h1>
          <p className="text-muted-foreground mt-2">
            Administración centralizada de activos de marca y estándares
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Activos de Marca</p>
                <p className="text-2xl font-bold text-blue-600">
                  {brandAssets.length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Estándares Cumplidos</p>
                <p className="text-2xl font-bold text-green-600">
                  {qualityStandards.filter(q => q.status === 'compliant').length}/{qualityStandards.length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="assets" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets">Activos</TabsTrigger>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="vendors">Proveedores</TabsTrigger>
          <TabsTrigger value="pricing">Precios</TabsTrigger>
          <TabsTrigger value="standards">Estándares</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Biblioteca de Activos de Marca</h2>
              <p className="text-muted-foreground">
                Logos, imágenes y documentos oficiales de la marca
              </p>
            </div>
            <Dialog open={showUploadAsset} onOpenChange={setShowUploadAsset}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Activo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subir Nuevo Activo de Marca</DialogTitle>
                  <DialogDescription>
                    Agrega un nuevo activo a la biblioteca de marca
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="asset-name">Nombre del Activo</Label>
                    <Input id="asset-name" placeholder="Ej: Logo Principal PRMCMS" />
                  </div>
                  <div>
                    <Label htmlFor="asset-description">Descripción</Label>
                    <Textarea id="asset-description" placeholder="Describe el activo y su uso" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="asset-type">Tipo</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSET_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="asset-category">Categoría</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primario</SelectItem>
                          <SelectItem value="secondary">Secundario</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="operational">Operacional</SelectItem>
                          <SelectItem value="compliance">Cumplimiento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="asset-file">Archivo</Label>
                    <Input id="asset-file" type="file" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowUploadAsset(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setShowUploadAsset(false)}>
                    Subir Activo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandAssets.map((asset) => {
              const AssetIcon = getAssetTypeIcon(asset.type);
              return (
                <Card key={asset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AssetIcon className="h-5 w-5 text-blue-600" />
                        <Badge variant="outline">{asset.type}</Badge>
                      </div>
                      {asset.is_required && (
                        <Badge variant="destructive" className="text-xs">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription>{asset.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tamaño:</span>
                        <span>{formatFileSize(asset.file_size)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Versión:</span>
                        <span>{asset.version}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Descargas:</span>
                        <span>{asset.downloads}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Actualizado:</span>
                        <span>{new Date(asset.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Plantillas de Marketing</h2>
            <p className="text-muted-foreground">
              Plantillas aprobadas para uso en campañas de marketing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getTemplateCategoryColor(template.category)}>
                      {TEMPLATE_CATEGORIES.find(c => c.value === template.category)?.label}
                    </Badge>
                    {template.is_featured && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span>{formatFileSize(template.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Calificación:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{template.rating}/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Descargas:</span>
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Vista Previa
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Proveedores Aprobados</h2>
            <p className="text-muted-foreground">
              Lista de proveedores autorizados para servicios de marca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription>{vendor.contact_person}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getVendorCategoryColor(vendor.category)}>
                        {VENDOR_CATEGORIES.find(c => c.value === vendor.category)?.label}
                      </Badge>
                      <Badge className={getVendorStatusColor(vendor.status)}>
                        {vendor.status === 'active' ? 'Activo' :
                         vendor.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="font-medium">{vendor.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Teléfono:</span>
                        <p className="font-medium">{vendor.phone}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Calificación:</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{vendor.quality_rating}/5</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tiempo Respuesta:</span>
                        <p className="font-medium">{vendor.response_time}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">Servicios Aprobados:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.approved_services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Contrato Expira:</span>
                      <span>{new Date(vendor.contract_expiry).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Directrices de Precios</h2>
            <p className="text-muted-foreground">
              Estructura de precios estandarizada para la red de franquicias
            </p>
          </div>

          <div className="space-y-4">
            {pricingGuidelines.map((guideline) => (
              <Card key={guideline.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{guideline.service_name}</CardTitle>
                      <CardDescription>{guideline.category}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${guideline.base_price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        por {guideline.price_unit.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Rango de Precios</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Mínimo:</span>
                          <span className="font-medium">${guideline.min_price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Máximo:</span>
                          <span className="font-medium">${guideline.max_price}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Descuentos por Volumen</h4>
                      <div className="space-y-1 text-sm">
                        {guideline.discount_tiers.map((tier, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{tier.quantity}+ items:</span>
                            <span className="font-medium text-green-600">
                              -{tier.discount_percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Variaciones Regionales</h4>
                      <div className="space-y-1 text-sm">
                        {guideline.regional_variations.map((variation, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{variation.region}:</span>
                            <span className="font-medium">x{variation.multiplier}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{guideline.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Estándares de Calidad</h2>
            <p className="text-muted-foreground">
              Métricas y estándares para mantener la calidad de la marca
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {qualityStandards.map((standard) => (
              <Card key={standard.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{standard.name}</CardTitle>
                        <CardDescription>{standard.category}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getQualityStatusColor(standard.status)}>
                      {standard.status === 'compliant' ? 'Cumple' :
                       standard.status === 'needs_improvement' ? 'Necesita Mejora' : 'No Cumple'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">{standard.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Puntuación Actual:</span>
                        <div className="flex items-center space-x-2">
                          <div className="text-lg font-bold">{standard.current_score}</div>
                          <span className="text-muted-foreground">/ {standard.target_score}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frecuencia:</span>
                        <p className="font-medium capitalize">{standard.frequency}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground text-sm">Criterios de Medición:</span>
                      <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                        {standard.measurement_criteria.map((criterion, index) => (
                          <li key={index}>{criterion}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Próxima Evaluación:</span>
                      <span>{new Date(standard.next_assessment).toLocaleDateString()}</span>
                    </div>

                    {standard.corrective_actions.length > 0 && (
                      <div>
                        <span className="text-muted-foreground text-sm">Acciones Correctivas:</span>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                          {standard.corrective_actions.map((action, index) => (
                            <li key={index}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 