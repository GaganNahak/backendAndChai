import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {createPlaylist,getUserPlayList,getUserPlayListById,addVideoToPlayList,removeVideoFromList,updatePlayList,deletePlayList} from "../controller/playlist.controller.js"
const router=Router()
router.use(verifyJwt)
router.route("/").post(createPlaylist)
router.route("/:playListId").get(getUserPlayListById).patch(updatePlayList).delete(deletePlayList)
router.route("/user/:userId").get(getUserPlayList)
router.route("/add/:videoId/:playListId").patch(addVideoToPlayList)
router.route("/remove/:videoId/:playListId").patch(removeVideoFromList)

export default router 

// all are ok