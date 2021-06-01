const puppeteer = require("puppeteer");
const priceToNumber = require("./priceToNumber");

module.exports = async function quickCrawler(linkIn, countryIn, offerDateIn) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const mainLink = linkIn;
  const country = countryIn;
  const patt = /[\\n ]/g;
  let data = [];
  let offerDate = offerDateIn.replace(patt,'');
  
  
  
  switch (country) {

    case 'es':

      try {
        await page.goto(mainLink);
        await page.waitForSelector('.space.p-r.p-b');
        const links = await page.$$(".space.p-r.p-b");

        for (let link of links) {

          let name = await link.$eval("span.desc-height>strong", el => el.innerText);
          let priceInt = await link.$eval("span.price-height>span>b", el => el.innerText);
          let priceFloat = await link.$eval("span.price-height>span>b>sup", el => el.innerText);
          let pic = await link.$eval('img.lazy', el => el.src);
          let price = priceInt + priceFloat;
          let unit = link.$eval('.pricebox__basic-quantity', el => el.innerText);
          data.push({ name, price, unit, pic, offerDate, country });
        }
      } catch (e) {
        console.log("NAME: " + e.name, "MESSAGE: " + e.message);
      }
      break;
    default:

      try {
        await page.goto(mainLink);
        await page.waitForSelector(".product--tile");
        const links = await page.$$(".product--tile");

        for (let link of links) {
          let unit;
          let name = await link.$eval(".product__title", el => el.innerText);
          let price = await link.$eval(".pricebox__price", el => el.innerText);
          let priceIntSmall = priceToNumber('lidl', price);
          let description = await link.$eval(".product__desc", el => el.innerText);
          let productLink = await link.$eval(".product__body", el => el.href);
          let picxs = await link.$eval('img', el => el.src);
          let pic = picxs.split('xs').join('third/lg');
          try {
            unit = await link.$eval('div.pricebox__basic-quantity', el => el.textContent);
          } catch (error) {
            unit = "";
            console.log("no unit");
          }
          unit = unit.replace(patt,'');
        

          
          
          data.push({ name, price, priceIntSmall, unit, pic, offerDate, country });
        }
      } catch (e) {
        console.log("NAME: " + e.name, "MESSAGE: " + e.message);
      }
  }
  browser.close();
  return data;
}
