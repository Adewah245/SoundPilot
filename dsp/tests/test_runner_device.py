"""Tests for the DSP runner's audio-device forwarding logic.

These tests verify that:
  - audio_device=-1 is mapped to device=None (sounddevice default).
  - audio_device>=0 is passed through unchanged.
  - audio_device<-1 raises a ValueError before touching audio hardware.

PortAudio is not available in this test environment, so sounddevice is
replaced with a minimal stub before any imports that would trigger the
PortAudio load.  The audio-capture function is mocked so no microphone
is required.
"""

import importlib
import json
import sys
from io import StringIO
from types import ModuleType
from unittest.mock import MagicMock, patch

import numpy as np
import pytest


# ---------------------------------------------------------------------------
# Stub out sounddevice before any SoundPilot import touches it.
# This must happen at module level so that the first import of
# dsp.capture.audio_capture (which does `import sounddevice as sd`) uses
# the fake module rather than the real one that needs PortAudio.
# ---------------------------------------------------------------------------

def _make_sounddevice_stub() -> ModuleType:
    """Return a minimal sounddevice stand-in."""
    stub = ModuleType("sounddevice")
    stub.rec = MagicMock(return_value=np.zeros((100, 1), dtype=np.float32))
    stub.wait = MagicMock()

    class _PortAudioError(Exception):
        pass

    stub.PortAudioError = _PortAudioError
    return stub


# Install the stub for the entire test module so all tests share it.
_sd_stub = _make_sounddevice_stub()
sys.modules.setdefault("sounddevice", _sd_stub)


# ---------------------------------------------------------------------------
# Now it is safe to import dsp modules.
# ---------------------------------------------------------------------------

import dsp.runner as runner_mod  # noqa: E402 (import after sys.modules patch)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_request(**overrides) -> str:
    req = {
        "contract_version": "1.0",
        "session_id": "test-session",
        "venue_id": "venue-1",
        "zone_id": "zone-1",
        "measurement_point_id": "mp-1",
        "audio_source": "microphone",
        "audio_device": -1,
        "duration_seconds": 0.1,
        "sample_rate": 44100,
        "channels": 1,
    }
    req.update(overrides)
    return json.dumps(req)


def _fake_audio(duration_s=0.1, sample_rate=44100, channels=1):
    samples = int(duration_s * sample_rate)
    return np.random.uniform(-0.1, 0.1, (samples, channels)).astype(np.float32)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

class TestRunnerDeviceForwarding:
    """Verify that runner.py passes the correct device argument to record_audio."""

    def _run_with_request(self, request_str: str):
        """Execute runner.main() with the given JSON request via stdin."""
        captured_device = {}

        def fake_record(duration_seconds, sample_rate, channels, device=None):
            captured_device["device"] = device
            return _fake_audio(duration_seconds, sample_rate, channels)

        with (
            patch.object(runner_mod, "record_audio", side_effect=fake_record),
            patch("sys.stdin", StringIO(request_str)),
            patch("sys.stdout", new_callable=StringIO),
        ):
            runner_mod.main()

        return captured_device.get("device", "NOT_SET")

    def test_default_device_passes_none(self):
        """audio_device=-1 must translate to device=None for sounddevice."""
        device = self._run_with_request(_make_request(audio_device=-1))
        assert device is None, f"Expected None for default device, got {device!r}"

    def test_explicit_device_zero_passes_zero(self):
        """audio_device=0 must be forwarded as device=0."""
        device = self._run_with_request(_make_request(audio_device=0))
        assert device == 0, f"Expected device=0, got {device!r}"

    def test_explicit_device_two_passes_two(self):
        """audio_device=2 must be forwarded as device=2."""
        device = self._run_with_request(_make_request(audio_device=2))
        assert device == 2, f"Expected device=2, got {device!r}"

    def test_invalid_device_raises_before_capture(self):
        """audio_device<-1 must raise ValueError without touching the mic."""
        capture_called = {"called": False}

        def fake_record(*args, **kwargs):
            capture_called["called"] = True
            return _fake_audio()

        with (
            patch.object(runner_mod, "record_audio", side_effect=fake_record),
            patch("sys.stdin", StringIO(_make_request(audio_device=-2))),
            pytest.raises(ValueError, match="audio_device"),
        ):
            runner_mod.main()

        assert not capture_called["called"], (
            "record_audio must not be called for invalid device"
        )
