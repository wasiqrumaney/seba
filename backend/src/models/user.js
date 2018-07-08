"use strict";

const mongoose = require('mongoose');

const UserSchema  = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true,
    },
    name : {
        first : {
            type: String,
            required: true,
        },
        last : {
            type: String,
            required: true,
        }
    },
    password : {
        type: String,
        required: true
    },
    birthday : {
        month : {
            type: Number,
            required: false,
        },
        day : {
            type: Number,
            required: false,
        },
        year : {
            type: Number,
            required: false,
        },
    },
    newsletter : Boolean,
    status: String,
    balance: {
        type: Number,
        required: true
    },
    seeker: {
        type: Boolean,
        required: true
    },
    host: {
        type: Boolean,
        required: true
    },

    image : { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },

    listings : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    requests : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }],

    // Attention! This are just the contracts of a SEEKER (not the host, for the host the contracts are under Requests -> contract)
    contracts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contract' }],

    // reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReviewUser' }],

});

module.exports = mongoose.model('User', UserSchema);