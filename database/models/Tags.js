const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Tags", TagSchema)