// # Using express to write file locally
// 
const fs = require('fs');
const express = require("express");
const app = express();
const port = 3000;

let data = "Learning how to write to a file with node/express\n";

// GET: /write-file/ route 
app.get("/write-file", (req, res) => {
	    
    // Write data to a file
    fs.writeFile('output.txt', data, (err) => {
        if (err) throw err;
    });

    res.send("\nCompleted write");
});


console.log("Finished app");