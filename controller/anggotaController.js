import { db } from "../config/prismaClient.js"
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";
import absenValidation from "../validation/absenValidation.js";

const addAbsen = async (req,res,next) => {
    try {
        const id_anggota = req.anggota.id

        let data = req.body
        data = await validate(absenValidation.addAbsen,data)
        data.id_anggota = id_anggota
        data.dateTime = new Date()
        console.log(data);

        const addAbsen = await db.absensi.create({
            data : data
        })

        return res.status(200).json({
            msg : "success",
            data : addAbsen
        })
    } catch (error) {
        next(error)
    }
    
}

const getAllAbsenToday = async (req,res,next) => {
    try {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        console.log(start);
        console.log(end);
        const findAllAbsen = await db.absensi.findMany({
            where : {

                AND : [
                    {
                        dateTime : {
                            gte : start,
                        }
                    },
                    {
                        dateTime : {
                            lte : end
                        }
                    }
                ]
            },
            select : {
                id : true,
                id_anggota : true,
                dateTime : true,
                keterangan : true,
                absen : true,
                anggota : {
                    select : {
                        id : true,
                        nama : true,
                        nirp : true,
                        jabatan : true,
                        pangkat : true,
                        satker : true,
                    }
                }
            }
        })

        return res.status(200).json({
            msg : "success",
            data : findAllAbsen
        })
    } catch (error) {
        next(error)
    }
}

const findAnggota = async (req,res,next) => {
    try {
        const idAnggota = req.anggota.id
        console.log(idAnggota);
    
    const findAnggotaById = await db.anggota.findFirst({
        where : {
            id : idAnggota
        },
        select : {
            id : true,
            nama : true,
            nirp : true,
            jabatan : true,
            pangkat : true,
            satker : true
        }
    })

    if (!findAnggotaById) {
        throw new responseError(404,"anggota tidak ditemukan")
    }

    return res.status(200).json({
        msg : "success",
            data : findAnggotaById
        })
    } catch (error) {
        next(error)
    }  
}

export default {
    addAbsen,
    getAllAbsenToday,
    findAnggota
}