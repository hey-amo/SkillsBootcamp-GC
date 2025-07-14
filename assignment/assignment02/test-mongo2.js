
const { MongoClient } = require('mongodb');

// MongoDB connection URL - adjust as needed
const url = 'mongodb://localhost:27017';
const dbName = 'myapp';

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected successfully to MongoDB server');
    
    // Get database reference
    const db = client.db(dbName);
    
    // Example: Insert a document
    const collection = db.collection('users');
    
    return collection.insertOne({
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date()
    });
  })
  .then(result => {
    console.log('Document inserted:', result.insertedId);
    
    // Example: Find documents
    const collection = client.db(dbName).collection('users');
    return collection.find({}).toArray();
  })
  .then(documents => {
    console.log('Found documents:', documents);
  })
  .catch(error => {
    console.error('Error:', error);
  })
  .finally(() => {
    // Close the connection
    client.close()
      .then(() => {
        console.log('MongoDB connection closed');
      })
      .catch(err => {
        console.error('Error closing connection:', err);
      });
  });

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Closing MongoDB connection...');
  client.close()
    .then(() => {
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    })
    .catch(err => {
      console.error('Error closing connection:', err);
      process.exit(1);
    });
});
