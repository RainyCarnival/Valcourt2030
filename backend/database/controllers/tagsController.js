const { default: mongoose } = require('mongoose');
const Tag = require('../models/tagsModel');

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
	const { createOneMailingList } = require('./mailingListController');
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
			console.error(error.message);
		} else {
			console.error('Unexpected error creating tag: ', error);
		}

		return false;
	} finally {
		session.endSession();
	}
}

async function deleteOneTag(tagIdToDelete){
	try {
		const result = await Tag.deleteOne({ _id: tagIdToDelete });
    
		if (result.deletedCount > 0){
			// TODO: Trigger a call to the Mailing List and Users tables to update the info accordingly
			return true;
		} else {
			console.error('No matching tags to delete.');
			return false;
		}
	} catch (error) {
		console.error('Unexpected error deleting tag: ', error);
		throw error;
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