import { db } from "../config/prismaClient.js";
import adminvalidation from "../validation/adminvalidation.js";
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";
import { format } from 'date-fns';
import { searchAbsen as searchAbsenUtils } from "../utils/searchAbsen.js";
import { generatePDFAbsen } from "../utils/convertToPdfAbsen.js";
import { readPdf } from "../utils/readPdf.js";
import { generateId } from "../utils/generateId.js";
import { keteranganAbsenList } from "../utils/keteranganAbsenList.js";

const findAdmin = async (req,res,next) => {
    try {
        const id = req.admin.id

        const findAdmin = await db.admin.findFirst({
            where : {
                id : id
            },
            select : {
                id : true,
                nama : true,
                nirp : true,
                satker : true
            }
        })

        res.status(200).json({
            msg : "success",
            data : findAdmin
        })

    } catch (error) {
        next(error)
    }
}

// admin satker
const addAdminSatker = async (req,res,next) => {
    try {
        let data = req.body
        data = await validate(adminvalidation.addAdminSatker,data)
        data.id = generateId()

        const findAdminSatkerBynirp = await db.admin_satker.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAdminSatkerBynirp) {
            throw new responseError(400,"nirp telah ditambahkan")
        }

        const addAdminSatker = await db.admin_satker.create({
            data : data
        })
        
        return res.status(200).json({
            msg : "success",
            data : addAdminSatker
        })
    } catch (error) {
        next(error)
    }
}

const updateAdminSatker = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        let data = req.body
        data = await validate(adminvalidation.updateAdminSatker,data)

        const findAdminSatkerById = await db.admin_satker.findUnique({
            where : {
                id : id
            }
        })

        if (!findAdminSatkerById) {
            throw new responseError(404,"admin satker tidak ditemukan")
        }

        if (data.nirp) {
            const findAdminSatkerBynirp = await db.admin_satker.findFirst({
                where : {
                    AND : [
                        {
                            nirp : {
                                equals : data.nirp
                            }
                        },
                        {
                            nirp : {
                                not : findAdminSatkerById.nirp
                            }
                        }
                    ]
                }
            })

            if (findAdminSatkerBynirp) {
                throw new responseError(400,"nirp sudah digunakan")
            }
        }

        const updateAdminSatker = await db.admin_satker.update({
            where : {
                id : id
            },
            data : data,
            select : {
                id : true,
                nirp : true,
                nama : true,
                satker : true
            }
        })

        return res.status(200).json({
            msg : "success",
            data : updateAdminSatker
        })
        
        
    } catch (error) {
        next(error)
    }
}

const deleteAdminSatker = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)

        const findAdminSatkerById = await db.admin_satker.findUnique({
            where : {
                id : id
            }
        })

        if (!findAdminSatkerById) {
            throw new responseError(404,"admin satker tidak ditemukan")
        }

        const deleteAdminSatker = await db.admin_satker.delete({
            where : {
                id : id
            },
            select : {
                id : true,
                nirp : true,
                nama : true,
                satker : true
            }
        })

        return res.status(200).json({
            msg : "success",
            data : deleteAdminSatker
        })
    } catch (error) {
        next(error)
    }
}

const getAllAdminSatker = async (req,res,next) => {
    try {
        const allAdminSatker = await db.admin_satker.findMany({     
            select : {
                id : true,
                nirp : true,
                nama : true,
                satker : true
            }      
        })

        return res.status(200).json({
            msg : "success",
            data : allAdminSatker
        })
    } catch (error) {
        next(error)
    }
}

const searchAdminSatker = async (req,res,next) => {
    try {
        let query = await validate(adminvalidation.searchAdminSatker,req.query)

        const skip = (query.page - 1) * query.limit

        const whereQuery = {
            AND : [
                {
                    nirp : {
                        equals : query.nirp,
                        mode : "insensitive"
                    }
                },
                {
                    nama : {
                        contains : query.nama,
                        mode : "insensitive"
                    }
                },
                {
                    satker : {
                        equals : query.satker,
                        mode : "insensitive"
                    }
                }
            ]
        }

        const findAdminSatker = await db.admin_satker.findMany({
            where : whereQuery,
            skip : skip,
            take : query.limit,
            select : {
                id : true,
                nama : true,
                nirp : true,
                satker : true
            }
        })

        const totalData = await db.admin_satker.count({
            where : whereQuery
        })
        console.log(query.limit);
        const totalPage = Math.ceil(totalData / query.limit)

        return res.status(200).json({
            msg : "success",
            data : {
                adminSatker : findAdminSatker,
                totalData : totalData,
                totalPage : totalPage
            }
        })
    } catch (error) {
        next(error)
    }
}

const getAdminSatkerById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)

        const findAdminSatkerById = await db.admin_satker.findUnique({
            where : {
                id : id
            },
            select : {
                id : true,
                nirp : true,
                nama : true,
                satker : true
            }
        })

        if (!findAdminSatkerById) {
            throw new responseError(404,"admin satker tidak ditemukan")
        }

        return res.status(200).json({
            msg : "success",
            data : findAdminSatkerById
        })
        
    } catch (error) {
        next(error)
    }
}

