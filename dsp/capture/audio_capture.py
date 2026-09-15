"""Audio capture layer for SoundPilot."""

import numpy as np
import sounddevice as sd


# Capture microphone audio for a fixed duration.
def record_audio(
    duration_seconds: float,
    sample_rate: int = 44100,
    channels: int = 1,
    device: int | None = None,
) -> np.ndarray:
    """Record audio from a microphone and return it as a NumPy array."""

    # Validate the recording settings before accessing the microphone.
    if duration_seconds <= 0:
        raise ValueError("duration_seconds must be greater than 0")

    if sample_rate <= 0:
        raise ValueError("sample_rate must be greater than 0")

    if channels <= 0:
        raise ValueError("channels must be greater than 0")

    # Calculate the number of audio samples to capture.
    sample_count = int(duration_seconds * sample_rate)

    try:
        # Start recording from the selected audio input device.
        audio = sd.rec(
            sample_count,
            samplerate=sample_rate,
            channels=channels,
            dtype="float32",
            device=device,
        )

        # Wait until the recording has completely finished.
        sd.wait()

    except sd.PortAudioError as exc:
        raise RuntimeError(f"Audio capture failed: {exc}") from exc

    # Return the captured audio to the rest of the DSP pipeline.
    return np.asarray(audio, dtype=np.float32)