import {PlayList} from '../models/playlist.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from 'mongoose';

const createPlaylist=asyncHandler(async(req,res)=>{
    const {name,description} =req.body
    const userId=req.user?._id
    if(name.trim()==="" || description.trim()==="") throw new ApiError(400,"name or description should not be empty")
    const playlist=await PlayList.create({
        name:name.trim(),
        description:description.trim(),
        video:[],
        owner:userId
    })
    return res.status(200).json(new ApiResponse(200,playlist,"new playList created"))
})

const getUserPlayList=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!(isValidObjectId(userId))) throw new ApiError(400,"invalid user id")
        //we can do same thing in populate
        const playLists=await PlayList.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },{
                $sort:{
                    createdAt:-1
                }
            },{
                $addFields:{
                    totalVideos:{
                        $size:"$videos"
                    }
                }
            }
        ])
    if(!playLists) throw new ApiError(404,"playlist not found")
        res.status(200).json(new ApiResponse(200,playLists,"playlist fetched"))

})

const getUserPlayListById=asyncHandler(async(req,res)=>{
    const {playListId}=req.params
    if(!(isValidObjectId(playListId))) throw new ApiError(400,"playlist id invalid")
const playList=await PlayList.aggregate([
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(playListId)
                }
            },{
                $lookup:{
                    from:"videos",
                    localField:"videos",
                    foreignField:"_id",
                    as:"videos",
                }
            },{
                $project:{
                    name:1,
                    description:1,
                    videos:1,
                    owner:1
                }
            }
        ])

        return res.status(200).json(new ApiResponse(200,playList,"playlist fetched"))
})

const addVideoToPlayList=asyncHandler(async(req,res)=>{
    const {playListId,videoId}=req.params
    if(!(isValidObjectId(playListId)) || !(isValidObjectId(videoId))) throw new ApiError(400,"Invalid list or video id")
const updatedPlayList=await PlayList.findOneAndUpdate({_id:playListId,owner:req.user?._id},
    //to set array in mongoose
    {$addToSet:{
    videos:videoId
}},{new:true})
// console.log(updatedPlayList);

if(!updatedPlayList) throw new ApiError(500,'something went wrong in adding to list')
    return res.status(200).json(new ApiResponse(200,updatedPlayList,"video added"))

})

const removeVideoFromList=asyncHandler(async(req,res)=>{
    const {playListId,videoId}=req.params
    if(!(isValidObjectId(playListId)) || !(isValidObjectId(videoId))) throw new ApiError(400,"Invalid list or video id")
    const updatedPlayList=await PlayList.findOneAndUpdate({_id:playListId,owner:req.user?._id},
    //to set array in mongoose
    {$pull:{
    videos:videoId
}},{new:true})

if(!updatedPlayList) throw new ApiError(500,'something went wrong in adding to list')
    return res.status(200).json(new ApiResponse(200,updatedPlayList,"video removed"))     
})

const updatePlayList=asyncHandler(async(req,res)=>{
    const{name,description}=req.body
    const {playListId}=req.params
    if(name.trim()==="" || description.trim()==="") throw new ApiError(400,"name or description should not be empty")
const updatedPlayList=await PlayList.findOneAndUpdate({_id:playListId,owner:req.user?._id},{$set:{name:name,description:description}},{new:true})
 if(!updatedPlayList) throw new ApiError(500,'something went wrong in adding to list')
    return res.status(200).json(new ApiResponse(200,updatedPlayList,"video removed"))    
})

const deletePlayList=asyncHandler(async(req,res)=>{
    const {playListId}=req.params
    // console.log(playListId);
    
    const playList=await PlayList.find({_id:playListId})
    // console.log(playList);
    console.log(req.user?._id.toString() ,"===",playList[0].owner.toString());
    
    if(req.user?._id.toString() !==playList[0].owner.toString()) throw new ApiError(404,"Unauthorized access")
        await PlayList.findByIdAndDelete(playListId)
    return res.status(200).json(new ApiResponse(200,"list deleted"))
})

export {createPlaylist,getUserPlayList,getUserPlayListById,addVideoToPlayList,removeVideoFromList,updatePlayList,deletePlayList}
