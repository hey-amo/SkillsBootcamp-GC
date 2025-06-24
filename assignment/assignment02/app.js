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
const path = require("path");

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON requests and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

// Connect to MongoDB and start server
async function startServer() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        
        // Start the server only after database connection is established
        app.listen(port, () => {
            console.log(`App running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}



// Initialize everything
startServer();

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

// HOME - Show HTML page with all movies
app.get('/', async (req, res) => {
    try {
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

// CREATE - Insert a new movie (handles both JSON and form data)
app.post('/movies', async (req, res) => {
    try {
        const movie = req.body;
        
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

// READ - Get a single movie by ID (JSON API)
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

// READ - Get a single movie by ID (HTML view)
app.get('/movie/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.redirect('/?error=Invalid movie ID format');
        }
        
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
        
        if (!movie) {
            return res.redirect('/?error=Movie not found');
        }
        
        res.render('movie-details', { movie: movie });
    } catch (error) {
        res.redirect('/?error=' + error.message);
    }
});

// GET - Show edit form for a movie
app.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.redirect('/?error=Invalid movie ID format');
        }
        
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
        
        if (!movie) {
            return res.redirect('/?error=Movie not found');
        }
        
        res.render('edit-movie', { movie: movie });
    } catch (error) {
        res.redirect('/?error=' + error.message);
    }
});

// POST - Handle edit form submission
app.post('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        
        // Check if ID is valid ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.redirect('/?error=Invalid movie ID format');
        }
        
        // Convert cast string to array if it exists
        if (updates.cast && typeof updates.cast === 'string') {
            updates.cast = updates.cast.split(',').map(actor => actor.trim()).filter(actor => actor.length > 0);
        }
        
        // Remove empty fields
        Object.keys(updates).forEach(key => {
            if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
                delete updates[key];
            }
        });
        
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );
        
        if (result.matchedCount === 0) {
            return res.redirect('/?error=Movie not found');
        }
        
        res.redirect('/movie/' + id + '?success=Movie updated successfully');
    } catch (error) {
        res.redirect('/?error=' + error.message);
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

// Route to insert 1 sample movie for testing
app.get('/insert-sample-movie', async (req, res) => {
    try {
        const result = await db.collection('movies').insertOne(sampleMovie);
        res.redirect('/'); // Redirect to home page 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE - Delete a movie by ID
app.get('/delete/:id', async (req, res) => {
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
    
        
        // res.json({
        //     message: 'Movie deleted successfully',
        //     deletedCount: result.deletedCount
        // });
        let msg = "Movie deleted successfully"

         res.redirect('/?success=' + msg);
         //res.redirect('/'); // Redirect to home page 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Initialize everything
startServer();