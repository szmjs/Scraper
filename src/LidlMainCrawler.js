const puppeteer = require("puppeteer");


module.exports = async function getMain(offerLinkIn, offerLinkCountryIn) {
  const offerLink = offerLinkIn;
  const Country = offerLinkCountryIn;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let mainLinks = [];
  let offerDates = [];

  try {
    
    await page.goto(offerLink);
    await page.waitForSelector(".theme__body");
    const links = await page.$$(".theme__body");
    
    for (let link of links) {
      let offerLinks = await link.$eval(".theme__item", el => el.href);
      let offersFrom = await link.$eval(".theme__subtitle", el => el.innerText);
      mainLinks.push(offerLinks);
      offerDates.push(offersFrom);
      }
  } catch (e) {
    console.log("our error", e);
  }
browser.close();
return {Country, mainLinks, offerDates};
}
