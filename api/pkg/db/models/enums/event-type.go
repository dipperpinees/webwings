package enums

type EventType string

const (
	INIT_DEPLOY    EventType = "INIT"
	NEW_DEPLOY     EventType = "NEW_DEPLOY"
	DEPLOY_CANCEL  EventType = "DEPLOY_CANCEL"
	DEPLOY_FAILED  EventType = "DEPLOY_FAILED"
	DEPLOY_SUCCESS EventType = "DEPLOY_SUCCESS"
)
