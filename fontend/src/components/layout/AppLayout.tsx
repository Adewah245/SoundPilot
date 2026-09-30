import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { PageId } from '@/lib/navigation';

interface AppLayoutProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  isDemo: boolean;
  apiConnected: boolean;
  activeVenue?: string;
  activeSession?: string;
  alertCount?: number;
  children: ReactNode;
}

export function AppLayout({
  currentPage,
  onNavigate,
  isDemo,
  apiConnected,
  activeVenue,
  activeSession,
  alertCount,
  children,
}: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      <div className="lg:pl-64">
        <TopBar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          isDemo={isDemo}
          apiConnected={apiConnected}
          activeVenue={activeVenue}
          activeSession={activeSession}
          alertCount={alertCount}
        />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <div className="fade-in-up">{children}</div>
        </main>
      </div>
    </div>
  );
}
