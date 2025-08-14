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
import { VirtualizedTable } from '@/components/ui/virtualized-table';
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

      {/* Vendors List (virtualized as table-like list) */}
      <div className="overflow-x-auto">
        <VirtualizedTable
          ariaLabel={isSpanish ? 'Proveedores' : 'Vendors'}
          rows={filteredVendors}
          rowHeight={96}
          empty={(
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
          columns={[
            { id: 'name', header: isSpanish ? 'Proveedor' : 'Vendor', width: '1fr', cell: (v: any) => (
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{v.name}</span>
                  <Badge variant={v.is_active ? 'default' : 'secondary'}>
                    {v.is_active ? (isSpanish ? 'Activo' : 'Active') : (isSpanish ? 'Inactivo' : 'Inactive')}
                  </Badge>
                </div>
                {v.contact_person && (
                  <div className="text-xs text-muted-foreground">{v.contact_person}</div>
                )}
              </div>
            ) },
            { id: 'contact', header: isSpanish ? 'Contacto' : 'Contact', width: '1fr', cell: (v: any) => (
              <div className="text-sm space-y-1">
                {v.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{v.email}</span></div>}
                {v.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{v.phone}</span></div>}
              </div>
            ) },
            { id: 'address', header: isSpanish ? 'Dirección' : 'Address', width: '1fr', cell: (v: any) => (
              v.address_line1 ? (
                <div className="text-sm">
                  <div>{v.address_line1}</div>
                  {v.address_line2 && <div>{v.address_line2}</div>}
                  <div>{v.city}, {v.state} {v.zip_code}</div>
                </div>
              ) : null
            ) },
            { id: 'actions', header: isSpanish ? 'Acciones' : 'Actions', width: '8rem', align: 'right', cell: (v: any) => (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
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
                  <VendorForm vendor={v} onClose={() => setEditingVendor(null)} />
                </DialogContent>
              </Dialog>
            ) },
          ]}
        />
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