import express from "express"
import { adminSatkerMiddleware } from "../middleware/adminSatkerMiddleware.js";
import adminSatkerController from "../controller/adminSatkerController.js";


export const adminSatkerRouter = express.Router()

adminSatkerRouter.use(adminSatkerMiddleware)

adminSatkerRouter.get("/findAdminSatker",adminSatkerController.findAdmin)
adminSatkerRouter.patch("/updatePassword",adminSatkerController.updatePassword)

// anggota
adminSatkerRouter.post("/anggota",adminSatkerController.addAnggota)
adminSatkerRouter.get("/anggota/get/search",adminSatkerController.searchAnggota)
adminSatkerRouter.get("/anggota",adminSatkerController.getAllAnggota)
adminSatkerRouter.get("/anggota/:id",adminSatkerController.findAnggotaById)
adminSatkerRouter.get("/anggota/:id",adminSatkerController.findAnggotaById)
adminSatkerRouter.put("/anggota/nirp/:nirp",adminSatkerController.findAnggotaByNirp)
adminSatkerRouter.delete("/anggota/:id",adminSatkerController.deleteAnggota)

// absen
adminSatkerRouter.post("/absen",adminSatkerController.addAbsen)
adminSatkerRouter.post("/absen/save",adminSatkerController.saveAbsen)
adminSatkerRouter.put("/absen/:id",adminSatkerController.updateAbsen)
adminSatkerRouter.delete("/absen/:id",adminSatkerController.deleteAbsen)
adminSatkerRouter.get("/absen/get/search",adminSatkerController.searchAbsen)
adminSatkerRouter.get("/absen/get/today",adminSatkerController.getAllAbsenToday)
adminSatkerRouter.get("/absen/:id",adminSatkerController.findAbsenById)
adminSatkerRouter.get("/absen/convert/pdf",adminSatkerController.convertPdfAbsen)
adminSatkerRouter.post("/absen/backup/pdf",adminSatkerController.backUpAbsen)
adminSatkerRouter.post("/absen/restore/pdf",adminSatkerController.restoreAbsen)

// detail istansi
adminSatkerRouter.get("/detail/instansi",adminSatkerController.getDetailIstansi)