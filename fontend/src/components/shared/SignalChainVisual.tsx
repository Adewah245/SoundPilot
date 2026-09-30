import { cn } from '@/lib/utils';
import {
  Mic,
  SlidersHorizontal,
  Cpu,
  Zap,
  Speaker,
  Volume2,
  Radio,
  Headphones,
  Layers,
  ChevronRight,
} from 'lucide-react';
import type { EquipmentType, SignalChainNode } from '@/types';
import type { LucideIcon } from 'lucide-react';

const typeIcon: Record<EquipmentType, LucideIcon> = {
  microphone: Mic,
  mixer: SlidersHorizontal,
  processor: Cpu,
  amplifier: Zap,
  speaker: Speaker,
  subwoofer: Volume2,
  crossover: Radio,
  monitor: Headphones,
};

const typeColor: Record<EquipmentType, string> = {
  microphone: 'text-info border-info/30 bg-info/5',
  mixer: 'text-primary border-primary/30 bg-primary/5',
  processor: 'text-chart-5 border-chart-5/30 bg-chart-5/5',
  amplifier: 'text-warning border-warning/30 bg-warning/5',
  speaker: 'text-success border-success/30 bg-success/5',
  subwoofer: 'text-success border-success/30 bg-success/5',
  crossover: 'text-info border-info/30 bg-info/5',
  monitor: 'text-chart-4 border-chart-4/30 bg-chart-4/5',
};

interface SignalChainVisualProps {
  nodes: SignalChainNode[];
  className?: string;
}

export function SignalChainVisual({ nodes, className }: SignalChainVisualProps) {
  const sorted = [...nodes].sort((a, b) => a.order - b.order);
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <Layers className="h-3.5 w-3.5" />
        Signal Flow
      </div>
      <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
        {sorted.map((node, i) => {
          const Icon = typeIcon[node.type] ?? Mic;
          return (
            <div key={node.id} className="flex items-stretch shrink-0">
              <div
                className={cn(
                  'flex flex-col items-center justify-center gap-2 rounded-lg border px-4 py-3 min-w-[110px] transition-transform hover:scale-105',
                  typeColor[node.type]
                )}
              >
                <Icon className="h-6 w-6" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{node.label}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{node.type}</p>
                </div>
              </div>
              {i < sorted.length - 1 && (
                <div className="flex items-center px-1">
                  <div className="flex items-center">
                    <div className="h-px w-6 bg-border" />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
