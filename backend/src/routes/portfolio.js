const express = require('express')
const router = express.Router();
const Portfolio = require("../models/Portfolio")
const users = require("../models/users")
const authMiddleware =require("../middleware/authMiddleware");
const getPrice = require("../util/getPrice");
const Transaction = require("../models/Transaction")

router.get("/" , authMiddleware , async(req,res)=>{
    const userId = req.userId

try{
    const user = await users.findById(userId)
    const portfolio = await Portfolio.findOne({userId})
    let totalValue = user.balance ;
    let detailedHoldings = [];

    if(!portfolio){
        return res.json({
            balance: user.balance,
            totalValue: user.balance,
            holdings: []
        })
    }

    if(portfolio){
        for(let h of portfolio.holdings){
            const currentPrice = await getPrice(h.symbol)

            const value = h.quantity * currentPrice 

            totalValue += value;

            detailedHoldings.push({
                symbol: h.symbol,
                quantity: h.quantity,
                avgPrice: h.avgPrice,
                currentPrice,
                value
            })
        }
        res.json({
            balance: user.balance ,
            totalValue,
            holdings: detailedHoldings
        })
    }
}
catch(err){
    return res.status(500).json({message:"Server error"})
}
})

router.get("/history" , authMiddleware , async(req,res)=>{
    const userId = req.userId ; 
    
    const transaction = await Transaction.find({userId}).sort({createdAt : -1})
    if(!transaction){
        return res.json({message:"No transactions yet"})
    }
    
    res.json({transaction})
})

module.exports = router ;