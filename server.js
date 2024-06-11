const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// to access owner model functions

app.use(bodyParser.json());
app.enable('trust proxy');

app.get('/', (req, res) => {
    res.send('main home page');
});

app.use('/', require('./index'));

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});