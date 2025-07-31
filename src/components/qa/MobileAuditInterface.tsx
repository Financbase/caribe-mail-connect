import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Save,
  Upload,
  Download,
  Wifi,
  WifiOff,
  MapPin,
  Clock,
  User,
  FileText,
  Image,
  Video,
  Mic,
  Send,
  RefreshCw
} from 'lucide-react';
import { useComplianceMonitoring } from '@/hooks/useComplianceMonitoring';
import { useToast } from '@/hooks/use-toast';

interface AuditItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  score?: number;
  notes?: string;
  photos?: string[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  timestamp?: string;
}

interface MobileAuditInterfaceProps {
  auditId: string;
  locationId: string;
  auditorId: string;
}

export const MobileAuditInterface = ({ auditId, locationId, auditorId }: MobileAuditInterfaceProps) => {
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSaving, setIsSaving] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number; address: string} | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [audioNotes, setAudioNotes] = useState<string[]>([]);

  const { updateChecklistItem } = useComplianceMonitoring();
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
            address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Load audit items (simulated data for demo)
  useEffect(() => {
    const mockAuditItems: AuditItem[] = [
      {
        id: '1',
        title: 'Package Handling Process',
        description: 'Verify proper package handling procedures are followed',
        category: 'Operations',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Documentation Accuracy',
        description: 'Check that all documentation is accurate and complete',
        category: 'Compliance',
        status: 'pending'
      },
      {
        id: '3',
        title: 'Security Measures',
        description: 'Verify security protocols are being followed',
        category: 'Security',
        status: 'pending'
      },
      {
        id: '4',
        title: 'Customer Service Standards',
        description: 'Assess customer service quality and standards',
        category: 'Service',
        status: 'pending'
      },
      {
        id: '5',
        title: 'Facility Cleanliness',
        description: 'Check facility cleanliness and organization',
        category: 'Facility',
        status: 'pending'
      }
    ];
    setAuditItems(mockAuditItems);
  }, []);

  const currentItem = auditItems[currentItemIndex];
  const completedItems = auditItems.filter(item => item.status === 'completed').length;
  const progress = auditItems.length > 0 ? (completedItems / auditItems.length) * 100 : 0;

  const handleItemStatusChange = (status: AuditItem['status']) => {
    const updatedItems = [...auditItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      status,
      timestamp: new Date().toISOString(),
      location: currentLocation || undefined
    };
    setAuditItems(updatedItems);
  };

  const handleScoreChange = (score: number) => {
    const updatedItems = [...auditItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      score
    };
    setAuditItems(updatedItems);
  };

  const handleNotesChange = (notes: string) => {
    const updatedItems = [...auditItems];
    updatedItems[currentItemIndex] = {
      ...updatedItems[currentItemIndex],
      notes
    };
    setAuditItems(updatedItems);
  };

  const handleCapturePhoto = async () => {
    try {
      // Simulate photo capture
      const photoUrl = `data:image/jpeg;base64,${btoa('mock-photo-data')}`;
      const updatedItems = [...auditItems];
      updatedItems[currentItemIndex] = {
        ...updatedItems[currentItemIndex],
        photos: [...(updatedItems[currentItemIndex].photos || []), photoUrl]
      };
      setAuditItems(updatedItems);
      setCapturedPhotos([...capturedPhotos, photoUrl]);
      
      toast({
        title: "Photo captured",
        description: "Photo has been added to the audit item.",
      });
    } catch (error) {
      toast({
        title: "Error capturing photo",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAudit = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to local storage and syncing when online
      localStorage.setItem(`audit_${auditId}`, JSON.stringify(auditItems));
      
      if (isOnline) {
        // Sync with server
        await Promise.all(
          auditItems.map(item => 
            updateChecklistItem({
              id: item.id,
              updates: {
                status: item.status,
                notes: item.notes
              }
            })
          )
        );
      }
      
      toast({
        title: "Audit saved",
        description: isOnline ? "Audit has been saved and synced." : "Audit saved locally. Will sync when online.",
      });
    } catch (error) {
      toast({
        title: "Error saving audit",
        description: "Failed to save audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextItem = () => {
    if (currentItemIndex < auditItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };

  const handlePreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };

  return (
    <div className="space-y-4 p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Field Audit</h1>
          <p className="text-sm text-muted-foreground">Location: {locationId}</p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <Badge variant={isOnline ? 'default' : 'secondary'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Audit Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Item {currentItemIndex + 1} of {auditItems.length}</span>
              <span>{completedItems} completed</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              <span>{auditItems.length - completedItems} remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Audit Item */}
      {currentItem && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentItem.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentItem.description}</p>
            <Badge variant="outline">{currentItem.category}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={currentItem.status === 'completed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange('completed')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Pass
                </Button>
                <Button
                  variant={currentItem.status === 'failed' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange('failed')}
                  className="flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Fail
                </Button>
                <Button
                  variant={currentItem.status === 'skipped' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange('skipped')}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Skip
                </Button>
                <Button
                  variant={currentItem.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleItemStatusChange('pending')}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Pending
                </Button>
              </div>
            </div>

            {/* Score (if completed) */}
            {currentItem.status === 'completed' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Score (0-100)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={currentItem.score || ''}
                  onChange={(e) => handleScoreChange(parseInt(e.target.value) || 0)}
                  placeholder="Enter score"
                />
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={currentItem.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add notes about this audit item..."
                rows={3}
              />
            </div>

            {/* Photo Capture */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Photos</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCapturePhoto}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Capture Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  Gallery
                </Button>
              </div>
              {currentItem.photos && currentItem.photos.length > 0 && (
                <div className="flex gap-2 overflow-x-auto">
                  {currentItem.photos.map((photo, index) => (
                    <div key={index} className="w-16 h-16 bg-gray-100 rounded border flex-shrink-0">
                      <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            {currentLocation && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {currentLocation.address}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePreviousItem}
          disabled={currentItemIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNextItem}
          disabled={currentItemIndex === auditItems.length - 1}
        >
          Next
        </Button>
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSaveAudit}
        disabled={isSaving}
        className="w-full"
        size="lg"
      >
        {isSaving ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Audit
          </>
        )}
      </Button>

      {/* Offline Alert */}
      {!isOnline && (
        <Alert>
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            You're currently offline. Audit data will be saved locally and synced when you're back online.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 