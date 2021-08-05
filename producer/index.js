const MESSAGE_INTERVAL = getRandomNumber(800);

console.log("Producer...");
const Kafka = require('node-rdkafka');
const TransactionType = require("../TransactionType");
const getMockData = require("./mockdata");

const oStream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': 'localhost:9092'
}, {}, {topic: 'Transaction'});

function getRandomNumber(iMax) {
    return Math.round(Math.random() * (iMax-1));
}

function queueMessage(aMockData) {
    const oTransaction = aMockData[getRandomNumber(aMockData.length)];

    let bSuccess;
    try {
        bSuccess = oStream.write(TransactionType.toBuffer(oTransaction));
    } catch (e) {
        console.error(oTransaction);
    }

    if (bSuccess) {
        console.log(`Message sent successfully`);
    } else {
        console.log(`An error occured while sending the message`);
    }
}

getMockData().then(aMockData => {
    setInterval(() => {
        queueMessage(aMockData);
    }, MESSAGE_INTERVAL);
});
