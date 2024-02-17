const mongoose = require("mongoose");

const MailingListSchema = new mongoose.Schema({
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags',
        required: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }]
});

module.exports = mongoose.model("Mailing List", MailingListSchema);