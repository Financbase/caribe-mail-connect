import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Camera, 
  Upload, 
  Clock, 
  DollarSign, 
  User,
  Package,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Download,
  Eye,
  Edit
} from 'lucide-react';
import { 
  mockClaims, 
  insuranceCompanies,
  coverageTiers 
} from '@/data/insuranceData';
import { 
  InsuranceClaim, 
  ClaimStatus, 
  ClaimType, 
  ClaimPriority,
  TimelineEventType,
  DocumentType,
  DamageType
} from '@/types/insurance';
import { useLanguage } from '@/contexts/LanguageContext';

interface ClaimsProcessingProps {
  claimId?: string;
  onNavigate: (section: string) => void;
}

export function ClaimsProcessing({ claimId, onNavigate }: ClaimsProcessingProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(
    claimId ? mockClaims.find(c => c.id === claimId) || null : null
  );
  const [isFilingNew, setIsFilingNew] = useState(!claimId);
  const [newClaim, setNewClaim] = useState({
    customerName: '',
    claimType: '' as ClaimType,
    description: '',
    reportedAmount: 0,
    packageId: ''
  });
  const [uploadedPhotos, setUploadedPhotos] = useState<Array<{
    id: string;
    url: string;
    description: string;
    damageType?: DamageType;
  }>>([]);
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    id: string;
    name: string;
    type: DocumentType;
    url: string;
  }>>([]);

  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case 'Approved':
      case 'Settled':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
      case 'Investigation':
      case 'Documentation Required':
        return 'bg-yellow-100 text-yellow-800';
      case 'Denied':
      case 'Closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: ClaimPriority) => {
    switch (priority) {
      case 'Critical':
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateSettlement = (reportedAmount: number, deductible: number = 100) => {
    const settlement = Math.max(0, reportedAmount - deductible);
    return {
      reportedAmount,
      deductible,
      settlement,
      percentage: (settlement / reportedAmount) * 100
    };
  };

  const handleFileUpload = (files: FileList, type: 'photos' | 'documents') => {
    Array.from(files).forEach((file, index) => {
      const id = `upload-${Date.now()}-${index}`;
      const url = URL.createObjectURL(file);
      
      if (type === 'photos') {
        setUploadedPhotos(prev => [...prev, {
          id,
          url,
          description: `Photo ${prev.length + 1}`,
          damageType: 'Physical Damage'
        }]);
      } else {
        setUploadedDocuments(prev => [...prev, {
          id,
          name: file.name,
          type: 'Other',
          url
        }]);
      }
    });
  };

  const handleSubmitClaim = () => {
    // In a real app, this would submit to the backend
    console.log('Submitting claim:', { newClaim, uploadedPhotos, uploadedDocuments });
    setIsFilingNew(false);
    onNavigate('claims');
  };

  if (isFilingNew) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isSpanish ? 'Nuevo Reclamo' : 'New Claim'}
            </h1>
            <p className="text-muted-foreground">
              {isSpanish 
                ? 'Presenta un nuevo reclamo de seguro'
                : 'File a new insurance claim'
              }
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsFilingNew(false)}>
            <X className="h-4 w-4 mr-2" />
            {isSpanish ? 'Cancelar' : 'Cancel'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Claim Information */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Información del Reclamo' : 'Claim Information'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">
                  {isSpanish ? 'Nombre del Cliente' : 'Customer Name'}
                </Label>
                <Input
                  id="customerName"
                  value={newClaim.customerName}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder={isSpanish ? "Ingrese el nombre del cliente" : "Enter customer name"}
                />
              </div>

              <div>
                <Label htmlFor="packageId">
                  {isSpanish ? 'ID del Paquete (Opcional)' : 'Package ID (Optional)'}
                </Label>
                <Input
                  id="packageId"
                  value={newClaim.packageId}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, packageId: e.target.value }))}
                  placeholder={isSpanish ? "ID del paquete afectado" : "Affected package ID"}
                />
              </div>

              <div>
                <Label htmlFor="claimType">
                  {isSpanish ? 'Tipo de Reclamo' : 'Claim Type'}
                </Label>
                <Select 
                  value={newClaim.claimType} 
                  onValueChange={(value) => setNewClaim(prev => ({ ...prev, claimType: value as ClaimType }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isSpanish ? "Seleccionar tipo" : "Select type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Package Damage">{isSpanish ? 'Daño al Paquete' : 'Package Damage'}</SelectItem>
                    <SelectItem value="Package Loss">{isSpanish ? 'Pérdida del Paquete' : 'Package Loss'}</SelectItem>
                    <SelectItem value="Package Delay">{isSpanish ? 'Retraso del Paquete' : 'Package Delay'}</SelectItem>
                    <SelectItem value="Theft">{isSpanish ? 'Robo' : 'Theft'}</SelectItem>
                    <SelectItem value="Natural Disaster">{isSpanish ? 'Desastre Natural' : 'Natural Disaster'}</SelectItem>
                    <SelectItem value="Handling Error">{isSpanish ? 'Error de Manejo' : 'Handling Error'}</SelectItem>
                    <SelectItem value="Other">{isSpanish ? 'Otro' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportedAmount">
                  {isSpanish ? 'Monto Reportado' : 'Reported Amount'}
                </Label>
                <Input
                  id="reportedAmount"
                  type="number"
                  value={newClaim.reportedAmount}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, reportedAmount: Number(e.target.value) }))}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="description">
                  {isSpanish ? 'Descripción del Incidente' : 'Incident Description'}
                </Label>
                <Textarea
                  id="description"
                  value={newClaim.description}
                  onChange={(e) => setNewClaim(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={isSpanish ? "Describe detalladamente lo que sucedió..." : "Describe in detail what happened..."}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photo Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Documentación Fotográfica' : 'Photo Documentation'}</CardTitle>
              <CardDescription>
                {isSpanish 
                  ? 'Sube fotos del daño o incidente'
                  : 'Upload photos of damage or incident'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {isSpanish ? 'Arrastra fotos aquí o haz clic para seleccionar' : 'Drag photos here or click to select'}
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'photos')}
                  className="hidden"
                  id="photo-upload"
                />
                <Button variant="outline" onClick={() => document.getElementById('photo-upload')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isSpanish ? 'Seleccionar Fotos' : 'Select Photos'}
                </Button>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="grid gap-2">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-center gap-2 p-2 border rounded">
                      <img src={photo.url} alt={photo.description} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <Input
                          value={photo.description}
                          onChange={(e) => {
                            setUploadedPhotos(prev => prev.map((p, i) => 
                              i === index ? { ...p, description: e.target.value } : p
                            ));
                          }}
                          placeholder={isSpanish ? "Descripción de la foto" : "Photo description"}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>{isSpanish ? 'Documentos de Soporte' : 'Supporting Documents'}</CardTitle>
            <CardDescription>
              {isSpanish 
                ? 'Sube documentos relacionados con el reclamo'
                : 'Upload documents related to the claim'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                {isSpanish ? 'Arrastra documentos aquí o haz clic para seleccionar' : 'Drag documents here or click to select'}
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'documents')}
                className="hidden"
                id="document-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('document-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {isSpanish ? 'Seleccionar Documentos' : 'Select Documents'}
              </Button>
            </div>

            {uploadedDocuments.length > 0 && (
              <div className="grid gap-2">
                {uploadedDocuments.map((doc, index) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <Select 
                        value={doc.type} 
                        onValueChange={(value) => {
                          setUploadedDocuments(prev => prev.map((d, i) => 
                            i === index ? { ...d, type: value as DocumentType } : d
                          ));
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Damage Report">{isSpanish ? 'Reporte de Daños' : 'Damage Report'}</SelectItem>
                          <SelectItem value="Receipt">{isSpanish ? 'Recibo' : 'Receipt'}</SelectItem>
                          <SelectItem value="Invoice">{isSpanish ? 'Factura' : 'Invoice'}</SelectItem>
                          <SelectItem value="Police Report">{isSpanish ? 'Reporte de Policía' : 'Police Report'}</SelectItem>
                          <SelectItem value="Other">{isSpanish ? 'Otro' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedDocuments(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settlement Calculator */}
        {newClaim.reportedAmount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Calculadora de Liquidación' : 'Settlement Calculator'}</CardTitle>
            </CardHeader>
            <CardContent>
              <SettlementCalculator amount={newClaim.reportedAmount} />
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setIsFilingNew(false)}>
            {isSpanish ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button onClick={handleSubmitClaim}>
            <FileText className="h-4 w-4 mr-2" />
            {isSpanish ? 'Presentar Reclamo' : 'Submit Claim'}
          </Button>
        </div>
      </div>
    );
  }

  if (!selectedClaim) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isSpanish ? 'Procesamiento de Reclamos' : 'Claims Processing'}
          </h1>
          <p className="text-muted-foreground">
            {isSpanish 
              ? 'Selecciona un reclamo para procesar'
              : 'Select a claim to process'
            }
          </p>
        </div>
        
        <div className="grid gap-4">
          {mockClaims.map((claim) => (
            <Card 
              key={claim.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => setSelectedClaim(claim)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{claim.claimNumber}</h3>
                      <p className="text-sm text-muted-foreground">{claim.customerName}</p>
                      <p className="text-sm text-muted-foreground">{claim.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                        <Badge className={getPriorityColor(claim.priority)}>
                          {claim.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${claim.reportedAmount}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(claim.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const settlement = calculateSettlement(selectedClaim.reportedAmount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedClaim.claimNumber}
          </h1>
          <p className="text-muted-foreground">
            {selectedClaim.customerName} • {selectedClaim.claimType}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedClaim(null)}>
            <X className="h-4 w-4 mr-2" />
            {isSpanish ? 'Volver' : 'Back'}
          </Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            {isSpanish ? 'Editar' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Claim Details */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Detalles del Reclamo' : 'Claim Details'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">{isSpanish ? 'Estado' : 'Status'}</Label>
                  <Badge className={getStatusColor(selectedClaim.status)}>
                    {selectedClaim.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">{isSpanish ? 'Prioridad' : 'Priority'}</Label>
                  <Badge className={getPriorityColor(selectedClaim.priority)}>
                    {selectedClaim.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">{isSpanish ? 'Monto Reportado' : 'Reported Amount'}</Label>
                  <p className="text-lg font-semibold">${selectedClaim.reportedAmount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">{isSpanish ? 'Monto Estimado' : 'Estimated Amount'}</Label>
                  <p className="text-lg font-semibold">${selectedClaim.estimatedAmount}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">{isSpanish ? 'Descripción' : 'Description'}</Label>
                <p className="text-sm text-muted-foreground">{selectedClaim.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Cronología' : 'Timeline'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedClaim.timeline.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{event.eventType}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {isSpanish ? 'Por' : 'By'}: {event.performedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          {selectedClaim.photos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{isSpanish ? 'Fotografías' : 'Photos'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedClaim.photos.map((photo) => (
                    <div key={photo.id} className="space-y-2">
                      <img 
                        src={photo.url} 
                        alt={photo.description} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-medium">{photo.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {photo.damageType} • {photo.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settlement Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Liquidación' : 'Settlement'}</CardTitle>
            </CardHeader>
            <CardContent>
              <SettlementCalculator amount={selectedClaim.reportedAmount} />
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Documentos' : 'Documents'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedClaim.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>{isSpanish ? 'Notas' : 'Notes'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedClaim.notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded">
                    <p className="text-sm">{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{note.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3">
                <Plus className="h-4 w-4 mr-2" />
                {isSpanish ? 'Agregar Nota' : 'Add Note'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Settlement Calculator Component
function SettlementCalculator({ amount }: { amount: number }) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  
  const calculateSettlement = (reportedAmount: number, deductible: number = 100) => {
    const settlement = Math.max(0, reportedAmount - deductible);
    return {
      reportedAmount,
      deductible,
      settlement,
      percentage: (settlement / reportedAmount) * 100
    };
  };

  const settlement = calculateSettlement(amount);

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <div className="flex justify-between">
          <span className="text-sm">{isSpanish ? 'Monto Reportado' : 'Reported Amount'}</span>
          <span className="font-medium">${settlement.reportedAmount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm">{isSpanish ? 'Deducible' : 'Deductible'}</span>
          <span className="font-medium text-red-600">-${settlement.deductible}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span className="font-medium">{isSpanish ? 'Liquidación' : 'Settlement'}</span>
            <span className="font-bold text-green-600">${settlement.settlement}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{isSpanish ? 'Porcentaje de Cobertura' : 'Coverage Percentage'}</span>
          <span>{settlement.percentage.toFixed(1)}%</span>
        </div>
        <Progress value={settlement.percentage} className="w-full" />
      </div>
    </div>
  );
} 