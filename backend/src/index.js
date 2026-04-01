const express = require('express')
require("dotenv").config();

const connectDB = require("./db");
const authRoutes = require("./routes/auth")
const tradeRoutes = require("./routes/trade")
const portfolioRoutes =require("./routes/portfolio")
const cors =require("cors")
const marketRoutes = require("./routes/market");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173"
}))

connectDB();

app.use("/api/auth" , authRoutes)
app.use("/api/trade" , tradeRoutes)
app.use("/api/portfolio" , portfolioRoutes)
app.use("/api/market" , marketRoutes )

app.get("/api/health" , (req,res)=>{
  res.json({status:"ok"})
})

app.listen(process.env.PORT , ()=>{
  console.log("SERVER IS RUNNING");
})