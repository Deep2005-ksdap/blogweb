const mongoose = require("mongoose");

const Blog = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    credits: {type: String},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisterUser',
        required: true
    }},
     { timestamps: true }
)

module.exports  = mongoose.model("Blog", Blog);