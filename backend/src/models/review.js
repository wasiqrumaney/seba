"use strict";

const mongoose = require('mongoose');

// TODO : using discriminator or other techniques (i.e sub-documents), create an Abstract class Review.

const ReviewListingSchema  = new mongoose.Schema({
    author : {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        required: true
    },
    listing : {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
        required: true
    },
    description: {
        type: String,
        required : true
    },
    rating : Number,
});

const ReviewUserSchema  = new mongoose.Schema({
    author : {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        required: true
    },
    user : {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
        required: true
    },
    description: {
        type: String,
        required : true
    },
    rating : Number,
});


module.exports = mongoose.model('ReviewListing', ReviewListingSchema);
module.exports = mongoose.model('ReviewUser', ReviewUserSchema);