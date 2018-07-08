"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const UserController = require('../controllers/user');

// GDPR : hiddden
//router.get('/', UserController.list); // List all user
// Read a user by ID, return just public information
router.get('/:id', UserController.read);

// Return all requests of user that make the request that are 'initialised'
router.get('/requests/pending', middlewares.checkAuthentication, UserController.pendingRequests);
router.get('/contracts/active', middlewares.checkAuthentication, UserController.activeContracts);

// Contain both, past contracts and declined requests
router.get('/contracts/past', middlewares.checkAuthentication, UserController.past);

router.get('/:id/listings',  UserController.listings); // Get all listings by user id

router.put('/becomeHostSeeker', middlewares.checkAuthentication, UserController.become);

// TODO
router.put('/:id', middlewares.checkAuthentication, UserController.update);

module.exports = router;