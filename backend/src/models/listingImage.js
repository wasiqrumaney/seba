"use strict";

const mongoose = require('mongoose');

const ListingImageSchema  = new mongoose.Schema({
    image : { data: Buffer, contentType: String }
});

module.exports = mongoose.model('ListingImage', ListingImageSchema);