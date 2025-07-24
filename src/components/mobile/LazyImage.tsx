import React, { useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder,
  width,
  height,
  quality = 75,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use intersection observer to load image when in view
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Load image when in view
  React.useEffect(() => {
    if (inView && !imageSrc && !hasError) {
      // Optimize image URL if it's from Supabase
      let optimizedSrc = src;
      if (src.includes('supabase.co') && (width || height)) {
        const url = new URL(src);
        if (width) url.searchParams.set('width', width.toString());
        if (height) url.searchParams.set('height', height.toString());
        url.searchParams.set('quality', quality.toString());
        optimizedSrc = url.toString();
      }
      
      setImageSrc(optimizedSrc);
    }
  }, [inView, src, imageSrc, hasError, width, height, quality]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <Skeleton 
          className="absolute inset-0 w-full h-full"
          style={{ width, height }}
        />
      )}

      {/* Placeholder for errors */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-muted flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-center text-muted-foreground">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-xs">Error al cargar imagen</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {imageSrc && !hasError && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ width, height }}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Blur placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${placeholder})`,
            width,
            height,
          }}
        />
      )}
    </div>
  );
}