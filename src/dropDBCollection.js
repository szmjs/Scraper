const mongodb = require('mongodb');
const url = "mongodb+srv://scraper:hireme@cluster0.bglvz.mongodb.net/scraperDB?retryWrites=true&w=majority";
const client = mongodb.MongoClient;

function dropDBCollection(collection) {
    client.connect(url, {useUnifiedTopology: true, useNewUrlParser: true}, function (error, cli) {
        if (error) throw error;
        var dbo = cli.db('scraperDB');
        dbo.collection(collection).drop(function (err, result) {
            if (err) throw err;
            if (result) console.log("collection deleted");
            cli.close();
        });
    });
}
module.exports.dropDBCollection = dropDBCollection;