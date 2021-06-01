const getMain =require("./LidlMainCrawler.js");
const offerLinks = require("./offerLinks.js");
const lidlFormatter = require("./lidlFormatter.js");

module.exports = async function pullAllLidl() {
  let results = [];
  for (let i = 0; i < Object.values(offerLinks.lidl).length; i++) {
    let lnk = await getMain(Object.values(offerLinks.lidl)[i], Object.keys(offerLinks.lidl)[i]);
    results.push(lnk);
  }

  for (let i = 0; i < results.length; i++) {
    await lidlFormatter(results[i].mainLinks, results[i].Country, results[i].offerDates);
  }
}
