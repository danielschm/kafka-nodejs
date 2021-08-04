console.log("Producer...");
const Kafka = require('node-rdkafka');
const TransactionType = require("../TransactionType");
const aMockData = require("../mockdata");

const oStream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {topic: 'Transaction'});

function queueMessage() {
    const oTransaction = aMockData[Math.round(Math.random() * aMockData.length)];

    const bSuccess = oStream.write(TransactionType.toBuffer(oTransaction));
    if (bSuccess) {
        console.log(`Message sent successfully`);
    } else {
        console.log(`An error occured while sending the message`);
    }
}

setInterval(() => {
    queueMessage();
}, 3000);
