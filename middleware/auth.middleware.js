require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");


const authUser = async(req, res, next)=>{
    //get the token from cookie

    const token = req.cookies.token

    if(!token){
       return res.status(401).json({ message: "Unauthorized user" });
    }

    //verify the authorized user

    try{
       const decodedtoken =  jwt.verify(token,process.env.JWT_SECRET);
       const user = await User.findById(decodedtoken.userId);
       req.user = user;
        next();

    }catch(err){
        res.status(500).json({message:err.message,stack:err.stack})
    }



   




    

}

   module.exports = authUser; 