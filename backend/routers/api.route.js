const express = require('express');
const router = express.Router();
const EventController = require('./database/controllers/eventsController.js');

// TODO
router.post('/create-event', async(req, res) => {
	const eventInfo = req.body;

	console.log('eventInfo: ', eventInfo);
	if(!eventInfo){
		res.status(400).send('Missing information');
	}
	res.status(200).send(eventInfo);

	// const event = await EventController.getOneEvent(eventInfo.id);

});

// TODO
router.post('/update-event', async(req, res) => {
	const eventInfo = req.body;

	console.log('eventInfo: ', eventInfo);
	if(!eventInfo){
		res.status(400).send('Missing information');
	}
	res.status(200).send(eventInfo);

	// const event = await EventController.getOneEvent(eventInfo.id);

});

// TODO
router.post('/delete-event', async(req, res) => {
	const eventInfo = req.body;

	console.log('eventInfo: ', eventInfo);
	if(!eventInfo){
		res.status(400).send('Missing information');
	}
	res.status(200).send(eventInfo);

	// const event = await EventController.getOneEvent(eventInfo.id);

});

module.exports = router;