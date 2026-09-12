# SoundPilot — Project Structure

> **Measure. Understand. Adjust. Verify.**

This document defines the planned structure of the SoundPilot project.

The structure is designed around the agreed architecture:

```text
Frontend
    ↓
Go Application
    ↓
Engineering Engine
    ↓
Python DSP Engine
    ↓
Audio / Measurements
```

The system also contains:

```text
Local Database
Equipment
Venue
Zones
Baselines
Measurements
Verification
History
Connections
Optional AI
```

---

# 1. High-Level Project Structure

```text
SoundPilot/
│
├── README.md
├── STRUCTURE.md
├── .gitignore
├── .env.example
│
├── docs/
│
├── frontend/
│
├── backend/
│
├── dsp/
│
├── database/
│
├── configs/
│
├── tests/
│
├── scripts/
│
└── data/
```

---

# 2. Root Files

```text
SoundPilot/
│
├── README.md
├── STRUCTURE.md
├── .gitignore
└── .env.example
```

## `README.md`

The main project documentation.

It explains:

* What SoundPilot is
* The problem it solves
* The architecture
* Offline-first design
* Core principles
* Major system components
* Project vision

---

## `STRUCTURE.md`

This file.

It explains:

* Project directories
* Responsibilities
* Component boundaries
* How the major parts communicate

---

## `.gitignore`

Contains files and directories that should not be committed to Git.

Examples may include:

* Environment files
* Local databases
* Temporary files
* Generated data
* Logs
* Build artifacts
* Python cache files

---

## `.env.example`

Documents environment variables required by the application.

It must contain examples/placeholders only.

Secrets must never be committed.

---

# 3. Documentation

```text
docs/
│
├── architecture/
├── engineering/
├── measurements/
├── equipment/
├── venue/
├── connectivity/
├── ai/
└── decisions/
```

The `docs/` directory contains deeper technical documentation.

---

# 4. Architecture Documentation

```text
docs/architecture/
│
├── system.md
├── components.md
├── data-flow.md
├── offline.md
└── boundaries.md
```

### `system.md`

Detailed system architecture.

### `components.md`

Explains the responsibilities of:

* Go
* Python DSP
* Frontend
* Database
* AI
* Connection layer

### `data-flow.md`

Explains how information moves through SoundPilot.

Example:

```text
Audio
 ↓
DSP
 ↓
Measurements
 ↓
Go
 ↓
Engineering Engine
 ↓
Verification
 ↓
UI
```

### `offline.md`

Defines what must work without internet/mobile data.

### `boundaries.md`

Defines what each component is allowed and not allowed to do.

This is important for preventing responsibilities from becoming mixed together.

---

# 5. Engineering Documentation

```text
docs/engineering/
│
├── principles.md
├── profiles.md
├── targets.md
├── tolerances.md
├── verification.md
├── progress.md
└── diagnostics.md
```

These documents define the engineering behaviour of SoundPilot.

They will eventually describe:

* Engineering profiles
* Targets
* Tolerances
* Verification
* Progress calculation
* Diagnostic reasoning
* System-wide impact

No arbitrary engineering values should be added without a defined reason.

---

# 6. Measurement Documentation

```text
docs/measurements/
│
├── audio-capture.md
├── rms.md
├── peak.md
├── frequency.md
├── loudness.md
├── noise.md
├── distortion.md
├── clipping.md
├── feedback.md
├── reverberation.md
├── echo.md
├── clarity.md
└── coverage.md
```

This section documents what SoundPilot measures and how each measurement should be interpreted.

The Python DSP engine produces measurements.

The engineering engine gives those measurements context.

---

# 7. Equipment Documentation

```text
docs/equipment/
│
├── speakers.md
├── subwoofers.md
├── monitors.md
├── mixers.md
├── amplifiers.md
├── crossovers.md
├── equalizers.md
├── microphones.md
├── cables.md
├── audio-interfaces.md
└── signal-chain.md
```

This documents the equipment model and how equipment participates in the sound system.

---

# 8. Venue Documentation

```text
docs/venue/
│
├── venue.md
├── zones.md
├── measurement-points.md
├── speaker-placement.md
├── stage.md
└── audience-areas.md
```

This section defines how SoundPilot understands a physical venue.

A venue is not treated as one large measurement.

It can contain:

```text
Venue
│
├── Stage
│
├── Audience Areas
│
├── Zones
│   ├── Front
│   ├── Middle
│   └── Back
│
└── Measurement Points
```

---

