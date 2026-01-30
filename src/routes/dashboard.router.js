import { Router } from "express";
import  {getChannelstats,getChannelVideos} from '../controller/dashboard.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJwt)

router.route("/stats").get(getChannelstats)
router.route("/videos").get(getChannelVideos)

export default router