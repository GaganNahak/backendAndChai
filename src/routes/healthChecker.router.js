import { Router } from "express";
import checkHealth from "../controller/healthCheck.controller.js";
const router=Router()
router.route("/").get(checkHealth)

export default router