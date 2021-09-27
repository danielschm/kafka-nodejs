const fetch = require("fetch");
const parser = require('xml2json');
const TransactionType = require("../TransactionType");

function parseProduct(oEntry) {
    return {
        ProductId: oEntry.content["m:properties"]["d:ProductID"].$t,
        ProductTitle: oEntry.content["m:properties"]["d:ProductName"]
    }
}

function parseOrder(oEntry, aProducts) {
    const iId = oEntry.content["m:properties"]["d:ProductID"].$t;
    const oProduct = aProducts.find(e => e.ProductId === iId);
    if (oProduct) {
        return {
            ProductId: iId,
            ProductTitle: oProduct.ProductTitle,
            Price: parseFloat(oEntry.content["m:properties"]["d:UnitPrice"].$t),
            Quantity: parseInt(oEntry.content["m:properties"]["d:Quantity"].$t, 10)
        };
    }
}

function getRandomNumber(iMax) {
    return Math.round(Math.random() * (iMax - 1));
}

async function getMockData() {
    const aProducts = await new Promise(resolve => {
        fetch.fetchUrl("https://services.odata.org/V3/Northwind/Northwind.svc/Products", function (error, meta, body) {
            const oResponse = parser.toJson(body.toString(), {object: true});
            resolve(oResponse.feed.entry.map(parseProduct));
        });
    });

    return await new Promise(resolve => {
        fetch.fetchUrl("https://services.odata.org/V3/Northwind/Northwind.svc/Order_Details", function (error, meta, body) {
            const oResponse = parser.toJson(body.toString(), {object: true});

            let aProcessedResponse = oResponse.feed.entry.map(e => parseOrder(e, aProducts));
            aProcessedResponse = aProcessedResponse.filter(e => !!e);
            resolve(aProcessedResponse);
        });
    });
}

async function getRandomMessageJSON() {
    const aMockData = await getMockData();
    const oTransaction = aMockData[getRandomNumber(aMockData.length)];

    const oMessage = {
        "schema": {
            "type": "struct",
            "fields": [
                {
                    "type": "string",
                    "optional": false,
                    "field": "Id"
                },
                {
                    "type": "string",
                    "optional": false,
                    "field": "ProductId"
                },
                {
                    "type": "string",
                    "optional": false,
                    "field": "ProductTitle"
                },
                {
                    "type": "int32",
                    "optional": false,
                    "field": "Quantity"
                },
                {
                    "type": "float",
                    "optional": false,
                    "field": "Price"
                }
            ],
            "optional": false,
            "name": "transaction"
        },
        "payload": oTransaction
    }

    oTransaction.Id = "1";
    return JSON.stringify(oMessage);
}


module.exports = {getRandomMessageJSON};

