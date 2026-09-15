-- SoundPilot initial database schema.
-- This migration contains the core entities only.
-- Engineering rules and measurement processing remain outside the database.

CREATE TABLE venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    width_meters DOUBLE PRECISION,
    length_meters DOUBLE PRECISION,
    height_meters DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE zones (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE measurement_points (
    id TEXT PRIMARY KEY,
    zone_id TEXT NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position_x DOUBLE PRECISION,
    position_y DOUBLE PRECISION,
    position_z DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE equipment (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    manufacturer TEXT,
    model TEXT,
    location TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE signal_chains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE signal_chain_equipment (
    signal_chain_id TEXT NOT NULL REFERENCES signal_chains(id) ON DELETE CASCADE,
    equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,

    PRIMARY KEY (signal_chain_id, equipment_id),
    UNIQUE (signal_chain_id, position)
);

CREATE TABLE engineering_profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    version TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE baselines (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT,
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE TABLE measurements (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    zone_id TEXT NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    measurement_point_id TEXT NOT NULL REFERENCES measurement_points(id) ON DELETE CASCADE,

    source TEXT NOT NULL,

    rms_decibels DOUBLE PRECISION NOT NULL,
    peak_decibels DOUBLE PRECISION NOT NULL,
    noise_level DOUBLE PRECISION,
    distortion_level DOUBLE PRECISION,

    clipping_detected BOOLEAN NOT NULL DEFAULT FALSE,
    feedback_detected BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE measurement_frequencies (
    measurement_id TEXT NOT NULL REFERENCES measurements(id) ON DELETE CASCADE,
    frequency_hz DOUBLE PRECISION NOT NULL,
    level_db DOUBLE PRECISION NOT NULL,

    PRIMARY KEY (measurement_id, frequency_hz)
);

CREATE TABLE tests (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE engineering_results (
    id TEXT PRIMARY KEY,
    measurement_id TEXT NOT NULL REFERENCES measurements(id) ON DELETE CASCADE,
    engineering_profile_id TEXT NOT NULL REFERENCES engineering_profiles(id),

    status TEXT NOT NULL,
    score DOUBLE PRECISION,

    requires_verification BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE engineering_findings (
    id TEXT PRIMARY KEY,
    engineering_result_id TEXT NOT NULL REFERENCES engineering_results(id) ON DELETE CASCADE,

    metric TEXT NOT NULL,
    status TEXT NOT NULL,
    actual DOUBLE PRECISION,
    target DOUBLE PRECISION,
    tolerance DOUBLE PRECISION,
    message TEXT NOT NULL
);

CREATE TABLE recommendations (
    id TEXT PRIMARY KEY,
    engineering_result_id TEXT NOT NULL REFERENCES engineering_results(id) ON DELETE CASCADE,
    recommendation TEXT NOT NULL,
    position INTEGER NOT NULL
);

CREATE TABLE verifications (
    id TEXT PRIMARY KEY,

    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    zone_id TEXT NOT NULL REFERENCES zones(id) ON DELETE CASCADE,
    measurement_point_id TEXT NOT NULL REFERENCES measurement_points(id) ON DELETE CASCADE,

    baseline_id TEXT NOT NULL REFERENCES baselines(id),
    measurement_id TEXT NOT NULL REFERENCES measurements(id),
    engineering_result_id TEXT NOT NULL REFERENCES engineering_results(id),

    status TEXT NOT NULL,
    score DOUBLE PRECISION,
    summary TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE alerts (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,

    type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,

    acknowledged BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Useful indexes for the main lookup paths.

CREATE INDEX idx_zones_venue_id
    ON zones(venue_id);

CREATE INDEX idx_measurement_points_zone_id
    ON measurement_points(zone_id);

CREATE INDEX idx_measurements_session_id
    ON measurements(session_id);

CREATE INDEX idx_measurements_zone_id
    ON measurements(zone_id);

CREATE INDEX idx_measurements_point_id
    ON measurements(measurement_point_id);

CREATE INDEX idx_engineering_results_measurement_id
    ON engineering_results(measurement_id);

CREATE INDEX idx_verifications_zone_id
    ON verifications(zone_id);

CREATE INDEX idx_verifications_point_id
    ON verifications(measurement_point_id);

CREATE INDEX idx_alerts_session_id
    ON alerts(session_id);