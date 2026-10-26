const express = require('express');
const router = express.Router();
const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingStats,
} = require('../controllers/listingController');

// Meta statistics endpoint
router.get('/meta/stats', getListingStats);

// Main CRUD endpoints
router.route('/')
  .get(getAllListings)
  .post(createListing);

router.route('/:id')
  .get(getListingById)
  .put(updateListing)
  .delete(deleteListing);

module.exports = router;
