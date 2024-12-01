import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const refreshAnggotaMiddleware = async (req,res,next) => {
    const token = req.cookies.refresh_token

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const anggota = await jwt.verify(token,process.env.ACCESS_KEY_ADMIN,(err,anggota) => {
        if(err){
            return {
                status : 401,
                msg : err.message
            }
        }
        return anggota
    })

    const findAnggota = await db.anggota.findFirst({
        where : {
            id : user.id
        }
    })

    if(!findAnggota) {
        return res.status(401).json({
            msg : "unauthorized"
        })
    }

    if(anggota.status == 401){
        return res.status(anggota.status).json({
            msg : anggota.msg
        })
    }
    // console.log("hahahah");
    req.anggota = findAnggota
    
     next()
}