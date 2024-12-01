import express from "express"
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import { authRouter } from "./routes/authRouter.js"
import { anggotaRouter } from "./routes/anggotaRouter.js"
import { adminRouter } from "./routes/adminRouter.js"
import { adminSatkerRouter } from "./routes/adminSatkerRouter.js"
import cookieParser from "cookie-parser"
import fileUpload from "express-fileupload"

import env from "dotenv"
import cors from "cors"
import { backup_absen } from "./cron_job/backup_absen.js"
// import path from "path"
env.config()
const app = express()

app.use(express.json())
app.use(cookieParser()) 

// cors
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3001", "http://localhost:5173"],
        optionsSuccessStatus: 200,
    })
);

backup_absen()

app.use(fileUpload())
app.use(express.static("public"))
app.use(authRouter)
app.use("/anggota",anggotaRouter)
app.use("/admin",adminRouter)
app.use("/admin-satker",adminSatkerRouter)
app.use(express.static('public'));
app.use(errorMiddleware)
app.listen(3000,console.log("server is running on port 3000"))