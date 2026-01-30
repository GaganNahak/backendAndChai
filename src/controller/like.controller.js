import {Like} from '../models/like.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from 'mongoose';



const videoLikeToggle=asyncHandler(async(req,res)=>{
const {videoId}=req.params
const userId=req.user?._id
if(!(isValidObjectId(videoId))) throw new ApiError(404,"Video doesn't exist")

    const existLike=await Like.findOne({video:videoId,likedBy:userId})
    if(existLike){
        await Like.findOneAndDelete(existLike._id)
        return res.status(200).json(new ApiResponse(200,"unliked"))
    }
    const newLike=Like.create({
        video:videoId,
        likedBy:userId
    })
    return res.status(200).json(new ApiResponse(200,newLike,"liked"))
})

const tweetLikeToggle=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const   userId=req.user?._id
    if(!(isValidObjectId(tweetId))) throw new ApiError(404,"tweet doesn't exist")
    
    const existLike=await Like.findOne({tweet:tweetId,likedBy:userId})
    if(existLike){
        await Like.findByIdAndDelete(existLike._id)
        return res.status(200).json(new ApiResponse(200,"unliked tweet"))
    }
    const newLike=await Like.create({
        tweet:tweetId,
        likedBy:userId
    })
    return res.status(200).json(new ApiResponse(200,newLike,"tweet liked"))
    
})

const commentLikeToggle=asyncHandler(async(req,res)=>{
   const {commentId}=req.params
   const userId=req.user?._id
    if(!(isValidObjectId(commentId))) throw new ApiError(404,"comment doesn't exist")  
     
    const existLike=await Like.findOne({comment:commentId,likedBy:userId})
    if(existLike){
        await Like.findOneAndDelete({comment:commentId,likedBy:userId})
        return res.status(200).json(new ApiResponse(200,"comment unlked"))
    }

    const newLike=await Like.create({
        comment:commentId,
        likedBy:userId
    })
    return res.status(200).json(new ApiResponse(200,newLike,"comment liked"))
})

const getLikedVideo=asyncHandler(async(req,res)=>{
    const userId=req.user?._id
   const likedVideos= await Like.aggregate([
        {
           $match:{
            likedBy:new mongoose.Types.ObjectId(userId),
           } 
        }, 
        {
           $lookup:{
               from:"videos",
               localField:"video",
               foreignField:"_id",
               as:"LikedVideos" ,
               pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"channel",
                        pipeline:[
                            {
                                $project:{
                                    username:1,
                                    avatar:1,
                                }
                            }
                        ]
                    },
                }
               ]  
            }
        },{
            $project:{
                LikedVideos:1
            }
        },
        {
            //by this we will separete each liked video.cause likedVideos will return an array of videos but we will spread them in separet docs
            $unwind:"$LikedVideos"
        }
    ])
    if(!likedVideos) throw new ApiError(404,"videos fetching failed")
        return res.status(200).json(new ApiResponse(200,likedVideos,"video fetched"))
})

export {getLikedVideo,commentLikeToggle,tweetLikeToggle,videoLikeToggle}
