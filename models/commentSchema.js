
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    commentMessage:{
        type: String,
        required: true
    },
    commentLikes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    commentReplies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments' 
    }]
},{
    timestamps: true
})



const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;