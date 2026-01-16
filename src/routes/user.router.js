import { Router } from "express";
import { loginUser, logOut, registerUser,generateNewAccesToken } from "../controller/user.controller.js";
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

export default router