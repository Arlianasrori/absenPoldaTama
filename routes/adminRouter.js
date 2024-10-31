import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

adminRouter.use(adminMiddleware)

adminRouter.get("/findAdmin",adminController.findAdmin)
adminRouter.patch("/updatePassword",adminController.updatePassword)

// admin satker
adminRouter.post("/admin-satker",adminController.addAdminSatker)
adminRouter.get("/admin-satker",adminController.getAllAdminSatker)
adminRouter.get("/admin-satker/:id",adminController.getAdminSatkerById)
adminRouter.put("/admin-satker/:id",adminController.updateAdminSatker)
adminRouter.delete("/admin-satker/:id",adminController.deleteAdminSatker)
adminRouter.get("/admin-satker/get/search",adminController.searchAdminSatker)

// anggota
adminRouter.post("/anggota",adminController.addAnggota)
adminRouter.get("/anggota/get/search",adminController.searchAnggota)
adminRouter.get("/anggota",adminController.getAllAnggota)
adminRouter.get("/anggota/:id",adminController.findAnggotaById)
adminRouter.put("/anggota/:id",adminController.updateAnggota)
adminRouter.delete("/anggota/:id",adminController.deleteAnggota)

// absen
adminRouter.post("/absen",adminController.addAbsen)
adminRouter.put("/absen/:id",adminController.updateAbsen)
adminRouter.delete("/absen/:id",adminController.deleteAbsen)
adminRouter.get("/absen/get/search",adminController.searchAbsen)
adminRouter.get("/absen/get/today",adminController.getAllAbsenToday)
adminRouter.get("/absen/:id",adminController.findAbsenById)
adminRouter.get("/absen/convert/pdf",adminController.convertPdfAbsen)
adminRouter.post("/absen/backup/pdf",adminController.backUpAbsen)
adminRouter.post("/absen/restore/pdf",adminController.restoreAbsen)

// detail istansi
adminRouter.get("/detail/instansi",adminController.getDetailIstansi)