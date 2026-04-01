const express = require("express")
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleware")
const getPrice = require("../util/getPrice")

router.get("/prices" , authMiddleWare , async(req,res)=>{
    try{
        const [btc, eth, sol] = await Promise.all([
        getPrice("BTC"),
        getPrice("ETH"),
        getPrice("SOL")
    ])
    res.json({
        "BTC": btc,
        "ETH": eth,
        "SOL": sol
    })
    }
    catch(err){
        return res.status(500).json({message:'unable to fetch prices'})
    }
})

module.exports = router ;