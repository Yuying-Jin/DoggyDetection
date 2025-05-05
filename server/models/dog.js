const mongoose = require("mongoose");
const { Schema } = mongoose;

const dogSchema = new Schema(
    {
        breed: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        preference: {
            type: String,
            trim: true,
            required: true,
        },
        image: {
            url: "",

        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Dog", dogSchema);
