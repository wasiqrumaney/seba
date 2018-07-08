"use strict";

const http       = require('http');
const mongoose   = require('mongoose');

const api        = require('./src/api');
const config     = require('./src/config');

const morgan      = require('morgan');


// Set the port to the API.
api.set('port', config.port);

//Create a http server based on Express
const server = http.createServer(api);


// use morgan to log requests to the console


//Connect to the MongoDB database; then start the server
mongoose
    .connect(config.mongoURI)
    .then(() =>  server.listen(config.port))
    .catch(err => {
        console.log('Error connecting to the database', err.message);
        process.exit(err.statusCode);
    });


server.on('listening', () => {
    console.log(`API is running in port ${config.port}`);

});

server.on('error', (err) => {
    console.log('Error in the server', err.message);
    process.exit(err.statusCode);
});

const logout = (req, res) => {
    res.status(200).send({ token: null });
};

// Section for logging
console.log("Connecting to Database");

mongoose.connection.on('connected', function(){ console.log("DB Successful connection");});
mongoose.connection.on('error', function(){ console.log("DB Failed connection");});
mongoose.connection.on('disconnected', function(){console.log("DB LOST connection - possible timeout")});




