const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Method to connect to the MongoDB database.
 * 
 * @returns {boolean} Returns false if the MONGO_URL and DATABASE are not specified.
 */
async function connectToDatabase() {
	try {
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

		if(!process.env.MONGO_URL){
			console.log('No MONGO_URL set in the .env file.');
			return false;
		}

		if(!process.env.DATABASE){
			console.log('No DATABASE set in the .env file.');
			return false;
		}

		const databaseUri = process.env.MONGO_URL + process.env.DATABASE;

		await mongoose.connect(databaseUri);
        
	} catch (error) {
		console.error('Error connecting to the database:', error);
		throw error;
	}
}

module.exports = { connectToDatabase };
