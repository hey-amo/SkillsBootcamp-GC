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

// # POST - Create 1 movie
// app.post('/movies/', (req, res) => {
//     const movie = req.body;

//     if (!movie.title) {
//         return req
//     }

//     db.collection('movies').insertOne(movie, (err, result) => {
//         if (err) {
//             console.error("Error adding movie - " err);
//             return res.status(500).send("error adding movie");
//         }

//         res.status(201).send("Movie added");
//     });
// });

// // # POST - Update single movie, with given ID
// app.post('movies/update/:id', (req, res) => {

// });

// // # GET - Get all movies, limit 20
// app.get('/movies/', (req, res) => {

// });

// // # GET - Single movie using ID
// app.get('/movies/movie/:id', (req, res) => {

// });

// # App running
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});