package consumers

import (
	"log"

	"github.com/dipperpinees/ci/configs"
	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection

func Handler() {
	_conn, err := amqp.Dial(configs.GetConfigs().AMQP_URI)
	if err != nil {
		log.Fatalf("Failed to start rabbitmq %s", err)
	}
	defer conn.Close()

	conn = _conn

	eventConsumerHandler()
}
