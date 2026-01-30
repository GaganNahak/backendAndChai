import { Router } from "express";
import { loginUser, logOut, registerUser,generateNewAccesToken, upDatePassword,updateAccountDetails ,updateAvatar,updateCoverImage,getCurrentUser
    ,getChannelProfile
} 
from "../controller/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router();
router.route('/register').post(
    //here middlware added before the user route
    //upload.feilds tkawe multiple file in single field 
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    
    ,registerUser)
router.route('/login').post(loginUser)
//secured route 
router.route('/logout').post(verifyJwt,logOut)
router.route('/refresh-token').post(generateNewAccesToken)
router.route('/update-password').post(verifyJwt,upDatePassword)
router.route('/update-user').patch(verifyJwt,updateAccountDetails)
router.route('/update-avatar').patch(verifyJwt,upload.single('avatar'),updateAvatar)
router.route('/update-coverimage').patch(verifyJwt,upload.single('coverImage'),updateCoverImage)
router.route('/getuser').get(verifyJwt,getCurrentUser)
router.route('/c/:username').get(verifyJwt,getChannelProfile)
 
export default router