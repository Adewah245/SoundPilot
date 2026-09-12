# SoundPilot

> **Measure. Understand. Adjust. Verify.**

SoundPilot is an **offline-first intelligent sound-system monitoring and engineering support platform** designed to help professional sound engineers and ordinary users understand, test, configure, monitor, and verify sound systems.

SoundPilot is not simply an AI chatbot and it is not just a sound-level meter.

It combines:

* Real audio measurements
* Digital signal processing
* Venue and zone information
* Equipment information
* Engineering rules
* Baselines
* Continuous monitoring
* Progress tracking
* Verification
* Optional AI assistance

The goal is simple:

> **Help the engineer understand what is happening, make an informed adjustment, verify whether it actually helped, and ensure the improvement does not create another problem elsewhere.**

---

# 1. The Problem

Sound-system setup is often done manually:

```text
Set up equipment
      ↓
Listen
      ↓
Guess what is wrong
      ↓
Change settings
      ↓
Walk around again
      ↓
Listen again
      ↓
Repeat
```

This can lead to:

* Uneven sound coverage
* Excessive volume in some areas
* Weak sound in other areas
* Feedback
* Excessive bass, mid, or high frequencies
* Noise
* Distortion
* Clipping
* Poor speech clarity
* Echo and reverberation
* Left/right imbalance
* Stage-monitor problems
* Changes that fix one area while damaging another
* No reliable record of what was previously verified
* Difficulty monitoring the system during an event

SoundPilot changes this workflow into:

```text
Measure
   ↓
Understand
   ↓
Adjust
   ↓
Measure Again
   ↓
Compare
   ↓
Check Other Areas
   ↓
Verify
   ↓
Continue Monitoring
```

---

# 2. Vision

SoundPilot aims to become a practical engineering companion for sound systems.

It should be:

* **Simple for everyone**
* **Powerful for professionals**
* **Offline-first**
* **Measurement-driven**
* **Context-aware**
* **Transparent**
* **Configurable**
* **Engineer-controlled**

The system should assist the engineer rather than replace the engineer.

---

# 3. Core Principle

SoundPilot follows this principle:

```text
REAL SOUND
    +
MEASUREMENTS
    +
VENUE CONTEXT
    +
EQUIPMENT CONTEXT
    +
ENGINEERING RULES
    +
BASELINES
    +
PROGRESS
    +
VERIFICATION
    +
CONTINUOUS MONITORING
    +
OPTIONAL AI
```

The system should never make an important engineering decision based only on an AI guess.

---

# 4. Target Users

SoundPilot is designed for different levels of users.

### Professional Sound Engineers

For engineers who need:

* Detailed measurements
* Equipment information
* Venue mapping
* Signal-chain information
* Baselines
* Testing
* Verification
* Continuous monitoring
* Technical diagnostics

### Churches and Religious Organizations

For:

* Worship teams
* Sound teams
* Stage monitors
* Speech
* Vocals
* Live music

### Event Centers

For:

* Conferences
* Weddings
* Concerts
* Public events
* Large indoor venues

### Schools and Institutions

For:

* Assembly halls
* Lecture rooms
* Auditoriums
* Events

### Ordinary Users

For people who do not understand professional sound engineering but want simple guidance.

---

# 5. Simple Mode and Pro Mode

SoundPilot will support two interfaces.

## Simple Mode

Designed for ordinary users.

Instead of:

```text
Excessive energy around 2.8 kHz
```

the system may explain:

```text
The sound is becoming harsh around the voice range.
```

The goal is to make sound engineering understandable.

---

## Pro Mode

Designed for sound engineers.

It can expose:

* RMS
* Peak
* Frequency spectrum
* Frequency bands
* Loudness
* Noise
* Distortion
* Clipping
* Feedback risk
* Reverberation
* Echo
* Coverage
* Left/right balance
* Measurement history
* Equipment information
* Signal-chain information
* Baselines
* Verification status

Both modes use the **same underlying engineering engine**.

```text
                USER
                  │
          ┌───────┴───────┐
          │               │
    SIMPLE MODE       PRO MODE
          │               │
          └───────┬───────┘
                  ↓
           CORE ENGINE
                  ↓
       Measurements + Rules
```

---

# 6. High-Level Architecture

