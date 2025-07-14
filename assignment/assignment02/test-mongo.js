const { MongoClient } = require("mongodb");

console.log("Connecting...");

MongoClient.connect("mongodb://localhost:27017", { serverSelectionTimeoutMS: 5000 })
    .then(client => {
        console.log("✅ Connected to MongoDB");
        return client.close();
    })
    .then(() => {
        console.log("Connection closed");
        process.exit(0);
    })
    .catch(err => {
        console.error("❌ Connection failed:", err.message);
        process.exit(1);
    });