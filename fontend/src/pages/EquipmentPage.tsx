import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { SignalChainVisual } from '@/components/shared/SignalChainVisual';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import {
  Package,
  Mic,
  SlidersHorizontal,
  Cpu,
  Zap,
  Speaker,
  Volume2,
  Radio,
  Headphones,
  Boxes,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as api from '@/lib/api';
import type { Equipment, EquipmentType, SignalChain } from '@/types';

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

export function EquipmentPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [signalChain, setSignalChain] = useState<SignalChain | null>(null);
  const [filter, setFilter] = useState<EquipmentType | 'all'>('all');

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [eqRes, scRes] = await Promise.all([
      api.getEquipment('v-001'),
      api.getSignalChain('v-001'),
    ]);
    setIsDemo(eqRes.isDemo || scRes.isDemo);
    setEquipment(eqRes.data);
    setSignalChain(scRes.data);
    setLoading(false);
  }

  if (loading) return <Loading label="Loading equipment..." />;

  const types: (EquipmentType | 'all')[] = ['all', 'mixer', 'speaker', 'subwoofer', 'amplifier', 'crossover', 'microphone', 'processor', 'monitor'];
  const filtered = filter === 'all' ? equipment : equipment.filter((e) => e.type === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Sound system equipment inventory and signal chain"
        icon={<Package className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="signal-chain">Signal Chain</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                  filter === t
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                {t === 'all' ? 'All Equipment' : t}
              </button>
            ))}
          </div>

          {/* Equipment grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((eq) => {
              const Icon = typeIcon[eq.type] ?? Boxes;
              return (
                <Card key={eq.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/40 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <StatusIndicator status={eq.status} />
                    </div>
                    <h3 className="text-sm font-semibold">{eq.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{eq.brand} {eq.model}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{eq.type}</Badge>
                      {eq.quantity > 1 && (
                        <Badge variant="outline" className="text-[10px]">×{eq.quantity}</Badge>
                      )}
                    </div>
                    {Object.keys(eq.specs).length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-1">
                          {Object.entries(eq.specs).map(([key, val]) => (
                            <div key={key} className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span className="font-mono-tech text-foreground">{val}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {eq.notes && (
                      <p className="text-[10px] text-muted-foreground mt-2 italic">{eq.notes}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              icon={<Package className="h-6 w-6 text-muted-foreground" />}
              title="No equipment found"
              description="No equipment matches this filter."
            />
          )}
        </TabsContent>

        {/* Signal Chain Tab */}
        <TabsContent value="signal-chain" className="space-y-4">
          {signalChain ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{signalChain.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Audio signal flow from microphone to speaker
                  </p>
                </CardHeader>
                <CardContent>
                  <SignalChainVisual nodes={signalChain.nodes} />
                </CardContent>
              </Card>

              {/* Detailed chain breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Chain Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {signalChain.nodes
                      .sort((a, b) => a.order - b.order)
                      .map((node, i) => {
                        const eq = equipment.find((e) => e.id === node.equipmentId);
                        const Icon = typeIcon[node.type] ?? Boxes;
                        return (
                          <div key={node.id}>
                            <div className="flex items-center gap-4 rounded-lg border border-border bg-background/40 p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-mono-tech text-xs font-bold">
                                {i + 1}
                              </div>
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold">{node.label}</p>
                                {eq && (
                                  <p className="text-xs text-muted-foreground">
                                    {eq.brand} {eq.model} · {eq.quantity} unit{eq.quantity > 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                              {eq && <StatusIndicator status={eq.status} />}
                            </div>
                            {i < signalChain.nodes.length - 1 && (
                              <div className="flex justify-center py-1">
                                <div className="h-4 w-px bg-border" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={<Package className="h-6 w-6 text-muted-foreground" />}
              title="No signal chain configured"
              description="This venue has no signal chain defined yet."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
