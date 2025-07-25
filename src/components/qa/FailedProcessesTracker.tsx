import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Clock, CheckCircle, Eye } from 'lucide-react';
import { useQA, type FailedProcess } from '@/hooks/useQA';
import { format } from 'date-fns';

export const FailedProcessesTracker = () => {
  const { failedProcesses, updateErrorReport } = useQA();
  const [selectedProcess, setSelectedProcess] = useState<FailedProcess | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredProcesses = failedProcesses.filter(process => {
    if (statusFilter !== 'all' && process.status !== statusFilter) return false;
    if (severityFilter !== 'all' && process.severity !== severityFilter) return false;
    return true;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'outline'}>
        {severity}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'destructive',
      investigating: 'secondary',
      resolved: 'default',
      closed: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Failed Processes Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Failed Processes Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Failed At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.map((process) => (
                  <TableRow key={process.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(process.severity)}
                        <div>
                          <div className="font-medium">{process.process_name}</div>
                          {process.error_message && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {process.error_message}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{process.process_type}</Badge>
                    </TableCell>
                    <TableCell>{getSeverityBadge(process.severity)}</TableCell>
                    <TableCell>{getStatusBadge(process.status)}</TableCell>
                    <TableCell>
                      {format(new Date(process.failed_at), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedProcess(process)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Process Failure Details</DialogTitle>
                          </DialogHeader>
                          {selectedProcess && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Process Name</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedProcess.process_name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Process Type</label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedProcess.process_type}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Severity</label>
                                  <div className="mt-1">
                                    {getSeverityBadge(selectedProcess.severity)}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">
                                    {getStatusBadge(selectedProcess.status)}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Error Message</label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {selectedProcess.error_message || 'No error message provided'}
                                </p>
                              </div>

                              {selectedProcess.error_details && 
                               Object.keys(selectedProcess.error_details).length > 0 && (
                                <div>
                                  <label className="text-sm font-medium">Error Details</label>
                                  <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-40">
                                    {JSON.stringify(selectedProcess.error_details, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {selectedProcess.resolution_notes && (
                                <div>
                                  <label className="text-sm font-medium">Resolution Notes</label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedProcess.resolution_notes}
                                  </p>
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                <div>
                                  <span className="font-medium">Failed At:</span>{' '}
                                  {format(new Date(selectedProcess.failed_at), 'PPpp')}
                                </div>
                                {selectedProcess.resolved_at && (
                                  <div>
                                    <span className="font-medium">Resolved At:</span>{' '}
                                    {format(new Date(selectedProcess.resolved_at), 'PPpp')}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProcesses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No failed processes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};