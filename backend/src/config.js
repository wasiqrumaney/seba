"use strict";

//Configuration variables
const port      = process.env.PORT        || '3000';
const mongoURI  = process.env.MONGODB_URI || 'mongodb://GJJW:Bzn9XYyJFb7AbV6s@ds247670.mlab.com:47670/seba';
const JwtSecret = process.env.JWT_SECRET  ||'6weLbNH7mby84qjF';

module.exports = {
    port,
    mongoURI,
    JwtSecret,
};