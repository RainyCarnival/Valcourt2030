const mongoose = require('mongoose');

/**
 * Mongoose schema for representing the mailing list
 * @typedef {Object} MailingListSchema
 * @property {mongoose.Schema.Types.ObjectId} tag - The tag linked to the event (required, unique, ref: Tags).
 * @property {mongoose.Schema.Types.ObjectId} users - The user interested in the tag (ref: Users).
 */
const MailingListSchema = new mongoose.Schema({
	tag: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tags',
		required: true,
		unique: true
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Users'
	}]
});

module.exports = mongoose.model('Mailing List', MailingListSchema);