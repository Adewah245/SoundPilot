import {
  LayoutDashboard,
  MapPin,
  Activity,
  SlidersHorizontal,
  CheckCircle2,
  Package,
  Clock,
  Bot,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type PageId =
  | 'dashboard'
  | 'venue'
  | 'measurements'
  | 'engineering'
  | 'verification'
  | 'equipment'
  | 'sessions'
  | 'ai-assistant'
  | 'settings';

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'System overview' },
  { id: 'venue', label: 'Venue', icon: MapPin, description: 'Zones & measurement points' },
  { id: 'measurements', label: 'Measurements', icon: Activity, description: 'Live measurement workspace' },
  { id: 'engineering', label: 'Engineering', icon: SlidersHorizontal, description: 'Analysis & smart suggestions' },
  { id: 'verification', label: 'Verification', icon: CheckCircle2, description: 'Before / after comparison' },
  { id: 'equipment', label: 'Equipment', icon: Package, description: 'Gear & signal chain' },
  { id: 'sessions', label: 'Sessions', icon: Clock, description: 'Measurement session history' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, description: 'SoundPilot engineering assistant' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration & API' },
];
