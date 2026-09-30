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
  Clock,
  Play,
  Plus,
  Calendar,
  User,
  Activity,
  ChevronRight,
} from 'lucide-react';
import * as api from '@/lib/api';
import type { Session } from '@/types';
import type { PageId } from '@/lib/navigation';

interface SessionsPageProps {
  onNavigate: (page: PageId) => void;
}

export function SessionsPage({ onNavigate }: SessionsPageProps) {
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all');

  useEffect(() => {
    void loadSessions();
  }, []);

  async function loadSessions() {
    setLoading(true);
    const res = await api.getSessions();
    setIsDemo(res.isDemo);
    setSessions(res.data);
    setLoading(false);
  }

  if (loading) return <Loading label="Loading sessions..." />;

  const filtered = filter === 'all' ? sessions : sessions.filter((s) => s.status === filter);
  const activeCount = sessions.filter((s) => s.status === 'active').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Measurement session history and management"
        icon={<Clock className="h-5 w-5" />}
        actions={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Session
          </Button>
        }
      />

      <DemoBanner isDemo={isDemo} />

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card><CardContent className="py-3"><p className="font-mono-tech text-2xl font-bold">{sessions.length}</p><p className="text-xs text-muted-foreground">Total Sessions</p></CardContent></Card>
        <Card className="border-success/30"><CardContent className="py-3"><p className="font-mono-tech text-2xl font-bold text-success">{activeCount}</p><p className="text-xs text-muted-foreground">Active</p></CardContent></Card>
        <Card><CardContent className="py-3"><p className="font-mono-tech text-2xl font-bold text-info">{completedCount}</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="py-3"><p className="font-mono-tech text-2xl font-bold">{sessions.reduce((sum, s) => sum + s.measurementCount, 0)}</p><p className="text-xs text-muted-foreground">Total Measurements</p></CardContent></Card>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'active', 'completed', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === f
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-6 w-6 text-muted-foreground" />}
            title="No sessions"
            description="No measurement sessions match this filter."
          />
        ) : (
          filtered.map((session) => (
            <Card key={session.id} className="hover:border-primary/30 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                      session.status === 'active'
                        ? 'border-success/30 bg-success/10 text-success'
                        : session.status === 'completed'
                        ? 'border-info/30 bg-info/10 text-info'
                        : 'border-border bg-muted/30 text-muted-foreground'
                    }`}>
                      {session.status === 'active' ? <Play className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold truncate">{session.name}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {session.engineerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.startedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {session.measurementCount} measurements
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-xs text-muted-foreground mt-1.5 italic truncate">{session.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusIndicator status={session.status} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onNavigate('measurements')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {session.endedAt && (
                  <>
                    <Separator className="my-3" />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Ended: {new Date(session.endedAt).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
