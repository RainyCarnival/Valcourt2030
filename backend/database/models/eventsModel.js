const mongoose = require('mongoose');

/**
 * Represents an event in the database.
 * @typedef {Object} EventSchema
 * @property {string} title - The title of the event.
 * @property {string} description - The description of the event.
 * @property {mongoose.Types.ObjectId[]} tags - The tags associated with the event.
 * @property {string} venue - The venue of the event.
 * @property {string} address - The address of the event.
 * @property {string} date - The date of the event.
 * @property {string} url - The URL related to the event.
 */
const EventsSchema = new mongoose.Schema({
	eventId: {
		type: String,
		require: true,
		unique: true
	},
	eventStatus: {
		type: String,
		require: true,
	},
	title: {
		type: String,
		require: false,
	},
	description: {
		type: String,
		require: false,
	},
	tags: [{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Tags',
		required: false
	}],
	startDate: {
		type: String,
		require: false,
	},
	endDate: {
		type: String,
		require: false,
	},
	originUrl: {
		type: String,
		require: true
	}
});

module.exports = mongoose.model('Events', EventsSchema);