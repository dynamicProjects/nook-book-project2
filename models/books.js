const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  tags: {
    main: {
      type: String,
      trim: true,
    },
    sub: {
      type: String,
      trim: true,
    },
    others: {
      type: String,
      trim: true,
    }
  },
  purchaseOptions: [{
    option: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      trim: true,
    }
  }],
  overview: {
    type: String,
    trim: true,
  },
  productDetails: {
    ISBN: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    publicationDate: {
      type: String,
      trim: true,
    },
    pages: {
      type: String,
      trim: true,
    },
    productDimensions: {
      type: String,
      trim: true,
    }
  },
},
{ strict: false });

module.exports = mongoose.model('Books', booksSchema);