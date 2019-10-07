const express = require('express');
const app = express();
// Load model plugins
require('./models/register-plugins');

// MIDDLEWARE
const morgan = require('morgan');
const checkConnection = require('./middleware/check-connection');

const ensureAuth = require('./middleware/ensure-auth');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));

// IS ALIVE TEST
app.get('/hello', (req, res) => res.send('world'));

app.use(checkConnection);

// API ROUTES
const auth = require('./routes/auth');
app.use('/api/auth', auth);

const smoothie = require('./routes/smoothies');
app.use('/api/smoothies', ensureAuth(), smoothie);

const juice = require('./routes/juices');
app.use('/api/juices', ensureAuth(), juice);

const me = require('./routes/me');
app.use('/api/me', ensureAuth(), me);

// NOT FOUND
const api404 = require('./middleware/api-404');
app.use('/api', api404);
// using express default 404 for non-api routes

// ERRORS
const errorHandler = require('./middleware/error-handler');
app.use(errorHandler);

module.exports = app;