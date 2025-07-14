// database.js - Promise-based MongoDB connection
const { MongoClient } = require("mongodb");

const url = 'mongodb://localhost:27017';
const dbName = 'moviesdb';

let db;

function connectToDatabase() {
    console.log("Connecting to MongoDB...");
    
    return MongoClient.connect(url, { serverSelectionTimeoutMS: 5000 })
        .then(client => {
            db = client.db(dbName);
            console.log("[X] Connected to MongoDB");
            return db;
        })
        .catch(err => {
            console.error("Failed to connect to MongoDB:", err.message);
            process.exit(1);
        });
}

function getDatabase() {
    return db;
}

module.exports = {
    connectToDatabase,
    getDatabase
};