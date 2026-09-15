"""Frequency analysis for SoundPilot."""

import numpy as np
from scipy.fft import rfft, rfftfreq


def calculate_frequency_spectrum(
    audio: np.ndarray,
    sample_rate: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Calculate frequency bins and their magnitude levels."""

    if audio.size == 0:
        return np.array([]), np.array([])

    samples = audio.astype(np.float64)

    if samples.ndim > 1:
        samples = np.mean(samples, axis=1)

    window = np.hanning(len(samples))
    spectrum = np.abs(rfft(samples * window))
    frequencies = rfftfreq(len(samples), 1 / sample_rate)

    return frequencies, spectrum
