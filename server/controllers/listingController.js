const mongoose = require('mongoose');
const Listing = require('../models/Listing');

// Helper to check DB connection state
const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all listings with filtering, search, and sorting
// @route   GET /api/listings
// @access  Public
const getAllListings = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is not ready. Please ensure MongoDB is running.',
      });
    }

    const { search, category, listingType, status, sortBy } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Listing Type filter (Exchange, Borrow, Lost & Found)
    if (listingType && listingType !== 'All') {
      query.listingType = listingType;
    }

    // Status filter (Available, Resolved, Claimed, Borrowed)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Keyword Search
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { listingType: searchRegex },
        { itemLocation: searchRegex },
        { 'contactDetails.campusLocation': searchRegex },
        { 'contactDetails.name': searchRegex },
        { tags: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default newest first
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'title_asc') {
      sortOption = { title: 1 };
    } else if (sortBy === 'price_low') {
      sortOption = { price: 1 };
    } else if (sortBy === 'price_high') {
      sortOption = { price: -1 };
    }

    const listings = await Listing.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    console.error('Error in getAllListings:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching listings: ' + error.message,
    });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format',
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error('Error in getListingById:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while fetching listing: ' + error.message,
    });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Public
const createListing = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is not ready. Please ensure MongoDB is running.',
      });
    }

    const {
      title,
      description,
      category,
      listingType,
      price,
      itemCondition,
      contactDetails,
      itemLocation,
      imageUrl,
      tags,
    } = req.body;

    // Explicit validation checks for user-friendly error messages
    const errors = [];
    if (!title || !title.trim()) errors.push('Title is required');
    if (!description || !description.trim()) errors.push('Description is required');
    if (!category) errors.push('Category is required');
    if (!listingType) errors.push('Listing type is required');
    if (!contactDetails || !contactDetails.name) errors.push('Contact name is required');
    if (!contactDetails || !contactDetails.email) errors.push('Contact email is required');
    if (!contactDetails || !contactDetails.campusLocation) errors.push('Campus location is required');

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: errors.join(', '),
      });
    }

    // Process tags if provided as comma-separated string or array
    let processedTags = [];
    if (Array.isArray(tags)) {
      processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
    } else if (typeof tags === 'string') {
      processedTags = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const newListing = await Listing.create({
      title: title.trim(),
      description: description.trim(),
      category,
      listingType,
      price: price !== undefined && price !== '' ? Number(price) : 0,
      itemCondition: itemCondition || 'Gently Used',
      status: 'Available',
      contactDetails: {
        name: contactDetails.name.trim(),
        email: contactDetails.email.trim().toLowerCase(),
        phone: contactDetails.phone ? contactDetails.phone.trim() : '',
        campusLocation: contactDetails.campusLocation.trim(),
      },
      itemLocation: itemLocation ? itemLocation.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      tags: processedTags,
    });

    return res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing: newListing,
    });
  } catch (error) {
    console.error('Error in createListing:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server error while creating listing: ' + error.message,
    });
  }
};

// @desc    Update an existing listing
// @route   PUT /api/listings/:id
// @access  Public
const updateListing = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is not ready. Please ensure MongoDB is running.',
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format',
      });
    }

    // Check if listing exists
    const existingListing = await Listing.findById(id);
    if (!existingListing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    const updateData = { ...req.body };

    // Format tags if provided as string
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Make sure contact details merge properly
    if (updateData.contactDetails) {
      updateData.contactDetails = {
        ...existingListing.contactDetails.toObject(),
        ...updateData.contactDetails,
      };
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('Error in updateListing:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', '),
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Server error while updating listing: ' + error.message,
    });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Public
const deleteListing = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        error: 'Database connection is not ready. Please ensure MongoDB is running.',
      });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format',
      });
    }

    const deleted = await Listing.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error in deleteListing:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error while deleting listing: ' + error.message,
    });
  }
};

// @desc    Get summary statistics
// @route   GET /api/listings/meta/stats
// @access  Public
const getListingStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        stats: {
          total: 0,
          exchange: 0,
          borrow: 0,
          lostAndFound: 0,
          available: 0,
          resolved: 0,
          byCategory: {},
        },
      });
    }

    const [total, exchange, borrow, lostAndFound, available, resolved, categoryStats] =
      await Promise.all([
        Listing.countDocuments(),
        Listing.countDocuments({ listingType: 'Exchange' }),
        Listing.countDocuments({ listingType: 'Borrow' }),
        Listing.countDocuments({ listingType: 'Lost & Found' }),
        Listing.countDocuments({ status: 'Available' }),
        Listing.countDocuments({ status: { $in: ['Resolved', 'Claimed'] } }),
        Listing.aggregate([
          { $group: { _id: '$category', count: { $sum: 1 } } },
        ]),
      ]);

    const byCategory = {};
    categoryStats.forEach((cat) => {
      byCategory[cat._id] = cat.count;
    });

    return res.status(200).json({
      success: true,
      stats: {
        total,
        exchange,
        borrow,
        lostAndFound,
        available,
        resolved,
        byCategory,
      },
    });
  } catch (error) {
    console.error('Error in getListingStats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve stats: ' + error.message,
    });
  }
};

module.exports = {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getListingStats,
};
