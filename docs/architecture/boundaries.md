# SoundPilot — Component Boundaries

> **What works together goes together. What has a different responsibility stays separate.**

## 1. Purpose

This document defines the boundaries between SoundPilot components.

The purpose is to prevent responsibilities from becoming mixed together as the project grows.

---

## 2. Frontend Boundary

### Frontend MAY

* Display data
* Collect user input
* Send API requests
* Display measurements
* Display engineering results
* Display alerts
* Display progress
* Display verification status
* Manage interface state

### Frontend MUST NOT

* Perform core DSP
* Decide engineering targets
* Modify engineering rules
* Directly access the database
* Directly control Python internals
* Treat AI responses as measurement authority

---

## 3. Go Application Boundary

### Go MAY

* Coordinate application components
* Apply business rules
* Manage domain objects
* Manage venue context
* Manage equipment context
* Manage measurements
* Manage verification
* Manage monitoring
* Manage persistence
* Communicate with Python
* Communicate with external equipment

### Go MUST NOT

* Duplicate the main Python DSP algorithms
* Put all business logic inside `main.go`
* Allow frontend code to bypass application APIs
* Depend directly on frontend implementation

---

## 4. Python DSP Boundary

### Python MAY

* Capture audio
* Process audio
* Perform FFT
* Calculate signal measurements
* Extract audio features
* Detect signal-level conditions
* Support calibration

### Python MUST NOT

* Decide venue-specific engineering targets
* Decide whether a venue has passed engineering verification
* Manage the application domain
* Own venue configuration
* Own equipment configuration
* Make AI explanations

Python answers:

> **What did we measure?**

---

## 5. Engineering Engine Boundary

The engineering engine is responsible for interpreting measurements in context.

### Engineering Engine MAY

* Compare measurements with targets
* Apply tolerances
* Evaluate engineering profiles
* Evaluate system-wide impact
* Produce engineering results
* Identify conditions requiring attention
* Determine when re-verification is required

### Engineering Engine MUST NOT

* Capture audio
* Perform raw DSP
* Depend on AI to make engineering decisions
* Directly manipulate frontend UI

---

## 6. Database Boundary

### Database MAY

* Store persistent application state
* Store measurements
* Store venue information
* Store equipment
* Store profiles
* Store baselines
* Store verification history
* Store sessions
* Store other defined domain data

### Database MUST NOT

* Contain hidden engineering logic
* Become the place where unexplained engineering decisions are made
* Be accessed directly by the frontend
* Become a substitute for the Go application layer

---

## 7. Storage Boundary

The storage layer sits between the application and database.

```text id="9j4q2u"
Application
     ↓
Storage Interface
     ↓
Database
```

The purpose is to keep database-specific implementation details isolated.

---

## 8. Connection Boundary

The connection layer handles communication with physical or external sound equipment.

Examples:

* USB
* Bluetooth
* Wi-Fi
* Ethernet
* Audio interfaces
* Digital mixers
* Analog mixer adapters

Device-specific implementation must remain inside the connection layer.

The rest of the application should interact with defined connection interfaces.

---

## 9. DSP Integration Boundary

Go communicates with Python through a defined DSP interface.

```text id="1svk4j"
Go
 │
 │ DSP Contract
 ▼
Python
```

Go should not depend on Python's internal modules.

Python should not depend on Go's internal implementation.

Only the agreed data contract crosses the boundary.

---

## 10. AI Boundary

AI is an optional explanation layer.

```text id="m5h3pk"
Measurement
     ↓
Engineering
     ↓
Result
     ↓
AI
     ↓
Explanation
```

### AI MAY

* Explain engineering results
* Summarize findings
* Help users understand technical information
* Provide contextual guidance based on structured results

### AI MUST NOT

* Replace DSP
* Replace measurements
* Invent measurements
* Become the final engineering authority
* Bypass engineering rules

---

## 11. Domain Boundary

The domain layer defines SoundPilot concepts.

Examples:

```text id="4c7b5v"
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

Domain objects should not contain unnecessary infrastructure-specific details.

---

## 12. API Boundary

The API is the boundary between the frontend and application.

```text id="w5q9z7"
Frontend
   │
   │ API
   ▼
Go Application
```

The API should expose capabilities rather than internal implementation details.

For example:

```text
POST /api/measurements
```

is preferable to exposing database implementation details directly.

---

## 13. Configuration Boundary

Configuration belongs in controlled configuration locations.

```text id="1u7v9n"
configs/
├── engineering/
├── profiles/
├── devices/
└── environments/
```

Configuration must not become a hidden source of unexplained engineering behaviour.

---

## 14. No Magic Engineering Values

Engineering values must have a clear reason.

Bad:

```text
if frequency > 125 {
    ...
}
```

when `125` has no documented meaning.

Better:

```text
Engineering Target
       ↓
Defined Configuration
       ↓
Validated Rule
       ↓
Engineering Engine
```

The exact implementation will be decided when the engineering system is built.

---

## 15. Measurement Authority

The measurement chain is:

```text id="n5p0ru"
Audio
 ↓
Python DSP
 ↓
Measurement
```

The engineering interpretation chain is:

```text id="5ezxw0"
Measurement
 ↓
Context
 ↓
Engineering Engine
 ↓
Engineering Result
```

Neither frontend nor AI should replace these authorities.

---

## 16. Verification Boundary

Verification belongs to the engineering/application side.

It uses:

```text id="6jq8k3"
Baseline
+
Fresh Measurement
+
Context
+
Engineering Rules
```

It must not simply rely on a frontend checkbox.

---

## 17. Change and Re-Verification Boundary

When a system change occurs:

```text id="u9q4l0"
Change
 ↓
Affected Context
 ↓
Fresh Measurement
 ↓
Engineering Evaluation
 ↓
Verification
```

A change should not automatically invalidate unrelated verified areas.

The system should determine what actually needs re-verification.

---

## 18. Boundary Principle

The most important separation is:

```text id="y2z8xa"
PYTHON
"What did we measure?"

        ↓

GO
"What does it mean in this context?"

        ↓

ENGINEERING
"Does it meet the defined target?"

        ↓

AI
"How do we explain it?"
```

This boundary must remain intact throughout development.

---

## 19. Final Rule

> **One responsibility should have one clear home.**

If a new feature does not clearly belong to an existing component, its responsibility must be understood before code is added.

SoundPilot should grow by extending clear boundaries, not by mixing responsibilities.
