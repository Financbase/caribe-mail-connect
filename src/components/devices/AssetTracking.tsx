import React, { useState, useMemo } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, MapPin, Clock, Users, Wrench, DollarSign, CheckCircle, AlertTriangle, Search, Filter, Plus, Trash2, History, RefreshCw } from 'lucide-react';
import { useDevices } from '@/hooks/useDevices';
import { Asset, AssetStatus, MaintenanceRecord } from '@/types/devices';

interface AssetTrackingProps {
  onAssetSelect?: (asset: Asset) => void;
}

const getStatusColor = (status: AssetStatus) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'checked_out': return 'bg-blue-100 text-blue-800';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800';
    case 'retired': return 'bg-gray-100 text-gray-800';
    default: return 'bg-red-100 text-red-800';
  }
};

const getCountdown = (nextDate: string) => {
  const now = new Date();
  const next = new Date(nextDate);
  const diff = next.getTime() - now.getTime();
  if (diff <= 0) return 'Due!';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
};

export const AssetTracking: React.FC<AssetTrackingProps> = ({ onAssetSelect }) => {
  const {
    assets,
    assetsLoading,
    checkOutAsset,
    checkInAsset,
    scheduleMaintenance,
    retireAsset,
    addAsset,
    updateAsset,
    deleteAsset,
    refreshAssets
  } = useDevices();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [bulkSelection, setBulkSelection] = useState<string[]>([]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch =
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.type.toLowerCase().includes(search.toLowerCase()) ||
        asset.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [assets, search, statusFilter]);

  // Asset detail dialog
  const openDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowDetail(true);
  };

  // Bulk actions
  const handleBulkRetire = async () => {
    await Promise.all(bulkSelection.map(id => retireAsset(id)));
    setBulkSelection([]);
  };

  if (assetsLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
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
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <MapPin className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold">{assets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Wrench className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Due for Maintenance</p>
              <p className="text-2xl font-bold">{assets.filter(a => a.status === 'maintenance').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold">${assets.reduce((sum, a) => sum + (a.cost || 0), 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Asset Tracking</CardTitle>
              <CardDescription>Track equipment, check-in/out, and manage maintenance</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshAssets} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> Refresh
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Asset
              </Button>
              {bulkSelection.length > 0 && (
                <Button variant="destructive" onClick={handleBulkRetire} className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Retire ({bulkSelection.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search assets..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              className="border rounded px-3 py-2 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as AssetStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="checked_out">Checked Out</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          {/* Asset Table */}
          <ScrollArea className="max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map(asset => (
                  <TableRow key={asset.id} className={bulkSelection.includes(asset.id) ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(asset.id)}
                        onChange={e => {
                          if (e.target.checked) setBulkSelection(prev => [...prev, asset.id]);
                          else setBulkSelection(prev => prev.filter(id => id !== asset.id));
                        }}
                        aria-label={`Select asset ${asset.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium cursor-pointer" onClick={() => openDetail(asset)}>
                      {asset.name}
                    </TableCell>
                    <TableCell>{asset.type}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {asset.location}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {asset.assignedTo ? (
                        <span className="flex items-center gap-1"><Users className="h-4 w-4 text-gray-400" />{asset.assignedTo}</span>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {asset.nextMaintenance ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {getCountdown(asset.nextMaintenance)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>${asset.cost?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => openDetail(asset)}>
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredAssets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No assets found matching the current filters.</div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Asset Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>View and manage asset information</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Name:</span> {selectedAsset.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Type:</span> {selectedAsset.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Location:</span> {selectedAsset.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span> <Badge className={getStatusColor(selectedAsset.status)}>{selectedAsset.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Assigned To:</span> {selectedAsset.assignedTo || <span className="text-gray-400">Unassigned</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Cost:</span> ${selectedAsset.cost?.toLocaleString() || '-'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Next Maintenance:</span> {selectedAsset.nextMaintenance ? getCountdown(selectedAsset.nextMaintenance) : 'N/A'}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold mb-1">Maintenance History</div>
                  <ScrollArea className="h-32">
                    {selectedAsset.maintenanceHistory && selectedAsset.maintenanceHistory.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedAsset.maintenanceHistory.map((rec: MaintenanceRecord, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <History className="h-4 w-4 text-gray-400" />
                            {rec.date} - {rec.description} {rec.cost ? <span className="text-green-600">(${rec.cost})</span> : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-400 text-sm">No maintenance records.</div>
                    )}
                  </ScrollArea>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                {selectedAsset.status !== 'checked_out' && (
                  <Button size="sm" variant="outline" onClick={() => checkOutAsset(selectedAsset.id)}>
                    Check Out
                  </Button>
                )}
                {selectedAsset.status === 'checked_out' && (
                  <Button size="sm" variant="outline" onClick={() => checkInAsset(selectedAsset.id)}>
                    Check In
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => scheduleMaintenance(selectedAsset.id)}>
                  Schedule Maintenance
                </Button>
                <Button size="sm" variant="destructive" onClick={() => { retireAsset(selectedAsset.id); setShowDetail(false); }}>
                  Retire
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetail(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Asset Dialog (simplified for brevity) */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
            <DialogDescription>Register a new equipment asset</DialogDescription>
          </DialogHeader>
          {/* ...form fields for asset creation... */}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={() => setShowAddDialog(false)}>Add Asset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 