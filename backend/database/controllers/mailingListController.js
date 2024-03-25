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
		const isExisting = await MailingList.findOne({ tag: mailingTagId });

		// If no existing mailing list, create a new one
		if (isExisting){
			throw new Error('Creation Error: Mailing list already exists');
		}
		
		const result = await MailingList.create({ tag: mailingTagId});
		
		if (!result) {
			throw new Error('Creation Error: Failed to create mailing list.');
		}
		
		return true;

	} catch (error) {
		if (error.message.startsWith('Creation Error')) {
			console.error(error);
		} else {
			console.error(`Unexpected error creating mailing list: ${error}`);
		}
		return false;
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
			throw new Error('Update Error: No matching mailing list found.');
		}

		// Perform the specified action (add or remove) on the mailing list
		switch (action) {
		case 'add':
			if (existingMailingList.users.includes(userId)){
				console.error('User already in mailing list');
				break;
			}

			existingMailingList.users.push(userId);
			break;
		case 'remove':
			if (!existingMailingList.users.includes(userId)){
				console.error('User not found in mailing list');
				break;
			}
			
			existingMailingList.users = existingMailingList.users.filter(user => !user.equals(userId));
			break;
		default:
			throw new Error('Update Error: Invalid action specified');
		}

		const result = await MailingList.updateOne({_id: existingMailingList._id}, {$set: existingMailingList});
		
		if(!result){
			throw new Error('Update Error: Failed to save updated information.');
		}

		return true;

	} catch (error) {
		if(error.message.startsWith('Update Error')){
			console.error(error);
		} else {
			console.error(`An unexpected error occured updating the mailing list: ${error}`);
		}

		return false;
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
		const mailingList = await MailingList.findOne({tag: mailingTagId});

		if (mailingList){
			return mailingList;
		} else {
			console.error('Mailing list not found.');
		}
	} catch (error) {
		console.error(`An unexpected error occured getting the mailing list: ${error}`);
	}
}

/**
 * Deletes a mailing list based on the specified tag.
 *
 * @param {string} tagId - The tag identifier for the mailing list.
 * @returns {boolean} - Returns true if the deletion is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function deleteOneMailingList(tagId){
	try {
		// Perform the deletion of the mailing list based on the specified tag
		const result = await MailingList.deleteOne({ tag: tagId });
		if (result.deletedCount === 0){
			throw new Error('Deletion Error: No matching mailing list to delete.');
		}

		return true;

	} catch (error) {
		if(error.message.startsWith('Deletion Error')){
			console.error(error);
		} else {
			console.error(`An unexpected error occured deleting the mailing list: ${error}`);
		}

		return false;
	}
}

module.exports = { createOneMailingList, updateOneMailingList, getOneMailingList, deleteOneMailingList };