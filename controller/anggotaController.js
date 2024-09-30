import { db } from "../config/prismaClient.js"
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";
import absenValidation from "../validation/absenValidation.js";
import { format } from 'date-fns';

const addAbsen = async (req,res,next) => {
    try {
        const id_anggota = req.anggota.id

        let data = req.body
        data = await validate(absenValidation.addAbsen,data)
        data.id_anggota = id_anggota
        data.dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
        const id_anggota = req.anggota.id
        const now = new Date()
        const start = format(new Date(now.getFullYear(), now.getMonth(), now.getDate()), 'yyyy-MM-dd HH:mm:ss')
        const end = format(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59), 'yyyy-MM-dd HH:mm:ss')
        
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
                    },
                    {
                        id_anggota : id_anggota
                    }
                ]
            },
            select : {
                id : true,
                id_anggota : true,
                dateTime : true,
                keterangan : true,
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

const searchAbsen = async (req,res,next) => {
    try {
        const id = req.anggota.id
        let query = await validate(absenValidation.searchAbsenValidation,req.query)

        const page = query.page ? parseInt(query.page) : 1
        const limit = query.limit ? parseInt(query.limit) : 10
        const skip = (page - 1) * limit

        const findAbsen = await db.absensi.findMany({
            where : {
                AND : [
                    {
                        dateTime : {
                            gte : query.tanggal_mulai,
                        }
                    },
                    {
                        dateTime : {
                            lte : query.tanggal_selesai
                        }
                    },
                    {
                        anggota : {
                            id : {
                                equals : id
                            }
                        }
                    }
                ]
            },
            skip : skip,
            take : limit,
            select : {
                id : true,
                id_anggota : true,
                dateTime : true,
                keterangan : true,
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

        const totalData = await db.absensi.count({
            where : {
                AND : [
                    {
                        dateTime : {
                            gte : query.tanggal_mulai,
                        }
                    },
                    {
                        dateTime : {
                            lte : query.tanggal_selesai
                        }
                    },
                    {
                        anggota : {
                            id : {
                                equals : id
                            }
                        }
                    }
                ]
            }
        })

        const totalPage = Math.ceil(totalData / limit)

        return res.status(200).json({
            msg : "success",
            data : {
                absen : findAbsen,
                totalData : totalData,
                totalPage : totalPage
            }
        })
    } catch (error) {
        next(error)
    }
}

export default {
    addAbsen,
    getAllAbsenToday,
    findAnggota,
    searchAbsen
}