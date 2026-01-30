import {Subscription} from '../models/subscription.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose, { isValidObjectId } from 'mongoose';
import { subscribe } from 'diagnostics_channel';


const toggleSubcription=asyncHandler(async(req,res)=>{
   const {channelId}=req.params
   if(!(isValidObjectId(channelId))) throw new ApiError(404,'channel not found')
   if(channelId.toString()===req.user?._id.toString()) throw new ApiError(400,"cannot subcribe to yourself")
   const existedSubcriber=await Subscription.findOne({subscribers:req.user?._id,channel:channelId})
// console.log(existedSubcriber._id);

   if(existedSubcriber){
    await Subscription.findByIdAndDelete(existedSubcriber._id)
    return res.status(200).json(new ApiResponse(200,"unsubcribed"))
   }
  const subcription= Subscription.create({
    subscribers:req.user?._id,
    channel:channelId
   })
   return res.status(200).json(new ApiResponse(200,subcription,"subcribed"))
})
 const subscriberOfChannel=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    if(!isValidObjectId(channelId)) throw new ApiError(400,"inavlid channel id")
    const isChannelExist=await Subscription.find({channel:channelId})
if(!isChannelExist) throw new ApiError(404,"Channel not found")
    const options={
        page:1,
        limit:10
    }
    const subcribers= //await Subscription.aggregatePaginate(
       await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscribers",
                foreignField:"_id",
                as:"subcribers",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]

            }
        },{
            $addFields:{
                subscriber:{
                    $first:"$subcribers"
                }
            }
        },{
            $project:{
                subcribers:1,
                createdAt:1,
            }
        }
    ]) //,options)
    return res.status(200).json(new ApiResponse(200,subcribers,"subcribers fetched"))
 })
 const subscriptionOfChannel=asyncHandler(async(req,res)=>{
    const {channelId}=req.params
    if(!isValidObjectId(channelId)) throw new ApiError(400,"inavlid channel id")
        const isChannelExist=await Subscription.find({subscribers:channelId})
    if(!isChannelExist) throw new ApiError(404,"channel doesn't exist")
         const options={
        page:1,
        limit:10
    }
        const subscription=//await Subscription.aggregatePaginate(
        await Subscription.aggregate([
            {
                $match:{
                    subscribers:new mongoose.Types.ObjectId(channelId)
                }
            },{
               $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"subscribedTo",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            fullName:1,
                            avatar:1
                        }
                    }
                ]
               } 
            },{
                $addFields:{
                    subcribedTo:{
                        $first:"$subscribedTo"
                    }
                }
            },{
                $project:{
                    subcribedTo:1,
                    createdAt:1
                }
            },{
                $sort:{createdAt:-1}
            }
        ])//,options)
        return res.status(200).json(new ApiResponse(200,subscription,"subscribedTo fetched"))
 })

 export {toggleSubcription,subscriberOfChannel,subscriptionOfChannel}
