const mongoose = require('mongoose');

/**
 * Mongoose schema for representing the list of tags.
 * 
 * @typedef {Object} MunicipalitySchema
 * @property {string} municipality - A municipality in Quebec linked to a user. (required)
 */
const MunicipalitySchema = new mongoose.Schema({
	municipality: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('Municipalities', MunicipalitySchema);