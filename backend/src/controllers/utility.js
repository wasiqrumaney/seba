"use strict";

const UserModel = require('../models/user');

const minutesBetween = (req,res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'lng')) return res.status(400).json({
        error: 'Bad Request',
        message: 'Send "lng" property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'lat')) return res.status(400).json({
        error: 'Bad Request',
        message: 'Send "lat" property'
    });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'listing')) return res.status(400).json({
        error: 'Bad Request',
        message: 'Send "listing" (id) property, try using mock Listing ID: 5b156372fb6fc02bcb8d94e0'
    });

    ListingModel.findById(req.params.id).exec()
        .then(listing => {
            // TODO: do something with Listings properties, send external API call to google maps API to work out
            // travel time, use the req. property for the search, not mock Listing.
            res.status(200).json({"timeDistance":5});

        })
        .catch(error => res.status(404).json({
            error: 'Listing Not Found, try using mock Listing ID: 5b156372fb6fc02bcb8d94e0',
            message: error.message
        }));

};

const ping = (req, res) => {
    res.status(200).send({ "message":'Backend Server of StoreIt4Me is online and responds to your request' });
};

const authenticatedPing = (req, res) => {
    res.status(200).send({ "message":'Backend Server of StoreIt4Me is online and responds to your AUTH=TRUE request' });
};


const incrementBalance   = (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'balance')) return res.status(400).json({
        error: 'Bad Request',
        message: "Request need 'balance' property. "
    });

    // balance to increment
    UserModel.findByIdAndUpdate(req.userId,{ $inc: { balance: req.body.balance}}, {new: true}).exec()
        .then(user => {

            console.log("incrementBalance user:", user);

            res.status(200).json(user);
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


module.exports = {
    minutesBetween,
    ping,
    authenticatedPing,
    incrementBalance
};