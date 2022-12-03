const { json } = require("express");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    environment:String,
    userId:String,
    userName:String,
    currentDateTime:String
})

module.exports = mongoose.model('users',userSchema);