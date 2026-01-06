// require ('dotenv').config({path:'./env'})

import dotenv from 'dotenv'

import connectDB from "./db/index.js";

dotenv.config({
    path:'./env'
})
connectDB()


/*
 //IIFE
import express from 'express'
const app=express()
 ;(async()=>{
    try {
      await mongoose.connect(`${process.env.MOGODB_URI}/${DB_NAME}`) 
      app.on("error",(error)=>{
        console.log("ERROR:",error);
      })
      app.listen(process.env.PORT,()=>{
        console.log(`App is listening in ${PORT}`);
        
      })
    } catch (error) {
        console.error("ERROR:",error);
        
    }
 })()
    */