# 9. Connectivity Documentation

```text
docs/connectivity/
│
├── audio-inputs.md
├── usb.md
├── bluetooth.md
├── wifi.md
├── ethernet.md
├── digital-mixers.md
├── analog-mixers.md
└── adapters.md
```

This documents how SoundPilot can communicate with equipment.

The system should not depend on one manufacturer.

---

# 10. AI Documentation

```text
docs/ai/
│
├── role.md
├── context.md
├── prompts.md
├── limitations.md
└── offline-behaviour.md
```

The AI layer must remain separate from measurement authority.

Correct:

```text
DSP
 ↓
Measurements
 ↓
Engineering Engine
 ↓
AI
 ↓
Explanation
```

Incorrect:

```text
Audio
 ↓
AI
 ↓
Guess
```

---

# 11. Architecture Decision Records

```text
docs/decisions/
│
├── README.md
└── ADR-XXXX-title.md
```

Important architectural decisions should be recorded here.

For example:

```text
ADR-0001:
Why Go is the main application layer

ADR-0002:
Why Python handles DSP

ADR-0003:
Why SoundPilot is offline-first

ADR-0004:
Why AI does not control measurement decisions
```

This prevents us from forgetting why we made important decisions.

---

# 12. Frontend

```text
frontend/
│
├── pages/
├── components/
├── styles/
├── assets/
└── scripts/
```

The frontend is responsible for the user interface.

It should not contain core engineering logic.

---

## `frontend/pages/`

Main application pages.

Potential pages include:

```text
pages/
│
├── dashboard/
├── setup/
├── venue/
├── equipment/
├── measurements/
├── live-listener/
├── verification/
├── stage-monitors/
├── history/
└── settings/
```

---

## `frontend/components/`

Reusable interface components.

Examples:

```text
components/
│
├── measurement-card
├── zone-card
├── progress-indicator
├── verification-status
├── spectrum-view
├── equipment-card
├── venue-map
├── live-metric
└── alert
```

---

## `frontend/styles/`

Frontend styling.

---

## `frontend/assets/`

Images, icons, fonts, and other frontend assets.

---

## `frontend/scripts/`

Frontend-side JavaScript or TypeScript behaviour where needed.

The frontend communicates with the Go application through defined interfaces.

---

# 13. Go Backend

```text
backend/
│
├── cmd/
├── internal/
├── migrations/
└── tests/
```

Go is the main application and orchestration layer.

---

# 14. Go Entry Point

```text
backend/cmd/
│
└── soundpilot/
    └── main.go
```

`main.go` is responsible for starting the application.

It should remain small.

It should mainly:

```text
Load configuration
      ↓
Initialize dependencies
      ↓
Start services
      ↓
Start server
      ↓
Handle shutdown
```

Business logic should not live inside `main.go`.

---

# 15. Go Internal Structure

```text
backend/internal/
│
├── config/
├── server/
├── api/
├── domain/
├── service/
├── engineering/
├── venue/
├── equipment/
├── measurement/
├── verification/
├── monitoring/
├── connection/
├── storage/
├── dsp/
└── ai/
```

---

# 16. Configuration

```text
backend/internal/config/
```

Responsible for application configuration.

Examples:

* Environment configuration
* Application settings
* Connection settings
* Runtime configuration

Engineering rules should not be randomly hardcoded here.

---

# 17. Server

```text
backend/internal/server/
```

Responsible for:

* HTTP server
* Routing
* Middleware
* Server lifecycle
* HTTP-level concerns

---

# 18. API

```text
backend/internal/api/
```

Responsible for communication between the frontend and backend.

Potential API areas:

```text
api/
│
├── venue/
├── equipment/
├── measurements/
├── testing/
├── verification/
├── monitoring/
├── connections/
└── ai/
```

The API should expose application capabilities rather than internal implementation details.

---

# 19. Domain

```text
backend/internal/domain/
```

Contains the core concepts of SoundPilot.

Potential domain objects:

```text
Venue
Zone
MeasurementPoint
Equipment
SignalChain
Baseline
Measurement
Test
Verification
Profile
EngineeringResult
Alert
Session
```

The domain layer should describe **what exists in SoundPilot**.

---

# 20. Engineering

```text
backend/internal/engineering/
```

This is the main engineering decision layer.

Responsibilities include:

* Applying engineering rules
* Comparing measurements with targets
* Applying tolerances
* Evaluating changes
* Evaluating system-wide impact
* Producing engineering results
* Determining whether re-verification is required

It should not capture raw audio.

