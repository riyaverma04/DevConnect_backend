const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const userRouter = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');





userRouter.post('/signup',async(req, res)=>{
    try{
        const {firstName, lastName, email, password} = req.body;
        //encrypt the password before saving to database
        const hasedPassword = await bcrypt.hash(password, 10);
        console.log(hasedPassword);
        const user = new User({
            firstName,
            lastName,
            email,
            password: hasedPassword
        })
        await user.save();
        res.status(201).json({user,message:"user Created successfully"});
    }catch (err) {
  console.error(err);

  res.status(500).json({
    message: err.message,
    stack: err.stack   //  only in dev, remove in production
  });
}
})

userRouter.post('/login',async(req, res)=>{
   try{
    const {email, password} = req.body;
    //is email valid or not


    //find the user by email
   const user=await  User.findOne({email})
   if(!user){
    throw new Error("credentials are not valid");
   }
   //compare the password
   const isPasswordValid = await bcrypt.compare(password,user.password);
   if(!isPasswordValid){
    throw new Error("credentials are not valid");
   }
   //generate thee token using jwt
   const token = await user.jwtToken(user._id);
   //setting the token on cookie
   res.cookie("token", token,{expires: new Date(Date.now() + 3600000)})
    res.status(200).json({message: "login successful"});



   }catch(err){
    res.status(500).json({message: err.message,
    stack: err.stack   }) //  only in dev, remove in production   
   }
})


module.exports = userRouter;