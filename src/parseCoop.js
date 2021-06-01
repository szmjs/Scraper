const commaFromPrice = /(?<=\d),(?=\d)/g;
const allButComma = /[^,;]+/g;

async function parseCoop(prodStringIn) {
    if (prodStringIn.match(commaFromPrice)) {
        const priceFixed = prodStringIn.replace(commaFromPrice, ".");
        return priceFixed.match(allButComma);
    } else {
        return prodStringIn.match(allButComma);
    }
}
module.exports.parseCoop = parseCoop;