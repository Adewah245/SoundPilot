// SoundPilot API Service Layer
// Client for the existing Go API.
// Backend contract remains the source of truth.

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
  Verification,
  Zone,
} from '@/types';

import * as mock from './mock-data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as
  | string
  | undefined;

export interface ApiResponse<T> {
  data: T;
  isDemo: boolean;
  error?: string;
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit,
): Promise<T | null> {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function withDemo<T>(data: T): ApiResponse<T> {
  return {
    data,
    isDemo: true,
  };
}

function withLive<T>(data: T): ApiResponse<T> {
  return {
    data,
    isDemo: false,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Venues
// ---------------------------------------------------------------------------

export async function getVenues(): Promise<ApiResponse<Venue[]>> {
  const live = await fetchApi<Venue[]>('/venues');

  if (live) {
    return withLive(live);
  }

  await delay(300);

  return withDemo(mock.mockVenues);
}

export async function getVenue(
  id: string,
): Promise<ApiResponse<Venue | null>> {
  const live = await fetchApi<Venue>(`/venues/${id}`);

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    mock.mockVenues.find((venue) => venue.id === id) ?? null,
  );
}

// ---------------------------------------------------------------------------
// Zones
// ---------------------------------------------------------------------------

export async function getZones(
  venueId: string,
): Promise<ApiResponse<Zone[]>> {
  const live = await fetchApi<Zone[]>(
    `/zones?venue_id=${encodeURIComponent(venueId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    mock.mockZones.filter((zone) => zone.venue_id === venueId),
  );
}

// ---------------------------------------------------------------------------
// Measurement Points
// ---------------------------------------------------------------------------

export async function getMeasurementPoints(
  zoneId: string,
): Promise<ApiResponse<MeasurementPoint[]>> {
  const live = await fetchApi<MeasurementPoint[]>(
    `/measurement-points?zone_id=${encodeURIComponent(zoneId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    mock.mockMeasurementPoints.filter(
      (point) => point.zone_id === zoneId,
    ),
  );
}

export async function getAllMeasurementPoints(
  venueId: string,
): Promise<ApiResponse<MeasurementPoint[]>> {
  const zones = await getZones(venueId);

  const results = await Promise.all(
    zones.data.map((zone) => getMeasurementPoints(zone.id)),
  );

  const points = results.flatMap((result) => result.data);

  const hasLiveData =
    !zones.isDemo &&
    results.every((result) => !result.isDemo);

  return hasLiveData
    ? withLive(points)
    : withDemo(points);
}

// ---------------------------------------------------------------------------
// Measurements
// ---------------------------------------------------------------------------

export async function getMeasurements(
  sessionId: string,
): Promise<ApiResponse<Measurement[]>> {
  const live = await fetchApi<Measurement[]>(
    `/sessions/${encodeURIComponent(sessionId)}/measurements`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(300);

  return withDemo(
    mock.mockMeasurements.filter(
      (measurement) => measurement.session_id === sessionId,
    ),
  );
}

export async function getLatestMeasurement(): Promise<
  ApiResponse<Measurement | null>
> {
  const live = await fetchApi<Measurement>(
    '/measurements/latest',
  );

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(mock.latestMeasurement ?? null);
}

// ---------------------------------------------------------------------------
// Create Measurement
// ---------------------------------------------------------------------------

export interface CreateMeasurementRequest {
  contract_version: string;
  session_id: string;
  venue_id: string;
  zone_id: string;
  measurement_point_id: string;
  audio_source: string;
  audio_device: number;
  duration_seconds: number;
  sample_rate: number;
  channels: number;
}

export async function createMeasurement(
  request: CreateMeasurementRequest,
): Promise<Measurement | null> {
  if (!API_BASE_URL) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/measurements`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      },
    );

    if (!response.ok) {
      throw new Error(
        `API ${response.status}: ${response.statusText}`,
      );
    }

    return (await response.json()) as Measurement;
  } catch (error) {
    console.error(
      'SoundPilot measurement request failed:',
      error,
    );

    return null;
  }
}

// ---------------------------------------------------------------------------
// Equipment
// ---------------------------------------------------------------------------

export async function getEquipment(
  venueId: string,
): Promise<ApiResponse<Equipment[]>> {
  const live = await fetchApi<Equipment[]>(
    `/equipment?venue_id=${encodeURIComponent(venueId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(300);

  // The live API performs venue filtering through the request.
  // The current Equipment domain type does not contain venue_id,
  // so demo equipment is returned from the local demo dataset.
  return withDemo(mock.mockEquipment);
}

// ---------------------------------------------------------------------------
// Signal Chain
// ---------------------------------------------------------------------------

export async function getSignalChain(
  venueId: string,
): Promise<ApiResponse<SignalChain | null>> {
  const live = await fetchApi<SignalChain[]>(
    `/signal-chains?venue_id=${encodeURIComponent(venueId)}`,
  );

  if (live) {
    return withLive(live[0] ?? null);
  }

  await delay(200);

  // SignalChain currently does not contain venue_id in the
  // frontend domain type. The backend request above handles
  // venue filtering when live data is available.
  return withDemo(mock.mockSignalChain[0] ?? null);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

export async function getSessions(
  venueId?: string,
): Promise<ApiResponse<Session[]>> {
  const path = venueId
    ? `/sessions?venue_id=${encodeURIComponent(venueId)}`
    : '/sessions';

  const live = await fetchApi<Session[]>(path);

  if (live) {
    return withLive(live);
  }

  await delay(300);

  return withDemo(
    venueId
      ? mock.mockSessions.filter(
          (session) => session.venueId === venueId,
        )
      : mock.mockSessions,
  );
}

// ---------------------------------------------------------------------------
// Engineering
// ---------------------------------------------------------------------------

export async function getEngineeringProfiles(
  venueId: string,
): Promise<ApiResponse<EngineeringProfile[]>> {
  const live = await fetchApi<EngineeringProfile[]>(
    `/engineering/profiles?venue_id=${encodeURIComponent(venueId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    mock.mockEngineeringProfiles.filter(
      (profile) => profile.venueId === venueId,
    ),
  );
}

export async function getEngineeringResults(
  sessionId: string,
): Promise<ApiResponse<EngineeringResult[]>> {
  const live = await fetchApi<EngineeringResult>(
    `/engineering/results/${encodeURIComponent(sessionId)}`,
  );

  if (live) {
    return withLive([live]);
  }

  await delay(300);

  return withDemo(
    mock.mockEngineeringResults.filter(
      (result) => result.sessionId === sessionId,
    ),
  );
}

// ---------------------------------------------------------------------------
// Baselines
// ---------------------------------------------------------------------------

export async function getBaselines(
  venueId: string,
): Promise<ApiResponse<Baseline[]>> {
  const live = await fetchApi<Baseline[]>(
    `/baselines?venue_id=${encodeURIComponent(venueId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    mock.mockBaselines.filter(
      (baseline) => baseline.venueId === venueId,
    ),
  );
}

// ---------------------------------------------------------------------------
// Verifications
// ---------------------------------------------------------------------------

export async function getVerifications(
  sessionId: string,
): Promise<ApiResponse<Verification[]>> {
  const live = await fetchApi<Verification[]>(
    `/verification?session_id=${encodeURIComponent(sessionId)}`,
  );

  if (live) {
    return withLive(live);
  }

  await delay(300);

  return withDemo(
    mock.mockVerifications.filter(
      (verification) =>
        verification.sessionId === sessionId,
    ),
  );
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export async function getAlerts(
  venueId?: string,
): Promise<ApiResponse<Alert[]>> {
  const path = venueId
    ? `/alerts?venue_id=${encodeURIComponent(venueId)}`
    : '/alerts';

  const live = await fetchApi<Alert[]>(path);

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(
    venueId
      ? mock.mockAlerts.filter(
          (alert) => alert.venueId === venueId,
        )
      : mock.mockAlerts,
  );
}

// ---------------------------------------------------------------------------
// Smart Suggestions
// ---------------------------------------------------------------------------

export async function getSmartSuggestions(): Promise<
  ApiResponse<SmartSuggestion[]>
> {
  const live = await fetchApi<SmartSuggestion[]>(
    '/suggestions',
  );

  if (live) {
    return withLive(live);
  }

  await delay(300);

  return withDemo(mock.mockSmartSuggestions);
}

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export async function getSystemHealth(): Promise<
  ApiResponse<SystemHealth>
> {
  const live = await fetchApi<SystemHealth>('/health');

  if (live) {
    return withLive(live);
  }

  await delay(200);

  return withDemo(mock.mockSystemHealth);
}

// ---------------------------------------------------------------------------
// API Configuration
// ---------------------------------------------------------------------------

export function getApiConfig() {
  return {
    baseUrl: API_BASE_URL ?? null,
    isConfigured: Boolean(API_BASE_URL),
  };
}