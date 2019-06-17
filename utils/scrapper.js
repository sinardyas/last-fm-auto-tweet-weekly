const puppeteer = require('puppeteer');

const urlBuilder = (user) => `https://www.last.fm/user/${user}/library/artists?date_preset=LAST_7_DAYS`;

module.exports = async (user) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 926 });
    await page.goto(urlBuilder(user));

    const listeningData = await page.evaluate(() => Array
        .from(document.querySelectorAll('.chartlist .chartlist-name .link-block-target'))
        .map(data => ({
            title: data.getAttribute('title'),
            link: data.getAttribute('href')
        }))
        .slice(0, 10));

    await browser.close();

    return listeningData;
};
