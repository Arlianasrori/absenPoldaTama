import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

adminRouter.use(userMiddleware)

// anggota
adminRouter.post("/admin/anggota",adminController.addAnggota)
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