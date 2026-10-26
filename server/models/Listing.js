const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Books', 'Electronics', 'Stationery', 'Lost & Found', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    listingType: {
      type: String,
      required: [true, 'Listing type is required'],
      enum: {
        values: ['Exchange', 'Borrow', 'Lost & Found'],
        message: '{VALUE} is not a valid listing type',
      },
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price/Deposit cannot be negative'],
    },
    itemCondition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Gently Used', 'Fair', 'N/A'],
      default: 'Gently Used',
    },
    status: {
      type: String,
      enum: ['Available', 'Claimed', 'Resolved', 'Borrowed'],
      default: 'Available',
    },
    contactDetails: {
      name: {
        type: String,
        required: [true, 'Contact person name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Contact email is required'],
        trim: true,
        lowercase: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email address',
        ],
      },
      phone: {
        type: String,
        trim: true,
        default: '',
      },
      campusLocation: {
        type: String,
        required: [true, 'Campus location is required (e.g., Hostel/Dept/Library)'],
        trim: true,
      },
    },
    itemLocation: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast searching on title, description, and tags
listingSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  itemLocation: 'text',
  'contactDetails.campusLocation': 'text',
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
