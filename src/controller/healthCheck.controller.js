import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError }from '../utils/ApiError.js'
import ApiResponse from "../utils/ApiResponse.js";

const checkHealth=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,{status:"ok",timestamp:new Date.now().toISOString(),uptime:process.uptime()},"server health is good"))
})

export default checkHealth