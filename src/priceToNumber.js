module.exports = function priceToNumber(shopIn, priceIn){
    const pattern = /([^(?<=\d)\.(?=\d)]+)\./g
    const patt = /([^(?<=\d)(?=\d)]+)/g
    
    let priceInt = priceIn.replace(patt,'');
    let priceIntSmall = priceInt*100;

    return priceIntSmall;

}