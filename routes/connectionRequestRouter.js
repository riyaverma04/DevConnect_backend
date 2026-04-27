const express = require("express");
const authUser= require("../middleware/auth.middleware")
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/userSchema");

const connectionRouter = express.Router();


connectionRouter.post("/send/:status/:receiverId",authUser, async(req,res) =>{
    try{
        const senderId = req.user._id;
        const {receiverId, status} = req.params;
        //check if the receiverId is valid or not
        const receiver = await User.findById(receiverId);
        if(!receiver){
            throw new Error("person you want to connect with is not found");
        }
            //check if the connection request is already sent or not
            const existingConnection = await ConnectionRequest.findOne({

                $or:[
                    {senderId, receiverId},
                    {senderId:receiverId, receiverId:senderId}
                ]
            });
            if(existingConnection){
                throw new Error("connection request already sent");
            }


        //check status it should be either interested or rejected
        if(status !== "interested" && status !== "rejected"){
            throw new Error("status should be either interested or rejected");
        }



        //senderId and receiverId should not be same
        if(senderId.toString() === receiverId.toString()){
            throw new Error("you cannot send connection request to yourself");
        }
        
        //send the connection request
        const connection = new ConnectionRequest({
            senderId,
            receiverId,
            status
        })
        //save the connection request to database
        await connection.save();
        res.status(201).json({message:"connection request sent successfully", connection})

    }catch(err){
        res.status(500).json({message:err.message, stack:err.stack});
    }
})










module.exports = connectionRouter;