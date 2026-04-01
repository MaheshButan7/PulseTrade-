const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
    symbol: String,
    quantity: Number,
    avgPrice: Number
})

const portfolioSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    holdings: [holdingSchema]
})

module.exports = mongoose.model("Portfolio" , portfolioSchema);