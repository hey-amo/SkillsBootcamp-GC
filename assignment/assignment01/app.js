// Assignment-01 using express
// Note: Requires Node/Express, EJS
const express = require("express");

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

// Parse JSON requests
app.use(express.json());

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

// Routes
app.get('/', (req, res) => {
    res.render('index', { movie });
});

app.use((req, res) => {
  res.status(404).send(`
    <h1>404 Not Found</h1>
    <p>The requested page <strong>${req.originalUrl}</strong> was not found on this server.</p>
  `);
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
