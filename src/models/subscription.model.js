import mongoose,{model, mongo, Schema} from "mongoose";
const subscriptioSchema=new Schema({
    subscribers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
     channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptioSchema)
