const USERNAME_TWITTER = '@gakberbob0t';

module.exports = {
    tweetLast7DaysArtist: (data = []) => {
        let parsedString = 'Seminggu ini saya mendengarkan ';
        data.forEach(string => parsedString += `${string.title}, `);
        return parsedString;
    },
    tweetLast7DaysSong: (data = []) => {
        let parsedString = `${USERNAME_TWITTER} Beberapa lagu yang saya putar terus menerus : `;
        data.forEach(string => parsedString += `${string.title}, `);
        return parsedString;
    }
};