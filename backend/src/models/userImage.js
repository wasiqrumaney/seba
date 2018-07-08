"use strict";

// TODO CHANGE: email must be unique + other fields all true

const mongoose = require('mongoose');

const UserImageSchema  = new mongoose.Schema({
    image : { data: Buffer, contentType: String }
});

module.exports = mongoose.model('UserImage', UserImageSchema);