SoundPilot will follow this architecture:

```text
                         SOUND ENGINEER
                               │
                               ▼
                         USER INTERFACE
                       Simple Mode / Pro Mode
                               │
                               ▼
                         GO APPLICATION
                     System Orchestration Layer
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
     PYTHON DSP          LOCAL DATABASE       CONNECTION LAYER
     ENGINE              & STORAGE            Devices/Mixers
          │                    │                    │
          │                    │                    │
          └────────────┬───────┴────────────────────┘
                       ▼
               ENGINEERING ENGINE
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        VERIFICATION        AI ASSISTANT
             │                   │
             └─────────┬─────────┘
                       ▼
                    ENGINEER
```

---

# 7. Major System Components

SoundPilot has three major intelligence/processing areas.

## 7.1 Python DSP Engine

Python handles the audio and signal-processing side.

Its responsibility is to listen to and analyze real audio.

Potential measurements include:

* Waveform
* RMS
* Peak level
* Frequency spectrum
* FFT
* Loudness
* Noise
* Clipping
* Distortion indicators
* Frequency balance
* Left/right balance
* Feedback indicators
* Reverberation
* Delayed energy
* Speech clarity
* Coverage-related measurements
* Real-time feature extraction

Python should primarily produce **measurements and signal features**.

It should not randomly decide that a sound is good or bad without an engineering basis.

---

# 8. Go Application

Go will be responsible for the main application and system orchestration.

Go understands the context around the measurements.

For example:

```text
Python:
"Measured this frequency response."

Go:
"This measurement belongs to the Back Center zone,
during the Speech profile,
using this venue,
with this equipment,
compared with this baseline."
```

Go coordinates:

* Venue management
* Zones
* Measurement points
* Equipment
* Signal chains
* Tests
* Baselines
* Measurements
* Engineering rules
* Verification
* Progress
* Change detection
* History
* Reports
* Device connections

Go is the **system coordinator**.

Python is the **signal-processing specialist**.

---

# 9. Engineering Engine

The engineering engine is one of the most important parts of SoundPilot.

SoundPilot should not work like:

```text
Audio → AI → "Something sounds bad."
```

Instead:

```text
Measurement
     +
Venue Context
     +
Equipment Context
     +
Test Purpose
     +
Baseline
     +
Engineering Profile
     +
Targets / Tolerances
     ↓
Engineering Result
```

The engineering engine determines whether a measurement is:

* Within target
* Outside target
* Improving
* Getting worse
* Stable
* Needs attention
* Needs re-verification

---

# 10. No Hardcoding of Engineering Decisions

SoundPilot must avoid unexplained hardcoded engineering values.

Important engineering behaviour should not be scattered throughout the application as magic numbers.

This includes:

* Measurement targets
* Acceptable ranges
* Tolerances
* Feedback thresholds
* Coverage requirements
* Clarity requirements
* Noise limits
* Distortion limits
* Verification rules
* Engineering profiles

These values should eventually be represented through a deliberate configuration/rules system.

For example, SoundPilot should not blindly assume:

```text
80% = GOOD
```

unless the percentage has a clearly defined meaning.

Technical measurements should remain available underneath the simplified scores.

---

# 11. Engineering Profiles

Different sound situations require different targets.

Potential profiles include:

* Speech
* Church / Vocal
* Music
* Concert
* DJ
* Conference
* Custom

The exact engineering targets and tolerances will be defined deliberately rather than invented during implementation.

---

# 12. Main Sound Goals

SoundPilot should help detect and monitor:

* Clipping
* Noise
* Feedback
* Excessive bass
* Excessive mid frequencies
* Excessive high frequencies
* Left/right imbalance
* Low signal
* Distortion
* Frequency imbalance
* Coverage problems
* Loudness
* Reverberation
* Echo
* Delayed echo
* Speech clarity
* System stability

The goal is not simply to make the system louder.

The system should optimize for the appropriate combination of:

* Clarity
* Balanced frequency response
* Low unwanted noise
* Low distortion
* No clipping
* Controlled feedback
* Good left/right balance
* Consistent coverage
* Appropriate loudness
* Good bass integration
* Useful separation between sound sources where measurable
* Stable sound during the event

---

# 13. Offline-First Architecture

Offline operation is a core requirement.

