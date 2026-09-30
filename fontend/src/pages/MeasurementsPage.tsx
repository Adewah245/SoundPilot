import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading } from '@/components/shared/StateViews';
import { VUMeter } from '@/components/audio/VUMeter';
import { WaveformDisplay } from '@/components/audio/WaveformDisplay';
import { SpectrumDisplay } from '@/components/audio/SpectrumDisplay';
import {
  Activity,
  Play,
  Square,
  Save,
  GitCompare,
  Gauge,
  TrendingUp,
  Radio,
  Zap,
  AlertTriangle,
  AudioWaveform,
  Timer,
  CircleDot,
} from 'lucide-react';
import * as api from '@/lib/api';
import { generateLiveWaveform, generateLiveSpectrum } from '@/lib/mock-data';
import type { MeasurementPoint, MeasurementMetrics, SpectrumBin } from '@/types';

type MeasurementState = 'idle' | 'running' | 'stopped' | 'saved';

export function MeasurementsPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [measState, setMeasState] = useState<MeasurementState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [liveWaveform, setLiveWaveform] = useState<number[]>(generateLiveWaveform(60));
  const [liveSpectrum, setLiveSpectrum] = useState<SpectrumBin[]>(generateLiveSpectrum(28));
  const [liveMetrics, setLiveMetrics] = useState<MeasurementMetrics | null>(null);
  const [savedMeasurements, setSavedMeasurements] = useState<{ point: string; metrics: MeasurementMetrics; time: string }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void loadPoints();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animRef.current) clearInterval(animRef.current);
    };
  }, []);

  async function loadPoints() {
    setLoading(true);
    const res = await api.getAllMeasurementPoints('v-001');
    const zonesRes = await api.getZones('v-001');
    setIsDemo(res.isDemo || zonesRes.isDemo);
    setPoints(res.data);
    if (res.data[0]) setSelectedPointId(res.data[0].id);
    setLoading(false);
  }

  function startMeasurement() {
    setMeasState('running');
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    animRef.current = setInterval(() => {
      setLiveWaveform(generateLiveWaveform(60));
      setLiveSpectrum(generateLiveSpectrum(28));
      // Generate simulated metrics
      setLiveMetrics({
        rms: -16 - Math.random() * 4,
        peak: -5 - Math.random() * 3,
        noise: -52 - Math.random() * 4,
        distortion: 0.5 + Math.random() * 1.2,
        clipping: Math.random() > 0.92,
        feedback: Math.random() * 0.3,
      });
    }, 150);
  }

  function stopMeasurement() {
    setMeasState('stopped');
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) clearInterval(animRef.current);
  }

  function saveMeasurement() {
    if (!liveMetrics) return;
    const point = points.find((p) => p.id === selectedPointId);
    setSavedMeasurements((prev) => [
      { point: point?.name ?? 'Unknown', metrics: liveMetrics, time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
    setMeasState('saved');
  }

  function resetMeasurement() {
    setMeasState('idle');
    setElapsed(0);
    setLiveMetrics(null);
  }

  if (loading) return <Loading label="Loading measurement points..." />;

  const selectedPoint = points.find((p) => p.id === selectedPointId);
  const isRunning = measState === 'running';
  const displayMetrics = liveMetrics ?? {
    rms: -18.2, peak: -6.4, noise: -52.1, distortion: 0.8, clipping: false, feedback: 0,
  };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Measurements"
        description="Professional audio measurement workspace"
        icon={<Activity className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      {/* Controls Bar */}
      <Card className="border-border">
        <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Point
              </span>
              <Select value={selectedPointId} onValueChange={setSelectedPointId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select measurement point" />
                </SelectTrigger>
                <SelectContent>
                  {points.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedPoint && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{selectedPoint.location}</span>
                <StatusIndicator status={selectedPoint.status} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono-tech text-sm font-semibold tabular-nums">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
            </div>

            {/* State indicator */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
              <CircleDot
                className={`h-3.5 w-3.5 ${
                  isRunning ? 'text-success pulse-ring' : measState === 'stopped' ? 'text-warning' : 'text-muted-foreground'
                }`}
              />
              <span className="text-sm font-medium capitalize">{measState}</span>
            </div>

            {/* Action buttons */}
            {measState === 'idle' && (
              <Button onClick={startMeasurement} className="gap-2 bg-success hover:bg-success/90">
                <Play className="h-4 w-4" />
                Start
              </Button>
            )}
            {isRunning && (
              <Button onClick={stopMeasurement} variant="destructive" className="gap-2">
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}
            {measState === 'stopped' && (
              <>
                <Button onClick={saveMeasurement} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button onClick={resetMeasurement} variant="outline" className="gap-2">
                  Discard
                </Button>
              </>
            )}
            {measState === 'saved' && (
              <>
                <Badge variant="outline" className="border-success/30 text-success gap-1.5">
                  <Save className="h-3 w-3" /> Saved
                </Badge>
                <Button onClick={resetMeasurement} variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  New
                </Button>
              </>
            )}
            <Button variant="outline" className="gap-2" disabled={savedMeasurements.length < 2}>
              <GitCompare className="h-4 w-4" />
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="RMS" value={displayMetrics.rms.toFixed(1)} unit="dBFS" icon={Gauge} status={isRunning ? 'good' : 'neutral'} subtext="Target: -18 dBFS" />
        <MetricCard label="Peak" value={displayMetrics.peak.toFixed(1)} unit="dBFS" icon={TrendingUp} status={isRunning ? (displayMetrics.peak > -3 ? 'critical' : 'good') : 'neutral'} subtext="Target: -6 dBFS" />
        <MetricCard label="Noise" value={displayMetrics.noise.toFixed(1)} unit="dBFS" icon={Radio} status="neutral" subtext="Target: -55 dBFS" />
        <MetricCard label="Distortion" value={displayMetrics.distortion.toFixed(1)} unit="%" icon={Zap} status={displayMetrics.distortion > 1.5 ? 'critical' : displayMetrics.distortion > 1.0 ? 'warning' : 'good'} subtext="Target: <1.0%" />
        <MetricCard label="Clipping" value={displayMetrics.clipping ? 'YES' : 'NO'} icon={AlertTriangle} status={displayMetrics.clipping ? 'critical' : 'good'} subtext={displayMetrics.clipping ? 'Headroom exceeded' : 'No clipping'} />
        <MetricCard label="Feedback" value={displayMetrics.feedback.toFixed(2)} icon={AudioWaveform} status={displayMetrics.feedback > 0.2 ? 'critical' : 'good'} subtext="Target: 0.0" />
      </div>

      {/* Visualizations */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Level Meters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around gap-4">
              <VUMeter label="RMS" value={displayMetrics.rms} min={-60} max={0} unit="dBFS" height={200} />
              <VUMeter label="Peak" value={displayMetrics.peak} min={-60} max={0} unit="dBFS" height={200} />
              <VUMeter label="Noise" value={displayMetrics.noise} min={-80} max={-20} unit="dBFS" height={200} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Waveform</CardTitle>
            {isRunning && (
              <Badge variant="outline" className="border-success/30 text-success gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
                Live Capture
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <WaveformDisplay data={liveWaveform} live={isRunning} height={200} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">Frequency Spectrum (RTA)</CardTitle>
          {isRunning && (
            <Badge variant="outline" className="border-success/30 text-success gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
              Live
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <SpectrumDisplay data={liveSpectrum} live={isRunning} height={180} />
        </CardContent>
      </Card>

      {/* Saved Measurements */}
      {savedMeasurements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Saved Measurements (This Session)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedMeasurements.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3"
                >
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-mono-tech text-xs">
                      #{savedMeasurements.length - i}
                    </Badge>
                    <span className="text-sm font-medium">{m.point}</span>
                    <span className="text-xs text-muted-foreground font-mono-tech">{m.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono-tech">
                    <span className="text-success">RMS: {m.metrics.rms.toFixed(1)}</span>
                    <span className="text-warning">Peak: {m.metrics.peak.toFixed(1)}</span>
                    <span className="text-info">THD: {m.metrics.distortion.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow hint */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Workflow:</span>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant={measState === 'running' ? 'default' : 'outline'} className="gap-1">
                <Play className="h-3 w-3" /> Start
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant={measState === 'stopped' ? 'default' : 'outline'} className="gap-1">
                <Square className="h-3 w-3" /> Stop
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant={measState === 'saved' ? 'default' : 'outline'} className="gap-1">
                <Save className="h-3 w-3" /> Save
              </Badge>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="outline" className="gap-1">
                <GitCompare className="h-3 w-3" /> Compare
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
