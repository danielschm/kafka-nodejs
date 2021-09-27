const avro = require('avsc');

const oSchema = {
    "namespace": "art.danielschmitz",
    "name": "Transaction",
    "type": "record",
    "fields": [
        {"name": "product_id", "type": "string"},
        {"name": "product_title", "type": "string"},
        {"name": "quantity", "type": "int"},
        {"name": "price", "type": "float"}
    ]
};

const oType = avro.parse(oSchema);

module.exports = oType;