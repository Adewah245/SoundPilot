"""Feedback detection for SoundPilot."""

import numpy as np


def detect_feedback(
    frequencies: np.ndarray,
    magnitudes: np.ndarray,
    peak_ratio: float = 8.0,
) -> bool:
    """Detect a dominant narrow frequency peak."""

    if frequencies.size == 0 or magnitudes.size == 0:
        return False

    if magnitudes.size < 3:
        return False

    peak = float(np.max(magnitudes))
    median = float(np.median(magnitudes))

    if median <= 0:
        return False

    return peak / median >= peak_ratio
