import { json } from "express"



const asyncHandler=(reqHandler)=>{
     (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next)).catch((err)=>next(err))
    }
}


/*const asyncHandler=(fn)=>async ()=>{
    try {
        await fn(req,res,next)
    } catch (err) {
        res.status(err.code).json(({
            succes:false,
            message:err.message
        }))
    }
}*/