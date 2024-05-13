const getTradsFromAPI = async () => {
    const response = await fetch('https://pranavkd-bitget.hf.space/trades',{timeout: 60});
    const data = await response.json();
    return data;
}

const fs = require('fs');

demoapidata = {
    "trades1": [
      {
        "pair": "ETHUSDT",
        "price": "2,884.41\n                        USDT",
        "direction": "Long"
      },
      {
        "pair": "ETHUSDT",
        "price": "2,936.23\n                        USDT",
        "direction": "Long"
      }
    ],
    "trades2": [],
    "trades3": [],
    "trades4": []
  }



const sendTelegramMessage = async (message) => {
    const response = await fetch('https://api.telegram.org/bot6846260168:AAGuSGtoqRfuYhhtvZ11xoacx2nyKI2ixN0/sendMessage?chat_id=1196575861&text='+message);
    const data = await response.json();
    return data;
}

const compareTrades = (LocalData, apiData) => {
  let apidataalltrades = [];
  for (let key in apiData) {
    apidataalltrades = apidataalltrades.concat(apiData[key]);
  }
  console.log('Api Data');
  console.log(apidataalltrades);
  let newTrades = [];
  for (let i = 0; i < apidataalltrades.length; i++) {
    let isTradeExist = false;
    for (let j = 0; j < LocalData.length; j++) {
      if (apidataalltrades[i].pair === LocalData[j].pair && apidataalltrades[i].price === LocalData[j].price) {
        isTradeExist = true;
        break;
      }
    }
    if (!isTradeExist) {
      newTrades.push(apidataalltrades[i]);
    }
  }
  
  
  if (newTrades.length > 0) {
    LocalData = LocalData.concat(newTrades);
    console.log(newTrades);
    sendTelegramMessage(JSON.stringify(newTrades));
    fs.writeFileSync('Data/data1.json', JSON.stringify(LocalData));
  }
  else {
    console.log('No new trades found');
  }
  return newTrades;
}


  



const express = require('express');

const app = express();

const PORT = process.env.PORT || 7860;

app.get('/', (req, res) => {
    res.send('Hello World');
}
);

const nodecron = require('node-cron');
const nodecron2 = require('node-cron');


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    nodecron.schedule('*/1 * * * *', async () => {
        const apiData = await getTradsFromAPI();
        // console.log(apiData);
        const LocalDatajson = fs.readFileSync('Data/data1.json');
        
        const LocalData = JSON.parse(LocalDatajson);
        console.log('Api Data');
        console.log(apiData);
        console.log('Local Data');
        console.log(LocalData);
        const newTrades = compareTrades(LocalData, apiData);
        console.log(newTrades);
    });
    nodecron2.schedule('0 0 * * *', async () => {
        sendTelegramMessage('Hello, I am still alive');
    });
});

    
