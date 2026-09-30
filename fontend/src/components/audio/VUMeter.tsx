import { cn } from '@/lib/utils';

interface VUMeterProps {
  value: number;
  /** Minimum value in dB (e.g. -60) */
  min?: number;
  /** Maximum value in dB (e.g. 0) */
  max?: number;
  /** Label for the meter */
  label?: string;
  /** Unit to display */
  unit?: string;
  /** Show dB scale ticks */
  showScale?: boolean;
  /** Height in pixels */
  height?: number;
  className?: string;
}

// Professional vertical VU/level meter with green/amber/red zones
export function VUMeter({
  value,
  min = -60,
  max = 0,
  label,
  unit = 'dB',
  showScale = true,
  height = 160,
  className,
}: VUMeterProps) {
  const range = max - min;
  const clamped = Math.max(min, Math.min(max, value));
  const fillPercent = ((clamped - min) / range) * 100;

  // Zone boundaries: green up to -12dB, amber to -3dB, red above
  const greenEnd = ((-12 - min) / range) * 100;
  const amberEnd = ((-3 - min) / range) * 100;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <span className="font-mono-tech text-sm font-semibold text-foreground">
            {value.toFixed(1)}
            <span className="text-[10px] text-muted-foreground ml-1">{unit}</span>
          </span>
        </div>
      )}
      <div className="flex gap-2 items-stretch">
        {showScale && (
          <div className="flex flex-col justify-between text-[9px] text-muted-foreground font-mono-tech pt-0.5">
            <span>0</span>
            <span>-12</span>
            <span>-24</span>
            <span>-36</span>
            <span>-48</span>
          </div>
        )}
        <div
          className="relative flex-1 rounded-sm bg-background/60 border border-border overflow-hidden"
          style={{ height }}
        >
          {/* Zone backgrounds */}
          <div className="absolute inset-x-0 top-0 bg-error/10" style={{ height: `${100 - amberEnd}%` }} />
          <div className="absolute inset-x-0 bg-warning/10" style={{ top: `${amberEnd}%`, height: `${greenEnd - amberEnd}%` }} />
          <div className="absolute inset-x-0 bottom-0 bg-success/5" style={{ height: `${greenEnd}%` }} />

          {/* Fill bar — comes from the bottom */}
          <div
            className="absolute inset-x-0 bottom-0 transition-all duration-200 ease-out"
            style={{ height: `${fillPercent}%` }}
          >
            <div className="absolute inset-x-0 bottom-0 h-full" style={{
              background: `linear-gradient(to top,
                hsl(142 69% 45%) 0%,
                hsl(142 69% 45%) ${greenEnd}%,
                hsl(38 92% 50%) ${greenEnd}%,
                hsl(38 92% 50%) ${amberEnd}%,
                hsl(0 72% 51%) ${amberEnd}%,
                hsl(0 72% 51%) 100%)`,
            }} />
          </div>

          {/* Tick marks */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-px bg-border/50 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
