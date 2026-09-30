import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { AlertSeverity } from '@/types';

interface AlertBadgeProps {
  severity: AlertSeverity;
  className?: string;
}

const config = {
  info: { icon: Info, color: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  critical: { icon: XCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
};

export function AlertBadge({ severity, className }: AlertBadgeProps) {
  const cfg = config[severity];
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium',
        cfg.color,
        cfg.bg,
        cfg.border,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function SuccessCheck({ className }: { className?: string }) {
  return <CheckCircle2 className={cn('h-4 w-4 text-success', className)} />;
}
