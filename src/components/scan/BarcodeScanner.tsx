import React, { useEffect, useRef, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  onDetected: (text: string) => void;
  onError?: (err: unknown) => void;
  active?: boolean; // start scanner automatically
};

// Lightweight wrapper around @zxing/browser, loaded dynamically to avoid SSR/bundle issues
export function BarcodeScanner({ onDetected, onError, active = true }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState<boolean>(active);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const { language } = useLanguage();
  const isSpanish = language === 'es';

  useEffect(() => {
    let codeReader: any;
    let stopped = false;

    async function start() {
      try {
        if (!isActive || !videoRef.current) return;
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        codeReader = new BrowserMultiFormatReader();

        // Request camera permission and start continuous decode
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasPermission(true);
        if (videoRef.current) videoRef.current.srcObject = stream;

        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          async (result: any, err: any) => {
            if (stopped) return;
            if (result?.getText) {
              stopped = true;
              try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch {}
              onDetected(result.getText());
              controls?.stop();
              // stop stream tracks
              const v = videoRef.current as HTMLVideoElement | null;
              (v?.srcObject as MediaStream | null)?.getTracks().forEach(t => t.stop());
            }
          }
        );
      } catch (e) {
        setHasPermission(false);
        onError?.(e);
      }
    }

    start();
    return () => {
      try {
        stopped = true;
        // stop stream
        const v = videoRef.current as HTMLVideoElement | null;
        (v?.srcObject as MediaStream | null)?.getTracks().forEach(t => t.stop());
        // reset srcObject
        if (v) v.srcObject = null;
        // reset zxing instance
        if (codeReader?.reset) codeReader.reset();
      } catch {}
    };
  }, [isActive]);

  return (
    <div className="relative">
      <div className="aspect-video rounded-lg overflow-hidden border border-border bg-black/60">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
      </div>
      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-32 border-2 border-primary rounded-lg relative">
          <div className="absolute -top-1 -left-1 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
        </div>
      </div>
      {!hasPermission && (
        <div className="mt-2 text-sm text-muted-foreground space-y-1">
          <p>{isSpanish ? 'Permite acceso a la cámara para escanear.' : 'Allow camera access to scan.'}</p>
          <p>
            {isSpanish
              ? 'En iPhone/iOS, usa HTTPS o instala la app (PWA) para habilitar la cámara.'
              : 'On iPhone/iOS, use HTTPS or install the app (PWA) to enable camera access.'}
          </p>
        </div>
      )}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm"
          onClick={() => setIsActive(true)}
        >
          {isSpanish ? 'Iniciar' : 'Start'}
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm"
          onClick={() => setIsActive(false)}
        >
          {isSpanish ? 'Detener' : 'Stop'}
        </button>
      </div>
    </div>
  );
}
