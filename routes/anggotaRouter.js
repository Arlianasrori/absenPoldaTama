import express from "express"
import anggotaController from "../controller/anggotaController.js"
import { anggotaMiddleware } from "../middleware/anggotaMiddleware.js"

export const anggotaRouter = express.Router()

anggotaRouter.post("/anggota/absen",anggotaMiddleware,anggotaController.addAbsen)
anggotaRouter.get("/anggota/absen",anggotaMiddleware,anggotaController.getAllAbsenToday)
anggotaRouter.get("/anggota",anggotaMiddleware,anggotaController.findAnggota)