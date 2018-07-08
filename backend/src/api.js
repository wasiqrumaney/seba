"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const middlewares = require('./middlewares');

const auth  = require('./routes/auth');
const listing = require('./routes/listing');
const utility = require('./routes/utility');
const user = require('./routes/user');
const request = require('./routes/request');
const contract = require('./routes/contract');

const api = express();
const morgan      = require('morgan');

// Adding Basic Middlewares
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);
api.use(morgan('dev'));

// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Store It 4 me Index page response: Currently under development (edit this in api.js)'
    });
});

// API routes
api.use('/auth'  , auth);
api.use('/listings', listing);
api.use('/utility', utility);
api.use('/users', user);
api.use('/requests', request);
api.use('/contracts', contract);



module.exports = api;