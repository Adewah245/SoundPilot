"""JSON runner for the SoundPilot DSP engine."""

import json
import sys
from datetime import datetime, timezone

from dsp.capture.audio_capture import record_audio
from dsp.detection.clipping import detect_clipping
from dsp.detection.feedback import detect_feedback
from dsp.features.audio_features import extract_features
from dsp.measurements.distortion import calculate_distortion


# Read one request from Go and return one measurement response.
def main() -> None:
    """Run the DSP measurement pipeline."""

    request = json.load(sys.stdin)

    duration_seconds = float(request["duration_seconds"])
    sample_rate = int(request.get("sample_rate", 44100))
    channels = int(request.get("channels", 1))

    audio = record_audio(
        duration_seconds=duration_seconds,
        sample_rate=sample_rate,
        channels=channels,
    )

    features = extract_features(
        audio,
        sample_rate,
    )

    clipping_detected = detect_clipping(audio)

    feedback_detected = detect_feedback(
        features["frequencies"],
        features["spectrum"],
    )

    distortion_level = calculate_distortion(audio)

    frequency_data = [
        {
            "frequency_hz": float(frequency),
            "level_db": float(20 * __import__("numpy").log10(max(magnitude, 1e-12))),
        }
        for frequency, magnitude in zip(
            features["frequencies"],
            features["spectrum"],
        )
    ]

    response = {
        "contract_version": request.get("contract_version", ""),
        "session_id": request.get("session_id", ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "rms_decibels": features["dbfs"],
        "peak_decibels": float(
            20 * __import__("numpy").log10(max(features["peak"], 1e-12))
        ),
        "frequency_data": frequency_data,
        "noise_level": features["noise_level"],
        "distortion_level": distortion_level,
        "clipping_detected": clipping_detected,
        "feedback_detected": feedback_detected,
        "duration_seconds": duration_seconds,
        "sample_rate": sample_rate,
        "channels": channels,
    }

    print(json.dumps(response))


if __name__ == "__main__":
    main()