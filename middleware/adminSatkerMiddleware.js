import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const adminSatkerMiddleware = async (req,res,next) => {
    const token = req.cookies.access_token
    console.log("admin satker");

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    console.log(process.env.ACCESS_KEY_ADMIN_SATKER);
    
    const adminSatker = await jwt.verify(token,process.env.ACCESS_KEY_ADMIN_SATKER,(err,adminSatker) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return adminSatker
    })

    console.log(adminSatker);
    

    const findAdminSatker = await db.admin_satker.findFirst({
        where : {
            id : adminSatker.id
        }
    })

    console.log(findAdminSatker);
    

    if(!findAdminSatker) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(adminSatker.status == 401){
        return res.status(adminSatker.status).json({
            msg : adminSatker.msg
        })
    }

    req.adminSatker = findAdminSatker
    
     next()
}