**Offline means the system must continue working without mobile data or internet access.**

The core system should operate locally:

```text
NO INTERNET
     │
     ▼
PHONE / LAPTOP
     │
     ├── Go Application
     ├── Python DSP
     ├── Local Database
     └── Frontend
             │
             ▼
       CORE TESTING
```

Offline functionality should include:

* Audio capture
* DSP
* Measurements
* Detection
* Venue information
* Equipment information
* Baselines
* Zone testing
* Stage-monitor testing
* Progress monitoring
* Before/after comparison
* Verification
* Continuous monitoring
* Checklists
* History
* Basic recommendations

Internet can optionally provide:

* AI assistance
* Cloud backup
* Synchronization
* Equipment information updates
* Software updates
* Remote features

---

# 14. Local Connectivity Without Internet

Internet and local connectivity are different.

SoundPilot may communicate through:

* USB
* Audio cables
* Bluetooth
* Local Wi-Fi
* Ethernet
* Audio interfaces
* Digital mixer network connections

A local Wi-Fi network can connect devices even when there is no internet.

```text
PHONE
  │
  │ Local Wi-Fi
  │
DIGITAL MIXER
  │
  └── No Internet Required
```

Bluetooth may also be supported where appropriate.

Professional measurement should prefer reliable audio connections when latency, compression, or accuracy could become a problem.

---

# 15. Measurement Sources

SoundPilot can work with different measurement sources.

### Built-in Phone Microphone

Useful for:

* Convenience
* General monitoring
* Basic measurements

### Computer/System Microphone

Useful for:

* Laptop-based monitoring
* Desktop setups

### External Calibrated Measurement Microphone

Useful for:

* Professional acoustic measurements
* Greater accuracy

### Audio Interface

Useful for:

* Reliable audio acquisition
* Mixer/system measurement
* Professional signal paths

The system should understand the limitations of each measurement source.

---

# 16. Venue Mapping

SoundPilot should allow engineers to map a venue before or during setup.

Venue information may include:

* Length
* Width
* Height
* Audience capacity
* Stage location
* Audience areas
* Walls
* Reflective surfaces
* Room characteristics
* Speaker positions
* Speaker height
* Speaker direction
* Speaker aiming angle
* Speaker spacing
* Subwoofer positions
* Delay speakers
* Fill speakers
* Measurement points

Engineers should be able to create as many measurement points as required.

---

# 17. Zone-Based Measurement

A venue can be divided into zones.

Example:

```text
                    STAGE
        ┌─────────────────────────┐
        │      SPEAKERS 🔊 🔊      │
        └─────────────────────────┘

        LEFT       CENTER       RIGHT
       ┌──────┬────────────┬──────┐
FRONT  │ LF   │    CF      │ RF   │
       ├──────┼────────────┼──────┤
MIDDLE │ LM   │    CM      │ RM   │
       ├──────┼────────────┼──────┤
BACK   │ LB   │    CB      │ RB   │
       └──────┴────────────┴──────┘
```

Each zone has its own:

* Measurements
* Baseline
* History
* Verification state
* Progress
* Last verified state
* Current configuration

---

# 18. Location-Specific Verification

Verification belongs to the measurement location.

If the engineer verifies:

```text
FRONT CENTER
🟢 VERIFIED
```

and walks to:

```text
BACK CENTER
```

the Front Center does not automatically become unverified.

Each location maintains its own state.

When a previously verified location is checked again, SoundPilot can compare:

```text
PREVIOUS

Coverage: 92%
Clarity: 94%
Feedback Risk: 12%
```

against:

```text
CURRENT

Coverage: 91%
Clarity: 93%
Feedback Risk: 14%
```

If the new state remains within the defined tolerance:

```text
Still verified.
```

If it has changed significantly:

```text
This location has changed since the previous verification.
Re-check or adjustment may be required.
```

A verification checkbox therefore means:

> **This location and configuration have been measured and confirmed to be within its defined acceptable state.**

It does not simply mean:

> "The engineer clicked a checkbox."

---

# 19. Progress Monitoring

SoundPilot should monitor improvement while the engineer is making changes.

Example:

```text
Back Coverage

52% 🔴
   ↓
61% 🔴
   ↓
69% 🟡
   ↓
78% 🟡
   ↓
86% 🟢
```

