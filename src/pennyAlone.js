const { pennyCrawler } = require("./penny.js");
const fs = ("fs");
module.exports = async function pennyAlone(link, country){
 let penny = await pennyCrawler(link);
  
 fs.writeFile('pennyHU.json', JSON.stringify(penny, null, "\t"), function (err) {
   if (err) throw err;
   console.log('PennyMarket JSON Saved!');
 });
}