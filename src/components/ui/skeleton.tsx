import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'card' | 'button' | 'image';
  lines?: number;
  width?: string;
  height?: string;
}

function Skeleton({
  className,
  variant = 'text',
  lines = 1,
  width,
  height,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  const variants = {
    text: "h-4",
    avatar: "h-10 w-10 rounded-full",
    card: "h-32 w-full",
    button: "h-10 w-24",
    image: "h-48 w-full"
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variants.text,
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
            style={{ width: width, height: height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      style={{ width: width, height: height }}
      {...props}
    />
  );
}

// Specialized skeleton components for common patterns
function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-4 border rounded-lg space-y-3", className)} {...props}>
      <div className="flex items-center space-x-3">
        <Skeleton variant="avatar" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="flex justify-between">
        <Skeleton variant="button" width="80px" />
        <Skeleton variant="button" width="60px" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} variant="text" width="80%" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 border rounded">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="70%" />
            <Skeleton variant="text" width="50%" />
          </div>
          <Skeleton variant="button" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton, CardSkeleton, TableSkeleton, ListSkeleton }
