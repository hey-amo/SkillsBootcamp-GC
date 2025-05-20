// # Using express to write file locally
// 
const fs = require('fs');
const express = require("express");
const app = express();
const port = 3000;

// Parse JSON requests
app.use(express.json());

// Simple route to write initial data (overwrite)
app.get('/write-file', (req, res) => {
    const data = "Learning how to write to a file with Node/Express\n";
    fs.writeFile('output.txt', data, (err) => {
        if (err) {
            console.error("Write error:", err);
            return res.status(500).send("Error writing file");
        }
        res.send("Wrote to file");
    });
});

// Append a single new line to the file
app.get('/append', (req, res) => {
    const line = req.body.line || 'New line';
    fs.appendFile('output.txt', line + '\n', (err) => {
        if (err) {
            console.error("Append line error:", err);
            return res.status(500).send("Error appending line");
        }
        res.send("Appended to file");
    });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});

console.log("Finished app");