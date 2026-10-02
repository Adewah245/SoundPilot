import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { SignalChainVisual } from '@/components/shared/SignalChainVisual';
import { DemoBanner } from '@/components/shared/DemoBanner';
import {
  Loading,
  EmptyState,
} from '@/components/shared/StateViews';

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

import type {
  Equipment,
  EquipmentType,
  SignalChain,
  SignalChainNode,
} from '@/types';

const typeIcon: Record<
  EquipmentType,
  LucideIcon
> = {
  microphone: Mic,
  mixer: SlidersHorizontal,
  processor: Cpu,
  amplifier: Zap,
  speaker: Speaker,
  subwoofer: Volume2,
  crossover: Radio,
  monitor: Headphones,
};

const equipmentTypes: (
  | EquipmentType
  | 'all'
)[] = [
  'all',
  'mixer',
  'speaker',
  'subwoofer',
  'amplifier',
  'crossover',
  'microphone',
  'processor',
  'monitor',
];

export function EquipmentPage() {
  const [loading, setLoading] =
    useState(true);

  const [isDemo, setIsDemo] =
    useState(true);

  const [equipment, setEquipment] =
    useState<Equipment[]>([]);

  const [signalChain, setSignalChain] =
    useState<SignalChain | null>(null);

  const [filter, setFilter] =
    useState<EquipmentType | 'all'>(
      'all',
    );

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [
      equipmentResponse,
      signalChainResponse,
    ] = await Promise.all([
      api.getEquipment('v-001'),
      api.getSignalChain('v-001'),
    ]);

    setIsDemo(
      equipmentResponse.isDemo ||
        signalChainResponse.isDemo,
    );

    setEquipment(
      equipmentResponse.data,
    );

    setSignalChain(
      signalChainResponse.data,
    );

    setLoading(false);
  }

  if (loading) {
    return (
      <Loading label="Loading equipment..." />
    );
  }

  const filtered =
    filter === 'all'
      ? equipment
      : equipment.filter(
          (item) =>
            item.type === filter,
        );

  /*
   * SignalChain now stores equipment IDs.
   *
   * The visual component still expects SignalChainNode[],
   * so we build those nodes from the equipment records.
   */
  const signalChainNodes: SignalChainNode[] =
    signalChain
      ? signalChain.equipment
          .map(
            (
              equipmentId,
              index,
            ) => {
              const item =
                equipment.find(
                  (equipmentItem) =>
                    equipmentItem.id ===
                    equipmentId,
                );

              if (!item) {
                return null;
              }

              const equipmentType =
                item.type;

              const validType =
                equipmentTypes.includes(
                  equipmentType as EquipmentType,
                ) &&
                equipmentType !== 'all'
                  ? (equipmentType as EquipmentType)
                  : 'speaker';

              return {
                id: `${signalChain.id}-${item.id}`,
                equipmentId: item.id,
                label: item.name,
                type: validType,
                order: index,
              };
            },
          )
          .filter(
            (
              node,
            ): node is SignalChainNode =>
              node !== null,
          )
      : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Sound system equipment inventory and signal chain"
        icon={
          <Package className="h-5 w-5" />
        }
      />

      <DemoBanner isDemo={isDemo} />

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">
            Inventory
          </TabsTrigger>

          <TabsTrigger value="signal-chain">
            Signal Chain
          </TabsTrigger>
        </TabsList>

        {/* -------------------------------------------------------------- */}
        {/* Inventory                                                       */}
        {/* -------------------------------------------------------------- */}

        <TabsContent
          value="inventory"
          className="space-y-4"
        >
          <div className="flex flex-wrap gap-2">
            {equipmentTypes.map((type) => (
              <button
                key={type}
                onClick={() =>
                  setFilter(type)
                }
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                  filter === type
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent/30'
                }`}
              >
                {type === 'all'
                  ? 'All Equipment'
                  : type}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const Icon =
                typeIcon[
                  item.type as EquipmentType
                ] ?? Boxes;

              return (
                <Card
                  key={item.id}
                  className="border-border hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/40 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px]"
                      >
                        Active
                      </Badge>
                    </div>

                    <h3 className="text-sm font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.manufacturer ??
                        'Unknown manufacturer'}{' '}
                      {item.model ?? ''}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {item.type}
                      </Badge>

                      {item.channels &&
                        item.channels > 1 && (
                          <Badge
                            variant="outline"
                            className="text-[10px]"
                          >
                            {item.channels}{' '}
                            channels
                          </Badge>
                        )}
                    </div>

                    {(item.location ||
                      item.description ||
                      item.sample_rate ||
                      item.channels) && (
                      <>
                        <Separator className="my-3" />

                        <div className="space-y-1">
                          {item.location && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground">
                                Location
                              </span>

                              <span className="font-mono-tech text-foreground">
                                {item.location}
                              </span>
                            </div>
                          )}

                          {item.sample_rate && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground">
                                Sample rate
                              </span>

                              <span className="font-mono-tech text-foreground">
                                {(
                                  item.sample_rate /
                                  1000
                                ).toFixed(0)}{' '}
                                kHz
                              </span>
                            </div>
                          )}

                          {item.channels && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-muted-foreground">
                                Channels
                              </span>

                              <span className="font-mono-tech text-foreground">
                                {item.channels}
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {item.description && (
                      <p className="text-[10px] text-muted-foreground mt-2 italic">
                        {item.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <EmptyState
              icon={
                <Package className="h-6 w-6 text-muted-foreground" />
              }
              title="No equipment found"
              description="No equipment matches this filter."
            />
          )}
        </TabsContent>

        {/* -------------------------------------------------------------- */}
        {/* Signal Chain                                                    */}
        {/* -------------------------------------------------------------- */}

        <TabsContent
          value="signal-chain"
          className="space-y-4"
        >
          {signalChain &&
          signalChainNodes.length > 0 ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    {signalChain.name}
                  </CardTitle>

                  <p className="text-xs text-muted-foreground">
                    Audio signal flow from
                    microphone to speaker
                  </p>
                </CardHeader>

                <CardContent>
                  <SignalChainVisual
                    nodes={signalChainNodes}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Chain Breakdown
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {signalChainNodes
                      .slice()
                      .sort(
                        (a, b) =>
                          a.order - b.order,
                      )
                      .map(
                        (
                          node,
                          index,
                        ) => {
                          const item =
                            equipment.find(
                              (
                                equipmentItem,
                              ) =>
                                equipmentItem.id ===
                                node.equipmentId,
                            );

                          const Icon =
                            typeIcon[
                              node.type
                            ] ?? Boxes;

                          return (
                            <div
                              key={
                                node.id
                              }
                            >
                              <div className="flex items-center gap-4 rounded-lg border border-border bg-background/40 p-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-mono-tech text-xs font-bold">
                                  {index +
                                    1}
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-primary">
                                  <Icon className="h-5 w-5" />
                                </div>

                                <div className="flex-1">
                                  <p className="text-sm font-semibold">
                                    {
                                      node.label
                                    }
                                  </p>

                                  {item && (
                                    <p className="text-xs text-muted-foreground">
                                      {item.manufacturer ??
                                        'Unknown manufacturer'}{' '}
                                      {item.model ??
                                        ''}
                                      {' · '}
                                      {item.channels ??
                                        1}{' '}
                                      channel
                                      {(item.channels ??
                                        1) !==
                                      1
                                        ? 's'
                                        : ''}
                                    </p>
                                  )}
                                </div>

                                {item && (
                                  <StatusIndicator status="active" />
                                )}
                              </div>

                              {index <
                                signalChainNodes.length -
                                  1 && (
                                <div className="flex justify-center py-1">
                                  <div className="h-4 w-px bg-border" />
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={
                <Package className="h-6 w-6 text-muted-foreground" />
              }
              title="No signal chain configured"
              description="This venue has no signal chain defined yet."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}