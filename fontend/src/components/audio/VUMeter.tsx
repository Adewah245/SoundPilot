import { cn } from '@/lib/utils';

interface VUMeterProps {
  value: number;
  /** Minimum value in dB */
  min?: number;
  /** Maximum value in dB */
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

// Professional segmented vertical level meter.
// The level moves while the color zones remain fixed.
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

  const clampedValue = Math.max(min, Math.min(max, value));

  const levelPercent =
    range > 0 ? ((clampedValue - min) / range) * 100 : 0;

  /*
   * Fixed signal zones:
   *
   * -60 to -36 dBFS = BLUE   → very quiet
   * -36 to -12 dBFS = GREEN  → normal working signal
   * -12 to  -3 dBFS = YELLOW → loud signal
   *  -3 to   0 dBFS = RED    → near digital clipping
   */
  const blueEnd = Math.max(
    0,
    Math.min(100, ((-36 - min) / range) * 100),
  );

  const greenEnd = Math.max(
    0,
    Math.min(100, ((-12 - min) / range) * 100),
  );

  const yellowEnd = Math.max(
    0,
    Math.min(100, ((-3 - min) / range) * 100),
  );

  // Number of individual segments in the meter.
  const segmentCount = 30;

  // How many segments should currently be illuminated?
  const activeSegments = Math.ceil(
    (levelPercent / 100) * segmentCount,
  );

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>

          <span className="font-mono-tech text-sm font-semibold text-foreground">
            {Number.isFinite(value) ? value.toFixed(1) : '-∞'}

            <span className="text-[10px] text-muted-foreground ml-1">
              {unit}
            </span>
          </span>
        </div>
      )}

      <div className="flex gap-2 items-stretch">
        {showScale && (
          <div
            className="
              flex flex-col justify-between
              text-[9px]
              text-muted-foreground
              font-mono-tech
              pt-0.5
            "
          >
            <span>{max}</span>
            <span>-3</span>
            <span>-12</span>
            <span>-24</span>
            <span>-36</span>
            <span>-48</span>
            <span>{min}</span>
          </div>
        )}

        <div
          className="
            relative
            flex-1
            rounded-sm
            bg-background/60
            border
            border-border
            overflow-hidden
            p-1
          "
          style={{ height }}
        >
          <div className="h-full flex flex-col-reverse gap-[2px]">
            {Array.from({ length: segmentCount }).map((_, index) => {
              const segmentPercent =
                ((index + 1) / segmentCount) * 100;

              const isActive = index < activeSegments;

              let segmentClass = 'bg-muted/30';

              /*
               * RED
               * -3 dBFS to 0 dBFS
               */
              if (segmentPercent > yellowEnd) {
                segmentClass = isActive
                  ? 'bg-error'
                  : 'bg-error/15';
              }

              /*
               * YELLOW
               * -12 dBFS to -3 dBFS
               */
              else if (segmentPercent > greenEnd) {
                segmentClass = isActive
                  ? 'bg-warning'
                  : 'bg-warning/15';
              }

              /*
               * GREEN
               * -36 dBFS to -12 dBFS
               */
              else if (segmentPercent > blueEnd) {
                segmentClass = isActive
                  ? 'bg-success'
                  : 'bg-success/15';
              }

              /*
               * BLUE
               * -60 dBFS to -36 dBFS
               */
              else {
                segmentClass = isActive
                  ? 'bg-blue-500'
                  : 'bg-blue-500/15';
              }

              return (
                <div
                  key={index}
                  className={cn(
                    'flex-1 rounded-[1px] transition-opacity duration-75',
                    segmentClass,
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}