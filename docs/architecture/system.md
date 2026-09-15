# SoundPilot — System Architecture

> **Measure. Understand. Adjust. Verify.**

## 1. Purpose

SoundPilot is an offline-first sound engineering system designed to help users measure, understand, adjust, and verify sound systems in real venues.

The system combines:

* Audio measurement
* Digital signal processing
* Engineering rules
* Venue context
* Equipment context
* Verification
* Monitoring
* Local data storage
* Optional AI assistance

The system must work without depending on continuous internet access.

---

## 2. Core Architecture

```text
Frontend
    │
    │ API
    ▼
Go Application
    │
    ├── Domain
    ├── Engineering Engine
    ├── Venue
    ├── Equipment
    ├── Measurement
    ├── Verification
    ├── Monitoring
    ├── Connection
    ├── Storage
    └── DSP Interface
            │
            ▼
       Python DSP
            │
            ▼
       Audio / Input
```

---

## 3. Component Responsibilities

### Frontend

The frontend is responsible for:

* User interaction
* Displaying measurements
* Displaying alerts
* Venue visualization
* Equipment configuration
* Progress visualization
* Verification status
* Simple Mode
* Pro Mode

The frontend must not contain core engineering decisions.

---

### Go Application

Go is the main application and orchestration layer.

It is responsible for:

* Application logic
* APIs
* Domain objects
* Venue management
* Equipment management
* Engineering context
* Engineering rules
* Measurement context
* Verification
* Monitoring
* Persistence
* Connections
* Communication with the DSP engine

---

### Python DSP Engine

Python is responsible for audio processing.

It is responsible for:

* Audio capture
* Signal processing
* FFT
* Frequency analysis
* RMS
* Peak detection
* Noise analysis
* Distortion indicators
* Clipping detection
* Feedback indicators
* Audio feature extraction

Python answers:

> **What did we measure?**

Python must not decide what a measurement means for a particular venue or engineering profile.

---

### Database

The database stores persistent application state.

It may contain:

* Venues
* Zones
* Measurement points
* Equipment
* Signal chains
* Profiles
* Baselines
* Measurements
* Tests
* Verification records
* History
* Sessions
* Alerts

---

### AI

AI is optional.

AI receives structured information from the application and helps explain engineering results to the user.

AI must not become the measurement authority.

---

## 4. Measurement Flow

The primary measurement flow is:

```text
Audio Input
    ↓
Python DSP
    ↓
Raw Measurements
    ↓
Go DSP Interface
    ↓
Measurement Context
    ↓
Engineering Engine
    ↓
Engineering Result
    ↓
Verification / Monitoring
    ↓
Frontend
```

---

## 5. Engineering Decision Flow

SoundPilot follows this separation:

```text
Python

"What did we measure?"
        ↓
Go

"What does this measurement mean in this context?"
        ↓
Engineering Engine

"Is this within the defined target?"
        ↓
AI

"How can this result be explained clearly?"
```

AI does not replace the engineering engine.

---

## 6. Offline-First Principle

The core system must remain useful without internet access.

The following should work locally:

* Venue configuration
* Equipment configuration
* Audio capture
* DSP processing
* Measurements
* Engineering evaluation
* Verification
* Monitoring
* History
* Local database
* Frontend

Internet-dependent features such as external AI services are optional.

---

## 7. Component Communication

Components communicate through explicit interfaces.

```text
Frontend
    │
    │ HTTP/API
    ▼
Go Application
    │
    ├── Database
    │
    ├── Engineering Engine
    │
    ├── Connection Layer
    │
    └── DSP Interface
            │
            │
            ▼
       Python DSP
```

Components should not directly access another component's internal implementation.

---

## 8. Core Architectural Rule

SoundPilot must follow:

> **Measure first. Understand context second. Apply engineering rules third. Explain results last.**

The system must not use AI guesses as a replacement for actual measurements.

---

## 9. Future Expansion

The architecture must allow future support for:

* Advanced acoustic analysis
* Equipment telemetry
* Hardware measurement devices
* Mixer integration
* Remote monitoring
* Cloud synchronization
* Machine learning
* Mobile applications
* Desktop applications

These additions must not break the core architecture.

---

## 10. Guiding Principle

Every component must have a clear responsibility.

> **One responsibility should have one clear home.**
