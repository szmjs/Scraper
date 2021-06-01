const fs = require('fs');
const { pushToDB } = require('./pushToDB');

let standardize = [];
const shop = "lidl";
module.exports = function writeLidl(country, products) {
    if (!fs.existsSync('./LIDL')){
        fs.mkdirSync('./LIDL');
    }
    
            for (let i=0;i<products.length;i++){
                let name = products[i].name;
                let unit = products[i].unit;
                let price = products[i].price;
                let priceIntSmall = products[i].priceIntSmall;
                let offerDate = products[i].offerDate;
                let pictures = products[i].pic;
                let shop = "lidl";
                let country = products[i].country;
                
                console.log(country);
                standardize.push({name, unit, price, priceIntSmall, offerDate, pictures, shop, country});
                }
            console.log("standardized");
            console.log(standardize);
            
     
   
    
    
    fs.writeFile('./LIDL/Lidl'+country.toUpperCase()+'.json', JSON.stringify(products, null, "\t"), function (err) {
        if (err) throw err;
        console.log('Lidl'+country.toUpperCase()+' JSON Saved!!');
    });
    console.log(standardize.length);
    pushToDB(shop, standardize, country);
    standardize = [];
    console.log(standardize.length);
}