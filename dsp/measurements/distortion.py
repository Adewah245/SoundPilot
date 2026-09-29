"""Distortion measurement for SoundPilot."""

import numpy as np


def calculate_distortion(audio: np.ndarray) -> float:
    """Estimate harmonic distortion from the signal spectrum."""

    samples = audio.astype(np.float64)

    if samples.size < 4:
        return 0.0

    samples = samples.reshape(-1)

    # Remove DC offset.
    samples = samples - np.mean(samples)

    spectrum = np.abs(np.fft.rfft(samples))

    if spectrum.size < 3:
        return 0.0

    # Ignore the DC component.
    spectrum[0] = 0

    fundamental_index = int(np.argmax(spectrum))
    fundamental_energy = spectrum[fundamental_index] ** 2

    if fundamental_energy <= 0:
        return 0.0

    harmonic_energy = 0.0

    # Check harmonic frequencies (2x, 3x, 4x, 5x).
    for harmonic in range(2, 6):
        harmonic_index = fundamental_index * harmonic

        if harmonic_index < len(spectrum):
            harmonic_energy += spectrum[harmonic_index] ** 2

    if harmonic_energy <= 0:
        return 0.0

    # THD = harmonic energy / fundamental energy
    thd = np.sqrt(harmonic_energy / fundamental_energy)

    return float(thd)