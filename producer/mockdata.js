const fetch = require("fetch");
const parser = require('xml2json');

function parseProduct(oEntry) {
    return {
        product_number: oEntry.content["m:properties"]["d:ProductID"].$t,
        product_title: oEntry.content["m:properties"]["d:ProductName"]
    }
}

function parseOrder(oEntry, aProducts) {
    const iId = oEntry.content["m:properties"]["d:ProductID"].$t;
    const oProduct = aProducts.find(e => e.product_number === iId);
    if (oProduct) {
        return {
            product_number: iId,
            product_title: oProduct.product_title,
            price: oEntry.content["m:properties"]["d:UnitPrice"].$t,
            quantity: oEntry.content["m:properties"]["d:Quantity"].$t,
            timestamp: new Date().toISOString()
        };
    }
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

module.exports = getMockData