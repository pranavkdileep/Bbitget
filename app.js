const puppeteer = require('puppeteer');
const fs = require('fs');
const { send } = require('process');

const getTrades = async (url) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    await new Promise(r => setTimeout(r, 1000));
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

    if (JSON.stringify(trades1) !== JSON.stringify(LocalTrades1)) {
        await sendTelegramMessage('Trader 1 has new trades' + '\n' + JSON.stringify(trades1));
        fs.writeFileSync('Data/data1.json', JSON.stringify(trades1));
    }
    if (JSON.stringify(trades2) !== JSON.stringify(LocalTrades2)) {
        await sendTelegramMessage('Trader 2 has new trades' + '\n' + JSON.stringify(trades2));
        fs.writeFileSync('Data/data2.json', JSON.stringify(trades2));
    }
    if (JSON.stringify(trades3) !== JSON.stringify(LocalTrades3)) {
        await sendTelegramMessage('Trader 3 has new trades' + '\n' + JSON.stringify(trades3));
        fs.writeFileSync('Data/data3.json', JSON.stringify(trades3));
    }
    if (JSON.stringify(trades4) !== JSON.stringify(LocalTrades4)) {
        await sendTelegramMessage('Trader 4 has new trades' + '\n' + JSON.stringify(trades4));
        fs.writeFileSync('Data/data4.json', JSON.stringify(trades4));
    }

}

const mainLoop = async () => {
    while (true) {
        await main();
        await new Promise(r => setTimeout(r, 1000));
    }
}

mainLoop();