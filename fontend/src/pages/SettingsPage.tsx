import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading } from '@/components/shared/StateViews';
import {
  Settings as SettingsIcon,
  Server,
  Sliders,
  Bell,
  Cpu,
  Wifi,
  Database,
  Save,
  Info,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { SystemHealth } from '@/types';

export function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const apiConfig = api.getApiConfig();

  const [settings, setSettings] = useState({
    apiBaseUrl: apiConfig.baseUrl ?? '',
    sampleRate: '48000',
    fftSize: '32768',
    analysisWindow: 'pink',
    autoSave: true,
    alertsEnabled: true,
    clippingAlerts: true,
    feedbackAlerts: true,
    distortionThreshold: '1.0',
    noiseTarget: '-55',
  });

  useEffect(() => {
    void loadHealth();
  }, []);

  async function loadHealth() {
    setLoading(true);
    const res = await api.getSystemHealth();
    setIsDemo(res.isDemo);
    setHealth(res.data);
    setLoading(false);
  }

  if (loading) return <Loading label="Loading settings..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configuration and API connection"
        icon={<SettingsIcon className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      {/* API Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Server className="h-4 w-4 text-primary" />
            API Connection
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Connect the frontend to the SoundPilot Go API backend.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL (VITE_API_BASE_URL)</Label>
            <Input
              id="api-url"
              value={settings.apiBaseUrl}
              onChange={(e) => setSettings({ ...settings, apiBaseUrl: e.target.value })}
              placeholder="https://api.soundpilot.example.com"
              className="font-mono-tech"
            />
            <p className="text-xs text-muted-foreground">
              Set this in your <code className="font-mono-tech text-xs bg-muted px-1 py-0.5 rounded">.env</code> file as <code className="font-mono-tech text-xs bg-muted px-1 py-0.5 rounded">VITE_API_BASE_URL</code> and restart the dev server.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {apiConfig.isConfigured ? (
              <Badge variant="outline" className="border-success/30 text-success gap-1.5">
                <Wifi className="h-3 w-3" /> Configured
              </Badge>
            ) : (
              <Badge variant="outline" className="border-warning/30 text-warning gap-1.5">
                <Server className="h-3 w-3" /> Not Configured — Using Demo Data
              </Badge>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Save className="h-3.5 w-3.5" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      {health && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">API Status</span>
                  <StatusIndicator status={health.apiConnected ? 'active' : 'idle'} />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">DSP Engine</span>
                  <StatusIndicator status={health.dspEngineOnline ? 'active' : 'fault'} />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <span className="text-xs text-muted-foreground">Sample Rate</span>
                <p className="font-mono-tech text-sm font-semibold mt-1">{(health.sampleRate / 1000).toFixed(0)} kHz</p>
              </div>
              <div className="rounded-lg border border-border bg-background/40 p-3">
                <span className="text-xs text-muted-foreground">Latency</span>
                <p className="font-mono-tech text-sm font-semibold mt-1">{health.latencyMs} ms</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurement Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            Measurement Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sample-rate">Sample Rate</Label>
              <Input
                id="sample-rate"
                value={settings.sampleRate}
                onChange={(e) => setSettings({ ...settings, sampleRate: e.target.value })}
                className="font-mono-tech"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fft-size">FFT Size</Label>
              <Input
                id="fft-size"
                value={settings.fftSize}
                onChange={(e) => setSettings({ ...settings, fftSize: e.target.value })}
                className="font-mono-tech"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="window">Analysis Window</Label>
              <Input
                id="window"
                value={settings.analysisWindow}
                onChange={(e) => setSettings({ ...settings, analysisWindow: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distortion">Distortion Threshold (%)</Label>
              <Input
                id="distortion"
                value={settings.distortionThreshold}
                onChange={(e) => setSettings({ ...settings, distortionThreshold: e.target.value })}
                className="font-mono-tech"
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Auto-save Measurements</Label>
              <p className="text-xs text-muted-foreground">Automatically save measurements after stopping</p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={(v) => setSettings({ ...settings, autoSave: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable Alerts</Label>
              <p className="text-xs text-muted-foreground">Receive notifications for measurement anomalies</p>
            </div>
            <Switch
              checked={settings.alertsEnabled}
              onCheckedChange={(v) => setSettings({ ...settings, alertsEnabled: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Clipping Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify when signal exceeds headroom</p>
            </div>
            <Switch
              checked={settings.clippingAlerts}
              onCheckedChange={(v) => setSettings({ ...settings, clippingAlerts: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Feedback Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify when feedback margin is exceeded</p>
            </div>
            <Switch
              checked={settings.feedbackAlerts}
              onCheckedChange={(v) => setSettings({ ...settings, feedbackAlerts: v })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong className="text-foreground">SoundPilot Frontend</strong> — Professional audio measurement and sound-system analysis tool.
              </p>
              <p>
                Architecture: React Frontend → Go API → Engineering Engine → Python DSP → Neon PostgreSQL
              </p>
              <p>
                This frontend is a client of the existing Go API. When the API is not configured, demo data is shown.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
