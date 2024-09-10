import { db } from "../config/prismaClient.js";
import adminvalidation from "../validation/adminvalidation.js";
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";

const addAnggota = async (req,res,next) => {
    try {
        let data = req.body
        data = await validate(adminvalidation.addAnggota,data)

        const findAnggotaBynirp = await db.anggota.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAnggotaBynirp) {
            throw new responseError(400,"nirp telah ditambahkan")
        }

        const addAnggota = await db.anggota.create({
            data : data
        }) 

        res.status(200).json({
            msg : "success",
            data : addAnggota
        })

    } catch (error) {
        next(error)
    }
}


const getAllAnggota = async (req,res,next) => {
    try {
        const allAnggota = await db.anggota.findMany({
        })

        return res.status(200).json({
            msg : "success",
            data : allAnggota
        }) 

    } catch (error) {
        next(error)
    }
}

const findAnggotaById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        
        const findAnggotaById = await db.anggota.findUnique({
            where : {
                id : id
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

const updateAnggota = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        let data = req.body
        data = await validate(adminvalidation.updateAnggota,data)
        
        const findAnggotaById = await db.anggota.findFirst({
            where : {
                id : id
            }
        })

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        if (data.nirp) {
            const findAnggotaByNirp = await db.anggota.findUnique({
                where : {
                    nirp : data.nirp
                }
            })

            if (findAnggotaByNirp) {
                throw responseError(400,"nirp sudah digunakan")
            }
        }

        const updateAnggota = await db.anggota.update({
            where : {
                id : id
            },
            data : data
        })
        return res.status(200).json({
            msg : "success",
            data : updateAnggota
        })
    } catch (error) {
        next(error)
    }
}

const deleteAnggota = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        
        const findAnggotaById = await db.anggota.findUnique({
            where : {
                id : id
            }
        })

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        const deleteAnggota = await db.anggota.delete(
            {
                where : {
                    id : id
                }
            }
        )
        return res.status(200).json({
            msg : "success",
            data : deleteAnggota
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
export default {
    addAnggota,
    getAllAnggota,
    findAnggotaById,
    updateAnggota,
    deleteAnggota,
    getAllAbsenToday
}