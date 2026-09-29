"""JSON runner for the SoundPilot DSP engine."""

import json
import math
import sys
from datetime import datetime, timezone

import numpy as np

from dsp.capture.audio_capture import record_audio
from dsp.detection.clipping import detect_clipping
from dsp.detection.feedback import detect_feedback
from dsp.features.audio_features import extract_features
from dsp.measurements.distortion import calculate_distortion


# Current version of the Go <-> Python measurement contract.
CONTRACT_VERSION = "1.0"


# Read one request from Go and return one measurement response.
def main() -> None:
    """Run the DSP measurement pipeline."""

    request = json.load(sys.stdin)

    request_contract_version = request.get("contract_version")

    if request_contract_version != CONTRACT_VERSION:
        raise ValueError(
            f"unsupported contract version: {request_contract_version!r}; "
            f"expected {CONTRACT_VERSION!r}"
        )

    duration_seconds = float(request["duration_seconds"])
    sample_rate = int(request.get("sample_rate", 44100))
    channels = int(request.get("channels", 1))

    if not math.isfinite(duration_seconds) or duration_seconds <= 0:
        raise ValueError(
            "duration_seconds must be a finite value greater than 0"
        )

    if sample_rate <= 0:
        raise ValueError("sample_rate must be greater than 0")

    if channels <= 0:
        raise ValueError("channels must be greater than 0")

    audio_device = int(request.get("audio_device", -1))

    if audio_device < -1:
        raise ValueError("audio_device must be -1 or a valid device index")
    sample_count = int(duration_seconds * sample_rate)

    if sample_count < 1:
        raise ValueError(
            "duration_seconds and sample_rate must produce at least one sample"
    )

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
            "level_db": float(magnitude),
        }
        for frequency, magnitude in zip(
            features["frequencies"],
            features["spectrum"],
        )
    ]

    response = {
        "contract_version": CONTRACT_VERSION,
        "session_id": request.get("session_id", ""),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "rms_decibels": features["dbfs"],
        "peak_decibels": float(
            20 * np.log10(max(features["peak"], 1e-12))
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