The system can report:

```text
Back coverage improved from 52% to 86%.
```

The underlying technical measurements remain available.

---

# 20. System-Wide Impact

Improving one location must not automatically mean the entire system improved.

For example:

```text
Back Coverage
52% → 84%       ✅

Front Level
92% → 104%      ⚠️

Feedback Risk
18% → 43%       ⚠️
```

SoundPilot should report:

> Back coverage improved, but the front is now too loud and feedback risk increased.

The core engineering loop is:

```text
BASELINE
   ↓
CHANGE
   ↓
MEASURE
   ↓
COMPARE
   ↓
CHECK OTHER AREAS
   ↓
ACCEPT / REJECT / ADJUST
```

This is one of SoundPilot's most important principles.

---

# 21. Stage Monitor System

Stage monitors are a first-class part of the system.

They are separate from the audience PA.

```text
SOUND SYSTEM
│
├── MAIN PA
│     └── Audience
│
└── STAGE MONITORS
      └── Performers
```

Stage-monitor testing should work both offline and during live monitoring.

Possible measurements include:

* Monitor level
* Performer audibility
* Vocal clarity
* Feedback risk
* Monitor EQ
* Monitor mix
* Stage noise
* Bleed
* Distortion
* Frequency behaviour
* Monitor position

Example:

```text
MONITOR 1 — VOCAL

Level             78% 🟡
Vocal Clarity     86% 🟢
Feedback Risk     62% 🟠
Noise              9% 🟢
Distortion         4% 🟢
```

If an engineer increases the monitor level:

```text
Vocal Clarity
76% → 91%        ✅

Performer Level
68% → 87%        ✅

Feedback Risk
22% → 71%        🔴
```

SoundPilot should identify the tradeoff instead of reporting only the improvement.

---

# 22. Echo and Reverberation

SoundPilot must distinguish between different acoustic problems.

### Room Reverberation

The room continues carrying sound after the original sound.

Possible analysis:

* Reverberant energy
* Speech clarity impact
* Reflective surfaces
* Speaker energy
* Room behaviour

SoundPilot should not automatically blame EQ.

### Feedback

An acoustic loop can occur:

```text
MIC
 ↓
SPEAKER
 ↓
MIC
 ↓
SPEAKER
```

SoundPilot can estimate feedback risk and identify problematic frequency regions where evidence supports it.

### Delayed Echo

A delayed copy of sound may result from:

* Large rooms
* Delay speakers
* Multiple speaker systems
* Reflections
* Poor timing/alignment

SoundPilot should analyze direct and delayed energy where possible.

---

# 23. Live Listener

SoundPilot will include a continuous monitoring experience.

Example:

```text
LIVE LISTENER

Coverage             🟢 88%
Speech Clarity       🟡 72%
Feedback Risk        🟢 14%
Noise                🟢 18%
Distortion           🟢 7%
Frequency Balance    🟡 76%
Left / Right         🟢 91%
Reverberation        🟠 68%
```

The exact scoring model will be defined during engineering design.

The system should always retain the underlying measurements.

---

# 24. Equipment Registration

SoundPilot should understand the equipment involved in a sound system.

Equipment may include:

1. Speakers
2. Subwoofers
3. Stage monitors
4. Mixers
5. Power amplifiers
6. Crossovers
7. Equalizers
8. Microphones
9. Cables
10. Audio sources
11. Audio interfaces

---

# 25. Speaker Information

A speaker record may contain:

* Brand
* Model
* Quantity
* Type
* RMS/continuous power
* Peak power
* Impedance
* Maximum SPL
* Frequency response
* Sensitivity
* Dispersion
* Active/passive
* Position
* Height
* Distance
* Aiming angle

---

# 26. Amplifier Information

An amplifier record may contain:

* Brand
* Model
* Channels
* Power per channel
* 4Ω capability
* 8Ω capability
* Bridge mode
* Gain
* Limiter
* Protection
* Connected speakers

---

# 27. Mixer Information

A mixer record may contain:

* Brand
* Model
* Analog/digital
* Number of channels
* Input channels
* Gain
* Fader
* EQ
* HPF
* Aux
* Main output
* Bus/group
* Routing

---

# 28. Crossover Information

