package mq

import (
	"github.com/dipperpinees/ci/configs"
	amqp "github.com/rabbitmq/amqp091-go"
)

var conn *amqp.Connection

func InitRabbitMQ() (*amqp.Connection, error) {
	_conn, err := amqp.Dial(configs.GetConfigs().AMQP_URI)
	if err != nil {
		return nil, err
	}
	conn = _conn

	return conn, nil
}
