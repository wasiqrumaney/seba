"use strict";

const ContractModel = require('../models/contract');
const RequestModel = require('../models/request');
const UserModel = require('../models/user');
const Common = require('../controllers/commonFunctions');


const read   = (req, res) => {
    ContractModel.findById(req.params.id).exec()
        .then(contract => {

            // TODO, does this code make sense ??
            if (!contract) return res.status(403).json({
                error: 'Not Found',
                message: `Contract not found`
            });


            return Promise.all([RequestModel.findById(contract.request).exec(), Promise.resolve(contract)]);

        }).then((promises) => {
            let request = promises[0];
            let contract = promises[1];

            let contractObj = contract.toObject();
            contractObj.message = request.message;
            contractObj.startDate = request.startDate;
            contractObj.endDate = request.endDate;
            contractObj.listing = request.listing;
            contractObj.sqrm = request.sqrm;
            contractObj.host = request.host;
            contractObj.seeker = request.seeker;

            res.status(201).json(contractObj);
        })
        .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
};

const confirmDeposit   = (req, res) => {

    if (req.userType == "host"){
        ContractModel.findByIdAndUpdate(req.params.id, {depositedHost:true}, {new: true} )
            .then((contract) => {
                res.status(201).json(contract);
            })
            .catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));
    } else { // verification has been made before with middleware
        ContractModel.findByIdAndUpdate(req.params.id, {depositedSeeker:true}, {new: true} )
            .then((contract) => {
                res.status(200).json(contract);
            })
            .catch(error => res.status(500).json({
                error: 'Internal Server Error',
                message: error.message
            }));
    }
};


const confirmPickUp = (req, res) => {

    ContractModel.findById(req.params.id).then((contract) => {

        if (contract.balanceRemaining > 0){
            res.status(403).json({
                error: 'Need to pay first',
                message: `Before confirm the pick up, the contract must be full paid.`
            });
        }
        if (req.userType == "host" && contract.pickedUpSeeker === false){
            return ContractModel.findByIdAndUpdate(req.params.id, {pickedUpHost:true}, {new: true} );
        } else if (req.userType == "host" && contract.pickedUpSeeker === true) {
            return ContractModel.findByIdAndUpdate(req.params.id, {pickedUpHost:true, status: "past"}, {new: true} );

        } else if (req.userType == "seeker" && contract.pickedUpSeeker === false) {
            return ContractModel.findByIdAndUpdate(req.params.id, {pickedUpSeeker:true}, {new: true} );
        } else {
            return ContractModel.findByIdAndUpdate(req.params.id, {pickedUpSeeker:true, status: "past"}, {new: true} );
        }

    }).then((contract) => {
        return Promise.all([RequestModel.findById(contract.request).exec(), Promise.resolve(contract)]);
    }).then( (promises) => {
        let request = promises[0];
        let contract = promises[1];

        console.log("contract: ", contract);

        return Promise.all([
            UserModel.findByIdAndUpdate(request.host , { $inc: { balance: contract.balanceTotal}}, {new: true} ),

            Promise.resolve(contract)]);
    } ).then( (promises) => {
        let contract = promises[1];
        res.status(201).json(contract);

    }).catch(error => {

        console.log("confirmPickUp error: ", error);

        res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        })
    });

};

const payContract = (req, res) => {
    Common.checkProperty(req, res, "amount");

    if(req.body.amount < 0){
        res.status(400).json({
            error: 'Internal Server Error',
            message: "The amount must be positive"
        });
    }

    if (req.userType === "seeker") {
        // 1. Get users balance
        const userForBalance = UserModel.findById(req.userId, {balance: 1}).exec();
        const contractForRemaining = ContractModel.findById(req.params.id, {balanceRemaining: 1}).exec()
        const promises = Promise.all([userForBalance,contractForRemaining]);

        promises.then((promises) => {
            const user = promises[0];
            const contract = promises[1];
            console.log(user);
            if (user.balance <= req.body.amount) {
                throw new Error("Not enough balance.");
            }

            // 2. Check how much the balance remaining on the contract is.
            if (contract.balanceRemaining <= 0){
                throw new Error("Not need to paid more. Contracts is already paid.");
            }

            if(req.body.amount > contract.balanceRemaining) {
                throw new Error("You are paying more than the contract");
            }

            // 3. Update contract model to be less the users balance.
                const newBalance = contract.balanceRemaining - req.body.amount;
                console.log("still new balance:", newBalance);

            const bal = - parseInt(req.body.amount);

                return Promise.all(
                    [ContractModel.findByIdAndUpdate(req.params.id, {balanceRemaining: newBalance}, {new: true}),
                        UserModel.findByIdAndUpdate(req.userId, { $inc: { balance: bal} }, {new: true})
                    ])

        }).then((promises) => {
                res.status(201).json(promises[0].balanceRemaining);
        })
        .catch (e => {

            console.log("e: ", e);

            res.status(407).json({
                error: 'Bad requests',
                message: e
            });
        })
    } else {
                res.status(403).json({
                    error: 'Bad requests',
                    message: "Host cannot pay the contract - Only the seeker can pay for the contract"
                });
    }
};


module.exports = {
    read,
    confirmDeposit,
    confirmPickUp,
    payContract
};