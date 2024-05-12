const puppeteer = require('puppeteer');
const fs = require('fs');
const { send } = require('process');
const nodecorn1 = require('node-cron');

const nodecron2 = require('node-cron');  
const express = require('express');


const app = express();
const PORT = process.env.PORT || 7860;

app.get('/', (req, res) => {
    res.send('Hello World');
});

const getTrades = async (url) => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: 'new',
        ignoreDefaultArgs: ['--disable-extensions'],
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
    const page = await browser.newPage();
    await page.goto(url);
    
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({path: 'example.png'});
    const trades = await page.evaluate(() => {
        const tradeList = document.querySelectorAll('.list-box.trader-current__details-list .list-box-container');
        const trades = [];
        tradeList.forEach(trade => {
            const tradeData = {};
            const pairElement = trade.querySelector('.text-16px.font-500');
            const priceElement = trade.querySelector('.list-box-container__item.openPosition .list-box-container__item-openAvgPrice');
            const directionElement = trade.querySelector('.position-space .long');
            
            if (pairElement && priceElement && directionElement) {
                tradeData.pair = pairElement.innerText.trim();
                tradeData.price = priceElement.innerText.trim();
                tradeData.direction = directionElement.innerText.trim();
                trades.push(tradeData);
            } else {
                console.log("One or more elements not found for this trade.");
            }
        });
        return trades;
    });
    
    
    console.log(trades);

    await browser.close();
    return trades;
    
}

const url1 = "https://www.bitgetapp.com/copytrading/trader/bcb44f7487b43055a197/futures";
const url2 = "https://www.bitgetapp.com/copytrading/trader/b0b2467f8eb33053a694/futures";
const url3 = "https://www.bitgetapp.com/copytrading/trader/beb04e778cb33f52a293/futures";
const url4 = "https://www.bitgetapp.com/copytrading/trader/b9bd48738db63954a595/futures";



const sendTelegramMessage = async (message) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '6846260168:AAGuSGtoqRfuYhhtvZ11xoacx2nyKI2ixN0'
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1196575861';
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${message}`;
    await fetch(url);
}

const main = async () => {
    const trades1 = await getTrades(url1);
    const trades2 = await getTrades(url2);
    const trades3 = await getTrades(url3);
    const trades4 = await getTrades(url4);

    const LocalData1 = fs.readFileSync('Data/data1.json');
    const LocalData2 = fs.readFileSync('Data/data2.json');
    const LocalData3 = fs.readFileSync('Data/data3.json');
    const LocalData4 = fs.readFileSync('Data/data4.json');

    const LocalTrades1 = JSON.parse(LocalData1);
    const LocalTrades2 = JSON.parse(LocalData2);
    const LocalTrades3 = JSON.parse(LocalData3);
    const LocalTrades4 = JSON.parse(LocalData4);

    const newTrades1 = trades1.filter(trade => !LocalTrades1.find(t => t.pair === trade.pair));
    const newTrades2 = trades2.filter(trade => !LocalTrades2.find(t => t.pair === trade.pair));
    const newTrades3 = trades3.filter(trade => !LocalTrades3.find(t => t.pair === trade.pair));
    const newTrades4 = trades4.filter(trade => !LocalTrades4.find(t => t.pair === trade.pair));

    if (newTrades1.length > 0) {
        let tradess = '';
        newTrades1.forEach(trade => {
            tradess += `${trade.pair} - ${trade.price} - ${trade.direction}\n`;
        });
        sendTelegramMessage(`New trades from trader 1: ${tradess}`);
        fs.writeFileSync('Data/data1.json', JSON.stringify(trades1));
    }
    if (newTrades2.length > 0) {
        let tradess = '';
        newTrades2.forEach(trade => {
            tradess += `${trade.pair} - ${trade.price} - ${trade.direction}\n`;
        });
        sendTelegramMessage(`New trades from trader 2: ${tradess}`);
        fs.writeFileSync('Data/data2.json', JSON.stringify(trades2));
    }
    if (newTrades3.length > 0) {
        let tradess = '';
        newTrades3.forEach(trade => {
            tradess += `${trade.pair} - ${trade.price} - ${trade.direction}\n`;
        });
        sendTelegramMessage(`New trades from trader 3: ${tradess}`);
        fs.writeFileSync('Data/data3.json', JSON.stringify(trades3));
    }
    if (newTrades4.length > 0) {
        let tradess = '';
        newTrades4.forEach(trade => {
            tradess += `${trade.pair} - ${trade.price} - ${trade.direction}\n`;
        });
        sendTelegramMessage(`New trades from trader 4: ${tradess}`);
        fs.writeFileSync('Data/data4.json', JSON.stringify(trades4));
    }
    
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    nodecorn1.schedule('*/1 * * * *', () => {
        main();
    });
    nodecron2.schedule('*/15 * * * *', () => {
        sendTelegramMessage('Hello, I am still running');   
    });
});