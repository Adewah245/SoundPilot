"""Distortion measurement for SoundPilot."""

import numpy as np


def calculate_distortion(audio: np.ndarray) -> float:
    """Estimate distortion using harmonic energy relative to the fundamental."""

    samples = audio.astype(np.float64)

    if samples.size < 4:
        return 0.0

    spectrum = np.abs(np.fft.rfft(samples))
    fundamental = float(np.max(spectrum))

    if fundamental <= 0:
        return 0.0

    harmonic_energy = float(np.sum(spectrum**2) - fundamental**2)

    if harmonic_energy <= 0:
        return 0.0

    return float(np.sqrt(harmonic_energy) / fundamental)
