import { useEffect, useMemo, useState } from 'react';
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
  Mic,
} from 'lucide-react';
import * as api from '@/lib/api';
import { useAudioCapture } from '@/hooks/useAudioCapture';
import type {
  MeasurementPoint,
  MeasurementMetrics,
  SpectrumBin,
} from '@/types';

type MeasurementState = 'idle' | 'running' | 'stopped' | 'saved';

export function MeasurementsPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const [selectedPointId, setSelectedPointId] = useState('');
  const [measState, setMeasState] =
    useState<MeasurementState>('idle');
  const [elapsed, setElapsed] = useState(0);

  const [savedMeasurements, setSavedMeasurements] = useState<
    {
      point: string;
      metrics: MeasurementMetrics;
      time: string;
    }[]
  >([]);

  const {
    isCapturing,
    error: audioError,
    data: audioData,
    startCapture,
    stopCapture,
  } = useAudioCapture();

  useEffect(() => {
    void loadPoints();
  }, []);

  useEffect(() => {
    if (!isCapturing) {
      return;
    }

    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isCapturing]);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  async function loadPoints() {
    setLoading(true);

    const pointsResult =
      await api.getAllMeasurementPoints('v-001');

    const zonesResult = await api.getZones('v-001');

    setIsDemo(
      pointsResult.isDemo || zonesResult.isDemo,
    );

    setPoints(pointsResult.data);

    if (pointsResult.data[0]) {
      setSelectedPointId(pointsResult.data[0].id);
    }

    setLoading(false);
  }

  async function startMeasurement() {
    await startCapture();

    setMeasState('running');
    setElapsed(0);
  }

  function stopMeasurement() {
    stopCapture();
    setMeasState('stopped');
  }

  function saveMeasurement() {
    if (!audioData) {
      return;
    }

    const point = points.find(
      (measurementPoint) =>
        measurementPoint.id === selectedPointId,
    );

    const metrics: MeasurementMetrics = {
      rms: audioData.rms,
      peak: audioData.peak,
      noise: audioData.rms,
      distortion: 0,
      clipping: audioData.peak >= 0,
      feedback: 0,
    };

    setSavedMeasurements((previous) => [
      {
        point: point?.name ?? 'Unknown',
        metrics,
        time: new Date().toLocaleTimeString(),
      },
      ...previous,
    ]);

    setMeasState('saved');
  }

  function resetMeasurement() {
    stopCapture();
    setMeasState('idle');
    setElapsed(0);
  }

  const waveform = useMemo(() => {
    if (!audioData) {
      return [];
    }

    return Array.from(audioData.waveform);
  }, [audioData]);

  const spectrum = useMemo<SpectrumBin[]>(() => {
    if (!audioData) {
      return [];
    }

    const frequencyData = audioData.frequency;

    if (frequencyData.length === 0) {
      return [];
    }

    /*
     * The browser gives us FFT bins across the full
     * frequency range. SoundPilot's RTA uses 28 display
     * bands, so we sample those bins logarithmically.
     */
    const minFrequency = 31;
    const maxFrequency = 16000;

    return Array.from({ length: 28 }, (_, index) => {
      const ratio = index / 27;

      const frequency =
        minFrequency *
        Math.pow(
          maxFrequency / minFrequency,
          ratio,
        );

      const binIndex = Math.min(
        frequencyData.length - 1,
        Math.round(
          (frequency / 24000) *
            frequencyData.length,
        ),
      );

      const magnitude =
        (frequencyData[binIndex] ?? 0) / 255;

      return {
        freq: frequency,
        magnitude,
      };
    });
  }, [audioData]);

  if (loading) {
    return (
      <Loading label="Loading measurement points..." />
    );
  }

  const selectedPoint = points.find(
    (point) => point.id === selectedPointId,
  );

  const isRunning =
    measState === 'running' && isCapturing;

  const realMetrics = audioData
    ? {
        rms: audioData.rms,
        peak: audioData.peak,
        clipping: audioData.peak >= 0,
      }
    : {
        rms: -Infinity,
        peak: -Infinity,
        clipping: false,
      };

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  function formatDb(value: number): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return value.toFixed(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Measurements"
        description="Professional audio measurement workspace"
        icon={<Activity className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      {/* Audio status */}
      {audioError && (
        <Card className="border-error/40">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-error" />

            <div>
              <p className="text-sm font-medium">
                Microphone unavailable
              </p>

              <p className="text-xs text-muted-foreground">
                {audioError}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card className="border-border">
        <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Point
              </span>

              <Select
                value={selectedPointId}
                onValueChange={setSelectedPointId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select measurement point" />
                </SelectTrigger>

                <SelectContent>
                  {points.map((point) => (
                    <SelectItem
                      key={point.id}
                      value={point.id}
                    >
                      {point.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPoint && (
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-muted-foreground">
                  Position:{' '}
                  {selectedPoint.position_x ?? '--'}m,{' '}
                  {selectedPoint.position_y ?? '--'}m,{' '}
                  {selectedPoint.position_z ?? '--'}m
                </span>

                <span className="text-xs text-muted-foreground">
                  Measurement point ready
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Timer */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
              <Timer className="h-4 w-4 text-muted-foreground" />

              <span className="font-mono-tech text-sm font-semibold tabular-nums">
                {String(mins).padStart(2, '0')}:
                {String(secs).padStart(2, '0')}
              </span>
            </div>

            {/* State */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
              <CircleDot
                className={`h-3.5 w-3.5 ${
                  isRunning
                    ? 'text-success pulse-ring'
                    : measState === 'stopped'
                      ? 'text-warning'
                      : 'text-muted-foreground'
                }`}
              />

              <span className="text-sm font-medium capitalize">
                {measState}
              </span>
            </div>

            {/* Start */}
            {measState === 'idle' && (
              <Button
                onClick={() => void startMeasurement()}
                className="gap-2 bg-success hover:bg-success/90"
              >
                <Mic className="h-4 w-4" />
                Start Mic
              </Button>
            )}

            {/* Stop */}
            {isRunning && (
              <Button
                onClick={stopMeasurement}
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}

            {/* Save */}
            {measState === 'stopped' && (
              <>
                <Button
                  onClick={saveMeasurement}
                  disabled={!audioData}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>

                <Button
                  onClick={resetMeasurement}
                  variant="outline"
                  className="gap-2"
                >
                  Discard
                </Button>
              </>
            )}

            {/* Saved */}
            {measState === 'saved' && (
              <>
                <Badge
                  variant="outline"
                  className="border-success/30 text-success gap-1.5"
                >
                  <Save className="h-3 w-3" />
                  Saved
                </Badge>

                <Button
                  onClick={resetMeasurement}
                  variant="outline"
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  New
                </Button>
              </>
            )}

            <Button
              variant="outline"
              className="gap-2"
              disabled={savedMeasurements.length < 2}
            >
              <GitCompare className="h-4 w-4" />
              Compare
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          label="RMS"
          value={formatDb(realMetrics.rms)}
          unit="dBFS"
          icon={Gauge}
          status={isRunning ? 'good' : 'neutral'}
          subtext="Live microphone level"
        />

        <MetricCard
          label="Peak"
          value={formatDb(realMetrics.peak)}
          unit="dBFS"
          icon={TrendingUp}
          status={
            !Number.isFinite(realMetrics.peak)
              ? 'neutral'
              : realMetrics.peak >= -3
                ? 'critical'
                : 'good'
          }
          subtext="Live microphone peak"
        />

        <MetricCard
          label="Noise"
          value="—"
          icon={Radio}
          status="neutral"
          subtext="Noise analysis pending"
        />

        <MetricCard
          label="Distortion"
          value="—"
          icon={Zap}
          status="neutral"
          subtext="DSP analysis pending"
        />

        <MetricCard
          label="Clipping"
          value={
            audioData
              ? realMetrics.clipping
                ? 'YES'
                : 'NO'
              : '—'
          }
          icon={AlertTriangle}
          status={
            audioData
              ? realMetrics.clipping
                ? 'critical'
                : 'good'
              : 'neutral'
          }
          subtext={
            audioData
              ? realMetrics.clipping
                ? 'Digital clipping detected'
                : 'No clipping detected'
              : 'Waiting for microphone'
          }
        />

        <MetricCard
          label="Feedback"
          value="—"
          icon={AudioWaveform}
          status="neutral"
          subtext="Feedback analysis pending"
        />
      </div>

      {/* Level meters + waveform */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Level Meters
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-around gap-4">
              <VUMeter
                label="RMS"
                value={
                  Number.isFinite(realMetrics.rms)
                    ? realMetrics.rms
                    : -60
                }
                min={-60}
                max={0}
                unit="dBFS"
                height={200}
              />

              <VUMeter
                label="Peak"
                value={
                  Number.isFinite(realMetrics.peak)
                    ? realMetrics.peak
                    : -60
                }
                min={-60}
                max={0}
                unit="dBFS"
                height={200}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">
              Waveform
            </CardTitle>

            {isRunning && (
              <Badge
                variant="outline"
                className="border-success/30 text-success gap-1.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
                REAL MICROPHONE
              </Badge>
            )}
          </CardHeader>

          <CardContent>
            <WaveformDisplay
              data={waveform}
              live={false}
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Real RTA */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-sm">
            Frequency Spectrum (RTA)
          </CardTitle>

          {isRunning && (
            <Badge
              variant="outline"
              className="border-success/30 text-success gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
              REAL FFT DATA
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          <SpectrumDisplay
            data={spectrum}
            live={false}
            height={180}
          />
        </CardContent>
      </Card>

      {/* Saved measurements */}
      {savedMeasurements.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Saved Measurements (This Session)
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {savedMeasurements.map(
                (measurement, index) => (
                  <div
                    key={`${measurement.time}-${index}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="outline"
                        className="font-mono-tech text-xs"
                      >
                        #{savedMeasurements.length - index}
                      </Badge>

                      <span className="text-sm font-medium">
                        {measurement.point}
                      </span>

                      <span className="text-xs text-muted-foreground font-mono-tech">
                        {measurement.time}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono-tech">
                      <span className="text-success">
                        RMS:{' '}
                        {measurement.metrics.rms.toFixed(1)}
                      </span>

                      <span className="text-warning">
                        Peak:{' '}
                        {measurement.metrics.peak.toFixed(1)}
                      </span>

                      <span className="text-info">
                        Clipping:{' '}
                        {measurement.metrics.clipping
                          ? 'YES'
                          : 'NO'}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workflow */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-medium">
              Workflow:
            </span>

            <div className="flex items-center gap-2 text-xs">
              <Badge
                variant={
                  measState === 'running'
                    ? 'default'
                    : 'outline'
                }
                className="gap-1"
              >
                <Play className="h-3 w-3" />
                Capture
              </Badge>

              <Separator
                orientation="vertical"
                className="h-4"
              />

              <Badge
                variant={
                  measState === 'stopped'
                    ? 'default'
                    : 'outline'
                }
                className="gap-1"
              >
                <Square className="h-3 w-3" />
                Stop
              </Badge>

              <Separator
                orientation="vertical"
                className="h-4"
              />

              <Badge
                variant={
                  measState === 'saved'
                    ? 'default'
                    : 'outline'
                }
                className="gap-1"
              >
                <Save className="h-3 w-3" />
                Save
              </Badge>

              <Separator
                orientation="vertical"
                className="h-4"
              />

              <Badge
                variant="outline"
                className="gap-1"
              >
                <GitCompare className="h-3 w-3" />
                Compare
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}