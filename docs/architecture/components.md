# SoundPilot — Component Responsibilities

> **Each component has one clear responsibility.**

## 1. Frontend

Location:

```text
frontend/
```

The frontend is responsible for the user interface.

It handles:

* User interaction
* Dashboard
* Venue visualization
* Equipment screens
* Measurement displays
* Live monitoring displays
* Alerts
* Progress indicators
* Verification status
* History
* Settings
* Simple Mode
* Pro Mode

The frontend communicates with Go through defined APIs.

The frontend must not contain core engineering rules or DSP algorithms.

---

## 2. Go Application

Location:

```text
backend/
```

Go is the main application and orchestration layer.

It coordinates the major parts of SoundPilot.

Go handles:

* Application lifecycle
* APIs
* Domain models
* Services
* Engineering context
* Venue
* Equipment
* Measurements
* Verification
* Monitoring
* Connections
* Persistence
* DSP integration
* Optional AI integration

Go does not perform the main audio signal processing.

---

## 3. Domain Layer

Location:

```text
backend/internal/domain/
```

The domain layer defines what exists in SoundPilot.

Examples:

* Venue
* Zone
* MeasurementPoint
* Equipment
* SignalChain
* Baseline
* Measurement
* Test
* Verification
* Profile
* EngineeringResult
* Alert
* Session

The domain layer should describe concepts rather than infrastructure.

---

## 4. Engineering Engine

Location:

```text
backend/internal/engineering/
```

The engineering engine interprets measurements using defined engineering rules.

It handles:

* Targets
* Tolerances
* Engineering profiles
* Measurement comparison
* Change evaluation
* System-wide impact
* Diagnostic reasoning
* Re-verification requirements
* Engineering results

It does not capture audio.

---

## 5. Venue

Location:

```text
backend/internal/venue/
```

The venue component manages the physical environment.

It handles:

* Venue information
* Dimensions
* Stage
* Audience areas
* Zones
* Measurement points
* Speaker locations
* Venue configuration

A venue is not treated as one single measurement.

---

## 6. Equipment

Location:

```text
backend/internal/equipment/
```

The equipment component manages sound-system equipment.

It handles:

* Equipment registration
* Equipment information
* Equipment types
* Equipment relationships
* Equipment location
* Equipment configuration
* Equipment library

Equipment may include:

* Speakers
* Subwoofers
* Stage monitors
* Mixers
* Amplifiers
* Crossovers
* Equalizers
* Microphones
* Cables
* Audio interfaces

---

## 7. Measurement

Location:

```text
backend/internal/measurement/
```

The measurement component manages measurement data after it is produced by the DSP engine.

It handles:

* Receiving DSP measurements
* Measurement context
* Measurement sessions
* Measurement storage
* Measurement history
* Association with venues
* Association with zones
* Association with measurement points

The actual signal processing remains in Python.

---

## 8. Verification

Location:

```text
backend/internal/verification/
```

Verification determines whether a measured state satisfies the required engineering conditions.

It handles:

* Baseline comparison
* Previous verified state
* Fresh measurements
* Verification status
* Re-verification
* Verification history
* Location-specific verification

Verification must consider where and under what configuration a measurement was taken.

---

## 9. Monitoring

Location:

```text
backend/internal/monitoring/
```

Monitoring handles live system observation.

It manages:

* Live Listener
* Continuous monitoring
* Alerts
* Progress
* Change detection
* System health

Examples of monitored conditions include:

* Clipping
* Excessive noise
* Feedback indicators
* Level problems
* Frequency problems
* System changes

---

## 10. Connection Layer

Location:

```text
backend/internal/connection/
```

The connection layer communicates with external equipment.

Potential connections include:

* USB
* Network
* Wi-Fi
* Bluetooth
* Audio interfaces
* Digital mixers
* Analog mixer adapters

Device-specific protocols must remain isolated inside adapters.

---

## 11. Storage

Location:

```text
backend/internal/storage/
```

The storage layer handles persistence.

It hides database-specific implementation details from the rest of the application.

Other components should interact with storage through defined interfaces rather than directly depending on database implementation.

---

## 12. DSP Interface

Location:

```text
backend/internal/dsp/
```

This is the Go-side interface to the Python DSP engine.

Its responsibility is to:

* Start or communicate with DSP processing
* Send required input/configuration
* Receive measurement data
* Validate DSP responses
* Translate DSP data into application-level structures

Go does not duplicate Python's DSP algorithms.

---

## 13. Python DSP Engine

Location:

```text
dsp/
```

Python handles audio and signal processing.

Its major areas are:

```text
dsp/
├── capture/
├── processing/
├── measurements/
├── features/
├── detection/
├── calibration/
└── tests/
```

Python handles:

* Audio capture
* Signal processing
* FFT
* RMS
* Peak analysis
* Frequency analysis
* Noise analysis
* Distortion indicators
* Clipping detection
* Feedback indicators
* Feature extraction
* Calibration support

Python produces measurements.

It does not make venue-specific engineering decisions.

---

## 14. Database

Location:

```text
database/
```

The database provides persistent storage.

It stores application state such as:

* Venues
* Zones
* Measurement points
* Equipment
* Signal chains
* Profiles
* Baselines
* Measurements
* Tests
* Verification
* History

Schema changes are handled through migrations.

---

## 15. Configuration

Location:

```text
configs/
```

Configuration contains controlled system configuration.

Areas include:

```text
configs/
├── engineering/
├── profiles/
├── devices/
└── environments/
```

Configuration values must have:

* Clear meaning
* Documentation
* Validation
* Versioning where required

Engineering values must not appear as unexplained magic numbers in application code.

---

## 16. Frontend ↔ Go

Communication:

```text
Frontend
   │
   │ HTTP/API
   ▼
Go Application
```

The frontend requests application capabilities through the API.

It does not access:

* The database directly
* Python internals directly
* Engineering rules directly

---

## 17. Go ↔ Python

Communication:

```text
Go
 │
 │ DSP Interface
 ▼
Python DSP
 │
 ▼
Measurements
```

The interface must use an explicit contract.

The exact communication mechanism will be selected during implementation.

---

## 18. Go ↔ Database

Communication:

```text
Go
 │
 ▼
Storage Layer
 │
 ▼
Database
```

Business logic should not be tightly coupled to database-specific implementation.

---

## 19. Engineering ↔ AI

Communication:

```text
Measurements
     ↓
Engineering Engine
     ↓
Engineering Result
     ↓
AI
     ↓
Explanation
```

AI receives structured context.

AI does not decide whether raw audio measurements are correct.

---

## 20. Architectural Boundary

The most important boundary is:

```text
PYTHON
"What did we measure?"

        ↓

GO
"What does this measurement mean in this context?"

        ↓

ENGINEERING ENGINE
"Does it satisfy the defined engineering target?"

        ↓

AI
"How do we explain this to the user?"
```

This separation must remain intact as SoundPilot grows.
