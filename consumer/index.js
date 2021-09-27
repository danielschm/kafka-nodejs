console.log("Consumer...");
const Kafka = require('node-rdkafka');
const TransactionType = require("../TransactionType");

const oConsumer = Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': '192.168.178.70:9092'
}, {});

oConsumer.connect();

oConsumer
    .on('ready', () => {
        console.log('Consumer ready');
        oConsumer.subscribe(['Result']);
        oConsumer.consume();
    })
    .on('data', (data) => {
        console.log(`Received message: '${data.value}'`);
    });