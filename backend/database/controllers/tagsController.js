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
		const tag = await Tag.findOne(tagToFind);

		if(tag){
			return tag;
		} else {
			console.error('Tag not found.');
			return false;
		}

	} catch (error) {
		console.error('Unexpected error retreiving the tag: ', error);
		throw error;
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
			console.warn('No tags found.');
		}

		return tags;

	} catch (error) {
		console.error('Unexpected error retreiving the list of tags: ', error);
		throw error;
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
		
		const result = await createOneMailingList(createdTag._id);

		if (!result) {
			throw new Error('Creation Error: Failed to create mailing list for the new tag.');
		}

		session.commitTransaction();
		return true;
	} catch (error) {
		session.abortTransaction();

		if (error.message.startsWith('Creation Error')) {
			console.error(error);
		} else {
			console.error('Unexpected error creating tag: ', error);
		}

		return false;
	} finally {
		session.endSession();
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

		if (!users) {
			throw new Error('Deletion Error: Failed to get all the users.');
		}

		users = users.filter(user => {
			if (user.interestedTags.some(tagObj => tagObj._id.toString() === tagIdToDelete.toString())) {
				user.interestedTags = user.interestedTags.filter(tagObj => tagObj._id.toString() !== tagIdToDelete.toString());
				return true;
			}

			return false;
		});

		if (users.length > 0){
			for (const user of users){
				const usersResult = await updateOneUser(user.email, user);
				
				if (!usersResult){
					throw new Error('Deletion Error: Failed to removed tag from users.');
				}
			}
		}

		// Handle updating the events.
		let events = await getAllEvents();

		if (!events) {
			throw new Error('Deletion Error: Failed to get all the events.');
		}

		events = events.filter(event => {
			if (event.tags.some(tagObj => tagObj._id.toString() === tagIdToDelete.toString())) {
				event.tags = event.tags.filter(tagObj => tagObj._id.toString() !== tagIdToDelete.toString());
				return true;
			}

			return false;
		});

		if (events.length > 0){
			for (const event of events){
				const eventsResult = await updateOneEvent(event.eventId, event);
				
				if (!eventsResult){
					throw new Error('Deletion Error: Failed to removed tag from events.');
				}
			}
		}

		// Handle deleting the mailing list.
		const mailingListResult = await deleteOneMailingList(tagIdToDelete);

		if (mailingListResult.deletedCount === 0){
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
			console.error('Unexpected error deleting tag: ', error);
		}

		return false;
	} finally {
		session.endSession();
	}
}

/**
 * Updates a tag based on the current tag value.
 *
 * @param {string} currentTag - The current tag value to identify the tag for update.
 * @param {string} tagUpdateData - The new tag value to set.
 * @returns {boolean} - Returns true if the update is successful, false otherwise.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function updateTag(currentTag, tagUpdateData) {
	try{
		// Update the tag based on the current tag value
		const result = await Tag.updateOne({ tag: currentTag }, { $set: { tag: tagUpdateData }});

		if(result.n > 0){
			return true;
		} else {
			console.error('No matching tags to update.');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Update failed due to duplicate tag value.');
			return false;
		} else {
			console.error('Unexpected error updating the tag: ', error);
			throw error;
		}
	}
}

module.exports = { getOneTag, getAllTags, createOneTag, deleteOneTag, updateTag };