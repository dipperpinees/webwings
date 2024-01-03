package enums

import "database/sql/driver"

type DeploymentStatus string

const (
	PROGESSING DeploymentStatus = "PROGESSING"
	FAILED     DeploymentStatus = "FAILED"
	SUCCESS    DeploymentStatus = "SUCCESS"
)

func (p *DeploymentStatus) Scan(value interface{}) error {
	*p = DeploymentStatus(value.([]byte))
	return nil
}

func (p DeploymentStatus) Value() (driver.Value, error) {
	return string(p), nil
}
