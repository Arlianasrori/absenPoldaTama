import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

adminRouter.use(adminMiddleware)

adminRouter.get("/admin",adminController.findAdmin)

// anggota
adminRouter.post("/admin/anggota",adminController.addAnggota)
adminRouter.get("/admin/anggota/get/search",adminController.searchAnggota)
adminRouter.get("/admin/anggota",adminController.getAllAnggota)
adminRouter.get("/admin/anggota/:id",adminController.findAnggotaById)
adminRouter.put("/admin/anggota/:id",adminController.updateAnggota)
adminRouter.delete("/admin/anggota/:id",adminController.deleteAnggota)

// absen
adminRouter.post("/admin/absen",adminController.addAbsen)
adminRouter.put("/admin/absen/:id",adminController.updateAbsen)
adminRouter.delete("/admin/absen/:id",adminController.deleteAbsen)
adminRouter.get("/admin/absen/get/search",adminController.searchAbsen)
adminRouter.get("/admin/absen/get/today",adminController.getAllAbsenToday)
adminRouter.get("/admin/absen/:id",adminController.findAbsenById)