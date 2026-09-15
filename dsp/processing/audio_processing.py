"""Basic audio processing utilities for SoundPilot."""

import numpy as np


def to_mono(audio: np.ndarray) -> np.ndarray:
    """Convert multi-channel audio to a single mono channel."""

    if audio.ndim == 1:
        return audio.astype(np.float32)

    return np.mean(audio, axis=1, dtype=np.float32)


def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """Normalize audio samples to a maximum absolute value of 1."""

    audio = audio.astype(np.float32)

    peak = np.max(np.abs(audio))

    if peak == 0:
        return audio

    return audio / peak
