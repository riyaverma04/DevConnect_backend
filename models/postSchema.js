const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    profileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content:{
        type: String,
        required: true
    },
    photos:{
        url:{
            type: String,

        },
        public_id:{
            type: String,
        }
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,   
        ref: "Comment"
    }]
},{
    timestamps: true
})


const Post = mongoose.model("Post", postSchema);
module.exports = Post;