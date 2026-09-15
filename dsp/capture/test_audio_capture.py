import numpy as np

from audio_capture import record_audio


def test_record_audio():
    audio = record_audio(
        duration_seconds=1,
        sample_rate=44100,
        channels=1,
    )

    assert isinstance(audio, np.ndarray)
    assert audio.shape[0] == 44100
    assert audio.shape[1] == 1