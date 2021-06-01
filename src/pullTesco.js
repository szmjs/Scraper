const puppeteer = require("puppeteer");
const priceToNumber = require("./priceToNumber");
const { write } = require("./write");
module.exports = async function pullTesco(linkIn, countryIn, shopIn) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(linkIn);
  await page.setViewport({ width: 1920, height: 30000 });
  await page.waitForSelector('.body_desktop');
  const country = countryIn;
  const shop = shopIn;
  const patt = /[\\\n ]/g;
  const patt2 = /^[\s]/g;
  let prodListing = await page.$('.custom-bkg');
  let numPages = await prodListing.$eval('div.a-productListing__pagination__row-half.-right>div>div>span:nth-child(10)>div>a>span>span', el => el.textContent);
  let page2 = await browser.newPage();
  let data = [];
  for (let i=1;i<=numPages;i++){
    await page2.goto(`https://tesco.hu/akciok/akcios-termekek/?page=${i}`);
    await page2.setViewport({ width: 1920, height: 30000 });
    await page2.waitForSelector('.body_desktop');
    let prodListing = await page2.$('.custom-bkg');
    let prodCont = await prodListing.$('div.container.ddl-grid>div.row.cf.row_p3>div.box.cf.box_p1>div>div>div>div.ddl-col--xs--24.ddl-col--md--13>div>div.product-container.m-productListing__productsGrid.hidden.visible-md');
    let products = await prodCont.$$('.a-productListing__productsGrid__element');
    for (let product of products){
      try {
        let name = await product.$eval('div.title>.name', el => el.textContent);
        console.log(name);
        let unit = await product.$eval('div.title>span.description', el => el.textContent);
        let offerDate = '';
        unit = unit.replace(patt, ' ');
        unit = unit.replace(patt2, '');
        console.log(unit);
        let pictures = await product.$eval('div.image>img', el => el.src);
        console.log(pictures);
        let price = await product.$eval('div.price>b.new-price', el => el.textContent);
        price = price.replace(patt, '');
        let priceIntSmall = priceToNumber(shop, price);
        console.log(price);
        console.log(priceIntSmall);
        data.push({name, unit, price, priceIntSmall, offerDate, pictures, shop, country});
      } catch (error) {
          console.log(error);
      }
    }
  }
  console.log(data.length);
  write(data, shopIn, countryIn);
  browser.close();
}
