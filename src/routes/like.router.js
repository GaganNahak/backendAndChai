import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {getLikedVideo,commentLikeToggle,tweetLikeToggle,videoLikeToggle} from '../controller/like.controller.js'

 const router=Router()
 router.use(verifyJwt)

 router.route("/toggle/v/:videoId").post(videoLikeToggle)//ok
  router.route("/toggle/c/:commentId").post(commentLikeToggle)//ok
   router.route("/toggle/t/:tweetId").post(tweetLikeToggle) //ok
    router.route("/videos").get(getLikedVideo)//ok

    export default router
