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

    samples = audio.astype(np.float64)

    if samples.size == 0:
        mono_audio = samples
    elif samples.ndim > 1:
        # Reduce all channels to one consistent mono signal.
        mono_audio = np.mean(samples, axis=1)
    else:
        mono_audio = samples

    frequencies, spectrum = calculate_frequency_spectrum(
        mono_audio,
        sample_rate,
    )

    return {
        "rms": calculate_rms(mono_audio),
        "peak": calculate_peak(mono_audio),
        "dbfs": calculate_dbfs(mono_audio),
        "noise_level": calculate_noise_level(mono_audio),
        "frequencies": frequencies,
        "spectrum": spectrum,
    }