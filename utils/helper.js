const trimTweetLength = (string = '') => string.substring(0, 236) + '...';

module.exports = {
    tweetLast7DaysArtist: (data = []) => {
        let parsedString = 'Seminggu ini saya mendengarkan ';
        data.forEach(string => parsedString += `${string.title}, `);
        return parsedString.length >= 240 ? trimTweetLength(parsedString) : parsedString;
    },
    tweetLast7DaysSong: (data = [], userName) => {
        let parsedString = `${userName} Top 5 lagu yang sering diputar : \n\n`;
        data.forEach(string => parsedString += `${string.title}\n`);
        return parsedString.length >= 240 ? trimTweetLength(parsedString) : parsedString;
    }
};