import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"


 
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,

}))

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use(express.static("public"))
app.use(cookieParser()) // we can access cookie in userController

//routes import // standard way of routing

import userRouter from './routes/user.routes.js'



// routes declaration // use is in method for the middleware
// app.use("/users", userRouter) // we will activate userRouter
app.use("/api/v1/users", userRouter) // we will activate userRouter ->> standard practise
// url will be
// http://localhost:8000/api/v1/users/register/
export { app } 