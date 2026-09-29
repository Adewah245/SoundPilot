"""Frequency analysis for SoundPilot."""

import numpy as np
from scipy.fft import rfft, rfftfreq


def calculate_frequency_spectrum(
    audio: np.ndarray,
    sample_rate: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Calculate normalized frequency bins and magnitude levels."""

    if audio.size == 0 or sample_rate <= 0:
        return np.array([]), np.array([])

    samples = audio.astype(np.float64)

    if samples.ndim > 1:
        samples = np.mean(samples, axis=1)

    if samples.size < 2:
        return np.array([]), np.array([])

    # Remove DC offset before frequency analysis.
    samples = samples - np.mean(samples)

    # Apply a Hann window to reduce spectral leakage.
    window = np.hanning(len(samples))
    windowed_samples = samples * window

    spectrum = np.abs(rfft(windowed_samples))
    frequencies = rfftfreq(len(samples), 1 / sample_rate)

    # Normalize the FFT magnitude to the input signal amplitude.
    window_gain = np.sum(window)

    if window_gain > 0:
        spectrum = spectrum / window_gain

    # Convert one-sided spectrum to amplitude levels.
    if len(spectrum) > 2:
        spectrum[1:-1] *= 2

    # Convert amplitude to decibels.
    magnitude_db = 20 * np.log10(np.maximum(spectrum, 1e-12))

    return frequencies, magnitude_db