// Assignment02 - app.js
// Note: Requires Node/Express, MongoDB
//
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { connectToDatabase, getDatabase } = require('./database');

const path = require("path");

const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'moviesdb';               // Database name

// Setup app 
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect MongoDB and start server
console.log("Connecting to MongoDB...");
connectToDatabase()
    .then(() => {
        app.listen(port, function () {
            console.log(`App running on http://localhost:${port}`);
        });
    });


/*

MongoClient.connect(url, { serverSelectionTimeoutMS: 5000 }, function (err, client) {
    if (err) {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }

    db = client.db(dbName);
    console.log("[X] Connected to MongoDB");

    app.listen(port, function () {
        console.log(`App running on http://localhost:${port}`);
    });
});*/


// -----------

// INSERT/CREATE - 1 Sample movie for testing
app.get("/insert-sample-movie", function (req, res) {
    console.log("Inserting sample movie...");
    
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
    
    getDatabase().collection("movies").insertOne(sampleMovie)
        .then(result => {
            console.log("Sample movie inserted with ID:", result.insertedId);
            res.redirect(`/?success=Sample movie inserted successfully with ID: ${result.insertedId}`);
        })
        .catch(err => {
            console.log("Error inserting sample movie:", err.message);
            res.status(500).json({ error: err.message });
        });
});


// INSERT/CREATE - Handle form submission for new movie
app.post("/create", function (req, res) {
    let newMovie = req.body;
    console.log("Adding new movie:", newMovie.title);
    
    // Convert cast to array if needed
    if (newMovie.cast && typeof newMovie.cast === "string") {
        newMovie.cast = newMovie.cast
            .split(",")
            .map(actor => actor.trim())
            .filter(actor => actor.length > 0);
    }

    // Remove empty fields
    Object.keys(newMovie).forEach(key => {
        if (newMovie[key] === "" || newMovie[key] === null || newMovie[key] === undefined) {
            delete newMovie[key];
        }
    });

    console.log("New movie data:", newMovie);

    getDatabase().collection("movies").insertOne(newMovie)
        .then(result => {
            console.log("New movie added with ID:", result.insertedId);
            res.redirect(`/?success=Movie-added-successfully`);
        })
        .catch(err => {
            console.log("Error adding new movie:", err.message);
            res.redirect("/?error=" + encodeURIComponent(err.message));
        });
});


// LIST - List all movies (Home page)
app.get("/", function (req, res) {
    console.log("list all movies ...");
    
    getDatabase().collection("movies").find({}).toArray()
        .then(movies => {
            console.log(`Found ${movies.length} movies`);
            res.render("movies", { movies: movies, count: movies.length });
        })
        .catch(err => {
            console.log("Error finding movies:", err.message);
            res.render("movies", { movies: [], count: 0, error: err.message });
        });
});

// -----------

// READ - Get all movies
app.get("/movies", function (req, res) {
    console.log("list all movies ...");
    
    getDatabase().collection("movies").find({}).toArray()
        .then(movies => {
            console.log(`Found ${movies.length} movies`);
            res.render("movies", { movies: movies, count: movies.length });
        })
        .catch(err => {
            console.log("Error finding movies:", err.message);
            res.render("movies", { movies: [], count: 0, error: err.message });
        });
});

// -----------


// READ - View Details: Get single movie by ID
app.get("/movies/:id", function (req, res) {
    const id = req.params.id;
    console.log(`Looking for movie with ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
        console.log("Invalid ID format");
        return res.status(400).json({ error: "Invalid movie ID format" });
    }

    getDatabase().collection("movies").findOne({ _id: new ObjectId(id) })
        .then(movie => {
            if (!movie) {
                console.log("Movie not found");
                return res.status(404).json({ error: "Movie not found" });
            }
            console.log("Movie found:", movie.title);
            res.render('movie-details', { movie: movie })
        })
        .catch(err => {
            console.log("Error finding movie:", err.message);
            res.status(500).json({ error: err.message });
        });
});


// EDIT - Get movie by ID for editing (populate form)
app.get("/edit/:id", function (req, res) {
    const id = req.params.id;
    console.log(`Loading edit form for movie ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
        console.log("Invalid ID format");
        return res.redirect("/?error=Invalid-movie-ID-format");
    }

    getDatabase().collection("movies").findOne({ _id: new ObjectId(id) })
        .then(movie => {
            if (!movie) {
                console.log("Movie not found for editing");
                return res.redirect("/?error=Movie-not-found");
            }
            console.log("Movie found for editing:", movie.title);
            res.render("edit-movie", { movie: movie });
        })
        .catch(err => {
            console.log("Error loading movie for editing:", err.message);
            res.redirect("/?error=" + encodeURIComponent(err.message));
        });
});


// EDIT - Handle form submission for movie updates
app.post("/edit/:id", function (req, res) {
    const id = req.params.id;
    let updates = req.body;
    console.log(`Updating movie ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
        console.log("Invalid ID format");
        return res.redirect("/?error=Invalid-movie-ID-format");
    }
    // Convert cast to array if needed
    if (updates.cast && typeof updates.cast === "string") {
        updates.cast = updates.cast
            .split(",")
            .map(actor => actor.trim())
            .filter(actor => actor.length > 0);
    }

    // Remove empty fields
    Object.keys(updates).forEach(key => {
        if (updates[key] === "" || updates[key] === null || updates[key] === undefined) {
            delete updates[key];
        }
    });

    console.log("Making updates to apply:", updates);

    getDatabase().collection("movies").updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
        )
    .then(result => {
        if (result.matchedCount === 0) {
            console.log("Movie not found for update");
            return res.redirect("/?error=Movie-not-found");
        }
        console.log("Movie updated successfully");
        res.redirect(`/?success=Movie-updated-successfully`);
    })
    .catch(err => {
        console.log("Error updating movie:", err.message);
        res.redirect("/?error=" + encodeURIComponent(err.message));
    });
});

// -----------

// DELETE - movie by ID
app.get("/delete/:id", function (req, res) {
    const id = req.params.id;
    console.log(`Deleting movie with ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
        console.log("Invalid ID format");
        //return res.status(400).json({ error: "Invalid movie ID format" });
        err.message = 'Invalid movie ID';
        res.redirect("/?error=" + encodeURIComponent(err.message));
    }

    getDatabase().collection("movies").deleteOne({ _id: new ObjectId(id) })
        .then(result => {
            if (result.deletedCount === 0) {
                console.log("Movie not found for deletion");
                //return res.status(404).json({ error: "Movie not found" });
                err.message = "Movie not found";
                res.redirect("/?error=" + encodeURIComponent(err.message));
            }
            console.log("Movie deleted successfully");
            res.redirect("/?success=Movie deleted successfully");
        })
        .catch(err => {
            console.log("Error deleting movie:", err.message);
            //res.status(500).json({ error: err.message });
            res.redirect("/?error=" + encodeURIComponent(err.message));
        });
});

// -----------
