import React, { useEffect, useMemo, useState } from 'react';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  cacheName?: string;
  placeholderSrc?: string; // low-res or base64 placeholder
  fadeInDurationMs?: number; // fade duration when swapping placeholder->full
};

export function CachedImage({ src, cacheName = 'prmcms-assets', placeholderSrc, fadeInDurationMs = 200, style, className, ...imgProps }: Props) {
  const [url, setUrl] = useState<string>(placeholderSrc || src);
  const [isPlaceholder, setIsPlaceholder] = useState<boolean>(!!placeholderSrc);

  const mergedStyle: React.CSSProperties | undefined = useMemo(() => {
    if (!fadeInDurationMs) return style;
    return {
      ...style,
      transition: `filter ${fadeInDurationMs}ms ease, opacity ${fadeInDurationMs}ms ease` ,
      filter: isPlaceholder ? 'blur(8px)' : 'blur(0)',
      opacity: isPlaceholder ? 0.85 : 1,
    };
  }, [style, isPlaceholder, fadeInDurationMs]);

  useEffect(() => {
    let revoked: string | null = null;
    (async () => {
      try {
        if (!('caches' in window)) return; // graceful no-op
        const cache = await caches.open(cacheName);
        const match = await cache.match(src);
        if (match) {
          const blob = await match.blob();
          const objectUrl = URL.createObjectURL(blob);
          revoked = objectUrl;
          setUrl(objectUrl);
          setIsPlaceholder(false);
        } else {
          const res = await fetch(src, { cache: 'no-store' });
          if (res.ok) {
            cache.put(src, res.clone());
            const blob = await res.blob();
            const objectUrl = URL.createObjectURL(blob);
            revoked = objectUrl;
            setUrl(objectUrl);
            setIsPlaceholder(false);
          }
        }
      } catch {
        setUrl(src);
        setIsPlaceholder(false);
      }
    })();
    return () => {
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [src, cacheName]);

  return <img {...imgProps} src={url} style={mergedStyle} className={className} />;
}
