const mongoose= require('mongoose')

const messageSchema = new mongoose.Schema({
    roomId :{
        type:String,
        required: true,
    },
     participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
   }],
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    message:{
        type: String
    }
},{timestamps: true})

const UserMessage = mongoose.model('UserMessage', messageSchema) ;
module.exports = UserMessage;

