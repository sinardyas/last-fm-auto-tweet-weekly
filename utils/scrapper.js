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
        .from(document.querySelectorAll('.link-block-target'))
        .map(data => ({
            title: data.getAttribute('title'),
            link: data.getAttribute('href')
        }))
        .slice(0, 5));

    return listeningData;
};

module.exports = async (page, user) => {
    try {
        return {
            sevenDaysArtistData: await SevenDaysArtist(page, user),
            sevenDaysSongData: await SevenDaysSong(page, user)
        }
    } catch (e) {
        throw e;
    }
};