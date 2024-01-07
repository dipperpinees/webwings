const amqp = require('amqplib');

amqp.connect('', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = 'deployment_queue';

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1)
        channel.consume(queue, function(msg) {
            console.log(JSON.parse(msg.content.toString()))
          }, {
            noAck: false
        });

    })
})
