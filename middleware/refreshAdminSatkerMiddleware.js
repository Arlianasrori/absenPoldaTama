import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const refreshAdminSatkerMiddleware = async (req,res,next) => {
    const token = req.cookies.refresh_token

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const adminSatker = await jwt.verify(token,process.env.ACCESS_KEY_ADMIN,(err,adminSatker) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return adminSatker
    })

    const findAdminSatker = await db.admin_satker.findFirst({
        where : {
            id : adminSatker.id
        }
    })

    if(!findAdminSatker) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(adminSatker.status == 401){
        return res.status(401).json({
            msg : adminSatker.msg
        })
    }
    // console.log("hahahah");
    req.adminSatker = findAdminSatker
    
     next()
}