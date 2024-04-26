const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  wishlistBooks: [{
    title: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    }
  }]
},
{ strict: false });

module.exports = mongoose.model('wishlist', wishlistSchema);