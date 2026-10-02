import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { AlertBadge } from '@/components/shared/AlertBadge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import { VUMeter } from '@/components/audio/VUMeter';
import { WaveformDisplay } from '@/components/audio/WaveformDisplay';
import { SpectrumDisplay } from '@/components/audio/SpectrumDisplay';
import {
  LayoutDashboard,
  Activity,
  Gauge,
  AlertTriangle,
  TrendingUp,
  Zap,
  AudioWaveform,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import * as api from '@/lib/api';
import type {
  Alert,
  Measurement,
  MeasurementPoint,
  Session,
  SmartSuggestion,
  SystemHealth,
  Venue,
  Zone,
} from '@/types';
import type { PageId } from '@/lib/navigation';

interface DashboardProps {
  onNavigate: (page: PageId) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [measurementPoints, setMeasurementPoints] = useState<MeasurementPoint[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const [
      venueRes,
      sessionsRes,
      measurementRes,
      suggestionsRes,
      alertsRes,
      healthRes,
    ] = await Promise.all([
      api.getVenue('v-001'),
      api.getSessions('v-001'),
      api.getLatestMeasurement(),
      api.getSmartSuggestions(),
      api.getAlerts('v-001'),
      api.getSystemHealth(),
    ]);

    const [zonesRes, pointsRes] = await Promise.all([
      api.getZones('v-001'),
      api.getAllMeasurementPoints('v-001'),
    ]);

    setIsDemo(venueRes.isDemo);
    setVenue(venueRes.data);
    setZones(zonesRes.data);
    setMeasurementPoints(pointsRes.data);
    setSession(
      sessionsRes.data.find((item) => item.status === 'active') ??
        sessionsRes.data[0] ??
        null,
    );
    setMeasurement(measurementRes.data);
    setSuggestions(suggestionsRes.data);
    setAlerts(alertsRes.data.filter((item) => !item.acknowledged));
    setHealth(healthRes.data);
    setLoading(false);
  }

  if (loading) {
    return <Loading label="Loading system overview..." />;
  }

  const metrics = measurement?.metrics;
  const unackAlerts = alerts.filter((alert) => !alert.acknowledged);

  function getMetricStatus(
    value: number,
    target: number,
    tolerance: number,
  ): 'good' | 'warning' | 'critical' {
    if (Math.abs(value - target) <= tolerance) return 'good';
    if (Math.abs(value - target) <= tolerance * 1.5) return 'warning';
    return 'critical';
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time system overview and measurement status"
        icon={<LayoutDashboard className="h-5 w-5" />}
        actions={
          <Button
            onClick={() => onNavigate('measurements')}
            className="gap-2"
          >
            <Activity className="h-4 w-4" />
            New Measurement
          </Button>
        }
      />

      <DemoBanner isDemo={isDemo} />

      {/* System Health Bar */}
      {health && (
        <Card className="border-border bg-card">
          <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
            <div className="flex items-center gap-2">
              <span
                className={
                  health.dspEngineOnline ? 'text-success' : 'text-error'
                }
              >
                <Radio className="h-4 w-4" />
              </span>

              <span className="text-sm font-medium">DSP Engine</span>

              <StatusIndicator
                status={health.dspEngineOnline ? 'active' : 'fault'}
              />
            </div>

            <Separator
              orientation="vertical"
              className="h-6 hidden sm:block"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Channels:</span>
              <span className="font-mono-tech font-semibold">
                {health.activeChannels}
              </span>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 hidden sm:block"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Sample Rate:</span>
              <span className="font-mono-tech font-semibold">
                {(health.sampleRate / 1000).toFixed(0)} kHz
              </span>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 hidden sm:block"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Latency:</span>
              <span className="font-mono-tech font-semibold">
                {health.latencyMs} ms
              </span>
            </div>

            <Separator
              orientation="vertical"
              className="h-6 hidden sm:block"
            />

            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Last Sync:</span>
              <span className="font-mono-tech text-xs">
                {new Date(health.lastSync).toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Venue & Session */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Current Venue
            </CardTitle>
          </CardHeader>

          <CardContent>
            {venue ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{venue.name}</h3>

                  <Badge variant="outline">
                    Venue
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {venue.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>
                    Size:{' '}
                    {venue.width_meters ?? '--'}m ×{' '}
                    {venue.length_meters ?? '--'}m ×{' '}
                    {venue.height_meters ?? '--'}m
                  </span>

                  <span>Zones: {zones.length}</span>
                </div>
              </div>
            ) : (
              <EmptyState title="No venue selected" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Current Session
            </CardTitle>
          </CardHeader>

          <CardContent>
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{session.name}</h3>
                  <StatusIndicator status={session.status} />
                </div>

                <p className="text-sm text-muted-foreground">
                  Engineer: {session.engineerName}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>{session.measurementCount} measurements</span>

                  <span>
                    Started:{' '}
                    {new Date(session.startedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState title="No active session" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              System Health
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="text-xs text-muted-foreground">
                    Zones
                  </span>
                </div>

                <p className="font-mono-tech text-xl font-bold">
                  {zones.length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-3.5 w-3.5 text-info" />
                  <span className="text-xs text-muted-foreground">
                    Measurements
                  </span>
                </div>

                <p className="font-mono-tech text-xl font-bold">
                  {session?.measurementCount ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                  <span className="text-xs text-muted-foreground">
                    Alerts
                  </span>
                </div>

                <p className="font-mono-tech text-xl font-bold text-warning">
                  {unackAlerts.length}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    Points
                  </span>
                </div>

                <p className="font-mono-tech text-xl font-bold">
                  {measurementPoints.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Metrics Grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Current Measurement
        </h2>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="RMS"
            value={metrics?.rms.toFixed(1) ?? '--'}
            unit="dBFS"
            icon={Gauge}
            status={
              metrics
                ? getMetricStatus(metrics.rms, -18, 3)
                : 'neutral'
            }
            subtext={metrics ? 'Target: -18 dBFS' : 'No data'}
          />

          <MetricCard
            label="Peak"
            value={metrics?.peak.toFixed(1) ?? '--'}
            unit="dBFS"
            icon={TrendingUp}
            status={
              metrics
                ? getMetricStatus(metrics.peak, -6, 3)
                : 'neutral'
            }
            subtext={metrics ? 'Target: -6 dBFS' : 'No data'}
          />

          <MetricCard
            label="Noise"
            value={metrics?.noise.toFixed(1) ?? '--'}
            unit="dBFS"
            icon={Radio}
            status={
              metrics
                ? getMetricStatus(metrics.noise, -55, 5)
                : 'neutral'
            }
            subtext={metrics ? 'Target: -55 dBFS' : 'No data'}
          />

          <MetricCard
            label="Distortion"
            value={
              metrics ? metrics.distortion.toFixed(1) : '--'
            }
            unit="%"
            icon={Zap}
            status={
              metrics
                ? getMetricStatus(metrics.distortion, 1.0, 0.5)
                : 'neutral'
            }
            subtext={metrics ? 'Target: <1.0%' : 'No data'}
          />

          <MetricCard
            label="Clipping"
            value={metrics?.clipping ? 'YES' : 'NO'}
            icon={AlertTriangle}
            status={metrics?.clipping ? 'critical' : 'good'}
            subtext={
              metrics?.clipping
                ? 'Signal exceeding headroom'
                : 'No clipping detected'
            }
          />

          <MetricCard
            label="Feedback"
            value={
              metrics ? metrics.feedback.toFixed(2) : '--'
            }
            icon={AudioWaveform}
            status={
              metrics
                ? getMetricStatus(metrics.feedback, 0, 0.2)
                : 'neutral'
            }
            subtext={metrics ? 'Target: 0.0' : 'No data'}
          />
        </div>
      </div>

      {/* Meters + Visualizations */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Level Meters</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-around gap-4">
              <VUMeter
                label="RMS"
                value={metrics?.rms ?? -60}
                min={-60}
                max={0}
                unit="dBFS"
                height={180}
              />

              <VUMeter
                label="Peak"
                value={metrics?.peak ?? -60}
                min={-60}
                max={0}
                unit="dBFS"
                height={180}
              />

              <VUMeter
                label="Noise"
                value={metrics?.noise ?? -60}
                min={-80}
                max={-20}
                unit="dBFS"
                height={180}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Waveform</CardTitle>

            <Badge
              variant="outline"
              className="text-xs font-mono-tech"
            >
              {measurement
                ? new Date(measurement.timestamp).toLocaleTimeString()
                : '--'}
            </Badge>
          </CardHeader>

          <CardContent>
            <WaveformDisplay
              data={measurement?.waveform}
              height={180}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">
            Frequency Spectrum
          </CardTitle>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('measurements')}
            className="gap-1 text-xs"
          >
            Open workspace
            <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>

        <CardContent>
          <SpectrumDisplay
            data={measurement?.spectrum}
            height={160}
          />
        </CardContent>
      </Card>

      {/* Alerts + Smart Suggestions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">
              Active Alerts
            </CardTitle>

            {unackAlerts.length > 0 && (
              <Badge
                variant="outline"
                className="text-warning border-warning/30"
              >
                {unackAlerts.length} unacknowledged
              </Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-3">
            {unackAlerts.length === 0 ? (
              <EmptyState
                icon={
                  <CheckCircle2 className="h-6 w-6 text-success" />
                }
                title="No active alerts"
                description="All systems within acceptable parameters."
              />
            ) : (
              unackAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3"
                >
                  <div className="mt-0.5">
                    <AlertBadge severity={alert.severity} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">
                      {alert.title}
                    </p>

                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alert.message}
                    </p>

                    <p className="text-[10px] text-muted-foreground mt-1 font-mono-tech">
                      {alert.source} ·{' '}
                      {new Date(
                        alert.createdAt,
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Smart Suggestions
            </CardTitle>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('engineering')}
              className="gap-1 text-xs"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {suggestions.length === 0 ? (
              <EmptyState
                title="No suggestions"
                description="Measurements are within target parameters."
              />
            ) : (
              suggestions.slice(0, 3).map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="rounded-lg border border-border bg-background/40 p-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {suggestion.title}
                    </p>

                    <Badge
                      variant="outline"
                      className={
                        suggestion.priority === 'high'
                          ? 'border-error/30 text-error text-[10px]'
                          : suggestion.priority === 'medium'
                          ? 'border-warning/30 text-warning text-[10px]'
                          : 'border-info/30 text-info text-[10px]'
                      }
                    >
                      {suggestion.priority}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {suggestion.description}
                  </p>

                  <p className="text-xs text-primary mt-2 font-medium">
                    → {suggestion.action}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}