 "use strict";

const express  = require('express');
const router   = express.Router();

const middlewares    = require('../middlewares');
const ListingController = require('../controllers/listing');
const multer  = require('multer');
 const upload = multer({ dest: 'uploads/' });

 // List all listings
router.get('/', ListingController.list);

 //Get last 3 listings
 router.get('/lastListings', ListingController.lastListings);


 // Create a new listing
router.post('/', upload.single('image') ,middlewares.checkAuthentication, ListingController.create);


 // Read a listing by Id
 router.get('/:id', ListingController.read);

 // Return all request of a specific listing ID
router.get('/:id/requests', middlewares.checkAuthentication, middlewares.checkOwnerListing, ListingController.requests);

 // Return all contracts specific listing ID
 router.get('/:id/contracts', middlewares.checkAuthentication, middlewares.checkOwnerListing, ListingController.contracts);

 // Remove a listing by ID --> only of there is no requests or contract
 router.delete('/:id',middlewares.checkAuthentication, middlewares.checkOwnerListing, ListingController.remove);

 // TODO, not priority
 // Update a listing by Id
 router.put('/:id', middlewares.checkAuthentication, ListingController.update);

module.exports = router;