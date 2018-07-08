"use strict";

const mongoose = require('mongoose');

const RequestSchema  = new mongoose.Schema({
    seeker : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    host : {
        type: mongoose.Schema.Types.ObjectId, // == OWNER
        ref: 'User',
        required: true
    },
    listing : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    contract : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate : {
        type: Date,
        required: true
    },
    message : {
        type: String,
        required: true
    },
    price : {
        type: Number,
        required: true,
        default: 12
    },
    sqrm: {
        type: Number,
        required: true
    },
    status: {
        type: String, // initialised, accepted, declined
        default: "initialised",
        required: true
    }
});

module.exports = mongoose.model('Request', RequestSchema);