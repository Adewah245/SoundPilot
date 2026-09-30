import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { generateLiveWaveform } from '@/lib/mock-data';

interface WaveformDisplayProps {
  /** Static waveform data (-1.0 to 1.0) */
  data?: number[];
  /** Animated live mode — generates data continuously */
  live?: boolean;
  height?: number;
  className?: string;
  color?: string;
}

// Professional waveform display — renders an oscilloscope-style view
export function WaveformDisplay({
  data,
  live = false,
  height = 120,
  className,
  color = 'hsl(var(--primary))',
}: WaveformDisplayProps) {
  const [liveData, setLiveData] = useState<number[]>(data ?? generateLiveWaveform(60));
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!live) {
      if (data) setLiveData(data);
      return;
    }
    const interval = setInterval(() => {
      setLiveData(generateLiveWaveform(60));
    }, 120);
    return () => clearInterval(interval);
  }, [live, data]);

  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const samples = liveData;
  const width = 100;
  const center = height / 2;
  const step = width / (samples.length - 1);

  const path = samples
    .map((v, i) => {
      const x = i * step;
      const y = center - v * (center * 0.85);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const areaPath = `${path} L${width},${center} L0,${center} Z`;

  return (
    <div
      className={cn('relative rounded-lg border border-border bg-background/40 grid-bg overflow-hidden', className)}
      style={{ height }}
    >
      {/* Center line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-border/60" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="wf-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#wf-gradient)" />
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          vectorEffect="non-scaling-stroke"
          className="transition-all duration-100"
        />
      </svg>
      {live && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-success font-mono-tech">
          <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
          LIVE
        </div>
      )}
    </div>
  );
}
