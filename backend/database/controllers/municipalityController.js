const Municipality = require('../models/municipalityModel');

/**
 * Retrieves a municipality based on the specified criteria.
 *
 * @param {string} municipalityToFind - The criteria to find the municipality (case-insensitive).
 * @returns {object|boolean} - Returns the found municipality object if successful, false if not found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getOneMunicipality(municipalityToFind){
	try {
		// Find a municipality based on the specified criteria (case-insensitive)
		const municipality = await Municipality.findOne({municipality: {$regex: municipalityToFind, $options: 'i'}});

		if(municipality){
			return municipality;
		} else {
			console.error('Municipality not found.');
			return false;
		}

	} catch (error) {
		console.error('Unexpected error retreiving the municipality: ', error);
		throw error;
	}
}

/**
 * Retrieves all municipalities from the Municipality collection.
 *
 * @returns {Array} - Returns an array of municipality objects if successful, an empty array if no municipalities found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getAllMunicipalities(){
	try {
		const municipalities = await Municipality.find({});

		if(municipalities.length === 0){
			console.warn('No municipalities found.');
		}

		return municipalities;

	} catch (error) {
		console.error('Unexpected error retreiving the list of municipalities: ', error);
		throw error;
	}
}

/**
 * Creates a new municipality if it does not already exist.
 *
 * @param {string} newMunicipality - The name of the new municipality to create.
 * @returns {boolean} - Returns true if the creation is successful, false if the municipality already exists.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function createOneMunicipality(newMunicipality){
	try{        
		const isExisting = await Municipality.findOne({ municipality: {$regex: newMunicipality, $options: 'i'} });

		if (!isExisting){
			await Municipality.create({ tag: newMunicipality });
			return true;
		} else {
			console.log('Municipality already exists.');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Municipality already exists. Duplicate key violation.');
			return false;
		} else {
			console.error('Unexpected error updating the municipality: ', error);
			throw error;
		}
	}
}

// TODO Update users to default municipality if theirs is deleted.
async function deleteOneMunicipality(municipalityToDelete){
	try {
		const result = await Municipality.deleteOne({ municipality: municipalityToDelete });
    
		if (result.deletedCount > 0){
			return true;
		} else {
			console.error('No matching municipalities to delete.');
			return false;
		}
	} catch (error) {
		console.error('Unexpected error deleting municipality: ', error);
		throw error;
	}
}

/**
 * Updates a municipality based on the current municipality value.
 *
 * @param {string} currentMunicipality - The current municipality value to identify the municipality for update.
 * @param {string} municipalityUpdateData - The new municipality value to set.
 * @returns {boolean} - Returns true if the update is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function updateMunicipality(currentMunicipality, municipalityUpdateData) {
	try{
		// Update the municipality based on the current municipality value
		const result = await Municipality.updateOne({ municipality: currentMunicipality }, { $set: { municipality: municipalityUpdateData }});

		if(result.n > 0){
			return true;
		} else {
			console.error('No matching municipalities to update.');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Update failed due to duplicate municipality value.');
			return false;
		} else {
			console.error('Unexpected error updating the municipality: ', error);
			throw error;
		}
	}
}

module.exports = { getOneMunicipality, getAllMunicipalities, createOneMunicipality, deleteOneMunicipality, updateMunicipality };