import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scan, Play, Pause, CheckCircle, Clock, AlertCircle, Upload, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVirtualMailbox } from '@/hooks/useVirtualMailbox';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';
import type { ScanningQueueItem } from '@/hooks/useVirtualMailbox';

interface ScanningQueueProps {
  queueItems: ScanningQueueItem[];
  loading: boolean;
}

export function ScanningQueue({ queueItems, loading }: ScanningQueueProps) {
  const { language } = useLanguage();
  const isSpanish = language === 'es';
  const { toast } = useToast();
  
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScanningQueueItem | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPages, setScannedPages] = useState<string[]>([]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      queued: { label: isSpanish ? 'En Cola' : 'Queued', variant: 'secondary' as const, icon: <Clock className="h-3 w-3" /> },
      in_progress: { label: isSpanish ? 'Escaneando' : 'Scanning', variant: 'default' as const, icon: <Scan className="h-3 w-3" /> },
      completed: { label: isSpanish ? 'Completado' : 'Completed', variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" /> },
      failed: { label: isSpanish ? 'Fallido' : 'Failed', variant: 'destructive' as const, icon: <AlertCircle className="h-3 w-3" /> },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.queued;
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        {statusInfo.icon}
        {statusInfo.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) {
      return <Badge variant="destructive">Alta</Badge>;
    } else if (priority === 2) {
      return <Badge variant="default">Media</Badge>;
    }
    return <Badge variant="outline">Baja</Badge>;
  };

  const startScanning = (item: ScanningQueueItem) => {
    setSelectedItem(item);
    setShowScanDialog(true);
    setScannedPages([]);
    setScanProgress(0);
  };

  const simulateScanning = async () => {
    if (!selectedItem) return;

    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const totalPages = 3; // Simulated
    for (let page = 1; page <= totalPages; page++) {
      // Simulate scanning time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add scanned page
      const pageUrl = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=`;
      
      setScannedPages(prev => [...prev, pageUrl]);
      setScanProgress((page / totalPages) * 100);
    }

    // Complete scanning
    setIsScanning(false);
    toast({
      title: isSpanish ? 'Escaneo Completado' : 'Scanning Completed',
      description: isSpanish ? `${totalPages} páginas escaneadas` : `${totalPages} pages scanned`,
    });
  };

  const generatePDF = () => {
    toast({
      title: isSpanish ? 'PDF Generado' : 'PDF Generated',
      description: isSpanish ? 'El PDF se ha generado exitosamente' : 'PDF has been generated successfully',
    });
    setShowScanDialog(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scan className="h-5 w-5" />
            {isSpanish ? 'Cola de Escaneo' : 'Scanning Queue'} ({queueItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queueItems.length === 0 ? (
            <div className="text-center py-8">
              <Scan className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isSpanish ? 'No hay elementos en cola' : 'No items in queue'}
              </h3>
              <p className="text-muted-foreground">
                {isSpanish 
                  ? 'Los elementos de escaneo aparecerán aquí'
                  : 'Scanning items will appear here'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isSpanish ? 'Posición' : 'Position'}</TableHead>
                  <TableHead>{isSpanish ? 'Pieza de Correo' : 'Mail Piece'}</TableHead>
                  <TableHead>{isSpanish ? 'Prioridad' : 'Priority'}</TableHead>
                  <TableHead>{isSpanish ? 'Calidad' : 'Quality'}</TableHead>
                  <TableHead>{isSpanish ? 'Estado' : 'Status'}</TableHead>
                  <TableHead>{isSpanish ? 'Acciones' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="outline">#{item.queue_position}</Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div>
                        <div className="font-medium">MP-{item.mail_piece_id.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.scan_type} • {item.color_mode}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getPriorityBadge(item.priority_level)}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.scan_quality} ({item.resolution_dpi} DPI)
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(item.status)}
                    </TableCell>
                    
                    <TableCell>
                      {item.status === 'queued' && (
                        <Button
                          size="sm"
                          onClick={() => startScanning(item)}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-3 w-3" />
                          {isSpanish ? 'Iniciar' : 'Start'}
                        </Button>
                      )}
                      {item.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Scanning Dialog */}
      <Dialog open={showScanDialog} onOpenChange={setShowScanDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isSpanish ? 'Interfaz de Escaneo' : 'Scanning Interface'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Scan Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {isSpanish ? 'Configuración de Escaneo' : 'Scan Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>{isSpanish ? 'Calidad' : 'Quality'}</Label>
                    <Select defaultValue={selectedItem?.scan_quality || 'standard'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (300 DPI)</SelectItem>
                        <SelectItem value="high">High (600 DPI)</SelectItem>
                        <SelectItem value="ultra">Ultra (1200 DPI)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isSpanish ? 'Color' : 'Color'}</Label>
                    <Select defaultValue={selectedItem?.color_mode || 'color'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="grayscale">Grayscale</SelectItem>
                        <SelectItem value="black_white">Black & White</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{isSpanish ? 'Tipo' : 'Type'}</Label>
                    <Select defaultValue={selectedItem?.scan_type || 'both_sides'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front_only">Front Only</SelectItem>
                        <SelectItem value="both_sides">Both Sides</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scanning Progress */}
            {isScanning && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {isSpanish ? 'Progreso de Escaneo' : 'Scanning Progress'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(scanProgress)}%
                      </span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Scan className="h-4 w-4 animate-spin" />
                      {isSpanish ? 'Escaneando páginas...' : 'Scanning pages...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Scanned Pages Preview */}
            {scannedPages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {isSpanish ? 'Páginas Escaneadas' : 'Scanned Pages'} ({scannedPages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {scannedPages.map((pageUrl, index) => (
                      <div key={index} className="space-y-2">
                        <div className="aspect-[3/4] bg-muted rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-muted-foreground">
                              {index + 1}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {isSpanish ? 'Página' : 'Page'}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-center text-muted-foreground">
                          {isSpanish ? 'Página' : 'Page'} {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowScanDialog(false)} className="flex-1">
                {isSpanish ? 'Cancelar' : 'Cancel'}
              </Button>
              
              {!isScanning && scannedPages.length === 0 && (
                <Button onClick={simulateScanning} className="flex-1">
                  <Scan className="h-4 w-4 mr-2" />
                  {isSpanish ? 'Iniciar Escaneo' : 'Start Scanning'}
                </Button>
              )}
              
              {scannedPages.length > 0 && !isScanning && (
                <Button onClick={generatePDF} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  {isSpanish ? 'Generar PDF' : 'Generate PDF'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}