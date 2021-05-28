var express = require('express');
var router = express.Router();
const KrakenClient = require('kraken-api');
var AssestPairs = require('../models/assetPair');
/* GET home page. */

router.get('/', function (req, res, next) {
  const key = process.env.key; // API Key
  const secret = process.env.secret; // API Private Key
  const kraken = new KrakenClient(key, secret);

  (async () => {
    // Display user's balance
    // let asset = await kraken.api('AssetPairs')
    // let allAssets = Object.keys(asset.result);
    // let processArray = []
    // allAssets.map(val=>{
    //   processArray.push(
    //     AssestPairs.findOneAndUpdate({altname:  asset.result[val].altname}, asset.result[val], { upsert: true, setDefaultsOnInsert: true })
    //   )
    // })

    // await Promise.all(processArray);
    // Get Ticker Info
    let tickerInfo = await kraken.api('Ticker', { pair: 'AAVEETH' })
    res.send(tickerInfo);
  })();
});

module.exports = router;
