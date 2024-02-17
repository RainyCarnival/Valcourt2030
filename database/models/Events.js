const mongoose = require("mongoose");

const EventsSchema = new mongoose.Schema({
    // TODO: Figure out what fields will be needed for this schema
});

module.exports = mongoose.model("Events", EventsSchema);