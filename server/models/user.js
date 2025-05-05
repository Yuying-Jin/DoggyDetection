const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 1,
            max: 50,
        },
        profile_photo: {
            public_id: "",
            url: "",
        },
        dogConfirmed: [],
        dogNotConfirmed: []
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
