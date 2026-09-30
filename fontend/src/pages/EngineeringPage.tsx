import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import {
  SlidersHorizontal,
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { EngineeringProfile, EngineeringResult, SmartSuggestion } from '@/types';

export function EngineeringPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [profiles, setProfiles] = useState<EngineeringProfile[]>([]);
  const [results, setResults] = useState<EngineeringResult[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [profilesRes, resultsRes, suggestionsRes] = await Promise.all([
      api.getEngineeringProfiles('v-001'),
      api.getEngineeringResults('s-001'),
      api.getSmartSuggestions(),
    ]);
    setIsDemo(profilesRes.isDemo || resultsRes.isDemo);
    setProfiles(profilesRes.data);
    setResults(resultsRes.data);
    setSuggestions(suggestionsRes.data);
    setLoading(false);
  }

  if (loading) return <Loading label="Loading engineering analysis..." />;

  const accepted = results.filter((r) => r.status === 'accepted').length;
  const needsAdj = results.filter((r) => r.status === 'needs_adjustment').length;
  const rejected = results.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering"
        description="Target vs. actual analysis with smart recommendations"
        icon={<SlidersHorizontal className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-success/30">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-success/10 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-mono-tech text-2xl font-bold text-success">{accepted}</p>
              <p className="text-xs text-muted-foreground">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-warning/10 p-2.5">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="font-mono-tech text-2xl font-bold text-warning">{needsAdj}</p>
              <p className="text-xs text-muted-foreground">Needs Adjustment</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-error/30">
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-error/10 p-2.5">
              <XCircle className="h-5 w-5 text-error" />
            </div>
            <div>
              <p className="font-mono-tech text-2xl font-bold text-error">{rejected}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
          <TabsTrigger value="targets">Target Profile</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
        </TabsList>

        {/* Analysis Results Tab */}
        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Parameter Analysis — {profiles[0]?.name ?? 'Standard Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <EmptyState title="No results" description="No engineering results for this session." />
              ) : (
                <div className="space-y-3">
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wide px-3">
                    <div className="col-span-3">Parameter</div>
                    <div className="col-span-2 text-right">Target</div>
                    <div className="col-span-2 text-right">Actual</div>
                    <div className="col-span-1 text-right">Tol.</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-3">Finding</div>
                  </div>
                  <Separator />
                  {results.map((r) => {
                    const deviation = Math.abs(r.actual - r.target);
                    const withinTol = deviation <= r.tolerance;
                    return (
                      <div
                        key={r.id}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg border border-border bg-background/40 p-3 items-start md:items-center"
                      >
                        <div className="md:col-span-3">
                          <p className="text-sm font-semibold">{r.parameter}</p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            Target: {r.target} {r.unit} · Actual: {r.actual.toFixed(1)} {r.unit}
                          </p>
                        </div>
                        <div className="hidden md:block md:col-span-2 text-right">
                          <span className="font-mono-tech text-sm">{r.target} <span className="text-xs text-muted-foreground">{r.unit}</span></span>
                        </div>
                        <div className="hidden md:block md:col-span-2 text-right">
                          <span className={`font-mono-tech text-sm font-bold ${withinTol ? 'text-success' : 'text-error'}`}>
                            {r.actual.toFixed(1)} <span className="text-xs text-muted-foreground">{r.unit}</span>
                          </span>
                        </div>
                        <div className="hidden md:block md:col-span-1 text-right">
                          <span className="font-mono-tech text-xs text-muted-foreground">±{r.tolerance}</span>
                        </div>
                        <div className="md:col-span-1 flex md:justify-center">
                          <StatusBadge status={r.status} />
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-xs text-muted-foreground">{r.finding}</p>
                          {r.recommendation !== 'No action required.' && (
                            <p className="text-xs text-primary mt-1 flex items-start gap-1">
                              <Wrench className="h-3 w-3 mt-0.5 shrink-0" />
                              {r.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Target Profile Tab */}
        <TabsContent value="targets" className="space-y-4">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">{profile.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{profile.description}</p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {profile.targets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg border border-border bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{t.parameter}</span>
                        <Target className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="mt-2 flex items-baseline gap-1">
                        <span className="font-mono-tech text-lg font-bold text-primary">{t.target}</span>
                        <span className="text-xs text-muted-foreground">{t.unit}</span>
                        <span className="text-xs text-muted-foreground ml-2">±{t.tolerance}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Smart Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Smart Suggestions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                AI-assisted recommendations based on current measurement data.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="h-6 w-6 text-success" />}
                  title="No suggestions needed"
                  description="All measurements are within target parameters."
                />
              ) : (
                suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    className="rounded-lg border border-border bg-background/40 p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold">{sug.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              sug.priority === 'high'
                                ? 'border-error/30 text-error'
                                : sug.priority === 'medium'
                                ? 'border-warning/30 text-warning'
                                : 'border-info/30 text-info'
                            }`}
                          >
                            {sug.priority} priority
                          </Badge>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {sug.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{sug.description}</p>
                        <div className="mt-2 flex items-center gap-2 rounded-md bg-primary/5 border border-primary/20 px-3 py-2">
                          <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-sm text-primary font-medium">{sug.action}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
