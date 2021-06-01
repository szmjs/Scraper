const fs = require('fs');
const { pushToDB } = require('./pushToDB.js');
function write(data, shopIn, countryIn) {
    if (!fs.existsSync('./' + shopIn.toUpperCase())) {
        fs.mkdirSync('./' + shopIn.toUpperCase());
    }
    fs.writeFile('./' + shopIn.toUpperCase() + '/' + shopIn + countryIn.toUpperCase() + '.json', JSON.stringify(data, null, "\t"), function (err) {
        if (err) throw err;
        console.log(shopIn + countryIn.toUpperCase() + ' JSON Saved!!');
    });
pushToDB(shopIn, data, countryIn);
}
module.exports.write = write;


