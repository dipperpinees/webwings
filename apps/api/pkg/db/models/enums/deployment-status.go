package enums

type DeploymentStatus string

const (
	PROGESSING DeploymentStatus = "PROGESSING"
	FAILED     DeploymentStatus = "FAILED"
	SUCCESS    DeploymentStatus = "SUCCESS"
)
