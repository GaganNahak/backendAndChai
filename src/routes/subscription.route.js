import { Router } from "express";
import {toggleSubcription,subscriberOfChannel,subscriptionOfChannel} from '../controller/subcription.controller.js'
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router=Router()
router.use(verifyJwt)

router.route('/c/:channelId').get(subscriptionOfChannel).post(toggleSubcription)
router.route('/u/:channelId').get(subscriberOfChannel)

export default router
 //all are ok
 