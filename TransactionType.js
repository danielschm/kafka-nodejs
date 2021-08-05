const avro = require('avsc');

module.exports = avro.Type.forSchema({
    type: "record",
    fields: [
        {name: "product_number", type: "string"},
        {name: "product_title", type: "string"},
        {name: "quantity", type: "string"},
        {name: "price", type: "string"},
        {name: "timestamp", type: "string"}
    ]
});