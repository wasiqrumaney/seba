"use strict";

const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcryptjs');

const config     = require('../config');
const UserModel  = require('../models/user');
const Common = require('../controllers/commonFunctions');
const UserImageModel = require('../models/userImage');
const fs = require('fs');


const login = (req,res) => {
    var validation = Common.checkProperty(req, res, "password"); if (validation) return validation;
    validation = Common.checkProperty(req, res, "email"); if (validation) return validation;

    UserModel.findOne({email: req.body.email}, { password: 1, email: 1, _id : 1}).exec()
        .then(user => {
            // check if the password is valid
            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordValid) return res.status(401).send({token: null });

            // if user is found and password is valid
            // create a token
            const loginDuration = (req.body.infinite != 1) ? 86400 : 99999999;
            const token = jwt.sign({ id: user._id, email: user.email }, config.JwtSecret, {
                expiresIn: loginDuration //
            });

            res.status(200).json({token: token});

        })
        .catch(error => res.status(404).json({
            error: 'User Not Found with' + req.body.email,
            message: error.message
        }));

};


const register = (req,res) => {
    console.log("Registration called");
    console.log(JSON.stringify(req.body));

    const user = Object.assign(req.body, {password: bcrypt.hashSync(req.body.password, 8), balance: 0, status : "default"});

    UserModel.create(user)
        .then(user => {

            // if user is registered without errors
            // create a token
            const token = jwt.sign({ id: user._id, email: user.email, seeker: user.seeker, host: user.host, balance : user.balance, status: user.status  }, config.JwtSecret, {
                expiresIn: 86400 // expires in 24 hours
            });

            console.log("register, req.file:", req.file);

            if (req.file) {
                let data = {
                    image: {
                        data: fs.readFileSync(req.file.path),
                        contentType: req.file.mimetype
                    }
                };
                return Promise.all([UserImageModel.create(data), Promise.resolve(token), Promise.resolve(user)])
            }

            return Promise.all([Promise.resolve(undefined), Promise.resolve(token), Promise.resolve(user)])

        }).then((promises) => {
        const image = promises[0];
        const token = promises[1];
        const userNow = promises[2];

        if (image != undefined){
            return Promise.all([UserModel.findByIdAndUpdate(userNow._id,{ image : image.id }, {new: true}).exec(), Promise.resolve(token)]);
        }
        return Promise.all([Promise.resolve(undefined), Promise.resolve(token)]);

    }).then((promises) => {
        res.status(200).json({token: promises[1]});
    })
        .catch(error => {
            if(error.code == 11000) {
                res.status(400).json({
                    error: 'User exists',
                    message: error.message
                })
            }
            else{
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                })
            }
        });

};

const me = (req, res) => {
    UserModel.findById(req.userId).select("-password").exec()
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
            "birthday": {
                "day": user.birthday.day,
                "month": user.birthday.month,
                "year": user.birthday.year
            },
            "balance": user.balance,
            "__v": user.__v,
            "requests" : user.requests,
            "contracts" : user.contracts,
            "listings" : user.listings,
        };

        if (image){
            returnUser.image = {
                contentType : image.image.contentType,
                base64 : Buffer.from(image.image.data).toString('base64'),
            }
        }

        res.status(200).json(returnUser);

    }).catch(error => res.status(500).json({
            error: 'Internal Server Error',
            message: error.message
        }));

};


module.exports = {
    login,
    register,
    me
};