---

# 21. Venue

```text
backend/internal/venue/
```

Responsible for:

* Venue creation
* Venue dimensions
* Stage
* Audience areas
* Zones
* Measurement points
* Speaker locations
* Venue configuration

---

# 22. Equipment

```text
backend/internal/equipment/
```

Responsible for:

* Equipment registration
* Equipment information
* Equipment relationships
* Equipment library
* Equipment location
* Equipment configuration

---

# 23. Measurement

```text
backend/internal/measurement/
```

Responsible for:

* Receiving DSP measurements
* Associating measurements with context
* Storing measurements
* Measurement sessions
* Measurement history

The actual signal processing remains in Python.

---

# 24. Verification

```text
backend/internal/verification/
```

Responsible for:

* Verification state
* Previous verified state
* Fresh measurements
* Comparison
* Re-verification
* Verification history

Verification belongs to the relevant location/configuration.

---

# 25. Monitoring

```text
backend/internal/monitoring/
```

Responsible for:

* Live Listener
* Continuous monitoring
* Alerts
* Progress tracking
* Change detection
* System health

---

# 26. Connection Layer

```text
backend/internal/connection/
```

Responsible for communication with external sound equipment.

Examples:

```text
Connection
│
├── USB
├── Network
├── Wi-Fi
├── Bluetooth
├── Audio Interface
└── Mixer Adapter
```

Device-specific protocols should be isolated inside adapters.

---

# 27. Storage

```text
backend/internal/storage/
```

Responsible for persistence.

The storage layer should hide database-specific details from the rest of the application.

---

# 28. DSP Integration

```text
backend/internal/dsp/
```

This is the Go-side interface to the Python DSP engine.

Go should not duplicate Python's DSP responsibilities.

The interaction should look like:

```text
Python DSP
    ↓
Measurement Data
    ↓
DSP Interface
    ↓
Go
```

---

# 29. AI Integration

```text
backend/internal/ai/
```

Responsible for communicating with optional AI services.

AI receives structured engineering context rather than raw uncontrolled assumptions.

Example:

```text
Engineering Result
       +
Venue Context
       +
Equipment Context
       +
User Mode
       ↓
      AI
       ↓
Explanation
```

AI must remain optional.

---

# 30. Python DSP Engine

```text
dsp/
│
├── capture/
├── processing/
├── measurements/
├── features/
├── detection/
├── calibration/
└── tests/
```

Python is responsible for audio processing.

---

# 31. DSP Capture

```text
dsp/capture/
```

Responsible for acquiring audio from supported input sources.

Potential sources:

* Phone microphone
* Computer microphone
* External microphone
* Audio interface

---

# 32. DSP Processing

```text
dsp/processing/
```

Responsible for signal-processing operations.

Potential processing includes:

* FFT
* Filtering
* Windowing
* Signal conditioning
* Time-domain processing
* Frequency-domain processing

---

# 33. DSP Measurements

```text
dsp/measurements/
```

Responsible for calculating measurements such as:

* RMS
* Peak
* Loudness
* Frequency information
* Noise
* Distortion indicators
* Other defined acoustic metrics

---

# 34. DSP Features

```text
dsp/features/
```

Contains reusable signal features extracted from audio.

These features may later support:

* Feedback detection
* Clarity analysis
* Echo analysis
* Reverberation analysis
* Classification

---

# 35. DSP Detection

```text
dsp/detection/
```

Responsible for signal-level detection algorithms.

Examples:

* Clipping detection
* Feedback indicators
* Noise detection
* Distortion indicators
* Echo indicators

The engineering meaning of those measurements belongs to the Go engineering layer.

---

# 36. DSP Calibration

```text
dsp/calibration/
```

Responsible for calibration-related functionality.

Calibration is important when professional measurement microphones or other calibrated equipment are used.

---

# 37. Database

```text
database/
│
├── migrations/
├── seeds/
└── documentation/
```

The database stores SoundPilot's persistent information.

Potential data includes:

```text
Venues
Zones
Measurement Points
Equipment
Signal Chains
Profiles
Baselines
Measurements
Tests
Verification
History
```

---

# 38. Database Migrations

```text
database/migrations/
```

Schema changes should be versioned.

Example:

```text
001_initial_schema.sql
002_venues.sql
003_equipment.sql
004_measurements.sql
...
```

Migration numbering should remain sequential and intentional.

---

# 39. Database Seeds

```text
database/seeds/
```

Contains controlled initial/reference data where necessary.

