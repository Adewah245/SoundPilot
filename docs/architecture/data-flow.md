# SoundPilot — Data Flow

> **Measure. Understand. Adjust. Verify.**

## 1. Purpose

This document defines how information moves through SoundPilot.

The system must keep the flow clear:

```text
Audio
  ↓
Python DSP
  ↓
Measurements
  ↓
Go Application
  ↓
Engineering Engine
  ↓
Verification / Monitoring
  ↓
Frontend
```

---

## 2. Complete System Flow

```text
┌─────────────────────┐
│     Audio Input     │
│                     │
│ Phone Mic           │
│ Computer Mic        │
│ External Mic        │
│ Audio Interface     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Python DSP       │
│                     │
│ Capture             │
│ Processing          │
│ FFT                 │
│ Measurements        │
│ Detection           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   DSP Interface     │
│       (Go)          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Measurement     │
│       Context       │
│                     │
│ Venue               │
│ Zone                │
│ Point               │
│ Equipment           │
│ Profile             │
│ Session             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Engineering Engine │
│                     │
│ Targets             │
│ Tolerances          │
│ Rules               │
│ Impact              │
│ Diagnostics         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Engineering Result  │
└───────┬───────┬─────┘
        │       │
        ▼       ▼
┌────────────┐ ┌──────────────┐
│ Verification│ │  Monitoring  │
└──────┬─────┘ └──────┬───────┘
       │              │
       └──────┬───────┘
              ▼
       ┌─────────────┐
       │   Storage   │
       └──────┬──────┘
              │
              ▼
       ┌─────────────┐
       │  Frontend   │
       └─────────────┘
```

---

## 3. Audio Input

SoundPilot may receive audio from:

* Phone microphone
* Computer microphone
* External microphone
* Audio interface

The input source belongs to the capture layer.

The capture layer provides audio to the DSP engine.

---

## 4. DSP Processing

Python receives the audio stream.

The DSP pipeline may perform:

```text
Audio
 ↓
Signal Conditioning
 ↓
Windowing
 ↓
FFT / Time Analysis
 ↓
Feature Extraction
 ↓
Measurement
 ↓
Detection
```

Examples of outputs:

* RMS
* Peak
* Frequency information
* Noise indicators
* Distortion indicators
* Clipping indicators
* Feedback indicators
* Other defined signal measurements

---

## 5. Measurement Data

Python produces measurement data.

The data should contain enough information for Go to understand the measurement.

Conceptually:

```text
Measurement
├── ID
├── Timestamp
├── Source
├── RMS
├── Peak
├── Frequency Data
├── Noise Data
├── Distortion Data
├── Clipping State
└── Detection Results
```

The exact data contract will be defined later.

---

## 6. Measurement Context

A raw measurement is not enough to make an engineering decision.

Go associates the measurement with context.

```text
Measurement
     +
Venue
     +
Zone
     +
Measurement Point
     +
Equipment
     +
Signal Chain
     +
Engineering Profile
     +
Session
```

This creates a contextual measurement.

---

## 7. Engineering Evaluation

The engineering engine receives the contextual measurement.

It compares the measurement against defined:

* Targets
* Tolerances
* Engineering profile
* Venue requirements
* System conditions

The result may identify:

* Within target
* Outside target
* Warning
* Critical condition
* Possible cause
* Required adjustment
* Re-verification requirement

---

## 8. Verification Flow

Verification compares the current state against a valid reference.

```text
Baseline
   +
Current Measurement
   +
Current Context
   ↓
Verification
   ↓
Verified / Not Verified / Needs Review
```

Verification must be associated with the relevant:

* Venue
* Zone
* Measurement point
* Equipment configuration
* Signal-chain state
* Engineering profile

A change in one area should not automatically invalidate unrelated verified areas.

---

## 9. Monitoring Flow

Live monitoring follows:

```text
Audio
 ↓
DSP
 ↓
Measurements
 ↓
Go
 ↓
Monitoring
 ↓
Alert / Status
 ↓
Frontend
```

Monitoring can detect conditions such as:

* Clipping
* Excessive noise
* Feedback indicators
* Abnormal level
* Frequency problems
* System changes

---

## 10. Storage Flow

Persistent information flows through the Go storage layer.

```text
Application
    ↓
Storage Interface
    ↓
Database
```

The frontend must not communicate directly with the database.

Python must not directly modify application database state.

---

## 11. Frontend Flow

The frontend receives application data from Go.

```text
Go API
   ↓
Frontend
   ↓
User
```

The frontend displays:

* Measurements
* Alerts
* Engineering results
* Venue zones
* Equipment
* Progress
* Verification state
* History

The frontend does not independently decide engineering status.

---

## 12. Adjustment Flow

SoundPilot must also support the reverse direction.

When an engineer makes an adjustment:

```text
User Adjustment
      ↓
Go Application
      ↓
Equipment / Connection Context
      ↓
New Measurement
      ↓
Python DSP
      ↓
Engineering Evaluation
      ↓
Verification
```

This allows SoundPilot to determine whether an adjustment actually improved the system.

---

## 13. Re-Measurement Principle

An adjustment should normally be followed by a fresh measurement when the change can affect the measured result.

The system should not assume that an adjustment worked.

Instead:

```text
Adjustment
    ↓
Measure Again
    ↓
Compare
    ↓
Evaluate
    ↓
Verify
```

---

## 14. System-Wide Impact

A change made to one part of a sound system can affect another part.

For example:

```text
Change EQ
   ↓
Vocal improves
   ↓
Other frequency changes
   ↓
Rear zone changes
   ↓
System requires evaluation
```

The engineering layer must therefore be able to evaluate relevant system-wide impact.

---

## 15. AI Flow

AI is optional and operates after engineering evaluation.

```text
Measurements
     ↓
Engineering Engine
     ↓
Engineering Result
     +
Venue Context
     +
Equipment Context
     ↓
AI
     ↓
User Explanation
```

AI must not bypass the measurement and engineering layers.

---

## 16. Offline Flow

When there is no internet connection:

```text
Audio
 ↓
Python DSP
 ↓
Go
 ↓
Engineering
 ↓
Database
 ↓
Frontend
```

The core workflow continues locally.

Only features that explicitly require external services may become unavailable.

---

## 17. Core Data-Flow Rule

SoundPilot follows this rule:

> **Data should move through the responsible layer before reaching the next layer.**

No component should bypass another component's responsibility merely for convenience.
