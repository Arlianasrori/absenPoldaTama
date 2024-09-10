import express from "express"
import { userMiddleware } from "../middleware/userMiddleware.js"
import adminController from "../controller/adminController.js"

export const adminRouter = express.Router()

adminRouter.use(userMiddleware)

adminRouter.post("/admin/anggota",adminController.addAnggota)
adminRouter.get("/admin/anggota",adminController.getAllAnggota)
adminRouter.get("/admin/anggota/:id",adminController.findAnggotaById)
adminRouter.put("/admin/anggota/:id",adminController.updateAnggota)
adminRouter.delete("/admin/anggota/:id",adminController.deleteAnggota)
adminRouter.get("/admin/absen",adminController.getAllAbsenToday)