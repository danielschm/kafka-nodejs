console.log("Consumer...");
const Kafka = require('node-rdkafka');
const TransactionType = require("../TransactionType");

const oConsumer = Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092'
}, {});

oConsumer.connect();

oConsumer
    .on('ready', () => {
        console.log('Consumer ready');
        oConsumer.subscribe(['Transaction']);
        oConsumer.consume();
    })
    .on('data', (data) => {
        console.log(`Received message: '${TransactionType.fromBuffer(data.value)}'`);
    });