const mongoose = require('mongoose');
require("dotenv").config();

async function connectToDatabase() {
    try {
        // Replace 'your_database_uri' with the actual URI of your MongoDB database, including the database name
        const databaseUri = process.env.MONGO_URL + process.env.DATABASE;

        const db = mongoose.connection;
        
        db.on('error', (error) => {
            console.error('MongoDB connection error:', error);
        });
        
        db.once('open', () => {
            console.log('Connected to MongoDB database:', db.name);
        });
        
        // Optional: Listen for the Node process to close and close the Mongoose connection
        process.on('SIGINT', () => {
            db.close();
        });

        await mongoose.connect(databaseUri);
        
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };
