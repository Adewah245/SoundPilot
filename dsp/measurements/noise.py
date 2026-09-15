"""Noise measurement for SoundPilot."""

import numpy as np


def calculate_noise_level(audio: np.ndarray) -> float:
    """Estimate the noise level using the RMS level of the signal."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return 0.0

    return float(np.sqrt(np.mean(samples**2)))
