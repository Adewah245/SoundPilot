"""Noise measurement for SoundPilot.

``calculate_noise_level`` returns the estimated noise floor in **dBFS**
(decibels relative to full scale, where 0 dBFS = clipping).  Negative
values represent signal levels below full scale; e.g. -52 dBFS indicates
the noise floor sits 52 dB below the digital maximum.

The function estimates the noise floor by splitting the signal into short
windows, computing the RMS of each window, selecting the quietest 10%,
and converting that average RMS to dBFS via 20 * log10(rms).  A reference
floor of -240 dBFS is returned when the signal is silence.
"""

import numpy as np


def calculate_noise_level(audio: np.ndarray) -> float:
    """Estimate the noise floor from the quietest part of the signal.

    Returns the noise floor in dBFS (always <= 0 for a properly scaled
    signal, with 0 dBFS corresponding to digital full scale).
    """

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return -240.0

    # Flatten multi-channel audio into one sample stream.
    samples = samples.reshape(-1)

    # Split the signal into short windows.
    window_size = max(1, len(samples) // 20)

    levels = []

    for start in range(0, len(samples), window_size):
        window = samples[start:start + window_size]

        if window.size == 0:
            continue

        rms = float(np.sqrt(np.mean(window ** 2)))

        if rms > 0:
            levels.append(rms)

    if not levels:
        return -240.0

    # Use the quietest 10% of windows as an estimate of the noise floor.
    noise_window_count = max(1, len(levels) // 10)

    quietest_rms = float(np.mean(np.sort(levels)[:noise_window_count]))

    if quietest_rms <= 0:
        return -240.0

    # Convert linear RMS amplitude to dBFS.
    return float(20 * np.log10(max(quietest_rms, 1e-12)))