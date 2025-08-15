import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LowBandwidthLayoutProps {
  children: React.ReactNode;
  className?: string;
  fallbackContent?: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
}

interface NetworkInfo {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

const useNetworkConditions = () => {
  const [networkInfo, setNetworkInfo] = useState<Partial<NetworkInfo>>({});
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Check for Network Information API
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (connection) {
      const updateConnectionInfo = () => {
        const info: Partial<NetworkInfo> = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        };
        
        setNetworkInfo(info);
        
        // Determine if connection is slow
        const isSlowNetwork = 
          info.effectiveType === '2g' || 
          info.effectiveType === 'slow-2g' ||
          (info.downlink && info.downlink < 1.5) ||
          (info.rtt && info.rtt > 300) ||
          info.saveData;
          
        setIsSlowConnection(isSlowNetwork);
      };

      updateConnectionInfo();
      connection.addEventListener('change', updateConnectionInfo);

      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    } else {
      // Fallback: detect slow connection via timing
      const measureConnectionSpeed = async () => {
        try {
          const startTime = performance.now();
          // Small image test for speed detection
          const response = await fetch('/favicon.ico', { cache: 'no-cache' });
          const endTime = performance.now();
          
          const duration = endTime - startTime;
          const isSlowFallback = duration > 1000; // > 1 second for favicon
          
          setIsSlowConnection(isSlowFallback);
        } catch (error) {
          // Assume slow connection if test fails
          setIsSlowConnection(true);
        }
      };

      measureConnectionSpeed();
    }
  }, []);

  return { networkInfo, isSlowConnection };
};

/**
 * Layout component that adapts to low-bandwidth conditions
 * Optimizes rendering for Puerto Rico's variable internet infrastructure
 */
export const LowBandwidthLayout: React.FC<LowBandwidthLayoutProps> = ({
  children,
  className,
  fallbackContent,
  priority = 'medium'
}) => {
  const { networkInfo, isSlowConnection } = useNetworkConditions();
  
  const optimizationLevel = useMemo(() => {
    if (isSlowConnection) {
      switch (priority) {
        case 'high':
          return 'minimal'; // Show only essential content
        case 'medium':
          return 'reduced'; // Show simplified version
        case 'low':
          return 'deferred'; // Defer loading
        default:
          return 'reduced';
      }
    }
    return 'full';
  }, [isSlowConnection, priority]);

  // Show loading placeholder for deferred content
  if (optimizationLevel === 'deferred') {
    return (
      <div className={cn(
        "flex items-center justify-center p-4 text-center",
        "bg-gray-50 rounded-lg border border-dashed border-gray-300",
        className
      )}>
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Contenido diferido para conservar datos
          </div>
          <div className="text-xs text-gray-500">
            Deferred content to conserve data
          </div>
          <button 
            className="px-3 py-1 text-xs bg-primary-ocean text-white rounded"
            onClick={() => window.location.reload()}
          >
            Cargar / Load
          </button>
        </div>
      </div>
    );
  }

  // Show fallback content for minimal optimization
  if (optimizationLevel === 'minimal' && fallbackContent) {
    return (
      <div className={cn("low-bandwidth-minimal", className)}>
        {fallbackContent}
      </div>
    );
  }

  // Apply reduced optimization styles
  const optimizedClassName = cn(
    className,
    {
      'low-bandwidth-reduced': optimizationLevel === 'reduced',
      'low-bandwidth-minimal': optimizationLevel === 'minimal'
    }
  );

  return (
    <div className={optimizedClassName} data-bandwidth-optimization={optimizationLevel}>
      {children}
      
      {/* Debug info for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-2 right-2 text-xs bg-black text-white px-2 py-1 rounded opacity-50">
          {networkInfo.effectiveType || 'unknown'} | {optimizationLevel}
        </div>
      )}
    </div>
  );
};

/**
 * Hook to get current bandwidth optimization level
 */
export const useBandwidthOptimization = () => {
  const { networkInfo, isSlowConnection } = useNetworkConditions();
  
  return {
    isSlowConnection,
    effectiveType: networkInfo.effectiveType,
    saveData: networkInfo.saveData,
    downlink: networkInfo.downlink,
    rtt: networkInfo.rtt,
    shouldOptimize: isSlowConnection || networkInfo.saveData
  };
};

/**
 * Component for bandwidth-aware image loading
 */
interface BandwidthAwareImageProps {
  src: string;
  lowBandwidthSrc?: string;
  alt: string;
  className?: string;
}

export const BandwidthAwareImage: React.FC<BandwidthAwareImageProps> = ({
  src,
  lowBandwidthSrc,
  alt,
  className
}) => {
  const { shouldOptimize } = useBandwidthOptimization();
  
  const imageSrc = shouldOptimize && lowBandwidthSrc ? lowBandwidthSrc : src;
  
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

export default LowBandwidthLayout;
