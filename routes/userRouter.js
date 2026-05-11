const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const upload = require('../middleware/upload.middleware');
const cloudinary = require('../config/cloudinaryConfig')

const userRouter = express.Router();
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const authUser = require('../middleware/auth.middleware');










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
   //generate thee token using jwt
   const token = await user.jwtToken(user._id);
   //setting the token on cookie
   res.cookie("token", token,{expires: new Date(Date.now() + 3600000)})
        
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
   const userFilteredData = {
    firstName: user.firstName,
    lastName: user.lastName,
    profileUrl: user.profileUrl,
    coverUrl: user.coverUrl,
    about: user.about,
    skills: user.skills,
    gender: user.gender,
    age: user.age

   }
    res.status(200).json({message: "login successful",user:userFilteredData});



   }catch(err){
    console.log(err)
    res.status(500).json({message: err,
    stack: err.stack   }) //  only in dev, remove in production   
   }
})




//user update route
console.log("jfhkdjfdkl")
userRouter.patch('/update', (req, res, next) => {
    console.log("➡️ Before multer");
    next();
  },upload.single('photo'),authUser,async (req, res)=>{
 try{
  //  const {userid} = req.params;
  //find the user by id from database
  console.log("inside controller")
   console.log("FILE:", req.file);
    const currentUser = req.user;
    const {firstName, lastName, age, gender, about, skills} = req.body;
 

  //update the user 
  const allowedUpdates = ['firstName', "lastName","profileUrl","coverUrl", "age","gender", "about", "skills"];
 

  const updates = Object.keys(req.body);
  const isAllowedUpdates = updates.every((key)=>allowedUpdates.includes(key));
  
    if(!isAllowedUpdates){
      res.status(400).json({
    error: "Invalid updates detected",
  });
    } 
  const user =await User.findById( currentUser._id);
  if(!user){
    return res.status(400).json({
      error: "user not found",
    });
  }

   //delete the profile pic present from cloudinary
     if (req.file) {
      if (user.profileUrl?.public_id) {
        await cloudinary.uploader.destroy(user.profileUrl.public_id);
      }

       user.profileUrl = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
  updates.forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

  //  const updatedUser = await User.findByIdAndUpdate(currentUser._id,{
  //   firstName,
  //   lastName,
  //   age,
  //   profileUrl:{
  //   url: req.file.path,
  //   public_id: req.file.filename,
  // },
  //   gender,
  //   about,
  //   skills

  //  },{new:true, runValidators: true});
  //  if(!updatedUser){
  //   throw new Error("user not found");
  //  }
  await user.save();

   res.status(200).json({message: "user updated successfully", user});

 }catch(err){
   console.log(err);
  res.status(500).json({message:err.message,stack: err.stack})
 }
})




// user delete route
userRouter.delete("/delete/", authUser, async(req, res) =>{

  try{
    //get the user from userid
    const currentUser = req.user;



    //delete the user
    const deletedUser = await User.findByIdAndDelete(currentUser._id);
    if(!deletedUser){
      throw new Error("user didn't found")
    }
    res.status(201).json({deletedUser})
  }catch(err){
    res.status(500).json({message: err.message, stack: err.stack})
  }
})


//logout user profile
userRouter.post("/logout", authUser, async(req, res)=>{
  try{
    res.clearCookie("token"); 
    res.status(200).json({message: "logout successful"});
  }catch(err){
    res.status(500).json({message: err.message, stack: err.stack})
  } 
})  





//user profile route
userRouter.get("/profile", authUser, async(req, res)=>{

  try{
    //get the userid from url
    // const {userid} = req.params;
    const currentUser = req.user;

    //find the user using userid from database
    const user = await User.findById({_id: currentUser._id});
    if(!user){
      throw new Error({message:"user not found"});
    }

    //send user 
     const userData = {
      _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    profileUrl: user.profileUrl,
    coverUrl: user.coverUrl,
    about: user.about,
    skills: user.skills,
    gender: user.gender,
    age: user.age

   }
    
    res.status(200).json({userData, message: "user found"})

  }catch(err){
    res.status(500).json({message:err.message , stack: err.stack})
  }
})


userRouter.get('/profile/:userId/view',async(req, res)=>{
  try{
    const {userId} = req.params;
    const userProfile = await User.findById({_id:userId});
    if(!userProfile){
     return res.status(400).json({message:" user not found"})
    }
     //showing the data with hashedpassword in not premitted so need to delete the password first then send it to the res but mongoose data is not a javascript object so we need to convert it to object thenonly we can delete the password from that object and send response 
     const userProfileResponse = userProfile.toObject();
     delete userProfileResponse.email
     delete userProfileResponse.password;
       
    res.status(200).json({message: "user found Successfully ",userProfile:userProfileResponse })
  }catch(err){
    console.log(err)
    res.status(500).json({messsage:err.message , stack: err.stack})
  }
  
})




module.exports = userRouter;