# SoundPilot — Offline Architecture

> **The core system must work without internet access.**

## 1. Purpose

SoundPilot is designed as an offline-first system.

The main sound-engineering workflow must not depend on mobile data or continuous internet access.

The user should be able to:

* Configure a venue
* Configure equipment
* Capture audio
* Process audio
* Measure sound
* Evaluate measurements
* Monitor the system
* Verify changes
* View history

without an internet connection.

---

## 2. Core Offline Architecture

```text
Audio Input
     ↓
Python DSP
     ↓
Go Application
     ↓
Engineering Engine
     ↓
Local Database
     ↓
Frontend
```

The entire core path can operate locally.

---

## 3. Offline Components

The following components should work locally:

### Python DSP

Must support local:

* Audio capture
* Signal processing
* FFT
* Measurements
* Feature extraction
* Detection

No cloud service should be required for normal DSP operation.

---

### Go Application

Must support local:

* Application logic
* API
* Engineering rules
* Venue management
* Equipment management
* Measurement management
* Verification
* Monitoring
* Local persistence

---

### Database

The application must have local persistent storage.

It should store important information such as:

* Venues
* Zones
* Measurement points
* Equipment
* Profiles
* Baselines
* Measurements
* Verification
* History
* Sessions

---

### Frontend

The core interface must remain usable locally.

The frontend should communicate with the locally running Go application.

---

## 4. Internet-Dependent Features

Some features may optionally require internet access.

Examples:

* Cloud AI services
* Cloud synchronization
* Remote monitoring
* Online equipment information
* External software updates

These features must not prevent the core sound-engineering workflow from operating.

---

## 5. AI Offline Behaviour

AI is optional.

When internet access is unavailable:

```text
Measurement
    ↓
Engineering Engine
    ↓
Engineering Result
    ↓
Local explanation / rule-based result
```

The application must not fail simply because an external AI service is unavailable.

---

## 6. Local Data

Runtime data should remain local by default.

Examples:

```text
data/
├── local/
├── measurements/
├── recordings/
└── exports/
```

Generated runtime data should normally not be committed to Git.

---

## 7. Offline Measurement

A measurement session should work without internet.

Example:

```text
Start Test
    ↓
Select Venue
    ↓
Select Zone
    ↓
Select Measurement Point
    ↓
Capture Audio
    ↓
Python DSP
    ↓
Measurement
    ↓
Engineering Evaluation
    ↓
Save Locally
```

---

## 8. Offline Verification

Verification must also work locally.

```text
Stored Baseline
       +
Fresh Measurement
       ↓
Engineering Engine
       ↓
Verification
       ↓
Local Database
```

The user should not need internet access to determine whether a system has passed a local verification process.

---

## 9. Recovery

The system should tolerate temporary interruptions.

For example:

```text
DSP
 ↓
Measurement
 ↓
Go
 ↓
Local Storage
```

If an external service fails, local measurements and engineering results should remain available.

---

## 10. Synchronization

Cloud synchronization is a future capability.

It must not be required for the first working version.

If synchronization is added later, it should synchronize local data rather than replace the local-first architecture.

---

## 11. Security

Offline-first does not mean unrestricted access.

The system should still protect:

* Configuration
* Measurement history
* Recordings
* User settings
* Equipment information

Security mechanisms will be defined during implementation.

---

## 12. Offline-First Rule

The core SoundPilot workflow must satisfy:

> **No internet should be required to measure, understand, adjust, or verify a sound system locally.**

Internet services are additions to the core system, not dependencies of the core system.
