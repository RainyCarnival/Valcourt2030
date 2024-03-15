const MailingList = require('../models/mailingListModel');

/**
 * Creates a new mailing list entry with the specified tag.
 *
 * @param {string} mailingTagId - The tag identifier for the mailing list.
 * @returns {boolean} - Returns true if the creation is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function createOneMailingList(mailingTagId){
	try {
		const isExisting = await MailingList.findOne({ tag: {$regex: mailingTagId, $options: 'i'} });

		// If no existing mailing list, create a new one
		if (!isExisting){
			await MailingList.create({ tag: mailingTagId});
			return true;
		} else {
			console.error('Mailing list already exists');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Mailing list already exists. Duplicate key violation.');
			return false;
		} else {
			console.error('Unexpected error creating mailing list: ', error);
			throw error;
		}
	}
}

/**
 * Updates a mailing list based on the specified action (add or remove) for a user.
 *
 * @param {string} tagId - The tag identifier for the mailing list.
 * @param {string} action - The action to perform on the mailing list (add or remove).
 * @param {string} userId - The identifier of the user to add or remove from the mailing list.
 * @returns {boolean} - Returns true if the update is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function updateOneMailingList(tagId, action, userId){
	try{
		const existingMailingList = await MailingList.findOne({ tag: tagId });

		if (!existingMailingList){
			console.error('No matching mailing list found.');
			return false;
		}

		// Perform the specified action (add or remove) on the mailing list
		switch (action) {
		case 'add':
			if (existingMailingList.users.includes(userId)){
				console.error('User already in mailing list');
				return true;
			}

			existingMailingList.users.push(userId);
			break;
		case 'remove':
			if (!existingMailingList.users.includes(userId)){
				console.error('User not found in mailing list');
				return true;
			}
			
			existingMailingList.users = existingMailingList.users.filter(user => !user.equals(userId));

			break;
		default:
			console.error('Invalid action specified');
			return false;
		}

		const result = await existingMailingList.save();

		if(result){
			return true;
		} else {
			console.error('No modifications were made to the mailing list.');
			return false;
		}
	} catch (error) {
		console.error('An unexpected error occured updating the mailing list: ', error);
		throw error;
	}
}

/**
 * Retrieves a mailing list based on the specified tag and populates associated fields.
 *
 * @param {string} mailingTagId - The tag identifier for the mailing list.
 * @returns {object|boolean} - Returns the found mailing list object if successful, false if not found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getOneMailingList(mailingTagId){
	try {
		// Find a mailing list based on the specified tag and populate associated fields
		const mailingList = await MailingList.findOne(mailingTagId).populate(['tag', 'users']);

		if (mailingList){
			return mailingList;
		} else {
			console.error('Mailing list not found.');
		}
	} catch (error) {
		console.error('An unexpected error occured getting the mailing list: ', error);
		throw error;
	}
}

/**
 * Deletes a mailing list based on the specified tag.
 *
 * @param {string} mailingTagId - The tag identifier for the mailing list.
 * @returns {boolean} - Returns true if the deletion is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function deleteOneMailingList(mailingTagId){
	try {
		// Perform the deletion of the mailing list based on the specified tag
		const result = await MailingList.deleteOne(mailingTagId);

		if (result.deletedCount > 0){
			return true;
		} else {
			console.error('No mathing mailing list to delete.');
			return false;
		}
	} catch (error) {
		console.error('An unexpected error occured deleting the mailing list: ', error);
		throw error;
	}
}

module.exports = { createOneMailingList, updateOneMailingList, getOneMailingList, deleteOneMailingList };