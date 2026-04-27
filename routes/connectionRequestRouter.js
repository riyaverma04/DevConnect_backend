const express = require("express");
const authUser= require("../middleware/auth.middleware")
const ConnectionRequest = require("../models/connectionRequestSchema");

const connectionRouter = express.Router();


connectionRouter.post("/send/:status/:receiverId",authUser, async(req,res) =>{
    try{
        const senderId = req.user._id;
        const {receiverId, status} = req.params;
        
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