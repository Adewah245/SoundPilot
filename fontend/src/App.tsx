import { useEffect, useState } from 'react';
import './App.css';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/pages/Dashboard';
import { VenuePage } from '@/pages/VenuePage';
import { MeasurementsPage } from '@/pages/MeasurementsPage';
import { EngineeringPage } from '@/pages/EngineeringPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { EquipmentPage } from '@/pages/EquipmentPage';
import { SessionsPage } from '@/pages/SessionsPage';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { SettingsPage } from '@/pages/SettingsPage';
import type { PageId } from '@/lib/navigation';
import * as api from '@/lib/api';

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [isDemo, setIsDemo] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [activeVenue, setActiveVenue] = useState<string | undefined>();
  const [activeSession, setActiveSession] = useState<string | undefined>();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    void loadContext();
  }, []);

  async function loadContext() {
    const [healthRes, venueRes, sessionsRes, alertsRes] = await Promise.all([
      api.getSystemHealth(),
      api.getVenue('v-001'),
      api.getSessions('v-001'),
      api.getAlerts('v-001'),
    ]);
    setIsDemo(healthRes.isDemo || venueRes.isDemo);
    setApiConnected(healthRes.data.apiConnected);
    setActiveVenue(venueRes.data?.name);
    const active = sessionsRes.data.find((s) => s.status === 'active');
    setActiveSession(active?.name);
    setAlertCount(alertsRes.data.filter((a) => !a.acknowledged).length);
  }

  function renderPage() {
    switch (page) {
      case 'dashboard':
        return <Dashboard onNavigate={setPage} />;
      case 'venue':
        return <VenuePage />;
      case 'measurements':
        return <MeasurementsPage />;
      case 'engineering':
        return <EngineeringPage />;
      case 'verification':
        return <VerificationPage />;
      case 'equipment':
        return <EquipmentPage />;
      case 'sessions':
        return <SessionsPage onNavigate={setPage} />;
      case 'ai-assistant':
        return <AIAssistantPage onNavigate={setPage} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigate={setPage} />;
    }
  }

  return (
    <AppLayout
      currentPage={page}
      onNavigate={setPage}
      isDemo={isDemo}
      apiConnected={apiConnected}
      activeVenue={activeVenue}
      activeSession={activeSession}
      alertCount={alertCount}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default App;
