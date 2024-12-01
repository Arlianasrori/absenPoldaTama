import jwt from "jsonwebtoken"
import { db } from "../config/prismaClient.js"

export const anggotaMiddleware = async (req,res,next) => {
    const token = req.cookies.access_token
    console.log("anggota");

    if(!token){
        return res.status(401).json({msg : "unauthorized"})
    }
    
    const anggota = await jwt.verify(token,process.env.ACCESS_KEY_ANGGOTA,(err,anggota) => {
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
            id : anggota.id
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