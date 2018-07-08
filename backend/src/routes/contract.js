"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const ContractController = require('../controllers/contract');


router.get('/:id', middlewares.checkAuthentication, middlewares.checkHostSeekerContract, ContractController.read); // Read a contract by Id
//router.put('/:id', middlewares.checkAuthentication, ContractController.update); // Update a contract by Id

// Confirm deposit
router.put('/:id/confirmDeposit', middlewares.checkAuthentication, middlewares.checkHostSeekerContract, ContractController.confirmDeposit);

// Confirm pickUp
router.put('/:id/confirmPickUp', middlewares.checkAuthentication, middlewares.checkHostSeekerContract, ContractController.confirmPickUp);

// Pay Contract
router.put('/:id/pay', middlewares.checkAuthentication, middlewares.checkHostSeekerContract, ContractController.payContract);

module.exports = router;