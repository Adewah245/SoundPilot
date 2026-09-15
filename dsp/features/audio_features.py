"""Audio feature extraction for SoundPilot."""

import numpy as np

from dsp.measurements.frequency import calculate_frequency_spectrum
from dsp.measurements.loudness import calculate_dbfs
from dsp.measurements.noise import calculate_noise_level
from dsp.measurements.peak import calculate_peak
from dsp.measurements.rms import calculate_rms


def extract_features(
    audio: np.ndarray,
    sample_rate: int,
) -> dict:
    """Extract the main audio features from a signal."""

    frequencies, spectrum = calculate_frequency_spectrum(
        audio,
        sample_rate,
    )

    return {
        "rms": calculate_rms(audio),
        "peak": calculate_peak(audio),
        "dbfs": calculate_dbfs(audio),
        "noise_level": calculate_noise_level(audio),
        "frequencies": frequencies,
        "spectrum": spectrum,
    }
