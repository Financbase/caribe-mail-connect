import { useState } from 'react';
import { Calendar, Filter, Download, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VoiceInput } from '@/components/mobile/VoiceInput';
import { useSearch } from '@/hooks/useSearch';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SearchPreset {
  id: string;
  name: string;
  filters: unknown;
  isPublic: boolean;
}

export default function AdvancedSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [selectedCarriers, setSelectedCarriers] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [customerType, setCustomerType] = useState<string>('');
  const [savePresetName, setSavePresetName] = useState('');
  const [savedPresets, setSavedPresets] = useState<SearchPreset[]>([
    {
      id: '1',
      name: 'Paquetes pendientes esta semana',
      filters: { status: ['pending'], dateRange: 'this_week' },
      isPublic: true
    },
    {
      id: '2', 
      name: 'Clientes Act 60 con paquetes',
      filters: { customerType: 'act60', hasPackages: true },
      isPublic: false
    }
  ]);

  const carriers = ['UPS', 'FedEx', 'USPS', 'DHL', 'Amazon'];
  const statuses = ['received', 'processing', 'available', 'delivered', 'returned'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'oversized'];

  const {
    searchResults,
    setFilters,
    isLoading,
    exportToCSV
  } = useSearch({ 
    enableVoice: true, 
    saveHistory: true, 
    fuzzyMatch: true 
  });

  const handleSearch = () => {
    const filterObj: any = {};
    
    if (dateRange.start && dateRange.end) {
      filterObj.dateRange = { start: dateRange.start, end: dateRange.end };
    }
    if (selectedCarriers.length > 0) {
      filterObj.carrier = selectedCarriers[0];
    }
    if (selectedStatuses.length > 0) {
      filterObj.status = selectedStatuses[0];
    }
    if (selectedSizes.length > 0) {
      filterObj.size = selectedSizes[0];
    }
    if (customerType && (customerType === 'regular' || customerType === 'act60')) {
      filterObj.customerType = customerType;
    }
    
    setFilters(filterObj);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateRange({});
    setSelectedCarriers([]);
    setSelectedStatuses([]);
    setSelectedSizes([]);
    setCustomerType('');
    setFilters({});
  };

  const saveCurrentSearch = () => {
    if (!savePresetName.trim()) return;

    const newPreset: SearchPreset = {
      id: Date.now().toString(),
      name: savePresetName,
      filters: {
        searchTerm,
        dateRange,
        carriers: selectedCarriers,
        statuses: selectedStatuses,
        sizes: selectedSizes,
        customerType
      },
      isPublic: false
    };

    setSavedPresets(prev => [...prev, newPreset]);
    setSavePresetName('');
  };

  const loadPreset = (preset: SearchPreset) => {
    const { filters } = preset;
    setSearchTerm(filters.searchTerm || '');
    setDateRange(filters.dateRange || {});
    setSelectedCarriers(filters.carriers || []);
    setSelectedStatuses(filters.statuses || []);
    setSelectedSizes(filters.sizes || []);
    setCustomerType(filters.customerType || '');
  };

  const exportResults = () => {
    exportToCSV(searchResults, `search-results-${format(new Date(), 'yyyy-MM-dd')}`);
  };

  const handleVoiceSearch = (text: string) => {
    setSearchTerm(text);
  };

  const toggleArrayFilter = (value: string, array: string[], setter: (arr: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Búsqueda Avanzada</h1>
        <Button onClick={exportResults} disabled={searchResults.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Exportar ({searchResults.length})
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search Filters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Term */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Términos de búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nombre, tracking, email, teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <VoiceInput onTranscription={handleVoiceSearch} />
              </div>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rango de fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Fecha inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {dateRange.start ? format(dateRange.start, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.start}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Fecha fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {dateRange.end ? format(dateRange.end, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.end}
                        onSelect={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Carriers */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Transportistas</Label>
                <div className="flex flex-wrap gap-2">
                  {carriers.map((carrier) => (
                    <Badge
                      key={carrier}
                      variant={selectedCarriers.includes(carrier) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter(carrier, selectedCarriers, setSelectedCarriers)}
                    >
                      {carrier}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Estados</Label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status}
                      variant={selectedStatuses.includes(status) ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => toggleArrayFilter(status, selectedStatuses, setSelectedStatuses)}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Tamaños</Label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <Badge
                      key={size}
                      variant={selectedSizes.includes(size) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter(size, selectedSizes, setSelectedSizes)}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Customer Type */}
              <div>
                <Label htmlFor="customer-type">Tipo de cliente</Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="act60">Act 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1">
                  <Filter className="w-4 h-4 mr-2" />
                  Aplicar filtros
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Presets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Búsquedas guardadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del preset..."
                  value={savePresetName}
                  onChange={(e) => setSavePresetName(e.target.value)}
                />
                <Button onClick={saveCurrentSearch} size="sm">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                {savedPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => loadPreset(preset)}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{preset.name}</span>
                      {preset.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          Público
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resultados {searchResults.length > 0 && `(${searchResults.length})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Buscando...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Detalles</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {searchResults.map((result, index) => (
                <TableRow
                  key={index}
                  tabIndex={0}
                  aria-label={`Resultado ${index + 1}: ${result.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      const btn = (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>('button[data-action="view"]');
                      btn?.click();
                      e.preventDefault();
                    }
                  }}
                >
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{result.title}</TableCell>
                    <TableCell className="text-muted-foreground">{result.subtitle}</TableCell>
                    <TableCell>
                    <Button variant="outline" size="sm" data-action="view" aria-label={`Ver detalles de ${result.title}`}>
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Configura tus filtros y presiona "Aplicar filtros" para comenzar
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}