require('dotenv').config();
const express = require('express');
const Twit = require('twit');

const scrapper = require('./utils/scrapper');
const { stringBuilder } = require('./utils/helper');

const app = express();

const Twot = new Twit({
    consumer_key:         process.env.CONSUMER_KEY,
    consumer_secret:      process.env.CONSUMER_SECRET,
    access_token:         process.env.ACCESS_TOKEN,
    access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});

app.get('/', async (req, res, next) => {
  let scrappedPage;
  const { user } = req.query;

  try {
    scrappedPage = await scrapper(user);    
  } catch (e) {
    return next(e);
  }

  try {
    await Twot.post('statuses/update', { status: stringBuilder(scrappedPage) });
  } catch (e) {
    return res.status(500).json({ message: 'Failed!' });
  }
  
  return res.status(200)
            .json({ data: scrappedPage });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error!',
  });
});

app.listen(3000, () => console.log('App listen on port 3000'));

module.exports = app;
