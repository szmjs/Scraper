const quickCrawler = require("./productQuickCrawler.js");
const writeLidl = require("./writeLidl.js");

module.exports = async function lidlFormatter(resultsMainlinksIn, countryIn, offerDatesIn){

    let resultsMainLinks = resultsMainlinksIn;
    let offerDates = offerDatesIn;
    let country = countryIn;
    let countryProducts = [];
    let tempArray = [];
    
        for ( let i=0;i<resultsMainLinks.length;i++ ){
            let prodInOfferLink = await quickCrawler(resultsMainlinksIn[i], country, offerDates[i]);
            tempArray.push(prodInOfferLink);
            console.log(prodInOfferLink)
        }
    
        for (let i=0;i<tempArray.length;i++){
            countryProducts = countryProducts.concat(tempArray[i]);
        }
    
    writeLidl(country, countryProducts);
    countryProducts = [];
}