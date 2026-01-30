import { Router } from "express";
import {getVideoComments,addComment,deleteComment,updateComments} from '../controller/comment.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJwt)
router.route("/:videoId").get(getVideoComments).post(addComment) //ok
router.route("/c/:commentId").delete(deleteComment).patch(updateComments)//ok

export default router
