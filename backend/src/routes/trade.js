const express = require('express')
const router = express.Router()
const Portfolio = require("../models/Portfolio");
const Transaction = require("../models/Transaction");
const users = require("../models/users");
const authMiddleWare = require("../middleware/authMiddleware");
const getPrice = require("../util/getPrice");

router.post("/buy" , authMiddleWare , async(req,res)=>{
    const {symbol , quantity } = req.body;
    const price = await getPrice(symbol);
    const userId = req.userId;

    const numQuantity = Number(quantity)
    const numPrice = Number(price)
    const cost = numQuantity * numPrice ;

    const user = await users.findById(userId);
    if(user.balance < cost){
        return res.status(400).json({message:"Insufficient balance"});
    }

    user.balance -= cost ;
    await user.save();

    let portfolio = await Portfolio.findOne({userId});

    if(!portfolio){
        portfolio = await Portfolio.create({userId , holdings: [] })
    }

    let holding  = portfolio.holdings.find(h=> h.symbol===symbol);

    if (holding) {
    const totalCost = holding.avgPrice * holding.quantity + cost;
    const totalQty = holding.quantity + numQuantity;

    holding.quantity = totalQty;
    holding.avgPrice = totalCost / totalQty;
  } else {
    portfolio.holdings.push({ symbol, quantity:numQuantity , avgPrice: numPrice });
  }

  await portfolio.save();

  await Transaction.create({
    userId,
    symbol,
    type: "BUY",
    quantity:numQuantity,
    price:numPrice
  });

  res.json({ message: "Buy successful" });
})

router.post("/sell", authMiddleWare , async(req,res)=>{
    const {symbol , quantity } = req.body;
    const price = await getPrice(symbol);
    const userId = req.userId ;

    const numQuantity = Number(quantity)
    const numPrice = Number(price)
    const revenue = numQuantity * numPrice

    const user = await users.findById(userId)
    if(!user){
        return res.status(400).json({message:"No user found"})
    }

    const portfolio = await Portfolio.findOne({userId})

    if(!portfolio){
        return res.status(400).json({message:"No portfolio found"})
    }
    let holding = portfolio.holdings.find(h=>h.symbol===symbol)
    if(!holding){
        return res.status(400).json({message:"You don't own this coin"})
    }
    if(holding.quantity < numQuantity){
        return res.json({message:"Insufficient holdings"})
    }

    user.balance += revenue ;
    await user.save();

    holding.quantity -= numQuantity ;
    if(holding.quantity === 0){
       portfolio.holdings = portfolio.holdings.filter(h=>h.symbol !==symbol)
    } 

await portfolio.save();

await Transaction.create({
    userId,
    symbol,
    type:"SELL",
    quantity: numQuantity,
    price:numPrice
})
res.json({message:"Sell successful"});
})

module.exports = router ;