Examples may eventually include:

* Engineering profiles
* Reference categories
* Equipment types

Seeds must not become a hidden place for unexplained engineering assumptions.

---

# 40. Configuration

```text
configs/
│
├── engineering/
├── profiles/
├── devices/
└── environments/
```

This area is intended for controlled configuration.

Engineering values should have:

* Clear meaning
* Documentation
* Versioning
* Validation

---

# 41. Tests

```text
tests/
│
├── integration/
├── engineering/
├── measurements/
├── venue/
├── equipment/
├── verification/
└── end-to-end/
```

Testing is especially important because SoundPilot makes engineering-related decisions.

---

# 42. Scripts

```text
scripts/
│
├── development/
├── database/
├── testing/
└── deployment/
```

Scripts should automate repetitive development tasks.

They should not contain hidden business logic.

---

# 43. Local Data

```text
data/
│
├── local/
├── measurements/
├── recordings/
└── exports/
```

This directory represents local runtime data.

Actual generated/local data should normally not be committed to Git.

The exact storage strategy will be finalized later.

---

# 44. Component Responsibilities

The most important separation is:

```text
┌──────────────────────────────────────────┐
│                FRONTEND                  │
│             User Interface               │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│                  GO                      │
│       Application + Engineering          │
│               Context                    │
└───────────────┬───────────┬──────────────┘
                │           │
                ▼           ▼
        ┌────────────┐  ┌─────────────┐
        │ PYTHON DSP │  │   DATABASE  │
        │   AUDIO    │  │    STATE    │
        └────────────┘  └─────────────┘
                │
                ▼
        Measurements
```

Optional:

```text
Engineering Result
       ↓
Optional AI
       ↓
Explanation
```

---

# 45. What Each Major Language Does

## Go

Go handles:

* Application logic
* APIs
* Orchestration
* Engineering context
* Rules
* Venue
* Equipment
* Verification
* Monitoring
* Persistence
* Connections

---

## Python

Python handles:

* Audio capture
* DSP
* FFT
* Signal processing
* Measurement calculation
* Audio feature extraction
* Signal detection

---

## Frontend Technology

The frontend handles:

* User interaction
* Visualization
* Venue map
* Measurement displays
* Progress
* Alerts
* Configuration screens
* Simple Mode
* Pro Mode

---

# 46. Communication Between Components

SoundPilot should use explicit contracts.

Conceptually:

```text
Frontend
   │
   │ API
   ▼
Go Backend
   │
   ├── Engineering Engine
   │
   ├── Database
   │
   ├── Connection Layer
   │
   └── DSP Interface
           │
           ▼
       Python DSP
```

The components should not directly access each other's internal implementation.

---

# 47. Important Boundary Rule

The following separation must remain clear:

```text
PYTHON
"What did we measure?"

GO
"What does this measurement mean in this context?"

ENGINEERING ENGINE
"Is this within the defined engineering target?"

AI
"How can we explain this clearly to the user?"
```

This separation is one of the most important architectural rules in SoundPilot.

---

# 48. Future Expansion

The structure should allow future additions such as:

* Machine learning
* Equipment telemetry
* Advanced acoustic modelling
* Automated room analysis
* Remote monitoring
* Cloud synchronization
* Multi-engineer collaboration
* Advanced mixer control
* Hardware measurement devices
* Mobile applications
* Desktop applications

These should be added without breaking the core architecture.

---

# 49. Development Order

We should not build everything at once.

The planned development direction is:

```text
1. Architecture
       ↓
2. Domain Model
       ↓
3. System Contracts
       ↓
4. Database Design
       ↓
5. Go Application Foundation
       ↓
6. Python DSP Foundation
       ↓
7. Go ↔ Python Integration
       ↓
8. Measurement System
       ↓
9. Engineering Engine
       ↓
10. Venue + Zone System
       ↓
11. Verification
       ↓
12. Live Listener
       ↓
13. Equipment + Signal Chain
       ↓
14. Frontend
       ↓
15. AI Integration
       ↓
16. Real-World Testing
```

The exact order may change when implementation begins, but architectural dependencies must be respected.

---

# 50. Final Structure Principle

SoundPilot should remain understandable as it grows.

The goal is not to create many folders simply to look professional.

Every directory should have a clear responsibility.

The most important rule is:

> **One responsibility should have one clear home.**

And:

> **The system should measure first, understand context second, apply engineering rules third, and use AI only as an assistant.**

---

# SoundPilot

**Measure. Understand. Adjust. Verify.**
