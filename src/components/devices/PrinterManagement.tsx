import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Pause,
  Play,
  RotateCcw,
  Settings,
  TrendingUp,
  Droplets,
  Package,
  Activity,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Trash2,
  Wrench,
  BarChart3,
  MapPin,
  Calendar,
  Zap
} from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { Printer as PrinterType, PrintJob, PrintJobStatus, PrinterType as PrinterTypeEnum } from '@/types/devices';

interface PrinterManagementProps {
  onPrinterUpdate?: (printerId: string, updates: Partial<PrinterType>) => void;
}

// Mock print jobs data
const mockPrintJobs: PrintJob[] = [
  {
    id: 'job-001',
    printerId: 'printer-001',
    printerName: 'Zebra ZT230',
    fileName: 'shipping_labels_batch_1.pdf',
    jobType: 'labels',
    status: 'printing',
    priority: 'high',
    copies: 50,
    copiesCompleted: 32,
    submittedBy: 'Carlos Rodriguez',
    submittedAt: '2024-01-24T10:30:00Z',
    startedAt: '2024-01-24T10:32:00Z',
    estimatedCompletion: '2024-01-24T10:40:00Z',
    paperSize: '4x6',
    pageCount: 50
  },
  {
    id: 'job-002',
    printerId: 'printer-002',
    printerName: 'HP LaserJet Pro',
    fileName: 'monthly_report.pdf',
    jobType: 'documents',
    status: 'queued',
    priority: 'normal',
    copies: 1,
    copiesCompleted: 0,
    submittedBy: 'Maria Santos',
    submittedAt: '2024-01-24T11:00:00Z',
    paperSize: 'Letter',
    pageCount: 25
  },
  {
    id: 'job-003',
    printerId: 'printer-001',
    printerName: 'Zebra ZT230',
    fileName: 'return_labels.pdf',
    jobType: 'labels',
    status: 'completed',
    priority: 'normal',
    copies: 10,
    copiesCompleted: 10,
    submittedBy: 'Ana Martinez',
    submittedAt: '2024-01-24T09:15:00Z',
    startedAt: '2024-01-24T09:16:00Z',
    completedAt: '2024-01-24T09:18:00Z',
    paperSize: '4x6',
    pageCount: 10
  }
];

