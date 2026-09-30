// SoundPilot API Service Layer
// Client for the existing Go API. Uses VITE_API_BASE_URL for configuration.
// When the API is not reachable, falls back to clearly-labeled demo/mock data.

import type {
  Alert,
  Baseline,
  EngineeringProfile,
  EngineeringResult,
  Equipment,
  Measurement,
  MeasurementPoint,
  Session,
  SignalChain,
  SmartSuggestion,
  SystemHealth,
  Venue,
  Zone,
  Verification,
} from '@/types';
import * as mock from './mock-data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export interface ApiResponse<T> {
  data: T;
  isDemo: boolean;
  error?: string;
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T | null> {
  if (!API_BASE_URL) return null;
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function withDemo<T>(data: T): ApiResponse<T> {
  return { data, isDemo: true };
}

function withLive<T>(data: T): ApiResponse<T> {
  return { data, isDemo: false };
}

// Simulate async for realistic loading states
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Venues
// ---------------------------------------------------------------------------

export async function getVenues(): Promise<ApiResponse<Venue[]>> {
  const live = await fetchApi<Venue[]>('/venues');
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockVenues);
}

export async function getVenue(id: string): Promise<ApiResponse<Venue | null>> {
  const live = await fetchApi<Venue>(`/venues/${id}`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockVenues.find((v) => v.id === id) ?? null);
}

// ---------------------------------------------------------------------------
// Zones
// ---------------------------------------------------------------------------

export async function getZones(venueId: string): Promise<ApiResponse<Zone[]>> {
  const live = await fetchApi<Zone[]>(`/venues/${venueId}/zones`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockZones.filter((z) => z.venueId === venueId));
}

// ---------------------------------------------------------------------------
// Measurement Points
// ---------------------------------------------------------------------------

export async function getMeasurementPoints(
  zoneId: string
): Promise<ApiResponse<MeasurementPoint[]>> {
  const live = await fetchApi<MeasurementPoint[]>(`/zones/${zoneId}/points`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockMeasurementPoints.filter((mp) => mp.zoneId === zoneId));
}

export async function getAllMeasurementPoints(
  venueId: string
): Promise<ApiResponse<MeasurementPoint[]>> {
  const live = await fetchApi<MeasurementPoint[]>(`/venues/${venueId}/points`);
  if (live) return withLive(live);
  await delay(300);
  const zoneIds = mock.mockZones
    .filter((z) => z.venueId === venueId)
    .map((z) => z.id);
  return withDemo(
    mock.mockMeasurementPoints.filter((mp) => zoneIds.includes(mp.zoneId))
  );
}

// ---------------------------------------------------------------------------
// Measurements
// ---------------------------------------------------------------------------

export async function getMeasurements(
  sessionId: string
): Promise<ApiResponse<Measurement[]>> {
  const live = await fetchApi<Measurement[]>(`/sessions/${sessionId}/measurements`);
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockMeasurements.filter((m) => m.sessionId === sessionId));
}

export async function getLatestMeasurement(): Promise<ApiResponse<Measurement | null>> {
  const live = await fetchApi<Measurement>('/measurements/latest');
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.latestMeasurement);
}

// ---------------------------------------------------------------------------
// Equipment & Signal Chain
// ---------------------------------------------------------------------------

export async function getEquipment(
  venueId: string
): Promise<ApiResponse<Equipment[]>> {
  const live = await fetchApi<Equipment[]>(`/venues/${venueId}/equipment`);
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockEquipment.filter((e) => e.venueId === venueId));
}

export async function getSignalChain(
  venueId: string
): Promise<ApiResponse<SignalChain | null>> {
  const live = await fetchApi<SignalChain>(`/venues/${venueId}/signal-chain`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockSignalChain.find((sc) => sc.venueId === venueId) ?? null);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export async function getSessions(
  venueId?: string
): Promise<ApiResponse<Session[]>> {
  const path = venueId ? `/venues/${venueId}/sessions` : '/sessions';
  const live = await fetchApi<Session[]>(path);
  if (live) return withLive(live);
  await delay(300);
  return withDemo(
    venueId
      ? mock.mockSessions.filter((s) => s.venueId === venueId)
      : mock.mockSessions
  );
}

// ---------------------------------------------------------------------------
// Engineering
// ---------------------------------------------------------------------------

export async function getEngineeringProfiles(
  venueId: string
): Promise<ApiResponse<EngineeringProfile[]>> {
  const live = await fetchApi<EngineeringProfile[]>(`/venues/${venueId}/profiles`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockEngineeringProfiles.filter((p) => p.venueId === venueId));
}

export async function getEngineeringResults(
  sessionId: string
): Promise<ApiResponse<EngineeringResult[]>> {
  const live = await fetchApi<EngineeringResult[]>(`/sessions/${sessionId}/engineering`);
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockEngineeringResults.filter((r) => r.sessionId === sessionId));
}

// ---------------------------------------------------------------------------
// Baselines & Verifications
// ---------------------------------------------------------------------------

export async function getBaselines(
  venueId: string
): Promise<ApiResponse<Baseline[]>> {
  const live = await fetchApi<Baseline[]>(`/venues/${venueId}/baselines`);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockBaselines.filter((b) => b.venueId === venueId));
}

export async function getVerifications(
  sessionId: string
): Promise<ApiResponse<Verification[]>> {
  const live = await fetchApi<Verification[]>(`/sessions/${sessionId}/verifications`);
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockVerifications.filter((v) => v.sessionId === sessionId));
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function getAlerts(venueId?: string): Promise<ApiResponse<Alert[]>> {
  const path = venueId ? `/venues/${venueId}/alerts` : '/alerts';
  const live = await fetchApi<Alert[]>(path);
  if (live) return withLive(live);
  await delay(200);
  return withDemo(
    venueId ? mock.mockAlerts.filter((a) => a.venueId === venueId) : mock.mockAlerts
  );
}

// ---------------------------------------------------------------------------
// Smart Suggestions
// ---------------------------------------------------------------------------

export async function getSmartSuggestions(): Promise<ApiResponse<SmartSuggestion[]>> {
  const live = await fetchApi<SmartSuggestion[]>('/suggestions');
  if (live) return withLive(live);
  await delay(300);
  return withDemo(mock.mockSmartSuggestions);
}

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export async function getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
  const live = await fetchApi<SystemHealth>('/health');
  if (live) return withLive(live);
  await delay(200);
  return withDemo(mock.mockSystemHealth);
}

// ---------------------------------------------------------------------------
// API configuration info
// ---------------------------------------------------------------------------

export function getApiConfig() {
  return {
    baseUrl: API_BASE_URL ?? null,
    isConfigured: Boolean(API_BASE_URL),
  };
}
