package consumers

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/dipperpinees/ci/pkg/db/models"
	"github.com/dipperpinees/ci/pkg/db/models/enums"
	"github.com/dipperpinees/ci/service/event/repositories"
	"github.com/google/uuid"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

type EventMsg struct {
	DeploymentID uuid.UUID       `json:"deployment_id"`
	Commit_sha   string          `json:"commit_sha"`
	Type         enums.EventType `json:"type"`
}

func eventConsumerHandler() {
	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	QUEUE_NAME := "EVENT"

	q, err := ch.QueueDeclare(
		QUEUE_NAME, // name
		true,       // durable
		false,      // delete when unused
		false,      // exclusive
		false,      // no-wait
		nil,        // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	var forever chan struct{}

	go func() {
		for d := range msgs {
			event := new(EventMsg)
			json.Unmarshal(d.Body, &event)
			err := repositories.CreateEvent(&models.Events{
				DeploymentID: event.DeploymentID,
				CommitSHA:    event.Commit_sha,
				Type:         string(event.Type),
			})
			if err != nil {
				fmt.Println("Failed to handle event", err.Error())
			}
		}
	}()

	<-forever
}
