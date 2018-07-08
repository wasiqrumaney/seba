"use strict";

const UserModel = require('../models/user');
const RequestModel = require('../models/request');
const ContractModel = require('../models/contract');
const ListingModel = require('../models/listing');
const assert = require('assert');
const Common = require('../controllers/commonFunctions');
const UserImageModel = require('../models/userImage');
const ListingImageModel = require('../models/listingImage')

const read = (req, res) => {
    UserModel.findById(req.params.id, { password:0, email:0}).exec()
        .then(user => {

            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            return Promise.all([UserImageModel.findById(user.image).exec(), Promise.resolve(user)]);
        }).then( (promises) => {
        const image = promises[0];
        const user = promises[1];


        const returnUser = {
            "name": {
                "first": user.name.first,
                "last": user.name.last
            },
            "email": user.email,
            "_id": user._id,
            "status": user.status,
            "description" : user.description,
            "seeker": user.seeker,
            "host": user.host,
            "newsletter": user.newsletter,
            "balance": user.balance,
            "birthday": {
                "day": user.birthday.day,
                "month": user.birthday.month,
                "year": user.birthday.year
            },
            "requests" : user.requests,
            "contracts": user.contracts,
            "listings": user.listings,
            "__v": user.__v,
        };

        if (image){
            returnUser.image = {
                contentType : image.image.contentType,
                base64 : Buffer.from(image.image.data).toString('base64'),
            }
        }




        res.status(200).json(returnUser);


         })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));

};


const update = (req, res) => {
    var validation = Common.checkNotEmpty(req, res);
    if (validation) return validation;
    validation = Common.checkUsersMatch(req, res, req.params.id);
    if (validation) return validation;

    UserModel.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidators: true}).exec()
        .then(user => res.status(200).json(user))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

const list  = (req, res) => {
    UserModel.find({}, { password:0, email:0}).limit(5).exec()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};

// TODO : Complete
const search = (req, res) => {
    ListingModel.find({requests:0, }).limit(amount);
};

/* Datamanager layer */

/**
 * Check the type of the user, to see if they can perform certain actions.
 * @userType String, "seeker" or "host" and indicates to check if the user is of that type
 * @userId String, Id of the user in question.
 */
const isUserType = (userType, userId) => {
    console.log("before");
    assert(userType === "seeker" || userType === "host");
    console.log("user id:" + userId);
    return UserModel.findById(userId, { seeker:1, host:1}).exec()
        .then(user => {
            console.log(user.seeker);
            console.log("and host:" + user.host)
            console.log("is host?:" + ((userType === "host") && (user.host === true)))
            return ((userType === "seeker") && (user.seeker === true)) || ((userType === "host") && (user.host === true));
        })
};


/**
 * Return the pending requests of the user (status initialised)
 * @param req
 * @param res
 * @return [Request]
 */
const pendingRequests = (req, res) => {
    UserModel.findById(req.userId, { password:0, email:0}).exec()
        .then(user => {
            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            let promisesRequests = RequestModel.find({ "_id" : {$in : user.requests}}).where('status').equals('initialised').exec();
            return Promise.all([promisesRequests]);
        }).then( (promises) => {
            let pendingRequests = promises[0];

             let promisesUserInfo = pendingRequests.map( (pendingRequests) => {
                return Promise.all([ListingModel.findById(pendingRequests.listing).select(['title','_id','image']).exec(),
                    UserModel.findById(pendingRequests.host).select(['name','_id','image']).exec()]);
            });
                return Promise.all([Promise.all(pendingRequests), Promise.all(promisesUserInfo)]);
            }).then((promises) => {
                let promisesRequests = promises[0];
                let details = promises[1];

                let returnObj = promisesRequests.map((promisesRequest, i) => {
                    let listing = (details[i][0]).toObject();
                    let host = details[i][1].toObject();

                    let listObj = promisesRequest.toObject();
                    listObj.listing = listing;
                    listObj.host = host;
                    return listObj;
                });
                res.status(200).json(returnObj)
             })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));

};

/**
 * Return the active contracts of the requesting user, with associated data.
 *
 * Specifically: Returns those with status "active"
 * @param req
 * @param res
 * @return [Contract]
 */
