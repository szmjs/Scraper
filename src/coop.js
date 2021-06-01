const puppeteer = require("puppeteer");
const { parseCoop } = require("./parseCoop.js");
const priceToNumber = require("./priceToNumber.js");
const { write } = require("./write.js");

async function pullCoop(offersLinkIn, countryIn, shopIn) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let country = countryIn;
    let shop = shopIn;
    await page.goto(offersLinkIn);
    await page.setViewport({ width: 1280, height: 30000 });
    await page.waitForSelector(".incito__view.incito__absolute-layout-view[data-role='offer']");
    const links = await page.$$(".incito__view.incito__absolute-layout-view[data-role='offer']");
    
    let dateSource;
    let offerDateEl;
    let offerDate;

    if (shop == "irma") {
        dateSource = await page.$(".title.middle");
        offerDateEl = await dateSource.$("h2:nth-child(1)");
        offerDate = await offerDateEl.evaluate(el => el.innerHTML);

    } else {
        dateSource = await page.$(".text-right");
        offerDateEl = await dateSource.$("span:nth-child(1)");
        offerDate = await offerDateEl.evaluate(el => el.innerHTML);
    }

    console.log(links.length + " PRODUCTS ARE ON OFFER IN " + shop.toUpperCase());

    let data = [];
    
    for (let i = 0; i < links.length; i++) {
        try {
            
            let pictures = [];
            let pics = await links[i].$$("img");
            for (let j=1;j<=pics.length;j++){
                let p = await links[i].$eval("div.incito__view.incito__absolute-layout-view>img:nth-child("+j+")", el => el.getAttribute('data-src'));
                console.log( i, j, p);
                pictures.push(p);
            }
            let prod = await links[i].evaluate(el => el.getAttribute('aria-label'));
            let allInf = await parseCoop(prod);
            let name;
            let unit;
            let price;

            switch (allInf.length) {
                case 3: name = allInf[0];
                    unit = allInf[1];
                    price = allInf[2];
                    break;
                case 4: name = allInf[0] + "," + allInf[1];
                    unit = allInf[2];
                    price = allInf[3];
                    break;
                case 5: name = allInf[0] + "," + allInf[1] + "," + allInf[2];
                    unit = allInf[3];
                    price = allInf[4];
            }
            let priceIntSmall = priceToNumber(shop, price); 
            data.push({ name, unit, price, priceIntSmall, offerDate, pictures, shop, country });
            pictures = [];

        } catch (error) {
            console.log(error);
        }
    }
    
    write(data, shop, countryIn);
    browser.close();
}
module.exports.pullCoop = pullCoop;