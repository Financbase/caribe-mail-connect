import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bug, Eye, Edit, Plus } from 'lucide-react';
import { useQA, type UserErrorReport } from '@/hooks/useQA';
import { format } from 'date-fns';

export const ErrorReportsManager = () => {
  const { errorReports, createErrorReport, updateErrorReport } = useQA();
  const [selectedReport, setSelectedReport] = useState<UserErrorReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    error_type: 'ui_error' as const,
    priority: 'medium' as const,
    steps_to_reproduce: '',
    expected_behavior: '',
    actual_behavior: ''
  });

  const filteredReports = errorReports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && report.priority !== priorityFilter) return false;
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: 'destructive',
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'outline'}>
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'destructive',
      triaged: 'secondary',
      in_progress: 'default',
      resolved: 'default',
      closed: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleCreateReport = () => {
    createErrorReport({
      ...newReport,
      status: 'open' as const,
      browser_info: {
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
    setNewReport({
      title: '',
      description: '',
      error_type: 'ui_error',
      priority: 'medium',
      steps_to_reproduce: '',
      expected_behavior: '',
      actual_behavior: ''
    });
    setShowCreateDialog(false);
  };

  const handleUpdateStatus = (reportId: string, status: 'open' | 'triaged' | 'in_progress' | 'resolved' | 'closed') => {
    updateErrorReport({
      id: reportId,
      updates: { status }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Reports Manager
            </CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Report Error
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Error Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newReport.title}
                      onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                      placeholder="Brief description of the error"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Error Type</label>
                      <Select
                        value={newReport.error_type}
                        onValueChange={(value: string) => setNewReport({ ...newReport, error_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ui_error">UI Error</SelectItem>
                          <SelectItem value="functionality_error">Functionality Error</SelectItem>
                          <SelectItem value="performance_issue">Performance Issue</SelectItem>
                          <SelectItem value="data_error">Data Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select
                        value={newReport.priority}
                        onValueChange={(value: string) => setNewReport({ ...newReport, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newReport.description}
                      onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                      placeholder="Detailed description of the error"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Steps to Reproduce</label>
                    <Textarea
                      value={newReport.steps_to_reproduce}
                      onChange={(e) => setNewReport({ ...newReport, steps_to_reproduce: e.target.value })}
                      placeholder="Step-by-step instructions to reproduce the error"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Expected Behavior</label>
                    <Textarea
                      value={newReport.expected_behavior}
                      onChange={(e) => setNewReport({ ...newReport, expected_behavior: e.target.value })}
                      placeholder="What should have happened"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Actual Behavior</label>
                    <Textarea
                      value={newReport.actual_behavior}
                      onChange={(e) => setNewReport({ ...newReport, actual_behavior: e.target.value })}
                      placeholder="What actually happened"
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateReport} disabled={!newReport.title || !newReport.description}>
                      Create Report
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                <SelectItem value="triaged">Triaged</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error Reports Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {report.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.error_type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                    <TableCell>{getStatusBadge(report.status)}</TableCell>
                    <TableCell>
                      {format(new Date(report.reported_at), 'MMM d, HH:mm')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Error Report Details</DialogTitle>
                            </DialogHeader>
                            {selectedReport && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedReport.error_type.replace('_', ' ')}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Priority</label>
                                    <div className="mt-1">
                                      {getPriorityBadge(selectedReport.priority)}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedReport.description}
                                  </p>
                                </div>

                                {selectedReport.steps_to_reproduce && (
                                  <div>
                                    <label className="text-sm font-medium">Steps to Reproduce</label>
                                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                      {selectedReport.steps_to_reproduce}
                                    </p>
                                  </div>
                                )}

                                {selectedReport.expected_behavior && (
                                  <div>
                                    <label className="text-sm font-medium">Expected Behavior</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedReport.expected_behavior}
                                    </p>
                                  </div>
                                )}

                                {selectedReport.actual_behavior && (
                                  <div>
                                    <label className="text-sm font-medium">Actual Behavior</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedReport.actual_behavior}
                                    </p>
                                  </div>
                                )}

                                {selectedReport.resolution_notes && (
                                  <div>
                                    <label className="text-sm font-medium">Resolution Notes</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {selectedReport.resolution_notes}
                                    </p>
                                  </div>
                                )}

                                <div className="flex gap-2">
                                  <Select
                                    value={selectedReport.status}
                                    onValueChange={(value: string) => handleUpdateStatus(selectedReport.id, value)}
                                  >
                                    <SelectTrigger className="w-40">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="triaged">Triaged</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No error reports found
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