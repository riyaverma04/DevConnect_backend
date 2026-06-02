
const express = require('express');
const authUser = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const Post = require('../models/postSchema');

const postsRouter = express.Router();

postsRouter.patch('/:postId/toggle-like/:userId',authUser, async(req, res)=>{
    try{
        const {postId, userId} =  req.params;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "post not found"})
        }
        const isLiked = post.likes.includes(userId);
        if(isLiked){
            post.likes.pull(userId);
            await post.save();
            return res.status(200).json({message: "post unliked"})
        }else{
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({message: "post liked"})
        }
        res.status(200).json({message: "post liked successfully"})


    }catch(err){
        res.status(500).json({message: err.message, stack:err.stack});
    }
})




postsRouter.get('/posts/:profileId',authUser,async(req, res)=>{
    try{
        const {profileId} = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skipPage =(page-1)* limit;
        const totalPosts = await Post.countDocuments({ profileId: profileId });


        const posts = (await Post.find({ profileId :profileId }).populate('profileId', 'firstName lastName profileUrl').sort({ createdAt: -1 }).skip(skipPage).limit(limit))
        res.status(200).json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      hasNextPage: page < Math.ceil(totalPosts / limit),
      hasPrevPage: page > 1,
    });

    }catch(err){
        res.status(500).json({message: err.message, stack: err.stack});
    }
})
postsRouter.post('/post',authUser,upload.single('photos'),async(req, res)=>{
    try{
        const profileId = req.user._id;
        const { content} = req.body;
        const photos = {};

        if(req.file){
            photos.url = req.file.path;
            photos.public_id = req.file.filename;
        }
        const newPost = new Post({
            profileId,
            content,
            photos
        })
        await newPost.save();
        res.status(201).json({message: "post created successfully", newPost})
    }
        

    catch(err){
        res.status(500).json({message:err.message, stack: err.stack})
    }
})

module.exports = postsRouter;