A crossover record may contain:

* Brand
* Model
* Analog/digital
* HPF
* LPF
* Crossover frequency
* Slope
* Routing
* Gain
* Polarity/phase

---

# 29. Equalizer Information

An equalizer record may contain:

* Graphic/parametric type
* Frequency
* Gain
* Q
* HPF
* LPF
* Current EQ curve

---

# 30. Microphone Information

A microphone record may contain:

* Type
* Quantity
* Wired/wireless
* Channel
* Position
* Gain
* Intended use

---

# 31. Equipment Library

SoundPilot may eventually support:

* Manual equipment registration
* Equipment search
* Barcode scanning
* QR scanning
* Equipment database
* SoundPilot-generated QR codes

A barcode or QR code does **not automatically guarantee that technical specifications are correct**.

Technical information should be verified before being used for engineering decisions.

---

# 32. Signal Chain

SoundPilot should represent how audio travels through the system.

Example:

```text
Microphone
    ↓
Cable
    ↓
Mixer Channel 3
    ↓
Main Out
    ↓
Crossover
    ↓
Power Amplifier CH1
    ↓
Speaker 1
```

Another example:

```text
Mixer
 ├── Crossover → Amplifier 1 → Main Tops
 │
 └── Crossover → Amplifier 2 → Subwoofers
```

SoundPilot should use a common internal representation while allowing device-specific connection adapters.

---

# 33. Mixer Connectivity

Mixer connectivity has two different purposes.

## Audio Reception

Example:

```text
Microphone
    ↓
Mixer
    ↓
Main Output
    ↓
Audio Interface
    ↓
Phone / Computer
    ↓
SoundPilot Listener
```

A proper audio interface is preferred where necessary rather than connecting professional outputs directly to unsuitable microphone inputs.

---

## Mixer Data and Control

Digital mixers may expose settings through:

* USB
* Ethernet
* Local network
* Wi-Fi/network
* MIDI
* OSC
* Manufacturer APIs/protocols

Analog mixers generally cannot expose knob positions digitally.

For analog systems, the engineer may enter the baseline manually while SoundPilot analyzes the resulting audio.

SoundPilot should therefore not depend on one mixer manufacturer.

---

# 34. Connection Manager

The architecture should support different connection methods.

```text
                         MIXER
                           │
                ┌──────────┴──────────┐
                │                     │
             ANALOG                DIGITAL
                │                     │
         AUDIO INTERFACE        USB / NETWORK
                │                     │
                └──────────┬──────────┘
                           ↓
                    MIXER ADAPTER
                           ↓
                    SOUND PILOT
```

Bluetooth may also be supported where the connected device provides useful data.

Not every Bluetooth mixer connection provides access to mixer settings.

---

# 35. Baseline System

SoundPilot must support engineer-approved baselines.

The workflow is:

```text
Engineer sets system
        ↓
SoundPilot records baseline
        ↓
Listener starts
        ↓
Measurements are monitored
        ↓
Problem detected
        ↓
SoundPilot provides evidence-based guidance
        ↓
Engineer changes system
        ↓
Listener measures again
        ↓
SoundPilot verifies the result
```

The AI should not create the baseline without engineer approval.

---

# 36. Fault Diagnosis

SoundPilot can help investigate whether an issue may involve:

* Microphone
* Mixer
* Amplifier
* Cable
* Speaker
* Signal routing
* Acoustic environment

However, audio measurements alone cannot always uniquely identify the exact faulty component.

Therefore SoundPilot should use evidence-based language.

Example:

> Possible feedback around this frequency. Check microphone position and the corresponding system response before making an adjustment.

It should not claim:

> The amplifier is definitely faulty.

unless sufficient evidence exists.

---

# 37. AI Assistant

AI is optional.

The AI assistant is not the measurement authority.

The correct flow is:

```text
Audio
  ↓
Python DSP
  ↓
Measurements
  ↓
Go Engineering Engine
  ↓
Engineering Result
  ↓
AI Assistant
  ↓
Human-Friendly Explanation
```

AI can:

* Explain measurements
* Explain technical terms
* Explain possible causes
* Help ordinary users understand results
* Provide contextual guidance
* Help interpret engineering results

AI should not:

* Invent measurements
* Replace DSP
* Override engineering results
* Claim certainty without evidence
* Be required for offline measurements

