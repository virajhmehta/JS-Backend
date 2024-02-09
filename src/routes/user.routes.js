import {Router} from "express"
import registerUser  from "../controllers/user.controller.js"




const router = Router()


router.route("/register").post(registerUser) // from app.js userRouter 
// we call registerUser


export default router