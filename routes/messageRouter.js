const express = require('express');
const UserMessage = require('../models/messageSchema');
const { default: mongoose } = require('mongoose');

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


messageRouter.get('/message-list/:userId',async(req, res)=>{
    const {userId} = req.params
    try{
        const chats = await UserMessage.aggregate([
            {
                $match:{
                    participants: new mongoose.Types.ObjectId(userId),
                }

            },
            {
                $sort:{
                    createdAt:-1
                }

            },
            {
                $group:{
                    _id:"$roomId",
                    lastMessage: {
                        $first: "$message",
                    },
                    senderId:{
                        $first: "$senderId"
                    },
                    participants:{
                        $first: "$participants"

                    },
                    createdAt:{
                        $first: "$createdAt"
                    }
                }
                    
            
            },

            // remove logged in user
    {
        $addFields: {

            otherUser: {
                $filter: {
                    input: "$participants",
                    as: "participant",
                    cond: {
                        $ne: [
                            "$$participant",
                            new mongoose.Types.ObjectId(userId)
                        ]
                    }
                }
            }

        }
    },

    // lookup user details
    {
        $lookup: {

            from: "users",

            localField: "otherUser",

            foreignField: "_id",

            as: "userInfo"

        }
    },

    // convert array to object
    {
        $unwind: "$userInfo"
    },

    {
        $project: {

            roomId: "$_id",

            lastMessage: 1,

            createdAt: 1,

            "userInfo.firstName": 1,

            "userInfo.profileUrl": 1,

            "userInfo._id": 1

        }
    },

              {
                $sort: {
                    createdAt: -1
                }
            }
        ])

        
        res.status(200).json({chats});

    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
})



module.exports = messageRouter;
