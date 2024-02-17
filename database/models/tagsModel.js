const mongoose = require("mongoose");

/**
 * Mongoose schema for representing the list of tags.
 * 
 * @typedef {Object} TagSchema
 * @property {string} tag - A tag that is linked to an event (required).
 */
const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Tags", TagSchema)