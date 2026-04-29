const express = require("express");
const authUser = require("../middleware/auth.middleware");
const ConnectionRequest = require("../models/connectionRequestSchema");
const User = require("../models/userSchema");

const connectionRouter = express.Router();


const USER_SAFE_DATA="firstName  lastName gender about skills profileUrl"

//get all the request recieved
connectionRouter.get('/requests/received',authUser, async(req, res) =>{
    try{
        const loggedInUser = req.user;
        const receivedRequests = await ConnectionRequest.find({
            receiverId : loggedInUser,
            status: 'interested'
        })

        if(receivedRequests.length === 0){
            res.status(200).json({message: "No requests "});
        }

        res.status(200).json({message: "there are list of your requests", receivedRequests});
        
    }catch(err){
        res.status(500).json({message: err.message, stack: err.stack})
    }
})


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





//get the feed 

connectionRouter.get("/feed", authUser, async(req, res) =>{
    try{
        const loggedInUser = req.user
        //feed should ignore the connections 
        //and user should not see his/her own profile in feed
        //status can be "ingnored,  interested"
        //all the user of the app


        //get all the connections 
        const getConnection = await ConnectionRequest.find({
            $or:[{senderId: loggedInUser._id},{receiverId: loggedInUser._id}],
        }).select("senderId receiverId");

        const hideUserFromFeed = new Set();
        const hideUserIdArray = getConnection.forEach((req) =>{
             hideUserFromFeed.add(req.senderId.toString()),
            hideUserFromFeed.add(req.receiverId.toString())
     } )
        console.log(hideUserFromFeed)

        const feedUser = await User.find({
            $and:[
               { _id:{ $nin : Array.from(hideUserFromFeed)}},
                {
                    _id:{$ne: loggedInUser._id}
                }
            ]


       }).select(USER_SAFE_DATA)




        res.status(200).json({feedUser})




    }catch(err){
        res.status(500).json({messsage: err.message, stack: err.stack});
    }
})






module.exports = connectionRouter;

