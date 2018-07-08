"use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const UtilityController = require('../controllers/utility');


router.get('/minutesBetween', UtilityController.minutesBetween);
router.get('/minutesBetween', UtilityController.ping);
router.get('/minutesBetween', middlewares.checkAuthentication, UtilityController.authenticatedPing);

router.put('/incrementBalance', middlewares.checkAuthentication, UtilityController.incrementBalance); // Increment balance for current user ID

module.exports = router;