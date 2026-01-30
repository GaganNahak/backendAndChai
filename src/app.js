import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes

import userRoute from './routes/user.router.js'
import videoRoute from './routes/video.route.js'
import commentsRoute from './routes/comments.route.js'
import likeRoute from './routes/like.router.js'
import tweetRoute from "./routes/tweet.router.js"
import subscriptionRoute from './routes/subscription.route.js'
import playListRoute from './routes/playlist.router.js'
import dashBoardRoute from './routes/dashboard.router.js'
import healthCheckRoute from './routes/healthChecker.router.js'
//routes declartion
app.use("/api/v1/users",userRoute)
app.use('/api/v1/videos',videoRoute)
app.use('/api/v1/comments',commentsRoute)
app.use('/api/v1/like',likeRoute)
app.use('/api/v1/tweet',tweetRoute)
app.use('/api/v1/subcription',subscriptionRoute)
app.use('/api/v1/playlist',playListRoute)
app.use('/api/v1/dashboard',dashBoardRoute)
app.use('/api/v1/healthcheck',healthCheckRoute)
export {app}  