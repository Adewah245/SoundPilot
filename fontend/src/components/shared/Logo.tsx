import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { mark: 'h-7 w-7', bar: 'w-[3px]', text: 'text-base' },
  md: { mark: 'h-9 w-9', bar: 'w-[4px]', text: 'text-lg' },
  lg: { mark: 'h-12 w-12', bar: 'w-[5px]', text: 'text-2xl' },
};

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg bg-card border border-border overflow-hidden',
          s.mark
        )}
      >
        <div className="flex items-end gap-[2px] h-full py-1.5">
          <div className={cn(s.bar, 'h-[40%] rounded-full bg-success/60')} />
          <div className={cn(s.bar, 'h-[70%] rounded-full bg-success')} />
          <div className={cn(s.bar, 'h-[45%] rounded-full bg-warning')} />
          <div className={cn(s.bar, 'h-[25%] rounded-full bg-error/60')} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-bold tracking-tight', s.text)}>
            Sound<span className="text-primary">Pilot</span>
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase mt-0.5">
            Measure · Understand · Adjust · Verify
          </span>
        </div>
      )}
    </div>
  );
}
