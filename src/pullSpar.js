const puppeteer = require("puppeteer");
const priceToNumber = require("./priceToNumber");
const { write } = require("./write");

module.exports = async function pullSpar(linkIn, countryIn) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(linkIn);
  await page.setViewport({ width: 1920, height: 300000 });
  await page.waitForSelector('#header');
  const header = await page.$$('#header>div.middleHeader.cf>div>div.sparPopupOverlay.onBoardOverlay>div>div.onBoardTopBar.cf>i');
  await header[0].click();
  await page.waitForNavigation();
  let data = [];
  const shop = "spar";
 
  let pages = await page.$eval('#content>div.contentPageContainer.page-listing>div.mainView640.sparPageMiddleWrapper.cf>div>div.paginationBar.cf>ul>li.lastNumber>a', el => el.textContent);
  const page2 = await browser.newPage();
  
  for (let i=1;i<=pages;i++){
    await page2.goto(`https://www.spar.hu/onlineshop/search/?_=1617256983542&callback=parseResponse&i=1&m_sortProdResults_egisp=a&page=${i}&pos=6108207&q=*&q1=Minden+aj%C3%A1nlat&sort=product-ecr-sortlev&sp_cs=UTF-8&sp_q_13=6108207&sp_x_13=product-visible-pos&x1=prod-is-on-prom_desc`);
    await page2.waitForSelector('.productBoxTop.cf.j-toggleProductInfo');
    let products = await page2.$$('.productBoxTop.cf.j-toggleProductInfo');
    for (let product of products){
      try {
        let name = await product.$eval('div.productBoxHeader>label.productTitle>a', el => el.textContent);
        let unit = await product.$eval('div.productBoxMainContent.cf>div.productBoxInfo.cf>div>div.productBoxInfoPrice>div>label.extraInfoPrice', el => el.textContent);
        let price = await product.$eval('div.productBoxMainContent.cf>div.productBoxInfo.cf>div>div.productBoxInfoPrice>div>div.actualPriceContainer>label.priceInteger', el => el.textContent);
        let offerDate = '';
        let pictures = await product.$eval('div.productBoxMainContent.cf>div.productBoxImage>a>img', el => el.src);
        let shop = 'spar';
        let country = countryIn;
        let priceIntSmall = priceToNumber(shop, price);
        data.push({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
      } catch (error) {
          console.log(error);
      }
    }
    console.table(data); 
  }
  console.log(data.length);
  write(data, shop, countryIn);
  browser.close();
}
 