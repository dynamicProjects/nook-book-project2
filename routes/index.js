const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { title } = require('process');

//Read books data
const booksData = JSON.parse(fs.readFileSync('./books.json', 'utf-8'));
//Read featured books data
const featuredBooksdata = JSON.parse(fs.readFileSync('./featuredBooks.json', 'utf-8'));

const router = express.Router();

let username = '';
let featuredBooks = null;
let allBooks = null;

// Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/nookbook', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Add books collection and data to database
const Books = mongoose.model('Books');
booksData.forEach(async function(n) {
  await Books.findOneAndUpdate( {title: n.title, image: n.image, author: n.author}, n, { new: true, upsert: true });
});
// Add featured books collection and data to database
const FeaturedBooks = mongoose.model('FeaturedBooks');
featuredBooksdata.forEach(async function(n) {
  await FeaturedBooks.findOneAndUpdate( n, n, { new: true, upsert: true });
});
//wishlist schema
const Wishlist = mongoose.model('wishlist');

// LOgin page Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});
// contactUS page Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    message: { type: String, required: false }
  });

// Define Model
const User = mongoose.model('User', userSchema);
const contactUS = mongoose.model('contactUS', contactSchema);

router.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

// ROUTES
//home page
router.get('/', async function(req, res){
  try {
    if (featuredBooks === null) {
      featuredBooks = await FeaturedBooks.find()
        .then((featuredList) => {
          return featuredList;
        })
        .catch(() => { 
          return []; 
        });
    }
    if (allBooks === null) {
      allBooks = await Books.find()
        .then((books) => {
          return books;
        })
        .catch(() => { 
          return []; 
        });
    }
    res.render("index", {
      user: username,
      books: allBooks,
      featuredList: featuredBooks
    });
  } catch (err) {
    console.error('Error handling home page', err);
    res.status(500).send('Error getting data from the server');
  }
});

//all books page
router.get('/books', async function(req, res){
  try {
    if (allBooks === null) {
      allBooks = await Books.find()
        .then((books) => {
          return books;
        })
        .catch(() => { 
          return []; 
        });
    }
    res.render("books", {
      user: username,
      books: allBooks
    });
  } catch (err) {
    console.error('Error handling books page', err);
    res.status(500).send('Error getting data from the server');
  }
});

//individual book info page
router.get('/api/books/:title/:author', async function(req, res) {
  try {
    const currentBook = await Books.find({ title: req.params.title, author: req.params.author })
        .then((book) => {
          return book;
        })
        .catch(() => { 
          return []; 
        });
    const currentUserWishlist = await Wishlist.find({ username: username, "wishlistBooks.title": req.params.title, "wishlistBooks.author": req.params.author })
        .then((wishlist) => {
          return wishlist;
        })
        .catch(() => { 
          return []; 
        });
    res.render("book", {
      user: username,
      bookInfo: currentBook[0],
      wishlist: currentUserWishlist[0],
    });
  } catch (err) {
    console.error('Error handling book page', err);
    res.status(500).send('Error: couldn\'t find the book');
  }
});

router.get('/signin', function(req, res){
  res.render("signin");
});

router.get('/logout', function(req, res){
  username = '';
  res.render("index", {
    user: username,
    books: allBooks,
    featuredList: featuredBooks
  });
});

router.get('/contact', function(req, res){
  res.render("contact", {user: username});
});
router.get('/about', function(req, res){
  res.render("about", {user: username});
});

// Handle POST request to save user data Signin page
router.post('/', async function(req, res) {
  username = req.body.email;
  try {
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    
    if (existingUser) {
      // User already exists, perform sign-in action
      res.redirect('/');
    } else {
      // User does not exist, create a new user instance
      const newUser = new User({
        email: req.body.email,
        password: req.body.password
      });
      await newUser.save();
      // Perform sign-in action for the newly created user
      res.redirect('/');
    }
  } catch (err) {
    console.error('Error handling user sign-in/sign-up:', err);
    res.status(500).send('Error handling user sign-in/sign-up');
  }
});

// Handle POST request to add book to a wishlist
router.post('/addRemoveWishlist', async function(req, res) {
  try {
    // Check if user has signed in
    if (username !== '') {
      // Check if user already has a wishlist
      const userWishlistExists = await Wishlist.findOne({ username: username });
      
      if (userWishlistExists) {
        // User already exists, check if book already added
        const bookExists = await Wishlist.findOne({ username: username, "wishlistBooks.title": req.body.title });
        if (bookExists) {
          //remove from wishlist
          await Wishlist.updateOne({username: username}, { $pull: {wishlistBooks: {
            title: req.body.title,
            author: req.body.author,
          }}})
        } else {
          // add to wishlist
          await Wishlist.updateOne({username: username}, { $push: {wishlistBooks: {
            title: req.body.title,
            author: req.body.author,
            image: req.body.image,
          }}})
        }
        res.redirect('/');
      } else {
        // User does not exist, add new wishlist
        const wishlist = new Wishlist({
          username: username,
          wishlistBooks: {
            title: req.body.title,
            author: req.body.author,
            image: req.body.image
          }
        });
        await wishlist.save();
        res.redirect('/');
      }
    } else {
      // User not signed in. Redirect to signin page
      res.redirect('/signin');
    }
  } catch (err) {
    console.error('Error handling wishlist addition', err);
    res.status(500).send('Error: cannot add to the wishlist');
  }
});


// post record for contactUS
router.post('/contact', async function(req, res) {
    try {
      // Create contactUS form
      const newContact = new contactUS({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        message: req.body.message,
      });
      await newContact.save();
      res.send('data saved');
    } catch (err) {
      console.error('Error saving user data:', err);
      res.status(500).send('Error saving user data');
    }
  });

module.exports = router;
