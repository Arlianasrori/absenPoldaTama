import express from "express"
import { errorMiddleware } from "./middleware/errorMiddleware.js"
import { authRouter } from "./routes/authRouter.js"
import { anggotaRouter } from "./routes/anggotaRouter.js"
import { adminRouter } from "./routes/adminRouter.js"
import cookieParser from "cookie-parser"
import env from "dotenv"
import cors from "cors"
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

app.use(authRouter)
app.use(anggotaRouter)
app.use(adminRouter)
app.use(errorMiddleware)
app.listen(3000,console.log("server is running on port 3000"))