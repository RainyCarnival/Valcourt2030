const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
        type: mongoose.Schema.Types.ObjectId,
        ref:'Tags',
        required: false
    }] ,
    isAdmin: {
        type:Boolean,
        default: false,
        required: false
    }
});

// Hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const hashedPassword = await  bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    }
    catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model("Users", UserSchema)
