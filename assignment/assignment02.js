// # Full Stack Skills Bootcamp - Gateshead College
//
// # Assignment - Part 02
//
// ## Requirement:
//
// On this Task, you must create a working database record 
// system, using any web-technology you feel comfortable with. 
// 
// Main features, will include adding, removing, deleting, 
// and searching (CRUD).  The main point of this task is to 
// demonstrate your capabilities of being a 
// Full Stack Developer. 
// 
// You can use the college examples we have been working 
// on, or even be creative and come up with your own design. 

//
// Author: AD

const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

// Parse JSON requests
app.use(express.json());

// ## Goal: Create TV/movie/radio show on a topic 
//   within a record format:

// ### Record format/structure:
// id (Integer)
// title (String)
// seasons (Integer)
// year (Integer)
// cast: (Integer)
// rating: (Integer)
// poster: (String)
// directors: (String)

// : Title, seasons, episodes, year, cast, type, 
//   rating, poster, and directors etc..
var recordFormat: {

};


// ## Feature: Display the data/record on web browser by using 
//    either node, express or EJS, remember you need to 
//    show an images & code listing to show it is working.


app.get('/show-record', (req, res) => {
    
});


app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});