const activeContracts = (req, res) => {
    UserModel.findById(req.userId, { password:0, email:0}).exec()
        .then(user => {
            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            return ContractModel.find({ "_id" : {$in : user.contracts}}).exec()
        }).then( (activeContracts) => {

            let promisesActiveContracts = activeContracts.map( c => {
                return RequestModel.findById(c.request).exec()
            });

            return Promise.all([Promise.all(activeContracts),Promise.all(promisesActiveContracts)]);

         }).then((promises) => {
             let activeContracts = promises[0];
             let requests = promises[1];
             let promisesListingUser = activeContracts.map( (contract,i) => {
                 const request = requests[i];

                 return Promise.all([ListingModel.findById(request.listing).select(['_id','title','description']).exec(),
                     UserModel.findById(request.host).select(['_id','name','email']).exec()]);
             });

             return Promise.all([Promise.all(activeContracts),Promise.all(promisesListingUser), Promise.all(requests)])

            }).then((promises) => {

                let activeContracts = promises[0];
                let listingUser = promises[1];
                let requests = promises[2];

            let returnActiveContracts = activeContracts.map( (contract,i) => {
                const listingObj = (listingUser[i][0]).toObject();
                const hostObj = (listingUser[i][1]).toObject();
                const request = requests[i];

                let contractObj = contract.toObject();
                contractObj.listing = listingObj;
                contractObj.sqrm =request.sqrm;
                contractObj.message = request.message;
                contractObj.startDate = request.startDate;
                contractObj.endDate = request.endDate;
                contractObj.host = hostObj;
                contractObj.seeker = request.seeker;

                return contractObj;
            })

            console.log("returnActiveContracts: ", returnActiveContracts);

            res.status(200).json(returnActiveContracts);
        })
       .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

/**
 * Return the users past requests and contracts
 *
 * @tuple
 *
 * Iterate over all contracts and requests, return the ones which are "declined" for request, not "active"
 * for contracts
 * @param req
 * @param res
 * @returns [[Request], [Contract]]
 */
const past = (req, res) => {

    UserModel.findById(req.userId, { password:0, email:0}).exec()
        .then(user => {
            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            const declined = RequestModel.find({ "_id" : {$in : user.requests}}).where('status').equals('declined').exec();
            const pastContract = ContractModel.find({ "_id" : {$in : user.contracts}}).where('status').ne('active').exec();

            return Promise.all([declined, pastContract]);

        }).then( (promises) => {
            res.status(200).json(promises)
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};


const listings  = (req, res) => {
    console.log("searching for owner id: " + req.params.id);
    ListingModel.find({owner : req.params.id}).sort({ title: 1 }).exec()
        .then(listings => {

            console.log("users has  listing length: ", listings.length);

            let promisesListingInfo = listings.map( (listing) => {
                return Promise.all([ListingImageModel.findById(listing.image).exec(),
                    UserModel.findById(listing.owner).select(['name','_id','image']).exec()]);
            });
            return Promise.all([Promise.all(listings), Promise.all(promisesListingInfo)])
        }).then((promises)=> {
        let listings = promises[0];
        let listingDetails = promises[1];


        let returnListings = listings.map( (listing,i) => {

            let listingImage = {};
            if (listingDetails[i][0]) {
                console.log("typeof(listingDetails[i][0]): ", typeof(listingDetails[i][0]));
                console.log("listingDetails[i][0]: ", listingDetails[i][0]);
                listingImage = listingDetails[i][0].toObject();
            }

            let listingHost = {}
            if (listingDetails[i][1]) {
                console.log("listingDetails[i][1]: ", listingDetails[i][1]);
                listingHost = listingDetails[i][1].toObject();
            }

            let listObj = listing.toObject();
            listObj.image = listingImage.image;
            listObj.owner = listingHost;
            return listObj;
        });

        res.status(200).json(returnListings);
         })
        .catch(error => res.status(500).json({
            error: 'Internal server error',
            message: error.message
        }));
};


const become  = (req, res) => {
    // Return user
    UserModel.findById(req.userId, { password:0, email:0}).exec()
        .then(user => {
            if (!user) return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

            if (user.seeker === true && user.host === true){
                res.status(404).json({
                    error: "You are already both seeker and host",
                    message: ""
                });
            }

            if (user.seeker === true && user.host === false){
                // become also a host
                return UserModel.findByIdAndUpdate(user.id, {host:true}, {new: true}).exec()
            }

            else if (user.seeker === false && user.host === true){
                // become also a host
                return UserModel.findByIdAndUpdate(user.id, {seeker:true}, {new: true}).exec()
            }
            else {
                throw new Error("something went wrong on the backend.");
            }

        }).then( (user) => {
            res.status(200).json(user);
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
}

module.exports = {
    read,
    update,
    list,
    search,
    isUserType,
    pendingRequests,
    activeContracts,
    past,
    listings,
    become
};