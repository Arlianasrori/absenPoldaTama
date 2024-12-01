import cron from "node-cron"
import { db } from "../config/prismaClient.js";

export async function backup_absen () {
    cron.schedule('00 00 * * *', async () => {
        const findAllAbsen = await db.absensi.findMany({
            
        })

        await db.backup_absen.createMany({
            data : findAllAbsen,
            skipDuplicates : true
        })

        await db.absensi.deleteMany({})
    });
}