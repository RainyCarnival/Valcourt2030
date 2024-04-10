const Event = require('../models/eventsModel');

/**
 * Retrieves all events from the database.
 * @returns {Promise<Array<Object>>} A Promise that resolves to an array of event objects.
 * @throws {Error} If an unexpected error occurs while retrieving events.
 */
async function getAllEvents(){
	try {
		const events = await Event.find({});

		if(events.length === 0){
			console.error('No Events found.');
			return false;
		}

		return {
			status: true,
			events: events
		}
	} catch (error) {
		console.error(`An unexpected error occured retreiving the list of events: ${error}`);

		return {
			status: false,
			message: error.message
		}
	}
}

/**
 * Retrieves a single event from the database based on the provided eventId.
 * @param {string} eventId - The ID of the event to retrieve.
 * @returns {Promise<Object|boolean>} A Promise that resolves to the event object if found, or false if the event is not found.
 * @throws {Error} If an unexpected error occurs while retrieving the event.
 */
async function getOneEvent(eventId){
	try {
		const event = await Event.findOne({eventId: eventId});

		if(!event){
			console.error('Event not found.');
			return false;
		}

		return event;

	} catch (error) {
		console.error('An unexpected error occured retreiving the event: ', error);
		return false;
	}
}

/**
 * Creates a new event in the database based on the provided eventData.
 * @param {Object} eventData - The data for the event to be created.
 * @returns {Promise<Object|boolean>} A Promise that resolves to the created event object if successful, or false if creation fails.
 * @throws {Error} If an unexpected error occurs during event creation.
 */
async function createOneEvent(eventData){
	try {
		const result = await Event.create(eventData);

		if (!result) {
			throw new Error('Creation Error: Failed to create the event.');
		}

		return result;
	} catch (error) {
		if (error.message.startsWith('Creation Error')) {
			console.error(error);
		} else {
			console.error('An unexpected error occured creating the event: ', error);
		}

		return false;
	}
}

/**
 * Updates a single event in the database based on the provided eventId and eventUpdateData.
 * @param {string} eventId - The ID of the event to be updated.
 * @param {Object} eventUpdateData - The data to update the event with.
 * @returns {Promise<Array<string>|boolean>} A Promise that resolves to an array of tags of the updated event if successful, or false if update fails.
 * @throws {Error} If the event to be updated is not found, if no modifications are made, or if an unexpected error occurs during update.
 */
async function updateOneEvent(eventId, eventUpdateData) {
	try{
		const originalEvent = await Event.findOne({eventId: eventId});

		if(!originalEvent){
			throw new Error(`Document Not Found: No document found for event id ${eventId} to update.`);
		}
		
		// Check if any modifications were made by comparing keys in eventUpdateData
		const isModified = !Object.keys(eventUpdateData).every(key => {
			return JSON.stringify(eventUpdateData[key]) === JSON.stringify(originalEvent[key]);
		});

		if(!isModified){
			throw new Error('Update Error: No modifications to be made, the data is the same.');
		}

		
		// Update the event document and retrieve the updated version.
		const updatedEvent = await Event.updateOne({eventId: eventId}, {$set: eventUpdateData}, {new: true});
		
		if (updatedEvent.modifiedCount <= 0){
			throw new Error('Update Error: Failed to update the event.');
		}
		
		// Handle added tags. Return tag list for email notifications
		let allTags;

		const changedTags = eventUpdateData.tags.filter(tag => !originalEvent.tags.includes(tag));

		if (changedTags.length > 0){
			allTags = [...originalEvent.tags, ...changedTags];
		} else {
			allTags = originalEvent.tags;
		}

		return allTags;

	} catch (error) {

		if (error.message.startsWith('Document Not Found')){
			console.error(error);
		} else if (error.message.startsWith('Update Error')) {
			console.error(error);
		} else {
			console.error('An unexpected error occured when updated user data: ', error);
		}
		
		return false;
	}
}

/**
 * Deletes a single event from the database based on the provided eventId.
 * @param {string} eventId - The ID of the event to be deleted.
 * @returns {Promise<Array<string>|boolean>} A Promise that resolves to an array of tags of the deleted event if successful, or false if deletion fails.
 * @throws {Error} If the event to be deleted is not found or if an unexpected error occurs during deletion.
 */
async function deleteOneEvent(eventId){
	try {
		const event = await Event.findOne({ eventId: eventId});

		if (!event){
			throw new Error('Deletion Error: Event not found');
		}

		const result = await Event.deleteOne({ eventId: eventId });

		if (result.deletedCount <= 0){
			throw new Error('Deletion Error: Failed to delete event.');
		}
		// Return tags for email notifications
		return event.tags;
	} catch (error) {
		if(error.message.startsWith('Deletion Error')){
			console.error(error);
		} else {
			console.error('An unexpected error occured deleting the event: ', error);
		}

		return false;
	}
}

module.exports = { getAllEvents, getOneEvent, deleteOneEvent, createOneEvent, updateOneEvent};