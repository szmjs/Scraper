const puppeteer = require("puppeteer");
const priceToNumber = require("./priceToNumber");
const { write } = require("./write");
module.exports = async function pullPenny(linkIn, countryIn, shopIn) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const mainLink = linkIn;
  await page.setViewport({ width: 1920, height: 30000 });
  let data = [];
  const country = countryIn;
  const shop = shopIn;
  console.log(shop+" "+country);
  await page.goto(mainLink);
  await page.waitForSelector(".v-card__actions");
  const pageLink = await page.$eval('.v-card__actions>a', el => el.href);
  console.log(pageLink);
  await page.click('.v-card__actions');
  await page.waitForSelector('.d-flex.flex-sm-column.flex-wrap.flex-sm-nowrap.flex-grow-1');
  await page.waitForSelector('.v-pagination__item');
  const pages = await page.$$('.v-pagination__item');
  const lastPage = pages[pages.length-1];
  const lastPageNum = await lastPage.evaluate(el => el.textContent);
  const page2 = await browser.newPage();
  try {
    for (let i=1;i<=lastPageNum;i++){
      await page2.setViewport({ width: 1920, height: 9000 });
      await page2.goto(`${pageLink}?page=${i}`);
      await page2.waitForSelector('.d-flex.flex-sm-column.flex-wrap.flex-sm-nowrap.flex-grow-1');
      await page2.waitForSelector('.ws-product-tile-image__picture.ws-product-tile-image__picture--loaded'); 
      console.log(`${pageLink}?page=${i}`);
      const links = await page2.$$('.d-flex.flex-sm-column.flex-wrap.flex-sm-nowrap.flex-grow-1');
      for (let link of links){
        try {
        let name = await link.$eval('.ws-product-title.subtitle-1>span', el => el.textContent);
        let unit = await link.$eval('.mt-2.caption', el => el.textContent);
        let price = await link.$eval('.ws-product-price-amount>span', el => el.textContent);
        let offerDate1 = await link.$eval('.ws-product-price-additions>.ws-product-price-additions__validity.mt-2.caption.text--base-color3>div:nth-child(1)', el => el.textContent);
        let offerDate2 = await link.$eval('.ws-product-price-additions>.ws-product-price-additions__validity.mt-2.caption.text--base-color3>div:nth-child(2)', el => el.textContent);
        let offerDate = offerDate1+" "+offerDate2;
        let picturesCont = await link.$('.ws-product-tile__inner.col-sm-auto.pa-2.pa-sm-6.col-4>div.ws-product-tile-image');
        let pictures = await picturesCont.$eval('.ws-product-tile-image>img.ws-product-tile-image__picture.ws-product-tile-image__picture--loaded', el => el.src);
        let priceIntSmall = priceToNumber(shop, price);
        data.push({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
        console.table({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
        } catch (error) {
          if (error.message == 'Error: failed to find element matching selector ".ws-product-tile-image>img.ws-product-tile-image__picture.ws-product-tile-image__picture--loaded"')
          {
          let name = await link.$eval('.ws-product-title.subtitle-1>span', el => el.textContent);
          let unit = await link.$eval('.mt-2.caption', el => el.textContent);
          let price = await link.$eval('.ws-product-price-amount>span', el => el.textContent);
          let offerDate1 = await link.$eval('.ws-product-price-additions>.ws-product-price-additions__validity.mt-2.caption.text--base-color3>div:nth-child(1)', el => el.textContent);
          let offerDate2 = await link.$eval('.ws-product-price-additions>.ws-product-price-additions__validity.mt-2.caption.text--base-color3>div:nth-child(2)', el => el.textContent);
          let offerDate = offerDate1+" "+offerDate2;
          let priceIntSmall = priceToNumber(shop, price);
          let pictures = "";
          data.push({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
          console.table({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
          }
          else {console.warn(error); };
        }
      }
    }
    console.table(data);
  }
  catch (e) {
    console.warn("NAME: " + e.name, "MESSAGE: " + e.message);
  }
  write(data, shop, country);
  browser.close();
}
  