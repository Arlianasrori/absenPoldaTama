import { db } from "../config/prismaClient.js";
import { validate } from "../validation/validate.js";
import absenValidation from "../validation/absenValidation.js";

export const searchAbsen = async (query,satker) => {
    query = await validate(absenValidation.searchAbsenValidation,query)
    console.log(query)

    const whereQuery = {
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
                keterangan : {
                    equals : query.keterangan
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
                        equals : satker ? satker : query.satker,
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

    const findAbsen = await db.backup_absen.findMany({
        where : whereQuery,
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

    console.log(findAbsen);
    

    return {
        absen : findAbsen
    }
}