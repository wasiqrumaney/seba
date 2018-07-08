"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const RequestController = require('../controllers/request');

// Create a new request
router.post('/', middlewares.checkAuthentication, RequestController.create);

// Read a request by Id
router.get('/:id', middlewares.checkAuthentication, middlewares.checkOwnerRequest, RequestController.read);

//accept request
router.put('/:id/accept', middlewares.checkAuthentication, middlewares.checkOwnerRequest, RequestController.accept);

//decline request
router.put('/:id/decline', middlewares.checkAuthentication, middlewares.checkOwnerRequest, RequestController.decline);

// Delete a request by Id, only if status is 'initialised' (and if is the owner)
router.delete('/:id', middlewares.checkAuthentication, middlewares.checkOwnerRequest, RequestController.remove);

module.exports = router;