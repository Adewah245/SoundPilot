"""Loudness measurement for SoundPilot."""

import numpy as np


def calculate_dbfs(audio: np.ndarray) -> float:
    """Calculate the signal level in dBFS."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return float("-inf")

    rms = np.sqrt(np.mean(samples**2))

    if rms <= 0:
        return float("-inf")

    return float(20 * np.log10(rms))
