CREATE TABLE venue_dimension_measurements (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    measurement_group_id TEXT NOT NULL,
    dimension TEXT NOT NULL CHECK (
        dimension IN ('length', 'width', 'height')
    ),
    value_meters DOUBLE PRECISION NOT NULL CHECK (value_meters > 0),
    method TEXT NOT NULL CHECK (
        method IN ('ar_walk', 'ar_point', 'manual', 'laser')
    ),
    source TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK (
        confidence IN ('excellent', 'good', 'needs_verification')
    ),
    device_info TEXT,
    measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_venue_dimension_measurements_venue
    ON venue_dimension_measurements (venue_id, dimension, measured_at);