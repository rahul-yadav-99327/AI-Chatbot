const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGO_URI;
console.log("Testing connection to:", uri);

mongoose.connect(uri)
    .then(() => {
        console.log("SUCCESS: MongoDB is reachable and connected!");
        process.exit(0);
    })
    .catch(err => {
        console.error("FAILURE: Could not connect to MongoDB.");
        console.error("Error details:", err.message);
        process.exit(1);
    });
