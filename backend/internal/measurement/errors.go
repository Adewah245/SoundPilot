package measurement

import "fmt"

// ValidationError represents invalid measurement input.
type ValidationError struct {
	Message string
}

// Error returns the validation error message.
func (e *ValidationError) Error() string {
	return fmt.Sprintf("invalid measurement request: %s", e.Message)
}
