const express = require('express');
const router = express.Router();
const EventController = require('../database/controllers/eventsController.js');

// TODO
router.post('/create-event', async(req, res) => {
	const body = req.body;

	if (body.post.post_type !== 'tribe_events'){
		res.status(400).send({message: `Bad post_type: ${body.post.post_type}`});

		return;
	}

	const eventInfo = {
		eventId: body.post_id,
		title: body.post.post_title,
		description: body.post.post_content,
		url: body.post_permalink
	};
	
	if (!eventInfo.eventId || !eventInfo.url) {
		const missingInfo = Object.keys(eventInfo).filter(key => !eventInfo[key]);

		res.status(400).send({message: `Missing required information: ${missingInfo}`});

		return;
	}

	if(body.post_meta._EventStartDateUTC){
		eventInfo.date = body.post_meta._EventStartDateUTC[0];
	}

	if(body.taxonomies.post_tag){
		eventInfo.tags = Object.keys(body.taxonomies.post_tag);
	}

	console.log('eventInfo: ', eventInfo);

	res.status(200).send(eventInfo);

	const event = await EventController.getOneEvent(eventInfo.id);

	if (!event) {
		console.log(event);
	}

	
	/*	EVENT INFO PATHING
		eventId = post_id
		title = post.post_title
		description = post.post_content
		tags = taxonomies.post_tag.getKeys()
		venue = cant use, gives ID not venue name
		address = cant use, does not provide info in sent data
		date = post_meta._EventStartDateUTC
		url = post_permalink
	*/
});

// TODO
router.patch('/update-event', async(req, res) => {
	const body = req.body;

	const eventInfo = {
		eventId: body.post_id,
		title: body.post.post_title,
		description: body.post.post_content,
		//tags: Object.keys(body.taxonomies.post_tag),
		//date: body.post_meta._EventStartDateUTC,
		url: body.post_permalink
	};

	console.log('eventInfo: ', eventInfo);
	if(!eventInfo){
		res.status(400).send('Missing information');
	}
	res.status(200).send(eventInfo);

	// const event = await EventController.getOneEvent(eventInfo.id);

});

// TODO
router.delete('/delete-event', async(req, res) => {
	const body = req.body;

	const eventInfo = {
		eventId: body.post_id,
		title: body.post.post_title,
		description: body.post.post_content,
		tags: Object.keys(body.taxonomies.post_tag),
		date: body.post_meta._EventStartDateUTC,
		url: body.post_permalink
	};

	console.log('eventInfo: ', eventInfo);
	if(!eventInfo){
		res.status(400).send('Missing information');
	}
	res.status(200).send(eventInfo);

	// const event = await EventController.getOneEvent(eventInfo.id);

});

module.exports = router;