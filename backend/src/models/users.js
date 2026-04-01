const mongoose = require('mongoose');

const userSchema =new mongoose.Schema({
    email: {type: String, unique:true},
    password: String,
    name: String,
    balance: {type:Number , default:10000}
})

module.exports = mongoose.model("User" , userSchema);