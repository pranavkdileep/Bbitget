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


app.get('/trades', async (req, res) => {
    const trades1 = await getTrades(url1);
    const trades2 = await getTrades(url2);
    const trades3 = await getTrades(url3);
    const trades4 = await getTrades(url4);
    res.json({trades1, trades2, trades3, trades4});
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
});