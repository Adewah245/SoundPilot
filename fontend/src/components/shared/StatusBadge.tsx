import { cn } from '@/lib/utils';
import type { EngineeringStatus, VerificationStatus } from '@/types';

type BadgeStatus = EngineeringStatus | VerificationStatus;

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

const config: Record<BadgeStatus, { label: string; classes: string }> = {
  accepted: { label: 'Accepted', classes: 'bg-success/15 text-success border-success/30' },
  needs_adjustment: { label: 'Needs Adjustment', classes: 'bg-warning/15 text-warning border-warning/30' },
  rejected: { label: 'Rejected', classes: 'bg-error/15 text-error border-error/30' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const cfg = config[status] ?? { label: status, classes: 'bg-muted text-muted-foreground border-border' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
        cfg.classes,
        className
      )}
    >
      {cfg.label}
    </span>
  );
}
