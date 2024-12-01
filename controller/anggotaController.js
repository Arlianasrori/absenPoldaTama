import { db } from "../config/prismaClient.js"
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";
import absenValidation from "../validation/absenValidation.js";
import { format } from 'date-fns';
import { generateId } from "../utils/generateId.js";
import randomString from "randomstring";

const addAbsen = async (req,res,next) => {
    try {
        const id_anggota = req.anggota.id

        let data = req.body
        data = await validate(absenValidation.addAbsen,data)
        data.id = generateId()
        data.id_anggota = id_anggota
        data.dateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        const file = req.files && req.files.file

            const addAbsen = await db.absensi.create({
                data : {
                    id_anggota: data.id_anggota,
                    dateTime: data.dateTime,
                    keterangan: data.keterangan
                }
            })

            if (data.alasan) {
                const allowAlasan = ["I","C"]
                if (!allowAlasan.includes(data.keterangan)) return res.status(200).json({
                    msg : "alasan absen hanya bisa untuk izin dan cuti"
                })

                if(file) {
                    const fileName = `${randomString.generate({length : 6, charset : "numeric"})}-${file.name.split(" ").slice(-1)[0]}`
                    file.mv(`./public/dokumen_absen/${fileName}`,async (err) => {
                        if (err) return res.status(200).json({
                            msg : err.message
                        })
    
                        const addAlasanAbsen = await db.alasanAbsensi.create({
                            data : {
                                alasan : data.alasan,
                                id_absen : addAbsen.id,
                                file : `http://localhost:3000/dokumen_absen/${fileName}`
                            }
                        })
                        return res.status(200).json({
                            msg : "success",
                            data : {
                                ...addAbsen,
                                alasan : addAlasanAbsen
                            }
                        })
    
                    })
                }else {
                    const addAlasanAbsen = await db.alasanAbsensi.create({
                        data : {
                            alasan : data.alasan,
                            id_absen : addAbsen.id
                        }
                    })
                    return res.status(200).json({
                        msg : "success",
                        data : {
                            ...addAbsen,
                            alasan : addAlasanAbsen
                        }
                    })
                }            
            }else {
                return res.status(200).json({
                    msg : "success",
                    data : {
                        ...addAbsen,
                        alasan : null
                    }
                })
            }
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
                alasan : true,
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

const updatePassword = async (req,res,next) => {
    try {
        const password = req.body.password

        if (!password) {
            throw new responseError(400,"password tidak boleh kosong")
        }else if(typeof password !== "string") {
            throw new responseError(400,"password harus berupa text")
        }else if(password.includes(" ")) {
            throw new responseError(400,"password tidak boleh ada spasi")
        }

        await db.anggota.update({
            where : {
                id : req.anggota.id
            },
            data : {
                password : password
            }
        })

        return res.status(200).json({
            msg : "success"
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
                alasan : true,
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
    updatePassword,
    addAbsen,
    getAllAbsenToday,
    findAnggota,
    searchAbsen
}