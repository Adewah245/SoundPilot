import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { generateLiveSpectrum } from '@/lib/mock-data';
import type { SpectrumBin } from '@/types';

interface SpectrumDisplayProps {
  data?: SpectrumBin[];
  live?: boolean;
  height?: number;
  className?: string;
}

// Professional frequency spectrum analyzer (RTA-style bar display)
export function SpectrumDisplay({
  data,
  live = false,
  height = 140,
  className,
}: SpectrumDisplayProps) {
  const [liveData, setLiveData] = useState<SpectrumBin[]>(data ?? generateLiveSpectrum(28));

  useEffect(() => {
    if (!live) {
      if (data) setLiveData(data);
      return;
    }
    const interval = setInterval(() => {
      setLiveData(generateLiveSpectrum(28));
    }, 100);
    return () => clearInterval(interval);
  }, [live, data]);

  const bins = liveData;

  const freqLabels = ['31', '63', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

  function getBarColor(magnitude: number): string {
    if (magnitude > 0.75) return 'bg-error';
    if (magnitude > 0.55) return 'bg-warning';
    return 'bg-success';
  }

  return (
    <div className={cn('rounded-lg border border-border bg-background/40 overflow-hidden', className)}>
      <div className="relative flex items-end gap-[2px] px-2 pt-2" style={{ height }}>
        {bins.map((bin, i) => {
          const h = Math.max(2, bin.magnitude * (height - 16));
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-100 ease-out"
              style={{
                height: `${h}px`,
                background: `linear-gradient(to top, hsl(var(--success)), hsl(var(--success) / 0.6))`,
              }}
            >
              <div
                className={cn('w-full h-full rounded-t-sm transition-all duration-100', getBarColor(bin.magnitude))}
                style={{ opacity: 0.8 }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-[2px] px-2 pb-1.5 pt-1 border-t border-border/50">
        {freqLabels.map((f, i) => (
          <div key={i} className="flex-1 text-center text-[9px] font-mono-tech text-muted-foreground">
            {f}
          </div>
        ))}
      </div>
      {live && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-success font-mono-tech">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
          LIVE
        </div>
      )}
    </div>
  );
}
