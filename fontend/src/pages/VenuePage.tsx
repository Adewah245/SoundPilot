import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import {
  MapPin,
  Building2,
  Layers,
  Crosshair,
  ChevronRight,
  Users,
  Map as MapIcon,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { MeasurementPoint, Venue, Zone } from '@/types';

export function VenuePage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  useEffect(() => {
    void loadVenues();
  }, []);

  async function loadVenues() {
    setLoading(true);
    const res = await api.getVenues();
    setIsDemo(res.isDemo);
    setVenues(res.data);
    const first = res.data[0];
    if (first) {
      setSelectedVenue(first);
      await loadVenueData(first.id);
    }
    setLoading(false);
  }

  async function loadVenueData(venueId: string) {
    const [zonesRes, pointsRes] = await Promise.all([
      api.getZones(venueId),
      api.getAllMeasurementPoints(venueId),
    ]);
    setZones(zonesRes.data);
    setPoints(pointsRes.data);
    setExpandedZone(zonesRes.data[0]?.id ?? null);
  }

  function selectVenue(venue: Venue) {
    setSelectedVenue(venue);
    void loadVenueData(venue.id);
  }

  if (loading) return <Loading label="Loading venues..." />;

  const zoneStatuses: Record<string, { optimal: number; warning: number; critical: number; idle: number }> = {};
  zones.forEach((z) => {
    const zonePoints = points.filter((p) => p.zoneId === z.id);
    zoneStatuses[z.id] = {
      optimal: zonePoints.filter((p) => p.status === 'optimal').length,
      warning: zonePoints.filter((p) => p.status === 'warning').length,
      critical: zonePoints.filter((p) => p.status === 'critical').length,
      idle: zonePoints.filter((p) => p.status === 'idle').length,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Venue"
        description="Venue structure: zones and measurement points"
        icon={<MapPin className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Venue List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Venues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {venues.map((v) => {
              const active = selectedVenue?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => selectVenue(v)}
                  className={`w-full text-left rounded-lg border p-3 transition-all ${
                    active
                      ? 'border-primary/30 bg-primary/5'
                      : 'border-border bg-background/40 hover:border-border hover:bg-accent/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{v.name}</span>
                    {active && <ChevronRight className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {v.capacity.toLocaleString()}
                    </span>
                    <span className="capitalize">{v.type.replace('_', ' ')}</span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Venue Detail + Zones */}
        <div className="lg:col-span-2 space-y-4">
          {selectedVenue && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedVenue.name}</CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {selectedVenue.type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{selectedVenue.description}</p>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Address:</span>
                    <span>{selectedVenue.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Capacity:</span>
                    <span>{selectedVenue.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Zones:</span>
                    <span>{zones.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Zones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Zones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {zones.length === 0 ? (
                <EmptyState title="No zones" description="This venue has no zones configured." />
              ) : (
                zones.map((zone) => {
                  const zonePoints = points.filter((p) => p.zoneId === zone.id);
                  const stats = zoneStatuses[zone.id];
                  const isExpanded = expandedZone === zone.id;
                  return (
                    <div
                      key={zone.id}
                      className="rounded-lg border border-border bg-background/40 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
                        className="w-full flex items-center justify-between p-3 text-left hover:bg-accent/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-mono-tech text-xs font-bold">
                            {zone.order}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{zone.name}</p>
                            <p className="text-xs text-muted-foreground">{zone.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="hidden sm:flex items-center gap-2 text-xs">
                            {stats.optimal > 0 && (
                              <span className="flex items-center gap-1 text-success">
                                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                {stats.optimal}
                              </span>
                            )}
                            {stats.warning > 0 && (
                              <span className="flex items-center gap-1 text-warning">
                                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                                {stats.warning}
                              </span>
                            )}
                            {stats.critical > 0 && (
                              <span className="flex items-center gap-1 text-error">
                                <span className="h-1.5 w-1.5 rounded-full bg-error" />
                                {stats.critical}
                              </span>
                            )}
                            {stats.idle > 0 && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                {stats.idle}
                              </span>
                            )}
                          </div>
                          <ChevronRight
                            className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                          />
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-border p-3 space-y-2 bg-card/50">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                            Measurement Points
                          </p>
                          {zonePoints.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No measurement points in this zone.</p>
                          ) : (
                            zonePoints.map((point) => (
                              <div
                                key={point.id}
                                className="flex items-center justify-between rounded-md border border-border bg-background/40 p-2.5"
                              >
                                <div className="flex items-center gap-3">
                                  <Crosshair className="h-3.5 w-3.5 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{point.name}</p>
                                    <p className="text-xs text-muted-foreground">{point.location}</p>
                                  </div>
                                </div>
                                <StatusIndicator status={point.status} />
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
