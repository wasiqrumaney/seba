"use strict";

const mongoose = require('mongoose');

const ListingSchema  = new mongoose.Schema({
    owner : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required : true
    },
    title: {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    address : {
        formatted_address: {
            type: String,
            required : true,
            default : ""
        },
        lat: Number,
        lng: Number
    },
    price: {
        type: Number,
        required : true
    },
    sqrm: {
        type: Number,
        required : true
    },
    image : { type: mongoose.Schema.Types.ObjectId, ref: 'ListingImage' },
    requests : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
});

module.exports = mongoose.model('Listing', ListingSchema);