// # Using express to write file locally
// 
const fs = require('fs');
const express = require("express");
const app = express();
const port = 3000;

// Simple route to write initial data (overwrite)
app.get('/write-file', (req, res) => {
    const data = "Learning how to write to a file with Node/Express\n";
    fs.writeFile('output.txt', data, (err) => {
        if (err) {
            console.error("Write error:", err);
            return res.status(500).send("Error writing file");
        }
        res.send("Initial data written");
    });
});

// Append a single new line to the file
app.post('/append-new-line', (req, res) => {
    const line = req.body.line || 'New line\n';
    fs.appendFile('output.txt', line + '\n', (err) => {
        if (err) {
            console.error("Append line error:", err);
            return res.status(500).send("Error appending line");
        }
        res.send("Line appended");
    });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});


console.log("Finished app");