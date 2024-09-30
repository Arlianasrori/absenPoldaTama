import express from "express"
import anggotaController from "../controller/anggotaController.js"
import { anggotaMiddleware } from "../middleware/anggotaMiddleware.js"

export const anggotaRouter = express.Router()

anggotaRouter.use(anggotaMiddleware)
anggotaRouter.get("",anggotaController.findAnggota)

// absen
anggotaRouter.post("/absen",anggotaController.addAbsen)
anggotaRouter.get("/absen",anggotaController.getAllAbsenToday)
anggotaRouter.get("/absen/get/search",anggotaController.searchAbsen)