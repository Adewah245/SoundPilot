"""Peak measurement for SoundPilot."""

import numpy as np


def calculate_peak(audio: np.ndarray) -> float:
    """Calculate the absolute peak of an audio signal."""

    samples = audio.astype(np.float64)

    if samples.size == 0:
        return 0.0

    return float(np.max(np.abs(samples)))
