"""JSON runner for the SoundPilot DSP engine."""

import json
import sys

from dsp.main import measure_audio


# Read one DSP request from Go and return one JSON response.
def main() -> None:
    """Run the DSP engine using a JSON request from standard input."""

    request = json.load(sys.stdin)

    duration_seconds = float(request["duration_seconds"])
    sample_rate = int(request.get("sample_rate", 44100))
    channels = int(request.get("channels", 1))

    result = measure_audio(
        duration_seconds=duration_seconds,
        sample_rate=sample_rate,
        channels=channels,
    )

    response = {
        "rms": result["rms"],
        "peak": result["peak"],
        "dbfs": result["dbfs"],
        "noise_level": result["noise_level"],
        "frequencies": result["frequencies"].tolist(),
        "spectrum": result["spectrum"].tolist(),
    }

    print(json.dumps(response))


if __name__ == "__main__":
    main()