import { asyncHandler } from "../utils/asyncHandler.js";
import {Comments} from '../models/comments.model.js'
import {Video} from '../models/video.model.js'
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const getVideoComments=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {page=1,limit=10}=req.query
    // const skip=(Number(page))-1*(Number(limit))
    const options={
        page:parseInt(page),
        limit:parseInt(limit),
        sort:{createdAt:-1}
    }
    const comments=await Comments.aggregatePaginate(
        Comments.aggregate([
        {
            //check all comments docs with video and send them
            $match:{video:new mongoose.Types.ObjectId(videoId)}
        },{
            //check user id and with comment owner 
           $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id", 
            as:"owner", //Owner field
            pipeline:[
                { 
                    //send the user name or name of person who commented to Owner field
                    $project:{
                        username:1,
                        avatar:1
                    }
                }
            ]
           } 
        },{
                    $addFields:{
                        owner:{$first:"$owner"}
                    }
                },
        {
            $project:{
                content:1,
                owner:1,
                createdAt:1
            }
        }
    ]),options
    )

    return res.status(200).json(new ApiResponse(200,comments,"commente fetched"))
})


const addComment=asyncHandler(async(req,res)=>{
    //get comment content
    //check video exist or not
    //check user is logged
    //create comment obj
    // send to db
    //send res
    const {content} =req.body
    const {videoId}=req.params
    const userId=req.user?._id
    const videoExist= await Video.exists({_id:videoId})
    if(!videoExist) throw new ApiError(404,"video deosn't exist")
    
    const comment=await Comments.create({
       content:content.trim(),
       video:videoId,
       owner:userId 
    })

    const isCommentCreated=await Comments.findById(comment._id)
    if(!isCommentCreated) throw new ApiError(500,'comment not created')
    return res.status(200).json(new ApiResponse(200,isCommentCreated,"commenetd"))
    
})

const deleteComment=asyncHandler(async(req,res)=>{
//  get commentd id from req.param
//get userid
//check is comment exist
//compare uid and comment owner
//delete and send res

const {commentId}=req.params
const userId=req.user?._id

const comment=await Comments.findById(commentId)
if(!comment) throw new ApiError(404,"comment not found");
if(!(new mongoose.Types.ObjectId(userId).toString()===new mongoose.Types.ObjectId(comment.owner).toString())) throw new ApiError(403,"unauthorized for deleting")

    await Comments.findByIdAndDelete(commentId)

    return res.status(200).json(new ApiResponse(200,"comment deleted"))
 

})

const updateComments=asyncHandler(async(req,res)=>{
    //get contet from body
    //get commId from param
    //get uid  from req.user
    //is comments exist
    //compare
    //replace the Comments content with new content

    const {content}=req.body
    const {commentId}=req.params
    const userId=req.user?._id
    if(content==='') throw new ApiError(400,"comments should not empty")
const comment=await Comments.findById(commentId)
    // console.log(comment);
    
if(!comment)  throw new ApiError(404,"comment not found");
// console.log(new mongoose.Types.ObjectId(userId).toString() ,"===", new mongoose.Types.ObjectId(comment.owner).toString());

if(!(new mongoose.Types.ObjectId(userId).toString()=== new mongoose.Types.ObjectId(comment.owner).toString())) throw new ApiError(403,"unauthorized for updating")
    comment.content=content
comment.save({saveBeforeValidate:true})

 return res.status(200).json(new ApiResponse(201,"comment updated"))

})

export {getVideoComments,addComment,deleteComment,updateComments}
