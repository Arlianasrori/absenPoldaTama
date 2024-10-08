import express from "express"
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import { authRouter } from "./routes/authRouter.js"
import { anggotaRouter } from "./routes/anggotaRouter.js"
import { adminRouter } from "./routes/adminRouter.js"
import { adminSatkerRouter } from "./routes/adminSatkerRouter.js"
import cookieParser from "cookie-parser"
import env from "dotenv"
env.config()

const app = express()

app.use(express.json())
app.use(cookieParser()) 
app.use(authRouter)
app.use("/anggota",anggotaRouter)
app.use("/admin",adminRouter)
app.use("/admin-satker",adminSatkerRouter)
app.use(errorMiddleware)
app.listen(3000,console.log("server is running on port 3000"))