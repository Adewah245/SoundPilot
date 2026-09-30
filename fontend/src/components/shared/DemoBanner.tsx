import { cn } from '@/lib/utils';
import { Database } from 'lucide-react';

interface DemoBannerProps {
  isDemo: boolean;
  className?: string;
  message?: string;
}

export function DemoBanner({ isDemo, className, message }: DemoBannerProps) {
  if (!isDemo) return null;
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs',
        className
      )}
    >
      <Database className="h-3.5 w-3.5 text-warning shrink-0" />
      <span className="text-warning">
        {message ?? 'Demo data — connect the Go API via VITE_API_BASE_URL to show live measurements.'}
      </span>
    </div>
  );
}
