const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const compression = require('compression');
// const nodemailer = require('nodemailer')
const routes = require('./routes')
const PORT = process.env.PORT || 3001;
const app = express();
require('dotenv').config();
const axios = require('axios');

// adding a useless comment
// Define middleware here
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Define API routes here
app.use(routes);


// Connected to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/covidtracker', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
});

// Send every other request to the React app
// Define any API routes before this runs
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

app.get('/api/news', async (req, res) => {
  let newsUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=coronavirus&api-key=' + process.env.REACT_APP_NEWS_API_KEY;
  
  try {
    const response = await axios.get(newsUrl);
    console.log('response', response.data);
    res.send(response.data);
  } catch (error) {
    console.log(error);
  }
});


app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
