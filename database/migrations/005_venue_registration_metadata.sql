ALTER TABLE venues
    ADD COLUMN venue_type TEXT NOT NULL DEFAULT 'Other',
    ADD COLUMN address TEXT NOT NULL DEFAULT '',
    ADD COLUMN measurement_unit TEXT NOT NULL DEFAULT 'm'
        CHECK (measurement_unit IN ('m', 'ft'));
