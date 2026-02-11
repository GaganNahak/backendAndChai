import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js"
import ApiResponse from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Video } from "../models/video.model.js";
import uploadOnCloudinary,{deleteFromCloudinary} from "../utils/cloudinary.js";

const getAllVideos=asyncHandler(async(req,res)=>{
    const {limit=10,page=1,query,sortBy,sortType}=req.query
    const filter={
        ispublished:true
    }
    if(query){
        filter.title={$regex:query,$options:"i"}
    }
    const skip=(Number(page)-1)*Number(limit)
    const sortoption={
        [sortBy]:sortType==="asc"?1:-1
    }
    const videos=await Video.find(filter).skip(skip).limit(Number(limit)).sort(sortoption)

    return res.status(200).json(new ApiResponse(200,videos,'all video fetched'))

})

const publishVideo=asyncHandler(async(req,res)=>{
    const {description,title}=req.body
    if([description,title].some((field)=>field?.trim()==='')) throw new ApiError(400,'description and title might be filled')
    const videoLocalPath=req.files?.videofile[0]?.path
 const thumbnailLocalPath=req.files?.thumbnail[0]?.path

const videfile= await uploadOnCloudinary(videoLocalPath)
const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)

 if(!videfile) throw new ApiError(400,"video not uploaded")
    const video= await Video.create({
        videofile:videfile.url,
        thumbnail:thumbnail?.url,
        title:title,
        duration:videfile.duration,
        description:description,
        owner:req.user?._id
    })

    const isVideoUploaded=await Video.findById(video._id)
    if(!video) throw new ApiError(500,"something went wrong during video upload")
        return res.status(200).json(new ApiResponse(200,isVideoUploaded,"video Uploaded"))

})

const getVideoById=asyncHandler(async(req,res)=>{
    //watch history,views and getting owner details are to be added
    const {videoId}=req.params
    
    if(!videoId) throw new ApiError(401,"cannot fing videos")
    const video=await Video.findById(videoId).populate("owner","username avatar")
if(!video)  throw new ApiError(400,"failed to get video")
    video.views+=1
await video.save()
if(req.user){
    await User.findByIdAndUpdate(req.user._id,{
        $addToSet:{
            watchHistory:videoId
        }
    },{new:true})
}
    return res.status(200).json(new ApiResponse(200,video,'video fetched..'))
})


const updateVideo=asyncHandler(async(req,res)=>{
    const{videoId}=req.params
    const{title,description}=req.body
    const thumbnailLocalPath=req.file?.path
    if(!thumbnailLocalPath) throw new ApiError(400,'thumbnail File path not available')
    const deleteThumb=await Video.findById(videoId)
    await deleteFromCloudinary(deleteThumb.thumbnail)
    const thumbnail =await uploadOnCloudinary(thumbnailLocalPath)
    if(!title &&!description)  throw new ApiError(400,'description and title might be filled')
       
        const video= await Video.findByIdAndUpdate(videoId,{
            $set:{
                title:title,
                description:description,
                thumbnail:thumbnail.url
            }
        },{
            new:true
        })

    if(!video) throw new ApiError(404,'video not updation  !!')
        return res.status(200).json(new ApiResponse(200,video,"video updated"))
})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId} =req.params
// console.log(videoId);

     const video=await Video.findById(videoId)
    //  console.log(video);
     
    if(req.user?._id.toString()!==video.owner.toString()) throw new ApiError(401,'unauthorized')
    await deleteFromCloudinary(video.videofile)
 await Video.findByIdAndDelete(videoId)
return res.status(200).json(new ApiResponse(200,"video deleted"))
})

const togglePublishStatus=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const ispublished=await Video.findById(videoId)
    // console.log(ispublished.ispublished);
    
    const video=await Video.findByIdAndUpdate(videoId,{
        $set:{
            ispublished:!(ispublished.ispublished)
        }
    },{
        new:true
    })
    if(!video) throw new ApiError(404,'video not updation  !!')
    return res.status(200).json(new ApiResponse(200,video,"video toglled"))
})


export {getAllVideos,publishVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus}
