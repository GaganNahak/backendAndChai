import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from 'fs'
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRETE
    })

    const uploadOnCloudinary=async(localpath)=>{
        try {
            if(!localpath) return null
            //iploader
          const response=  await cloudinary.uploader.upload(localpath,{
                resource_type:"auto"
            })
            console.log("file uploaded on cloudinary");
            console.log(response.url);
            fs.unlinkSync(localpath)
            return response
            
            
        } catch (error) {
            fs.unlinkSync(localpath) //remove locally saved temporary file as the upload oprsn got failled
        }
    }

    export default uploadOnCloudinary;