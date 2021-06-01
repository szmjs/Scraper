const OfferLinks = require('./offerLinks')
const { pullCoop } = require('./coop')
const pullAllLidl = require('./pullAllLidl')
const schedule = require('node-schedule')
const pullSpar = require('./pullSpar')
const pullTesco = require('./pullTesco')
const pullAldi = require('./pullAldi')
const pullPenny = require('./pullPenny')
const { dropDBCollection } = require('./dropDBCollection')
const { dropShop } = require('./dropShop')

async function main() {
      
  
  await pullPenny(OfferLinks.penny.hu, Object.keys(OfferLinks.penny)[0], Object.getOwnPropertyNames(OfferLinks)[1]);
  await pullTesco(OfferLinks.tesco.hu, Object.keys(OfferLinks.tesco)[0], Object.getOwnPropertyNames(OfferLinks)[7]);
  await pullAllLidl(); 
  await pullSpar(OfferLinks.spar.hu, Object.keys(OfferLinks.spar)[0]); 
  await pullAldi(OfferLinks.aldi.hu, Object.keys(OfferLinks.aldi)[0], Object.getOwnPropertyNames(OfferLinks)[8]);
  await pullCoop(Object.values(OfferLinks.fakta)[0], Object.keys(OfferLinks.fakta)[0], Object.getOwnPropertyNames(OfferLinks)[2]);
  await pullCoop(Object.values(OfferLinks.irma)[0], Object.keys(OfferLinks.irma)[0], Object.getOwnPropertyNames(OfferLinks)[4]);
  await pullCoop(Object.values(OfferLinks.superbrugsen)[0], Object.keys(OfferLinks.superbrugsen)[0], Object.getOwnPropertyNames(OfferLinks)[3]);
  await pullCoop(Object.values(OfferLinks.kvickly)[0], Object.keys(OfferLinks.kvickly)[0], Object.getOwnPropertyNames(OfferLinks)[5]);
  
 
  schedule.scheduleJob('* 30 8 * * 7', async () => {
    try {
      pullTesco(OfferLinks.tesco.hu, Object.keys(OfferLinks.tesco)[0], Object.getOwnPropertyNames(OfferLinks)[7]);
      pullAllLidl(); 
      pullSpar(OfferLinks.spar.hu, Object.keys(OfferLinks.spar)[0]); 
      pullAldi(OfferLinks.aldi.hu, Object.keys(OfferLinks.aldi)[0], Object.getOwnPropertyNames(OfferLinks)[8]);
    } catch (error) {
      console.log(error);
    }
  });
  schedule.scheduleJob('* 30 8 * * 4', async () => {
    try {
      await pullCoop(Object.values(OfferLinks.fakta)[0], Object.keys(OfferLinks.fakta)[0], Object.getOwnPropertyNames(OfferLinks)[2]);
      await pullCoop(Object.values(OfferLinks.irma)[0], Object.keys(OfferLinks.irma)[0], Object.getOwnPropertyNames(OfferLinks)[4]);
    } catch (error) {
      console.log(error);
    }
  });
  schedule.scheduleJob('* 30 8 * * 5', async () => {
    try {
      await pullCoop(Object.values(OfferLinks.superbrugsen)[0], Object.keys(OfferLinks.superbrugsen)[0], Object.getOwnPropertyNames(OfferLinks)[3]);
      await pullCoop(Object.values(OfferLinks.kvickly)[0], Object.keys(OfferLinks.kvickly)[0], Object.getOwnPropertyNames(OfferLinks)[5]);
    } catch (error) {
      console.log(error);
    }
  });
}
main()
