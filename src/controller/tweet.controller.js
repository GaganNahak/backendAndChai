import {Tweet} from '../models/tweet.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js';
import mongoose, { isValidObjectId } from 'mongoose';


const creatTweet=asyncHandler(async(req,res)=>{
    const{content}=req.body
    const ownerId=req.user?._id
    console.log(content);
    
    if([content].some((field)=>field?.trim()==="")) throw new ApiError(400,"Content shouldn't be empty")

    const tweet=await Tweet.create({
        content:content,
        owner:ownerId 
    })
    const isTweetCreated=Tweet.findById(tweet._id)
    if(!isTweetCreated) throw new ApiError(500,"something wenr wrong in creating tweet")
        return res.status(200).json(new ApiResponse(200,tweet,"tweet published"))
})

const getUserTweet=asyncHandler(async(req,res)=>{
    const {limit=10,page=1} =req.query
    const userId=req.user?._id;
    const options={
        page:parseInt(page),
        limit:parseInt(limit)
    }
    const tweets=//await Tweet.aggregatePaginate(
        await Tweet.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },
      {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {
                    $project:{
                        fullName:1,
                        username:1,
                        avatar:1
                    }
                }
            ]
        },
      }
      ,{
        $addFields:{
            owner:{$first:"$owner"}
        }
      },{
        $project:{
            content:1,
            owner:1
        }
      }
    ])
    // ,options
    // )
    return res.status(200).json(new ApiResponse(200,tweets,"tweets fetched"))
})

const deleteTweet=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    const userId=req.user?.id
    const tweet=await Tweet.findById(tweetId)
    if(!tweet) throw new ApiError(404,"tweet not found")
    if(userId.toString()!==tweet.owner.toString()) throw new ApiError(401,"unauthorized fro deleting tweet" )
        await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(new ApiResponse(200,"tweet deleted"))

})

const updateTweet =asyncHandler(async(req,res)=>{
    const {content}=req.body
    const {tweetId}=req.params
    const userId=req.user?._id

    if(!content || content.trim()==="") throw new ApiError(400,"content should not empty")
    const updatedTweet=await Tweet.findOneAndUpdate({_id:tweetId,owner:userId},{$set:{content}},{new:true})
if(!updatedTweet) throw new ApiError(401,"unauthorized for updating or tweet doesn't exist")
return res.status(200).json(new ApiResponse(200,updatedTweet,"Tweet updated"))

})

export {creatTweet,getUserTweet,deleteTweet,updateTweet}
