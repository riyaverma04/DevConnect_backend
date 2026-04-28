const express = require("express");
const authUser = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/userSchema");

const connectionRouter = express.Router();


//accepting or rejecting the conneciton request
connectionRouter.post('/requests/:status/:receiverId', authUser, async (req, res) =>{

    try{
        const {status, receiverId} = req.params;
        //get the logged user
        const loggedInUser = req.user;
        console.log(loggedInUser);
        //check the receiverId exists or not
        const isReceiverIdExist = await User.findById({_id: receiverId});
        if(!isReceiverIdExist){
            throw new Error("User does not exist")
        }

        //check the status get from params only should be accepted or rejected
        if(status != "accepted" && status != "rejected"){
            throw new Error("you are trying to send wrong status");
        }
        //throw error if user is trying to accept or reject the  connection request to himself
        if(loggedInUser._id.toString() === receiverId.toString()){
            throw new Error("you cannot accept or reject the connection request to yourself");
        }


        //get the connection send by the user to loggedInuser
        const requestData = await ConnectionRequest.findOne({
            senderId: receiverId,
            receiverId : loggedInUser._id.toString(),
            status: "interested"


        });

        if(!requestData){
            throw new Error("no connection request found from this user");
        }

        //change the status of connection request to accepted or rejected

        requestData.status = status;

     //save the connection request to database
        const data = await requestData.save();

        res.status(200).json({message:" you " + status + "the user's request"  , data})


    }catch(err){
       return res.status(500).json({message: err.message, stack: err.stack})
    }
})



//get all the accepted users

connectionRouter.get("/user/connections" , authUser, async( req, res) =>{
    try{
        //get the loggedInUser 
        const loggedInUser = req.user;
        //recieverId = loggedInUser or senderId = loggedInUser
        //status : accepted

        //find the all the connection with status accepted and recieverId = loggedInUser or senderId = loggedInUser
        const connectionsData = await ConnectionRequest.find({
            $or:[
                {receiverId: loggedInUser._id.toString() , status: "accepted"},
                {senderId : loggedInUser._id.toString(), status: "accepted"}
            ]
        }).populate("senderId", "firstName lastName  profileUrl , about , skills").populate("receiverId", "firstName lastName  profileUrl , about , skills");


        if(connectionsData.length === 0){
            return res.status(200).json({message: "you have no connections yet"});
        }
       
        const data = connectionsData.map((connection)=>{
            if(connection.senderId._id.toString() === loggedInUser._id.toString()){
                return connection.receiverId;
            }else{
                return connection.senderId;
            }
        })



        res.status(200).json({message: "connections found successfully", connections: data

        })
        

        

    }catch(err){
        return res.status(500).json({message: err.message , stack: err.stack});
    }
})






module.exports = connectionRouter;

