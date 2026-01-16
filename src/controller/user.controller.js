import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError }from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js'
import ApiResponse from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
const generateAccessAndRefreshToken=async function(userId){
    try {
        const user=await User.findById(userId)
     const accessToken= await  user.generateAccesToken()
     const refreshToken=  await user.generateRefreshToken()
     user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    
    
    return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,'access and refresh token error')
    }
}
const registerUser=asyncHandler(async(req,res)=>{
    // console.log("register body");
    
    // res.status(200).json({
    //     email:"gagannahak382@gmail.com",
    //     Password:"gagan@2220"
    // })
//get user data from frontend
//vlaidate
//check if usre exist already
//check for image amd avatar
//upload them to cloudinary,check uploaded on cloudinary
//make user object
//create entry on db
//remove password and refres token field from response
//check is user cretaed
//return response
const{fullName,username,email,password}=req.body //getting user information
console.log("email",email);
//validating

if([fullName,email,password].some((field)=>field?.trim()==='')){
    throw new ApiError(400,'All fields are required')
}
console.log(fullName,username,email,password);
if(!email.includes('@')){
  throw new ApiError(400,'Invalid email')  
}
const existedUser= await User.findOne({$or:[{username},{email}]})
if(existedUser) throw new ApiError(409,'user already exist with these credentials')
    //check avatr and image
//we take index 0 cause avatra gives us a array and the first index is the path
const avatarLocalPath=req.files?.avatar[0]?.path
const coverImageLocalPath=req.files?.coverImage[0]?.path
if(!avatarLocalPath) throw new ApiError(400,"avatar is required")

    //upload to cloudinary
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)
    //check avtar
    if(!avatar) throw new ApiError(400,"avatar is required")
//user creation and db upload
     const user=await   User.create({
            fullName,
            avatar:avatar.url,
            coverImage:coverImage?.url ,//check if coverv image exist or keep it null
            email,password,
            username:username.toLowerCase()
        })
        const isUserCreated=await User.findById(user._id).select("-password -refreshToken")
        if(!isUserCreated) throw new ApiError(500,'something went wrong in user creation')
    return res.status(201).json(new ApiResponse(200,isUserCreated,'user registred successfully'))


})
// login user

const loginUser=asyncHandler(async  (req,res) => {
    //get user from data
    //email or username
    //finf user
    //password check
    //generate refresh token and acces token
    console.log(req.body);
    
    const{username,email,password}=req.body
    console.log(email);
    
    if(!email && !username) throw new ApiError(404,'username or email required')
 const user= await  User.findOne({$or:[{username},{email}]})
if(!user) throw new ApiError(404,'user not found')
   const isPasswordValid=await user.isPasswordCorrect(password)
if(!isPasswordValid) throw new ApiError(401,'incorrect password')
const{refreshToken,accessToken}=await generateAccessAndRefreshToken(user._id)
// console.log(refreshToken);

const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

return res.status(200).cookie("accessToken",accessToken,{httpOnly:true,secure:true}).cookie("refreshToken",refreshToken,{httpOnly:true,secure:true}).json(
    new ApiResponse(200,{
        user:loggedInUser,accessToken,refreshToken
    },"user logged in..")
)
    
})

const logOut=asyncHandler(async(req,res)=>{
User.findOneAndUpdate(req.user._id,{
    $set:{
        refreshToken:undefined
    }
    },{
        new:true
    }
)

return res.status(200).clearCookie("accessToken",{httpOnly:true,secure:true}).clearCookie("refreshToken",{httpOnly:true,secure:true}).json(
    new ApiResponse(200,{
      
    },"user logged out.."))
})

const generateNewAccesToken=asyncHandler(async(req,res)=>{
    try {
        const incomingRefreshToken=req.cookies?.refreshToken || req.body.refreshToken
        if(!incomingRefreshToken) throw new ApiError(401,"Absence of refresh token")
            const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRETE)
    
            const user=await User.findById(decodedToken._id)
         if(!user) throw new ApiError(401,"refresh token not found")
            
         if(incomingRefreshToken!==user.refreshToken) throw new ApiError(401,'expired or invalid refresh token')
           const{newRefreshToken,accessToken}=await generateAccessAndRefreshToken(user._id)
        return res.status(201).cookie("newRefreshToken",newRefreshToken,{httpOnly:true,secure:true}).cookie("accessToken",accessToken,{httpOnly:true,secure:true})
        .json(
            new ApiResponse(200,{
                refreshToken:newRefreshToken,
                accessToken
            },"access token refreshed")
        )
    } catch (error) {
        throw new ApiError(401,'inavalid refresh token')
    }



})

export {registerUser,loginUser,logOut,generateNewAccesToken}
