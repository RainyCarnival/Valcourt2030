const express = require('express');
const router = express.Router();
const EventController = require('../database/controllers/eventsController.js');
const { getOneTag } = require('../database/controllers/tagsController.js');

/* 
	post_thumbnail to get the url for the featured image, otherwise the media is added into the description
	tribe_venue can be used to get new venues created and reference them using the venue ID given in the trive_events
	tribe_organizer can be used the same as the tribe_venue would be used but for organizers
*/

/**
 * Creates a new event in the database.
 * @param {Object} event - The event object containing event details.
 * @returns {Object} An object with status and message properties.
 */
async function createEvent(event){
	const result = await EventController.createOneEvent(event);

	if (!result){
		return {status: 400, message: {message: `Failed to create event: ${event.eventId}`}};
	}

	return {status: 201, message: {message: `Succesfully created event: ${event.eventId}`}};
}

/**
 * Updates an existing event in the database.
 * @param {Object} event - The event object containing event details.
 * @returns {Object} An object with status and message properties.
 */
async function updateEvent(event){
	const result = await EventController.updateOneEvent(event.eventId, event);

	if(!result){
		return {status: 400, message: {message: `Failed to update event: ${event.eventId}`}};
	}

	return {status: 200, message: {message: `Succesfully updated event: ${event.eventId}`}};
}

/**
 * Deletes an event by its ID in the database.
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Object} An object with status and message properties.
 */
async function deleteEvent(eventId){
	const result = await EventController.deleteOneEvent(eventId);

	if (!result){
		return {status: 400, message: {message: `Failed to delete event: ${eventId}`}};
	}

	return {status: 200, message: {message: `Succesfully deleted event: ${eventId}`}};
}

/**
 * Handles events based on their post status.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/event-handler', async(req, res) => {
	let result;
	const body = req.body;

	if (body.post.post_type !== 'tribe_events'){
		res.status(400).send({message: `Unsupported post type: ${body.post.post_type}`});
		return;
	}

	const eventInfo = {
		eventId: body.post_id,
		eventStatus: body.post.post_status,
		title: body.post.post_title,
		description: body.post.post_content,
		tags: [],
		originUrl: body.post_permalink,
		formUrl: body.post_meta._EventURL[0]
	};
	
	if (!eventInfo.eventId || !eventInfo.originUrl || !eventInfo.eventStatus) {
		const missingInfo = Object.keys(eventInfo).filter(key => !eventInfo[key]);
		res.status(400).send({message: `Error missing required information: ${missingInfo}`});
	}

	if(body.post_meta._EventStartDateUTC){
		eventInfo.startDate = body.post_meta._EventStartDateUTC[0];
	}

	if(body.post_meta._EventEndDateUTC){
		eventInfo.endDate = body.post_meta._EventEndDateUTC[0];
	}

	// Grabs the name of each tag in post_tag then retrieves their ObejctId from the database so that it can be referenced in the event.
	if(body.taxonomies.post_tag){
		const eventTags = Object.entries(body.taxonomies.post_tag).map(([key, value]) => value.name);


		for (const tag of eventTags){
			const tagId = await getOneTag(tag);

			if (tagId){
				eventInfo.tags.push(tagId);
			}
		}
	}

	switch (body.post.post_status) {
	case 'publish':
		if (await EventController.getOneEvent(body.post_id)){
			result = await updateEvent(eventInfo);
		} else {
			result = await createEvent(eventInfo);
		}
		
		res.status(result.status).send(result.message);
		return;
	case 'trash':
		result = await deleteEvent(eventInfo.eventId);

		res.status(result.status).send(result.message);
		return;
	default:
		res.status(400).send({message: `Unsupported post status: ${body.post.post_status}`});
		return;
	}
});

module.exports = router;