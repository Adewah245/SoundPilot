package measurement

import (
	"strings"
	"testing"

	"github.com/Adewah245/SoundPilot/backend/internal/dsp/contract"
)

func validRequest() contract.MeasurementRequest {
	return contract.MeasurementRequest{
		ContractVersion:    "1.0",
		SessionID:          "sess-1",
		VenueID:            "venue-1",
		ZoneID:             "zone-1",
		MeasurementPointID: "mp-1",
		AudioSource:        "microphone",
		AudioDevice:        -1,
		DurationSeconds:    5.0,
		SampleRate:         44100,
		Channels:           1,
	}
}

func TestValidateRequest_Valid(t *testing.T) {
	if err := ValidateRequest(validRequest()); err != nil {
		t.Fatalf("expected no error for a valid request, got: %v", err)
	}
}

func TestValidateRequest_MissingContractVersion(t *testing.T) {
	req := validRequest()
	req.ContractVersion = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing contract version")
	}
	if !strings.Contains(err.Error(), "contract version") {
		t.Errorf("error message should mention contract version, got: %v", err)
	}
}

func TestValidateRequest_MissingSessionID(t *testing.T) {
	req := validRequest()
	req.SessionID = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing session ID")
	}
}

func TestValidateRequest_MissingVenueID(t *testing.T) {
	req := validRequest()
	req.VenueID = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing venue ID")
	}
}

func TestValidateRequest_MissingZoneID(t *testing.T) {
	req := validRequest()
	req.ZoneID = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing zone ID")
	}
}

func TestValidateRequest_MissingMeasurementPointID(t *testing.T) {
	req := validRequest()
	req.MeasurementPointID = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing measurement point ID")
	}
}

func TestValidateRequest_MissingAudioSource(t *testing.T) {
	req := validRequest()
	req.AudioSource = ""
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for missing audio source")
	}
}

func TestValidateRequest_ZeroDuration(t *testing.T) {
	req := validRequest()
	req.DurationSeconds = 0
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for zero duration")
	}
}

func TestValidateRequest_NegativeDuration(t *testing.T) {
	req := validRequest()
	req.DurationSeconds = -1
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for negative duration")
	}
}

func TestValidateRequest_ZeroSampleRate(t *testing.T) {
	req := validRequest()
	req.SampleRate = 0
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for zero sample rate")
	}
}

// ---------------------------------------------------------------------------
// Audio device forwarding: -1 means default; anything < -1 is invalid.
// ---------------------------------------------------------------------------

func TestValidateRequest_AudioDeviceDefault(t *testing.T) {
	req := validRequest()
	req.AudioDevice = -1
	if err := ValidateRequest(req); err != nil {
		t.Fatalf("expected no error for audio_device=-1 (default): %v", err)
	}
}

func TestValidateRequest_AudioDeviceZero(t *testing.T) {
	req := validRequest()
	req.AudioDevice = 0
	if err := ValidateRequest(req); err != nil {
		t.Fatalf("expected no error for audio_device=0: %v", err)
	}
}

func TestValidateRequest_AudioDevicePositive(t *testing.T) {
	req := validRequest()
	req.AudioDevice = 2
	if err := ValidateRequest(req); err != nil {
		t.Fatalf("expected no error for audio_device=2: %v", err)
	}
}

func TestValidateRequest_AudioDeviceTooNegative(t *testing.T) {
	req := validRequest()
	req.AudioDevice = -2
	err := ValidateRequest(req)
	if err == nil {
		t.Fatal("expected error for audio_device=-2 (invalid)")
	}
	if !strings.Contains(err.Error(), "audio device") {
		t.Errorf("error should mention audio device, got: %v", err)
	}
}
