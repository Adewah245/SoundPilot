import { cn } from '@/lib/utils';
import { Menu, Wifi, WifiOff, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TopBarProps {
  onOpenMobileNav: () => void;
  isDemo: boolean;
  apiConnected: boolean;
  activeVenue?: string;
  activeSession?: string;
  alertCount?: number;
}

export function TopBar({
  onOpenMobileNav,
  isDemo,
  apiConnected,
  activeVenue,
  activeSession,
  alertCount = 0,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Left: mobile menu + context */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9"
          onClick={onOpenMobileNav}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          {activeVenue && (
            <span className="text-muted-foreground">
              Venue: <span className="text-foreground font-medium">{activeVenue}</span>
            </span>
          )}
          {activeVenue && activeSession && <span className="text-border">·</span>}
          {activeSession && (
            <span className="text-muted-foreground">
              Session: <span className="text-foreground font-medium">{activeSession}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: status + alerts */}
      <div className="flex items-center gap-2">
        {isDemo ? (
          <Badge variant="outline" className="border-warning/30 text-warning gap-1.5">
            <WifiOff className="h-3 w-3" />
            Demo Mode
          </Badge>
        ) : (
          <Badge variant="outline" className="border-success/30 text-success gap-1.5">
            <Wifi className="h-3 w-3" />
            API Connected
          </Badge>
        )}
        {apiConnected && (
          <Badge variant="outline" className="border-success/30 text-success gap-1.5 hidden sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-ring" />
            DSP Online
          </Badge>
        )}
        <Button variant="ghost" size="icon" className={cn('relative h-9 w-9', alertCount > 0 && 'text-warning')}>
          <Bell className="h-4.5 w-4.5" />
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
