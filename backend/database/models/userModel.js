const mongoose = require('mongoose');

/**
 * Mongoose schema for representing users.
 * 
 * @typedef {Object} UserSchema
 * @property {string} firstName - The first name of the user (required).
 * @property {string} lastName - The last name of the user (required).
 * @property {string} email - The email of the user (required, unique).
 * @property {string} password - The password of the user (required, minlength: 8).
 * @property {string} municipality - The municipality of the user.
 * @property {mongoose.Schema.Types.ObjectId} interestedTags - A list of interested tags of the user (ref: Tags). 
 */
const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		minlength: 8,
		required: true
	},
	municipality: {
		type: String,
		required: false
	},
	interestedTags: [{
		// TODO replace type: string to Tags reference once front end is set up.
		type: String,
		// type: mongoose.Schema.Types.ObjectId,
		// ref:'Tags',
		required: false
	}] ,
	isAdmin: {
		type:Boolean,
		default: false,
		required: false
	}
});

module.exports = mongoose.model('Users', UserSchema);
