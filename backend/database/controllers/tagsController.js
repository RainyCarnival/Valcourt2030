const { default: mongoose, Error } = require('mongoose');
const Tag = require('../models/tagsModel');
const { getAllUsers, updateOneUser } = require('./userController');
const { createOneMailingList, deleteOneMailingList } = require('./mailingListController');
const { getAllEvents, updateOneEvent } = require('./eventsController');

/**
 * Retrieves a tag based on the specified criteria.
 *
 * @param {object} tagToFind - Criteria to find the tag in the Tag collection.
 * @returns {object|boolean} - Returns the found tag object if successful, false if not found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getOneTag(tagToFind){
	try {
		const tag = await Tag.findOne({tag: {$regex: tagToFind, $options: 'i'} });

		if(!tag){
			console.error('Tag not found.');
		}

		return tag;

	} catch (error) {
		console.error('Unexpected error retreiving the tag: ', error);
	}
}

/**
 * Retrieves all tags from the Tag collection.
 *
 * @returns {Array} - Returns an array of tag objects if successful, an empty array if no tags found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getAllTags(){
	try {
		const tags = await Tag.find({});

		if(tags.length === 0){
			console.error('No tags found.');
		}

		return tags;

	} catch (error) {
		console.error('Unexpected error retreiving the list of tags: ', error);
	}
}

/**
 * Creates a new tag in the system.
 *
 * @param {string} newTag - The name of the new tag to be created.
 * @returns {boolean} - Returns true if the tag creation process is successful, otherwise returns false.
 * @throws {Error} - Throws an error with the message 'Creation Error: Tag already exists.' if the tag already exists in the system.
 *                   Throws an error with the message 'Creation Error: Failed to create tag.' if the tag creation process fails.
 *                   Throws an error with the message 'Creation Error: Failed to create mailing list for the new tag.' if the mailing list creation process fails.
 *                   Logs unexpected errors encountered during the process.
 */
async function createOneTag(newTag){
	const session = await mongoose.startSession();
	session.startTransaction();

	try{        
		const isExisting = await Tag.findOne({ tag: {$regex: newTag, $options: 'i'} });

		if (isExisting){
			throw new Error('Creation Error: Tag already exists.');
		}

		const createdTag = await Tag.create({ tag: newTag });

		if (!createdTag) {
			throw new Error('Creation Error: Failed to create tag.');
		}
		
		const createdMailingList = await createOneMailingList(createdTag._id);

		if (!createdMailingList) {
			throw new Error('Creation Error: Failed to create mailing list.');
		}

		session.commitTransaction();
		return {
			status: true
		}
	} catch (error) {
		session.abortTransaction();

		if (error.message.startsWith('Creation Error')) {
			console.error(error);
		} else {
			console.error('Unexpected error creating tag: ', error);
		}

		return {
			status: false,
			message: error.message
		}
	} finally {
		session.endSession();
	}
}

/**
 * Updates a tag based on the current tag value.
 *
 * @param {string} currentTag - The current tag value to identify the tag for update.
 * @param {string} newTag - The new tag value to set.
 * @returns {boolean} - Returns true if the update is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function updateOneTag(currentTag, newTag) {
	try{
		const dupe = await Tag.findOne({ tag: newTag});

		if (dupe){
			throw new Error('Update Error: New tag already exists.');
		}
		
		// Update the tag based on the current tag value
		const result = await Tag.updateOne({ tag: currentTag }, { $set: { tag: newTag }});

		if(result.modifiedCount <= 0){
			throw new Error('Update Error: No modifications made.');
		}

		return true;

	} catch (error) {
		if (error.message.startsWith('Update Error')){
			console.error(error);
		} else {
			console.error('Unexpected error updating the tag: ', error);
		}
		return false;
	}
}

/**
 * Deletes a tag from the database and updates associated user data and mailing lists.
 * @param {string} tagIdToDelete - The ID of the tag to delete.
 * @returns {Promise<boolean>} A Promise that resolves to true if the tag is successfully deleted,
 * or false if there is an error during the deletion process.
 */
async function deleteOneTag(tagIdToDelete){
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		if (!await Tag.findOne({ _id: tagIdToDelete })){
			throw new Error('Deletion Error: Failed to find the tag to delete.');
		}

		// Handle updating the users.
		let users = await getAllUsers();

		users = users.filter(user => {
			if (user.interestedTags.some(tagObject => tagObject._id.toString() === tagIdToDelete.toString())) {
				user.interestedTags = user.interestedTags.filter(tagObj => tagObj._id.toString() !== tagIdToDelete.toString());
				return true;
			}
		});

		if (users.length > 0){
			for (const user of users){
				const usersResult = await updateOneUser(user.email, {interestedTags: user.interestedTags});

				if (!usersResult){
					throw new Error('Deletion Error: Failed to remove tag from users.');
				}
			}
		}

		// Handle updating the events.
		let events = await getAllEvents();

		events = events.filter(event => {
			if (event.tags.some(tagObj => tagObj._id.toString() === tagIdToDelete.toString())) {
				event.tags = event.tags.filter(tagObj => tagObj._id.toString() !== tagIdToDelete.toString());
				return true;
			}
		});

		if (events.length > 0){
			for (const event of events){
				const eventsResult = await updateOneEvent(event.eventId, event);
				
				if (!eventsResult){
					throw new Error('Deletion Error: Failed to remove tag from events.');
				}
			}
		}

		// Handle deleting the mailing list.
		const mailingListResult = await deleteOneMailingList(tagIdToDelete);

		if (!mailingListResult){
			throw new Error('Deletion Error: Failed to delete the corresponding mailing list.');
		}

		// Handle deleting the tag.
		const tagResult = await Tag.deleteOne({ _id: tagIdToDelete });
    
		if (tagResult.deletedCount === 0){
			throw new Error('Deletion Error: Failed to delete the tag.');
		}

		session.commitTransaction();
		return true;
	} catch (error) {
		session.abortTransaction();

		if(error.message.startsWith('Deletion Error')){
			console.error(error);
		} else {
			console.error('Unexpected error deleting tag.');
		}
		return false;
	} finally {
		session.endSession();
	}
}

module.exports = { getOneTag, getAllTags, createOneTag, deleteOneTag, updateOneTag };