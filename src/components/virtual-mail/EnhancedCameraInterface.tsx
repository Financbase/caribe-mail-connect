import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Camera, Settings, Download, RotateCcw, Crop, Zap, Focus } from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useToast } from '@/hooks/use-toast';

interface EnhancedCameraInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photos: any[]) => void;
  title?: string;
  description?: string;
}

interface CameraSettings {
  quality: number;
  resolution: string;
  format: string;
  flash: boolean;
  autoFocus: boolean;
  stabilization: boolean;
}

export function EnhancedCameraInterface({
  isOpen,
  onClose,
  onCapture,
  title = "Capture Documents",
  description = "Take high-quality photos of mail pieces or documents"
}: EnhancedCameraInterfaceProps) {
  const { takePhoto, photos, removePhoto, clearPhotos, uploadPhoto, uploading: isUploading } = useCamera();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
  const [settings, setSettings] = useState<CameraSettings>({
    quality: 85,
    resolution: '1920x1080',
    format: 'jpeg',
    flash: false,
    autoFocus: true,
    stabilization: true
  });

  const startCamera = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: parseInt(settings.resolution.split('x')[0]) },
          height: { ideal: parseInt(settings.resolution.split('x')[1]) },
          facingMode: 'environment' // Use back camera for documents
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCurrentStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [settings, toast]);

  const stopCamera = useCallback(() => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
  }, [currentStream]);

  const capturePhoto = useCallback(async () => {
    try {
      const photo = await takePhoto();
      if (photo) {
        setIsPreviewMode(true);
        toast({
          title: "Photo Captured",
          description: "Photo captured successfully. Review and adjust if needed.",
        });
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Capture Error",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive",
      });
    }
  }, [takePhoto, toast]);

  const enhanceImage = useCallback((photo: any) => {
    if (!canvasRef.current) return photo;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return photo;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply image enhancements
      ctx.filter = 'contrast(110%) brightness(105%) saturate(110%)';
      ctx.drawImage(img, 0, 0);
      
      // Auto-crop detection (simplified)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // ... implement auto-crop logic here
      
      return canvas.toDataURL('image/jpeg', settings.quality / 100);
    };
    img.src = photo.webPath;
    
    return photo;
  }, [settings.quality]);

  const handleSavePhotos = async () => {
    try {
      if (photos.length === 0) {
        toast({
          title: "No Photos",
          description: "Please capture at least one photo before saving.",
          variant: "destructive",
        });
        return;
      }

      // Upload photos to storage
      for (const photo of photos) {
        await uploadPhoto(photo, 'documents');
      }

      onCapture(photos);
      clearPhotos();
      onClose();
      
      toast({
        title: "Success",
        description: `${photos.length} photo(s) saved successfully.`,
      });
    } catch (error) {
      console.error('Error saving photos:', error);
      toast({
        title: "Save Error",
        description: "Failed to save photos. Please try again.",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (isOpen && !isPreviewMode) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, isPreviewMode, startCamera, stopCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Camera Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Quality</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[settings.quality]}
                  onValueChange={([value]) => setSettings(prev => ({ ...prev, quality: value }))}
                  max={100}
                  min={50}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">{settings.quality}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                value={settings.resolution}
                onValueChange={(value) => setSettings(prev => ({ ...prev, resolution: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280x720">HD (720p)</SelectItem>
                  <SelectItem value="1920x1080">Full HD (1080p)</SelectItem>
                  <SelectItem value="2560x1440">2K (1440p)</SelectItem>
                  <SelectItem value="3840x2160">4K (2160p)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Enhancement Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.autoFocus}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoFocus: checked }))}
                  />
                  <Label className="text-sm">Auto Focus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.stabilization}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, stabilization: checked }))}
                  />
                  <Label className="text-sm">Stabilization</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Preview */}
          {!isPreviewMode && (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />
              
              {/* Camera overlay guides */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-4 border-2 border-white/50 border-dashed rounded-lg">
                  <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                    Position document within guides
                  </div>
                </div>
              </div>

              {/* Capture button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="rounded-full w-16 h-16 bg-white hover:bg-gray-100"
                  variant="outline"
                >
                  <Camera className="h-6 w-6 text-black" />
                </Button>
              </div>

              {/* Settings toggle */}
              <div className="absolute top-4 right-4">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Photo Preview Grid */}
          {photos.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Captured Photos ({photos.length})</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsPreviewMode(false)}>
                    <Camera className="h-4 w-4 mr-1" />
                    Capture More
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearPhotos}>
                    Clear All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.webPath}
                      alt={`Captured ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => enhanceImage(photo)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="space-x-2">
              {photos.length > 0 && (
                <Button onClick={handleSavePhotos} disabled={isUploading}>
                  {isUploading ? "Saving..." : `Save ${photos.length} Photo(s)`}
                  <Download className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}