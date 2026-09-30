import { cn } from '@/lib/utils';

type StatusType = 'optimal' | 'warning' | 'critical' | 'idle' | 'accepted' | 'needs_adjustment' | 'rejected' | 'active' | 'standby' | 'fault' | 'offline' | 'running' | 'stopped' | 'saved' | 'failed' | 'completed' | 'archived' | 'info';

const statusConfig: Record<string, { color: string; dot: string; label: string }> = {
  optimal: { color: 'text-success', dot: 'bg-success', label: 'Optimal' },
  warning: { color: 'text-warning', dot: 'bg-warning', label: 'Warning' },
  critical: { color: 'text-error', dot: 'bg-error', label: 'Critical' },
  idle: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Idle' },
  accepted: { color: 'text-success', dot: 'bg-success', label: 'Accepted' },
  needs_adjustment: { color: 'text-warning', dot: 'bg-warning', label: 'Needs Adjustment' },
  rejected: { color: 'text-error', dot: 'bg-error', label: 'Rejected' },
  active: { color: 'text-success', dot: 'bg-success', label: 'Active' },
  standby: { color: 'text-info', dot: 'bg-info', label: 'Standby' },
  fault: { color: 'text-error', dot: 'bg-error', label: 'Fault' },
  offline: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Offline' },
  running: { color: 'text-success', dot: 'bg-success', label: 'Running' },
  stopped: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Stopped' },
  saved: { color: 'text-info', dot: 'bg-info', label: 'Saved' },
  failed: { color: 'text-error', dot: 'bg-error', label: 'Failed' },
  completed: { color: 'text-info', dot: 'bg-info', label: 'Completed' },
  archived: { color: 'text-muted-foreground', dot: 'bg-muted-foreground', label: 'Archived' },
  info: { color: 'text-info', dot: 'bg-info', label: 'Info' },
};

interface StatusIndicatorProps {
  status: StatusType | string;
  label?: string;
  pulse?: boolean;
  className?: string;
}

export function StatusIndicator({ status, label, pulse, className }: StatusIndicatorProps) {
  const cfg = statusConfig[status] ?? statusConfig.idle;
  const displayLabel = label ?? cfg.label;
  const shouldPulse = pulse ?? (status === 'critical' || status === 'fault' || status === 'running');

  return (
    <span className={cn('inline-flex items-center gap-2 text-sm font-medium', cfg.color, className)}>
      <span
        className={cn('h-2 w-2 rounded-full shrink-0', cfg.dot, shouldPulse && 'pulse-ring')}
      />
      {displayLabel}
    </span>
  );
}
