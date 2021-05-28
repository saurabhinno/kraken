const assestPair = require('./models/assetPair');
var cron = require('node-cron');
const KrakenClient = require('kraken-api');
const key = process.env.key; // API Key
const secret = process.env.secret; // API Private Key
const kraken = new KrakenClient(key, secret);
const async = require('async')

const addTicker = async (val) => {
    try {
        let tickerInfo = await kraken.api('Ticker', { pair: val.get('altname') })
        let updateInfo = await assestPair.updateOne({ _id: val.get('_id') }, { $push: { ticker: tickerInfo.result[val.get('altname')] } });
        return true;
    } catch (error) {
        console.log(error);
    }
}

const queue = async.queue(async (task, completed) => {
    console.log("Currently Busy Processing Task " + task);
    await addTicker(task)
    completed(null, { task })
}, 1);

let cronWork = async () => {
    let allAssets = await assestPair.find({}, { altname: 1 });
    if (allAssets.length) {
        let processArray = [];
        allAssets.map(value => {
            queue.push(value);
        })

        await Promise.all(processArray)
    } else {
        let asset = await kraken.api('AssetPairs')
        let allAssets = Object.keys(asset.result);
        let processArray = []
        allAssets.map(val => {
            processArray.push(
                assestPair.findOneAndUpdate({ altname: asset.result[val].altname }, asset.result[val], { upsert: true, setDefaultsOnInsert: true })
            )
        })

        await Promise.all(processArray);
        cronWork()
    }
}
cron.schedule('* * * * *', () => {
    cronWork()
    console.log('running a task every minute');
});