// test-mongo.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'moviesdb';

async function testConnection() {
    console.log("🔌 Attempting async connection to MongoDB...");

    const client = new MongoClient(url, {
        serverSelectionTimeoutMS: 5000, // Fail fast if cannot connect
    });

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(dbName);
        const collections = await db.collections();

        console.log(`📦 '${dbName}' contains ${collections.length} collections.`);
        if (collections.length > 0) {
            collections.forEach(col => console.log(`- ${col.collectionName}`));
        }

    } catch (err) {
        console.error("❌ Connection failed:", err.message);
    } finally {
        await client.close();
        console.log("🔒 MongoDB connection closed");
    }
}

testConnection();