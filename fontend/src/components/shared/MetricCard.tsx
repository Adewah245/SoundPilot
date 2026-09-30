import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  subtext?: string;
  className?: string;
}

const statusColor = {
  good: 'text-success',
  warning: 'text-warning',
  critical: 'text-error',
  neutral: 'text-foreground',
};

const statusBorder = {
  good: 'border-success/30',
  warning: 'border-warning/30',
  critical: 'border-error/30',
  neutral: 'border-border',
};

export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  status = 'neutral',
  subtext,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 transition-colors hover:bg-accent/30',
        statusBorder[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {Icon && <Icon className={cn('h-4 w-4', statusColor[status])} />}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className={cn('font-mono-tech text-2xl font-bold', statusColor[status])}>
          {value}
        </span>
        {unit && <span className="text-xs text-muted-foreground font-mono-tech">{unit}</span>}
      </div>
      {subtext && <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>}
    </div>
  );
}