// anggota
const addAnggota = async (req,res,next) => {
    try {
        let data = req.body
        data = await validate(adminvalidation.addAnggota,data)
        data.id = generateId()

        const findAnggotaBynirp = await db.anggota.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAnggotaBynirp) {
            throw new responseError(400,"nirp telah ditambahkan")
        }

        const addAnggota = await db.anggota.create({
            data : data,
            select : {
                id : true,
                nama : true,
                nirp : true,
                pangkat : true,
                jabatan : true,
                satker : true
            }
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
            select : {
                id : true,
                nama : true,
                nirp : true,
                pangkat : true,
                jabatan : true,
                satker : true
            }
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
            },
            select : {
                id : true,
                nama : true,
                nirp : true,
                pangkat : true,
                jabatan : true,
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

const updateAnggota = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        let data = req.body
        data = await validate(adminvalidation.updateAnggota,data)

        console.log(data);
        
        
        const findAnggotaById = await db.anggota.findFirst({
            where : {
                id : id
            }
            
        })
        
        console.log(findAnggotaById);

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        // if (data.nirp) {
        //     const findAnggotaByNirp = await db.anggota.findUnique({
        //         where : {
        //             AND : [
        //                 {
        //                     NOT : {
        //                         nirp : findAnggotaById.nirp
        //                     }
        //                 },
        //                 {
        //                     nirp : data.nirp
        //                 }
        //             ]
        //         }
        //     })

        //     if (findAnggotaByNirp) {
        //         console.log("kontol");
                
        //         throw responseError(400,"nirp sudah digunakan")
        //     }
        // }

        const updateAnggota = await db.anggota.update({
            where : {
                id : id
            },
            data : data,
            select : {
                id : true,
                nama : true,
                nirp : true,
                pangkat : true,
                jabatan : true,
                satker : true
            }
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
                },
                select : {
                    id : true,
                    nama : true,
                    nirp : true,
                    pangkat : true,
                    jabatan : true,
                    satker : true
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

const searchAnggota = async (req,res,next) => {
    try {
        let query = await validate(adminvalidation.searchAnggota,req.query)

        const page = query.page ? parseInt(query.page) : 1
        const limit = query.limit ? parseInt(query.limit) : 10
        const skip = (page - 1) * limit

        const whereQuery = {
            AND : [
                {
                    nirp : {
                        equals : query.nirp,
                        mode : "insensitive"
                    }
                },
                {
                    nama : {
                        contains : query.nama,
                        mode : "insensitive"
                    }
                },
                {
                    pangkat : {
                        equals : query.pangkat,
                        mode : "insensitive"
                    }
                },
                {
                    jabatan : {
                        equals : query.jabatan,
                        mode : "insensitive"
                    }
                },
                {
                    satker : {
                        equals : query.satker,
                        mode : "insensitive"
                    }
                }
            ]
        }

        const findAnggota = await db.anggota.findMany({
            where : whereQuery,
            skip : skip,
            take : limit,
            select : {
                id : true,
                nama : true,
                nirp : true,
                pangkat : true,
                jabatan : true,
                satker : true
            }
        })

        const totalData = await db.anggota.count({
            where : whereQuery
        })

        const totalPage = Math.ceil(totalData / limit)

        return res.status(200).json({
            msg : "success",
            data : {
                anggota : findAnggota,
                totalData : findAnggota.length,
                totalPage : totalPage
            }
        })
    } catch (error) {
        next(error)
    }
}

// absen
const addAbsen = async (req,res,next) => {
    try {
        let data = await validate(adminvalidation.addAbsenvalidation,req.body)
        data.id = generateId()

        let findAnggotaById = await db.anggota.findUnique({
            where : {
                id : data.id_anggota
            }
        })

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        await db.$transaction(async (tx) => {
            console.log("ahy");

            console.log(data);
            
            const mapping = {
                id : data.id,
                id_anggota : data.id_anggota,
                dateTime : data.dateTime,
                keterangan : data.keterangan
            }

            const addAbsen = await tx.absensi.create({
                data : mapping
            })

            if (data.alasan) {
                const allowAlasan = ["I","C"]
                if (!allowAlasan.includes(data.keterangan)) {
                    throw new responseError(400,"alasan absen hanya bisa untuk izin dan cuti")
                }
                
                data.alasan.id = generateId()
                data.alasan.id_absen = addAbsen.id
                const addAlasanAbsen = await tx.alasanAbsensi.create({
                    data : data.alasan
                })
                return res.status(200).json({
                    msg : "success",
                    data : {
                        ...addAbsen,
                        alasan : addAlasanAbsen
                    }
                })
            }else {
                return res.status(200).json({
                    msg : "success",
                    data : {
                        ...addAbsen,
                        alasan : null
                    }
                })
            }
        })
    } catch (error) {
        next(error)
    }
}

const updateAbsen = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        console.log(id);
        let data = await validate(adminvalidation.updateAbsenvalidation,req.body)

        let findAbsenById = await db.absensi.findUnique({
            where : {
                id : id
            }
        })

        if (!findAbsenById) {
            throw new responseError(404,"absen tidak ditemukan")
        }

        const updateAbsen = await db.absensi.update({
            where : {
                id : id
            },
            data : data
        })

        let updateAlasan = null
        if (data.alasan) {
            updateAlasan = await db.alasanAbsensi.update({
                where : {
                    id_absen : id
                },
                data : data.alasan
            })
        }
        return res.status(200).json({
            msg : "success",
            data : {
                ...updateAbsen,
                alasan : updateAlasan
            }
        })      
    } catch (error) {
        next(error)
    }
}


const deleteAbsen = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        
        const findAbsenById = await db.absensi.findUnique({
            where : {
                id : id
            }
        })

        if (!findAbsenById) {
            throw new responseError(404,"absen tidak ditemukan")
        }

        const deleteAbsen = await db.absensi.delete({
            where : {
                id : id
            }
        })  

        return res.status(200).json({
            msg : "success",
            data : deleteAbsen
        })
    } catch (error) {
        next(error)
    }
}

const searchAbsen = async (req,res,next) => {
    try {
        const query = req.query

        const findAbsen = await searchAbsenUtils(query)

        return res.status(200).json({
            msg : "success",
            data : findAbsen
        })
    } catch (error) {
        next(error)
    }
}

const getAllAbsenToday = async (req,res,next) => {
    try {
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

const findAbsenById = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)

        const findAbsenById = await db.absensi.findUnique({
            where : {
                id : id
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

        if (!findAbsenById) {
            throw new responseError(404,"absen tidak ditemukan")
        }

        return res.status(200).json({
            msg : "success",
            data : findAbsenById
        })
        
    } catch (error) {
        next(error)
    }
}

const convertPdfAbsen = async (req,res,next) => {
    try {
        const query = req.query

        const findAbsen = await searchAbsenUtils(query)

        const payloadPdf = {
            start : query.tanggal_mulai,
            end : query.tanggal_selesai,
            data : findAbsen.absen
        }

        const pdfUrl = await generatePDFAbsen(payloadPdf,query.isLaporan)

        return res.status(200).json({
            msg : "success",
            data : {
                pdfUrl : pdfUrl
            }
        })
    } catch (error) {
        next(error)
    }
}

const backUpAbsen = async (req,res,next) => {
    try {
        const file = req.files && req.files.file

        if (!file) {
            throw new responseError(400,"file tidak ditemukan")
        }

        if(file.mimetype !== "application/pdf") {
            throw new responseError(400,"file harus pdf")
        }

        console.log("rte");
        
        return file.mv(`./public/backup/${file.name}`,async (err) => {
            if (err) {
                return res.status(500).json({
                    msg : err
                }) 
            }
            
            const data = await readPdf(`./public/backup/${file.name}`)
    
            return res.status(200).json({
                msg : "success",
                data : data
            })
        })

    } catch (error) {   
        next(error)
    }
}

const restoreAbsen = async (req,res,next) => {
    try {
        const file = req.files && req.files.file

        if (!file) {
            throw new responseError(400,"file tidak ditemukan")
        }

        if(file.mimetype !== "application/pdf") {
            throw new responseError(400,"file harus pdf")
        }

        return file.mv(`./public/backup/${file.name}`,async (err) => {
            if (err) {
                return res.status(500).json({
                    msg : err
                })
            }

            const data = await readPdf(`./public/backup/${file.name}`)
    
            const dataForDb = []
    
            for (let i = 0; i < data.length; i++) {
                const findAnggota = await db.anggota.findFirst({
                    where : {
                        nirp : data[i].NRP
                    }
                })
    
                if (findAnggota) {
                    if(!keteranganAbsenList.includes(data[i].Keterangan)) {
                        return res.status(500).json({
                            msg : "Keterangan tidak ditemukan"
                        })
                    }
                    dataForDb.push({
                        id :  generateId(),
                        id_anggota : findAnggota.id,
                        dateTime : data[i].Tanggal,
                        keterangan : data[i].Keterangan
                    })
                }
            }
    
            await db.absensi.createMany({
                data : dataForDb
            })
    
            return res.status(200).json({
                msg : "success"
            })
        })

    } catch (error) {
        next(error)
    }
}


export default {
    findAdmin,
    // admin satker
    addAdminSatker,
    getAllAdminSatker,
    getAdminSatkerById,
    updateAdminSatker,
    deleteAdminSatker,
    searchAdminSatker,


    // anggota
    addAnggota,
    getAllAnggota,
    findAnggotaById,
    updateAnggota,
    deleteAnggota,
    searchAnggota,
    // absen
    addAbsen,
    updateAbsen,
    deleteAbsen,
    searchAbsen,
    getAllAbsenToday,
    findAbsenById,
    convertPdfAbsen,
    backUpAbsen,
    restoreAbsen
}