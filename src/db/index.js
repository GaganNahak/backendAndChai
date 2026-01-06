import mongoose from "mongoose";
import { DB_NAME } from "../const.js";
// import dotenv from 'dotenv'

// dotenv.config()

// console.log(process.env.MONGODB_URI);

const connectDB=async()=>{
    try {
     const connectionInstace=   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    
     
     console.log(`\n MongoDB connected DB HOST ${connectionInstace.connection.host}`);
     
    } catch (error) {
        console.error("DB connection ERROE:",error);
        process.exit(1) 
    }
}

export default connectDB;