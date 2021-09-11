const MESSAGE_INTERVAL = getRandomNumber(3000);

console.log("Producer...");
const Kafka = require('node-rdkafka');
const TransactionType = require("../TransactionType");
const getMockData = require("./mockdata");

const oStream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': '192.168.178.70:9092'
}, {}, {topic: 'Transaction'});

function getRandomNumber(iMax) {
    return Math.round(Math.random() * (iMax-1));
}

function queueMessage(aMockData) {
    const oTransaction = aMockData[getRandomNumber(aMockData.length)];

    let bSuccess;
    try {
        // bSuccess = oStream.write(TransactionType.toBuffer(oTransaction));
        bSuccess = oStream.write(JSON.stringify(processTransaction(oTransaction)));
    } catch (e) {
        console.error(oTransaction);
    }

    if (bSuccess) {
        console.log(`Message sent successfully`);
    } else {
        console.log(`An error occured while sending the message`);
    }
}

let nTotalResult = 0;
const BONUS_PERCENT = 0.2;

// To be done in SAP System
function processTransaction(t) {
    t.result = t.price * t.quantity * BONUS_PERCENT;
    nTotalResult += t.result;
    t.newTotalResult = nTotalResult;

    t.result = Math.round(t.result).toString();
    t.newTotalResult = Math.round(t.newTotalResult).toString();

    const oDate = new Date();
    const fn = i => i.toString().padStart(2, "0");
    t.timestamp = `${fn(oDate.getHours())}:${fn(oDate.getMinutes())}:${fn(oDate.getSeconds())}`;
    return t;
}

getMockData().then(aMockData => {
    setInterval(() => {
        queueMessage(aMockData);
    }, MESSAGE_INTERVAL);
});
