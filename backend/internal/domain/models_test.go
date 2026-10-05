package domain

import (
	"math"
	"testing"
)

func TestVenueAreaAndVolume(t *testing.T) {
	venue := Venue{
		LengthMeters: 42.80,
		WidthMeters:  25.20,
		HeightMeters: 9.10,
	}

	wantArea := 42.80 * 25.20
	if got := venue.FloorArea(); math.Abs(got-wantArea) > 1e-9 {
		t.Fatalf("FloorArea() = %v, want %v", got, wantArea)
	}

	wantVolume := 42.80 * 25.20 * 9.10
	if got := venue.RoomVolume(); math.Abs(got-wantVolume) > 1e-9 {
		t.Fatalf("RoomVolume() = %v, want %v", got, wantVolume)
	}
}
