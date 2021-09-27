const MESSAGE_INTERVAL = 2000;

console.log("Producer...");

const { getRandomMessageJSON } = require("./mockdata");

const { Kafka } = require("kafkajs")

const clientId = "nodejs-producer";
const brokers = ["192.168.178.70:9092"];
const topic = "Transaction";

const kafka = new Kafka({ clientId, brokers })
const producer = kafka.producer();

// we define an async function that writes a new message each second
const produce = async () => {
    await producer.connect();

    setInterval(async () => {
        try {
            const sMessage = await getRandomMessageJSON();
            await producer.send({
                topic,
                messages: [
                    {
                        value: sMessage
                    }
                ]
            });

            console.log("Writes: ", sMessage);
        } catch (err) {
            console.error("Could not write message " + err);
        }
    }, MESSAGE_INTERVAL);
}

produce();
