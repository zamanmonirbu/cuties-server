import mongoose from "mongoose";
import { postModel } from "../Models/PostModel.js";
import UserModel from '../Models/UserModels.js';

export const createPost = async (req, res) => {
    const newPost = new postModel(req.body);
    try {
        const post = await newPost.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const post=async(req,res)=>{
    const {id}=req.params;
    try {
        const post=await postModel.findById(id);
        if(post){
            res.status(200).json(post);
        }
        else{
            res.status(500).json("Post not found");
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const postUpdate=async(req,res)=>{
    const {id}=req.params;
    const {userId}=req.body;
    try {
        const post=await postModel.findById(id);
        if(post.userId==userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("Post updated");
        }
        else{
            res.status(500).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}
export const postDelete=async(req,res)=>{
    const {id}=req.params;
    const {userId}=req.body;
    try {
        const post=await postModel.findById(id);
        if(post.userId==userId){
            await post.deleteOne();
            res.status(200).json("Post Deleted");
        }
        else{
            res.status(500).json("Action forbidden");
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const postLike = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const post = await postModel.findById(id);
        if (!post.likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } });
            res.status(200).json("Liked successfully");
        } else {
            await post.updateOne({ $pull: { likes: userId } });
            res.status(200).json("Unliked successfully");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getTimelinePost = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch current user's posts
        const currentUserPosts = await postModel.find({ userId: id });

        // Fetch following users' posts using aggregation
        const followingUserPosts = await UserModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: 'posts',  // Ensure 'posts' matches the actual collection name
                    localField: 'following',
                    foreignField: 'userId',
                    as: 'followingPosts',
                },
            },
            {
                $project: {
                    followingPosts: 1,
                    _id: 0,
                },
            },
        ]);

        // Ensure followingUserPosts[0] exists and handle cases where it doesn't
        const followingPosts = followingUserPosts[0]?.followingPosts || [];

        // Combine and sort posts by creation date
        const timelinePosts = currentUserPosts.concat(...followingPosts).sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json(timelinePosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

