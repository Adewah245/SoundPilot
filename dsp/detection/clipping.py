"""Clipping detection for SoundPilot."""

import numpy as np


def detect_clipping(
    audio: np.ndarray,
    threshold: float = 0.99,
) -> bool:
    """Detect whether an audio signal is clipping."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return False

    return bool(np.any(np.abs(samples) >= threshold))
