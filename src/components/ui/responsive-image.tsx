import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * ResponsiveImage component with automatic srcset generation and lazy loading
 * Supports modern formats (WebP, AVIF) with JPEG fallback
 * Optimized for Caribbean Mail Connect's mobile-first approach
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  width,
  height,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  // Generate responsive image URLs using vite-imagetools
  const generateSrcSet = (baseSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1536];
    
    return widths.map(width => {
      // Use vite-imagetools syntax for responsive images
      const webpSrc = `${baseSrc}?format=webp&w=${width}`;
      const avifSrc = `${baseSrc}?format=avif&w=${width}`;
      const jpegSrc = `${baseSrc}?format=jpeg&w=${width}`;
      
      return {
        webp: `${webpSrc} ${width}w`,
        avif: `${avifSrc} ${width}w`,
        jpeg: `${jpegSrc} ${width}w`,
      };
    });
  };

  const srcSets = generateSrcSet(src);
  
  // Create srcset strings for each format
  const webpSrcSet = srcSets.map(set => set.webp).join(', ');
  const avifSrcSet = srcSets.map(set => set.avif).join(', ');
  const jpegSrcSet = srcSets.map(set => set.jpeg).join(', ');

  return (
    <picture className={cn('block', className)}>
      {/* AVIF format for maximum compression */}
      <source
        srcSet={avifSrcSet}
        sizes={sizes}
        type="image/avif"
      />
      
      {/* WebP format for broad modern browser support */}
      <source
        srcSet={webpSrcSet}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* JPEG fallback for legacy browsers */}
      <source
        srcSet={jpegSrcSet}
        sizes={sizes}
        type="image/jpeg"
      />
      
      {/* Main img element with lazy loading */}
      <img
        src={`${src}?format=jpeg&w=768`} // Default fallback
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={onLoad}
        onError={onError}
        className={cn(
          'w-full h-auto',
          'transition-opacity duration-300',
          className
        )}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
    </picture>
  );
}

// Higher-order component for easy migration from existing img tags
export function withResponsiveImage<T extends { src: string; alt: string }>(
  Component: React.ComponentType<T>
) {
  return function ResponsiveImageWrapper(props: T) {
    const { src, alt, ...rest } = props;
    
    return (
      <ResponsiveImage
        src={src}
        alt={alt}
        {...(rest as any)}
      />
    );
  };
}

// Preload function for critical images
export function preloadImage(src: string, formats: ('webp' | 'avif' | 'jpeg')[] = ['webp', 'jpeg']) {
  formats.forEach(format => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = `${src}?format=${format}&w=768`;
    link.type = `image/${format}`;
    document.head.appendChild(link);
  });
}

export default ResponsiveImage;
