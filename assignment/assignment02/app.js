// Assignment02 - app.js
// Note: Requires Node/Express, EJS
//
const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('express').json;
const port = 3000;
const url = 'mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'moviesdb';               // Database name

// Parse JSON requests
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Failed to connect to MongoDB', err);
        return;
    }

    db = client.db(dbName);
    console.log('Connected to MongoDB');
});

// Simple route to test server
app.get('/', (req, res) => {
    res.send('Simple Movie API is running');
});


// # App running
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});