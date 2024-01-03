package configs

var c *Configs

type Configs struct {
	PORT                    string
	DB_PORT                 string
	DB_HOST                 string
	DB_NAME                 string
	DB_USERNAME             string
	DB_PASSWORD             string
	JWT_SECRET_KEY          string
	GITHUB_OAUTH_CLIENT_ID  string
	GITHUB_OAUTH_SECRET_KEY string
	EMAIL                   string
	EMAIL_PASSWORD          string
	AMQP_URI                string
}

func GetConfigs() *Configs {
	return c
}

func InitConfigs(config *Configs) {
	c = config
}
