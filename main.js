const getTradsFromAPI = async () => {
    const response = await fetch('/trades',{timeout: 60});
    const data = await response.json();
    console.log(data);
    return data;
}

const fs = require('fs');

const compareTrades = (localData, apiData) => {
    const newTrades = [];
    apiData.forEach(apiTrade => {
        const localTrade = localData.find(localTrade => localTrade.pair === apiTrade.pair);
        if (!localTrade) {
            newTrades.push(apiTrade);
        }
    });
    if (newTrades.length > 0) {
        fs.writeFileSync('Data/data1.json', JSON.stringify(apiData, null, 2));
    }
    return newTrades;
}

const LocalDatajson = fs.readFileSync('Data/data1.json');

const LocalData = JSON.parse(LocalDatajson);

const express = require('express');

const app = express();

const PORT = process.env.PORT || 7860;

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

const nodecron = require('node-cron');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    nodecron.schedule('*/1 * * * *', async () => {
        const apiData = await getTradsFromAPI();
        const newTrades = compareTrades(LocalData, apiData);
        console.log(newTrades);
    });
});

    