require('dotenv').config();
const express = require('express');
const Twit = require('twit');
const puppeteer = require('puppeteer');

const Scrapper = require('./utils/scrapper');
const { tweetLast7DaysArtist, tweetLast7DaysSong } = require('./utils/helper');

const port = process.env.PORT;
const app = express();

const Twot = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});

app.get('/', async (req, res, next) => {
  const { user } = req.query;

  let scrappedPage;
  let tweetArtistResult;
  let tweetSongResult;

  const browser = await puppeteer.launch({
    headless: true,
    args:['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 926 });

  try {
    scrappedPage = await Scrapper(page, user);
    console.log(`[${new Date()}] Scrapping process success : ${JSON.stringify(scrappedPage, null, 2)}`);
  } catch (e) {
    return next(e);
  }

  await browser.close();

  try {
    tweetArtistResult = await Twot.post('statuses/update', { status: tweetLast7DaysArtist(scrappedPage.sevenDaysArtistData) });
    console.log(`[${new Date()}] Tweet 7 days artist success : ${JSON.stringify(tweetArtistResult.data, null, 2)}`);
  } catch (e) {
    return next(e);
  }
  
  try {
    tweetSongResult = await Twot.post('statuses/update', {
      status: tweetLast7DaysSong(scrappedPage.sevenDaysSongData, tweetArtistResult.data.user.screen_name),
      in_reply_to_status_id: tweetArtistResult.data.id_str
    });
    console.log(`[${new Date()}] Tweet 7 days song success : ${JSON.stringify(tweetSongResult.data, null, 2)}`);
  } catch (e) {
    return next(e);
  }
  
  return res.status(200)
            .json({ data: scrappedPage, tweet: { tweetArtistResult, tweetSongResult } });
});

app.use((err, req, res, next) => {
  console.error(`[${new Date()}] Error : ${JSON.stringify(err.message, null, 2)}`);
  res.status(err.status || 500)
     .json({
        message: err.message || 'Internal server error!',
     });
});

app.listen(port, () => console.log(`App listen on port ${port}`));

module.exports = app;
