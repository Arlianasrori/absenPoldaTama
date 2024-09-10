import express from "express"
import authController from "../controller/authController.js"
import { refreshAnggotaMiddleware } from "../middleware/refreshAnggotaMiddleware.js"
import { refreshUserMiddleware } from "../middleware/refreshUserMiddleware.js"

export const authRouter = express.Router()

authRouter.post("/auth/login",authController.login)
authRouter.post("/auth/logout",authController.logout)

authRouter.post("/auth/refresh_token_user",refreshUserMiddleware,authController.refresh_token_admin)
authRouter.post("/auth/refresh_token_anggota",refreshAnggotaMiddleware,authController.refresh_token_anggota)