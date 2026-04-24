const express = require('express');

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

userRouter.post('/login',(req, res)=>{
    res.send("login route");
})


module.exports = userRouter;