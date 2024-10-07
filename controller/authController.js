import { db } from "../config/prismaClient.js";
import { validate } from "../validation/validate.js";
import authValidation from "../validation/authValidation.js";
import jwt from "jsonwebtoken"
import responseError from "../error/responseError.js";

const login = async (req,res,next) => {
    try {
        let data = req.body
        
        data = await validate(authValidation.loginValidation,data) 
        
        // admin
        const findAdmin = await db.admin.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAdmin) {
            if (data.password == findAdmin.password) {
                const access_token = jwt.sign({id : findAdmin.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "1d"})
                const refresh_token = jwt.sign({id : findAdmin.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "10d"})
                res.cookie("access_token",access_token)
                res.cookie("refresh_token",refresh_token)

                return res.status(200).json({
                    "msg" : "success",
                    "role" : "admin",
                    "data" : {
                        access_token,
                        refresh_token
                    }
                })
            }
        }


        // anggota
        const findAnggota = await db.anggota.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAnggota) {
            if (data.password == findAnggota.password) {
                const access_token = jwt.sign({id : findAnggota.id},process.env.ACCESS_KEY_ANGGOTA,{expiresIn : "1d"})
                const refresh_token = jwt.sign({id : findAnggota.id},process.env.ACCESS_KEY_ANGGOTA,{expiresIn : "10d"})
                res.cookie("access_token",access_token)
                res.cookie("refresh_token",refresh_token)

                return res.status(200).json({
                    "msg" : "success",
                    "role" : "anggota",
                    "data" : {
                        access_token,
                        refresh_token
                    }
                })
            }
        }


        // satker
        const findAdminSatker = await db.admin_satker.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAdminSatker) {
            if (data.password == findAdminSatker.password) {
                const access_token = jwt.sign({id : findAdminSatker.id},process.env.ACCESS_KEY_ANGGOTA,{expiresIn : "1d"})
                const refresh_token = jwt.sign({id : findAdminSatker.id},process.env.ACCESS_KEY_ANGGOTA,{expiresIn : "10d"})
                res.cookie("access_token",access_token)
                res.cookie("refresh_token",refresh_token)

                return res.status(200).json({
                    "msg" : "success",
                    "role" : "admin_satker",
                    "data" : {
                        access_token,
                        refresh_token
                    }
                })
            }
        }

        throw new responseError(400,"nirp or password wrong")
    } catch (error) {
        next(error)
    }
}

const logout = async (req,res,next) => {
    try {
        res.clearCookie("acces_token", "refresh_token")
        return res.status(200).json({
            msg : "logout success"
        }) 
    } catch (error) {
        
    }
}

const refresh_token_admin = async (req,res,next) => {
    try {
        const user = req.user
        const access_token = jwt.sign({id : user.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "1d"})
        const refresh_token = jwt.sign({id : user.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "10d"})
        res.cookie("access_token",access_token)
        res.cookie("refresh_token",refresh_token)

        return res.status(200).json({
                    "msg" : "success",
                    "role" : "admin",
                    "data" : {
                        access_token,
                        refresh_token
                    }     
                })
    } catch(errr) {
        next(errr)
    }
}

const refresh_token_admin_satker = async (req,res,next) => {
    try {
        const user = req.adminSatker
        const access_token = jwt.sign({id : user.id},process.env.ACCESS_KEY_ADMIN_SATKER,{expiresIn : "1d"})
        const refresh_token = jwt.sign({id : user.id},process.env.ACCESS_KEY_ADMIN_SATKER,{expiresIn : "10d"})
        res.cookie("access_token",access_token)
        res.cookie("refresh_token",refresh_token)

        return res.status(200).json({
                    "msg" : "success",
                    "role" : "admin_satker",
                    "data" : {
                        access_token,
                        refresh_token
                    }     
                })
    } catch(errr) {
        next(errr)
    }
}


const refresh_token_anggota = async (req,res,next) => {
    try {
        const anggota = req.anggota 
        const access_token = jwt.sign({id : anggota.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "1d"})
        const refresh_token = jwt.sign({id : anggota.id},process.env.ACCESS_KEY_ADMIN,{expiresIn : "10d"})
        res.cookie("access_token",access_token)
        res.cookie("refresh_token",refresh_token)

        return res.status(200).json({
                    "msg" : "success",
                    "role" : "anggota",
                    "data" : {
                        access_token,
                        refresh_token
                    }     
                }) 
    } catch(errr) {
        next(errr)
    }
}

export default {
    login,
    logout,
    refresh_token_admin,
    refresh_token_admin_satker,
    refresh_token_anggota
}