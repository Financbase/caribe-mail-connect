import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface CapturedPhoto {
  id: string;
  webPath: string;
  base64?: string;
  compressed?: Blob;
  uploadedUrl?: string;
}

export function useCamera() {
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Take a photo
  const takePhoto = async (): Promise<CapturedPhoto | null> => {
    try {
      let photo: Photo;

      if (Capacitor.isNativePlatform()) {
        // Use native camera
        photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: CameraSource.Camera,
          saveToGallery: false,
          correctOrientation: true,
        });
      } else {
        // Use web camera
        photo = await Camera.getPhoto({
          quality: 80,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera,
          width: 1920,
          height: 1080,
        });
      }

      const capturedPhoto: CapturedPhoto = {
        id: Date.now().toString(),
        webPath: photo.webPath || '',
        base64: photo.base64String,
      };

      // Compress image for web
      if (!Capacitor.isNativePlatform() && photo.base64String) {
        const compressed = await compressImage(photo.base64String);
        capturedPhoto.compressed = compressed;
      }

      setPhotos(prev => [...prev, capturedPhoto]);
      
      toast({
        title: 'Foto capturada',
        description: 'La foto se ha guardado localmente',
      });

      return capturedPhoto;
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        title: 'Error',
        description: 'No se pudo tomar la foto',
        variant: 'destructive',
      });
      return null;
    }
  };

  // Compress image for faster upload
  const compressImage = async (base64String: string, quality = 0.7): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          quality
        );
      };

      img.src = `data:image/jpeg;base64,${base64String}`;
    });
  };

  // Upload photo to Supabase storage
  const uploadPhoto = async (photo: CapturedPhoto, bucketName = 'package-photos'): Promise<string | null> => {
    try {
      setUploading(true);

      let fileToUpload: Blob;

      if (photo.compressed) {
        fileToUpload = photo.compressed;
      } else if (photo.base64) {
        // Convert base64 to blob
        const byteCharacters = atob(photo.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileToUpload = new Blob([byteArray], { type: 'image/jpeg' });
      } else {
        throw new Error('No image data available');
      }

      const fileName = `${Date.now()}-${photo.id}.jpg`;
      const filePath = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, fileToUpload, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // Update photo with uploaded URL
      setPhotos(prev => 
        prev.map(p => 
          p.id === photo.id 
            ? { ...p, uploadedUrl: publicUrl }
            : p
        )
      );

      toast({
        title: 'Foto subida',
        description: 'La foto se ha subido al servidor',
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Error de subida',
        description: 'No se pudo subir la foto. Se intentará más tarde.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Upload all pending photos
  const uploadAllPhotos = async () => {
    const pendingPhotos = photos.filter(p => !p.uploadedUrl);
    
    for (const photo of pendingPhotos) {
      await uploadPhoto(photo);
    }
  };

  // Remove photo
  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  // Clear all photos
  const clearPhotos = () => {
    setPhotos([]);
  };

  return {
    photos,
    uploading,
    takePhoto,
    uploadPhoto,
    uploadAllPhotos,
    removePhoto,
    clearPhotos,
  };
}