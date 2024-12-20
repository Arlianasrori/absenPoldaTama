import { db } from "../config/prismaClient.js";
import adminSatkerValidaiton from "../validation/adminSatkerValidation.js";
import { validate } from "../validation/validate.js";
import responseError from "../error/responseError.js";
import { format } from 'date-fns';
import { searchAbsen as searchAbsenUtils } from "../utils/searchAbsen.js";
import { generatePDFAbsen } from "../utils/convertToPdfAbsen.js";
import { readPdf } from "../utils/readPdf.js";
import { generateId } from "../utils/generateId.js";
import { keteranganAbsenList } from "../utils/keteranganAbsenList.js";
import randomString from "randomstring";


const findAdmin = async (req,res,next) => {
    try {
        const id = req.adminSatker.id
        

        const findAdminSatker = await db.admin_satker.findFirst({
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
            data : findAdminSatker
        })

    } catch (error) {
        next(error)
    }
}


// anggota
const addAnggota = async (req,res,next) => {
    try {
        let data = req.body
        data.satker = req.adminSatker.satker
        data = await validate(adminSatkerValidaiton.addAnggota,data)
        data.id = generateId()

        const findAnggotaBynirp = await db.anggota.findFirst({
            where : {
                nirp : data.nirp
            }
        })

        if (findAnggotaBynirp) {
            throw new responseError(400,"nirp telah ditambahkan")
        }

        data.satker = req.adminSatker.satker
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

const findAnggotaByNirp = async (req,res,next) => {
    try {
        const nirp = req.params.nirp
        const satker = req.adminSatker.satker
        
        const findAnggotaByNirp = await db.anggota.findUnique({
            where : {
                nirp : nirp,
                satker : satker
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

        if (!findAnggotaByNirp) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        return res.status(200).json({
            msg : "success",
            data : findAnggotaByNirp
        })
    } catch (error) {
        next(error)
    }
}

const getAllAnggota = async (req,res,next) => {
    try {
        const allAnggota = await db.anggota.findMany({
            where : {
                satker : req.adminSatker.satker
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
                id : id,
                satker : req.adminSatker.satker
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
        data = await validate(adminSatkerValidaiton.updateAnggota,data)
        console.log(data);
        
        
        const findAnggotaById = await db.anggota.findFirst({
            where : {
                id : id,
                satker : req.adminSatker.satker
            }
        })

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

        if (data.nirp) {
            const findAnggotaByNirp = await db.anggota.findFirst({
                where : {
                    AND : [
                        {
                            nirp : {
                                equals : data.nirp
                            },
                        },
                        {
                                nirp : {
                                    not : findAnggotaById.nirp
                                }
                        }
                    ]
                }   
            })

            console.log(findAnggotaByNirp);
            

            if (findAnggotaByNirp) {
                throw new responseError(400,"nirp sudah digunakan")
            }
        }
        console.log(data);
        
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
                id : id,
                satker : req.adminSatker.satker
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

const searchAnggota = async (req,res,next) => {
    try {
        let query = await validate(adminSatkerValidaiton.searchAnggota,req.query)

        const page = query.page ? parseInt(query.page) : 1
        const limit = query.limit ? parseInt(query.limit) : 10
        const skip = (page - 1) * limit

        const whereQuery = {
            AND : [
                {
                    satker : {
                        equals : req.adminSatker.satker,
                        mode : "insensitive"
                    }
                },
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
        let data = await validate(adminSatkerValidaiton.addAbsenvalidation,req.body)
        data.id = generateId()

        let findAnggotaById = await db.anggota.findUnique({
            where : {
                id : data.id_anggota,
                satker : req.adminSatker.satker
            }
        })

        const file = req.files && req.files.file

        if (!findAnggotaById) {
            throw new responseError(404,"anggota tidak ditemukan")
        }

            const addAbsen = await tx.absensi.create({
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
                                id : generateId(),
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
                            id : generateId(),
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

const saveAbsen = async(req,res,next) => {
    try {
        const satker = req.adminSatker.satker
        const dataFromDb = await db.absensi.findMany({
            where : {
                anggota : {
                    satker : satker
                }
            }
        })

        const addtoBackup = await db.backup_absen.createMany({
            data : dataFromDb
        })

        return res.status(200).json({
            msg : "success",
            data : addtoBackup
        })

        
    } catch (error) {
        next(error)
    }
}

const updateAbsen = async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        console.log(id);
        let data = await validate(adminSatkerValidaiton.updateAbsenvalidation,req.body)

        let findAbsenById = await db.absensi.findUnique({
            where : {
                id : id,
                anggota : {
                    satker : req.adminSatker.satker
                }
            }
        })

        if (!findAbsenById) {
            throw new responseError(404,"absen tidak ditemukan")
        }

        const {alasan,...updateData} = data   

        if(Object.keys(updateData).length !== 0) {
            await db.absensi.update({
                where : {
                    id : id
                },
                data : updateData
            })
        }

        const file = req.files && req.files.file

        if (data.alasan || file) {
            const findAlasanAnsen = await db.alasanAbsensi.findUnique({
                where : {
                    id_absen : id
                }
            })

            if (!findAlasanAnsen) {
                throw new responseError(404,"alasan absen tidak ditemukan")
            }

            if (data.alasan) {
                await db.alasanAbsensi.update({
                    where : {
                        id_absen : id
                    },
                    data : {
                        alasan : data.alasan
                    }
                })
            }
            if (file) {
                const fileName = `${randomString.generate({ length: 6, charset: "numeric" })}-${file.name.split(" ").slice(-1)[0]}`;
                file.mv(`./public/dokumen_absen/${fileName}`, async (err) => {
                    if (err) {
                        return res.status(500).json({
                            msg: err.message
                        });
                    }

                    await db.alasanAbsensi.update({
                        where : {
                            id_absen : id
                        },
                        data : {
                            file: `http://localhost:3000/dokumen_absen/${fileName}`
                        }
                    });
                });
            } 
        }
        return res.status(200).json({
            msg : "success",
            data : {
                ...updateAbsen
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
                id : id,
                anggota : {
                    satker : req.adminSatker.satker
                }
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

        const findAbsen = await searchAbsenUtils(query,req.adminSatker.satker)

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
                        anggota : {
                            satker : {
                                equals : req.adminSatker.satker,
                                mode : "insensitive"
                            }
                        }
                    },
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
                id : id,
                anggota : {
                    satker : req.adminSatker.satker
                }
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

        const findAbsen = await searchAbsenUtils(query,req.adminSatker.satker)

        const payloadPdf = {
            start : query.tanggal_mulai,
            end : query.tanggal_selesai,
            data : findAbsen.absen
        }

        await generatePDFAbsen(payloadPdf,query.isLaporan)

        return res.status(200).json({
            msg : "success"
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
                msg : "success",
                data : data
            })
        })


    } catch (error) {
        console.log("p");
        
        next(error)
    }
}

const getDetailIstansi = async (req,res,next) => {
    try {
        console.log(req.adminSatker);
        
        const countInstansi = await db.$queryRaw`
        SELECT 
        (SELECT COUNT(*)::int FROM anggota where satker = ${req.adminSatker.satker}) AS jumlah_anggota,
        (SELECT COUNT(*)::int FROM absensi left join anggota on absensi.id_anggota = anggota.id where anggota.satker = ${req.adminSatker.satker}) AS jumlah_absen
        `

        return res.status(200).json({
            msg : "success",
            data : countInstansi
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

        await db.admin_satker.update({
            where : {
                id : req.adminSatker.id
            },
            data : {
                password : password
            }
        })

        return res.status(200).json({
            msg : "success",
            data : countInstansi
        })
    } catch (error) {
        next(error)
    }
}

export default {
    findAdmin,
    updatePassword,

    // anggota
    addAnggota,
    getAllAnggota,
    findAnggotaByNirp,
    findAnggotaById,
    updateAnggota,
    deleteAnggota,
    searchAnggota,
    // absen
    addAbsen,
    saveAbsen,
    updateAbsen,
    deleteAbsen,
    searchAbsen,
    getAllAbsenToday,
    findAbsenById,
    convertPdfAbsen,
    backUpAbsen,
    restoreAbsen,

    // detail istansi
    getDetailIstansi
}