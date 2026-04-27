const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type:String,
        enum:{
            values: ["pending", "accepted", "rejected","interested"],
            message: "status should be either pending, accepted, rejected or interested"
        },
       
    }
}, {timestamps: true});




const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;
