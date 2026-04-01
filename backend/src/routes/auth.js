const express = require("express");
const router = express.Router();
const users = require("../models/users")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authMiddleware = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/signup" , async(req,res)=>{
const {email , password , name} = req.body;
const existinguser = await users.findOne({email});
if (existinguser){
    return res.status(400).json({
        message: "User already exists"
    })
}
const hashedPassword = await bcrypt.hash(password , 10);
const user = await users.create({
    email,
    password:hashedPassword,
    name
})
const token = jwt.sign({userId: user._id} , JWT_SECRET);
res.json({token});
})

router.post("/signin", async(req , res)=>{
    const{email , password} = req.body;

    const user = await users.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid Credentials"})
    }
    const valid = await bcrypt.compare(password , user.password)
    if(!valid){
        return res.status(400).json({message:"invalid credentials"})
    }
    const token = jwt.sign({userId: user._id}, JWT_SECRET);

    res.json({token});
})

router.get("/me" , authMiddleware , async(req,res)=>{
    const userId = req.userId;
    const user = await users.findById(userId)

    if(!user){
        return res.status(400).json({message:"no user found"});
    }
    res.json({
       email: user.email,
       name: user.name
    })   
})

module.exports = router ; 