import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import {
  MapPin,
  Building2,
  Layers,
  Crosshair,
  ChevronRight,
  Ruler,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { MeasurementPoint, Venue, Zone } from '@/types';

export function VenuePage() {
  const [loading, setLoading] = useState(true);
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

    const venueZones = zonesRes.data.filter(
      (zone) => zone.venue_id === venueId,
    );

    const zoneIds = new Set(venueZones.map((zone) => zone.id));

    const venuePoints = pointsRes.data.filter((point) =>
      zoneIds.has(point.zone_id),
    );

    setZones(venueZones);
    setPoints(venuePoints);
    setExpandedZone(venueZones[0]?.id ?? null);
  }

  function selectVenue(venue: Venue) {
    setSelectedVenue(venue);
    void loadVenueData(venue.id);
  }

  if (loading) {
    return <Loading label="Loading venues..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Venue"
        description="Venue structure: zones and measurement points"
        icon={<MapPin className="h-5 w-5" />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-primary" />
              Venues
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {venues.length === 0 ? (
              <EmptyState
                title="No venues"
                description="No venues are available."
              />
            ) : (
              venues.map((venue) => {
                const active = selectedVenue?.id === venue.id;

                return (
                  <button
                    key={venue.id}
                    onClick={() => selectVenue(venue)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      active
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-background/40 hover:bg-accent/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">
                        {venue.name}
                      </span>

                      {active && (
                        <ChevronRight className="h-4 w-4 text-primary" />
                      )}
                    </div>

                    {venue.description && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {venue.description}
                      </p>
                    )}
                  </button>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {selectedVenue && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {selectedVenue.name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {selectedVenue.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedVenue.description}
                  </p>
                )}

                <Separator className="my-3" />

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Width:</span>
                    <span>
                      {selectedVenue.width_meters ?? '—'} m
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Length:</span>
                    <span>
                      {selectedVenue.length_meters ?? '—'} m
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Height:</span>
                    <span>
                      {selectedVenue.height_meters ?? '—'} m
                    </span>
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

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Layers className="h-4 w-4 text-primary" />
                Zones
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {zones.length === 0 ? (
                <EmptyState
                  title="No zones"
                  description="This venue has no zones configured."
                />
              ) : (
                zones.map((zone) => {
                  const zonePoints = points.filter(
                    (point) => point.zone_id === zone.id,
                  );

                  const isExpanded = expandedZone === zone.id;

                  return (
                    <div
                      key={zone.id}
                      className="overflow-hidden rounded-lg border border-border bg-background/40"
                    >
                      <button
                        onClick={() =>
                          setExpandedZone(
                            isExpanded ? null : zone.id,
                          )
                        }
                        className="flex w-full items-center justify-between p-3 text-left hover:bg-accent/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Layers className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold">
                              {zone.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {zone.type}
                            </p>
                          </div>
                        </div>

                        <ChevronRight
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="space-y-2 border-t border-border bg-card/50 p-3">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Measurement Points
                          </p>

                          {zonePoints.length === 0 ? (
                            <p className="text-xs text-muted-foreground">
                              No measurement points in this zone.
                            </p>
                          ) : (
                            zonePoints.map((point) => (
                              <div
                                key={point.id}
                                className="flex items-center justify-between rounded-md border border-border bg-background/40 p-2.5"
                              >
                                <div className="flex items-center gap-3">
                                  <Crosshair className="h-3.5 w-3.5 text-muted-foreground" />

                                  <div>
                                    <p className="text-sm font-medium">
                                      {point.name}
                                    </p>

                                    <p className="text-xs text-muted-foreground">
                                      Position: (
                                      {point.position_x ?? '—'},{' '}
                                      {point.position_y ?? '—'},{' '}
                                      {point.position_z ?? '—'}
                                      )
                                    </p>
                                  </div>
                                </div>

                                <Badge variant="outline">
                                  Point
                                </Badge>
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