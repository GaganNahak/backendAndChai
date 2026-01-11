// require ('dotenv').config({path:'./env'})

import dotenv from 'dotenv'

import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path:'./env'
})
connectDB().then(()=>{
  app.listen(process.env.PORT ||80000 ,()=>{
    console.log(`App is Running on ${process.env.PORT}`);
    
  })
  
}).catch((err)=>{
  console.log("Databse Connection Error",err);
  
})


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