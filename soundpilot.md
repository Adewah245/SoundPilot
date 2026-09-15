# SoundPilot Project Structure

> Measure. Understand. Adjust. Verify.

## 1. Project Goal

SoundPilot is an offline-first intelligent sound-system monitoring and engineering support platform.

The project should be:

- Simple for non-engineers.
- Powerful enough for sound engineers.
- Offline-first.
- Measurement-driven.
- Easy to navigate.
- Modular and easy to extend.
- Built around real audio input and analysis.
- Able to work with the equipment the user already has.

---

# 2. Technology Stack

SoundPilot will currently use:

- TypeScript
- React
- Vite
- Web Audio API
- Browser Storage / IndexedDB
- CSS

### Current MVP

We do **not** need:

- Go
- Python
- A cloud server
- A database server

The browser will handle the core local functionality.

AI and cloud services can be added later as optional features.

---

# 3. Main Architecture

```text
                         SOUND PILOT
                              │
                              ▼
                    ┌───────────────────┐
                    │   AUDIO INPUT     │
                    └─────────┬─────────┘
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Phone Mic       Computer Mic      External Input
                                             │
                                  USB / Interface / Mixer
                             
                              │
                              ▼
                    ┌───────────────────┐
                    │    DSP ENGINE     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ SOUND ANALYSIS     │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    ENGINEERING    │
                    │     ENGINE        │
                    └─────────┬─────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
             Alerts       Results       Recommendations
                              │
                              ▼
                    ┌───────────────────┐
                    │   AI ASSISTANT    │
                    └───────────────────┘

 SoundPilot/
│
├── public/
│   └── assets/
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers/
│   │
│   ├── features/
│   │   │
│   │   ├── audio/
│   │   │   ├── AudioEngine.ts
│   │   │   ├── AudioInput.ts
│   │   │   ├── AudioRecorder.ts
│   │   │   ├── AudioAnalyzer.ts
│   │   │   │
│   │   │   ├── devices/
│   │   │   │   ├── DeviceManager.ts
│   │   │   │   └── deviceTypes.ts
│   │   │   │
│   │   │   ├── dsp/
│   │   │   │   ├── rms.ts
│   │   │   │   ├── peak.ts
│   │   │   │   ├── spectrum.ts
│   │   │   │   ├── fft.ts
│   │   │   │   ├── frequencyBands.ts
│   │   │   │   └── clipping.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   ├── venue/
│   │   │   ├── Venue.ts
│   │   │   ├── Zone.ts
│   │   │   ├── MeasurementPoint.ts
│   │   │   ├── VenueManager.ts
│   │   │   ├── ZoneManager.ts
│   │   │   │
│   │   │   ├── mapping/
│   │   │   │   ├── VenueMap.ts
│   │   │   │   └── Positioning.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   ├── equipment/
│   │   │   ├── EquipmentManager.ts
│   │   │   ├── Speaker.ts
│   │   │   ├── Subwoofer.ts
│   │   │   ├── Monitor.ts
│   │   │   ├── Mixer.ts
│   │   │   ├── Amplifier.ts
│   │   │   ├── Microphone.ts
│   │   │   ├── Crossover.ts
│   │   │   ├── Equalizer.ts
│   │   │   │
│   │   │   ├── signalChain/
│   │   │   │   ├── SignalChain.ts
│   │   │   │   └── SignalChainNode.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   ├── measurements/
│   │   │   ├── Measurement.ts
│   │   │   ├── MeasurementSession.ts
│   │   │   ├── MeasurementManager.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── monitoring/
│   │   │   ├── LiveMonitor.ts
│   │   │   ├── MonitorSession.ts
│   │   │   ├── AlertManager.ts
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── clippingAlert.ts
│   │   │   │   ├── noiseAlert.ts
│   │   │   │   ├── feedbackAlert.ts
│   │   │   │   └── imbalanceAlert.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   ├── baseline/
│   │   │   ├── BaselineManager.ts
│   │   │   ├── createBaseline.ts
│   │   │   ├── compareBaseline.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── verification/
│   │   │   ├── VerificationManager.ts
│   │   │   ├── verifyMeasurement.ts
│   │   │   ├── recheckMeasurement.ts
│   │   │   ├── verificationState.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── history/
│   │   │   ├── MeasurementHistory.ts
│   │   │   ├── TestHistory.ts
│   │   │   ├── ChangeHistory.ts
│   │   │   └── types.ts
│   │   │
│   │   └── ai/
│   │       ├── AiAssistant.ts
│   │       ├── prompts.ts
│   │       ├── recommendations.ts
│   │       └── types.ts
│   │
│   ├── core/
│   │   │
│   │   ├── analysis/
│   │   │   ├── signalAnalysis.ts
│   │   │   ├── noiseAnalysis.ts
│   │   │   ├── feedbackAnalysis.ts
│   │   │   ├── frequencyAnalysis.ts
│   │   │   ├── balanceAnalysis.ts
│   │   │   ├── distortionAnalysis.ts
│   │   │   ├── loudnessAnalysis.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── engineering/
│   │   │   ├── EngineeringEngine.ts
│   │   │   ├── profiles/
│   │   │   │   ├── speech.ts
│   │   │   │   ├── church.ts
│   │   │   │   ├── music.ts
│   │   │   │   ├── concert.ts
│   │   │   │   └── custom.ts
│   │   │   │
│   │   │   ├── rules/
│   │   │   │   ├── clippingRules.ts
│   │   │   │   ├── noiseRules.ts
│   │   │   │   ├── feedbackRules.ts
│   │   │   │   ├── frequencyRules.ts
│   │   │   │   ├── balanceRules.ts
│   │   │   │   └── verificationRules.ts
│   │   │   │
│   │   │   ├── targets/
│   │   │   │   ├── targets.ts
│   │   │   │   └── tolerances.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── storage.ts
│   │   │   ├── localStorage.ts
│   │   │   ├── database.ts
│   │   │   │
│   │   │   ├── repositories/
│   │   │   │   ├── venueRepository.ts
│   │   │   │   ├── measurementRepository.ts
│   │   │   │   ├── equipmentRepository.ts
│   │   │   │   ├── baselineRepository.ts
│   │   │   │   └── verificationRepository.ts
│   │   │   │
│   │   │   └── types.ts
│   │   │
│   │   └── types/
│   │       ├── audio.ts
│   │       ├── measurement.ts
│   │       ├── venue.ts
│   │       ├── equipment.ts
│   │       ├── engineering.ts
│   │       ├── verification.ts
│   │       └── monitoring.ts
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AppLayout.tsx
│   │   │
│   │   ├── audio/
│   │   │   ├── LevelMeter.tsx
│   │   │   ├── Spectrum.tsx
│   │   │   ├── Waveform.tsx
│   │   │   └── InputSelector.tsx
│   │   │
│   │   ├── engineering/
│   │   │   ├── AlertCard.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── StatusIndicator.tsx
│   │   │
│   │   └── venue/
│   │       ├── VenueCard.tsx
│   │       ├── ZoneCard.tsx
│   │       └── MeasurementPointCard.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Venue/
│   │   ├── Measurements/
│   │   ├── Equipment/
│   │   ├── LiveListener/
│   │   ├── Verification/
│   │   ├── Baseline/
│   │   ├── History/
│   │   ├── StageMonitors/
│   │   ├── Settings/
│   │   └── AiAssistant/
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── layout.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tests/
│   ├── audio/
│   ├── analysis/
│   ├── engineering/
│   └── features/
│
├── docs/
│   ├── architecture.md
│   ├── audio-pipeline.md
│   ├── engineering-rules.md
│   ├── measurement-model.md
│   ├── verification-model.md
│   └── roadmap.md
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md