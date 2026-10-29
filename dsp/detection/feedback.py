"""Feedback detection for SoundPilot.

``detect_feedback`` looks for a dominant narrow frequency peak that is
significantly louder than the rest of the spectrum — a classic signature of
acoustic feedback or resonance.

The spectrum magnitudes supplied by the DSP pipeline are in **dBFS** (as
returned by ``calculate_frequency_spectrum``).  A simple but effective
heuristic: if the loudest bin exceeds the median level by at least
``peak_db_above_median`` decibels, a feedback-like peak is present.
"""

import numpy as np


def detect_feedback(
    frequencies: np.ndarray,
    magnitudes: np.ndarray,
    peak_db_above_median: float = 20.0,
) -> bool:
    """Detect a dominant narrow frequency peak indicative of feedback.

    Parameters
    ----------
    frequencies:
        Frequency values corresponding to each magnitude bin (Hz).
    magnitudes:
        Spectrum magnitudes in **dBFS** for each frequency bin.
    peak_db_above_median:
        A peak that exceeds the median by this many dB is flagged as
        a potential feedback event (default: 20 dB).

    Returns
    -------
    bool
        ``True`` if a feedback-like narrow peak is detected.
    """

    if frequencies.size == 0 or magnitudes.size == 0:
        return False

    if magnitudes.size < 3:
        return False

    # Work in dB space: compare the loudest bin against the median level.
    peak_db = float(np.max(magnitudes))
    median_db = float(np.median(magnitudes))

    return (peak_db - median_db) >= peak_db_above_median
