import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CacheInfo = {
  name: string;
  entries: number;
  estBytes?: number;
};

export function CacheMetrics() {
  const [cachesInfo, setCachesInfo] = useState<CacheInfo[]>([]);
  const [supported, setSupported] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (!('caches' in window)) {
          setSupported(false);
          return;
        }
        const names = await caches.keys();
        const results: CacheInfo[] = [];
        for (const name of names) {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          results.push({ name, entries: keys.length });
        }
        if (isMounted) setCachesInfo(results);
      } catch {
        // ignore
      }
    })();
    return () => { isMounted = false; };
  }, []);

  if (!supported) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Storage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {cachesInfo.length === 0 && (
          <div className="text-sm text-muted-foreground">No caches found.</div>
        )}
        {cachesInfo.map((ci) => {
          const warn = ci.name === 'images-cache' && ci.entries >= 140;
          return (
            <div key={ci.name} className="text-sm">
              <span className="font-medium">{ci.name}</span>: {ci.entries} entries {warn && (
                <span className="ml-2 text-amber-600">(near cap)</span>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default CacheMetrics;
