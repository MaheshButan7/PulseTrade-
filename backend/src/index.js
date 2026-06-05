const express = require('express')
require("dotenv").config();

const connectDB = require("./db");
const authRoutes = require("./routes/auth")
const tradeRoutes = require("./routes/trade")
const portfolioRoutes =require("./routes/portfolio")
const cors =require("cors")
const marketRoutes = require("./routes/market");

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost:") || origin === "https://pulse-trade-inky.vercel.app") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}))

app.use(express.json());

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