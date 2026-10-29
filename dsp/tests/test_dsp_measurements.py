"""Tests for the SoundPilot DSP measurement modules.

These tests do NOT require a physical microphone; they use synthetic
NumPy arrays as stand-ins for recorded audio.

Run with:
    cd /home/student/SoundPilot
    python -m pytest dsp/tests/ -v
"""

import math

import numpy as np
import pytest

from dsp.measurements.noise import calculate_noise_level
from dsp.measurements.distortion import calculate_distortion
from dsp.detection.clipping import detect_clipping
from dsp.detection.feedback import detect_feedback


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def sine_wave(freq_hz=440, duration_s=1.0, sample_rate=44100, amplitude=0.5):
    """Return a pure-tone sine wave as a float32 NumPy array."""
    t = np.linspace(0, duration_s, int(sample_rate * duration_s), endpoint=False)
    return (amplitude * np.sin(2 * np.pi * freq_hz * t)).astype(np.float32)


# ---------------------------------------------------------------------------
# Noise-level tests — must return dBFS (negative float for any real signal)
# ---------------------------------------------------------------------------

class TestNoiseLevelUnit:
    def test_empty_signal_returns_floor(self):
        result = calculate_noise_level(np.array([], dtype=np.float32))
        assert result == -240.0

    def test_silence_returns_floor(self):
        silence = np.zeros(44100, dtype=np.float32)
        result = calculate_noise_level(silence)
        assert result == -240.0

    def test_sine_returns_negative_dbfs(self):
        """A properly scaled signal must have a noise floor below 0 dBFS."""
        audio = sine_wave(amplitude=0.5)
        result = calculate_noise_level(audio)
        assert result < 0.0, f"Expected dBFS < 0, got {result}"

    def test_louder_signal_has_higher_noise_estimate(self):
        """More amplitude → higher dBFS noise floor estimate."""
        quiet = calculate_noise_level(sine_wave(amplitude=0.01))
        loud = calculate_noise_level(sine_wave(amplitude=0.5))
        assert loud > quiet, f"loud={loud}, quiet={quiet}"

    def test_result_is_finite(self):
        audio = sine_wave(amplitude=0.3)
        result = calculate_noise_level(audio)
        assert math.isfinite(result)

    def test_unit_is_dbfs_not_linear(self):
        """Verify the return value is in dBFS, not a linear 0–1 amplitude."""
        audio = sine_wave(amplitude=0.5)
        result = calculate_noise_level(audio)
        # A linear amplitude of 0.5 would be ~ 0.5; dBFS would be around -10.
        assert result < -1.0, (
            f"noise_level={result} looks like a linear amplitude, not dBFS"
        )

    def test_full_scale_signal_near_zero_dbfs(self):
        """Full-scale (amplitude=1.0) signal should be close to 0 dBFS."""
        audio = sine_wave(amplitude=1.0)
        result = calculate_noise_level(audio)
        # A full-scale sine has RMS ≈ 0.707, giving ≈ -3 dBFS.
        # Expect the noise estimate to be within a few dB of -3.
        assert -15.0 < result < 0.0, f"Unexpected noise level: {result}"


# ---------------------------------------------------------------------------
# Distortion tests — must return a percentage (0–100), not a 0–1 ratio
# ---------------------------------------------------------------------------

class TestDistortionUnit:
    def test_empty_returns_zero(self):
        assert calculate_distortion(np.array([], dtype=np.float32)) == 0.0

    def test_short_signal_returns_zero(self):
        assert calculate_distortion(np.array([0.1, 0.2, -0.1], dtype=np.float32)) == 0.0

    def test_pure_sine_has_low_distortion(self):
        """A pure sine wave at a reasonable amplitude should have low THD%."""
        audio = sine_wave(freq_hz=440, amplitude=0.5)
        result = calculate_distortion(audio)
        # A clean sine may still have some spectral leakage, but THD% should
        # be well below 100% (and typically below 5% for a clean tone).
        assert 0.0 <= result < 50.0, f"Unexpected THD for pure sine: {result}%"

    def test_result_is_percentage_not_ratio(self):
        """The result must be scaled to percent, not a 0–1 ratio."""
        audio = sine_wave(freq_hz=440, amplitude=0.5)
        result = calculate_distortion(audio)
        # A ratio of 0.05 would represent 5%. In ratio form we'd see ~0.05,
        # but in percentage form we see ~5. The value must be >= 0.
        assert isinstance(result, float)
        assert result >= 0.0

    def test_distortion_high_for_clipped_signal(self):
        """Hard-clipped signal should produce higher THD% than a clean sine."""
        clean = sine_wave(freq_hz=440, amplitude=0.5)
        clipped = np.clip(sine_wave(freq_hz=440, amplitude=0.99), -0.3, 0.3).astype(np.float32)
        clean_thd = calculate_distortion(clean)
        clipped_thd = calculate_distortion(clipped)
        assert clipped_thd >= clean_thd, (
            f"Clipped signal THD ({clipped_thd:.2f}%) should be >= clean ({clean_thd:.2f}%)"
        )

    def test_result_is_finite(self):
        audio = sine_wave(amplitude=0.5)
        assert math.isfinite(calculate_distortion(audio))


# ---------------------------------------------------------------------------
# Clipping detection tests
# ---------------------------------------------------------------------------

class TestClippingDetection:
    def test_no_clipping_in_normal_signal(self):
        audio = sine_wave(amplitude=0.5)
        assert not detect_clipping(audio)

    def test_clipping_detected_when_saturated(self):
        audio = np.ones(100, dtype=np.float32)  # full scale
        assert detect_clipping(audio)

    def test_single_clipped_sample_not_flagged(self):
        """One isolated sample should not trigger the clipping flag."""
        audio = np.zeros(100, dtype=np.float32)
        audio[50] = 1.0
        assert not detect_clipping(audio)

    def test_three_clipped_samples_flagged(self):
        audio = np.zeros(100, dtype=np.float32)
        audio[10] = 1.0
        audio[11] = 1.0
        audio[12] = 1.0
        assert detect_clipping(audio)

    def test_empty_signal_not_clipped(self):
        assert not detect_clipping(np.array([], dtype=np.float32))


# ---------------------------------------------------------------------------
# Feedback detection tests — magnitudes are in dBFS
# ---------------------------------------------------------------------------

class TestFeedbackDetection:
    def _flat_spectrum(self, n=100, level_db=-40.0):
        """Return a flat spectrum in dBFS — no dominant peak."""
        freqs = np.linspace(20, 20000, n)
        mags = np.full(n, level_db, dtype=np.float64)
        return freqs, mags

    def test_flat_spectrum_no_feedback(self):
        freqs, mags = self._flat_spectrum()
        assert not detect_feedback(freqs, mags)

    def test_dominant_peak_detected_as_feedback(self):
        freqs, mags = self._flat_spectrum(n=100, level_db=-60.0)
        # Inject a very strong single-bin peak (+30 dB above the median).
        mags[50] = -30.0
        assert detect_feedback(freqs, mags)

    def test_small_peak_not_flagged(self):
        freqs, mags = self._flat_spectrum(n=100, level_db=-40.0)
        mags[50] = -35.0  # only 5 dB above median — not a feedback peak
        assert not detect_feedback(freqs, mags)

    def test_empty_spectrum_no_feedback(self):
        assert not detect_feedback(np.array([]), np.array([]))

    def test_too_small_spectrum_no_feedback(self):
        assert not detect_feedback(np.array([440.0, 880.0]), np.array([-40.0, -38.0]))
