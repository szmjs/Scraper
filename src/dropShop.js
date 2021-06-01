const mongodb = require('mongodb');
const url = "mongodb+srv://scraper:hireme@cluster0.bglvz.mongodb.net/scraperDB?retryWrites=true&w=majority";
const client = mongodb.MongoClient;

function dropShop(collection, shopIn) {
    client.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, function (error, cli) {
        if (error) throw error;
        var dbo = cli.db('scraperDB');
        dbo.collection(collection).drop({ shop: shopIn }, function (err, result) {
            if (err) throw err;
            if (result) console.log(shopIn+" has been deleted from collection: "+collection);
            cli.close();
        });
    });
}
module.exports.dropShop = dropShop;