export function PrinterManagement({ onPrinterUpdate }: PrinterManagementProps) {
  const { 
    printers,
    printersLoading,
    printJobs,
    pausePrintJob,
    resumePrintJob,
    cancelPrintJob,
    retryPrintJob,
    reprintJob,
    addMaintenanceRecord,
    updatePrinter
  } = useDevices();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PrintJobStatus | 'all'>('all');
  const [printerFilter, setPrinterFilter] = useState<string>('all');
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterType | null>(null);
  const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);
  const [showMaintenanceDialog, setShowMaintenanceDialog] = useState(false);
  const [showJobDetailsDialog, setShowJobDetailsDialog] = useState(false);
  const [showSupplyOrderDialog, setShowSupplyOrderDialog] = useState(false);

  // Use mock data if real data not available
  const displayPrintJobs = printJobs?.length > 0 ? printJobs : mockPrintJobs;

  // Filter print jobs
  const filteredJobs = useMemo(() => {
    return displayPrintJobs.filter(job => {
      const matchesSearch = job.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           job.printerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
      const matchesPrinter = printerFilter === 'all' || job.printerId === printerFilter;

      return matchesSearch && matchesStatus && matchesPrinter;
    });
  }, [displayPrintJobs, searchTerm, statusFilter, printerFilter]);

  // Calculate printer statistics
  const printerStats = useMemo(() => {
    const stats = {
      total: printers.length,
      online: printers.filter(p => p.status === 'online').length,
      offline: printers.filter(p => p.status === 'offline').length,
      printing: printers.filter(p => p.status === 'printing').length,
      maintenance: printers.filter(p => p.status === 'maintenance').length,
      lowSupplies: printers.filter(p => 
        p.supplies.some(s => s.level < 20)
      ).length
    };
    return stats;
  }, [printers]);

  // Get status badge
  const getStatusBadge = (status: PrintJobStatus) => {
    switch (status) {
      case 'queued':
        return <Badge variant="secondary">Queued</Badge>;
      case 'printing':
        return <Badge variant="default" className="bg-blue-500">Printing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'normal':
        return <Badge variant="secondary">Normal</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  // Get supply level color
  const getSupplyLevelColor = (level: number) => {
    if (level < 10) return 'bg-red-500';
    if (level < 20) return 'bg-orange-500';
    if (level < 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Handle job actions
  const handleJobAction = (action: string, job: PrintJob) => {
    switch (action) {
      case 'pause':
        pausePrintJob.mutate({ jobId: job.id });
        break;
      case 'resume':
        resumePrintJob.mutate({ jobId: job.id });
        break;
      case 'cancel':
        cancelPrintJob.mutate({ jobId: job.id });
        break;
      case 'retry':
        retryPrintJob.mutate({ jobId: job.id });
        break;
      case 'reprint':
        reprintJob.mutate({ jobId: job.id });
        break;
    }
  };

  if (printersLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Printers</p>
                <p className="text-2xl font-bold">{printerStats.total}</p>
              </div>
              <Printer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600">{printerStats.online}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Printing</p>
                <p className="text-2xl font-bold text-blue-600">{printerStats.printing}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-red-600">{printerStats.offline}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-orange-600">{printerStats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Supplies</p>
                <p className="text-2xl font-bold text-yellow-600">{printerStats.lowSupplies}</p>
              </div>
              <Package className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Printer Status Overview</CardTitle>
          <CardDescription>Monitor all printers and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {printers.map((printer) => (
              <Card key={printer.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Printer className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">{printer.name}</h3>
                        <p className="text-sm text-gray-500">{printer.model}</p>
                      </div>
                    </div>
                    <Badge className={printer.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {printer.status}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{printer.location.building} - {printer.location.room}</span>
                  </div>

                  {/* Supply Levels */}
                  <div className="space-y-2 mb-3">
                    {printer.supplies.map((supply) => (
                      <div key={supply.type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{supply.type}</span>
                          <span>{supply.level}%</span>
                        </div>
                        <Progress 
                          value={supply.level} 
                          className={`h-2 ${getSupplyLevelColor(supply.level)}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Current Job */}
                  {printer.currentJob && (
                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Current Job</span>
                      </div>
                      <p className="text-gray-600">{printer.currentJob.fileName}</p>
                      <div className="flex justify-between mt-1">
                        <span>Progress: {printer.currentJob.progress}%</span>
                        <span>{printer.currentJob.remainingTime}min left</span>
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {printer.supplies.some(s => s.level < 20) && (
                    <Alert className="mt-2">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Low supply levels detected
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPrinter(printer)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPrinter(printer);
                        setShowMaintenanceDialog(true);
                      }}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Maintain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Print Queue */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Print Queue</CardTitle>
              <CardDescription>Monitor and manage print jobs</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search print jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PrintJobStatus | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={printerFilter} onValueChange={setPrinterFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Printer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Printers</SelectItem>
                {printers.map((printer) => (
                  <SelectItem key={printer.id} value={printer.id}>
                    {printer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jobs Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Printer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{job.fileName}</div>
                          <div className="text-sm text-gray-500">
                            {job.copies} copies • {job.pageCount} pages
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{job.printerName}</span>
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                    <TableCell>
                      {job.status === 'printing' || job.status === 'completed' ? (
                        <div className="space-y-1">
                          <div className="text-sm">
                            {job.copiesCompleted}/{job.copies}
                          </div>
                          <Progress 
                            value={(job.copiesCompleted / job.copies) * 100} 
                            className="h-2 w-16"
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{job.submittedBy}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(job.submittedAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {job.status === 'queued' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobAction('cancel', job)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === 'printing' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobAction('pause', job)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobAction('retry', job)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleJobAction('reprint', job)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No print jobs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Jobs Completed</span>
                <span className="font-medium">147</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pages Printed</span>
                <span className="font-medium">2,354</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Queue Time</span>
                <span className="font-medium">2.3 min</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="font-bold text-green-600">98.6%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Supply Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded">
                <Droplets className="h-4 w-4 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Zebra ZT230</p>
                  <p className="text-xs text-gray-500">Ink: 15% remaining</p>
                </div>
                <Button size="sm" variant="outline">Order</Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                <Package className="h-4 w-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">HP LaserJet Pro</p>
                  <p className="text-xs text-gray-500">Labels: 25% remaining</p>
                </div>
                <Button size="sm" variant="outline">Order</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Zebra ZT411</p>
                  <p className="text-xs text-gray-500">Due: Tomorrow</p>
                </div>
                <Button size="sm" variant="outline">Schedule</Button>
              </div>
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                <Wrench className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Brother QL-820NWB</p>
                  <p className="text-xs text-gray-500">Due: Next week</p>
                </div>
                <Button size="sm" variant="outline">Schedule</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={showJobDetailsDialog} onOpenChange={setShowJobDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Print Job Details</DialogTitle>
            <DialogDescription>
              Detailed information for print job
            </DialogDescription>
          </DialogHeader>

          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">File Name</label>
                  <p className="text-sm text-gray-600">{selectedJob.fileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Printer</label>
                  <p className="text-sm text-gray-600">{selectedJob.printerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div>{getStatusBadge(selectedJob.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <div>{getPriorityBadge(selectedJob.priority)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Submitted By</label>
                  <p className="text-sm text-gray-600">{selectedJob.submittedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Submitted At</label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedJob.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Copies</label>
                  <p className="text-sm text-gray-600">
                    {selectedJob.copiesCompleted}/{selectedJob.copies}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Pages</label>
                  <p className="text-sm text-gray-600">{selectedJob.pageCount}</p>
                </div>
              </div>

              {selectedJob.status === 'printing' && (
                <div>
                  <label className="text-sm font-medium">Progress</label>
                  <div className="mt-1">
                    <Progress 
                      value={(selectedJob.copiesCompleted / selectedJob.copies) * 100} 
                      className="h-3"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((selectedJob.copiesCompleted / selectedJob.copies) * 100)}% complete
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJobDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 