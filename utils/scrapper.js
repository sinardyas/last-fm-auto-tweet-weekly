const luwak = require('luwak');

const sevenDaysArtistUrl = (user) => `https://www.last.fm/user/${user}/library/artists?date_preset=LAST_7_DAYS`;
const sevenDaysSongUrl = (user) => `https://www.last.fm/user/${user}/library/tracks?date_preset=LAST_7_DAYS`;

const SevenDaysArtist = async (page, user) => {
    await page.goto(sevenDaysArtistUrl(user));

    const listeningData = await page.evaluate(() => Array
        .from(document.querySelectorAll('.chartlist .chartlist-name .link-block-target'))
        .map(data => ({
            title: data.getAttribute('title'),
            link: data.getAttribute('href')
        }))
        .slice(0, 10));

    return listeningData;
};

const SevenDaysSong = async (page, user) => {
    await page.goto(sevenDaysSongUrl(user));

    const listeningData = await page.evaluate(() => Array
        .from(document.querySelectorAll('.chartlist .chartlist-name > a'))
        .map(data => ({
            title: data.getAttribute('title'),
            link: data.getAttribute('href')
        }))
        .slice(0, 5));

    return listeningData;
};

const SevenDaysArtistV2 = async (user) => {    
    let result = [];
    try {
       result = await luwak(sevenDaysArtistUrl(user))
        .select([{
            '$root': 'table.chartlist tbody tr',
            artist: '.chartlist-name a@title'
        }])
        .fetch();
    } catch (e) {
        throw e.message;
    }    

    return result.slice(0, 10);
}

const SevenDaysSongV2 = async (user) => {    
    let result = [];
    try {
       result = await luwak(sevenDaysSongUrl(user))
        .select([{
          '$root': 'table.chartlist tbody tr',
          artist: '.chartlist-artist a@title',
          song: '.chartlist-name a@title'
        }])
        .fetch();
    } catch (e) {
        throw e.message;
    }    

    return result.slice(0, 5);
}

module.exports = async (user) => {
    try {
        return {
            sevenDaysArtistData: await SevenDaysArtistV2(user),
            sevenDaysSongData: await SevenDaysSongV2(user)
        }
    } catch (e) {
        throw e;
    }
};