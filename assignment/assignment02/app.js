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


// Movie Record
const movie = {
    title: "Batman Begins",
    year: 2005,
    type: "Movie",
    seasons: null,
    episodes: null,
    director: "Christopher Nolan",
    imdbRating: "8.2",
    poster: "https://m.media-amazon.com/images/M/MV5BODIyMDdhNTgtNDlmOC00MjUxLWE2NDItODA5MTdkNzY3ZTdhXkEyXkFqcGc@._V1_SX300.jpg",
    cast: [
        "Christian Bale",
        "Michael Caine",
        "Liam Neeson",
        "Katie Holmes",
        "Gary Oldman"
    ]
};



// # GET - Read:: List all movies
app.get('/', (req, res) => {
    res.send('Simple Movie API is running');

    // List all movies from the movie db
});

// # PUT - Create:: movie
app.post('/insert-movie/', (req, res) => {
    // Insert a movie
});

// # GET - Read:: Single a movie
app.post('/read-movie/{id}', (req, res) => {
    // Find a movie that matches the ID, if any
});


// # PUT - Update:: Update a single movie
app.post('/update-movie/{id}', (req, res) => {
    // Find a movie that matches the ID, if any
});

// # GET - Delete:: Delete a single movie 
app.get('/delete-movie/{id}', (req, res) => {
    // Find a movie that matches the ID, then delete it, if it exists
});



// # App running
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});