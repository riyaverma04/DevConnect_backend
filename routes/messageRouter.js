const express = require('express');
const UserMessage = require('../models/messageSchema');

const messageRouter= express.Router();

messageRouter.get('/messages/:roomId',async(req,res)=>{
    try{
        const {roomId }= req.params;
        const messagesFromRoomId = await UserMessage.find({roomId}).sort({ createdAt: 1 }).populate("senderId", "firstName profileUrl");
        if(!messagesFromRoomId){
            return res.status(401).json({message:"roomId didn't find"})
        }
        console.log(messagesFromRoomId);
        res.status(200).json({message: "messages fetch successfully" , messagesFromRoomId});

    }catch(err){
        res.status(500).json({message: err.message, stack: err.stack})
    }
})



module.exports = messageRouter;
