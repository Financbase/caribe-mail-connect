import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Truck,
  Search,
  Plus,
  Edit,
  Phone,
  Mail,
  MapPin,
  Filter
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useLanguage } from '@/contexts/LanguageContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VendorForm } from '@/components/inventory/VendorForm';

export function VendorManagement() {
  const { language } = useLanguage();
  const { vendors, vendorsLoading } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const isSpanish = language === 'es';

  if (vendorsLoading) {
    return <LoadingSpinner />;
  }

  // Filter vendors based on search and status
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = showInactive || vendor.is_active;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {isSpanish ? 'Gestión de Proveedores' : 'Vendor Management'}
          </h2>
          <p className="text-muted-foreground">
            {isSpanish ? 'Gestione información de proveedores y contactos' : 'Manage vendor information and contacts'}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {isSpanish ? 'Nuevo Proveedor' : 'New Vendor'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {isSpanish ? 'Crear Nuevo Proveedor' : 'Create New Vendor'}
              </DialogTitle>
              <DialogDescription>
                {isSpanish ? 'Agregue un nuevo proveedor al sistema' : 'Add a new vendor to the system'}
              </DialogDescription>
            </DialogHeader>
            <VendorForm onClose={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isSpanish ? 'Buscar por nombre, contacto o email...' : 'Search by name, contact, or email...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded"
                />
                {isSpanish ? 'Mostrar inactivos' : 'Show inactive'}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className={!vendor.is_active ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                </div>
                <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                  {vendor.is_active ? 
                    (isSpanish ? 'Activo' : 'Active') : 
                    (isSpanish ? 'Inactivo' : 'Inactive')
                  }
                </Badge>
              </div>
              {vendor.contact_person && (
                <CardDescription>{vendor.contact_person}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Contact Information */}
              <div className="space-y-2">
                {vendor.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.email}</span>
                  </div>
                )}
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                {vendor.address_line1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{vendor.address_line1}</p>
                      {vendor.address_line2 && <p>{vendor.address_line2}</p>}
                      <p>
                        {vendor.city}, {vendor.state} {vendor.zip_code}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Terms */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isSpanish ? 'Términos de Pago:' : 'Payment Terms:'}
                  </span>
                  <span className="font-medium">
                    {vendor.payment_terms} {isSpanish ? 'días' : 'days'}
                  </span>
                </div>
                {vendor.preferred_payment_method && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">
                      {isSpanish ? 'Método Preferido:' : 'Preferred Method:'}
                    </span>
                    <span className="font-medium">{vendor.preferred_payment_method}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      {isSpanish ? 'Editar' : 'Edit'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {isSpanish ? 'Editar Proveedor' : 'Edit Vendor'}
                      </DialogTitle>
                      <DialogDescription>
                        {isSpanish ? 'Actualice la información del proveedor' : 'Update vendor information'}
                      </DialogDescription>
                    </DialogHeader>
                    <VendorForm vendor={vendor} onClose={() => setEditingVendor(null)} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Notes */}
              {vendor.notes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">{vendor.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">
              {isSpanish ? 'No se encontraron proveedores' : 'No vendors found'}
            </h3>
            <p className="text-muted-foreground">
              {isSpanish ? 'Intente ajustar los filtros de búsqueda' : 'Try adjusting your search filters'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}