"use strict";

const ListingModel = require('../models/listing');
const ListingImageModel = require('../models/listingImage');
const RequestModel = require('../models/request');
const ContractModel = require('../models/contract');
const UserModel = require('../models/user');
const UserImageModel = require('../models/userImage');
const UserController = require('../controllers/user');
const Common = require('../controllers/commonFunctions');
const fs = require('fs');

/*
We require that the user is a host, not a seeker
 */
const create = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty, request sent was:' + req.body.title
    });

    UserController.isUserType("host", req.userId).then( isHost => {
        if (!isHost){
            return res.status(401).json({
                error: 'Bad Request',
                message: 'Account not allowed to create Listings: This action requires a host account'
            });
        }

        let requests = req.body;
        requests['owner'] = req.userId;

        ListingModel.create(requests)
            .then(listing => {
                // Add created listings on User

                UserModel.findByIdAndUpdate(req.userId,{ $push: { listings: listing._id } }, {new: true}).exec();

                let data = {};

                if (req.file){
                    data = {
                        image : {
                            data : fs.readFileSync(req.file.path),
                            contentType : req.file.mimetype
                        }
                    };
                }
                return Promise.all([ListingImageModel.create(data), Promise.resolve(listing)])

            }).then((promises) => {
                const image = promises[0];
                const listing = promises[1];

                if (image) {
                    return ListingModel.findByIdAndUpdate(listing.id, {image: image.id}, {new: true}).exec();
                } else {
                    return Promise.resolve(listing);
                }

        }).then( (listing) => {
            res.status(201).json(listing)
        })
            .catch(error => res.status(500).json({
                error: 'Internal server error',
                message: error.message
            }));
    })

};


const read  = (req, res) => {
    ListingModel.findById(req.params.id).exec()
        .then(listing => {
            if (!listing) return res.status(404).json({
                error: 'Not Found',
                message: `Listing not found`
            });

            return Promise.all([ListingImageModel.findById(listing.image).exec(),UserModel.findById(listing.owner).select(['name','_id','image']).exec(), Promise.resolve(listing) ]);
        }).then( (promises) => {
            const image = promises[0];
            const host = promises[1];
            const listing = promises[2];

            // listing exist for sure
            let listObj = listing.toObject();


            let imageObj = {};
            if (image){
                imageObj = image.toObject();
                listObj.image = imageObj.image;
            }
            if (host) {
                listObj.host = host;
            }
            return Promise.all([Promise.resolve(listObj), UserImageModel.findById(host.image).exec(),]);
        }).then((promises) => {
            let listObj = promises[0];
            let hostImage = promises[1];

            let hostObj = listObj.host.toObject();

            if(hostImage){
                hostObj.image = hostImage.image;
                listObj.host = hostObj;
            }
            res.status(200).json(listObj);
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));

};


