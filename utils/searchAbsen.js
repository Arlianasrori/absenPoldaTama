import { db } from "../config/prismaClient.js";
import { validate } from "../validation/validate.js";
import absenValidation from "../validation/absenValidation.js";

export const searchAbsen = async (query) => {
    query = await validate(absenValidation.searchAbsenValidation,query)

    const page = query.page ? parseInt(query.page) : 1
    const limit = query.limit ? parseInt(query.limit) : 10
    const skip = (page - 1) * limit

    console.log(query);
    

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
                        nirp : {
                            equals : query.nirp,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        nama : {
                            contains : query.nama,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        pangkat : {
                            equals : query.pangkat,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        satker : {
                            equals : query.satker,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    apel : {
                        equals : query.apel
                    }
                }
            ]
        },
        skip : skip,
        take : limit,
        orderBy : {
            dateTime : "desc"
        },
        select : {
            id : true,
            id_anggota : true,
            dateTime : true,
            keterangan : true,
            apel : true,
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
                        nirp : {
                            equals : query.nirp,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        nama : {
                            contains : query.nama,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        pangkat : {
                            equals : query.pangkat,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    anggota : {
                        satker : {
                            equals : query.satker,
                            mode : "insensitive"
                        }
                    }
                },
                {
                    apel : {
                        equals : query.apel
                    }
                }
            ]
        }
    })

    const totalPage = Math.ceil(totalData / limit)

    return {
        absen : findAbsen,
        totalData : totalData,
        totalPage : totalPage
    }
}