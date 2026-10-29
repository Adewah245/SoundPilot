"""Distortion measurement for SoundPilot.

``calculate_distortion`` returns an **estimated THD (Total Harmonic
Distortion) as a percentage (0–100)**, computed from the signal spectrum.

The estimate uses a simplified harmonic-energy method:

    THD% = 100 * sqrt(H2² + H3² + H4² + H5²) / F

where F is the amplitude of the strongest bin (the assumed fundamental) and
H2–H5 are the amplitudes at its integer multiples.

This approach is a coarse estimate.  It does not measure THD+N and has not
been validated against a calibrated reference.  Results are labelled as
"estimated THD" in the user interface and should not be treated as precision
measurements.
"""

import numpy as np


def calculate_distortion(audio: np.ndarray) -> float:
    """Estimate harmonic distortion from the signal spectrum.

    Returns an estimated THD percentage (0.0–100.0).  The result is a
    coarse approximation; see module docstring for caveats.
    """

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
    fundamental_amplitude = spectrum[fundamental_index]

    if fundamental_amplitude <= 0:
        return 0.0

    harmonic_energy = 0.0

    # Accumulate harmonic amplitudes (2×, 3×, 4×, 5× the fundamental).
    for harmonic in range(2, 6):
        harmonic_index = fundamental_index * harmonic

        if harmonic_index < len(spectrum):
            harmonic_energy += spectrum[harmonic_index] ** 2

    if harmonic_energy <= 0:
        return 0.0

    # THD ratio = sqrt(sum of harmonic energies) / fundamental amplitude.
    thd_ratio = float(np.sqrt(harmonic_energy) / fundamental_amplitude)

    # Convert ratio to percentage for consistent presentation.
    return thd_ratio * 100.0