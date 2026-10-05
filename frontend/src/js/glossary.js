// =========================================================================
// SoundPilot — Plain-language glossary for non-engineers
// =========================================================================

export const GLOSSARY = {
  rms: {
    term: 'RMS',
    plain: 'RMS (Root Mean Square) is the average loudness of your audio signal over time. Think of it as the "typical" volume level — not the loudest moment, but what you actually hear most of the time.',
    analogy: 'Like the average speed on a car trip — not the top speed, but what you were usually doing.',
  },
  peak: {
    term: 'Peak',
    plain: 'Peak is the absolute loudest moment in your audio signal. If Peak gets too high (close to 0 dBFS), the sound will clip and distort.',
    analogy: 'Like the fastest you went on that car trip — even if just for a second.',
  },
  noise: {
    term: 'Noise Floor',
    plain: 'The noise floor is the quietest background level your system can detect. A lower (more negative) number is better — it means your system is quiet when nothing is playing.',
    analogy: 'Like the silence in a room before anyone speaks. A quiet room lets you hear whispers.',
  },
  distortion: {
    term: 'Distortion (THD+N)',
    plain: 'Distortion measures how much unwanted sound your system adds to the original. Lower is better. Anything above 1% starts to sound noticeably bad.',
    analogy: 'Like a photocopy that is slightly blurry — the original is there, but something extra was added.',
  },
  clipping: {
    term: 'Clipping',
    plain: 'Clipping happens when the audio signal is louder than the system can handle. The tops of the sound wave get "clipped off," causing harsh distortion. If you see clipping, turn something down.',
    analogy: 'Like filling a glass past the rim — the extra water spills over. Turn down the tap.',
  },
  feedback: {
    term: 'Feedback',
    plain: 'Feedback is the loud whistle or screech when a microphone picks up sound from a speaker and sends it back through the speaker — creating a loop. A feedback margin near 0 means you are dangerously close to feedback.',
    analogy: 'Like pointing a microphone at the speaker it is connected to. The sound goes round and round until it screams.',
  },
  dbfs: {
    term: 'dBFS',
    plain: 'dBFS (decibels relative to Full Scale) is how we measure digital audio volume. 0 dBFS is the absolute maximum — anything above that clips. Negative numbers are normal. More negative = quieter.',
    analogy: 'Like a thermometer where 0 is the hottest possible. -18 is comfortably warm. -60 is quite cold.',
  },
  waveform: {
    term: 'Waveform',
    plain: 'A waveform is a visual picture of your audio signal over time. The height shows how loud it is at each moment. It helps you see peaks, silence, and overall shape.',
    analogy: 'Like a heart monitor on a hospital screen — the line goes up and down showing what is happening.',
  },
  spectrum: {
    term: 'Frequency Spectrum',
    plain: 'The frequency spectrum shows which pitches (bass, mid, treble) are present and how loud each is. Low numbers (left) are bass. High numbers (right) are treble.',
    analogy: 'Like an equalizer on a stereo — each bar shows energy at that pitch. Flat bars = balanced sound.',
  },
  baseline: {
    term: 'Baseline',
    plain: 'A baseline is a measurement you take before making any changes. It becomes your reference point so you can tell if a change actually helped or made things worse.',
    analogy: 'Like weighing yourself before starting a diet. Without that starting number, you cannot tell progress.',
  },
  tolerance: {
    term: 'Tolerance',
    plain: 'Tolerance is the acceptable range around your target. If the target is -18 and tolerance is 3, anything between -21 and -15 is "good enough."',
    analogy: 'Like a speed limit with a 5 mph grace — 65 in a 60 zone is okay, but 70 is not.',
  },
  verification: {
    term: 'Verification',
    plain: 'Verification is the final step where you compare "before" and "after" measurements to confirm your change actually improved the sound.',
    analogy: 'Like taking a test to prove you learned something — the proof that the work paid off.',
  },
  signalChain: {
    term: 'Signal Chain',
    plain: 'The signal chain is the path audio takes from the microphone through each piece of equipment to the speakers. Each step can affect the sound.',
    analogy: 'Like a bucket brigade — water passes from the mic, to the mixer, to the processor, to the amp, to the speakers.',
  },
  zone: {
    term: 'Zone',
    plain: 'A zone is a section of your venue — like the front rows, middle, or balcony. Sound can be different in each zone, so we measure them separately.',
    analogy: 'Like rooms in a house — the kitchen, living room, and bedroom each have different acoustics.',
  },
  measurementPoint: {
    term: 'Measurement Point',
    plain: 'A measurement point is a specific spot in a zone where you place a microphone to measure the sound.',
    analogy: 'Like choosing where to stand in a concert — the sound is different at the front, middle, and back.',
  },
  session: {
    term: 'Session',
    plain: 'A session is a period of work — like a rehearsal or a service — during which you take multiple measurements. All measurements are grouped together.',
    analogy: 'Like a study session — you sit down, do several tasks, and everything is saved under that one block.',
  },
  smartSuggestion: {
    term: 'Smart Suggestion',
    plain: 'Smart Suggestions are automatic recommendations based on your measurements. They tell you what needs attention and exactly what to do about it.',
    analogy: 'Like a check-engine light that also tells you what to fix and how urgent it is.',
  },
  target: {
    term: 'Target',
    plain: 'A target is the ideal value you want for each measurement. Your job is to adjust the system until measurements land close to the target.',
    analogy: 'Like the bullseye on a dartboard — you aim for it, and getting close is still good.',
  },
  engineeringProfile: {
    term: 'Engineering Profile',
    plain: 'An engineering profile is a saved set of targets and tolerances for your venue. It defines what "good sound" means for your specific space.',
    analogy: 'Like a recipe — it lists the exact amounts (targets) and how much variation is okay (tolerances).',
  },
};

export function getGlossary(key) {
  return GLOSSARY[key] || null;
}
