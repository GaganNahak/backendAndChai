import { Router } from "express";
import {creatTweet,getUserTweet,deleteTweet,updateTweet} from '../controller/tweet.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJwt)
router.route("/").post(creatTweet)
router.route("/user/:userId").get(getUserTweet)
router.route("/:tweetId").delete(deleteTweet).patch(updateTweet)
export default router 

//createtwee ok
//getUserTweet ok
//deleteTweet & updateTweet ok 