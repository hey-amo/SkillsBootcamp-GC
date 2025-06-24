// Assignment02 - app.js
// Note: Requires Node/Express, MongoDB
//
const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const port = 3000;
const url = 'mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'moviesdb';               // Database name


// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let db;

// Connect to MongoDB (modern async/await version)
async function connectToMongoDB() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

// Initialize database connection
connectToMongoDB();

// Movie Record Structure (example)
const sampleMovie = {
    title: "Batman Begins",
    year: 2005,
    type: "Movie",
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

// Debug route to see all movies
app.get('/debug/movies', async (req, res) => {
    try {
        const movies = await db.collection('movies').find({}).toArray();
        res.json({
            count: movies.length,
            movies: movies
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// HOME - Show all movies
app.get('/', (req, res) => {    
     try {
        console.log('Simple Movie API is running');
        const movies = await db.collection('movies').find({}).toArray();
        res.render('movies', { 
            movies: movies,
            count: movies.length 
        });
    } catch (error) {
        res.render('movies', { 
            movies: [],
            count: 0,
            error: error.message 
        });
    }
});

// CREATE - Insert a new movie
app.post('/movies', async (req, res) => {
     const movie = req.body;
    try {
        // Convert cast string to array if it exists
        if (movie.cast && typeof movie.cast === 'string') {
            movie.cast = movie.cast.split(',').map(actor => actor.trim());
        }
        
        const result = await db.collection('movies').insertOne(movie);
        
        // If request came from HTML form, redirect back to home page
        if (req.get('Content-Type') && req.get('Content-Type').includes('application/x-www-form-urlencoded')) {
            res.redirect('/');
        } else {
            // JSON API response
            res.status(201).json({
                message: 'Movie created successfully',
                id: result.insertedId,
                movie: movie
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await db.collection('movies').find({}).toArray();
        res.json({
            count: movies.length,
            movies: movies
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// READ - Get a single movie by ID
app.get('/movies/:id', async (req, res) => {
     try {
        const id = req.params.id;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid movie ID format' });
        }
        
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
        
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE - Update a movie by ID
app.put('/movies/:id', async (req, res) => {
   try {
        const id = req.params.id;
        const updates = req.body;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid movie ID format' });
        }
        
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({
            message: 'Movie updated successfully',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Delete a movie by ID
app.delete('/movies/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid movie ID format' });
        }
        
        const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        
        res.json({
            message: 'Movie deleted successfully',
            deletedCount: result.deletedCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to insert sample movie for testing
app.post('/sample-movie-insert', async (req, res) => {
    try {
        const result = await db.collection('movies').insertOne(sampleMovie);
        res.redirect('/'); // Redirect to home page after adding
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/sample-movie-insert', async (req, res) => {
    try {
        const result = await db.collection('movies').insertOne(sampleMovie);
        res.redirect('/'); // Redirect to home page after adding
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// App running
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});