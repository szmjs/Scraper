const mongodb = require('mongodb');
const url = "mongodb+srv://scraper:hireme@cluster0.bglvz.mongodb.net/scraperDB?retryWrites=true&w=majority";
const client = mongodb.MongoClient;

 async function pushToDB(shopIn, coll, countryIn) {

    for (let i = 0; i < coll.length; i++) {
        coll[i].archive = "false";
    }

    const myquery = { shop: shopIn, archive: "false" };
    const newvalues = { $set: { archive: "true" } };
    console.log("pushing: "+countryIn);
    client.connect(url,{ useUnifiedTopology: true }, function (err, cli) {
        if (err) { console.log(err) };
        var db = cli.db('scraperDB');
        console.log(countryIn.toUpperCase());
        db.collection(countryIn.toUpperCase()).updateMany(myquery, newvalues,
            function (err, result) {
                if (err) { console.log(err)};
                console.log('archived')
                db.collection(countryIn.toUpperCase()).insertMany(coll, function (err, result) {
                    if (err) { console.log(err) };
                    console.log('ALL DONE!');
                    cli.close();
                });
            });
    }
    )
}
module.exports.pushToDB = pushToDB;
