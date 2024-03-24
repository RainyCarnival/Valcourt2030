const { default: mongoose } = require('mongoose');
const Municipality = require('../models/municipalityModel');
const { globalDefaultMunicipality } = require('../../globals');

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
		
		if(!municipality && municipalityToFind.toLowerCase() === globalDefaultMunicipality.toLowerCase()){
			// Create default Municipality if it does not exist.
			const defaultMunitcipality = await Municipality.create({municipality: globalDefaultMunicipality});
			
			if (!defaultMunitcipality){
				throw new Error('Create Error: Failed to create default municipality.');
			}
			
			return defaultMunitcipality;

		} else if (!municipality) {
			throw new Error('Get Error: Municipality not found.');
		}

		return municipality;

	} catch (error) {
		if(error.message.startsWith('Get Error') || error.message.startsWith('Create Error')){
			console.error(error);
		} else {
			console.error(`Unexpected error retreiving the municipality: ${error}`);
		}

		return false;
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
			console.error('No municipalities found.');
		}

		return municipalities;

	} catch (error) {
		console.error('Unexpected error retreiving the list of municipalities: ', error);
		return false;
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

		if (isExisting){
			throw new Error('Create Error: Municipality already exists.');
		}

		const result = await Municipality.create({ municipality: newMunicipality });

		if (!result) {
			throw new Error('Create Error: Failed to create municipality');
		}

		return true;

	} catch (error) {
		if (error.message.startsWith('Create Error')) {
			console.error(error);
		} else {
			console.error(`Unexpected error updating the municipality: ${error}`);
		}
		return false;
	}
}

/**
 * Asynchronously deletes a municipality and updates associated users with a new municipality.
 *
 * @param {string} municipalityToDelete - The name of the municipality to delete.
 * @returns {Promise<boolean>} A Promise that resolves to true if the deletion is successful, false otherwise.
 */
async function deleteOneMunicipality(municipalityToDelete){
	const { getAllUsers, updateOneUser } = require('./userController');
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (municipalityToDelete.toLowerCase() === globalDefaultMunicipality.toLowerCase()){
			throw new Error('Deletion Error: Cannot delete default Municipality.');
		}
		const deletedMunicipality = await Municipality.findOneAndDelete({ municipality: municipalityToDelete });
    
		if (!deletedMunicipality){
			throw new Error('Deletion Error: Could not find municipality to delete.');
		}

		const users = await getAllUsers();

		// Filter users associated with the deleted municipality
		const usersToUpdate = users.filter(user => user.municipality === null);

		// Update users with the default municipality
		if (usersToUpdate.length > 0){
			let newMunicipality = await Municipality.findOne({municipality: globalDefaultMunicipality});

			if (!newMunicipality){
				newMunicipality = await Municipality.create({municipality: globalDefaultMunicipality});
			}

			for (const user of usersToUpdate){
				const updatedUserResult = await updateOneUser(user.email, {municipality: newMunicipality});

				if (!updatedUserResult){
					throw new Error(`Deletion Error: Failed to update the municipality of user: ${user.email}`);
				}
			}
		}

		session.commitTransaction();
		return true;

	} catch (error) {
		session.abortTransaction();
		if (error.message.startsWith('Deletion Error')){
			console.error(error);
		} else {
			console.error('Unexpected error deleting municipality: ', error);
		}

		return false;
	} finally {
		session.endSession();
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
		
		if(result.modifiedCount <= 0){
			throw new Error('Update Error: No matching municipality to update.');
		} 

		return true;
	} catch (error) {
		if (error.message.startsWith('Update Error')) {
			console.error(error);
		} else {
			console.error(`Unexpected error updating the municipality: ${error}`);
		}
		
		return false;
	}
}

module.exports = { getOneMunicipality, getAllMunicipalities, createOneMunicipality, deleteOneMunicipality, updateMunicipality };