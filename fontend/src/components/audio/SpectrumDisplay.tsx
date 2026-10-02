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

// Professional frequency spectrum analyzer (RTA-style bar display).
export function SpectrumDisplay({
  data,
  live = false,
  height = 140,
  className,
}: SpectrumDisplayProps) {
  const [liveData, setLiveData] = useState<SpectrumBin[]>(
    data ?? generateLiveSpectrum(28),
  );

  useEffect(() => {
    if (!live) {
      setLiveData(data ?? []);
      return;
    }

    const interval = setInterval(() => {
      setLiveData(generateLiveSpectrum(28));
    }, 100);

    return () => clearInterval(interval);
  }, [live, data]);

  const bins = liveData;

  const freqLabels = [
    '31',
    '63',
    '125',
    '250',
    '500',
    '1k',
    '2k',
    '4k',
    '8k',
    '16k',
  ];

  function getBarColor(magnitude: number): string {
    if (magnitude >= 0.85) {
      return 'bg-error';
    }

    if (magnitude >= 0.65) {
      return 'bg-warning';
    }

    return 'bg-success';
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-background/40 overflow-hidden',
        className,
      )}
    >
      <div
        className="relative flex items-end gap-[2px] px-2 pt-2"
        style={{ height }}
      >
        {bins.map((bin, index) => {
          const magnitude = Math.max(
            0,
            Math.min(1, bin.magnitude),
          );

          const barHeight = Math.max(
            2,
            magnitude * (height - 16),
          );

          return (
            <div
              key={`${bin.freq}-${index}`}
              className="flex-1 h-full flex items-end"
            >
              <div
                className={cn(
                  'w-full rounded-t-sm transition-[height] duration-75 ease-out',
                  getBarColor(magnitude),
                )}
                style={{
                  height: `${barHeight}px`,
                  opacity: 0.85,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-[2px] px-2 pb-1.5 pt-1 border-t border-border/50">
        {freqLabels.map((frequency, index) => (
          <div
            key={index}
            className="flex-1 text-center text-[9px] font-mono-tech text-muted-foreground"
          >
            {frequency}
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