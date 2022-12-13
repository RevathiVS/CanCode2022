const { json } = require("express");
const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    userId:String,
    date:Date,
    taskId:String,
    taskTitle:String,
    taskDesc:String,
    status:String,
    priority:String,
    reminder:Date
})

module.exports = mongoose.model('tasks',userSchema);