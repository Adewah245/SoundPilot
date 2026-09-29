"""Noise measurement for SoundPilot."""

import numpy as np


def calculate_noise_level(audio: np.ndarray) -> float:
    """Estimate the noise floor from the quietest part of the signal."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return 0.0

    # Flatten multi-channel audio into one sample stream.
    samples = samples.reshape(-1)

    # Split the signal into short windows.
    window_size = max(1, len(samples) // 20)

    levels = []

    for start in range(0, len(samples), window_size):
        window = samples[start:start + window_size]

        if window.size == 0:
            continue

        rms = np.sqrt(np.mean(window**2))

        if rms > 0:
            levels.append(rms)

    if not levels:
        return 0.0

    # Use the quietest 10% of windows as an estimate of the noise floor.
    noise_window_count = max(1, len(levels) // 10)

    quietest_levels = np.sort(levels)[:noise_window_count]

    return float(np.mean(quietest_levels))