package enums

import "database/sql/driver"

type DeploymentType string

const (
	STATIC DeploymentType = "STATIC"
	WEB    DeploymentType = "WEB"
)

func (p *DeploymentType) Scan(value interface{}) error {
	*p = DeploymentType(value.([]byte))
	return nil
}

func (p DeploymentType) Value() (driver.Value, error) {
	return string(p), nil
}
