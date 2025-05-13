// write-to-file.js
//
// The fs module in JavaScript, interacts with the 
// file system, enabling you to read, write, update, 
// and delete files and directories
const fs = require('fs');

let data = "Learning how to write to a file";

// Write data to a file
fs.writeFile('output.txt', data, (err) => {
    if (err) throw err;
});

console.log("Finished writing");