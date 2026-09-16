package domain

import (
	"crypto/rand"
	"fmt"
)

// NewID generates a unique identifier for SoundPilot domain records.
func NewID() string {
	bytes := make([]byte, 16)

	if _, err := rand.Read(bytes); err != nil {
		panic(fmt.Sprintf("generate domain ID: %v", err))
	}

	return fmt.Sprintf(
		"%x-%x-%x-%x-%x",
		bytes[0:4],
		bytes[4:6],
		bytes[6:8],
		bytes[8:10],
		bytes[10:16],
	)
}
