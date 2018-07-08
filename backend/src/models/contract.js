"use strict";

const mongoose = require('mongoose');

const ContractSchema  = new mongoose.Schema({
    request : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },

    depositedHost: {
            type: Boolean,
            default: false,
        },
    depositedSeeker: {
            type: Boolean,
            default: false,
    },

    pickedUpHost: {
        type: Boolean,
        default: false,
    },

    pickedUpSeeker: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String, // active, past
        default: "active",
        required: true
    },
    balanceRemaining: {
        type: Number,
        required: true
    },
    balanceTotal: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model('Contract', ContractSchema);