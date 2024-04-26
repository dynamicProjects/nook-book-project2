require('dotenv').config();
const mongoose = require('mongoose');

require('./models/Books');
require('./models/featuredBooks');
require('./models/wishlist');
const app = require('./app');

const server = app.listen(3000, function() {
    console.log(`Express is running on port ${server.address().port}`);
});