---

# 38. Core Engineering Workflow

SoundPilot is built around this loop:

```text
                 ┌───────────────┐
                 │    BASELINE   │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │     CHANGE    │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │    MEASURE    │
                 └───────┬───────┘
                         ↓
                 ┌───────────────┐
                 │    COMPARE    │
                 └───────┬───────┘
                         ↓
                ┌──────────────────┐
                │ CHECK OTHER AREAS│
                └────────┬─────────┘
                         ↓
                ┌──────────────────┐
                │ ACCEPT / REJECT  │
                │     / ADJUST     │
                └────────┬─────────┘
                         │
                         └──────→ CONTINUE MONITORING
```

This prevents the system from treating a single improvement as proof that the whole sound system is now correct.

---

# 39. Data and State Philosophy

SoundPilot must preserve engineering context.

A measurement should not exist as an isolated number.

It should be associated with information such as:

```text
Venue
Zone
Measurement Point
Equipment
Signal Chain
Profile
Timestamp
Measurement Source
Baseline
Current Configuration
Engineering Result
Verification State
History
```

This allows SoundPilot to answer:

> What changed?

instead of simply:

> What is the current number?

---

# 40. Security and Reliability Principles

SoundPilot should be designed around:

* Local-first operation
* Clear data ownership
* Explicit configuration
* Traceable measurements
* Engineering-approved baselines
* Reproducible analysis
* Clear separation of measurement and interpretation
* No hidden engineering decisions
* No unexplained magic numbers
* Evidence before certainty

---

# 41. Golden Engineering Principles

SoundPilot follows these principles:

### 1. Measure before deciding.

### 2. Engineer stays in control.

### 3. Location matters.

### 4. Previous verification matters.

### 5. Verification must be fresh.

### 6. One improvement must not hide another problem.

### 7. No unexplained hardcoding.

### 8. Offline is a first-class mode.

### 9. AI is an assistant.

### 10. Never claim certainty without evidence.

---

# 42. Long-Term Goal

SoundPilot aims to evolve into a complete sound-engineering support platform capable of helping an engineer move from:

```text
VENUE
  ↓
MAP
  ↓
REGISTER EQUIPMENT
  ↓
CONNECT SYSTEM
  ↓
RECORD ENGINEER BASELINE
  ↓
MEASURE
  ↓
ANALYZE COVERAGE
  ↓
SETUP
  ↓
LIVE LISTENER
  ↓
DIAGNOSE
  ↓
ADVISE
  ↓
CHANGE
  ↓
VERIFY
  ↓
MONITOR
```

The ultimate goal is:

> **SoundPilot helps the engineer understand what is happening, make an informed adjustment, verify whether it actually helped, and ensure that the improvement does not create a new problem elsewhere.**

---

# 43. Project Status

SoundPilot is currently in the **architecture and system-design phase**.

Implementation should begin only after the core architecture, engineering rules, data model, interfaces, and responsibilities have been agreed upon.

The project will be developed incrementally.

```text
ARCHITECTURE
     ↓
DOMAIN DESIGN
     ↓
DATA MODEL
     ↓
SYSTEM CONTRACTS
     ↓
COMPONENT DESIGN
     ↓
IMPLEMENTATION
     ↓
TESTING
     ↓
REAL-WORLD VALIDATION
```

---

# 44. Final Architecture Summary

SoundPilot is built around five major ideas:

```text
                    SOUND PILOT
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   REAL AUDIO       SYSTEM CONTEXT     ENGINEERING
   MEASUREMENT        & EQUIPMENT         RULES
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                   COMPARISON
                         ↓
                   VERIFICATION
                         ↓
                  LIVE MONITORING
                         ↓
                  ENGINEER DECISION
                         │
                         ▼
                    OPTIONAL AI
```

SoundPilot is therefore not:

```text
AI → Guess
```

It is:

```text
REAL SOUND
    ↓
MEASURE
    ↓
UNDERSTAND CONTEXT
    ↓
APPLY ENGINEERING RULES
    ↓
COMPARE
    ↓
VERIFY
    ↓
MONITOR
    ↓
ASSIST THE ENGINEER
```

**SoundPilot — Measure. Understand. Adjust. Verify.**
