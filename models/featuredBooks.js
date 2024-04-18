const mongoose = require('mongoose');

const featuredBooksSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
  banner: {
    type: String,
    trim: true,
  }
},
{ strict: false });

module.exports = mongoose.model('FeaturedBooks', featuredBooksSchema);