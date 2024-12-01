import express from "express"
import authController from "../controller/authController.js"
import { refreshAnggotaMiddleware } from "../middleware/refreshAnggotaMiddleware.js"
import { refreshAdminMiddleware } from "../middleware/refreshAdminMiddleware.js"
import { refreshAdminSatkerMiddleware } from "../middleware/refreshAdminSatkerMiddleware.js"

export const authRouter = express.Router()

authRouter.post("/auth/login",authController.login)
authRouter.post("/auth/logout",authController.logout)

authRouter.post("/auth/refresh_token_user",refreshAdminMiddleware,authController.refresh_token_admin)
authRouter.post("/auth/refresh_token_admin_satker",refreshAdminSatkerMiddleware,authController.refresh_token_admin_satker)
authRouter.post("/auth/refresh_token_anggota",refreshAnggotaMiddleware,authController.refresh_token_anggota)