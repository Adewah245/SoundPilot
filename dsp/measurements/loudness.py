"""Loudness measurement for SoundPilot."""

import numpy as np


def calculate_dbfs(audio: np.ndarray) -> float:
    """Calculate the signal level in dBFS."""

    samples = audio.astype(np.float64)

    # Empty audio has no measurable signal.
    if samples.size == 0:
        return -240.0

    rms = np.sqrt(np.mean(samples**2))

    # Silence is represented by the finite DSP floor.
    if rms <= 0:
        return -240.0

    return float(20 * np.log10(max(rms, 1e-12)))