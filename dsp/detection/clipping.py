"""Clipping detection for SoundPilot."""

import numpy as np


def detect_clipping(
    audio: np.ndarray,
    threshold: float = 0.99,
) -> bool:
    """Detect sustained or repeated digital clipping in an audio signal."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return False

    if not 0 < threshold <= 1:
        raise ValueError("clipping threshold must be greater than 0 and at most 1")

    samples = samples.reshape(-1)

    clipped_samples = np.abs(samples) >= threshold

    if not np.any(clipped_samples):
        return False

    # A single isolated sample can be a harmless transient.
    # Require at least three clipped samples before reporting clipping.
    return bool(np.count_nonzero(clipped_samples) >= 3)