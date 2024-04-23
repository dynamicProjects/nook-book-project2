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
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/book/:title/:author', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/book.html'));
});

router.get('/featuredList', async (req, res) => {
  await FeaturedBooks.find()
    .then((featuredList) => {
      res.send(featuredList);
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
});

router.get('/books', async (req, res) => {
  await Books.find()
    .then((books) => {
      res.send(books);
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
});

router.get('/signin', function(req, res){
    res.sendFile(path.join(__dirname, '../views/signin.html'));
});

router.get('/contact', function(req, res){
    res.sendFile(path.join(__dirname, '../views/contact.html'));
});
router.get('/about', function(req, res){
    res.sendFile(path.join(__dirname, '../views/about.html'));
});

// Handle POST request to save user data Signin page
router.post('/', async function(req, res) {
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
