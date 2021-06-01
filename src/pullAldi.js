const puppeteer = require("puppeteer");
const priceToNumber = require("./priceToNumber");
const { write } = require("./write");

module.exports = async function pullAldi(linkIn, countryIn, shopIn) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const patt = /[\\\n\\\t]/g;
  await page.goto(linkIn);
  await page.setViewport({ width: 1920, height: 30000 });
  await page.waitForSelector('.main-nav--item--expander.gm-bg-special-offers');
  let data = [];
  let linkToOffers = await page.$eval('.main-nav--item--expander.gm-bg-special-offers', el => el.href);
  page.goto(linkToOffers);
  await page.waitForSelector('.tab-nav--item.dropdown--list--item');
  let offerLinks = await page.$$('.tab-nav--item.dropdown--list--item');
  const shop = shopIn;
  const country = countryIn;
  let page2 = await browser.newPage();
  try {
      
  
  for (let offerLink of offerLinks){
      let offerDate = await offerLink.$eval('.tab-nav--link.dropdown--list--link', el => el.textContent);
      let prodPage = await offerLink.$eval('.tab-nav--link.dropdown--list--link', el => el.href);
      
      await page2.goto(prodPage);
      await page2.setViewport({ width: 1920, height: 30000 });
      await page2.waitForSelector('.ratio-container.m-ratio-1x1.ym-clearfix.m-no-ratio-on-phone');
      let products = await page2.$$('.ratio-container.m-ratio-1x1.ym-clearfix.m-no-ratio-on-phone');
      try {
          
      
      for (let product of products){
          let name = await product.$eval('.box--description--header', el => el.textContent);
          name = name.replace(patt,'');
          let unit = await product.$eval('.box--amount', el => el.textContent);
          let unit2 = await product.$eval('.box--baseprice', el => el.textContent);
          unit = unit+' '+unit2;
          let price = await product.$eval('.box--value', el => el.textContent);
          let pictures = await product.$eval('.ratio-container.m-ratio-57x32.box--image-container.m-no-ratio-on-phone.reset-ratio>img', el => el.src);
          let priceIntSmall = priceToNumber(shop, price);
          

          data.push({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
        }
    } catch (error) {
        console.log(error);
          
      }
      console.log(data.length);
      

  }
} catch (error) {
    console.log(error);   
}
  console.log(data.length);
  console.table(data);
  write(data, shop, country);
  browser.close();



}