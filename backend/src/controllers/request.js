"use strict";

const RequestModel = require('../models/request');
const ListingModel = require('../models/listing');
const UserModel = require('../models/user');
const ContractModel = require('../models/contract');
const Common = require('../controllers/commonFunctions');

const create = (req, res) => {

    //var validation = Common.checkNotEmpty(req, res);
    //if (validation) return validation;

    Common.checkProperty(req, res, "listing");
    Common.checkProperty(req, res, "sqrm");

    const listing_id = req.body.listing;

    ListingModel.findById(listing_id).exec()
        .then((data) => {
            if (!data){
                throw new Error('Cannot find any listing with such ID.');
            }

            if (parseInt(req.body.sqrm) > parseInt(data.sqrm)){
                console.log("Came here");
                throw new Error("Not enough space available.");
            }

            // Get the owner of the listing (host)
            let owner = data.owner;

            // Create the request
            let request = req.body;
            request['host'] = owner;
            request['seeker'] = req.userId;
            request['listing'] = listing_id;

            request['startDate'] = new Date(req.body.startDate),
            request['endDate'] = new Date(req.body.endDate),
            request['sqrm'] = req.body.sqrm;

            console.log("create request with such information: ", request);

            RequestModel.create(request).then(request => {
                    // Update "seeker": add request ID
                    const updateUser = UserModel.findByIdAndUpdate(req.userId,{ $push: { requests: request._id } }, {new: true}).exec();
                    // Update "listing": add listing ID
                    const updateListing = ListingModel.findByIdAndUpdate(listing_id,{ $push: { requests: request._id } }, {new: true}).exec();
                    //const updateListingSqrm = ListingModel.findByIdAndUpdate(listing_id, {sqrm: data.sqrm - req.body.sqrm}, {new: true}).exec();
                    const requestPromise = Promise.resolve(request);
                    return Promise.all([updateUser,updateListing, requestPromise]);
                }).then ((values) => {
                    request = values[2];
                    res.status(201).json(request);
                })
                .catch(error => res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                }));

        })
        .catch( (error) => {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                });
            }
        );
};

const read   = (req, res) => {
    RequestModel.findById(req.params.id).exec()
        .then(request => {

            if (!request) return res.status(404).json({
                error: 'Not Found',
                message: `Request not found`
            });

            res.status(200).json(request)

        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));

};

const remove = (req, res) => {

    const request_id = req.params.id;
    console.log("want to remove: request_id: ", request_id);

    UserModel.findById(req.userId).exec()
        .then((user) => {
            if (!user) {
                throw new Error('Cannot find any user with such ID.');
            }

            // Need to find listing of the request:
            return RequestModel.findById(request_id).exec();

        }).then((request) => {
            if (!request) {
                throw new Error('Cannot find any request with such ID');
            }

            if (request.status != "initialised") {
                throw new Error('Cannot remove such requests. The status is: ' + request.status);
            }

            // Remove from request
            console.log("removeRequest with id: ", request.id);
            const removeRequest = RequestModel.findByIdAndRemove(request.id).exec();
            // Remove from user
            console.log("remove request from user where req.userId: ", req.userId);
            const removeUser = UserModel.findByIdAndUpdate(req.userId,{ $pull: { requests: request.id } }, {new: true}).exec();
            // Remove from listing
            console.log("remove request from listing where request.listing ID: ", request.listing);
            const removeListing = ListingModel.findByIdAndUpdate(request.listing,{ $pull: { requests: request.id} }, {new: true}).exec();

            return Promise.all([removeRequest,removeUser,removeListing]);
        }).then(() => {
                console.log("return message:", request_id );
                res.status(200).json({message: `Request with id ${request_id} was deleted`})
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


const accept = (req, res) => {

    const request_id = req.params.id;

    RequestModel.findById(request_id).exec()
    .then((request) => {
        if (request.status == "accepted" || request.status == "declined"){
            res.status(500).json({
                error: 'Cannot change status',
                message: 'Request was already handled by host. The request status is: ' + request.status
            })
        }
        console.log("startDate", request.startDate);
        console.log("endDate", request.endDate);


        let daysDiff = Math.round(Math.abs((request.startDate - request.endDate)/(24*60*60*1000)));
        daysDiff = Math.max(1,daysDiff);

        let noOfWeeks = Math.ceil(daysDiff/7);
        let totalCost = noOfWeeks * request.price;

        let contract = {
            request : request.id,
            balanceRemaining : totalCost,
            balanceTotal: totalCost
        };


        return Promise.all([ContractModel.create(contract), Promise.resolve(request), ListingModel.findById(request.listing).exec()])

    }).then((promises) => {
        const contract = promises[0];
        const request = promises[1];
        const listing = promises[2];

        // Request got accepted and contract added
        const updateRequest = RequestModel.findByIdAndUpdate(request_id, {"status": "accepted", "contract": contract.id}, {new: true}).exec()
        // Add contracts to seeker
        const updateSeeker = UserModel.findByIdAndUpdate(request.seeker,{ $push: { contracts: contract.id } }, {new: true}).exec();
        //Subtract sqrm from listing when request accepted
        const updateListing = ListingModel.findByIdAndUpdate(request.listing,{ sqrm : listing.sqrm - request.sqrm }, {new: true}).exec();

        return Promise.all([updateRequest,updateSeeker,updateListing])
    }).then((promises) => {
        res.status(200).json(promises[0]);
    })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const decline = (req, res) => {

    RequestModel.findById(req.params.id).exec()
        .then((request) => {
            if (!request) {
                throw new Error('Cannot find any request with such ID');
            }

            if (request.status == "accepted" || request.status == "declined"){
                res.status(500).json({
                    error: 'Cannot change status',
                    message: 'Request was already handled by host. The request status is: ' + request.status
                })
            }

            return RequestModel.findByIdAndUpdate(request.id, { "status": "declined" }, {new: true}).exec();
        }).then((request) => res.status(200).json(request))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));

};


module.exports = {
    create,
    read,
    remove,
    accept,
    decline
};