const update = (req, res) => {
    var validation = Common.checkNotEmpty(req, res);
    if (validation) return validation;

    ListingModel.findById(req.params.id).exec()
        .then(listing => {
            validation = Common.checkUsersMatch(req, res, listing.owner);
            if (validation) {
                return validation;
            }
            else {
                ListingModel.findByIdAndUpdate(req.params.id,req.body,{
                    new: true,
                    runValidators: true}).exec().then( listing => {
                return res.status(200).json(listing) });
            }
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};


const remove = (req, res) => {

    console.log("about to remove a listing. Need to be removed from user too.");

    ListingModel.findById(req.params.id).exec()
        .then(listing => {

            console.log("listing to be removed: ", listing);

            /*
            if (!listing.requests.empty() || !listing.contracts.empty()  ){
                // TODO
                console.log("request cannot be deleted");
            }
            */

            return UserModel.findByIdAndUpdate(listing.owner,{ $pull: { listings: listing._id } }, {new: true}).exec();

        }).then(() => {
            return ListingModel.findByIdAndRemove(req.params.id).exec();
        }).then(() => {

            res.status(200).json({message: `Listing with id${req.params.id} was deleted`})

            }
        ).catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};


const list  = (req, res) => {
    ListingModel.find({}).where('sqrm').gt(0).exec()
        .then(listings => {

            let PromisesListingInfo = listings.map( (listing) => {
                return Promise.all([ListingImageModel.findById(listing.image).exec(),
                    UserModel.findById(listing.owner).select(['name','_id','image']).exec()]);
            });
            return Promise.all([Promise.all(listings), Promise.all(PromisesListingInfo)])
        }).then((promises)=> {
            let listings = promises[0];
            let listingDetails = promises[1];

            let returnListings = listings.map( (listing,i) => {

                let listingImage = {};
                if (listingDetails[i][0]){
                    listingImage = listingDetails[i][0].toObject();
                }
                let listingHost = {};
                if(listingDetails[i][1]){
                    listingHost = listingDetails[i][1].toObject();
                }

                let listObj = listing.toObject();
                if (listingImage.image){
                    listObj.image = listingImage.image;
                }

                if (listingHost) {
                    listObj.owner = listingHost;
                }

                return listObj;
            });

            res.status(200).json(returnListings);
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const lastListings  = (req, res) => {
    // TODO do not hardcode limit maximum



    ListingModel.find({}).limit(req.limit).exec()
        .then(listings => {

            let PromisesListingInfo = listings.map( (listing) => {
                return Promise.all([ListingImageModel.findById(listing.image).exec(),
                    UserModel.findById(listing.owner).select(['name','_id','image']).exec()]);
            });
            return Promise.all([Promise.all(listings), Promise.all(PromisesListingInfo)])
        }).then((promises)=> {
        let listings = promises[0];
        let listingDetails = promises[1];

        let returnListings = listings.map( (listing,i) => {

            let listingImage = {};
            if (listingDetails[i][0]){
                listingImage = listingDetails[i][0].toObject();
            }
            let listingHost = {}
            if(listingDetails[i][1]){
                listingHost = listingDetails[i][1].toObject();
            }

            let listObj = listing.toObject();
            if (listingImage.image){
                listObj.image = listingImage.image;
            }

            if (listingHost) {
                listObj.owner = listingHost;
            }

            return listObj;
        });

        res.status(200).json(returnListings);
    })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

/* Return requests by ID */
const requests  = (req, res) => {
    console.log("/listings/:id/requests")

    ListingModel.findById(req.params.id).exec()
        .then(listings => {
           // Iterate over all requests ID and return it.
            const allRequests = listings.requests;
            return RequestModel.find({ "_id" : {$in : allRequests}}).exec()
        }).then(requests => {
            res.status(200).json(requests)
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

/* Return contracts by ID */
const contracts  = (req, res) => {
    console.log("/listings/:id/contracts");

    ListingModel.findById(req.params.id).exec()
        .then(listings => {
            // Iterate over all requests ID and return it.
            const allRequests = listings.requests;
            return RequestModel.find({ "_id" : {$in : allRequests}}).exec()
        }).then(requests => {
            let allContracts = requests.map((x) => x.contract);
            return ContractModel.find({ "_id" : {$in : allContracts}}).exec()
        }).then(contracts => {

            let requests = contracts.map( (c) => {
                return RequestModel.findById(c.request).exec()
            });

            return Promise.all([Promise.all(requests), Promise.resolve(contracts)]);

        }).then((promises) => {
            let requests = promises[0];
            let contracts = promises[1];

            let seekers = requests.map( (r) => {
                return UserModel.findById(r.seeker).select(['name','_id','image']).exec()
            } );

            return Promise.all([Promise.all(seekers), Promise.resolve(contracts), Promise.resolve(requests)]);

         }).then ((promises) => {
            let seekers = promises[0];
            let contracts = promises[1];
            let requests = promises[2];

            let allContracts = contracts.map( (c,i) => {
                c = c.toObject();
                c.seeker = seekers[i];
                c.request = requests[i];
                return c;
            } );

            res.status(200).json(allContracts)
        })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message}))

};

module.exports = {
    create,
    read,
    update,
    remove,
    list,
    lastListings,
    requests,
    contracts
};