const { error } = require('console');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();
router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../views/signin.html'));
});
router.get('/contact', function(req, res){
    res.sendFile(path.join(__dirname, '../views/contact.html'));
});
module.exports = router;