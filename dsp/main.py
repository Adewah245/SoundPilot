"""SoundPilot Python DSP engine entry point."""

from dsp.capture.audio_capture import record_audio
from dsp.features.audio_features import extract_features


def measure_audio(
    duration_seconds: float,
    sample_rate: int = 44100,
    channels: int = 1,
) -> dict:
    """Capture audio and return its measured features."""

    audio = record_audio(
        duration_seconds=duration_seconds,
        sample_rate=sample_rate,
        channels=channels,
    )

    return extract_features(
        audio,
        sample_rate,
    )
