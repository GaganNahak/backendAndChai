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

    const deleteFromCloudinary=async(fileUrl)=>{
        const part=fileUrl?.split('/upload/')[1]
        const withoutVersion=part.replace(/^v\d\//, '')
        const publicId=withoutVersion.replace(/\.[^/.]+$/, '')
        console.log(publicId);
        
        try {
            const result =await cloudinary.uploader.destroy(publicId,{
                resource_type:'video',
                invalidate:true
            })
            return result;
        } catch (error) {
            console.log(error);
            
        }


    }

    export default uploadOnCloudinary;
    export {deleteFromCloudinary}