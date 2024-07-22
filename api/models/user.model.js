import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        name: String,
        email: String,
        password: String
    },
    email: {
        type: String,
        required: true,  
    },
    }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);