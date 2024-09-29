import express from "express"
import anggotaController from "../controller/anggotaController.js"
import { anggotaMiddleware } from "../middleware/anggotaMiddleware.js"

export const anggotaRouter = express.Router()

anggotaRouter.use(anggotaMiddleware)
anggotaRouter.get("/anggota",anggotaController.findAnggota)

// absen
anggotaRouter.post("/anggota/absen",anggotaController.addAbsen)
anggotaRouter.get("/anggota/absen",anggotaController.getAllAbsenToday)
anggotaRouter.get("/anggota/absen/get/search",anggotaController.searchAbsen)