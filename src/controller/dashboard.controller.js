import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import {Subscription} from "../models/subscription.model.js"
import { Like } from "../models/like.model.js";

const getChannelstats=asyncHandler(async(req,res)=>{
    const channelId=req.user?._id
    if(!channelId) throw new ApiError(404,"channel not found")
        const totalViwesAndVideos=await Video.aggregate([
    {
        $match:{
            owner:new mongoose.Types.ObjectId(channelId)
        }
    },{
        $group:{
            _id:null,
            views:{$sum:"$views"},
            totalVideos:{$sum:1}
        }
    },{
        $project:{
            views:1,
            totalVideos:1
        }
    }
    ])
    const totalSubscribers=await Subscription.countDocuments({channel:channelId})
    const totalLike= await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"video",
                as:"videosLike"
            }
        },{
            $addFields:{ 
                likeCount:{
                    $size:"$videosLike"
                }
            }
        }
        ,{
            $group:{
                _id:null,
                totalLikes:{
                    $sum:"$likeCount"
                }
            }
        }
    ])
    // console.log(totalLike[0]);
    
    return res.status(200).json(new ApiResponse(200,{totalViwesAndVideos,totalSubscribers,totalLike},"channel dashboard fetched"))
})

const getChannelVideos=asyncHandler(async(req,res)=>{
    const {page=1,limit=1}=req.body
    const channelId=req.params
    if(!(isValidObjectId(channelId)))  throw new ApiError(404,"channel not found")
        const options={
        page:parseInt(page),
        limit:parseInt(limit)
}

const videos=await Video.aggregatePaginate(
    Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelId)
            }
        }
    ]),options
)
if(!videos.docs[0]) throw new ApiError(404,"videos not found")

    return res.status(200).json(new ApiResponse(200,videos,"videos fetched"))

})

export {getChannelstats,getChannelVideos}