const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;
const Listing = require("./listing.js");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    wishlist : [
        {
            type : Schema.Types.ObjectId,
            ref : "Listing"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);  //by default adds the hashing and salting algo

module.exports = mongoose.model("User", userSchema);