import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const adminMiddleware = async (req,res,next) => {
    const token = req.cookies.access_token
    console.log("admin");

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }

    const user = await jwt.verify(token,process.env.ACCESS_KEY_ADMIN,(err,user) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return user
    })

    const findAdmin = await db.admin.findFirst({
        where : {
            id : user.id
        }
    })

    if(!findAdmin) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(user.status == 401){
        return res.status(user.status).json({
            msg : user.msg
        })
    }
    // console.log("hahahah");
    req.admin = findAdmin
    
     next()
}