const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();

// Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/nookbook', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

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

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../views/signin.html'));
});

router.get('/contact', function(req, res){
    res.sendFile(path.join(__dirname, '../views/contact.html'));
});

// Handle POST request to save user data Signin page
router.post('/', async function(req, res) {
  try {
    // Create a new user instance
    const newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    await newUser.save();
    res.redirect('/contact');
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).send('Error saving user data');
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
