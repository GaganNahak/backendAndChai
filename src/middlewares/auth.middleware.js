import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";
//this function will evalute is user logged or not
export const  verifyJwt=asyncHandler(async(req,res,next)=>{
     try {
         //we can acces cookie by cookie-parser from app.js
       const token=  req.cookies?.accesToken || /*this if client is not from browser*/req.header('Authorization')?.replace("bearer ","")
       if(!token) throw new ApiError(401,'unauthorized request')
       
       const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)
      const user=await User.findById(decodedToken._id).select("-password -refreshToken")
      if(!user) throw new ApiError(401,'invalid acces token')

        req.user=user
        next()
     } catch (error) {
        throw new ApiError(401,error?.messege ||'invalid access token')
     }

})