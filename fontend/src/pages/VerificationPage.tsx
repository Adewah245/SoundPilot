import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { Loading, EmptyState } from '@/components/shared/StateViews';
import {
  CheckCircle2,
  Baseline,
  Edit3,
  Activity,
  GitCompare,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { Verification, VerificationStatus } from '@/types';

export function VerificationPage() {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [verifications, setVerifications] = useState<Verification[]>([]);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const res = await api.getVerifications('s-001');
    setIsDemo(res.isDemo);
    setVerifications(res.data);
    setLoading(false);
  }

  if (loading) return <Loading label="Loading verification data..." />;

  const accepted = verifications.filter((v) => v.status === 'accepted').length;
  const needsAdj = verifications.filter((v) => v.status === 'needs_adjustment').length;
  const rejected = verifications.filter((v) => v.status === 'rejected').length;

  // Workflow steps
  const steps = [
    { icon: Baseline, label: 'Baseline', description: 'Capture reference measurement', active: true },
    { icon: Edit3, label: 'Change', description: 'Make one controlled adjustment', active: true },
    { icon: Activity, label: 'Measure', description: 'Re-measure after change', active: true },
    { icon: GitCompare, label: 'Compare', description: 'Before vs. after vs. target', active: true },
    { icon: ShieldCheck, label: 'Verify', description: 'Accept, adjust, or reject', active: true },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification"
        description="Baseline → Change → Measure → Compare → Verify"
        icon={<CheckCircle2 className="h-5 w-5" />}
      />

      <DemoBanner isDemo={isDemo} />

      {/* Workflow Stepper */}
      <Card className="border-border bg-card">
        <CardContent className="py-5">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center gap-2 min-w-[100px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground hidden sm:block">{step.description}</p>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex items-center mx-1">
                      <div className="h-px w-4 sm:w-8 bg-primary/30" />
                      <ArrowRight className="h-3.5 w-3.5 text-primary/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-3">
        <Card className="border-success/30">
          <CardContent className="py-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div><p className="font-mono-tech text-xl font-bold text-success">{accepted}</p><p className="text-xs text-muted-foreground">Accepted</p></div>
          </CardContent>
        </Card>
        <Card className="border-warning/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Edit3 className="h-5 w-5 text-warning" />
            <div><p className="font-mono-tech text-xl font-bold text-warning">{needsAdj}</p><p className="text-xs text-muted-foreground">Needs Adjustment</p></div>
          </CardContent>
        </Card>
        <Card className="border-error/30">
          <CardContent className="py-4 flex items-center gap-3">
            <Separator className="hidden" />
            <div className="rounded-lg bg-error/10 p-1.5"><Minus className="h-4 w-4 text-error" /></div>
            <div><p className="font-mono-tech text-xl font-bold text-error">{rejected}</p><p className="text-xs text-muted-foreground">Rejected</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Verification Results</CardTitle>
          <p className="text-xs text-muted-foreground">Before vs. After vs. Target for each parameter</p>
        </CardHeader>
        <CardContent>
          {verifications.length === 0 ? (
            <EmptyState title="No verifications" description="No verification data for this session." />
          ) : (
            <div className="space-y-3">
              {/* Table header */}
              <div className="hidden lg:grid grid-cols-12 gap-3 text-xs font-medium text-muted-foreground uppercase tracking-wide px-3">
                <div className="col-span-3">Parameter</div>
                <div className="col-span-2 text-right">Before</div>
                <div className="col-span-2 text-right">After</div>
                <div className="col-span-1 text-right">Delta</div>
                <div className="col-span-2 text-right">Target</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              <Separator />
              {verifications.map((v) => {
                const improved = Math.abs(v.after - v.target) < Math.abs(v.before - v.target);
                const deltaIcon = v.delta > 0 ? TrendingUp : v.delta < 0 ? TrendingDown : Minus;
                const DeltaIcon = deltaIcon;
                return (
                  <div
                    key={v.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-lg border border-border bg-background/40 p-3 items-start lg:items-center"
                  >
                    <div className="lg:col-span-3">
                      <p className="text-sm font-semibold">{v.parameter}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.note}</p>
                    </div>
                    <div className="lg:col-span-2 lg:text-right">
                      <span className="text-xs text-muted-foreground lg:hidden">Before: </span>
                      <span className="font-mono-tech text-sm text-muted-foreground">{v.before.toFixed(1)} {v.unit}</span>
                    </div>
                    <div className="lg:col-span-2 lg:text-right">
                      <span className="text-xs text-muted-foreground lg:hidden">After: </span>
                      <span className={`font-mono-tech text-sm font-bold ${improved ? 'text-success' : 'text-error'}`}>
                        {v.after.toFixed(1)} {v.unit}
                      </span>
                    </div>
                    <div className="lg:col-span-1 lg:text-right">
                      <span className={`inline-flex items-center gap-1 font-mono-tech text-xs ${improved ? 'text-success' : 'text-error'}`}>
                        <DeltaIcon className="h-3 w-3" />
                        {v.delta > 0 ? '+' : ''}{v.delta.toFixed(1)}
                      </span>
                    </div>
                    <div className="lg:col-span-2 lg:text-right">
                      <span className="text-xs text-muted-foreground lg:hidden">Target: </span>
                      <span className="font-mono-tech text-sm text-primary">{v.target} {v.unit}</span>
                    </div>
                    <div className="lg:col-span-2 flex lg:justify-center">
                      <StatusBadge status={v.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status Legend:</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span><strong>Accepted</strong> — After value is within tolerance of target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span><strong>Needs Adjustment</strong> — Improved but not yet within tolerance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-error" />
              <span><strong>Rejected</strong> — No improvement or adjustment pending</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
